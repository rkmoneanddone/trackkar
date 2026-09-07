import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {MapPinned, Play, Route} from 'lucide-react-native';
import {AppScreen} from '../../../components/AppScreen';
import {BrandHeader} from '../../../components/BrandHeader';
import {AppButton} from '../../../components/AppButton';
import {colors, radius} from '../../../theme/tokens';

export function DriverHomeScreen() {
  return (
    <AppScreen>
      <BrandHeader compact />
      <Text style={styles.title}>Driver</Text>
      <Text style={styles.subtitle}>Assigned routes and live trip controls.</Text>

      <View style={styles.status}><View style={styles.dot} /><Text style={styles.statusText}>No active route</Text></View>

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.icon}><Route size={22} color={colors.primary} /></View>
          <View style={{flex: 1}}>
            <Text style={styles.cardTitle}>No route assigned</Text>
            <Text style={styles.cardText}>Your linked operator's routes will appear here.</Text>
          </View>
        </View>
      </View>

      <AppButton label="Start route" icon={<Play size={19} color={colors.white} />} onPress={() => {}} />

      <View style={styles.learning}>
        <MapPinned size={19} color={colors.primary} />
        <View style={{flex: 1}}>
          <Text style={styles.learningTitle}>No separate recording mode</Text>
          <Text style={styles.learningText}>If the route is learning, normal completed trips are captured internally and validated automatically.</Text>
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  title: {fontSize: 29, fontWeight: '900', color: colors.text},
  subtitle: {fontSize: 14, color: colors.muted},
  status: {flexDirection: 'row', alignItems: 'center', gap: 8},
  dot: {width: 9, height: 9, borderRadius: 99, backgroundColor: '#98A2B3'},
  statusText: {fontSize: 12.5, fontWeight: '800', color: colors.muted},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 16},
  row: {flexDirection: 'row', alignItems: 'center', gap: 12},
  icon: {width: 48, height: 48, borderRadius: radius.md, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center'},
  cardTitle: {fontSize: 16, fontWeight: '900', color: colors.text},
  cardText: {fontSize: 12.8, lineHeight: 18, color: colors.muted, marginTop: 3},
  learning: {backgroundColor: colors.primarySoft, borderRadius: radius.lg, padding: 16, flexDirection: 'row', gap: 11},
  learningTitle: {fontSize: 14.5, fontWeight: '900', color: colors.text},
  learningText: {fontSize: 12.8, lineHeight: 18, color: colors.textSoft, marginTop: 3},
});