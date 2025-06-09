import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

// Firebase configuration for dudupe-504ce project
// Using environment variables for security (fallback to direct values for deployment)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyC795j1Xf7TJv354A3z8i8y0Q9VVbDpmHQ",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "dudupe-504ce.firebaseapp.com",
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://dudupe-504ce-default-rtdb.firebaseio.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "dudupe-504ce",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "dudupe-504ce.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "716564438315",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:716564438315:web:6a0d20ae5cc22ff479f96e",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-JQTVGV6MBH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Realtime Database and get a reference to the service
export const rtdb = getDatabase(app);

export default app; 