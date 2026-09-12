import type {RoutePoint} from '../route/routeTypes';

export type SubscriberLocation = {
  accountId: string;
  label: string;
  point: RoutePoint;
  updatedAt?: unknown;
};

export type RouteSubscription = {
  id: string;
  subscriberAccountId: string;
  routeId: string;
  subscriberPoint: RoutePoint;
  routeProgressMeters: number;
  routeDistanceFromPathMeters: number;
  status: 'ACTIVE' | 'MUTED' | 'ENDED';
  alertMinutes?: number[];
  voiceEnabled: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
};
