import React, {useCallback, useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Copy, UsersRound} from 'lucide-react-native';
import {AppScreen} from '../../../components/AppScreen';
import {BrandHeader} from '../../../components/BrandHeader';
import {AppButton} from '../../../components/AppButton';
import {colors, radius} from '../../../theme/tokens';
import {createDriverInvite, listProviderMembers} from '../../provider/providerRepository';
import type {ProviderMember} from '../../provider/providerTypes';

export function TeamScreen() {
  const [members, setMembers] = useState<ProviderMember[]>([]);
  const [invite, setInvite] = useState<string | null>(null);
  const load = useCallback(() => { let active = true; listProviderMembers().then(items => active && setMembers(items));
    return () => { active = false; }; }, []);
  useFocusEffect(load);
  const create = async () => { try { setInvite(await createDriverInvite()); }
    catch (cause) { Alert.alert('Could not create invite', cause instanceof Error ? cause.message : String(cause)); } };
  return <AppScreen><BrandHeader compact /><Text style={styles.title}>Provider team</Text>
    <Text style={styles.subtitle}>Connect a driver without exposing private phone or email details.</Text>
    <View style={styles.card}><UsersRound size={24} color={colors.primary} />
      <Text style={styles.heading}>{Math.max(0, members.filter(item => item.role === 'DRIVER').length)} connected drivers</Text>
      {invite ? <View style={styles.code}><Copy size={18} color={colors.primary} />
        <Text style={styles.codeText}>{invite}</Text></View> : null}
      <Text style={styles.help}>{invite ? 'Give this one-time code to the driver.' : 'Generate an invite code when the driver is ready.'}</Text>
      <AppButton label="Generate driver invite" onPress={create} /></View>
  </AppScreen>;
}
const styles = StyleSheet.create({title: {fontSize: 29, fontWeight: '900', color: colors.text}, subtitle: {fontSize: 14, lineHeight: 20, color: colors.muted},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 18, gap: 12},
  heading: {fontSize: 17, fontWeight: '900', color: colors.text}, code: {flexDirection: 'row', gap: 9, alignItems: 'center', backgroundColor: colors.primarySoft, padding: 14, borderRadius: radius.md},
  codeText: {fontSize: 22, letterSpacing: 3, fontWeight: '900', color: colors.primary}, help: {fontSize: 13, color: colors.muted}});
