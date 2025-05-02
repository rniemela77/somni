// Authentication Service Module
import { auth } from "./firebase-config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// Auth Service
export const authService = {
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, error: null };
    } catch (error) {
      console.error("Sign in error:", error);
      return { user: null, error: error.message };
    }
  },

  async signUp(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, error: null };
    } catch (error) {
      console.error("Sign up error:", error);
      return { user: null, error: error.message };
    }
  },

  async logout() {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error) {
      console.error("Logout error:", error);
      return { error: error.message };
    }
  },

  getCurrentUser() {
    return auth.currentUser;
  },
}; 