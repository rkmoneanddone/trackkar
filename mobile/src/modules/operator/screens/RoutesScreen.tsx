import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {MapPinned, Plus, Route, Sparkles} from 'lucide-react-native';
import {AppScreen} from '../../../components/AppScreen';
import {BrandHeader} from '../../../components/BrandHeader';
import {AppButton} from '../../../components/AppButton';
import {colors, radius} from '../../../theme/tokens';

export function RoutesScreen() {
  return (
    <AppScreen>
      <BrandHeader compact />
      <Text style={styles.title}>Routes</Text>
      <Text style={styles.subtitle}>Add route identity and main points. TrackKar learns the real path during normal service trips.</Text>

      <View style={styles.learning}>
        <View style={styles.learningTop}>
          <View style={styles.learningIcon}><Sparkles size={22} color={colors.primary} /></View>
          <View style={{flex: 1}}>
            <Text style={styles.learningTitle}>Automatic route learning</Text>
            <Text style={styles.learningText}>Three sufficiently matching valid completed trips become one learned route.</Text>
          </View>
        </View>
        <Trip label="Trip 1" />
        <Trip label="Trip 2" />
        <Trip label="Trip 3" />
      </View>

      <View style={styles.empty}>
        <MapPinned size={31} color={colors.primary} />
        <Text style={styles.emptyTitle}>No routes yet</Text>
        <Text style={styles.emptyText}>Example: Manan Vidya â†’ BIT Mesra â†’ Booty More â†’ Pitambra.</Text>
        <AppButton label="Add route" icon={<Plus size={19} color={colors.white} />} onPress={() => {}} />
      </View>
    </AppScreen>
  );
}

function Trip({label}: {label: string}) {
  return (
    <View style={styles.trip}>
      <Route size={17} color={colors.muted} />
      <Text style={styles.tripLabel}>{label}</Text>
      <Text style={styles.tripState}>Pending</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {fontSize: 29, fontWeight: '900', color: colors.text},
  subtitle: {fontSize: 14, lineHeight: 20, color: colors.muted},
  learning: {backgroundColor: colors.primarySoft, borderRadius: radius.lg, padding: 16, gap: 9},
  learningTop: {flexDirection: 'row', alignItems: 'center', gap: 12},
  learningIcon: {width: 46, height: 46, borderRadius: radius.md, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center'},
  learningTitle: {fontSize: 16, fontWeight: '900', color: colors.text},
  learningText: {fontSize: 12.8, lineHeight: 18, color: colors.textSoft, marginTop: 3},
  trip: {flexDirection: 'row', alignItems: 'center', minHeight: 34, gap: 9},
  tripLabel: {flex: 1, fontSize: 13, fontWeight: '800', color: colors.text},
  tripState: {fontSize: 11.5, fontWeight: '800', color: colors.muted},
  empty: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 24, alignItems: 'center', gap: 11},
  emptyTitle: {fontSize: 19, fontWeight: '900', color: colors.text},
  emptyText: {fontSize: 13.5, lineHeight: 20, color: colors.muted, textAlign: 'center'},
});