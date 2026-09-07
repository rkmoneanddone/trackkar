import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {ArrowLeft, Navigation} from 'lucide-react-native';
import {colors, radius} from '../theme/tokens';

type Props = {
  title?: string;
  onBack?: () => void;
};

export function AppHeader({title, onBack}: Props) {
  return (
    <View style={styles.root}>
      {onBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={onBack}
          style={({pressed}) => [styles.back, pressed && {opacity: 0.7}]}>
          <ArrowLeft size={22} color={colors.text} strokeWidth={2.4} />
        </Pressable>
      ) : (
        <View style={styles.brandIcon}>
          <Navigation size={18} color={colors.primary} strokeWidth={2.5} />
        </View>
      )}

      <Text numberOfLines={1} style={styles.title}>
        {title || 'TrackKar'}
      </Text>

      <View style={styles.rightSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  back: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  brandIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
  title: {
    flex: 1,
    marginHorizontal: 12,
    fontSize: 17,
    fontWeight: '900',
    color: colors.text,
  },
  rightSpacer: {width: 42},
});