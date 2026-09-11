import {
  buildLearnedPath,
  distanceMeters,
  LEARNED_PATH_POINT_COUNT,
  tripsMatch,
  validateLearningTrip,
} from '../routeLearning';
import type {RoutePoint} from '../routeTypes';

function trip(offset = 0): RoutePoint[] {
  return Array.from({length: 10}, (_, index) => ({
    latitude: 23.35 + offset + index * 0.001,
    longitude: 85.30 + offset + index * 0.001,
    capturedAtMs: index * 60_000,
  }));
}

describe('route learning', () => {
  test('calculates geographic distance', () => {
    expect(distanceMeters(trip()[0], trip()[1])).toBeGreaterThan(100);
  });

  test('rejects short recordings', () => {
    expect(validateLearningTrip(trip().slice(0, 2))).toContain('at least 8');
  });

  test('matches trips sharing start and end areas', () => {
    expect(tripsMatch(trip(), trip(0.0001))).toBe(true);
    expect(tripsMatch(trip(), trip(0.02))).toBe(false);
  });

  test('combines three traces into a compact learned path', () => {
    const learned = buildLearnedPath([trip(), trip(0.0001), trip(-0.0001)]);
    expect(learned).toHaveLength(LEARNED_PATH_POINT_COUNT);
    expect(learned[0].latitude).toBeCloseTo(23.35);
  });
});
