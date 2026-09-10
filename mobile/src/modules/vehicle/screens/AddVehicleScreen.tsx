import React, {useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BusFront, Hash, Save, Tag} from 'lucide-react-native';
import {AppScreen} from '../../../components/AppScreen';
import {AppHeader} from '../../../components/AppHeader';
import {AppButton} from '../../../components/AppButton';
import {TextField} from '../../../components/TextField';
import {colors, radius} from '../../../theme/tokens';
import {createVehicle} from '../vehicleRepository';
import {
  formatVehicleRegistrationInput,
  validateRequiredText,
  validateVehicleRegistration,
} from '../vehicleValidation';
import type {VehicleStackParamList} from '../../../navigation/VehicleStackNavigator';

type Props = NativeStackScreenProps<VehicleStackParamList, 'AddVehicle'>;

export function AddVehicleScreen({navigation}: Props) {
  const [displayName, setDisplayName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [makeModel, setMakeModel] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    const nameError = validateRequiredText(displayName, 'Vehicle name', 40);
    if (nameError) {
      Alert.alert('Check vehicle details', nameError);
      return;
    }

    const typeError = validateRequiredText(vehicleType, 'Vehicle type', 30);
    if (typeError) {
      Alert.alert('Check vehicle details', typeError);
      return;
    }

    if (makeModel.trim().length > 50) {
      Alert.alert(
        'Check vehicle details',
        'Make / model must be 50 characters or fewer.',
      );
      return;
    }

    const registrationResult = validateVehicleRegistration(registrationNumber);

    if (!registrationResult.ok) {
      Alert.alert('Check registration number', registrationResult.message);
      return;
    }

    try {
      setSaving(true);

      const vehicleId = await createVehicle({
        displayName: displayName.trim(),
        registrationNumber: registrationResult.normalizedRegistration,
        vehicleType: vehicleType.trim(),
        makeModel: makeModel.trim(),
      });

      navigation.replace('VehicleDetails', {vehicleId});
    } catch (error) {
      Alert.alert(
        'Could not add vehicle',
        error instanceof Error ? error.message : String(error),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppScreen>
      <AppHeader title="Add vehicle" onBack={() => navigation.goBack()} />

      <View style={styles.hero}>
        <View style={styles.icon}>
          <BusFront size={28} color={colors.primary} />
        </View>
        <View style={styles.heroText}>
          <Text style={styles.title}>Add a vehicle</Text>
          <Text style={styles.subtitle}>
            Add the vehicle first. Route, driver assignment and live tracking come next.
          </Text>
        </View>
      </View>

      <View style={styles.form}>
        <TextField
          label="Vehicle name"
          placeholder="Example: Bus 01"
          value={displayName}
          maxLength={40}
          onChangeText={setDisplayName}
          icon={<Tag size={18} color={colors.muted} />}
        />

        <TextField
          label="Registration number"
          placeholder="Example: JH01AB1234"
          value={registrationNumber}
          maxLength={10}
          autoCapitalize="characters"
          autoCorrect={false}
          onChangeText={value =>
            setRegistrationNumber(formatVehicleRegistrationInput(value))
          }
          icon={<Hash size={18} color={colors.muted} />}
        />

        <Text style={styles.helper}>
          10 letters/numbers only. Spaces and symbols are removed automatically.
        </Text>

        <TextField
          label="Vehicle type"
          placeholder="Bus, Van, Car, Truck..."
          value={vehicleType}
          maxLength={30}
          onChangeText={setVehicleType}
          icon={<BusFront size={18} color={colors.muted} />}
        />

        <TextField
          label="Make / model (optional)"
          placeholder="Example: Tata Winger"
          value={makeModel}
          maxLength={50}
          onChangeText={setMakeModel}
          icon={<Tag size={18} color={colors.muted} />}
        />
      </View>

      <View style={styles.note}>
        <Text style={styles.noteTitle}>TrackKar vehicle record</Text>
        <Text style={styles.noteText}>
          Vehicle identity is kept separately from routes and drivers so the same vehicle
          can be reused across future assignments.
        </Text>
      </View>

      <AppButton
        label={saving ? 'Saving vehicleâ€¦' : 'Save vehicle'}
        icon={<Save size={18} color={colors.white} />}
        onPress={save}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  hero: {flexDirection: 'row', gap: 14, alignItems: 'flex-start'},
  icon: {
    width: 54,
    height: 54,
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: {flex: 1, gap: 5},
  title: {fontSize: 26, lineHeight: 31, fontWeight: '900', color: colors.text},
  subtitle: {fontSize: 13.5, lineHeight: 19, color: colors.muted},
  form: {gap: 12},
  helper: {fontSize: 11.5, lineHeight: 16, color: colors.muted, marginTop: -5},
  note: {
    borderRadius: radius.md,
    padding: 14,
    gap: 4,
    backgroundColor: colors.primarySoft,
  },
  noteTitle: {fontSize: 12.5, fontWeight: '900', color: colors.text},
  noteText: {fontSize: 12.5, lineHeight: 18, color: colors.textSoft},
});