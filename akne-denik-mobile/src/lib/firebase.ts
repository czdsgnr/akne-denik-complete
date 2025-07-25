import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  // POUŽIJ STEJNOU KONFIGURACI JAKO VE WEB VERZI
  apiKey: "tvoje-api-key",
  authDomain: "tvuj-projekt.firebaseapp.com",
  projectId: "tvuj-projekt",
  storageBucket: "tvuj-projekt.appspot.com",
  messagingSenderId: "123456789",
  appId: "tvoje-app-id"
};

let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (error) {
  auth = getAuth(app);
}

export const db = getFirestore(app);
export const storage = getStorage(app);
export { auth };
export default app;