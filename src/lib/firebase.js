import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA87CZ2_zeU-hh-e6vFc9k0hQSoHex2Brk",
  authDomain: "akneonline-c6ec4.firebaseapp.com",
  projectId: "akneonline-c6ec4",
  storageBucket: "akneonline-c6ec4.appspot.com",
  messagingSenderId: "913808196294",
  appId: "1:913808196294:web:13954d1f314ff533da4dc7",
  measurementId: "G-752FSJ1T9Z"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;

