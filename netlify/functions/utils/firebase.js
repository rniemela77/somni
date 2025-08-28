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
      } else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
        // Use individual environment variables for local development
        const serviceAccount = {
          type: "service_account",
          project_id: process.env.FIREBASE_PROJECT_ID,
          private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
          private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          client_email: process.env.FIREBASE_CLIENT_EMAIL,
          client_id: process.env.FIREBASE_CLIENT_ID,
          auth_uri: process.env.FIREBASE_AUTH_URI || "https://accounts.google.com/o/oauth2/auth",
          token_uri: process.env.FIREBASE_TOKEN_URI || "https://oauth2.googleapis.com/token",
          auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || "https://www.googleapis.com/oauth2/v1/certs",
          client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
        };
        
        adminApp = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
      } else {
        // Fall back to file-based approach (for local development)
        try {
          const serviceAccount = JSON.parse(await readFile(serviceAccountPath, 'utf8'));
          adminApp = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
          });
        } catch (fileError) {
          console.error('Error reading service account file:', fileError);
          console.error('Service account path tried:', serviceAccountPath);
          
          // If both approaches fail, throw a clear error
          throw new Error('Firebase initialization failed: No valid service account credentials available. Please set FIREBASE_SERVICE_ACCOUNT environment variable or create serviceAccountKey.json file.');
        }
      }
    } catch (error) {
      console.error('Error initializing Firebase Admin:', error);
      throw error;
    }
  }
  return getFirestore();
};