import React, {useCallback, useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {BellRing, MapPin, Radar} from 'lucide-react-native';
import {AppScreen} from '../../../components/AppScreen';
import {BrandHeader} from '../../../components/BrandHeader';
import {AppButton} from '../../../components/AppButton';
import {colors, radius} from '../../../theme/tokens';
import {getMyRoute} from '../../route/routeRepository';
import {getMyActiveSubscriptions, getSavedLocation, saveCapturedLocation} from '../subscriberRepository';
import {captureDeviceLocation} from '../../location/deviceLocation';

export function SubscriberHomeScreen() {
  const navigation = useNavigation<any>();
  const [locationLabel, setLocationLabel] = useState<string | null>(null);
  const [routeNames, setRouteNames] = useState<string[]>([]);
  useFocusEffect(useCallback(() => {
    let active = true;
    Promise.all([getSavedLocation(), getMyActiveSubscriptions()]).then(async ([location, subscriptions]) => {
      const trackedRoutes = await Promise.all(subscriptions.map(item => getMyRoute(item.routeId)));
      if (active) { setLocationLabel(location?.label || null); setRouteNames(trackedRoutes.flatMap(item => item ? [item.routeName] : [])); }
    }).catch(() => { if (active) { setLocationLabel(null); setRouteNames([]); } });
    return () => { active = false; };
  }, []));
  const capture = async () => { try { const point = await captureDeviceLocation();
      await saveCapturedLocation('Saved service location', point.latitude, point.longitude);
      setLocationLabel('Saved service location'); Alert.alert('Location saved', 'TrackKar will use this fixed point. Continuous subscriber tracking stays off.'); }
    catch (cause) { Alert.alert('Could not save location', cause instanceof Error ? cause.message : String(cause)); } };

  return <AppScreen>
    <BrandHeader compact />
    <Text style={styles.title}>My TrackKar</Text>
    <Text style={styles.subtitle}>Your tracked services and proximity alerts.</Text>
    <View style={styles.location}><MapPin size={20} color={colors.primary} /><View style={styles.grow}>
      <Text style={styles.locationTitle}>Saved service location</Text>
      <Text style={styles.locationText}>{locationLabel || 'Not set yet'}</Text>
    </View></View>
    <AppButton label={locationLabel ? 'Refresh saved location' : 'Capture this location'} onPress={capture} secondary />
    <View style={styles.empty}><View style={styles.icon}><Radar size={31} color={colors.primary} /></View>
      <Text style={styles.emptyTitle}>{routeNames.length ? `${routeNames.length} services tracked` : 'Nothing tracked yet'}</Text>
      {routeNames.map(name => <Text key={name} style={styles.serviceName}>{name}</Text>)}
      <Text style={styles.emptyText}>{routeNames.length
        ? 'Tracking is active. Each route run can send the 6-minute and 3-minute alerts.'
        : 'Capture a location, then select the exact service route you want to track.'}</Text>
      <AppButton label={routeNames.length ? 'Add or change services' : 'Find a service'} arrow onPress={() => navigation.navigate('Discover')} />
    </View>
    <View style={styles.note}><BellRing size={18} color={colors.warning} />
      <Text style={styles.noteText}>Alerts are designed around approximately 6 minutes and 3 minutes before arrival.</Text></View>
  </AppScreen>;
}

const styles = StyleSheet.create({
  title: {fontSize: 29, fontWeight: '900', color: colors.text}, subtitle: {fontSize: 14, color: colors.muted},
  location: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 15, flexDirection: 'row', alignItems: 'center', gap: 11},
  grow: {flex: 1}, locationTitle: {fontSize: 13.5, fontWeight: '900', color: colors.text}, locationText: {fontSize: 12.5, color: colors.muted, marginTop: 2},
  empty: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 24, alignItems: 'center', gap: 11},
  icon: {width: 64, height: 64, borderRadius: 20, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center'},
  emptyTitle: {fontSize: 19, fontWeight: '900', color: colors.text}, emptyText: {fontSize: 13.5, lineHeight: 20, color: colors.muted, textAlign: 'center'},
  serviceName: {fontSize: 13.5, fontWeight: '800', color: colors.primary},
  note: {backgroundColor: '#FFFAEB', borderRadius: radius.md, padding: 15, flexDirection: 'row', gap: 10}, noteText: {flex: 1, fontSize: 12.8, lineHeight: 18, color: colors.warning, fontWeight: '700'},
});
