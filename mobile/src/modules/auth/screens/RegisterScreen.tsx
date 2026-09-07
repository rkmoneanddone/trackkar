import React, {useEffect, useState} from 'react';
import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import {CheckCircle2, LogOut, Phone, UserRound} from 'lucide-react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../../navigation/types';
import {AppScreen} from '../../../components/AppScreen';
import {AppHeader} from '../../../components/AppHeader';
import {TextField} from '../../../components/TextField';
import {AppButton} from '../../../components/AppButton';
import {GoogleButton} from '../../../components/GoogleButton';
import {colors, radius} from '../../../theme/tokens';
import {
  firebaseAuth,
  observeAuthState,
  type TrackKarFirebaseUser,
} from '../firebaseAuth';
import {
  configureGoogleSignIn,
  signInWithGoogle,
  signOutTrackKar,
} from '../googleAuth';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

function roleLabel(role: Props['route']['params']['role']) {
  if (role === 'OPERATOR_DRIVER') return 'Operator + Driver';
  if (role === 'OPERATOR') return 'Service Operator';
  if (role === 'DRIVER') return 'Driver';
  return 'Subscriber';
}

function errorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Google sign-in could not be completed.';
}

export function RegisterScreen({route, navigation}: Props) {
  const [name, setName] = useState('');
  const [otherName, setOtherName] = useState('');
  const [mobile, setMobile] = useState('+91 ');
  const [user, setUser] = useState<TrackKarFirebaseUser | null>(
    firebaseAuth.currentUser,
  );
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    configureGoogleSignIn();

    return observeAuthState(nextUser => {
      setUser(nextUser);

      if (nextUser?.displayName) {
        setName(current => current.trim() ? current : nextUser.displayName || '');
      }
    });
  }, []);

  const googleLogin = async () => {
    try {
      setSigningIn(true);
      const signedInUser = await signInWithGoogle();

      if (!signedInUser) {
        return;
      }

      if (signedInUser.displayName) {
        setName(current =>
          current.trim() ? current : signedInUser.displayName || '',
        );
      }
    } catch (error) {
      Alert.alert('Google sign-in failed', errorMessage(error));
    } finally {
      setSigningIn(false);
    }
  };

  const logout = async () => {
    try {
      await signOutTrackKar();
    } catch (error) {
      Alert.alert('Sign-out failed', errorMessage(error));
    }
  };

  const next = () => {
    if (!user) {
      Alert.alert(
        'Google sign-in required',
        'Continue with Google before creating your TrackKar profile.',
      );
      return;
    }

    if (!name.trim() || !mobile.trim()) {
      Alert.alert('Complete your details', 'Name and mobile number are required.');
      return;
    }

    navigation.navigate('MobileVerification', {
      role: route.params.role,
      name: name.trim(),
      otherName: otherName.trim(),
      mobile,
    });
  };

  return (
    <AppScreen>
      <AppHeader
        title={roleLabel(route.params.role)}
        onBack={() => navigation.goBack()}
      />

      <View style={styles.head}>
        <Text style={styles.kicker}>ACCOUNT CREATION</Text>
        <Text style={styles.title}>Create your TrackKar account</Text>
        <Text style={styles.subtitle}>
          Sign in with Google first. TrackKar uses your Google identity and then
          verifies your mobile number for account security.
        </Text>
      </View>

      {user ? (
        <View style={styles.googleConnected}>
          <View style={styles.connectedIcon}>
            <CheckCircle2 size={22} color={colors.primary} />
          </View>

          <View style={styles.connectedBody}>
            <Text style={styles.connectedLabel}>GOOGLE CONNECTED</Text>
            <Text style={styles.connectedName}>
              {user.displayName || 'Google account'}
            </Text>
            <Text style={styles.connectedEmail}>{user.email || ''}</Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Sign out"
            onPress={logout}
            style={({pressed}) => [
              styles.signOut,
              pressed && {opacity: 0.65},
            ]}>
            <LogOut size={19} color={colors.muted} />
          </Pressable>
        </View>
      ) : (
        <GoogleButton onPress={googleLogin} disabled={signingIn} />
      )}

      <View style={styles.dividerRow}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>PROFILE DETAILS</Text>
        <View style={styles.line} />
      </View>

      <TextField
        label="Name"
        placeholder="Your name"
        value={name}
        onChangeText={setName}
        icon={<UserRound size={19} color={colors.muted} />}
      />

      <TextField
        label="Another name (optional)"
        placeholder="Business / family / familiar name"
        value={otherName}
        onChangeText={setOtherName}
        icon={<UserRound size={19} color={colors.muted} />}
      />

      <TextField
        label="Mobile number"
        placeholder="+91 98XXXXXXXX"
        value={mobile}
        onChangeText={setMobile}
        keyboardType="phone-pad"
        icon={<Phone size={19} color={colors.muted} />}
      />

      <View style={styles.note}>
        <Text style={styles.noteTitle}>Mobile verification</Text>
        <Text style={styles.noteText}>
          OTP verification is the next step. Your mobile number will not be
          displayed publicly by default.
        </Text>
      </View>

      <AppButton
        label={user ? 'Continue to mobile verification' : 'Sign in with Google first'}
        arrow={Boolean(user)}
        onPress={next}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  head: {gap: 7, marginVertical: 8},
  kicker: {
    fontSize: 11.5,
    fontWeight: '900',
    letterSpacing: 1,
    color: colors.primary,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
    color: colors.text,
  },
  subtitle: {fontSize: 14, lineHeight: 20, color: colors.muted},
  googleConnected: {
    minHeight: 70,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  connectedIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
  connectedBody: {flex: 1, gap: 2},
  connectedLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
    color: colors.primary,
  },
  connectedName: {fontSize: 14.5, fontWeight: '900', color: colors.text},
  connectedEmail: {fontSize: 12.5, color: colors.muted},
  signOut: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 2,
  },
  line: {height: 1, backgroundColor: colors.border, flex: 1},
  dividerText: {
    fontSize: 10.5,
    fontWeight: '900',
    letterSpacing: 0.8,
    color: colors.muted,
  },
  note: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    padding: 14,
    gap: 4,
  },
  noteTitle: {fontSize: 12.5, fontWeight: '900', color: colors.text},
  noteText: {fontSize: 12.5, lineHeight: 18, color: colors.textSoft},
});