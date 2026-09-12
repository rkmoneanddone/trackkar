const test = require('node:test');
const assert = require('node:assert/strict');
const {estimateMinutes, nextStage, projectPointOntoRoute} = require('../alertLogic');

test('estimates minutes using speed', () => {
  const minutes = estimateMinutes({latitude: 0, longitude: 0},
    {latitude: 0, longitude: 0.01}, 10);
  assert.ok(minutes > 1.8 && minutes < 1.9);
});

test('projects subscribers into an ahead-of-vehicle range', () => {
  const result = projectPointOntoRoute({latitude: 0, longitude: 0.005},
    [{latitude: 0, longitude: 0}, {latitude: 0, longitude: 0.01}]);
  assert.ok(result.progressMeters > 550 && result.progressMeters < 565);
  assert.ok(result.distanceFromPathMeters < 1);
});

test('sends each threshold at most once', () => {
  const stages = [{id: 'EARLY', minutes: 8}, {id: 'NEAR', minutes: 2}];
  assert.equal(nextStage(9, 7.5, [], stages).id, 'EARLY');
  assert.equal(nextStage(3, 1.5, ['EARLY'], stages).id, 'NEAR');
  assert.equal(nextStage(1.8, 1.5, ['EARLY', 'NEAR'], stages), null);
});
