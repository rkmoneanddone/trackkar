const EARTH_RADIUS_METERS = 6371000;

function radians(value) { return value * Math.PI / 180; }

function distanceMeters(left, right) {
  const latitudeDelta = radians(right.latitude - left.latitude);
  const longitudeDelta = radians(right.longitude - left.longitude);
  const a = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(radians(left.latitude)) * Math.cos(radians(right.latitude))
    * Math.sin(longitudeDelta / 2) ** 2;
  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(a));
}

function estimateMinutes(vehiclePoint, subscriberPoint, speed) {
  if (!Number.isFinite(speed) || speed < 1) return null;
  return distanceMeters(vehiclePoint, subscriberPoint) / speed / 60;
}

function projectPointOntoRoute(point, path) {
  if (!Array.isArray(path) || path.length < 2) return null;
  let travelled = 0;
  let best = {progressMeters: 0, distanceFromPathMeters: Number.POSITIVE_INFINITY};
  for (let index = 1; index < path.length; index += 1) {
    const start = path[index - 1]; const end = path[index];
    const latScale = 111320;
    const lngScale = latScale * Math.cos(point.latitude * Math.PI / 180);
    const ax = (start.longitude - point.longitude) * lngScale;
    const ay = (start.latitude - point.latitude) * latScale;
    const dx = (end.longitude - start.longitude) * lngScale;
    const dy = (end.latitude - start.latitude) * latScale;
    const ratio = Math.max(0, Math.min(1, -(ax * dx + ay * dy) / Math.max(1, dx * dx + dy * dy)));
    const distance = Math.hypot(ax + ratio * dx, ay + ratio * dy);
    const segmentLength = distanceMeters(start, end);
    if (distance < best.distanceFromPathMeters) best = {progressMeters: travelled + ratio * segmentLength, distanceFromPathMeters: distance};
    travelled += segmentLength;
  }
  return best;
}

function nextStage(previousMinutes, currentMinutes, sentStageIds, stages) {
  if (currentMinutes === null || currentMinutes < 0) return null;
  const crossed = threshold => currentMinutes <= threshold
    && (previousMinutes === null || previousMinutes > threshold);
  return [...stages]
    .filter(stage => stage.enabled !== false)
    .sort((left, right) => right.minutes - left.minutes)
    .find(stage => !sentStageIds.includes(stage.id) && crossed(stage.minutes)) || null;
}

module.exports = {distanceMeters, estimateMinutes, nextStage, projectPointOntoRoute};
