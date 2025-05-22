import { initializeFirebase, markUserAsPaidInFirebase } from './utils/firebase.js';
import { success, error, handleOptions } from './utils/response.js';

export const handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }
  
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return error('Method not allowed', 405);
  }
  
  try {
    // Initialize Firebase
    await initializeFirebase();
    
    // Get user ID from path parameters
    const userId = event.path.split('/').pop();
    
    console.log(`Marking user as paid via API: ${userId}`);
    
    if (!userId) {
      console.log('Error: User ID is required but was not provided');
      return error("User ID is required", 400);
    }
    
    // Mark the user as paid in Firebase
    const result = await markUserAsPaidInFirebase(userId);
    
    if (result) {
      console.log(`Successfully marked user ${userId} as paid`);
      return success({ success: true, message: "User marked as paid successfully" });
    } else {
      console.log(`Failed to mark user ${userId} as paid`);
      return error("Failed to mark user as paid", 500);
    }
  } catch (err) {
    console.error("Error marking user as paid:", err);
    return error("Failed to mark user as paid", 500);
  }
}; 