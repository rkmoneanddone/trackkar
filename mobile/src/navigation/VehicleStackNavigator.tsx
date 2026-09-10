import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {VehiclesScreen} from '../modules/operator/screens/VehiclesScreen';
import {AddVehicleScreen} from '../modules/vehicle/screens/AddVehicleScreen';
import {VehicleDetailsScreen} from '../modules/vehicle/screens/VehicleDetailsScreen';

export type VehicleStackParamList = {
  VehicleList: undefined;
  AddVehicle: undefined;
  VehicleDetails: {vehicleId: string};
};

const Stack = createNativeStackNavigator<VehicleStackParamList>();

export function VehicleStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false, animation: 'slide_from_right'}}>
      <Stack.Screen name="VehicleList" component={VehiclesScreen} />
      <Stack.Screen name="AddVehicle" component={AddVehicleScreen} />
      <Stack.Screen name="VehicleDetails" component={VehicleDetailsScreen} />
    </Stack.Navigator>
  );
}