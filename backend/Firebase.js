import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// const firebaseConfig = process.env.NODE_ENV === 'production' ? {
//   apiKey: "",
//   authDomain: "",
//   projectId: "",
//   storageBucket: "",
//   messagingSenderId: "",
//   appId: "", 
//   measurementId: ""
// } : {
//   apiKey: "",
//   authDomain: "",
//   projectId: "",
//   storageBucket: "com",
//   messagingSenderId: "",
//   appId: "",
//   measurementId: ""
// }

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const storage = getStorage(app);
// export const database = getFirestore(app);
// export const analytics = () => getAnalytics(app);

// export default app