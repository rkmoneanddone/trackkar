export type PublicRole =
  | 'OPERATOR'
  | 'DRIVER'
  | 'SUBSCRIBER';

export type AccountCapabilities = {
  operator: boolean;
  driver: boolean;
  subscriber: boolean;
};
