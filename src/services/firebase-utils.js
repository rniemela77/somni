import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase-config";
import { initializeUserDocument } from "./firebase-user";

// Utility function to get user's tags
export const getUserPersonality = async (userId) => {
  try {
    // Ensure user document exists
    await initializeUserDocument(userId);
    
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        tags: data.tags || []
      };
    }
    return {
      tags: []
    };
  } catch (error) {
    console.error('Error getting user personality:', error);
    return {
      tags: []
    };
  }
};

// Utility function to get user's personality analysis data
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

// Utility function to update user's personality analysis data
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