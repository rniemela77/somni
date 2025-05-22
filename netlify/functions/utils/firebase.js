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