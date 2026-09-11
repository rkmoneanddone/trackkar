import React, {useCallback, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {BrandHeader} from '../../../components/BrandHeader';
import {AppScreen} from '../../../components/AppScreen';
import {colors, radius} from '../../../theme/tokens';
import {getAdminDashboardCounts} from '../adminRepository';

type Counts = Awaited<ReturnType<typeof getAdminDashboardCounts>>;
export function AdminDashboardScreen() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [error, setError] = useState<string | null>(null);
  useFocusEffect(useCallback(() => {
    let active = true; setError(null);
    getAdminDashboardCounts().then(value => active && setCounts(value))
      .catch(cause => active && setError(cause instanceof Error ? cause.message : String(cause)));
    return () => { active = false; };
  }, []));
  return <AppScreen><BrandHeader compact /><Text style={styles.title}>TrackKar admin</Text>
    <Text style={styles.subtitle}>Platform oversight. Admin access requires a Firebase custom claim.</Text>
    {error ? <Text style={styles.error}>{error}</Text> : null}
    <View style={styles.grid}>{counts ? Object.entries(counts).map(([label, value]) =>
      <View key={label} style={styles.card}><Text style={styles.value}>{value}</Text>
        <Text style={styles.label}>{label.replace(/([A-Z])/g, ' $1')}</Text></View>) :
      <Text style={styles.subtitle}>Loading platform counts…</Text>}</View>
  </AppScreen>;
}
const styles = StyleSheet.create({title: {fontSize: 29, fontWeight: '900', color: colors.text},
  subtitle: {fontSize: 14, lineHeight: 20, color: colors.muted}, error: {color: colors.warning},
  grid: {flexDirection: 'row', flexWrap: 'wrap', gap: 12}, card: {width: '47%', backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 16},
  value: {fontSize: 25, fontWeight: '900', color: colors.text}, label: {fontSize: 12, color: colors.muted, textTransform: 'capitalize'}});
