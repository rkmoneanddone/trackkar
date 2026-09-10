import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from '@react-native-firebase/firestore';
import {firebaseApp, firebaseAuth} from '../auth/firebaseAuth';
import type {CreateVehicleInput, Vehicle} from './vehicleTypes';

const db = getFirestore(firebaseApp);

function currentUid() {
  const uid = firebaseAuth.currentUser?.uid;

  if (!uid) {
    throw new Error('Your TrackKar session has expired. Please sign in again.');
  }

  return uid;
}

export async function createVehicle(input: CreateVehicleInput) {
  const uid = currentUid();

  const cleanRegistration = input.registrationNumber
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ');

  const cleanName = input.displayName.trim();
  const cleanType = input.vehicleType.trim();
  const cleanMakeModel = input.makeModel?.trim() || null;

  if (!cleanName || !cleanRegistration || !cleanType) {
    throw new Error(
      'Vehicle name, registration number and vehicle type are required.',
    );
  }

  const vehicleRef = doc(collection(db, 'vehicles'));
  const versionRef = doc(collection(db, 'vehicleVersions'));

  const vehicle = {
    id: vehicleRef.id,
    ownerAccountId: uid,
    displayName: cleanName,
    registrationNumber: cleanRegistration,
    vehicleType: cleanType,
    makeModel: cleanMakeModel,
    status: 'ACTIVE' as const,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const batch = writeBatch(db);

  batch.set(vehicleRef, vehicle);

  batch.set(versionRef, {
    id: versionRef.id,
    vehicleId: vehicleRef.id,
    ownerAccountId: uid,
    version: 1,
    snapshot: {
      displayName: cleanName,
      registrationNumber: cleanRegistration,
      vehicleType: cleanType,
      makeModel: cleanMakeModel,
      status: 'ACTIVE',
    },
    reason: 'VEHICLE_CREATED',
    createdAt: serverTimestamp(),
  });

  await batch.commit();

  return vehicleRef.id;
}

export async function listMyVehicles(): Promise<Vehicle[]> {
  const uid = currentUid();

  // Important: Firestore security rules are not filters.
  // Query only documents belonging to the signed-in owner.
  const q = query(
    collection(db, 'vehicles'),
    where('ownerAccountId', '==', uid),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(item => item.data() as Vehicle);
}