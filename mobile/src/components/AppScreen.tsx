import React, {PropsWithChildren} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {colors} from '../theme/tokens';

export function AppScreen({children}: PropsWithChildren) {
  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.bg},
  content: {flexGrow: 1, padding: 20, gap: 16},
});