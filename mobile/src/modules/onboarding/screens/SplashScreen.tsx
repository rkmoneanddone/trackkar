import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Navigation, Radio} from 'lucide-react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {onAuthStateChanged} from '@react-native-firebase/auth';
import type {RootStackParamList} from '../../../navigation/types';
import {colors, radius} from '../../../theme/tokens';
import {firebaseAuth} from '../../auth/firebaseAuth';
import {getAccountProfile} from '../../account/profileRepository';
import {ensureProvider} from '../../provider/providerRepository';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({navigation}: Props) {
  useEffect(() => onAuthStateChanged(firebaseAuth, async user => {
    if (!user) { navigation.replace('Welcome'); return; }
    try {
      const [profile, token] = await Promise.all([getAccountProfile(user.uid), user.getIdTokenResult()]);
      if (!profile) { navigation.replace('Welcome'); return; }
      if (token.claims.admin === true || profile.primaryRole === 'ADMIN') {
        navigation.replace('AdminApp');
      } else if (profile.primaryRole === 'OPERATOR' || profile.primaryRole === 'OPERATOR_DRIVER') {
        await ensureProvider(profile);
        navigation.replace('OperatorApp');
      } else if (profile.primaryRole === 'DRIVER') {
        navigation.replace('DriverApp');
      } else {
        navigation.replace('SubscriberApp');
      }
    } catch {
      navigation.replace('Welcome');
    }
  }), [navigation]);

  return <View style={styles.root}><View style={styles.logo}>
    <Navigation size={36} color={colors.white} strokeWidth={2.6} />
  </View><Text style={styles.brand}>TrackKar</Text><View style={styles.tagRow}>
    <Radio size={14} color="#D9E2FF" /><Text style={styles.tag}>Restoring your secure session…</Text>
  </View></View>;
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.dark, alignItems: 'center', justifyContent: 'center'},
  logo: {width: 78, height: 78, borderRadius: radius.xl, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 16},
  brand: {fontSize: 40, fontWeight: '900', color: colors.white, letterSpacing: -1.1},
  tagRow: {flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8}, tag: {fontSize: 14, color: '#D9E2FF', fontWeight: '600'},
});
