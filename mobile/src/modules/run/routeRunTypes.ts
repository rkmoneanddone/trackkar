import type {RoutePoint} from '../route/routeTypes';

export type RouteRunStatus = 'ACTIVE' | 'COMPLETED' | 'AUTO_STOPPED';

export type RouteRun = {
  id: string;
  routeId: string;
  vehicleId: string;
  driverAccountId: string;
  status: RouteRunStatus;
  latestPoint: RoutePoint;
  latestSpeedMetersPerSecond: number | null;
  startedAt?: unknown;
  endedAt?: unknown;
  autoStopAt?: unknown;
  updatedAt?: unknown;
};

export type RunAlertState = {
  sixMinuteSent: boolean;
  threeMinuteSent: boolean;
  muted: boolean;
};
