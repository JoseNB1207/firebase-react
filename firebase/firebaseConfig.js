import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyA_YLyq00VBPvfN-nPG0sFpIK0T8GFA6a8",
  authDomain: "api-firebase-b055c.firebaseapp.com",
  projectId: "api-firebase-b055c",
  storageBucket: "api-firebase-b055c.firebasestorage.app",
  messagingSenderId: "800892606704",
  appId: "1:800892606704:web:424ea0ac3f86d52e3a4a35",
  measurementId: "G-NDDDV2TMXH"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };