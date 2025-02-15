import { defineStore } from 'pinia';
import { authService } from '../services/firebase';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: true,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userId: (state) => state.user?.uid,
  },

  actions: {
    setUser(user) {
      this.user = user;
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
    },
  },
}); 