import {collection, doc, getDoc, getDocs, getFirestore, query, serverTimestamp, setDoc, where, writeBatch} from '@react-native-firebase/firestore';
import {firebaseApp, firebaseAuth} from '../auth/firebaseAuth';
import type {AccountProfile} from '../account/profileRepository';
import type {DriverInvite, ProviderMember} from './providerTypes';

const db = getFirestore(firebaseApp);
function currentUid() {
  const uid = firebaseAuth.currentUser?.uid;
  if (!uid) throw new Error('Your TrackKar session has expired. Please sign in again.');
  return uid;
}

export async function ensureProvider(profile: AccountProfile) {
  const uid = currentUid();
  if (uid !== profile.uid) throw new Error('Profile does not match the signed-in account.');
  const batch = writeBatch(db);
  batch.set(doc(db, 'providers', uid), {id: uid, ownerAccountId: uid,
    displayName: profile.displayName, status: 'ACTIVE', createdAt: serverTimestamp(), updatedAt: serverTimestamp()}, {merge: true});
  batch.set(doc(db, 'providerMembers', `${uid}_${uid}`), {id: `${uid}_${uid}`, providerId: uid,
    accountId: uid, role: 'OWNER', status: 'ACTIVE', createdAt: serverTimestamp(), updatedAt: serverTimestamp()}, {merge: true});
  await batch.commit();
}

export async function createDriverInvite() {
  const uid = currentUid();
  const generated = doc(collection(db, 'driverInvites')).id.slice(0, 8).toUpperCase();
  await setDoc(doc(db, 'driverInvites', generated), {id: generated, providerId: uid,
    createdByAccountId: uid, status: 'OPEN', acceptedByAccountId: null,
    createdAt: serverTimestamp(), updatedAt: serverTimestamp()});
  return generated;
}

export async function listProviderMembers() {
  const uid = currentUid();
  const snapshot = await getDocs(query(collection(db, 'providerMembers'), where('providerId', '==', uid)));
  return snapshot.docs.map(item => item.data() as ProviderMember);
}

export async function acceptDriverInvite(rawCode: string) {
  const uid = currentUid();
  const code = rawCode.trim().toUpperCase();
  const inviteRef = doc(db, 'driverInvites', code);
  const snapshot = await getDoc(inviteRef);
  if (!snapshot.exists()) throw new Error('Invite code was not found.');
  const invite = snapshot.data() as DriverInvite;
  if (invite.status !== 'OPEN') throw new Error('This invite is no longer available.');
  const memberId = `${invite.providerId}_${uid}`;
  const batch = writeBatch(db);
  batch.set(doc(db, 'providerMembers', memberId), {id: memberId, providerId: invite.providerId,
    accountId: uid, inviteId: code, role: 'DRIVER', status: 'ACTIVE',
    createdAt: serverTimestamp(), updatedAt: serverTimestamp()});
  batch.update(inviteRef, {status: 'ACCEPTED', acceptedByAccountId: uid, updatedAt: serverTimestamp()});
  await batch.commit();
  return invite.providerId;
}

export async function listMyDriverMemberships() {
  const uid = currentUid();
  const snapshot = await getDocs(query(collection(db, 'providerMembers'),
    where('accountId', '==', uid), where('role', '==', 'DRIVER')));
  return snapshot.docs.map(item => item.data() as ProviderMember).filter(item => item.status === 'ACTIVE');
}
