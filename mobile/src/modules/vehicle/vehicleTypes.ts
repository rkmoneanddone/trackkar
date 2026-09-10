export type VehicleStatus = 'ACTIVE' | 'INACTIVE';

export type Vehicle = {
  id: string;
  ownerAccountId: string;
  displayName: string;
  registrationNumber: string;
  vehicleType: string;
  makeModel: string | null;
  status: VehicleStatus;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type CreateVehicleInput = {
  displayName: string;
  registrationNumber: string;
  vehicleType: string;
  makeModel?: string | null;
};