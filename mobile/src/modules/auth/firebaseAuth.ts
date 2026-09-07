import { getApp } from '@react-native-firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  type User,
} from '@react-native-firebase/auth';

export const firebaseApp = getApp();
export const firebaseAuth = getAuth(firebaseApp);

export type TrackKarFirebaseUser = User;

export const observeAuthState = (
  listener: (user: TrackKarFirebaseUser | null) => void,
) => onAuthStateChanged(firebaseAuth, listener);
