import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Search, SlidersHorizontal} from 'lucide-react-native';
import {AppScreen} from '../../../components/AppScreen';
import {BrandHeader} from '../../../components/BrandHeader';
import {TextField} from '../../../components/TextField';
import {colors, radius} from '../../../theme/tokens';

export function DiscoverScreen() {
  return (
    <AppScreen>
      <BrandHeader compact />
      <Text style={styles.title}>Discover services</Text>
      <Text style={styles.subtitle}>Find an active service by route, provider or location.</Text>
      <TextField label="Search" placeholder="Provider, route or place" icon={<Search size={19} color={colors.muted} />} />
      <View style={styles.filter}>
        <SlidersHorizontal size={18} color={colors.primary} />
        <Text style={styles.filterText}>Service type and route filters will sit here.</Text>
      </View>
      <View style={styles.empty}>
        <Search size={31} color={colors.primary} />
        <Text style={styles.emptyTitle}>Search to discover services</Text>
        <Text style={styles.emptyText}>Service cards will show operator, vehicle, route, verification and pricing where applicable.</Text>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  title: {fontSize: 29, fontWeight: '900', color: colors.text},
  subtitle: {fontSize: 14, color: colors.muted},
  filter: {backgroundColor: colors.primarySoft, borderRadius: radius.md, padding: 15, flexDirection: 'row', gap: 10},
  filterText: {flex: 1, fontSize: 12.8, color: colors.textSoft},
  empty: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 24, alignItems: 'center', gap: 11},
  emptyTitle: {fontSize: 19, fontWeight: '900', color: colors.text},
  emptyText: {fontSize: 13.5, lineHeight: 20, color: colors.muted, textAlign: 'center'},
});