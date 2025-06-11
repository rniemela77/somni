import { defineStore } from 'pinia';
import { authService } from '../services/firebase-auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,  // Will now contain both auth and Firestore data
    loading: true,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userId: (state) => state.user?.uid,
    userEmail: (state) => state.user?.email,
    // New getter for quiz attributes
    attributes: (state) => state.user?.attributes || null
  },

  actions: {
    async setUser(firebaseUser) {
      // Start with the Firebase auth user
      this.user = firebaseUser ? { ...firebaseUser } : null;
      
      if (firebaseUser) {
        try {
          const db = getFirestore();
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            // Merge Firestore data into user object
            const firestoreData = userDoc.data();
            this.user = {
              ...this.user,  // Keep auth data
              attributes: firestoreData.attributes || null,
              tags: firestoreData.tags || [],
              personalityAnalysis: firestoreData.personalityAnalysis || null,
              isPaid: firestoreData.isPaid || false,
              createdAt: firestoreData.createdAt,
              updatedAt: firestoreData.updatedAt
            };
          }
        } catch (error) {
          console.error('[Auth Store] Error fetching user data:', error);
        }
      }

      this.loading = false;
      this.error = null;
    },

    async signIn(email, password) {
      this.loading = true;
      this.error = null;
      
      const { user, error } = await authService.signIn(email, password);
      
      if (error) {
        this.error = error;
      }
      
      this.loading = false;
      return { user, error };
    },

    async signUp(email, password) {
      this.loading = true;
      this.error = null;
      
      const { user, error } = await authService.signUp(email, password);
      
      if (error) {
        this.error = error;
      }
      
      this.loading = false;
      return { user, error };
    },

    async logout() {
      this.loading = true;
      this.error = null;
      
      const { error } = await authService.logout();
      
      if (error) {
        this.error = error;
      } else {
        this.user = null;
      }
      
      this.loading = false;
      return { error };
    },

    clearError() {
      this.error = null;
    }
  }
}); 