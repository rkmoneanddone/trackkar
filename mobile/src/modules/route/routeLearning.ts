import type {RoutePoint} from './routeTypes';

export const REQUIRED_LEARNING_TRIPS = 3;
export const MIN_LEARNING_POINTS = 8;
export const MIN_LEARNING_DISTANCE_METERS = 250;
export const MAX_ENDPOINT_VARIANCE_METERS = 500;
export const LEARNED_PATH_POINT_COUNT = 40;

const EARTH_RADIUS_METERS = 6_371_000;

function radians(value: number) {
  return value * Math.PI / 180;
}

export function distanceMeters(left: RoutePoint, right: RoutePoint) {
  const latitudeDelta = radians(right.latitude - left.latitude);
  const longitudeDelta = radians(right.longitude - left.longitude);
  const leftLatitude = radians(left.latitude);
  const rightLatitude = radians(right.latitude);
  const haversine = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(leftLatitude) * Math.cos(rightLatitude)
    * Math.sin(longitudeDelta / 2) ** 2;
  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(haversine));
}

export function routeDistanceMeters(points: RoutePoint[]) {
  return points.slice(1).reduce(
    (total, point, index) => total + distanceMeters(points[index], point),
    0,
  );
}

export function validateLearningTrip(points: RoutePoint[]) {
  if (points.length < MIN_LEARNING_POINTS) {
    return `A completed trip needs at least ${MIN_LEARNING_POINTS} reliable GPS points.`;
  }
  if (points.some(point => !Number.isFinite(point.latitude)
    || !Number.isFinite(point.longitude)
    || point.latitude < -90 || point.latitude > 90
    || point.longitude < -180 || point.longitude > 180)) {
    return 'The recording contains an invalid GPS point.';
  }
  if (routeDistanceMeters(points) < MIN_LEARNING_DISTANCE_METERS) {
    return `The completed trip must cover at least ${MIN_LEARNING_DISTANCE_METERS} metres.`;
  }
  return null;
}

export function tripsMatch(reference: RoutePoint[], candidate: RoutePoint[]) {
  if (!reference.length || !candidate.length) return false;
  return distanceMeters(reference[0], candidate[0]) <= MAX_ENDPOINT_VARIANCE_METERS
    && distanceMeters(reference[reference.length - 1], candidate[candidate.length - 1])
      <= MAX_ENDPOINT_VARIANCE_METERS;
}

function sampleAt(points: RoutePoint[], position: number) {
  const index = position * (points.length - 1);
  const lower = Math.floor(index);
  const upper = Math.min(points.length - 1, Math.ceil(index));
  const ratio = index - lower;
  return {
    latitude: points[lower].latitude + (points[upper].latitude - points[lower].latitude) * ratio,
    longitude: points[lower].longitude + (points[upper].longitude - points[lower].longitude) * ratio,
    capturedAtMs: 0,
  } satisfies RoutePoint;
}

export function buildLearnedPath(trips: RoutePoint[][]) {
  if (trips.length !== REQUIRED_LEARNING_TRIPS) {
    throw new Error(`Exactly ${REQUIRED_LEARNING_TRIPS} matching trips are required.`);
  }
  if (trips.some(points => validateLearningTrip(points))) {
    throw new Error('Every learning trip must be valid before finalization.');
  }
  if (trips.slice(1).some(points => !tripsMatch(trips[0], points))) {
    throw new Error('The learning trips do not share matching start and end areas.');
  }

  return Array.from({length: LEARNED_PATH_POINT_COUNT}, (_, index) => {
    const position = index / (LEARNED_PATH_POINT_COUNT - 1);
    const samples = trips.map(points => sampleAt(points, position));
    return {
      latitude: samples.reduce((sum, point) => sum + point.latitude, 0) / samples.length,
      longitude: samples.reduce((sum, point) => sum + point.longitude, 0) / samples.length,
      capturedAtMs: 0,
    };
  });
}
