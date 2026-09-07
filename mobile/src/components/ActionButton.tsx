import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {colors, radius} from '../theme/tokens';

type Props = {
  label: string;
  onPress: () => void;
  secondary?: boolean;
};

export function ActionButton({label, onPress, secondary}: Props) {
  return (
    <Pressable
      style={[styles.button, secondary && styles.secondary]}
      onPress={onPress}>
      <Text style={[styles.label, secondary && styles.secondaryLabel]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {color: '#FFFFFF', fontWeight: '700', fontSize: 15},
  secondaryLabel: {color: colors.text},
});
