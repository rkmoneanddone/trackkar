import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {RootStackParamList} from './types';
import {SplashScreen} from '../modules/onboarding/screens/SplashScreen';
import {WelcomeScreen} from '../modules/onboarding/screens/WelcomeScreen';
import {RegisterAsScreen} from '../modules/onboarding/screens/RegisterAsScreen';
import {OperatorModeScreen} from '../modules/onboarding/screens/OperatorModeScreen';
import {RegisterScreen} from '../modules/auth/screens/RegisterScreen';
import {MobileVerificationScreen} from '../modules/auth/screens/MobileVerificationScreen';
import {OperatorNavigator} from './OperatorNavigator';
import {DriverNavigator} from './DriverNavigator';
import {SubscriberNavigator} from './SubscriberNavigator';
import {AdminNavigator} from './AdminNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="RegisterAs" component={RegisterAsScreen} />
        <Stack.Screen name="OperatorMode" component={OperatorModeScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen
          name="MobileVerification"
          component={MobileVerificationScreen}
        />
        <Stack.Screen name="OperatorApp" component={OperatorNavigator} />
        <Stack.Screen name="DriverApp" component={DriverNavigator} />
        <Stack.Screen name="SubscriberApp" component={SubscriberNavigator} />
        <Stack.Screen name="AdminApp" component={AdminNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
