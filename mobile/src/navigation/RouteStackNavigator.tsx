import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RoutesScreen} from '../modules/operator/screens/RoutesScreen';
import {AddRouteScreen} from '../modules/route/screens/AddRouteScreen';
import {RouteDetailsScreen} from '../modules/route/screens/RouteDetailsScreen';

export type RouteStackParamList = {
  RouteList: undefined;
  AddRoute: undefined;
  RouteDetails: {routeId: string};
};

const Stack = createNativeStackNavigator<RouteStackParamList>();

export function RouteStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false, animation: 'slide_from_right'}}>
      <Stack.Screen name="RouteList" component={RoutesScreen} />
      <Stack.Screen name="AddRoute" component={AddRouteScreen} />
      <Stack.Screen name="RouteDetails" component={RouteDetailsScreen} />
    </Stack.Navigator>
  );
}
