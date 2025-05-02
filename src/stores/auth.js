import { defineStore } from 'pinia';
import { authService } from '../services/firebase-auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: true,
    error: null,
    authInitialized: false, // Track if auth has been initialized
    unsubscribeAuth: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userId: (state) => state.user?.uid,
    userEmail: (state) => state.user?.email,
  },

  actions: {
    // Initialize the auth state listener
    initAuthListener() {
      // Only set up the listener once
      if (this.authInitialized) return;
      
      console.log('Initializing auth state listener in auth store');
      
      // Use the authService for the listener
      this.unsubscribeAuth = authService.onAuthStateChanged((user) => {
        console.log('Auth state changed:', user ? 'authenticated' : 'not authenticated');
        this.setUser(user);
      });
      
      this.authInitialized = true;
    },
    
    // Clean up auth listener when no longer needed
    cleanupAuthListener() {
      if (this.unsubscribeAuth) {
        this.unsubscribeAuth();
        this.unsubscribeAuth = null;
      }
    },
    
    setUser(user) {
      this.user = user;
      this.loading = false;
      this.error = null;
    },

    // Get the current user synchronously
    getCurrentUser() {
      return authService.getCurrentUser();
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
    
    async resetPassword(email) {
      this.loading = true;
      this.error = null;
      
      const { success, error } = await authService.resetPassword(email);
      
      if (error) {
        this.error = error;
      }
      
      this.loading = false;
      return { success, error };
    },

    clearError() {
      this.error = null;
    },
  },
}); 