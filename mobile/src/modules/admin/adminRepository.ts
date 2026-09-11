import {collection, getCountFromServer, getFirestore, query, where} from '@react-native-firebase/firestore';
import {firebaseApp, firebaseAuth} from '../auth/firebaseAuth';

const db = getFirestore(firebaseApp);

async function assertAdmin() {
  const user = firebaseAuth.currentUser;
  if (!user || (await user.getIdTokenResult()).claims.admin !== true) {
    throw new Error('Administrator access is required.');
  }
}

export async function getAdminDashboardCounts() {
  await assertAdmin();
  const [accounts, providers, vehicles, activeRoutes, activeRuns, subscriptions] = await Promise.all([
    getCountFromServer(collection(db, 'accounts')),
    getCountFromServer(collection(db, 'providers')),
    getCountFromServer(collection(db, 'vehicles')),
    getCountFromServer(query(collection(db, 'routes'), where('status', '==', 'ACTIVE'))),
    getCountFromServer(query(collection(db, 'routeRuns'), where('status', '==', 'ACTIVE'))),
    getCountFromServer(query(collection(db, 'routeSubscriptions'), where('status', 'in', ['ACTIVE', 'MUTED']))),
  ]);
  return {accounts: accounts.data().count, providers: providers.data().count,
    vehicles: vehicles.data().count, activeRoutes: activeRoutes.data().count,
    activeRuns: activeRuns.data().count, subscriptions: subscriptions.data().count};
}
