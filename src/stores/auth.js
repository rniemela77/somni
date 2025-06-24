import { defineStore } from 'pinia';
import { authService } from '../services/firebase-auth';
import { UserService } from '../services/user.service';

const userService = new UserService();

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: true,
    error: null,
    userAttributes: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userId: (state) => state.user?.uid,
    userEmail: (state) => state.user?.email
  },

  actions: {
    async setUser(user) {
      console.log('[Auth] Setting user:', user ? 'exists' : 'null');
      this.user = user;
      if (user) {
        const { data, error } = await userService.getUser(user.uid);
        if (!error && data) {
          this.userAttributes = data.attributes;
          console.log('[Auth] User attributes loaded:', this.userAttributes);
        } else if (error) {
          console.error('[Auth] Failed to load user attributes:', error);
        }
      } else {
        this.userAttributes = null;
        console.log('[Auth] User attributes cleared');
      }
    },

    async init() {
      console.log('[Auth] Initializing auth store...');
      this.loading = true;
      try {
        // Check if there's a current user
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          console.log('[Auth] Found existing user');
          await this.setUser(currentUser);
        } else {
          console.log('[Auth] No existing user found');
        }

        // Set up auth state listener
        console.log('[Auth] Setting up auth state listener');
        authService.onAuthStateChanged(async (user) => {
          console.log('[Auth] Auth state changed:', user ? 'logged in' : 'logged out');
          await this.setUser(user);
          this.loading = false;
        });
      } catch (error) {
        console.error('[Auth] Auth store initialization error:', error);
        this.error = error.message;
        this.loading = false;
      }
    },

    async signIn(email, password) {
      this.loading = true;
      this.error = null;
      try {
        const { user, error } = await authService.signIn(email, password);
        if (error) {
          this.error = error;
          return false;
        }
        await this.setUser(user);
        return true;
      } catch (error) {
        console.error('Sign in error:', error);
        this.error = error.message;
        return false;
      } finally {
        this.loading = false;
      }
    },

    async signUp(email, password) {
      this.loading = true;
      this.error = null;
      try {
        const { user, error } = await authService.signUp(email, password);
        if (error) {
          this.error = error;
          return false;
        }
        await this.setUser(user);
        return true;
      } catch (error) {
        console.error('Sign up error:', error);
        this.error = error.message;
        return false;
      } finally {
        this.loading = false;
      }
    },

    async signOut() {
      this.loading = true;
      this.error = null;
      try {
        const { error } = await authService.logout();
        if (error) {
          this.error = error;
          return false;
        }
        await this.setUser(null);
        return true;
      } catch (error) {
        console.error('Sign out error:', error);
        this.error = error.message;
        return false;
      } finally {
        this.loading = false;
      }
    },

    async resetPassword(email) {
      this.loading = true;
      this.error = null;
      try {
        const { success, error } = await authService.resetPassword(email);
        if (error) {
          this.error = error;
          return false;
        }
        return success;
      } catch (error) {
        console.error('Password reset error:', error);
        this.error = error.message;
        return false;
      } finally {
        this.loading = false;
      }
    },

    setUserAttributes(attributes) {
      this.userAttributes = attributes;
    }
  }
}); 