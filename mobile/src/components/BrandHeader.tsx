import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Navigation, Radio} from 'lucide-react-native';
import {colors, radius} from '../theme/tokens';

export function BrandHeader({compact = false}: {compact?: boolean}) {
  return (
    <View style={styles.row}>
      <View style={[styles.logo, compact && styles.logoCompact]}>
        <Navigation size={compact ? 18 : 23} color={colors.primary} strokeWidth={2.5} />
      </View>
      <View>
        <Text style={[styles.brand, compact && styles.brandCompact]}>TrackKar</Text>
        {!compact ? (
          <View style={styles.tagRow}>
            <Radio size={13} color={colors.primary} />
            <Text style={styles.tag}>Track it. Know when it is near.</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'center', gap: 12},
  logo: {
    width: 44, height: 44, borderRadius: radius.md,
    backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center',
  },
  logoCompact: {width: 38, height: 38},
  brand: {fontSize: 25, fontWeight: '900', color: colors.text, letterSpacing: -0.7},
  brandCompact: {fontSize: 20},
  tagRow: {flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2},
  tag: {fontSize: 12, color: colors.muted, fontWeight: '600'},
});