import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {CarFront, UsersRound} from 'lucide-react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../../navigation/types';
import {AppScreen} from '../../../components/AppScreen';
import {AppHeader} from '../../../components/AppHeader';
import {ChoiceCard} from '../../../components/ChoiceCard';
import {colors} from '../../../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'OperatorMode'>;

export function OperatorModeScreen({navigation}: Props) {
  return (
    <AppScreen>
      <AppHeader title="Service operator" onBack={() => navigation.goBack()} />

      <Text style={styles.title}>Will you also drive?</Text>
      <Text style={styles.subtitle}>
        This keeps solo operators simple while allowing fleets to link separate drivers later.
      </Text>

      <ChoiceCard
        title="Yes, I also drive"
        subtitle="One account will operate the service and drive the vehicle."
        icon={<CarFront size={25} color={colors.primary} />}
        onPress={() => navigation.navigate('Register', {role: 'OPERATOR_DRIVER'})}
      />

      <ChoiceCard
        title="No, I manage the service"
        subtitle="Create the operator account. Drivers can be linked later."
        icon={<UsersRound size={25} color={colors.primary} />}
        onPress={() => navigation.navigate('Register', {role: 'OPERATOR'})}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  title: {fontSize: 28, fontWeight: '900', color: colors.text, marginTop: 8},
  subtitle: {fontSize: 14.5, lineHeight: 21, color: colors.muted, marginBottom: 4},
});