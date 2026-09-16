import {PermissionsAndroid, Platform} from 'react-native';
import {doc, getFirestore, serverTimestamp, setDoc, updateDoc} from '@react-native-firebase/firestore';
import {
  AuthorizationStatus,
  getMessaging,
  getToken,
  onTokenRefresh,
  requestPermission,
} from '@react-native-firebase/messaging';
import {firebaseApp, firebaseAuth, observeAuthState} from '../auth/firebaseAuth';

const db = getFirestore(firebaseApp);
const messaging = getMessaging(firebaseApp);

function tokenDocumentId(uid: string, token: string) {
  const safe = token.replace(/[^A-Za-z0-9_-]/g, '_').slice(-120);
  return `${uid}_${safe}`;
}

async function requestNotificationPermission() {
  if (Platform.OS === 'android' && Number(Platform.Version) >= 33) {
    return (await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS))
      === PermissionsAndroid.RESULTS.GRANTED;
  }
  const status = await requestPermission(messaging);
  return status === AuthorizationStatus.AUTHORIZED || status === AuthorizationStatus.PROVISIONAL;
}

async function persistToken(uid: string, token: string) {
  const id = tokenDocumentId(uid, token);
  await setDoc(doc(db, 'deviceTokens', id), {
    id,
    accountId: uid,
    fcmToken: token,
    platform: Platform.OS === 'ios' ? 'ios' : 'android',
    enabled: true,
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  }, {merge: true});
}

export async function registerCurrentDeviceForPush() {
  const uid = firebaseAuth.currentUser?.uid;
  if (!uid) return false;
  if (!(await requestNotificationPermission())) return false;
  const token = await getToken(messaging);
  if (!token) return false;
  await persistToken(uid, token);
  return true;
}

export function startPushRegistration() {
  let refreshUnsubscribe: (() => void) | null = null;
  const authUnsubscribe = observeAuthState(user => {
    refreshUnsubscribe?.();
    refreshUnsubscribe = null;
    if (!user) return;
    void registerCurrentDeviceForPush().catch(error => {
      console.warn('TrackKar push registration failed', error);
    });
    refreshUnsubscribe = onTokenRefresh(messaging, token => {
      void persistToken(user.uid, token).catch(error => {
        console.warn('TrackKar push token refresh failed', error);
      });
    });
  });
  return () => {
    refreshUnsubscribe?.();
    authUnsubscribe();
  };
}

export async function disableCurrentDeviceToken(token: string) {
  const uid = firebaseAuth.currentUser?.uid;
  if (!uid || !token) return;
  await updateDoc(doc(db, 'deviceTokens', tokenDocumentId(uid, token)), {
    enabled: false,
    updatedAt: serverTimestamp(),
  });
}
