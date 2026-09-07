import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Route} from 'lucide-react-native';
import {AppScreen} from '../../../components/AppScreen';
import {BrandHeader} from '../../../components/BrandHeader';
import {colors, radius} from '../../../theme/tokens';

export function DriverRoutesScreen() {
  return (
    <AppScreen>
      <BrandHeader compact />
      <Text style={styles.title}>My routes</Text>
      <Text style={styles.subtitle}>Outbound and return directions are separate learned routes.</Text>
      <View style={styles.empty}>
        <Route size={31} color={colors.primary} />
        <Text style={styles.emptyTitle}>No assigned routes</Text>
        <Text style={styles.emptyText}>Once an operator links you to a vehicle and route, it will appear here.</Text>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  title: {fontSize: 29, fontWeight: '900', color: colors.text},
  subtitle: {fontSize: 14, lineHeight: 20, color: colors.muted},
  empty: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 24, alignItems: 'center', gap: 11},
  emptyTitle: {fontSize: 19, fontWeight: '900', color: colors.text},
  emptyText: {fontSize: 13.5, lineHeight: 20, color: colors.muted, textAlign: 'center'},
});