import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {BellRing, MapPin, Route, ShieldCheck} from 'lucide-react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../../navigation/types';
import {AppScreen} from '../../../components/AppScreen';
import {BrandHeader} from '../../../components/BrandHeader';
import {AppButton} from '../../../components/AppButton';
import {colors, radius} from '../../../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export function WelcomeScreen({navigation}: Props) {
  return (
    <AppScreen>
      <BrandHeader />

      <View style={styles.hero}>
        <Text style={styles.kicker}>LIVE SERVICE PROXIMITY</Text>
        <Text style={styles.title}>Know when your service is actually near.</Text>
        <Text style={styles.subtitle}>
          TrackKar learns real routes from actual trips and alerts subscribers before the service reaches them.
        </Text>
      </View>

      <View style={styles.grid}>
        <Feature icon={<Route size={21} color={colors.primary} />} title="Learns real routes" text="Normal trips teach TrackKar the actual path." />
        <Feature icon={<BellRing size={21} color={colors.primary} />} title="Useful alerts" text="Near-arrival alerts instead of constant checking." />
        <Feature icon={<MapPin size={21} color={colors.primary} />} title="Saved location" text="Set once. No continuous subscriber tracking." />
        <Feature icon={<ShieldCheck size={21} color={colors.primary} />} title="Privacy-first" text="Only the location data needed for the service." />
      </View>

      <View style={styles.actions}>
        <AppButton label="Get started" arrow onPress={() => navigation.navigate('RegisterAs')} />
      </View>
    </AppScreen>
  );
}

function Feature({icon, title, text}: {icon: React.ReactNode; title: string; text: string}) {
  return (
    <View style={styles.feature}>
      {icon}
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {gap: 10, marginTop: 14},
  kicker: {fontSize: 11.5, letterSpacing: 1.1, fontWeight: '900', color: colors.primary},
  title: {fontSize: 34, lineHeight: 40, fontWeight: '900', letterSpacing: -1, color: colors.text},
  subtitle: {fontSize: 15.5, lineHeight: 23, color: colors.textSoft},
  grid: {flexDirection: 'row', flexWrap: 'wrap', gap: 12},
  feature: {
    width: '48%',
    minHeight: 122,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 14,
    gap: 8,
  },
  featureTitle: {fontSize: 14, fontWeight: '900', color: colors.text},
  featureText: {fontSize: 12.3, lineHeight: 17, color: colors.muted},
  actions: {gap: 10, marginTop: 8},
});