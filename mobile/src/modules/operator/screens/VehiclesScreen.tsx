import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {BusFront, Plus, ShieldCheck} from 'lucide-react-native';
import {AppScreen} from '../../../components/AppScreen';
import {BrandHeader} from '../../../components/BrandHeader';
import {AppButton} from '../../../components/AppButton';
import {colors, radius} from '../../../theme/tokens';

export function VehiclesScreen() {
  return (
    <AppScreen>
      <BrandHeader compact />
      <Text style={styles.title}>Vehicles</Text>
      <Text style={styles.subtitle}>Vehicles you operate or manage will appear here.</Text>
      <View style={styles.empty}>
        <View style={styles.icon}><BusFront size={31} color={colors.primary} /></View>
        <Text style={styles.emptyTitle}>No vehicles yet</Text>
        <Text style={styles.emptyText}>Add your first vehicle before creating routes and driver assignments.</Text>
        <View style={styles.note}><ShieldCheck size={17} color={colors.success} /><Text style={styles.noteText}>Vehicle changes will be versioned instead of silently overwritten.</Text></View>
        <AppButton label="Add vehicle" icon={<Plus size={19} color={colors.white} />} onPress={() => {}} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  title: {fontSize: 29, fontWeight: '900', color: colors.text},
  subtitle: {fontSize: 14, color: colors.muted},
  empty: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 24, alignItems: 'center', gap: 11},
  icon: {width: 64, height: 64, borderRadius: 20, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center'},
  emptyTitle: {fontSize: 19, fontWeight: '900', color: colors.text},
  emptyText: {fontSize: 13.5, lineHeight: 20, color: colors.muted, textAlign: 'center'},
  note: {flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginVertical: 5},
  noteText: {flex: 1, fontSize: 12.3, lineHeight: 18, color: colors.success},
});