import React from 'react';
import {StyleSheet, Text, TextInput, TextInputProps, View} from 'react-native';
import {colors, radius} from '../theme/tokens';

type Props = TextInputProps & {label: string; icon?: React.ReactNode};

export function TextField({label, icon, ...props}: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.box}>
        {icon}
        <TextInput {...props} placeholderTextColor="#98A2B3" style={styles.input} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {gap: 7},
  label: {fontSize: 13.5, fontWeight: '800', color: colors.textSoft},
  box: {
    minHeight: 52, backgroundColor: colors.surface, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14,
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  input: {flex: 1, fontSize: 15.5, color: colors.text, paddingVertical: 0},
});