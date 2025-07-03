import { defineStore } from 'pinia';
import { authService } from '../services/firebase-auth';
import { UserService, User } from '../services/user.service';
import { User as FirebaseUser } from 'firebase/auth';

const userService = new UserService();

interface AuthState {
  user: FirebaseUser | null;
  userAttributes: Record<string, number> | null;
  loading: boolean;
  error: string | null;
}

interface AuthResponse {
  success: boolean;
  error: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    userAttributes: null,
    loading: true,
    error: null
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.user,
    userId: (state): string | undefined => state.user?.uid,
    userEmail: (state): string | undefined => state.user?.email
  },

  actions: {
    async setUser(firebaseUser: FirebaseUser | null): Promise<void> {
      this.loading = true;
      this.error = null;
      
      try {
        if (!firebaseUser) {
          this.user = null;
          this.userAttributes = null;
          return;
        }

        this.user = firebaseUser;
        
        // Get or create user document in one call
        const { data, error } = await userService.getOrCreateUser(firebaseUser.uid);
        
        if (error) {
          this.error = error;
          return;
        }

        this.userAttributes = data?.attributes || {};
        
      } catch (error) {
        console.error('[Auth Store] Error setting user:', error);
        this.error = error instanceof Error ? error.message : 'Unknown error';
      } finally {
        this.loading = false;
      }
    },

    async init(): Promise<void> {
      this.loading = true;
      try {
        // Check if there's a current user
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          await this.setUser(currentUser);
        } else {
          this.user = null;
          this.userAttributes = null;
        }

        // Set up auth state listener
        authService.onAuthStateChanged(async (user) => {
          console.log('[Auth] Auth state changed:', user ? 'logged in' : 'logged out');
          await this.setUser(user);
        });
      } catch (error) {
        console.error('[Auth] Auth store initialization error:', error);
        this.error = error instanceof Error ? error.message : 'Unknown error';
      } finally {
        this.loading = false;
      }
    },

    async signIn(email: string, password: string): Promise<boolean> {
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
        this.error = error instanceof Error ? error.message : 'Unknown error';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async signInWithGoogle(): Promise<boolean> {
      this.loading = true;
      this.error = null;
      try {
        const { user, error } = await authService.signInWithGoogle();
        if (error) {
          this.error = error;
          return false;
        }
        await this.setUser(user);
        return true;
      } catch (error) {
        console.error('Google sign in error:', error);
        this.error = error instanceof Error ? error.message : 'Unknown error';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async signUp(email: string, password: string): Promise<boolean> {
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
        this.error = error instanceof Error ? error.message : 'Unknown error';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async signOut(): Promise<boolean> {
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
        this.error = error instanceof Error ? error.message : 'Unknown error';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async resetPassword(email: string): Promise<boolean> {
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
        this.error = error instanceof Error ? error.message : 'Unknown error';
        return false;
      } finally {
        this.loading = false;
      }
    },

    setUserAttributes(attributes: Record<string, number>): void {
      this.userAttributes = attributes;
    }
  }
}); 