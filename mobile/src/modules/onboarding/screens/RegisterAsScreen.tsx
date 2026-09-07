import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {BusFront, Radar, UserRoundCog} from 'lucide-react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../../navigation/types';
import {AppScreen} from '../../../components/AppScreen';
import {AppHeader} from '../../../components/AppHeader';
import {ChoiceCard} from '../../../components/ChoiceCard';
import {colors} from '../../../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'RegisterAs'>;

export function RegisterAsScreen({navigation}: Props) {
  return (
    <AppScreen>
      <AppHeader title="Choose how you use TrackKar" onBack={() => navigation.goBack()} />

      <Text style={styles.title}>I want toâ€¦</Text>
      <Text style={styles.subtitle}>
        Choose the option that matches what you need now.
      </Text>

      <ChoiceCard
        title="Operate a vehicle / service"
        subtitle="For individual owner-drivers, vehicle owners and fleet operators."
        icon={<UserRoundCog size={25} color={colors.primary} />}
        onPress={() => navigation.navigate('OperatorMode')}
      />

      <ChoiceCard
        title="Join as driver"
        subtitle="For a driver working for another operator."
        icon={<BusFront size={25} color={colors.primary} />}
        onPress={() => navigation.navigate('Register', {role: 'DRIVER'})}
      />

      <ChoiceCard
        title="Track a service"
        subtitle="For parents, residents, employees and other subscribers."
        icon={<Radar size={25} color={colors.primary} />}
        onPress={() => navigation.navigate('Register', {role: 'SUBSCRIBER'})}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  title: {fontSize: 28, lineHeight: 34, fontWeight: '900', color: colors.text, marginTop: 8},
  subtitle: {fontSize: 14.5, lineHeight: 21, color: colors.muted, marginBottom: 4},
});