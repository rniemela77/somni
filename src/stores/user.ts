import { defineStore } from 'pinia';
import { 
  auth,
  db 
} from '../services/firebase-config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  writeBatch,
  serverTimestamp 
} from 'firebase/firestore';
import { PERSONALITY_ANALYSIS_SECTIONS } from '../config/personalityAnalysis';

export interface QuizResult {
  quizId: string;
  attribute: string;
  timestamp: string;
  answers: Record<string, string>;
  score: number;
}

interface AuthError extends Error {
  code: string;
}

interface UserState {
  // Firebase user
  user: FirebaseUser | null;
  
  // Form inputs
  email: string;
  password: string;
  
  // User data
  userAttributes: Record<string, number>;
  isPaid: boolean;
  personalityAnalysis: Record<string, any>;
  results: QuizResult[];
  
  // UI state
  loading: boolean;
  error: string;
  isProcessing: boolean;
}

const AUTH_ERROR_MESSAGES: Record<string, string> = {
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

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    // Firebase user
    user: null,
    
    // Form inputs
    email: '',
    password: '',
    
    // User data
    userAttributes: {},
    isPaid: false,
    personalityAnalysis: {},
    results: [],
    
    // UI state
    loading: false,
    error: '',
    isProcessing: false
  }),

  getters: {
    isAuthenticated: (state: UserState) => !!state.user,
    userId: (state: UserState) => state.user?.uid,
    userEmail: (state: UserState) => state.user?.email,
    isReady: (state: UserState) => !state.loading,
    errorMessage: (state: UserState) => state.error,
    isLoading: (state: UserState) => state.loading || state.isProcessing
  },

  actions: {
    // Auth State Management
    async setUser(firebaseUser: FirebaseUser | null) {
      this.loading = true;
      this.error = '';
      
      try {
        if (!firebaseUser) {
          this.user = null;
          this.userAttributes = {};
          return;
        }

        this.user = firebaseUser;
        
        // Get or create user document
        const { data, error } = await this.getOrCreateUser(firebaseUser.uid);
        
        if (error) {
          this.error = error;
          return;
        }

        if (data) {
          // Update store state with user data
          this.userAttributes = data.attributes || {};
          this.isPaid = data.isPaid;
          this.personalityAnalysis = data.personalityAnalysis || {};
          this.results = data.results || [];
        }
        
      } catch (error) {
        console.error('[User Store] Error setting user:', error);
        this.error = error instanceof Error ? error.message : 'Unknown error';
      } finally {
        this.loading = false;
      }
    },

    // Initialize auth state listener
    async init() {
      this.loading = true;
      try {
        // Check if there's a current user
        const currentUser = auth.currentUser;
        if (currentUser) {
          await this.setUser(currentUser);
        } else {
          this.user = null;
          this.userAttributes = {};
        }

        // Set up auth state listener
        onAuthStateChanged(auth, async (user) => {
          console.log('[User Store] Auth state changed:', user ? 'logged in' : 'logged out');
          await this.setUser(user);
        });
      } catch (error) {
        console.error('[User Store] Initialization error:', error);
        this.error = error instanceof Error ? error.message : 'Unknown error';
      } finally {
        this.loading = false;
      }
    },

    // Authentication Methods with Navigation
    async handleAuthAction(action: () => Promise<any>) {
      if (this.isProcessing) return { success: false, error: 'Already processing' };
      
      this.isProcessing = true;
      this.error = '';
      
      try {
        const result = await action();
        return result;
      } finally {
        this.isProcessing = false;
      }
    },

    async signIn() {
      return this.handleAuthAction(async () => {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
          await this.setUser(userCredential.user);
          return { success: true, error: null };
        } catch (error) {
          console.error('[User Store] Sign in error:', error);
          const authError = error as AuthError;
          this.error = AUTH_ERROR_MESSAGES[authError.code] || AUTH_ERROR_MESSAGES.default;
          return { success: false, error: this.error };
        }
      });
    },

    async signInWithGoogle() {
      return this.handleAuthAction(async () => {
        try {
          const provider = new GoogleAuthProvider();
          const userCredential = await signInWithPopup(auth, provider);
          await this.setUser(userCredential.user);
          return { success: true, error: null };
        } catch (error) {
          console.error('[User Store] Google sign in error:', error);
          const authError = error as AuthError;
          this.error = AUTH_ERROR_MESSAGES[authError.code] || AUTH_ERROR_MESSAGES.default;
          return { success: false, error: this.error };
        }
      });
    },

    async signUp() {
      return this.handleAuthAction(async () => {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
          await this.setUser(userCredential.user);
          return { success: true, error: null };
        } catch (error) {
          console.error('[User Store] Sign up error:', error);
          const authError = error as AuthError;
          this.error = AUTH_ERROR_MESSAGES[authError.code] || AUTH_ERROR_MESSAGES.default;
          return { success: false, error: this.error };
        }
      });
    },

    async signOut() {
      return this.handleAuthAction(async () => {
        try {
          await signOut(auth);
          await this.setUser(null);
          return { success: true, error: null };
        } catch (error) {
          console.error('[User Store] Sign out error:', error);
          const authError = error as AuthError;
          this.error = AUTH_ERROR_MESSAGES[authError.code] || AUTH_ERROR_MESSAGES.default;
          return { success: false, error: this.error };
        }
      });
    },

    async resetPassword(email?: string) {
      return this.handleAuthAction(async () => {
        try {
          await sendPasswordResetEmail(auth, email || this.email);
          return { success: true, error: null };
        } catch (error) {
          console.error('[User Store] Password reset error:', error);
          const authError = error as AuthError;
          this.error = AUTH_ERROR_MESSAGES[authError.code] || AUTH_ERROR_MESSAGES.default;
          return { success: false, error: this.error };
        }
      });
    },

    // User Data Management Methods
    async getOrCreateUser(userId: string) {
      try {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          return { data: userDoc.data(), error: null };
        }
        
        // Default user structure
        const newUser = {
          id: userId,
          isPaid: false,
          attributes: {},
          personalityAnalysis: {},
          results: [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        await setDoc(userRef, newUser);
        return { data: newUser, error: null };
      } catch (error) {
        console.error('[User Store] Get/Create user error:', error);
        return { 
          data: null, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        };
      }
    },

    async updateUser(data: Record<string, any>) {
      if (!this.userId) {
        return { success: false, error: 'No user logged in' };
      }

      try {
        const userRef = doc(db, 'users', this.userId);
        const updateData = {
          ...data,
          updatedAt: serverTimestamp()
        };
        
        await updateDoc(userRef, updateData);
        
        // Update local state
        Object.assign(this, data);
        
        return { success: true, error: null };
      } catch (error) {
        console.error('[User Store] Update user error:', error);
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        };
      }
    },

    async checkPaidStatus() {
      if (!this.userId) {
        return false;
      }

      try {
        const userRef = doc(db, 'users', this.userId);
        const userDoc = await getDoc(userRef);
        return userDoc.exists() ? userDoc.data().isPaid : false;
      } catch (error) {
        console.error('[User Store] Check paid status error:', error);
        return false;
      }
    },

    // Personality Analysis Methods
    async updatePersonalityAnalysis(data: { results?: QuizResult[], personalityAnalysis?: Record<string, any> }) {
      if (!this.userId) {
        return { success: false, error: 'No user logged in' };
      }

      try {
        // If updating personality analysis sections, validate them
        if (data.personalityAnalysis) {
          const validSections = Object.keys(PERSONALITY_ANALYSIS_SECTIONS);
          const invalidSections = Object.keys(data.personalityAnalysis).filter(
            key => !validSections.includes(key)
          );

          if (invalidSections.length > 0) {
            throw new Error(`Invalid personality sections: ${invalidSections.join(', ')}`);
          }
        }

        const updateData = {
          ...data,
          updatedAt: serverTimestamp()
        };

        await this.updateUser(updateData);

        // Update local state
        if (data.personalityAnalysis) {
          this.personalityAnalysis = { ...this.personalityAnalysis, ...data.personalityAnalysis };
        }
        if (data.results) {
          this.results = data.results;
        }

        return { success: true, error: null };
      } catch (error) {
        console.error('[User Store] Update personality analysis error:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    },

    async submitQuizResult(result: QuizResult) {
      if (!this.userId) {
        return { success: false, error: 'No user logged in' };
      }

      try {
        const userRef = doc(db, 'users', this.userId);

        // Update both results and attributes atomically
        const batch = writeBatch(db);
        batch.update(userRef, {
          results: [...this.results, result],
          attributes: {
            ...this.userAttributes,
            [result.attribute]: result.score
          },
          updatedAt: serverTimestamp()
        });

        await batch.commit();

        // Update local state
        this.results = [...this.results, result];
        this.userAttributes = {
          ...this.userAttributes,
          [result.attribute]: result.score
        };

        return { success: true, error: null };
      } catch (error) {
        console.error('[User Store] Submit quiz result error:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }
  }
}); 