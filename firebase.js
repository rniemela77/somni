// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

// Import the personality analysis configuration
import { 
  PERSONALITY_ANALYSIS_SECTIONS,
} from "./src/config/personalityAnalysis";

// Import shared utility functions
import { getUserPersonality, getUserPersonalityAnalysis, updateUserPersonalityAnalysis } from "./src/services/firebase-utils";

// Export utility functions
export { getUserPersonality, getUserPersonalityAnalysis, updateUserPersonalityAnalysis };

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

// User document initialization
export const initializeUserDocument = async (userId, userData = {}) => {
  try {
    console.log(`Initializing user document for ${userId}`);
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      console.log('User document does not exist, creating new one');
      // Create an initial personalityAnalysis object with all sections
      const personalityAnalysis = {};
      Object.keys(PERSONALITY_ANALYSIS_SECTIONS).forEach(sectionKey => {
        personalityAnalysis[sectionKey] = null;
      });
      
      // Create new user document
      const newUserData = {
        ...userData,
        tags: [],
        personalityAnalysis,
        isPaid: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      console.log('Creating user document with data:', newUserData);
      await setDoc(userRef, newUserData);
      console.log('User document created successfully');
    } else {
      console.log('User document already exists');
      
      // Initialize missing fields if needed
      const updateData = {};
      
      // Ensure personalityAnalysis field exists with all sections
      if (!userDoc.data().personalityAnalysis) {
        const personalityAnalysis = {};
        Object.keys(PERSONALITY_ANALYSIS_SECTIONS).forEach(sectionKey => {
          personalityAnalysis[sectionKey] = null;
        });
        
        updateData.personalityAnalysis = personalityAnalysis;
      }
      
      // Update only if we have changes
      if (Object.keys(updateData).length > 0) {
        updateData.updatedAt = new Date();
        console.log('Updating user document with:', updateData);
        await updateDoc(userRef, updateData);
        console.log('User document updated successfully');
      } else {
        console.log('No updates needed for user document');
      }
    }
    return true;
  } catch (error) {
    console.error('Error initializing user document:', error);
    return false;
  }
};

// Update user's dimension value
export const updateDimensionValue = async (userId, dimension, value) => {
  try {
    // Ensure user document exists
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