import React, {useCallback, useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {MapPinned, Route} from 'lucide-react-native';
import {AppScreen} from '../../../components/AppScreen';
import {BrandHeader} from '../../../components/BrandHeader';
import {AppButton} from '../../../components/AppButton';
import {colors, radius} from '../../../theme/tokens';
import {completeRouteRun, getMyActiveRun, updateRouteRunLocation} from '../../run/routeRunRepository';
import type {RouteRun} from '../../run/routeRunTypes';
import {captureDeviceLocation} from '../../location/deviceLocation';

export function DriverHomeScreen() {
  const navigation = useNavigation<any>();
  const [run, setRun] = useState<RouteRun | null>(null);
  const load = useCallback(() => { let active = true; getMyActiveRun().then(item => active && setRun(item))
    .catch(() => active && setRun(null)); return () => { active = false; }; }, []);
  useFocusEffect(load);
  React.useEffect(() => {
    if (!run) return;
    const update = async () => { const point = await captureDeviceLocation();
      await updateRouteRunLocation(run.id, point, point.speedMetersPerSecond); };
    const timer = setInterval(() => { update().catch(() => undefined); }, 60_000);
    return () => clearInterval(timer);
  }, [run]);
  const finish = async () => { if (!run) return; try { const endpoint = await captureDeviceLocation();
      await completeRouteRun(run.id, endpoint); setRun(null); }
    catch (cause) { Alert.alert('Could not finish route', cause instanceof Error ? cause.message : String(cause)); } };
  return <AppScreen><BrandHeader compact /><Text style={styles.title}>Driver</Text>
    <Text style={styles.subtitle}>Select the route actually being serviced today.</Text>
    <View style={styles.status}><View style={[styles.dot, run && styles.live]} />
      <Text style={styles.statusText}>{run ? 'Route is live' : 'No active route'}</Text></View>
    <View style={styles.card}><Route size={24} color={colors.primary} />
      <Text style={styles.cardTitle}>{run ? 'Location sharing active' : 'Ready for route selection'}</Text>
      <Text style={styles.cardText}>{run ? 'Only this active run can generate subscriber alerts.'
        : 'Open My routes after connecting to a provider.'}</Text></View>
    {run ? <AppButton label="End route" onPress={finish} /> :
      <AppButton label="Open my routes" arrow onPress={() => navigation.navigate('Routes')} />}
    <View style={styles.learning}><MapPinned size={19} color={colors.primary} /><Text style={styles.learningText}>
      Draft routes learn from the first three valid completed trips. Outbound and return routes remain separate.</Text></View>
  </AppScreen>;
}
const styles = StyleSheet.create({title: {fontSize: 29, fontWeight: '900', color: colors.text}, subtitle: {fontSize: 14, color: colors.muted},
  status: {flexDirection: 'row', alignItems: 'center', gap: 8}, dot: {width: 9, height: 9, borderRadius: 99, backgroundColor: '#98A2B3'}, live: {backgroundColor: colors.success}, statusText: {fontSize: 12.5, fontWeight: '800', color: colors.muted},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 16, gap: 8},
  cardTitle: {fontSize: 16, fontWeight: '900', color: colors.text}, cardText: {fontSize: 12.8, lineHeight: 18, color: colors.muted},
  learning: {backgroundColor: colors.primarySoft, borderRadius: radius.lg, padding: 16, flexDirection: 'row', gap: 11}, learningText: {flex: 1, fontSize: 12.8, lineHeight: 18, color: colors.textSoft}});
