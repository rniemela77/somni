// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";


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

// Define personality dimensions and their characteristics
export const PERSONALITY_DIMENSIONS = {
  THINKING_FEELING: {
    name: "Thinking-Feeling",
    range: [-2, 2],
    value: 0,
    leftLabel: "Thinking",
    rightLabel: "Feeling",
    thresholds: {
      "-2": "Strong Thinker",
      "-1": "Moderate Thinker",
      "1": "Moderate Feeler",
      "2": "Strong Feeler"
    }
  },
  JUDGING_PERCEIVING: {
    name: "Judging-Perceiving",
    range: [-2, 2],
    value: 0,
    leftLabel: "Judging",
    rightLabel: "Perceiving",
    thresholds: {
      "-2": "Strong Judger",
      "-1": "Moderate Judger",
      "1": "Moderate Perceiver",
      "2": "Strong Perceiver"
    }
  },
  INTROVERT_EXTROVERT: {
    name: "Introversion-Extroversion",
    range: [-2, 2],
    value: 0,
    leftLabel: "Introvert",
    rightLabel: "Extrovert",
    thresholds: {
      "-2": "Strong Introvert",
      "-1": "Moderate Introvert",
      "1": "Moderate Extrovert",
      "2": "Strong Extrovert"
    }
  },
  SENSING_INTUITION: {
    name: "Sensing-Intuition",
    range: [-2, 2],
    value: 0,
    leftLabel: "Sensing",
    rightLabel: "Intuition",
    thresholds: {
      "-2": "Strong Sensing",
      "-1": "Moderate Sensing",
      "1": "Moderate Intuitive",
      "2": "Strong Intuitive"
    }
  }
};

// Helper function to get initial dimensions state
const getInitialDimensions = () => {
  const dimensions = {};
  Object.keys(PERSONALITY_DIMENSIONS).forEach(key => {
    dimensions[key] = PERSONALITY_DIMENSIONS[key].value;
  });
  return dimensions;
};

// Calculate tags based on dimension values
const calculateTags = (dimensions) => {
  const tags = [];
  Object.entries(dimensions).forEach(([dimension, value]) => {
    const dimensionConfig = PERSONALITY_DIMENSIONS[dimension];
    const roundedValue = Math.round(value); // Round to nearest integer
    const threshold = dimensionConfig.thresholds[roundedValue];
    if (threshold) {
      tags.push(threshold);
    }
  });
  return tags;
};

// User document initialization
export const initializeUserDocument = async (userId, userData = {}) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      await setDoc(userRef, {
        ...userData,
        dimensions: getInitialDimensions(),
        tags: [],
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

export { auth, db, firebaseConfig };