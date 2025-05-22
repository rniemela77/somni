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
    
    if (!userDoc.exists) {
      return success({
        hasPremiumAccess: false
      });
    }
    
    const userData = userDoc.data();
    
    // Check if the user is marked as paid
    if (userData.isPaid === true) {
      return success({
        hasPremiumAccess: true,
        paidAt: userData.paidAt || null
      });
    }
    
    // No payment found
    return success({
      hasPremiumAccess: false
    });
  } catch (err) {
    console.error("Error checking premium status:", err);
    return error("Failed to check premium status", 500);
  }
}; 