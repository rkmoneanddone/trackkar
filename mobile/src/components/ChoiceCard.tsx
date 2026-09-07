import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {ChevronRight} from 'lucide-react-native';
import {colors, radius} from '../theme/tokens';

type Props = {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onPress: () => void;
};

export function ChoiceCard({title, subtitle, icon, onPress}: Props) {
  return (
    <Pressable onPress={onPress} style={({pressed}) => [styles.card, pressed && {opacity: 0.88}]}>
      <View style={styles.icon}>{icon}</View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <ChevronRight size={20} color={colors.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1,
    borderColor: colors.border, padding: 16, flexDirection: 'row', alignItems: 'center',
    gap: 14, elevation: 2,
  },
  icon: {
    width: 50, height: 50, borderRadius: radius.md, backgroundColor: colors.primarySoft,
    alignItems: 'center', justifyContent: 'center',
  },
  copy: {flex: 1, gap: 4},
  title: {fontSize: 16.5, fontWeight: '900', color: colors.text},
  subtitle: {fontSize: 13.2, lineHeight: 19, color: colors.muted},
});