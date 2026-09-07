import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Home, BusFront, Route} from 'lucide-react-native';
import {OperatorHomeScreen} from '../modules/operator/screens/OperatorHomeScreen';
import {VehiclesScreen} from '../modules/operator/screens/VehiclesScreen';
import {RoutesScreen} from '../modules/operator/screens/RoutesScreen';
import {colors} from '../theme/tokens';

const Tab = createBottomTabNavigator();

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
      <Tab.Screen name="Home" component={OperatorHomeScreen} options={{tabBarIcon: ({color}) => <Home size={21} color={color} />}} />
      <Tab.Screen name="Vehicles" component={VehiclesScreen} options={{tabBarIcon: ({color}) => <BusFront size={21} color={color} />}} />
      <Tab.Screen name="Routes" component={RoutesScreen} options={{tabBarIcon: ({color}) => <Route size={21} color={color} />}} />
    </Tab.Navigator>
  );
}