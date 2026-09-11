import {estimatedMinutesAway, markAlertSent, nextAlertStage} from '../alertEngine';
import type {RunAlertState} from '../routeRunTypes';

const clear: RunAlertState = {sixMinuteSent: false, threeMinuteSent: false, muted: false};

describe('per-run alert engine', () => {
  test('estimates minutes from current speed', () => {
    const eta = estimatedMinutesAway(
      {latitude: 23.35, longitude: 85.30, capturedAtMs: 0},
      {latitude: 23.36, longitude: 85.30, capturedAtMs: 0},
      10,
    );
    expect(eta).not.toBeNull();
    expect(eta!).toBeGreaterThan(1);
  });
  test('emits each threshold only when crossed', () => {
    expect(nextAlertStage(7, 5.9, clear)).toBe('SIX_MINUTE');
    const afterSix = markAlertSent(clear, 'SIX_MINUTE');
    expect(nextAlertStage(5, 2.9, afterSix)).toBe('THREE_MINUTE');
    expect(nextAlertStage(2.9, 2.5, markAlertSent(afterSix, 'THREE_MINUTE'))).toBeNull();
  });
  test('does not alert a muted subscriber', () => {
    expect(nextAlertStage(7, 5, {...clear, muted: true})).toBeNull();
  });
});
