import React, {PropsWithChildren} from 'react';
import {ScrollView, StyleSheet, ViewStyle} from 'react-native';
import {colors, spacing} from '../theme/tokens';

type Props = PropsWithChildren<{
  contentContainerStyle?: ViewStyle;
}>;

export function Screen({children, contentContainerStyle}: Props) {
  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[styles.content, contentContainerStyle]}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.background},
  content: {padding: spacing.md, gap: spacing.md},
});
