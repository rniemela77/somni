// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

// Import the personality analysis configuration
import { 
  PERSONALITY_ANALYSIS_SECTIONS,
} from "./src/config/personalityAnalysis";

// Export utility functions
export { initializeUserDocument } from "./src/services/firebase-user";
export { updateUserPersonalityAnalysis } from "./src/services/firebase-personality";
export { getUserPersonality, getUserPersonalityAnalysis } from "./src/services/firebase-utils";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Update user's dimension value
export const updateDimensionValue = async (userId, dimension, value) => {
  try {
    // Ensure user document exists
    const { initializeUserDocument } = await import("./src/services/firebase-user");
    await initializeUserDocument(userId);
    
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    // Update tags
    await updateDoc(userRef, {
      tags: newTags,
      updatedAt: new Date()
    });
    
    return true;
  } catch (error) {
    console.error('Error updating dimension value:', error);
    return false;
  }
};

export const checkUserPaidStatus = async (userId) => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  return userDoc.exists() && userDoc.data().isPaid;
};

export { auth, db, firebaseConfig };