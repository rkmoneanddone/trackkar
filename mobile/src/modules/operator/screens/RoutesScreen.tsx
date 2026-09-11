import React, {useCallback, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ChevronRight, MapPinned, Plus, Route as RouteIcon} from 'lucide-react-native';
import {AppScreen} from '../../../components/AppScreen';
import {BrandHeader} from '../../../components/BrandHeader';
import {AppButton} from '../../../components/AppButton';
import {colors, radius} from '../../../theme/tokens';
import {listMyRoutes} from '../../route/routeRepository';
import type {TrackKarRoute} from '../../route/routeTypes';
import type {RouteStackParamList} from '../../../navigation/RouteStackNavigator';

type Props = NativeStackScreenProps<RouteStackParamList, 'RouteList'>;

export function RoutesScreen({navigation}: Props) {
  const [routes, setRoutes] = useState<TrackKarRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(useCallback(() => {
    let active = true;
    setLoading(true);
    setError(null);
    listMyRoutes()
      .then(items => active && setRoutes(items))
      .catch(cause => active && setError(cause instanceof Error ? cause.message : String(cause)))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []));

  return (
    <AppScreen>
      <BrandHeader compact />
      <View style={styles.heading}>
        <View style={styles.grow}>
          <Text style={styles.title}>Routes</Text>
          <Text style={styles.subtitle}>Reusable route identities and learned service paths.</Text>
        </View>
        {routes.length > 0 && routes.length < 5 ? (
          <Pressable style={styles.addMini} onPress={() => navigation.navigate('AddRoute')}>
            <Plus size={19} color={colors.white} />
          </Pressable>
        ) : null}
      </View>
      {loading ? <Text style={styles.muted}>Loading routes…</Text> : null}
      {!loading && error ? <Text style={styles.muted}>{error}</Text> : null}
      {!loading && !error && routes.length === 0 ? (
        <View style={styles.empty}>
          <MapPinned size={31} color={colors.primary} />
          <Text style={styles.emptyTitle}>No routes yet</Text>
          <Text style={styles.muted}>Add the route identity first. Start/end points come from Maps or GPS, never typed manually.</Text>
          <AppButton label="Add route" icon={<Plus size={19} color={colors.white} />} onPress={() => navigation.navigate('AddRoute')} />
        </View>
      ) : null}
      <View style={styles.list}>
        {routes.map(item => (
          <Pressable key={item.id} style={styles.card} onPress={() => navigation.navigate('RouteDetails', {routeId: item.id})}>
            <View style={styles.icon}><RouteIcon size={22} color={colors.primary} /></View>
            <View style={styles.grow}>
              <Text style={styles.routeName}>{item.routeName}</Text>
              <Text style={styles.muted}>{item.directionType} · {item.status} · {item.learningTripCount}/3 trips</Text>
            </View>
            <ChevronRight size={19} color={colors.muted} />
          </Pressable>
        ))}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  heading: {flexDirection: 'row', alignItems: 'center', gap: 12},
  grow: {flex: 1}, title: {fontSize: 29, fontWeight: '900', color: colors.text},
  subtitle: {fontSize: 14, lineHeight: 20, color: colors.muted},
  muted: {fontSize: 12.5, lineHeight: 18, color: colors.muted},
  addMini: {width: 42, height: 42, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  empty: {padding: 24, alignItems: 'center', gap: 11, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, backgroundColor: colors.surface},
  emptyTitle: {fontSize: 19, fontWeight: '900', color: colors.text},
  list: {gap: 10},
  card: {flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, backgroundColor: colors.surface},
  icon: {width: 46, height: 46, borderRadius: 15, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center'},
  routeName: {fontSize: 15, fontWeight: '900', color: colors.text},
});
