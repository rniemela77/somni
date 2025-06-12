import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';

export const auth: Auth;
export const db: Firestore;
export const firebaseConfig: {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}; 