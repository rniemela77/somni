// Personality Service Module
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase-config";
import { 
  PERSONALITY_ANALYSIS_SECTIONS,
} from "../config/personalityAnalysis";
import { initializeUserDocument } from "./firebase-user";
import { getUserPersonality, getUserPersonalityAnalysis, updateUserPersonalityAnalysis } from "./firebase-utils";

// Removed duplicate updateUserPersonalityAnalysis function

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