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
import type {Provider} from '../provider/providerTypes';
import type {Vehicle} from '../vehicle/vehicleTypes';
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

export type DiscoveredRoute = TrackKarRoute & {providerName: string; vehicleName: string; serviceType: string};

export async function discoverActiveRoutes(searchText = ''): Promise<DiscoveredRoute[]> {
  currentUid();
  const snapshot = await getDocs(query(collection(db, 'routes'), where('status', '==', 'ACTIVE')));
  const search = searchText.trim().toLocaleLowerCase();
  const routes = snapshot.docs.map(item => item.data() as TrackKarRoute);
  const enriched = await Promise.all(routes.map(async route => {
    const [providerSnapshot, vehicleSnapshot] = await Promise.all([
      getDoc(doc(db, 'providers', route.ownerAccountId)),
      getDoc(doc(db, 'vehicles', route.vehicleId)),
    ]);
    const provider = providerSnapshot.exists() ? providerSnapshot.data() as Provider : null;
    const vehicle = vehicleSnapshot.exists() ? vehicleSnapshot.data() as Vehicle : null;
    return {...route, providerName: provider?.displayName || 'TrackKar provider',
      vehicleName: vehicle?.displayName || 'Service vehicle', serviceType: vehicle?.vehicleType || 'Service'};
  }));
  return enriched
    .filter(item => !search || `${item.routeName} ${item.providerName} ${item.serviceType}`.toLocaleLowerCase().includes(search))
    .sort((left, right) => left.routeName.localeCompare(right.routeName));
}

export async function getMyActiveSubscriptions() {
  const uid = currentUid();
  const snapshot = await getDocs(query(
    collection(db, 'routeSubscriptions'),
    where('subscriberAccountId', '==', uid),
    where('status', 'in', ['ACTIVE', 'MUTED']),
  ));
  return snapshot.docs.map(item => item.data() as RouteSubscription);
}

export async function subscribeToRoute(routeId: string) {
  const uid = currentUid();
  const routeSnapshot = await getDoc(doc(db, 'routes', routeId));
  if (!routeSnapshot.exists() || (routeSnapshot.data() as TrackKarRoute).status !== 'ACTIVE') {
    throw new Error('This service route is not active.');
  }
  const location = await getSavedLocation();
  if (!location) throw new Error('Capture your service location before subscribing.');
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
