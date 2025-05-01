import { initializeFirebase } from './utils/firebase.js';
import { success, error, handleOptions } from './utils/response.js';
import { getFirestore } from 'firebase-admin/firestore';

export const handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }
  
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return error('Method not allowed', 405);
  }
  
  try {
    // Initialize Firebase
    const db = await initializeFirebase();
    
    // Get user ID from path parameters
    const userId = event.path.split('/').pop();
    
    if (!userId) {
      return error("User ID is required", 400);
    }
    
    // Query Firebase for the user's paid status
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (userDoc.exists && userDoc.data().isPaid === true) {
      console.log(`User ${userId} is paid`);
      return success({
        isPaid: true,
        paidAt: userDoc.data().paidAt || null
      });
    } else {
      console.log(`User ${userId} is not paid`);
      return success({
        isPaid: false
      });
    }
  } catch (err) {
    console.error("Error checking paid status:", err);
    return error("Failed to check paid status", 500);
  }
}; 