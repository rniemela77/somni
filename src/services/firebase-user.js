// User Service Module
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase-config";
import { 
  PERSONALITY_ANALYSIS_SECTIONS,
} from "../config/personalityAnalysis";

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
        isPaid: false, // Explicitly initialize isPaid to false
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Create user document
      await setDoc(userRef, newUserData);
    } else {
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
        await updateDoc(userRef, updateData);
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