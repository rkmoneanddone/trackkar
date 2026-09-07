export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  RegisterAs: undefined;
  OperatorMode: undefined;
  Register: {role: 'OPERATOR' | 'OPERATOR_DRIVER' | 'DRIVER' | 'SUBSCRIBER'};
  OperatorApp: undefined;
  DriverApp: undefined;
  SubscriberApp: undefined;
};