export type Provider = {
  id: string;
  ownerAccountId: string;
  displayName: string;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type ProviderMember = {
  id: string;
  providerId: string;
  accountId: string;
  inviteId?: string;
  role: 'OWNER' | 'DRIVER';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type DriverInvite = {
  id: string;
  providerId: string;
  createdByAccountId: string;
  status: 'OPEN' | 'ACCEPTED' | 'REVOKED';
  acceptedByAccountId: string | null;
  createdAt?: unknown;
  updatedAt?: unknown;
};
