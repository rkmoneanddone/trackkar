import React, {useMemo, useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {
  CheckCircle2,
  MessageSquareText,
  Phone,
  ShieldCheck,
} from 'lucide-react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  linkWithCredential,
  PhoneAuthProvider,
  PhoneAuthState,
  verifyPhoneNumber,
  type PhoneAuthSnapshot,
} from '@react-native-firebase/auth';
import type {RootStackParamList} from '../../../navigation/types';
import {AppScreen} from '../../../components/AppScreen';
import {AppHeader} from '../../../components/AppHeader';
import {TextField} from '../../../components/TextField';
import {AppButton} from '../../../components/AppButton';
import {colors, radius} from '../../../theme/tokens';
import {firebaseAuth} from '../firebaseAuth';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'MobileVerification'
>;

function normalizeIndianMobile(value: string) {
  const digits = value.replace(/\D/g, '');

  if (digits.length === 10) {
    return `+91${digits}`;
  }

  if (digits.length === 12 && digits.startsWith('91')) {
    return `+${digits}`;
  }

  return null;
}

function friendlyError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes('auth/invalid-phone-number')) {
    return 'Enter a valid Indian mobile number.';
  }

  if (message.includes('auth/quota-exceeded')) {
    return 'Firebase SMS quota has been exceeded. Please try again later.';
  }

  if (
    message.includes('auth/operation-not-allowed') ||
    message.includes('provider-disabled')
  ) {
    return 'Phone authentication is not enabled in Firebase Authentication.';
  }

  if (
    message.includes('auth/invalid-verification-code') ||
    message.includes('invalid-verification-code')
  ) {
    return 'The OTP is incorrect. Please check the code and try again.';
  }

  if (
    message.includes('auth/code-expired') ||
    message.includes('session-expired')
  ) {
    return 'The OTP has expired. Request a new code.';
  }

  if (message.includes('auth/credential-already-in-use')) {
    return 'This mobile number is already linked to another TrackKar account.';
  }

  if (message.includes('auth/provider-already-linked')) {
    return 'A mobile number is already linked to this TrackKar account.';
  }

  if (
    message.includes('missing-client-identifier') ||
    message.includes('app-not-authorized')
  ) {
    return 'Firebase could not authorize this Android app for phone verification. Check SHA fingerprints in Firebase project settings.';
  }

  return message || 'Verification could not be completed.';
}

export function MobileVerificationScreen({route, navigation}: Props) {
  const [mobile, setMobile] = useState(route.params.mobile || '+91 ');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifiedNumber, setVerifiedNumber] = useState<string | null>(
    firebaseAuth.currentUser?.phoneNumber || null,
  );

  const normalizedMobile = useMemo(
    () => normalizeIndianMobile(mobile),
    [mobile],
  );

  const handlePhoneSnapshot = async (snapshot: PhoneAuthSnapshot) => {
    if (snapshot.state === PhoneAuthState.CODE_SENT) {
      setVerificationId(snapshot.verificationId);
      setSending(false);
      return;
    }

    if (snapshot.state === PhoneAuthState.AUTO_VERIFIED) {
      const user = firebaseAuth.currentUser;

      if (!user || !snapshot.verificationId || !snapshot.code) {
        setSending(false);
        return;
      }

      try {
        const credential = PhoneAuthProvider.credential(
          snapshot.verificationId,
          snapshot.code,
        );

        const result = await linkWithCredential(user, credential);
        const number =
          result.user.phoneNumber ||
          firebaseAuth.currentUser?.phoneNumber ||
          normalizedMobile;

        setVerifiedNumber(number || null);
        setVerificationId(null);
        setOtp('');
      } catch (error) {
        Alert.alert('Automatic verification failed', friendlyError(error));
      } finally {
        setSending(false);
      }

      return;
    }

    if (snapshot.state === PhoneAuthState.ERROR) {
      setSending(false);
      Alert.alert(
        'Could not send OTP',
        friendlyError(snapshot.error || 'Phone verification failed.'),
      );
      return;
    }

    if (snapshot.state === PhoneAuthState.AUTO_VERIFY_TIMEOUT) {
      setSending(false);

      if (snapshot.verificationId) {
        setVerificationId(snapshot.verificationId);
      }
    }
  };

  const sendOtp = () => {
    const user = firebaseAuth.currentUser;

    if (!user) {
      Alert.alert(
        'Google session missing',
        'Please go back and sign in with Google again.',
      );
      return;
    }

    if (user.phoneNumber) {
      setVerifiedNumber(user.phoneNumber);
      return;
    }

    if (!normalizedMobile) {
      Alert.alert(
        'Check mobile number',
        'Enter a valid 10-digit Indian mobile number after +91.',
      );
      return;
    }

    try {
      setSending(true);
      setVerificationId(null);
      setOtp('');

      verifyPhoneNumber(firebaseAuth, normalizedMobile).on(
        'state_changed',
        snapshot => {
          void handlePhoneSnapshot(snapshot);
        },
        error => {
          setSending(false);
          Alert.alert('Could not send OTP', friendlyError(error));
        },
      );
    } catch (error) {
      setSending(false);
      Alert.alert('Could not send OTP', friendlyError(error));
    }
  };

  const verifyOtp = async () => {
    const user = firebaseAuth.currentUser;

    if (!user) {
      Alert.alert(
        'Google session missing',
        'Please go back and sign in with Google again.',
      );
      return;
    }

    if (!verificationId) {
      Alert.alert('Request OTP first', 'Send a fresh OTP before verifying.');
      return;
    }

    const code = otp.replace(/\D/g, '');

    if (code.length !== 6) {
      Alert.alert('Enter OTP', 'Enter the complete 6-digit OTP.');
      return;
    }

    try {
      setVerifying(true);

      const credential = PhoneAuthProvider.credential(
        verificationId,
        code,
      );

      const result = await linkWithCredential(user, credential);
      const phoneNumber =
        result.user.phoneNumber ||
        firebaseAuth.currentUser?.phoneNumber ||
        normalizedMobile;

      setVerifiedNumber(phoneNumber || null);
      setVerificationId(null);
      setOtp('');
    } catch (error) {
      Alert.alert('OTP verification failed', friendlyError(error));
    } finally {
      setVerifying(false);
    }
  };

  const continueIntoApp = () => {
    const user = firebaseAuth.currentUser;

    if (!user?.phoneNumber && !verifiedNumber) {
      Alert.alert(
        'Verification required',
        'Verify your mobile number before continuing.',
      );
      return;
    }

    if (
      route.params.role === 'OPERATOR' ||
      route.params.role === 'OPERATOR_DRIVER'
    ) {
      navigation.reset({
        index: 0,
        routes: [{name: 'OperatorApp'}],
      });
      return;
    }

    if (route.params.role === 'DRIVER') {
      navigation.reset({
        index: 0,
        routes: [{name: 'DriverApp'}],
      });
      return;
    }

    navigation.reset({
      index: 0,
      routes: [{name: 'SubscriberApp'}],
    });
  };

  return (
    <AppScreen>
      <AppHeader
        title="Verify mobile"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <ShieldCheck size={27} color={colors.primary} />
        </View>
        <View style={styles.heroText}>
          <Text style={styles.kicker}>FINAL ACCOUNT STEP</Text>
          <Text style={styles.title}>Verify your mobile number</Text>
          <Text style={styles.subtitle}>
            Your Google account is connected. Verify one mobile number to finish
            your TrackKar sign-in.
          </Text>
        </View>
      </View>

      <View style={styles.identityCard}>
        <CheckCircle2 size={20} color={colors.primary} />
        <View style={styles.identityBody}>
          <Text style={styles.identityLabel}>GOOGLE ACCOUNT</Text>
          <Text style={styles.identityName}>{route.params.name}</Text>
          <Text style={styles.identityEmail}>
            {firebaseAuth.currentUser?.email || ''}
          </Text>
        </View>
      </View>

      {verifiedNumber ? (
        <>
          <View style={styles.verifiedCard}>
            <CheckCircle2 size={23} color={colors.primary} />
            <View style={styles.verifiedBody}>
              <Text style={styles.verifiedTitle}>Mobile verified</Text>
              <Text style={styles.verifiedNumber}>{verifiedNumber}</Text>
            </View>
          </View>

          <AppButton
            label="Continue to TrackKar"
            arrow
            onPress={continueIntoApp}
          />
        </>
      ) : (
        <>
          <TextField
            label="Mobile number"
            placeholder="+91 98XXXXXXXX"
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
            editable={!verificationId}
            icon={<Phone size={19} color={colors.muted} />}
          />

          {!verificationId ? (
            <AppButton
              label={sending ? 'Sending OTPâ€¦' : 'Send OTP'}
              onPress={sendOtp}
            />
          ) : (
            <View style={styles.otpCard}>
              <View style={styles.otpHeader}>
                <MessageSquareText size={20} color={colors.primary} />
                <View style={styles.otpHeaderText}>
                  <Text style={styles.otpTitle}>Enter verification code</Text>
                  <Text style={styles.otpSubtitle}>
                    OTP sent to {normalizedMobile || mobile}
                  </Text>
                </View>
              </View>

              <TextField
                label="6-digit OTP"
                placeholder="000000"
                value={otp}
                onChangeText={value =>
                  setOtp(value.replace(/\D/g, '').slice(0, 6))
                }
                keyboardType="number-pad"
                icon={<ShieldCheck size={19} color={colors.muted} />}
              />

              <AppButton
                label={verifying ? 'Verifyingâ€¦' : 'Verify OTP'}
                onPress={verifyOtp}
              />

              <AppButton
                label="Change mobile number"
                onPress={() => {
                  setVerificationId(null);
                  setOtp('');
                }}
              />
            </View>
          )}

          <View style={styles.note}>
            <Text style={styles.noteTitle}>Why we verify mobile</Text>
            <Text style={styles.noteText}>
              TrackKar uses the verified number for account security and
              service-related identity. It is not shown publicly by default.
            </Text>
          </View>
        </>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: 14,
    marginVertical: 8,
  },
  heroIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
  heroText: {gap: 6},
  kicker: {
    fontSize: 11,
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
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
  },
  identityCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  identityBody: {flex: 1, gap: 2},
  identityLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
    color: colors.primary,
  },
  identityName: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.text,
  },
  identityEmail: {
    fontSize: 12.5,
    color: colors.muted,
  },
  otpCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    padding: 14,
    gap: 12,
  },
  otpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  otpHeaderText: {flex: 1, gap: 2},
  otpTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.text,
  },
  otpSubtitle: {
    fontSize: 12.5,
    color: colors.muted,
  },
  verifiedCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  verifiedBody: {gap: 2},
  verifiedTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.text,
  },
  verifiedNumber: {
    fontSize: 13,
    color: colors.textSoft,
  },
  note: {
    borderRadius: radius.md,
    padding: 14,
    backgroundColor: colors.primarySoft,
    gap: 4,
  },
  noteTitle: {
    fontSize: 12.5,
    fontWeight: '900',
    color: colors.text,
  },
  noteText: {
    fontSize: 12.5,
    lineHeight: 18,
    color: colors.textSoft,
  },
});