import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from '@react-native-firebase/firestore';
import {firebaseApp, firebaseAuth} from '../auth/firebaseAuth';
import type {CreateVehicleInput, Vehicle} from './vehicleTypes';
import {
  validateRequiredText,
  validateVehicleRegistration,
} from './vehicleValidation';

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

  const registrationResult = validateVehicleRegistration(
    input.registrationNumber,
  );
  if (!registrationResult.ok) {
    throw new Error(registrationResult.message);
  }

  const cleanRegistration = registrationResult.normalizedRegistration;

  const cleanName = input.displayName.trim();
  const cleanType = input.vehicleType.trim();
  const cleanMakeModel = input.makeModel?.trim() || null;

  const nameError = validateRequiredText(cleanName, 'Vehicle name', 40);
  if (nameError) {
    throw new Error(nameError);
  }

  const typeError = validateRequiredText(cleanType, 'Vehicle type', 30);
  if (typeError) {
    throw new Error(typeError);
  }

  if (cleanMakeModel && cleanMakeModel.length > 50) {
    throw new Error('Make / model must be 50 characters or fewer.');
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

  return snapshot.docs
    .map(item => item.data() as Vehicle)
    .sort((left, right) => left.displayName.localeCompare(right.displayName));
}

export async function getMyVehicle(vehicleId: string): Promise<Vehicle | null> {
  currentUid();

  const snapshot = await getDoc(doc(db, 'vehicles', vehicleId));
  return snapshot.exists() ? (snapshot.data() as Vehicle) : null;
}
