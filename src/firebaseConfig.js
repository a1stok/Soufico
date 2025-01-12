import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyChEUW5_0MMWhvHoaUA8pHInKZbyGia-FY",
  authDomain: "flowershop-3e9f1.firebaseapp.com",
  projectId: "flowershop-3e9f1",
  storageBucket: "flowershop-3e9f1.appspot.com",
  messagingSenderId: "474875038980",
  appId: "1:474875038980:web:f3b74aa30a40d09e885451",
  measurementId: "G-12MPZ1J1ZN"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export { app };
