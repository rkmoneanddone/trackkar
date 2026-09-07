import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors, radius} from '../theme/tokens';

type Props = {
  onPress: () => void;
  disabled?: boolean;
};

export function GoogleButton({onPress, disabled}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Continue with Google"
      disabled={disabled}
      onPress={onPress}
      style={({pressed}) => [
        styles.button,
        pressed && !disabled && {opacity: 0.82},
        disabled && {opacity: 0.55},
      ]}>
      <View style={styles.googleMark}>
        <Text style={styles.googleLetter}>G</Text>
      </View>
      <Text style={styles.text}>Continue with Google</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 11,
    paddingHorizontal: 16,
  },
  googleMark: {
    width: 25,
    height: 25,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  googleLetter: {
    fontSize: 15,
    fontWeight: '900',
    color: '#4285F4',
  },
  text: {
    fontSize: 15.5,
    fontWeight: '800',
    color: colors.text,
  },
});