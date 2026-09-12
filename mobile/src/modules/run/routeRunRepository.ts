import {arrayUnion, collection, doc, getDoc, getDocs, getFirestore, query, serverTimestamp, setDoc, updateDoc, where} from '@react-native-firebase/firestore';
import {firebaseApp, firebaseAuth} from '../auth/firebaseAuth';
import type {TrackKarRoute, RoutePoint} from '../route/routeTypes';
import type {RouteRun} from './routeRunTypes';
import {recordCompletedLearningTrip} from '../route/routeRepository';
import {distanceMeters} from '../route/routeLearning';

const START_END_RADIUS_METERS = 250;

const db = getFirestore(firebaseApp);
function currentUid() { const uid = firebaseAuth.currentUser?.uid;
  if (!uid) throw new Error('Your TrackKar session has expired. Please sign in again.'); return uid; }

export async function startRouteRun(routeId: string, point: RoutePoint) {
  const uid = currentUid();
  const active = await getDocs(query(collection(db, 'routeRuns'),
    where('driverAccountId', '==', uid), where('status', '==', 'ACTIVE')));
  if (!active.empty) throw new Error('Finish your current active route before starting another.');
  const routeSnapshot = await getDoc(doc(db, 'routes', routeId));
  if (!routeSnapshot.exists()) throw new Error('Route was not found.');
  const route = routeSnapshot.data() as TrackKarRoute;
  if (route.status !== 'ACTIVE' && route.status !== 'LEARNING' && route.status !== 'DRAFT') {
    throw new Error('This route cannot be started.');
  }
  if (route.status === 'ACTIVE' && route.startPoint
    && distanceMeters(point, route.startPoint) > START_END_RADIUS_METERS) {
    throw new Error(`Move within ${START_END_RADIUS_METERS} metres of the learned route start.`);
  }
  const ref = doc(collection(db, 'routeRuns'));
  await setDoc(ref, {id: ref.id, routeId, vehicleId: route.vehicleId, providerId: route.ownerAccountId,
    driverAccountId: uid, status: 'ACTIVE', latestPoint: point, latestSpeedMetersPerSecond: null,
    learningPoints: [point], startedAt: serverTimestamp(), endedAt: null, updatedAt: serverTimestamp()});
  return ref.id;
}

export async function updateRouteRunLocation(runId: string, point: RoutePoint, speed: number | null) {
  currentUid();
  await updateDoc(doc(db, 'routeRuns', runId), {latestPoint: point,
    latestSpeedMetersPerSecond: speed, learningPoints: arrayUnion(point), updatedAt: serverTimestamp()});
}

export async function completeRouteRun(runId: string, endpoint?: RoutePoint) {
  currentUid();
  const runSnapshot = await getDoc(doc(db, 'routeRuns', runId));
  if (!runSnapshot.exists()) throw new Error('Active route run was not found.');
  const run = runSnapshot.data() as RouteRun & {learningPoints?: RoutePoint[]};
  const latestPoint = endpoint || run.latestPoint;
  const learningPoints = endpoint
    ? [...(run.learningPoints || []), endpoint]
    : (run.learningPoints || []);
  const routeSnapshot = await getDoc(doc(db, 'routes', run.routeId));
  const route = routeSnapshot.exists() ? routeSnapshot.data() as TrackKarRoute : null;
  if (route?.status === 'ACTIVE' && route.endPoint
    && distanceMeters(latestPoint, route.endPoint) > START_END_RADIUS_METERS) {
    throw new Error(`Move within ${START_END_RADIUS_METERS} metres of the learned route end.`);
  }
  let learningError: string | null = null;
  if (route && (route.status === 'DRAFT' || route.status === 'LEARNING')) {
    try { await recordCompletedLearningTrip(run.routeId, learningPoints); }
    catch (cause) { learningError = cause instanceof Error ? cause.message : String(cause); }
  }
  await updateDoc(doc(db, 'routeRuns', runId), {status: 'COMPLETED', latestPoint,
    learningPoints, endedAt: serverTimestamp(), updatedAt: serverTimestamp()});
  if (learningError) throw new Error(`Route ended, but this trip was not used for learning: ${learningError}`);
}

export async function getMyActiveRun() {
  const uid = currentUid();
  const snapshot = await getDocs(query(collection(db, 'routeRuns'),
    where('driverAccountId', '==', uid), where('status', '==', 'ACTIVE')));
  return snapshot.empty ? null : snapshot.docs[0].data() as RouteRun;
}
