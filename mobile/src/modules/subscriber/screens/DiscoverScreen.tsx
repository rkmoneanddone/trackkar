import React, {useCallback, useState} from 'react';
import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Route, Search} from 'lucide-react-native';
import {AppScreen} from '../../../components/AppScreen';
import {BrandHeader} from '../../../components/BrandHeader';
import {TextField} from '../../../components/TextField';
import {colors, radius} from '../../../theme/tokens';
import {discoverActiveRoutes, subscribeToRoute, type DiscoveredRoute} from '../subscriberRepository';

export function DiscoverScreen() {
  const [search, setSearch] = useState('');
  const [routes, setRoutes] = useState<DiscoveredRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(() => {
    let active = true;
    setLoading(true);
    setError(null);
    discoverActiveRoutes(search).then(items => active && setRoutes(items))
      .catch(cause => active && setError(cause instanceof Error ? cause.message : String(cause)))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [search]);
  useFocusEffect(load);

  const subscribe = async (item: DiscoveredRoute) => {
    try {
      await subscribeToRoute(item.id);
      Alert.alert('Service tracked', `You will receive alerts for ${item.routeName}.`);
    } catch (cause) {
      Alert.alert('Could not track service', cause instanceof Error ? cause.message : String(cause));
    }
  };

  return <AppScreen>
    <BrandHeader compact />
    <Text style={styles.title}>Discover services</Text>
    <Text style={styles.subtitle}>Find any active TrackKar service route.</Text>
    <TextField label="Search" placeholder="Route or service area" value={search}
      onChangeText={setSearch} icon={<Search size={19} color={colors.muted} />} />
    {loading ? <Text style={styles.muted}>Loading active services…</Text> : null}
    {error ? <Text style={styles.error}>{error}</Text> : null}
    {!loading && !error && routes.length === 0 ? <View style={styles.empty}>
      <Search size={31} color={colors.primary} />
      <Text style={styles.emptyTitle}>No matching active service</Text>
      <Text style={styles.muted}>Only learned and activated routes are discoverable.</Text>
    </View> : null}
    {routes.map(item => <Pressable key={item.id} onPress={() => subscribe(item)} style={styles.card}>
      <View style={styles.icon}><Route size={21} color={colors.primary} /></View>
      <View style={styles.grow}><Text style={styles.routeName}>{item.routeName}</Text>
        <Text style={styles.muted}>{item.providerName} · {item.serviceType}</Text>
        <Text style={styles.muted}>{item.vehicleName} · {item.directionType}</Text></View>
      <Text style={styles.track}>Track</Text>
    </Pressable>)}
  </AppScreen>;
}

const styles = StyleSheet.create({
  title: {fontSize: 29, fontWeight: '900', color: colors.text}, subtitle: {fontSize: 14, color: colors.muted},
  muted: {fontSize: 12.8, lineHeight: 18, color: colors.muted}, error: {fontSize: 13, color: colors.warning},
  empty: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 24, alignItems: 'center', gap: 11},
  emptyTitle: {fontSize: 18, fontWeight: '900', color: colors.text},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 15, flexDirection: 'row', alignItems: 'center', gap: 12},
  icon: {width: 42, height: 42, borderRadius: radius.md, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center'},
  grow: {flex: 1}, routeName: {fontSize: 15, fontWeight: '900', color: colors.text}, track: {fontSize: 13, fontWeight: '900', color: colors.primary},
});
