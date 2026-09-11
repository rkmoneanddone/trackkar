import React, {useEffect, useState} from 'react';
import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BusFront, MapPinned, Route as RouteIcon, Save} from 'lucide-react-native';
import {AppScreen} from '../../../components/AppScreen';
import {AppHeader} from '../../../components/AppHeader';
import {AppButton} from '../../../components/AppButton';
import {TextField} from '../../../components/TextField';
import {colors, radius} from '../../../theme/tokens';
import {listMyVehicles} from '../../vehicle/vehicleRepository';
import type {Vehicle} from '../../vehicle/vehicleTypes';
import {createRoute} from '../routeRepository';
import type {RouteDirection} from '../routeTypes';
import {MAX_ROUTE_NAME_LENGTH, validateRouteName} from '../routeValidation';
import type {RouteStackParamList} from '../../../navigation/RouteStackNavigator';

type Props = NativeStackScreenProps<RouteStackParamList, 'AddRoute'>;
const directions: Array<{value: RouteDirection; label: string}> = [
  {value: 'OUTBOUND', label: 'Outbound'}, {value: 'RETURN', label: 'Return'}, {value: 'CUSTOM', label: 'Custom'},
];

export function AddRouteScreen({navigation}: Props) {
  const [routeName, setRouteName] = useState('');
  const [vehicleId, setVehicleId] = useState<string | null>(null);
  const [direction, setDirection] = useState<RouteDirection>('OUTBOUND');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    listMyVehicles().then(items => {
      if (active) { setVehicles(items); setVehicleId(items[0]?.id || null); }
    }).catch(error => active && Alert.alert('Could not load vehicles', String(error)))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const save = async () => {
    if (saving) return;
    const nameError = validateRouteName(routeName);
    if (nameError) return Alert.alert('Check route details', nameError);
    if (!vehicleId) return Alert.alert('Vehicle required', 'Add or select a vehicle first.');
    try {
      setSaving(true);
      const routeId = await createRoute({routeName, vehicleId, directionType: direction});
      navigation.replace('RouteDetails', {routeId});
    } catch (error) {
      Alert.alert('Could not add route', error instanceof Error ? error.message : String(error));
    } finally { setSaving(false); }
  };

  return (
    <AppScreen>
      <AppHeader title="Add route" onBack={() => navigation.goBack()} />
      <View style={styles.hero}>
        <MapPinned size={29} color={colors.primary} />
        <View style={styles.grow}>
          <Text style={styles.title}>Create route identity</Text>
          <Text style={styles.subtitle}>Save the name, vehicle and direction now. TrackKar records the real path during service trips.</Text>
        </View>
      </View>
      <TextField label="Route name" placeholder="Example: Booty More to Manan Vidya" value={routeName} maxLength={MAX_ROUTE_NAME_LENGTH} onChangeText={setRouteName} icon={<RouteIcon size={18} color={colors.muted} />} />
      <Text style={styles.sectionLabel}>VEHICLE</Text>
      {loading ? <Text style={styles.muted}>Loading vehicles…</Text> : null}
      {!loading && vehicles.length === 0 ? <Text style={styles.muted}>No vehicle is available. Add a vehicle first.</Text> : null}
      {vehicles.map(vehicle => (
        <Pressable key={vehicle.id} onPress={() => setVehicleId(vehicle.id)} style={[styles.choice, vehicleId === vehicle.id && styles.choiceSelected]}>
          <BusFront size={20} color={colors.primary} />
          <View style={styles.grow}><Text style={styles.choiceTitle}>{vehicle.displayName}</Text><Text style={styles.muted}>{vehicle.registrationNumber}</Text></View>
        </Pressable>
      ))}
      <Text style={styles.sectionLabel}>DIRECTION</Text>
      <View style={styles.directionRow}>
        {directions.map(item => (
          <Pressable key={item.value} onPress={() => setDirection(item.value)} style={[styles.direction, direction === item.value && styles.directionSelected]}>
            <Text style={[styles.directionText, direction === item.value && styles.directionTextSelected]}>{item.label}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.note}><Text style={styles.noteTitle}>Main points and path</Text><Text style={styles.noteText}>Start/end points will come from Google Maps or GPS recording. They are never typed manually.</Text></View>
      <AppButton label={saving ? 'Saving route…' : 'Save route draft'} icon={<Save size={18} color={colors.white} />} onPress={save} disabled={saving || loading || vehicles.length === 0} />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  hero: {flexDirection: 'row', gap: 13, alignItems: 'flex-start'}, grow: {flex: 1},
  title: {fontSize: 24, fontWeight: '900', color: colors.text}, subtitle: {fontSize: 13.5, lineHeight: 19, color: colors.muted, marginTop: 5},
  sectionLabel: {fontSize: 11, fontWeight: '900', letterSpacing: 0.8, color: colors.muted}, muted: {fontSize: 12.5, lineHeight: 18, color: colors.muted},
  choice: {flexDirection: 'row', alignItems: 'center', gap: 11, padding: 14, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, backgroundColor: colors.surface}, choiceSelected: {borderColor: colors.primary, backgroundColor: colors.primarySoft}, choiceTitle: {fontSize: 14, fontWeight: '900', color: colors.text},
  directionRow: {flexDirection: 'row', gap: 8}, direction: {flex: 1, paddingVertical: 11, alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, backgroundColor: colors.surface}, directionSelected: {borderColor: colors.primary, backgroundColor: colors.primary}, directionText: {fontSize: 12, fontWeight: '800', color: colors.textSoft}, directionTextSelected: {color: colors.white},
  note: {padding: 14, gap: 4, borderRadius: radius.md, backgroundColor: colors.primarySoft}, noteTitle: {fontSize: 13, fontWeight: '900', color: colors.text}, noteText: {fontSize: 12.5, lineHeight: 18, color: colors.textSoft},
});
