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
        dimensions: getInitialDimensions(),
        tags: [],
        personalityAnalysis,
        isPaid: false, // Explicitly initialize isPaid to false
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      console.log('Creating user document with data:', newUserData);
      await setDoc(userRef, newUserData);
      console.log('User document created successfully');
    } else {
      console.log('User document already exists');
      // Ensure all dimensions exist in existing documents
      const currentDimensions = userDoc.data().dimensions || {};
      const updatedDimensions = {
        ...getInitialDimensions(),
        ...currentDimensions
      };
      
      // Log current paid status if it exists
      if (userDoc.data().hasOwnProperty('isPaid')) {
        console.log('Current isPaid status:', userDoc.data().isPaid);
      } else {
        console.log('isPaid property not found in user document');
      }
      
      // Initialize missing fields if needed
      const updateData = {};
      
      // Update document only if dimensions are missing
      if (Object.keys(currentDimensions).length !== Object.keys(PERSONALITY_DIMENSIONS).length) {
        updateData.dimensions = updatedDimensions;
      }
      
      // Ensure personalityAnalysis field exists with all sections
      if (!userDoc.data().personalityAnalysis) {
        const personalityAnalysis = {};
        Object.keys(PERSONALITY_ANALYSIS_SECTIONS).forEach(sectionKey => {
          personalityAnalysis[sectionKey] = null;
        });
        
        updateData.personalityAnalysis = personalityAnalysis;
      }
      
      // Set isPaid to false if it doesn't exist
      if (!userDoc.data().hasOwnProperty('isPaid')) {
        console.log('Adding missing isPaid property (false) to user document');
        updateData.isPaid = false;
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

// Simple Subscription Functions

// Mark user as paid in Firestore (simplified approach)
export const markUserAsPaid = async (userId) => {
  try {
    console.log(`Starting to mark user ${userId} as paid`);
    
    // Ensure user document exists
    await initializeUserDocument(userId);
    console.log('User document initialized');
    
    const userRef = doc(db, 'users', userId);
    
    // Get current document to verify
    const beforeDoc = await getDoc(userRef);
    console.log('User document before update:', 
      beforeDoc.exists() ? 'exists' : 'does not exist',
      beforeDoc.exists() ? beforeDoc.data() : '');
    
    // Set the paid flag to true with timestamp
    const paidAt = new Date();
    
    // Simply set isPaid flag to true
    await updateDoc(userRef, {
      isPaid: true,
      paidAt: paidAt
    });
    
    // Verify the update
    const afterDoc = await getDoc(userRef);
    console.log('User document after update:', 
      afterDoc.exists() ? afterDoc.data() : 'document does not exist');
    
    console.log(`User ${userId} marked as paid in Firestore at ${paidAt}`);
    return true;
  } catch (error) {
    console.error('Error marking user as paid:', error);
    return false;
  }
};

// Check if user is paid
export const checkUserPaidStatus = async (userId) => {
  try {
    console.log(`Checking paid status for user: ${userId}`);
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    console.log('User document exists:', userDoc.exists());
    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log('User data:', userData);
      console.log('isPaid value:', userData.isPaid);
      
      if (userData.isPaid === true) {
        console.log('User is paid, returning true');
        return {
          isPaid: true,
          paidAt: userData.paidAt || null
        };
      } else {
        console.log('User document exists but isPaid is not true');
      }
    } else {
      console.log('User document does not exist');
    }
    
    console.log('Returning not paid status');
    return {
      isPaid: false
    };
  } catch (error) {
    console.error('Error checking paid status:', error);
    return {
      isPaid: false,
      error: error.message
    };
  }
};