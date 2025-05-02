// Subscription Service Module
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase-config";
import { initializeUserDocument } from "./firebase-user";

// Mark user as paid in Firestore (simplified approach)
export const markUserAsPaid = async (userId) => {
  try {
    console.log(`Starting to mark user ${userId} as paid`);
    
    // Ensure user document exists
    await initializeUserDocument(userId);
    console.log('User document initialized');
    
    const userRef = doc(db, 'users', userId);
    
    // Get current document to verify
    const beforeDoc = await getDoc(userRef);
    console.log('User document before update:', 
      beforeDoc.exists() ? 'exists' : 'does not exist',
      beforeDoc.exists() ? beforeDoc.data() : '');
    
    // Set the paid flag to true with timestamp
    const paidAt = new Date();
    
    // Simply set isPaid flag to true
    await updateDoc(userRef, {
      isPaid: true,
      paidAt: paidAt
    });
    
    // Verify the update
    const afterDoc = await getDoc(userRef);
    console.log('User document after update:', 
      afterDoc.exists() ? afterDoc.data() : 'document does not exist');
    
    console.log(`User ${userId} marked as paid in Firestore at ${paidAt}`);
    return true;
  } catch (error) {
    console.error('Error marking user as paid:', error);
    return false;
  }
};

// Check if user is paid
export const checkUserPaidStatus = async (userId) => {
  try {
    console.log(`Checking paid status for user: ${userId}`);
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    console.log('User document exists:', userDoc.exists());
    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log('User data:', userData);
      console.log('isPaid value:', userData.isPaid);
      
      if (userData.isPaid === true) {
        console.log('User is paid, returning true');
        return {
          isPaid: true,
          paidAt: userData.paidAt || null
        };
      } else {
        console.log('User document exists but isPaid is not true');
      }
    } else {
      console.log('User document does not exist');
    }
    
    console.log('Returning not paid status');
    return {
      isPaid: false
    };
  } catch (error) {
    console.error('Error checking paid status:', error);
    return {
      isPaid: false,
      error: error.message
    };
  }
}; 