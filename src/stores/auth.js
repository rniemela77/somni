import { defineStore } from 'pinia';
import { authService } from '../services/firebase';
import { auth } from '../services/firebase-config';  // Import auth directly

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: true,
    error: null,
    authInitialized: false, // Track if auth has been initialized
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userId: (state) => state.user?.uid,
  },

  actions: {
    // Initialize the auth state listener
    initAuthListener() {
      // Only set up the listener once
      if (this.authInitialized) return;
      
      console.log('Initializing auth state listener in auth store');
      
      auth.onAuthStateChanged((user) => {
        console.log('Auth state changed:', user ? 'authenticated' : 'not authenticated');
        this.setUser(user);
      });
      
      this.authInitialized = true;
    },
    
    setUser(user) {
      this.user = user;
      this.loading = false;
      this.error = null;
    },

    // Get the current user synchronously
    getCurrentUser() {
      return auth.currentUser;
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
    },
  },
}); 