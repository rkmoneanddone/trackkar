import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Home, Route} from 'lucide-react-native';
import {DriverHomeScreen} from '../modules/driver/screens/DriverHomeScreen';
import {DriverRoutesScreen} from '../modules/driver/screens/DriverRoutesScreen';
import {colors} from '../theme/tokens';

const Tab = createBottomTabNavigator();

export function DriverNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#98A2B3',
        tabBarStyle: {height: 66, paddingTop: 7, paddingBottom: 8},
        tabBarLabelStyle: {fontSize: 11.5, fontWeight: '800'},
      }}>
      <Tab.Screen name="Home" component={DriverHomeScreen} options={{tabBarIcon: ({color}) => <Home size={21} color={color} />}} />
      <Tab.Screen name="Routes" component={DriverRoutesScreen} options={{tabBarIcon: ({color}) => <Route size={21} color={color} />}} />
    </Tab.Navigator>
  );
}