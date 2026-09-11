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
  status: 'ACTIVE' | 'MUTED' | 'ENDED';
  alertMinutes: [6, 3];
  voiceEnabled: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
};
