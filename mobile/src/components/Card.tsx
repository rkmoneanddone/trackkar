import React, {PropsWithChildren} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, radius, spacing} from '../theme/tokens';

type Props = PropsWithChildren<{
  title: string;
  subtitle?: string;
}>;

export function Card({title, subtitle, children}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  title: {fontSize: 18, fontWeight: '700', color: colors.text},
  subtitle: {fontSize: 14, lineHeight: 20, color: colors.muted},
});
