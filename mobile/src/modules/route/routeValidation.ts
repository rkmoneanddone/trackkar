import type {RouteDirection} from './routeTypes';

export const MAX_ACTIVE_ROUTES = 5;
export const MAX_ROUTE_NAME_LENGTH = 60;

export function validateRouteName(value: string) {
  const clean = value.trim();
  if (!clean) return 'Route name is required.';
  if (clean.length > MAX_ROUTE_NAME_LENGTH) return `Route name must be ${MAX_ROUTE_NAME_LENGTH} characters or fewer.`;
  return null;
}

export function validateRouteDirection(value: string): value is RouteDirection {
  return value === 'OUTBOUND' || value === 'RETURN' || value === 'CUSTOM';
}
