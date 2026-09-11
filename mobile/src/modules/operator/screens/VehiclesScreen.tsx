import React, {useCallback, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BusFront, ChevronRight, Plus, ShieldCheck} from 'lucide-react-native';
import {AppScreen} from '../../../components/AppScreen';
import {BrandHeader} from '../../../components/BrandHeader';
import {AppButton} from '../../../components/AppButton';
import {colors, radius} from '../../../theme/tokens';
import {listMyVehicles} from '../../vehicle/vehicleRepository';
import type {Vehicle} from '../../vehicle/vehicleTypes';
import type {VehicleStackParamList} from '../../../navigation/VehicleStackNavigator';

type Props = NativeStackScreenProps<VehicleStackParamList, 'VehicleList'>;

export function VehiclesScreen({navigation}: Props) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      setError(null);

      listMyVehicles()
        .then(items => {
          if (active) {
            setVehicles(items);
          }
        })
        .catch(cause => {
          if (active) {
            setVehicles([]);
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
    }, []),
  );

  return (
    <AppScreen>
      <BrandHeader compact />

      <View style={styles.heading}>
        <View style={styles.headingText}>
          <Text style={styles.title}>Vehicles</Text>
          <Text style={styles.subtitle}>
            Vehicles you operate or manage.
          </Text>
        </View>

        {vehicles.length > 0 ? (
          <Pressable
            style={styles.addMini}
            onPress={() => navigation.navigate('AddVehicle')}>
            <Plus size={19} color={colors.white} />
          </Pressable>
        ) : null}
      </View>

      {loading ? (
        <View style={styles.loadingCard}>
          <Text style={styles.loadingText}>Loading vehicles…</Text>
        </View>
      ) : error ? (
        <View style={styles.loadingCard}>
          <Text style={styles.errorTitle}>Could not load vehicles</Text>
          <Text style={styles.loadingText}>{error}</Text>
        </View>
      ) : vehicles.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.icon}>
            <BusFront size={31} color={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>No vehicles yet</Text>
          <Text style={styles.emptyText}>
            Add your first vehicle before creating routes and driver assignments.
          </Text>
          <View style={styles.note}>
            <ShieldCheck size={17} color={colors.success} />
            <Text style={styles.noteText}>
              Vehicle changes are designed to be versioned instead of silently overwritten.
            </Text>
          </View>
          <AppButton
            label="Add vehicle"
            icon={<Plus size={19} color={colors.white} />}
            onPress={() => navigation.navigate('AddVehicle')}
          />
        </View>
      ) : (
        <View style={styles.list}>
          {vehicles.map(vehicle => (
            <Pressable
              key={vehicle.id}
              style={styles.vehicleCard}
              onPress={() =>
                navigation.navigate('VehicleDetails', {vehicleId: vehicle.id})
              }>
              <View style={styles.vehicleIcon}>
                <BusFront size={23} color={colors.primary} />
              </View>

              <View style={styles.vehicleBody}>
                <Text style={styles.vehicleName}>{vehicle.displayName}</Text>
                <Text style={styles.vehicleMeta}>
                  {vehicle.registrationNumber} · {vehicle.vehicleType}
                </Text>
              </View>

              <ChevronRight size={20} color={colors.muted} />
            </Pressable>
          ))}
        </View>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  heading: {flexDirection: 'row', alignItems: 'center', gap: 12},
  headingText: {flex: 1, gap: 3},
  title: {fontSize: 29, fontWeight: '900', color: colors.text},
  subtitle: {fontSize: 14, color: colors.muted},
  addMini: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 20,
  },
  loadingText: {fontSize: 13.5, color: colors.muted},
  errorTitle: {fontSize: 15, fontWeight: '900', color: colors.text, marginBottom: 6},
  empty: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 24,
    alignItems: 'center',
    gap: 11,
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {fontSize: 19, fontWeight: '900', color: colors.text},
  emptyText: {
    fontSize: 13.5,
    lineHeight: 20,
    color: colors.muted,
    textAlign: 'center',
  },
  note: {flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginVertical: 5},
  noteText: {flex: 1, fontSize: 12.3, lineHeight: 18, color: colors.success},
  list: {gap: 10},
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  vehicleIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleBody: {flex: 1, gap: 3},
  vehicleName: {fontSize: 15, fontWeight: '900', color: colors.text},
  vehicleMeta: {fontSize: 12.5, color: colors.muted},
});
