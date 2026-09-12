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

function nextStage(previousMinutes, currentMinutes, sentStageIds, stages) {
  if (currentMinutes === null || currentMinutes < 0) return null;
  const crossed = threshold => currentMinutes <= threshold
    && (previousMinutes === null || previousMinutes > threshold);
  return [...stages]
    .filter(stage => stage.enabled !== false)
    .sort((left, right) => right.minutes - left.minutes)
    .find(stage => !sentStageIds.includes(stage.id) && crossed(stage.minutes)) || null;
}

module.exports = {distanceMeters, estimateMinutes, nextStage};
