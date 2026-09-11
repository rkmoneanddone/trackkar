import React, {useCallback, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MapPinned, Route as RouteIcon, Sparkles} from 'lucide-react-native';
import {AppScreen} from '../../../components/AppScreen';
import {AppHeader} from '../../../components/AppHeader';
import {colors, radius} from '../../../theme/tokens';
import {getMyRoute} from '../routeRepository';
import type {TrackKarRoute} from '../routeTypes';
import type {RouteStackParamList} from '../../../navigation/RouteStackNavigator';

type Props = NativeStackScreenProps<RouteStackParamList, 'RouteDetails'>;

export function RouteDetailsScreen({navigation, route}: Props) {
  const [item, setItem] = useState<TrackKarRoute | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useFocusEffect(useCallback(() => {
    let active = true; setLoading(true); setError(null);
    getMyRoute(route.params.routeId).then(value => {
      if (active) { setItem(value); if (!value) setError('This route could not be found.'); }
    }).catch(cause => active && setError(cause instanceof Error ? cause.message : String(cause)))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [route.params.routeId]));
  return (
    <AppScreen>
      <AppHeader title="Route details" onBack={() => navigation.goBack()} />
      {loading ? <Text style={styles.muted}>Loading route…</Text> : null}
      {!loading && (error || !item) ? <Text style={styles.muted}>{error}</Text> : null}
      {item ? <>
        <View style={styles.hero}><RouteIcon size={30} color={colors.primary} /><View style={styles.grow}><Text style={styles.title}>{item.routeName}</Text><Text style={styles.meta}>{item.directionType} · {item.status}</Text></View></View>
        <View style={styles.card}><MapPinned size={21} color={colors.primary} /><Text style={styles.cardTitle}>Route points pending</Text><Text style={styles.muted}>Start, end and route geometry will be captured in the recording phase.</Text></View>
        <View style={styles.card}><Sparkles size={21} color={colors.primary} /><Text style={styles.cardTitle}>Learning progress: {item.learningTripCount}/3</Text><Text style={styles.muted}>Three valid matching completed recordings produce the learned route.</Text></View>
      </> : null}
    </AppScreen>
  );
}
const styles = StyleSheet.create({
  hero: {flexDirection: 'row', alignItems: 'center', gap: 13, padding: 16, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, backgroundColor: colors.surface}, grow: {flex: 1},
  title: {fontSize: 21, fontWeight: '900', color: colors.text}, meta: {fontSize: 12.5, color: colors.muted, marginTop: 4},
  card: {gap: 7, padding: 16, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, backgroundColor: colors.surface}, cardTitle: {fontSize: 15, fontWeight: '900', color: colors.text}, muted: {fontSize: 13, lineHeight: 19, color: colors.muted},
});
