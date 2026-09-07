import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {ArrowRight} from 'lucide-react-native';
import {colors, radius} from '../theme/tokens';

type Props = {
  label: string;
  onPress: () => void;
  secondary?: boolean;
  icon?: React.ReactNode;
  arrow?: boolean;
};

export function AppButton({label, onPress, secondary, icon, arrow}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.base,
        secondary ? styles.secondary : styles.primary,
        pressed && {opacity: 0.86},
      ]}>
      <View style={styles.left}>
        {icon}
        <Text style={[styles.label, secondary ? styles.darkText : styles.lightText]}>{label}</Text>
      </View>
      {arrow ? <ArrowRight size={19} color={secondary ? colors.text : colors.white} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 54, borderRadius: radius.md, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  primary: {backgroundColor: colors.primary},
  secondary: {backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border},
  left: {flexDirection: 'row', alignItems: 'center', gap: 10},
  label: {fontSize: 15.5, fontWeight: '800'},
  lightText: {color: colors.white},
  darkText: {color: colors.text},
});