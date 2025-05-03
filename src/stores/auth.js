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
    isAuthReady: (state) => !state.loading && state.authInitialized,
  },

  actions: {
    // Initialize the auth state listener
    initAuthListener() {
      // Only set up the listener once
      if (this.authInitialized) return;
      
      console.log('Initializing auth state listener in auth store');
      
      // Ensure loading state is true until auth state is determined
      this.loading = true;
      
      // Use the authService for the listener
      this.unsubscribeAuth = authService.onAuthStateChanged((user) => {
        console.log('Auth state changed:', user ? 'authenticated' : 'not authenticated');
        this.setUser(user);
        
        // Auth is now initialized
        this.authInitialized = true;
      });
      
      // Set a timeout to prevent indefinite loading if Firebase is slow
      setTimeout(() => {
        if (this.loading) {
          console.log('Auth state determination timed out, setting as not authenticated');
          this.setUser(null);
          this.authInitialized = true;
        }
      }, 5000); // 5 second timeout
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
      console.log('Auth state set, loading:', this.loading, 'authenticated:', !!user);
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

    async signInWithGoogle() {
      this.loading = true;
      this.error = null;
      
      const { user, error } = await authService.signInWithGoogle();
      
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