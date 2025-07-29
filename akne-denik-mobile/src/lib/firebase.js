// src/lib/firebase.js - Pro Firebase SDK 12.0.0
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase konfigurace - Akné Online projekt
const firebaseConfig = {
  apiKey: "AIzaSyA87CZ2_zeU-hh-e6vFc9k0hQSoHex2Brk",
  authDomain: "akneonline-c6ec4.firebaseapp.com",
  projectId: "akneonline-c6ec4",
  storageBucket: "akneonline-c6ec4.appspot.com",
  messagingSenderId: "913808196294",
  appId: "1:913808196294:web:13954d1f314ff533da4dc7",
  measurementId: "G-752FSJ1T9Z"
};

// Inicializace Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Inicializace Auth s AsyncStorage persistencí pro React Native
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (error) {
  // Auth už je inicializovaný, použij existující
  auth = getAuth(app);
}

// Inicializace Firestore
const db = getFirestore(app);

// Inicializace Storage
const storage = getStorage(app);

// Export objektů
export { auth, db, storage };
export default app;

// Pro debugging - můžeš smazat po otestování
console.log('🔥 Firebase inicializován:', {
  projectId: firebaseConfig.projectId,
  auth: !!auth,
  db: !!db,
  storage: !!storage
});