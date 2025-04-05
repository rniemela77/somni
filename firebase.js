// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

// Import the personality analysis configuration
import { 
  PERSONALITY_DIMENSIONS, 
  PERSONALITY_ANALYSIS_SECTIONS,
  getInitialDimensions,
  calculatePersonalityTags
} from "./src/config/personalityAnalysis";

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

// Calculate tags based on dimension values
const calculateTags = (dimensions) => {
  return calculatePersonalityTags(dimensions);
};

// User document initialization
export const initializeUserDocument = async (userId, userData = {}) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      // Create an initial personalityAnalysis object with all sections
      const personalityAnalysis = {};
      Object.keys(PERSONALITY_ANALYSIS_SECTIONS).forEach(sectionKey => {
        personalityAnalysis[sectionKey] = null;
      });
      
      await setDoc(userRef, {
        ...userData,
        dimensions: getInitialDimensions(),
        tags: [],
        personalityAnalysis,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } else {
      // Ensure all dimensions exist in existing documents
      const currentDimensions = userDoc.data().dimensions || {};
      const updatedDimensions = {
        ...getInitialDimensions(),
        ...currentDimensions
      };
      
      // Update document only if dimensions are missing
      if (Object.keys(currentDimensions).length !== Object.keys(PERSONALITY_DIMENSIONS).length) {
        await updateDoc(userRef, {
          dimensions: updatedDimensions,
          updatedAt: new Date()
        });
      }
      
      // Ensure personalityAnalysis field exists with all sections
      if (!userDoc.data().personalityAnalysis) {
        const personalityAnalysis = {};
        Object.keys(PERSONALITY_ANALYSIS_SECTIONS).forEach(sectionKey => {
          personalityAnalysis[sectionKey] = null;
        });
        
        await updateDoc(userRef, {
          personalityAnalysis,
          updatedAt: new Date()
        });
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
    const currentDimensions = userDoc.exists() ? userDoc.data().dimensions || {} : {};
    
    // Clamp value to dimension range
    const dimensionConfig = PERSONALITY_DIMENSIONS[dimension];
    const [min, max] = dimensionConfig.range;
    const clampedValue = Math.max(min, Math.min(max, value));
    
    // Update the specific dimension while preserving others
    const updatedDimensions = {
      ...getInitialDimensions(),
      ...currentDimensions,
      [dimension]: clampedValue
    };
    
    // Calculate new tags based on updated dimensions
    const newTags = calculateTags(updatedDimensions);
    
    // Update both dimensions and tags
    await updateDoc(userRef, {
      dimensions: updatedDimensions,
      tags: newTags,
      updatedAt: new Date()
    });
    
    return true;
  } catch (error) {
    console.error('Error updating dimension value:', error);
    return false;
  }
};

// Get user's dimensions and tags
export const getUserPersonality = async (userId) => {
  try {
    // Ensure user document exists
    await initializeUserDocument(userId);
    
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        dimensions: {
          ...getInitialDimensions(),
          ...data.dimensions
        },
        tags: data.tags || []
      };
    }
    return {
      dimensions: getInitialDimensions(),
      tags: []
    };
  } catch (error) {
    console.error('Error getting user personality:', error);
    return {
      dimensions: getInitialDimensions(),
      tags: []
    };
  }
};

// Increment a dimension value by a certain amount
export const incrementDimensionValue = async (userId, dimension, increment) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    const currentDimensions = userDoc.exists() ? userDoc.data().dimensions || {} : {};
    
    const currentValue = currentDimensions[dimension] || 0;
    const newValue = currentValue + increment;
    
    return await updateDimensionValue(userId, dimension, newValue);
  } catch (error) {
    console.error('Error incrementing dimension value:', error);
    return false;
  }
};

// Update user's personality analysis data
export const updateUserPersonalityAnalysis = async (userId, analysisData) => {
  try {
    // Ensure user document exists
    await initializeUserDocument(userId);
    
    const userRef = doc(db, 'users', userId);
    
    // Prepare the data to update using the configuration
    const analysisToSave = {};
    
    // Process each section from our configuration
    Object.keys(PERSONALITY_ANALYSIS_SECTIONS).forEach(sectionKey => {
      analysisToSave[sectionKey] = analysisData[sectionKey] || null;
    });
    
    // Add timestamp
    analysisToSave.updatedAt = new Date();
    
    // Update the user document with personality analysis data
    await updateDoc(userRef, {
      personalityAnalysis: analysisToSave
    });
    
    console.log('Updated personality analysis in Firebase:', analysisToSave);
    return true;
  } catch (error) {
    console.error('Error updating personality analysis:', error);
    return false;
  }
};

// Get user's personality analysis data
export const getUserPersonalityAnalysis = async (userId) => {
  try {
    // Ensure user document exists
    await initializeUserDocument(userId);
    
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const data = userDoc.data();
      
      // If personalityAnalysis doesn't exist, initialize it
      if (!data.personalityAnalysis) {
        const personalityAnalysis = {};
        Object.keys(PERSONALITY_ANALYSIS_SECTIONS).forEach(sectionKey => {
          personalityAnalysis[sectionKey] = null;
        });
        return { personalityAnalysis };
      }
      
      return {
        personalityAnalysis: data.personalityAnalysis
      };
    }
    
    // Return empty structure if no data exists
    const personalityAnalysis = {};
    Object.keys(PERSONALITY_ANALYSIS_SECTIONS).forEach(sectionKey => {
      personalityAnalysis[sectionKey] = null;
    });
    return { personalityAnalysis };
  } catch (error) {
    console.error('Error getting user personality analysis:', error);
    // Return empty structure on error
    const personalityAnalysis = {};
    Object.keys(PERSONALITY_ANALYSIS_SECTIONS).forEach(sectionKey => {
      personalityAnalysis[sectionKey] = null;
    });
    return { personalityAnalysis };
  }
};

export { auth, db, firebaseConfig };