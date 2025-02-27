import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDCWw7vfcMqW2RxFuYm2dRKWtmk9hawwDs",
  authDomain: "teamrides-b7503.firebaseapp.com",
  projectId: "teamrides-b7503",
  storageBucket: "teamrides-b7503.appspot.com", // Fixed typo
  messagingSenderId: "47208967863",
  appId: "1:47208967863:web:aca32ab89670ee52782732"
};

// Initialize Firebase App
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Correctly export Firebase services
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app); // ✅ Ensure Firestore is initialized

export default app;
