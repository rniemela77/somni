// Authentication Service Module
import { auth } from "./firebase-config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged
} from "firebase/auth";

// Auth Service
export const authService = {
  /**
   * Sign in a user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{user: object|null, error: string|null}>}
   */
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, error: null };
    } catch (error) {
      console.error("Sign in error:", error);
      return { user: null, error: error.message };
    }
  },

  /**
   * Create a new user account with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{user: object|null, error: string|null}>}
   */
  async signUp(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, error: null };
    } catch (error) {
      console.error("Sign up error:", error);
      return { user: null, error: error.message };
    }
  },

  /**
   * Sign out the current user
   * @returns {Promise<{error: string|null}>}
   */
  async logout() {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error) {
      console.error("Logout error:", error);
      return { error: error.message };
    }
  },

  /**
   * Get the current authenticated user
   * @returns {object|null} - The current user or null
   */
  getCurrentUser() {
    return auth.currentUser;
  },
  
  /**
   * Send a password reset email
   * @param {string} email - Email address to send reset link to
   * @returns {Promise<{success: boolean, error: string|null}>}
   */
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, error: null };
    } catch (error) {
      console.error("Password reset error:", error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Set up an auth state change listener
   * @param {Function} callback - The callback to execute when auth state changes
   * @returns {Function} - Unsubscribe function to remove the listener
   */
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  }
}; 