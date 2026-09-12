const test = require('node:test');
const assert = require('node:assert/strict');
const {estimateMinutes, nextStage} = require('../alertLogic');

test('estimates minutes using speed', () => {
  const minutes = estimateMinutes({latitude: 0, longitude: 0},
    {latitude: 0, longitude: 0.01}, 10);
  assert.ok(minutes > 1.8 && minutes < 1.9);
});

test('sends each threshold at most once', () => {
  assert.equal(nextStage(7, 5.5, {alert6MinSent: false, alert3MinSent: false}), 'SIX_MINUTE');
  assert.equal(nextStage(4, 2.5, {alert6MinSent: true, alert3MinSent: false}), 'THREE_MINUTE');
  assert.equal(nextStage(2.8, 2.5, {alert6MinSent: true, alert3MinSent: true}), null);
});
