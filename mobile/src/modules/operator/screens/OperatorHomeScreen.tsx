import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {BusFront, CircleCheckBig, MapPinned, Route, UsersRound} from 'lucide-react-native';
import {AppScreen} from '../../../components/AppScreen';
import {BrandHeader} from '../../../components/BrandHeader';
import {AppButton} from '../../../components/AppButton';
import {colors, radius} from '../../../theme/tokens';

export function OperatorHomeScreen() {
  return (
    <AppScreen>
      <BrandHeader compact />
      <Text style={styles.title}>Service overview</Text>
      <Text style={styles.subtitle}>Set up the vehicle, route and driver relationship once. Normal trips do the learning.</Text>

      <View style={styles.stats}>
        <Stat icon={<BusFront size={20} color={colors.primary} />} value="0" label="Vehicles" />
        <Stat icon={<Route size={20} color={colors.primary} />} value="0" label="Active routes" />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Get your first service live</Text>
        <Text style={styles.cardSub}>A short setup path designed for solo operators and fleets.</Text>
        <Step icon={<CircleCheckBig size={18} color={colors.success} />} text="Operator profile" state="Ready" />
        <Step icon={<BusFront size={18} color={colors.muted} />} text="Add vehicle" state="Next" />
        <Step icon={<MapPinned size={18} color={colors.muted} />} text="Add route + main points" state="Pending" />
        <Step icon={<UsersRound size={18} color={colors.muted} />} text="Link driver if needed" state="Optional" />
        <AppButton label="Add first vehicle" arrow onPress={() => {}} />
      </View>
    </AppScreen>
  );
}

function Stat({icon, value, label}: {icon: React.ReactNode; value: string; label: string}) {
  return (
    <View style={styles.stat}>
      <View style={styles.statTop}>{icon}<Text style={styles.statValue}>{value}</Text></View>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Step({icon, text, state}: {icon: React.ReactNode; text: string; state: string}) {
  return (
    <View style={styles.step}>
      <View style={styles.stepLeft}>{icon}<Text style={styles.stepText}>{text}</Text></View>
      <Text style={styles.stepState}>{state}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {fontSize: 29, fontWeight: '900', color: colors.text},
  subtitle: {fontSize: 14, lineHeight: 20, color: colors.muted},
  stats: {flexDirection: 'row', gap: 12},
  stat: {flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 16},
  statTop: {flexDirection: 'row', alignItems: 'center', gap: 8},
  statValue: {fontSize: 23, fontWeight: '900', color: colors.text},
  statLabel: {fontSize: 12.5, fontWeight: '700', color: colors.muted, marginTop: 7},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 16, gap: 10},
  cardTitle: {fontSize: 18, fontWeight: '900', color: colors.text},
  cardSub: {fontSize: 13.5, lineHeight: 19, color: colors.muted},
  step: {minHeight: 42, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: colors.border},
  stepLeft: {flexDirection: 'row', alignItems: 'center', gap: 10},
  stepText: {fontSize: 13.5, fontWeight: '700', color: colors.text},
  stepState: {fontSize: 11.5, fontWeight: '800', color: colors.muted},
});