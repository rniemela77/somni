// Authentication Service Module
import { auth } from "./firebase-config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

const AUTH_ERROR_MESSAGES = {
  'auth/user-not-found': 'No account found with this email',
  'auth/wrong-password': 'Incorrect password',
  'auth/email-already-in-use': 'An account already exists with this email',
  'auth/invalid-email': 'Please enter a valid email address',
  'auth/weak-password': 'Password should be at least 6 characters',
  'auth/popup-closed-by-user': 'Google sign-in was cancelled',
  'auth/network-request-failed': 'Network error. Please check your connection',
  'auth/too-many-requests': 'Too many attempts. Please try again later',
  'default': 'An unexpected error occurred'
};

// Auth Service
export const authService = {
  /**
   * Sign in a user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{user: object|null, error: string|null}>}
   */
  async signIn(email, password) {
    console.log('[Auth Service] Attempting sign in...');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('[Auth Service] Sign in successful');
      return { user: userCredential.user, error: null };
    } catch (error) {
      console.error("[Auth Service] Sign in error:", error);
      return { 
        user: null, 
        error: AUTH_ERROR_MESSAGES[error.code] || AUTH_ERROR_MESSAGES.default 
      };
    }
  },

  /**
   * Sign in with Google using popup
   * @returns {Promise<{user: object|null, error: string|null}>}
   */
  async signInWithGoogle() {
    console.log('[Auth Service] Attempting Google sign in...');
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      console.log('[Auth Service] Google sign in successful');
      return { user: userCredential.user, error: null };
    } catch (error) {
      console.error("[Auth Service] Google sign in error:", error);
      return { 
        user: null, 
        error: AUTH_ERROR_MESSAGES[error.code] || AUTH_ERROR_MESSAGES.default 
      };
    }
  },

  /**
   * Create a new user account with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{user: object|null, error: string|null}>}
   */
  async signUp(email, password) {
    console.log('[Auth Service] Attempting sign up...');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('[Auth Service] Sign up successful');
      return { user: userCredential.user, error: null };
    } catch (error) {
      console.error("[Auth Service] Sign up error:", error);
      return { 
        user: null, 
        error: AUTH_ERROR_MESSAGES[error.code] || AUTH_ERROR_MESSAGES.default 
      };
    }
  },

  /**
   * Sign out the current user
   * @returns {Promise<{error: string|null}>}
   */
  async logout() {
    console.log('[Auth Service] Attempting logout...');
    try {
      await signOut(auth);
      console.log('[Auth Service] Logout successful');
      return { error: null };
    } catch (error) {
      console.error("[Auth Service] Logout error:", error);
      return { 
        error: AUTH_ERROR_MESSAGES[error.code] || AUTH_ERROR_MESSAGES.default 
      };
    }
  },

  /**
   * Get the current authenticated user
   * @returns {object|null} - The current user or null
   */
  getCurrentUser() {
    const user = auth.currentUser;
    console.log('[Auth Service] Getting current user:', user ? 'exists' : 'null');
    return user;
  },
  
  /**
   * Send a password reset email
   * @param {string} email - Email address to send reset link to
   * @returns {Promise<{success: boolean, error: string|null}>}
   */
  async resetPassword(email) {
    console.log('[Auth Service] Attempting password reset...');
    try {
      await sendPasswordResetEmail(auth, email);
      console.log('[Auth Service] Password reset email sent');
      return { success: true, error: null };
    } catch (error) {
      console.error("[Auth Service] Password reset error:", error);
      return { 
        success: false, 
        error: AUTH_ERROR_MESSAGES[error.code] || AUTH_ERROR_MESSAGES.default 
      };
    }
  },
  
  /**
   * Set up an auth state change listener
   * @param {Function} callback - The callback to execute when auth state changes
   * @returns {Function} - Unsubscribe function to remove the listener
   */
  onAuthStateChanged(callback) {
    console.log('[Auth Service] Setting up auth state change listener');
    return onAuthStateChanged(auth, (user) => {
      console.log('[Auth Service] Auth state changed:', user ? 'user exists' : 'no user');
      callback(user);
    });
  }
}; 