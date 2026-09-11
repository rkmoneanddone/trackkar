import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  where,
} from '@react-native-firebase/firestore';
import {firebaseApp, firebaseAuth} from '../auth/firebaseAuth';
import type {TrackKarRoute} from '../route/routeTypes';
import type {RouteSubscription, SubscriberLocation} from './subscriberTypes';

const db = getFirestore(firebaseApp);

function currentUid() {
  const uid = firebaseAuth.currentUser?.uid;
  if (!uid) throw new Error('Your TrackKar session has expired. Please sign in again.');
  return uid;
}

export async function getSavedLocation() {
  const uid = currentUid();
  const snapshot = await getDoc(doc(db, 'subscriberLocations', uid));
  return snapshot.exists() ? snapshot.data() as SubscriberLocation : null;
}

export async function saveCapturedLocation(
  label: string,
  latitude: number,
  longitude: number,
) {
  const uid = currentUid();
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90
    || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new Error('The captured GPS location is invalid.');
  }
  await setDoc(doc(db, 'subscriberLocations', uid), {
    accountId: uid,
    label: label.trim() || 'Service location',
    point: {latitude, longitude, capturedAtMs: Date.now()},
    updatedAt: serverTimestamp(),
  });
}

export async function discoverActiveRoutes(searchText = '') {
  currentUid();
  const snapshot = await getDocs(query(collection(db, 'routes'), where('status', '==', 'ACTIVE')));
  const search = searchText.trim().toLocaleLowerCase();
  return snapshot.docs
    .map(item => item.data() as TrackKarRoute)
    .filter(item => !search || item.routeName.toLocaleLowerCase().includes(search))
    .sort((left, right) => left.routeName.localeCompare(right.routeName));
}

export async function getMyActiveSubscription() {
  const uid = currentUid();
  const snapshot = await getDocs(query(
    collection(db, 'routeSubscriptions'),
    where('subscriberAccountId', '==', uid),
    where('status', 'in', ['ACTIVE', 'MUTED']),
  ));
  return snapshot.empty ? null : snapshot.docs[0].data() as RouteSubscription;
}

export async function subscribeToRoute(routeId: string) {
  const uid = currentUid();
  const routeSnapshot = await getDoc(doc(db, 'routes', routeId));
  if (!routeSnapshot.exists() || (routeSnapshot.data() as TrackKarRoute).status !== 'ACTIVE') {
    throw new Error('This service route is not active.');
  }
  const location = await getSavedLocation();
  if (!location) throw new Error('Capture your service location before subscribing.');
  const existing = await getMyActiveSubscription();
  if (existing && existing.routeId !== routeId) {
    await setDoc(doc(db, 'routeSubscriptions', existing.id), {
      ...existing,
      status: 'ENDED',
      updatedAt: serverTimestamp(),
    });
  }
  const id = `${uid}_${routeId}`;
  await setDoc(doc(db, 'routeSubscriptions', id), {
    id,
    subscriberAccountId: uid,
    routeId,
    status: 'ACTIVE',
    alertMinutes: [6, 3],
    voiceEnabled: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, {merge: true});
  return id;
}
