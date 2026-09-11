import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Home, Search, UserRound} from 'lucide-react-native';
import {SubscriberHomeScreen} from '../modules/subscriber/screens/SubscriberHomeScreen';
import {DiscoverScreen} from '../modules/subscriber/screens/DiscoverScreen';
import {colors} from '../theme/tokens';
import {AccountScreen} from '../modules/account/screens/AccountScreen';

const Tab = createBottomTabNavigator();

export function SubscriberNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#98A2B3',
        tabBarStyle: {height: 66, paddingTop: 7, paddingBottom: 8},
        tabBarLabelStyle: {fontSize: 11.5, fontWeight: '800'},
      }}>
      <Tab.Screen name="Home" component={SubscriberHomeScreen} options={{tabBarIcon: ({color}) => <Home size={21} color={color} />}} />
      <Tab.Screen name="Discover" component={DiscoverScreen} options={{tabBarIcon: ({color}) => <Search size={21} color={color} />}} />
      <Tab.Screen name="Account" component={AccountScreen} options={{tabBarIcon: ({color}) => <UserRound size={21} color={color} />}} />
    </Tab.Navigator>
  );
}
