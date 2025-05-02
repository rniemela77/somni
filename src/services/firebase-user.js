// User Service Module
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase-config";
import { 
  PERSONALITY_ANALYSIS_SECTIONS,
  getInitialDimensions
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
      if (Object.keys(currentDimensions).length !== Object.keys(getInitialDimensions()).length) {
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