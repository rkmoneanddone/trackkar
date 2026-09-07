import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {BellRing, MapPin, Radar} from 'lucide-react-native';
import {AppScreen} from '../../../components/AppScreen';
import {BrandHeader} from '../../../components/BrandHeader';
import {AppButton} from '../../../components/AppButton';
import {colors, radius} from '../../../theme/tokens';

export function SubscriberHomeScreen() {
  return (
    <AppScreen>
      <BrandHeader compact />
      <Text style={styles.title}>My TrackKar</Text>
      <Text style={styles.subtitle}>Your tracked services and proximity alerts.</Text>

      <View style={styles.location}>
        <MapPin size={20} color={colors.primary} />
        <View style={{flex: 1}}>
          <Text style={styles.locationTitle}>Saved service location</Text>
          <Text style={styles.locationText}>Not set yet</Text>
        </View>
      </View>

      <View style={styles.empty}>
        <View style={styles.icon}><Radar size={31} color={colors.primary} /></View>
        <Text style={styles.emptyTitle}>Nothing tracked yet</Text>
        <Text style={styles.emptyText}>Discover a service and subscribe to a specific route for near-arrival alerts.</Text>
        <AppButton label="Find a service" arrow onPress={() => {}} />
      </View>

      <View style={styles.note}>
        <BellRing size={18} color={colors.warning} />
        <Text style={styles.noteText}>Alerts are designed around approximately 6 minutes and 3 minutes before arrival.</Text>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  title: {fontSize: 29, fontWeight: '900', color: colors.text},
  subtitle: {fontSize: 14, color: colors.muted},
  location: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 15, flexDirection: 'row', alignItems: 'center', gap: 11},
  locationTitle: {fontSize: 13.5, fontWeight: '900', color: colors.text},
  locationText: {fontSize: 12.5, color: colors.muted, marginTop: 2},
  empty: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 24, alignItems: 'center', gap: 11},
  icon: {width: 64, height: 64, borderRadius: 20, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center'},
  emptyTitle: {fontSize: 19, fontWeight: '900', color: colors.text},
  emptyText: {fontSize: 13.5, lineHeight: 20, color: colors.muted, textAlign: 'center'},
  note: {backgroundColor: '#FFFAEB', borderRadius: radius.md, padding: 15, flexDirection: 'row', gap: 10},
  noteText: {flex: 1, fontSize: 12.8, lineHeight: 18, color: colors.warning, fontWeight: '700'},
});