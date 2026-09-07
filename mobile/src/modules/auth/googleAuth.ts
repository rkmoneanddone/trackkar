import {
  GoogleSignin,
  isSuccessResponse,
} from '@react-native-google-signin/google-signin';
import {
  GoogleAuthProvider,
  signInWithCredential,
  signOut as firebaseSignOut,
} from '@react-native-firebase/auth';
import {firebaseAuth} from './firebaseAuth';

const WEB_CLIENT_ID = '639728341171-8miuj88fi35il1g6i7vm1530qpanaebg.apps.googleusercontent.com';

let configured = false;

export function configureGoogleSignIn() {
  if (configured) {
    return;
  }

  GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
    offlineAccess: false,
  });

  configured = true;
}

export async function signInWithGoogle() {
  configureGoogleSignIn();

  await GoogleSignin.hasPlayServices({
    showPlayServicesUpdateDialog: true,
  });

  const response = await GoogleSignin.signIn();

  if (!isSuccessResponse(response)) {
    return null;
  }

  const idToken = response.data.idToken;

  if (!idToken) {
    throw new Error('Google did not return an ID token.');
  }

  const credential = GoogleAuthProvider.credential(idToken);
  const result = await signInWithCredential(firebaseAuth, credential);

  return result.user;
}

export async function signOutTrackKar() {
  try {
    await GoogleSignin.signOut();
  } catch {
    // Firebase sign-out must still proceed even if Google has no local session.
  }

  await firebaseSignOut(firebaseAuth);
}