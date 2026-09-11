import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BusFront, Home, Route, UserRound, UsersRound} from 'lucide-react-native';
import {OperatorHomeScreen} from '../modules/operator/screens/OperatorHomeScreen';
import {AccountScreen} from '../modules/account/screens/AccountScreen';
import {VehicleStackNavigator} from './VehicleStackNavigator';
import {RouteStackNavigator} from './RouteStackNavigator';
import {colors} from '../theme/tokens';
import {TeamScreen} from '../modules/operator/screens/TeamScreen';

export type OperatorTabParamList = {
  Home: undefined;
  Vehicles: undefined;
  Routes: undefined;
  Team: undefined;
  Account: undefined;
};

const Tab = createBottomTabNavigator<OperatorTabParamList>();

export function OperatorNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#98A2B3',
        tabBarStyle: {height: 66, paddingTop: 7, paddingBottom: 8},
        tabBarLabelStyle: {fontSize: 11.5, fontWeight: '800'},
      }}>
      <Tab.Screen
        name="Home"
        component={OperatorHomeScreen}
        options={{
          tabBarIcon: ({color}) => <Home size={21} color={color} />,
        }}
      />

      <Tab.Screen
        name="Vehicles"
        component={VehicleStackNavigator}
        options={{
          tabBarIcon: ({color}) => <BusFront size={21} color={color} />,
        }}
      />

      <Tab.Screen
        name="Routes"
        component={RouteStackNavigator}
        options={{
          tabBarIcon: ({color}) => <Route size={21} color={color} />,
        }}
      />

      <Tab.Screen
        name="Team"
        component={TeamScreen}
        options={{tabBarIcon: ({color}) => <UsersRound size={21} color={color} />}}
      />

      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarIcon: ({color}) => <UserRound size={21} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
