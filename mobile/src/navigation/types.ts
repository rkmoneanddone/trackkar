export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  RegisterAs: undefined;
  OperatorMode: undefined;
  Register: {role: 'OPERATOR' | 'OPERATOR_DRIVER' | 'DRIVER' | 'SUBSCRIBER'};
  MobileVerification: {
    role: 'OPERATOR' | 'OPERATOR_DRIVER' | 'DRIVER' | 'SUBSCRIBER';
    name: string;
    otherName: string;
    mobile: string;
  };
  OperatorApp: undefined;
  DriverApp: undefined;
  SubscriberApp: undefined;
};
