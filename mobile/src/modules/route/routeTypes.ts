export type RouteDirection = 'OUTBOUND' | 'RETURN' | 'CUSTOM';
export type TrackKarRouteStatus = 'DRAFT' | 'LEARNING' | 'FINALIZING' | 'ACTIVE' | 'INACTIVE' | 'DELETED';

export type RoutePoint = {
  latitude: number;
  longitude: number;
  capturedAtMs: number;
  accuracyMeters?: number | null;
};

export type TrackKarRoute = {
  id: string;
  ownerAccountId: string;
  vehicleId: string;
  routeName: string;
  directionType: RouteDirection;
  pairedRouteId: string | null;
  creationMethod: 'RECORDED' | 'MAP';
  status: TrackKarRouteStatus;
  learningTripCount: number;
  startPoint: RoutePoint | null;
  endPoint: RoutePoint | null;
  learnedPath?: RoutePoint[] | null;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type RouteLearningTrip = {
  id: string;
  routeId: string;
  ownerAccountId: string;
  sequence: number;
  points: RoutePoint[];
  distanceMeters: number;
  durationSeconds: number;
  createdAt?: unknown;
};

export type CreateRouteInput = {
  vehicleId: string;
  routeName: string;
  directionType: RouteDirection;
};
