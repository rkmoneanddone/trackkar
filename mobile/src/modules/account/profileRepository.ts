import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
  updateDoc,
} from '@react-native-firebase/firestore';
import {firebaseApp} from '../auth/firebaseAuth';

export type TrackKarRole =
  | 'OPERATOR'
  | 'OPERATOR_DRIVER'
  | 'DRIVER'
  | 'SUBSCRIBER'
  | 'ADMIN';

export type AccountStatus = 'ACTIVE' | 'SUSPENDED';

export type AccountProfile = {
  uid: string;
  email: string | null;
  displayName: string;
  otherName: string | null;
  phoneNumber: string;
  roles: TrackKarRole[];
  primaryRole: TrackKarRole;
  status: AccountStatus;
  providerId: string | null;
  driverId: string | null;
  subscriberId: string | null;
  createdAt?: unknown;
  updatedAt?: unknown;
};

const db = getFirestore(firebaseApp);

export async function getAccountProfile(uid: string) {
  const ref = doc(db, 'accounts', uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return null;
  }

  return snap.data() as AccountProfile;
}

export async function createOrUpdateAccountProfile(input: {
  uid: string;
  email: string | null;
  displayName: string;
  otherName?: string | null;
  phoneNumber: string;
  role: TrackKarRole;
}) {
  const ref = doc(db, 'accounts', input.uid);
  const existing = await getDoc(ref);

  const existingData = existing.exists()
    ? (existing.data() as Partial<AccountProfile>)
    : null;

  const roles = Array.from(
    new Set<TrackKarRole>([
      ...((existingData?.roles || []) as TrackKarRole[]),
      input.role,
    ]),
  );

  const payload: AccountProfile = {
    uid: input.uid,
    email: input.email,
    displayName: input.displayName,
    otherName: input.otherName?.trim() || null,
    phoneNumber: input.phoneNumber,
    roles,
    primaryRole: existingData?.primaryRole || input.role,
    status: (existingData?.status as AccountStatus) || 'ACTIVE',
    providerId: typeof existingData?.providerId === 'string'
      ? existingData.providerId
      : input.role === 'OPERATOR' || input.role === 'OPERATOR_DRIVER' ? input.uid : null,
    driverId: typeof existingData?.driverId === 'string'
      ? existingData.driverId
      : input.role === 'DRIVER' || input.role === 'OPERATOR_DRIVER' ? input.uid : null,
    subscriberId: typeof existingData?.subscriberId === 'string'
      ? existingData.subscriberId
      : input.role === 'SUBSCRIBER' ? input.uid : null,
    ...(existingData?.createdAt
      ? {createdAt: existingData.createdAt}
      : {createdAt: serverTimestamp()}),
    updatedAt: serverTimestamp(),
  };

  await setDoc(ref, payload, {merge: true});

  const privateRef = doc(db, 'accountPrivate', input.uid);

  await setDoc(
    privateRef,
    {
      uid: input.uid,
      phoneNumber: input.phoneNumber,
      email: input.email,
      updatedAt: serverTimestamp(),
      ...(existing.exists() ? {} : {createdAt: serverTimestamp()}),
    },
    {merge: true},
  );

  return payload;
}

export async function updatePrimaryRole(uid: string, role: TrackKarRole) {
  const ref = doc(db, 'accounts', uid);
  await updateDoc(ref, {
    primaryRole: role,
    updatedAt: serverTimestamp(),
  });
}
