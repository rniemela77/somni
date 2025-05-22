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
      // First try to use environment variables (preferred for production/Netlify)
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        // Parse the JSON string from environment variable
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        adminApp = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
        console.log('Firebase Admin initialized successfully using environment variable');
      } else {
        // Fall back to file-based approach (for local development)
        try {
          const serviceAccount = JSON.parse(await readFile(serviceAccountPath, 'utf8'));
          adminApp = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
          });
          console.log('Firebase Admin initialized successfully using service account file');
        } catch (fileError) {
          console.error('Error reading service account file:', fileError);
          console.error('Service account path tried:', serviceAccountPath);
          
          // If both approaches fail, throw a clear error
          throw new Error('Firebase initialization failed: No valid service account credentials available');
        }
      }
    } catch (error) {
      console.error('Error initializing Firebase Admin:', error);
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

// Function to store Stripe session data in Firebase
export const updateSessionInFirebase = async (userId, sessionId, status = 'pending') => {
  try {
    console.log(`Storing payment session ${sessionId} for user ${userId} in Firebase`);
    
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
    
    // Update with session data (simplified)
    await userRef.update({
      stripeSession: {
        sessionId: sessionId,
        status: status,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      }
    });
    
    console.log(`Payment session data stored in Firebase for user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error storing payment session in Firebase:', error);
    return false;
  }
}; 