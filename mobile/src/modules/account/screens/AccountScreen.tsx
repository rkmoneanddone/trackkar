import React, {useCallback, useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from 'lucide-react-native';
import {signOut} from '@react-native-firebase/auth';
import {AppScreen} from '../../../components/AppScreen';
import {BrandHeader} from '../../../components/BrandHeader';
import {AppButton} from '../../../components/AppButton';
import {colors, radius} from '../../../theme/tokens';
import {firebaseAuth} from '../../auth/firebaseAuth';
import {
  getAccountProfile,
  type AccountProfile,
} from '../profileRepository';

export function AccountScreen() {
  const navigation = useNavigation<any>();
  const [profile, setProfile] = useState<AccountProfile | null>(null);

  useFocusEffect(
    useCallback(() => {
      const uid = firebaseAuth.currentUser?.uid;

      if (!uid) {
        setProfile(null);
        return;
      }

      getAccountProfile(uid)
        .then(setProfile)
        .catch(() => setProfile(null));
    }, []),
  );

  const logout = () => {
    Alert.alert(
      'Log out of TrackKar?',
      'You can sign in again using your Google account.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Log out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(firebaseAuth);

              const root = navigation.getParent();

              root?.reset({
                index: 0,
                routes: [{name: 'Welcome'}],
              });
            } catch (error) {
              Alert.alert(
                'Could not log out',
                error instanceof Error ? error.message : String(error),
              );
            }
          },
        },
      ],
    );
  };

  return (
    <AppScreen>
      <BrandHeader compact />

      <Text style={styles.title}>Account</Text>
      <Text style={styles.subtitle}>
        Your signed-in TrackKar identity and account controls.
      </Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <UserRound size={27} color={colors.primary} />
        </View>

        <View style={styles.profileText}>
          <Text style={styles.name}>
            {profile?.displayName || firebaseAuth.currentUser?.displayName || 'TrackKar user'}
          </Text>

          <View style={styles.verified}>
            <ShieldCheck size={14} color={colors.success} />
            <Text style={styles.verifiedText}>Verified account</Text>
          </View>
        </View>
      </View>

      <View style={styles.detailCard}>
        <View style={styles.row}>
          <Mail size={18} color={colors.primary} />
          <View style={styles.rowText}>
            <Text style={styles.label}>EMAIL</Text>
            <Text style={styles.value}>
              {profile?.email || firebaseAuth.currentUser?.email || 'Not available'}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Phone size={18} color={colors.primary} />
          <View style={styles.rowText}>
            <Text style={styles.label}>MOBILE</Text>
            <Text style={styles.value}>
              {profile?.phoneNumber ||
                firebaseAuth.currentUser?.phoneNumber ||
                'Not available'}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <ShieldCheck size={18} color={colors.primary} />
          <View style={styles.rowText}>
            <Text style={styles.label}>ROLE</Text>
            <Text style={styles.value}>
              {profile?.primaryRole?.replace('_', ' ') || 'Operator'}
            </Text>
          </View>
        </View>
      </View>

      <AppButton
        label="Log out"
        icon={<LogOut size={18} color={colors.white} />}
        onPress={logout}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  title: {fontSize: 29, fontWeight: '900', color: colors.text},
  subtitle: {fontSize: 14, lineHeight: 20, color: colors.muted},
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 16,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {flex: 1, gap: 5},
  name: {fontSize: 17, fontWeight: '900', color: colors.text},
  verified: {flexDirection: 'row', alignItems: 'center', gap: 5},
  verifiedText: {fontSize: 12, fontWeight: '800', color: colors.success},
  detailCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 16,
  },
  row: {flexDirection: 'row', gap: 11, alignItems: 'center'},
  rowText: {flex: 1, gap: 2},
  label: {fontSize: 10, fontWeight: '900', letterSpacing: 0.7, color: colors.muted},
  value: {fontSize: 13.5, fontWeight: '800', color: colors.text},
  divider: {height: 1, backgroundColor: colors.border, marginVertical: 14},
});
