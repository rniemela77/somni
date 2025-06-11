import { defineStore } from 'pinia';
import { authService } from '../services/firebase-auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    userAttributes: null,
    loading: true,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userId: (state) => state.user?.uid,
    userEmail: (state) => state.user?.email
  },

  actions: {
    async setUser(user) {
      this.user = user;
      this.userAttributes = null;

      if (user) {
        try {
          const db = getFirestore();
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            this.userAttributes = userData.attributes || null;
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
        this.userAttributes = null;
      }
      
      this.loading = false;
      return { error };
    },

    clearError() {
      this.error = null;
    }
  }
}); 