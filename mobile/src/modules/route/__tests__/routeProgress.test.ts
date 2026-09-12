import {projectPointOntoRoute} from '../routeProgress';

const point = (longitude: number, latitude = 0) => ({latitude, longitude, capturedAtMs: 0});

test('projects a location to forward route progress', () => {
  const result = projectPointOntoRoute(point(0.005), [point(0), point(0.01)]);
  expect(result.progressMeters).toBeGreaterThan(550);
  expect(result.progressMeters).toBeLessThan(565);
  expect(result.distanceFromPathMeters).toBeLessThan(1);
});
