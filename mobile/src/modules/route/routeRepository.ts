import {collection, doc, getDoc, getDocs, getFirestore, query, serverTimestamp, where, writeBatch} from '@react-native-firebase/firestore';
import {firebaseApp, firebaseAuth} from '../auth/firebaseAuth';
import {getMyVehicle} from '../vehicle/vehicleRepository';
import type {CreateRouteInput, TrackKarRoute} from './routeTypes';
import {MAX_ACTIVE_ROUTES, validateRouteDirection, validateRouteName} from './routeValidation';

const db = getFirestore(firebaseApp);

function currentUid() {
  const uid = firebaseAuth.currentUser?.uid;
  if (!uid) throw new Error('Your TrackKar session has expired. Please sign in again.');
  return uid;
}

export async function listMyRoutes(): Promise<TrackKarRoute[]> {
  const uid = currentUid();
  const snapshot = await getDocs(query(collection(db, 'routes'), where('ownerAccountId', '==', uid)));
  return snapshot.docs.map(item => item.data() as TrackKarRoute).filter(item => item.status !== 'DELETED').sort((a, b) => a.routeName.localeCompare(b.routeName));
}

export async function getMyRoute(routeId: string) {
  currentUid();
  const snapshot = await getDoc(doc(db, 'routes', routeId));
  return snapshot.exists() ? (snapshot.data() as TrackKarRoute) : null;
}

export async function createRoute(input: CreateRouteInput) {
  const uid = currentUid();
  const routeName = input.routeName.trim();
  const nameError = validateRouteName(routeName);
  if (nameError) throw new Error(nameError);
  if (!validateRouteDirection(input.directionType)) throw new Error('Select a valid route direction.');
  if (!(await getMyVehicle(input.vehicleId))) throw new Error('Select a vehicle that belongs to your account.');
  if ((await listMyRoutes()).length >= MAX_ACTIVE_ROUTES) throw new Error(`TrackKar currently allows up to ${MAX_ACTIVE_ROUTES} routes.`);

  const routeRef = doc(collection(db, 'routes'));
  const versionRef = doc(collection(db, 'routeVersions'));
  const route = {
    id: routeRef.id, ownerAccountId: uid, vehicleId: input.vehicleId,
    routeName, directionType: input.directionType, pairedRouteId: null,
    creationMethod: 'RECORDED' as const, status: 'DRAFT' as const,
    learningTripCount: 0, startPoint: null, endPoint: null,
    createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  };
  const batch = writeBatch(db);
  batch.set(routeRef, route);
  batch.set(versionRef, {
    id: versionRef.id, routeId: routeRef.id, ownerAccountId: uid, version: 1,
    reason: 'ROUTE_CREATED',
    snapshot: {vehicleId: input.vehicleId, routeName, directionType: input.directionType, creationMethod: 'RECORDED', status: 'DRAFT'},
    createdAt: serverTimestamp(),
  });
  await batch.commit();
  return routeRef.id;
}
