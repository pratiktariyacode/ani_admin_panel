import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCWUMSK0JDPSsPKi_hNh7A-LMIgNKrSfDc",
  authDomain: "ecommerce-293a9.firebaseapp.com",
  projectId: "ecommerce-293a9",
  storageBucket: "ecommerce-293a9.firebasestorage.app",
  messagingSenderId: "717517812738",
  appId: "1:717517812738:web:26cecf68bc1e261b2e631b",
  measurementId: "G-CESMPZ623W"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
