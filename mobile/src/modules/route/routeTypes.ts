export type RouteDirection = 'OUTBOUND' | 'RETURN' | 'CUSTOM';
export type TrackKarRouteStatus = 'DRAFT' | 'LEARNING' | 'FINALIZING' | 'ACTIVE' | 'INACTIVE' | 'DELETED';

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
  startPoint: null;
  endPoint: null;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type CreateRouteInput = {
  vehicleId: string;
  routeName: string;
  directionType: RouteDirection;
};
