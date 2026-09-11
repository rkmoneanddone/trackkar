import React, {useCallback, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BusFront, CircleCheck, Hash, Tag} from 'lucide-react-native';
import {AppScreen} from '../../../components/AppScreen';
import {AppHeader} from '../../../components/AppHeader';
import {colors, radius} from '../../../theme/tokens';
import {getMyVehicle} from '../vehicleRepository';
import type {Vehicle} from '../vehicleTypes';
import type {VehicleStackParamList} from '../../../navigation/VehicleStackNavigator';

type Props = NativeStackScreenProps<VehicleStackParamList, 'VehicleDetails'>;

export function VehicleDetailsScreen({navigation, route}: Props) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      setError(null);

      getMyVehicle(route.params.vehicleId)
        .then(item => {
          if (active) {
            setVehicle(item);
            if (!item) {
              setError('This vehicle could not be found.');
            }
          }
        })
        .catch(cause => {
          if (active) {
            setVehicle(null);
            setError(cause instanceof Error ? cause.message : String(cause));
          }
        })
        .finally(() => {
          if (active) {
            setLoading(false);
          }
        });

      return () => {
        active = false;
      };
    }, [route.params.vehicleId]),
  );

  return (
    <AppScreen>
      <AppHeader title="Vehicle details" onBack={() => navigation.goBack()} />

      {loading ? (
        <View style={styles.card}>
          <Text style={styles.title}>Loading vehicle…</Text>
        </View>
      ) : error || !vehicle ? (
        <View style={styles.card}>
          <Text style={styles.title}>Vehicle unavailable</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <>
          <View style={styles.hero}>
            <View style={styles.icon}>
              <BusFront size={30} color={colors.primary} />
            </View>
            <View style={styles.heroText}>
              <Text style={styles.title}>{vehicle.displayName}</Text>
              <Text style={styles.registration}>{vehicle.registrationNumber}</Text>
              <View style={styles.statusRow}>
                <CircleCheck size={15} color={colors.success} />
                <Text style={styles.status}>Active</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.row}>
              <BusFront size={18} color={colors.primary} />
              <View style={styles.rowText}>
                <Text style={styles.label}>VEHICLE TYPE</Text>
                <Text style={styles.value}>{vehicle.vehicleType}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Hash size={18} color={colors.primary} />
              <View style={styles.rowText}>
                <Text style={styles.label}>REGISTRATION</Text>
                <Text style={styles.value}>{vehicle.registrationNumber}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Tag size={18} color={colors.primary} />
              <View style={styles.rowText}>
                <Text style={styles.label}>MAKE / MODEL</Text>
                <Text style={styles.value}>{vehicle.makeModel || 'Not added'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.nextCard}>
            <Text style={styles.nextTitle}>Next setup</Text>
            <Text style={styles.nextText}>
              Route creation and driver assignment will be linked to this vehicle in the
              next modules.
            </Text>
          </View>
        </>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  icon: {
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: {flex: 1, gap: 3},
  title: {fontSize: 20, fontWeight: '900', color: colors.text},
  registration: {fontSize: 14, fontWeight: '800', color: colors.textSoft},
  statusRow: {flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4},
  status: {fontSize: 12.5, fontWeight: '800', color: colors.success},
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    padding: 16,
  },
  row: {flexDirection: 'row', gap: 11, alignItems: 'center'},
  rowText: {flex: 1, gap: 2},
  label: {fontSize: 10, fontWeight: '900', letterSpacing: 0.7, color: colors.muted},
  value: {fontSize: 14, fontWeight: '800', color: colors.text},
  divider: {height: 1, backgroundColor: colors.border, marginVertical: 14},
  nextCard: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    padding: 14,
    gap: 4,
  },
  nextTitle: {fontSize: 12.5, fontWeight: '900', color: colors.text},
  nextText: {fontSize: 12.5, lineHeight: 18, color: colors.textSoft},
  errorText: {fontSize: 13.5, lineHeight: 20, color: colors.muted, marginTop: 6},
});
