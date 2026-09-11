import {distanceMeters} from '../route/routeLearning';
import type {RoutePoint} from '../route/routeTypes';
import type {RunAlertState} from './routeRunTypes';

export type AlertStage = 'SIX_MINUTE' | 'THREE_MINUTE';

export function estimatedMinutesAway(
  vehiclePoint: RoutePoint,
  subscriberPoint: RoutePoint,
  speedMetersPerSecond: number,
) {
  if (!Number.isFinite(speedMetersPerSecond) || speedMetersPerSecond < 1) return null;
  return distanceMeters(vehiclePoint, subscriberPoint) / speedMetersPerSecond / 60;
}

export function nextAlertStage(
  previousEtaMinutes: number | null,
  currentEtaMinutes: number | null,
  state: RunAlertState,
): AlertStage | null {
  if (state.muted || currentEtaMinutes === null || currentEtaMinutes < 0) return null;
  const crossed = (threshold: number) => currentEtaMinutes <= threshold
    && (previousEtaMinutes === null || previousEtaMinutes > threshold);
  if (!state.sixMinuteSent && crossed(6)) return 'SIX_MINUTE';
  if (!state.threeMinuteSent && crossed(3)) return 'THREE_MINUTE';
  return null;
}

export function markAlertSent(state: RunAlertState, stage: AlertStage): RunAlertState {
  return stage === 'SIX_MINUTE'
    ? {...state, sixMinuteSent: true}
    : {...state, threeMinuteSent: true};
}
