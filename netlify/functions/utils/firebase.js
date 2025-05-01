import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module using a more robust approach
let serviceAccountPath;

// Handle path resolution in a way that works in both development and production
try {
  // Try using import.meta.url first (works in newer Node.js versions)
  if (import.meta && import.meta.url) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    serviceAccountPath = path.resolve(__dirname, '../../../serviceAccountKey.json');
  } else {
    // Fallback for environments where import.meta.url is not available
    // Use an absolute path relative to the project root
    serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
  }
} catch (err) {
  // Final fallback - just use the project root
  serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
  console.log('Using fallback service account path:', serviceAccountPath);
}

let adminApp;

// Initialize Firebase Admin (with caching to prevent multiple initializations)
export const initializeFirebase = async () => {
  if (admin.apps.length === 0) {
    try {
        const serviceAccount = JSON.parse(await readFile(serviceAccountPath, 'utf8'));
        adminApp = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
      console.log('Firebase Admin initialized successfully');
    } catch (error) {
      console.error('Error initializing Firebase Admin:', error);
      console.error('Service account path tried:', serviceAccountPath);
      throw error;
    }
  }
  return getFirestore();
};

// Function to mark user as paid in Firebase
export const markUserAsPaidInFirebase = async (userId) => {
  try {
    console.log(`Marking user ${userId} as paid in Firebase`);
    
    const db = getFirestore();
    // Reference to user document
    const userRef = db.collection('users').doc(userId);
    
    // Get existing document to ensure it exists
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      // Create user document if it doesn't exist
      await userRef.set({
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    
    // Update with paid status
    await userRef.update({
      isPaid: true,
      paidAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`User ${userId} successfully marked as paid in Firebase`);
    return true;
  } catch (error) {
    console.error('Error marking user as paid in Firebase:', error);
    return false;
  }
};

// Function to activate subscription in Firebase
export const activateSubscriptionInFirebase = async (userId, sessionId, subscriptionId, customerId) => {
  try {
    console.log(`Activating subscription in Firebase for user ${userId}`);
    
    const db = getFirestore();
    // Generate subscription end date (one month from now)
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    
    // Update user document with subscription info
    const userRef = db.collection('users').doc(userId);
    
    // Get existing document to ensure it exists
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      // Create user document if it doesn't exist
      await userRef.set({
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    
    // Update with subscription data
    await userRef.update({
      subscription: {
        active: true,
        stripeSessionId: sessionId || null,
        stripeSubscriptionId: subscriptionId || null,
        stripeCustomerId: customerId || null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        endDate: endDate,
        status: 'active',
        plan: 'monthly',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }
    });
    
    console.log(`Subscription successfully activated in Firebase for user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error activating subscription in Firebase:', error);
    return false;
  }
};

// Function to update subscription status in Firebase
export const updateSubscriptionInFirebase = async (userId, status, canceledAt = null) => {
  try {
    console.log(`Updating subscription status in Firebase for user ${userId} to ${status}`);
    
    const db = getFirestore();
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (userDoc.exists && userDoc.data().subscription) {
      await userRef.update({
        'subscription.active': status === 'active',
        'subscription.status': status,
        'subscription.updatedAt': admin.firestore.FieldValue.serverTimestamp(),
        ...(canceledAt && { 'subscription.canceledAt': canceledAt })
      });
      
      console.log(`Subscription status updated to ${status} for user ${userId}`);
      return true;
    } else {
      console.warn(`No subscription found for user ${userId}`);
      return false;
    }
  } catch (error) {
    console.error('Error updating subscription in Firebase:', error);
    return false;
  }
};

// Function to find user by subscription ID
export const findUserBySubscriptionId = async (subscriptionId) => {
  try {
    console.log(`Finding user by subscription ID: ${subscriptionId}`);
    
    const db = getFirestore();
    const usersSnapshot = await db.collection('users')
      .where('subscription.stripeSubscriptionId', '==', subscriptionId)
      .limit(1)
      .get();
    
    if (usersSnapshot.empty) {
      console.warn(`No user found with subscription ID: ${subscriptionId}`);
      return null;
    }
    
    const userId = usersSnapshot.docs[0].id;
    console.log(`Found user ${userId} with subscription ID: ${subscriptionId}`);
    return userId;
  } catch (error) {
    console.error('Error finding user by subscription ID:', error);
    return null;
  }
};

// Function to store Stripe session data in Firebase
export const updateSessionInFirebase = async (userId, sessionId, status = 'pending') => {
  try {
    console.log(`Storing session ${sessionId} for user ${userId} in Firebase`);
    
    const db = getFirestore();
    // Update user document with session info
    const userRef = db.collection('users').doc(userId);
    
    // Get existing document to ensure it exists
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      // Create user document if it doesn't exist
      await userRef.set({
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    
    // Update with session data
    await userRef.update({
      stripeSession: {
        sessionId: sessionId,
        status: status,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }
    });
    
    console.log(`Session data stored in Firebase for user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error storing session in Firebase:', error);
    return false;
  }
}; 