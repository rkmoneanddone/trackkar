import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ShieldCheck, UserRound} from 'lucide-react-native';
import {AdminDashboardScreen} from '../modules/admin/screens/AdminDashboardScreen';
import {AccountScreen} from '../modules/account/screens/AccountScreen';
import {colors} from '../theme/tokens';

const Tab = createBottomTabNavigator();

export function AdminNavigator() {
  return <Tab.Navigator screenOptions={{headerShown: false, tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: '#98A2B3', tabBarStyle: {height: 66, paddingTop: 7, paddingBottom: 8}}}>
    <Tab.Screen name="Admin" component={AdminDashboardScreen}
      options={{tabBarIcon: ({color}) => <ShieldCheck size={21} color={color} />}} />
    <Tab.Screen name="Account" component={AccountScreen}
      options={{tabBarIcon: ({color}) => <UserRound size={21} color={color} />}} />
  </Tab.Navigator>;
}
