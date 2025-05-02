// Personality Service Module
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase-config";
import { 
  PERSONALITY_DIMENSIONS, 
  PERSONALITY_ANALYSIS_SECTIONS,
  getInitialDimensions,
  calculatePersonalityTags
} from "../config/personalityAnalysis";
import { initializeUserDocument } from "./firebase-user";

// Calculate tags based on dimension values
const calculateTags = (dimensions) => {
  return calculatePersonalityTags(dimensions);
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