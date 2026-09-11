import {collection, doc, getDoc, getDocs, getFirestore, query, serverTimestamp, where, writeBatch} from '@react-native-firebase/firestore';
import {firebaseApp, firebaseAuth} from '../auth/firebaseAuth';
import {getMyVehicle} from '../vehicle/vehicleRepository';
import type {CreateRouteInput, TrackKarRoute} from './routeTypes';
import {MAX_ACTIVE_ROUTES, validateRouteDirection, validateRouteName} from './routeValidation';
import {
  buildLearnedPath,
  REQUIRED_LEARNING_TRIPS,
  routeDistanceMeters,
  tripsMatch,
  validateLearningTrip,
} from './routeLearning';
import type {RouteLearningTrip, RoutePoint} from './routeTypes';
import {listMyDriverMemberships} from '../provider/providerRepository';

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

export async function listMyDriverRoutes(): Promise<TrackKarRoute[]> {
  const memberships = await listMyDriverMemberships();
  const results = await Promise.all(memberships.map(member => getDocs(query(
    collection(db, 'routes'), where('ownerAccountId', '==', member.providerId),
  ))));
  const byId = new Map<string, TrackKarRoute>();
  results.forEach(snapshot => snapshot.docs.forEach(item => {
    const route = item.data() as TrackKarRoute;
    if (route.status !== 'DELETED' && route.status !== 'INACTIVE') byId.set(route.id, route);
  }));
  return [...byId.values()].sort((left, right) => left.routeName.localeCompare(right.routeName));
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

export async function recordCompletedLearningTrip(
  routeId: string,
  points: RoutePoint[],
) {
  const uid = currentUid();
  const validationError = validateLearningTrip(points);
  if (validationError) throw new Error(validationError);

  const routeRef = doc(db, 'routes', routeId);
  const routeSnapshot = await getDoc(routeRef);
  if (!routeSnapshot.exists()) throw new Error('This route could not be found.');
  const route = routeSnapshot.data() as TrackKarRoute;
  const memberships = route.ownerAccountId === uid ? [] : await listMyDriverMemberships();
  if (route.ownerAccountId !== uid && !memberships.some(item => item.providerId === route.ownerAccountId)) {
    throw new Error('You are not connected to the provider that owns this route.');
  }
  const providerId = route.ownerAccountId;
  if (route.status !== 'DRAFT' && route.status !== 'LEARNING') {
    throw new Error('Only a draft or learning route can accept learning trips.');
  }

  const learningQuery = query(
    collection(db, 'routeLearningTrips'),
    where('routeId', '==', routeId),
    where('ownerAccountId', '==', providerId),
  );
  const learningSnapshot = await getDocs(learningQuery);
  const existing = learningSnapshot.docs
    .map(item => item.data() as RouteLearningTrip)
    .sort((left, right) => left.sequence - right.sequence);
  if (existing.length && !tripsMatch(existing[0].points, points)) {
    throw new Error('This trip does not match the start and end areas of the first learning trip.');
  }
  if (existing.length >= REQUIRED_LEARNING_TRIPS - 1) {
    const learnedPath = buildLearnedPath([...existing.map(item => item.points), points]);
    const versionRef = doc(collection(db, 'routeVersions'));
    const batch = writeBatch(db);
    batch.update(routeRef, {
      status: 'ACTIVE',
      learningTripCount: REQUIRED_LEARNING_TRIPS,
      learnedPath,
      startPoint: learnedPath[0],
      endPoint: learnedPath[learnedPath.length - 1],
      updatedAt: serverTimestamp(),
    });
    batch.set(versionRef, {
      id: versionRef.id,
      routeId,
      ownerAccountId: providerId,
      version: 2,
      reason: 'LEARNING_FINALIZED',
      snapshot: {
        status: 'ACTIVE',
        learningTripCount: REQUIRED_LEARNING_TRIPS,
        learnedPath,
      },
      createdAt: serverTimestamp(),
    });
    learningSnapshot.docs.forEach(item => batch.delete(item.ref));
    await batch.commit();
    return {finalized: true, learningTripCount: REQUIRED_LEARNING_TRIPS};
  }

  const tripRef = doc(collection(db, 'routeLearningTrips'));
  const sequence = existing.length + 1;
  const durationSeconds = Math.max(
    0,
    Math.round((points[points.length - 1].capturedAtMs - points[0].capturedAtMs) / 1000),
  );
  const batch = writeBatch(db);
  batch.set(tripRef, {
    id: tripRef.id,
    routeId,
    ownerAccountId: providerId,
    recordedByAccountId: uid,
    sequence,
    points,
    distanceMeters: Math.round(routeDistanceMeters(points)),
    durationSeconds,
    createdAt: serverTimestamp(),
  });
  batch.update(routeRef, {
    status: 'LEARNING',
    learningTripCount: sequence,
    updatedAt: serverTimestamp(),
  });
  await batch.commit();
  return {finalized: false, learningTripCount: sequence};
}
