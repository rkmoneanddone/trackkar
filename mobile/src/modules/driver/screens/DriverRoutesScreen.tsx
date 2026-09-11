import React, {useCallback, useState} from 'react';
import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Link, Route} from 'lucide-react-native';
import {AppScreen} from '../../../components/AppScreen';
import {BrandHeader} from '../../../components/BrandHeader';
import {TextField} from '../../../components/TextField';
import {AppButton} from '../../../components/AppButton';
import {colors, radius} from '../../../theme/tokens';
import {acceptDriverInvite} from '../../provider/providerRepository';
import {listMyDriverRoutes} from '../../route/routeRepository';
import type {TrackKarRoute} from '../../route/routeTypes';
import {captureDeviceLocation} from '../../location/deviceLocation';
import {startRouteRun} from '../../run/routeRunRepository';

export function DriverRoutesScreen() {
  const [routes, setRoutes] = useState<TrackKarRoute[]>([]);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const load = useCallback(() => { let active = true; setLoading(true);
    listMyDriverRoutes().then(items => active && setRoutes(items)).catch(() => active && setRoutes([]))
      .finally(() => active && setLoading(false)); return () => { active = false; }; }, []);
  useFocusEffect(load);
  const connect = async () => { try { await acceptDriverInvite(code); setCode('');
      setRoutes(await listMyDriverRoutes()); Alert.alert('Provider connected', 'Assigned provider routes are now available.'); }
    catch (cause) { Alert.alert('Could not connect', cause instanceof Error ? cause.message : String(cause)); } };
  const start = async (item: TrackKarRoute) => { try { const position = await captureDeviceLocation();
      await startRouteRun(item.id, position); Alert.alert('Route started', `${item.routeName} is now live.`); }
    catch (cause) { Alert.alert('Could not start route', cause instanceof Error ? cause.message : String(cause)); } };
  return <AppScreen><BrandHeader compact /><Text style={styles.title}>My routes</Text>
    <Text style={styles.subtitle}>Connect to a provider, then choose the actual route being driven today.</Text>
    <View style={styles.connect}><Link size={21} color={colors.primary} /><Text style={styles.heading}>Provider invite</Text>
      <TextField label="Invite code" placeholder="8-character code" value={code}
        autoCapitalize="characters" onChangeText={value => setCode(value.toUpperCase().slice(0, 8))} />
      <AppButton label="Connect provider" disabled={code.length !== 8} onPress={connect} /></View>
    {loading ? <Text style={styles.muted}>Loading assigned routes…</Text> : null}
    {!loading && routes.length === 0 ? <View style={styles.empty}><Route size={31} color={colors.primary} />
      <Text style={styles.heading}>No assigned routes</Text><Text style={styles.muted}>Ask the provider for an invite code.</Text></View> : null}
    {routes.map(item => <Pressable key={item.id} style={styles.routeCard} onPress={() => start(item)}>
      <Route size={20} color={colors.primary} /><View style={styles.grow}><Text style={styles.routeName}>{item.routeName}</Text>
        <Text style={styles.muted}>{item.directionType} · {item.status} · Tap to start</Text></View></Pressable>)}
  </AppScreen>;
}
const styles = StyleSheet.create({title: {fontSize: 29, fontWeight: '900', color: colors.text}, subtitle: {fontSize: 14, lineHeight: 20, color: colors.muted},
  connect: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 16, gap: 10},
  heading: {fontSize: 17, fontWeight: '900', color: colors.text}, muted: {fontSize: 13, lineHeight: 19, color: colors.muted},
  empty: {alignItems: 'center', gap: 10, padding: 22, backgroundColor: colors.surface, borderRadius: radius.lg},
  routeCard: {flexDirection: 'row', gap: 12, alignItems: 'center', padding: 15, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md},
  grow: {flex: 1}, routeName: {fontSize: 15, fontWeight: '900', color: colors.text}});
