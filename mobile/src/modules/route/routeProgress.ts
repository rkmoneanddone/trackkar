import {distanceMeters} from './routeLearning';
import type {RoutePoint} from './routeTypes';

export function projectPointOntoRoute(point: RoutePoint, path: RoutePoint[]) {
  if (path.length < 2) throw new Error('The learned route path is unavailable.');
  let travelled = 0;
  let best = {progressMeters: 0, distanceFromPathMeters: Number.POSITIVE_INFINITY};
  for (let index = 1; index < path.length; index += 1) {
    const start = path[index - 1];
    const end = path[index];
    const latScale = 111_320;
    const lngScale = latScale * Math.cos(point.latitude * Math.PI / 180);
    const ax = (start.longitude - point.longitude) * lngScale;
    const ay = (start.latitude - point.latitude) * latScale;
    const bx = (end.longitude - point.longitude) * lngScale;
    const by = (end.latitude - point.latitude) * latScale;
    const dx = bx - ax; const dy = by - ay;
    const ratio = Math.max(0, Math.min(1, -(ax * dx + ay * dy) / Math.max(1, dx * dx + dy * dy)));
    const distance = Math.hypot(ax + ratio * dx, ay + ratio * dy);
    const segmentLength = distanceMeters(start, end);
    if (distance < best.distanceFromPathMeters) {
      best = {progressMeters: travelled + ratio * segmentLength, distanceFromPathMeters: distance};
    }
    travelled += segmentLength;
  }
  return best;
}
