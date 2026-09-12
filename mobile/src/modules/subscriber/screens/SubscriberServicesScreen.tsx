import React, {useCallback, useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {BellOff, BellRing, Route, XCircle} from 'lucide-react-native';
import {AppScreen} from '../../../components/AppScreen';
import {BrandHeader} from '../../../components/BrandHeader';
import {AppButton} from '../../../components/AppButton';
import {colors, radius} from '../../../theme/tokens';
import {getMyRoute} from '../../route/routeRepository';
import type {TrackKarRoute} from '../../route/routeTypes';
import {
  getMyActiveSubscriptions,
  setSubscriptionStatus,
} from '../subscriberRepository';
import type {RouteSubscription} from '../subscriberTypes';

type ServiceItem = {subscription: RouteSubscription; route: TrackKarRoute | null};

export function SubscriberServicesScreen() {
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    let active = true;
    setLoading(true);
    getMyActiveSubscriptions()
      .then(async subscriptions => Promise.all(subscriptions.map(async subscription => ({
        subscription,
        route: await getMyRoute(subscription.routeId),
      }))))
      .then(value => { if (active) setItems(value); })
      .catch(cause => {
        if (active) Alert.alert('Could not load services', cause instanceof Error ? cause.message : String(cause));
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  useFocusEffect(load);

  const changeStatus = async (item: ServiceItem, status: RouteSubscription['status']) => {
    try {
      await setSubscriptionStatus(item.subscription.id, status);
      if (status === 'ENDED') {
        setItems(current => current.filter(value => value.subscription.id !== item.subscription.id));
      } else {
        setItems(current => current.map(value => value.subscription.id === item.subscription.id
          ? {...value, subscription: {...value.subscription, status}}
          : value));
      }
    } catch (cause) {
      Alert.alert('Could not update service', cause instanceof Error ? cause.message : String(cause));
    }
  };

  const confirmEnd = (item: ServiceItem) => Alert.alert(
    'Stop tracking this service?',
    'You will no longer receive route alerts. You can subscribe again later.',
    [{text: 'Cancel', style: 'cancel'}, {text: 'Stop tracking', style: 'destructive',
      onPress: () => changeStatus(item, 'ENDED')}],
  );

  return <AppScreen><BrandHeader compact />
    <Text style={styles.title}>Tracked services</Text>
    <Text style={styles.subtitle}>Manage alerts independently for every subscribed route.</Text>
    {loading ? <Text style={styles.muted}>Loading tracked services…</Text> : null}
    {!loading && items.length === 0 ? <View style={styles.empty}><Route size={30} color={colors.primary} />
      <Text style={styles.heading}>No active subscriptions</Text>
      <Text style={styles.muted}>Use Discover to find and track an active service route.</Text></View> : null}
    {items.map(item => {
      const muted = item.subscription.status === 'MUTED';
      return <View key={item.subscription.id} style={styles.card}>
        <View style={styles.row}>{muted ? <BellOff size={22} color={colors.warning} />
          : <BellRing size={22} color={colors.success} />}
          <View style={styles.grow}><Text style={styles.heading}>{item.route?.routeName || 'Service route'}</Text>
            <Text style={styles.muted}>{muted ? 'Alerts muted' : '6-minute and 3-minute alerts enabled'}</Text></View></View>
        <AppButton label={muted ? 'Resume alerts' : 'Mute alerts'} secondary
          onPress={() => changeStatus(item, muted ? 'ACTIVE' : 'MUTED')} />
        <AppButton label="Stop tracking" secondary icon={<XCircle size={18} color={colors.warning} />}
          onPress={() => confirmEnd(item)} />
      </View>;
    })}
  </AppScreen>;
}

const styles = StyleSheet.create({
  title: {fontSize: 29, fontWeight: '900', color: colors.text},
  subtitle: {fontSize: 14, lineHeight: 20, color: colors.muted},
  muted: {fontSize: 12.8, lineHeight: 18, color: colors.muted},
  heading: {fontSize: 16, fontWeight: '900', color: colors.text},
  empty: {alignItems: 'center', gap: 10, padding: 24, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg},
  card: {gap: 12, padding: 16, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg},
  row: {flexDirection: 'row', alignItems: 'center', gap: 11}, grow: {flex: 1},
});
