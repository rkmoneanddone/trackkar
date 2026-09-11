import {NativeModules, PermissionsAndroid, Platform} from 'react-native';
import type {RoutePoint} from '../route/routeTypes';

type NativePosition = RoutePoint & {speedMetersPerSecond: number | null};

export async function captureDeviceLocation(): Promise<NativePosition> {
  if (Platform.OS !== 'android') throw new Error('Device location is currently connected for Android testing.');
  const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {title: 'TrackKar location', message: 'Location is used only to save a subscriber point or while a driver route is active.',
      buttonPositive: 'Allow', buttonNegative: 'Not now'});
  if (result !== PermissionsAndroid.RESULTS.GRANTED) throw new Error('Location permission was not granted.');
  if (!NativeModules.TrackKarLocation) throw new Error('TrackKar location module is unavailable. Rebuild the Android app.');
  return NativeModules.TrackKarLocation.getCurrentPosition();
}
