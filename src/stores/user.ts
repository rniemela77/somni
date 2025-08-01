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
import { API_LIMITS } from '../config/limits';
import { useQuizStore } from './quiz';
import { PersonalityAnalysis } from '../types/personality';

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
  personalityAnalysis: PersonalityAnalysis;
  results: QuizResult[];
  openaiApiCalls: number;
  
  // UI state
  loading: boolean;
  error: string;
  isProcessing: boolean;
  initialized: boolean;
  lastUserDataFetch: string | null;
  
  // Auth listener cleanup
  authUnsubscribe: (() => void) | null;
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
    openaiApiCalls: 0,
    
    // UI state
    loading: true,
    error: '',
    isProcessing: false,
    initialized: false,
    lastUserDataFetch: null,
    
    // Auth listener cleanup
    authUnsubscribe: null,
  }),

  getters: {
    userId: (state) => state.user?.uid || null,
    isAuthenticated: (state) => !!state.user,
    isReady: (state) => state.initialized,
    isLoading: (state) => state.loading || state.isProcessing,
    isGeneratingAnalysis: (state) => state.isProcessing,

    // Quiz progress getters
    completedQuizzesCount: (state) => {
      return Object.keys(state.userAttributes || {}).length;
    },

    noQuizzesCompleted: (state) => {
      const attributes = state.userAttributes || {};
      return Object.keys(attributes).length === 0;
    },

    totalQuizzesCount: () => {
      const quizStore = useQuizStore();
      return quizStore.availableQuizzes.length;
    },

    hasIncompleteQuizzes() {
      return this.completedQuizzesCount < this.totalQuizzesCount;
    },

    // OpenAI API calls remaining
    openaiApiCallsRemaining: (state) => {
      return state.isPaid ? API_LIMITS.PAID_OPENAI_CALLS_LIMIT - state.openaiApiCalls : API_LIMITS.FREE_OPENAI_CALLS_LIMIT - state.openaiApiCalls;
    }
  },

  actions: {
    // Auth State Management
    async setUser(firebaseUser: FirebaseUser | null) {
      this.error = '';
      
      try {
        if (!firebaseUser) {
          this.user = null;
          this.userAttributes = {};
          this.openaiApiCalls = 0;
          this.lastUserDataFetch = null;
          return;
        }

        this.user = firebaseUser;
        await this.loadUserData(firebaseUser);
        await this.loadQuizData();
        
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error';
      }
    },

    // Load user data from Firestore
    async loadUserData(firebaseUser: FirebaseUser) {
      const shouldFetchData = !this.lastUserDataFetch || 
        this.lastUserDataFetch !== firebaseUser.uid ||
        this.isDataStale();

      if (shouldFetchData) {
        this.loading = true;
        const { data, error } = await this.getOrCreateUser(firebaseUser.uid);
        
        if (error) {
          this.error = error;
          return;
        }

        if (data) {
          this.userAttributes = data.attributes || {};
          this.isPaid = data.isPaid;
          this.personalityAnalysis = data.personalityAnalysis || {};
          this.results = data.results || [];
          this.openaiApiCalls = data.openaiApiCalls || 0;
          this.lastUserDataFetch = firebaseUser.uid;
        }
      }
    },

    // Load quiz data for authenticated users
    async loadQuizData() {
      if (!this.user) return;

      try {
        const { useQuizStore } = await import('./quiz');
        const quizStore = useQuizStore();
        if (!quizStore.dataLoaded) {
          await quizStore.loadQuizzes();
        }
      } catch (error) {
        // Quiz loading failure is not critical
      }
    },

    // Initialize auth state listener
    async init() {
      if (this.initialized) return;

      this.loading = true;
      try {
        await new Promise<void>((resolve) => {
          const unsubscribe = onAuthStateChanged(auth, async (user) => {
            this.authUnsubscribe = unsubscribe;
            await this.setUser(user);
            resolve();
          });
        });

        this.initialized = true;
      } catch (error) {
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
          openaiApiCalls: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        await setDoc(userRef, newUser);
        return { data: newUser, error: null };
      } catch (error) {
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
        return false;
      }
    },

    // Personality Analysis Methods
    async generatePersonalityAnalysis() {
      if (!this.userId) {
        return { success: false, error: 'No user logged in' };
      }

      // Check if user has remaining free API calls
      if (this.openaiApiCallsRemaining <= 0) {
        const limit = this.isPaid ? API_LIMITS.PAID_OPENAI_CALLS_LIMIT : API_LIMITS.FREE_OPENAI_CALLS_LIMIT;
        return { 
          success: false, 
          error: `You have reached your AI analysis limit (${limit} requests). Please contact support for additional access.` 
        };
      }

      this.isProcessing = true;
      
      try {
        // Get the current user's auth token
        const currentUser = this.user;
        if (!currentUser) {
          throw new Error('Authentication required. Please log in again.');
        }

        const idToken = await currentUser.getIdToken();

        // Call the backend function
        const response = await fetch('/.netlify/functions/generate-personality-analysis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP ${response.status}: Failed to generate analysis`);
        }

        const data = await response.json();
        
        // Update local state with the new analysis
        this.personalityAnalysis = { ...this.personalityAnalysis, ...data.personalityAnalysis };

        // Increment OpenAI API calls counter
        this.openaiApiCalls += 1;
        
        // Update the counter in Firebase
        await this.updateUser({
          openaiApiCalls: this.openaiApiCalls
        });

        return { 
          success: true, 
          error: null,
          data: data.personalityAnalysis
        };

      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      } finally {
        this.isProcessing = false;
      }
    },

    async updatePersonalityAnalysis(data: { results?: QuizResult[], personalityAnalysis?: PersonalityAnalysis }) {
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
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    },

    // Check if cached data is stale (e.g., older than 5 minutes)
    isDataStale(): boolean {
      // For now, consider data fresh for the session
      // Could implement timestamp-based staleness checking
      return false;
    },

    // Cleanup method: removes the Firebase auth listener to prevent memory leaks or duplicate listeners
    cleanup() {
      if (this.authUnsubscribe) {
        this.authUnsubscribe();
        this.authUnsubscribe = null;
      }
    }
  }
}); 