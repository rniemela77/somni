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
    
    // Query Firebase for the user's subscription status
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return success({
        hasActiveSubscription: false,
        subscriptionData: null
      });
    }
    
    const userData = userDoc.data();
    
    // Check if user has a subscription object
    if (userData.subscription && userData.subscription.active) {
      console.log(`Found active subscription for user ${userId}`);
      
      // Check if the subscription has expired
      const endDate = userData.subscription.endDate?.toDate() || new Date(0);
      const now = new Date();
      
      if (endDate > now) {
        // Return subscription status
        return success({
          hasActiveSubscription: true,
          subscriptionData: userData.subscription
        });
      } else {
        console.log(`Subscription expired for user ${userId}`);
        return success({
          hasActiveSubscription: false,
          subscriptionData: {
            ...userData.subscription,
            status: 'expired'
          }
        });
      }
    }
    
    // Check if the user is marked as paid (simple payment)
    if (userData.isPaid === true) {
      return success({
        hasActiveSubscription: true,
        isPaid: true,
        paidAt: userData.paidAt
      });
    }
    
    // No active subscription or payment found
    return success({
      hasActiveSubscription: false,
      subscriptionData: userData.subscription || null
    });
  } catch (err) {
    console.error("Error checking subscription status:", err);
    return error("Failed to check subscription status", 500);
  }
}; 