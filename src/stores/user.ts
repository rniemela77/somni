import { defineStore } from "pinia";
import type { User as FirebaseUser, Unsubscribe } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { UserData } from "../../shared/types/shared";
import { REVELATION_MILESTONES } from "../../shared/config/personalityAnalysis";
import { PERSONALITY_ANALYSIS_SECTIONS } from "../../shared/config/personalityAnalysis";
import {
  subscribeToAuth,
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle as serviceSignInWithGoogle,
  signOutUser,
  sendPasswordReset,
  mapFirebaseUser,
} from "../services/auth-service";


interface UserState {
  firebaseUser: FirebaseUser | null;
  user: UserData | null;
  email: string;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  generatingPersonalityAnalysis: boolean;
}

let unsubscribeAuth: Unsubscribe | null = null;

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    firebaseUser: null,
    user: null,
    email: "",
    loading: true,
    error: null,
    initialized: false,

    generatingPersonalityAnalysis: false,
  }),

  getters: {
    isAuthenticated: (state): boolean => Boolean(state.firebaseUser),
    isReady: (state): boolean => state.initialized && !state.loading,
    isLoading: (state): boolean => state.loading,
  },

  actions: {
    async submitAssessment(assessmentId: string, assessmentScore: number): Promise<void> {
      console.log('submitAssessment', assessmentId, assessmentScore);
      if (!this.user) {
        console.error("User personality profile data not found");
        return;
      }
      if (!this.firebaseUser) {
        console.error("User not found");
        return;
      }
      if (this.firebaseUser.uid === undefined) {
        console.error("User uid not found");
        return;
      }

      // Ensure assessmentScores object exists
      if (!this.user.assessmentScores) {
        this.user.assessmentScores = {} as any;
      }

      // update the user attributes in the store
      this.user.assessmentScores[assessmentId] = assessmentScore;

      // update the user attributes in the database
      await updateDoc(doc(db, "users", this.firebaseUser.uid), {
        assessmentScores: this.user.assessmentScores
      });

      // Check if we should trigger any revelations
      this.checkAndTriggerRevelations();
      
      // Check if we should generate a personality role
      this.checkAndGeneratePersonalityRole();
    },

    checkAndTriggerRevelations() {
      if (!this.user) return;

      const completedAssessments = Object.keys(this.user.assessmentScores).length;
      
      // Check for revelation milestones using shared configuration
      for (const milestone of REVELATION_MILESTONES) {
        if (completedAssessments === milestone.requiredAssessments && 
            !this.user?.personalityAnalysis?.[milestone.key] &&
            !this.generatingPersonalityAnalysis) {
          console.log(`Triggering ${milestone.key} revelation`);
          // Generate only this specific section
          this.generatePersonalityAnalysisForCluster(milestone.key);
          break; // Only trigger one revelation at a time
        }
      }
    },

    checkAndGeneratePersonalityRole() {
      // This function is now deprecated - personality roles are handled through personality analysis sections
      return;
    },

    async generatePersonalityAnalysisForCluster(cluster: string): Promise<{ success: boolean; error: string | null }> {
      this.error = null;
      this.generatingPersonalityAnalysis = true;
      console.log('generating personality analysis for cluster', cluster);

      try {
        // Get the current user's ID token for authentication
        if (!this.firebaseUser) {
          throw new Error('User not authenticated');
        }
        
        const idToken = await this.firebaseUser.getIdToken();
        
        const result = await fetch('/.netlify/functions/generate-personality-analysis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
          },
          // If the provided value matches a section id, send sectionId; otherwise treat it as a category cluster
          body: JSON.stringify(PERSONALITY_ANALYSIS_SECTIONS.find(s => s.id === cluster) ? { sectionId: cluster } : { cluster }),
        });
        
        if (!result.ok) {
          const errorData = await result.json();
          throw new Error(errorData.error || `HTTP ${result.status}`);
        }
        
        const data = await result.json();
        
        // Update the personality profile with the new analysis
        if (this.user && data.personalityAnalysis) {
          this.user.personalityAnalysis = {
            ...this.user.personalityAnalysis,
            ...data.personalityAnalysis
          };
          
          // Update the database
          if (this.firebaseUser?.uid) {
            await updateDoc(doc(db, "users", this.firebaseUser.uid), {
              personalityAnalysis: this.user.personalityAnalysis,
              updatedAt: serverTimestamp()
            });
          }
        }
        
        return { success: true, error: null };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        this.error = message;
        return { success: false, error: message };
      } finally {
        this.generatingPersonalityAnalysis = false;
      }
    },

    getIdToken(): Promise<string> {
      if (!this.firebaseUser) {
        throw new Error('User not authenticated');
      }
      return this.firebaseUser.getIdToken();
    },

    cleanupAuthListener(): void {
      unsubscribeAuth?.();
      unsubscribeAuth = null;
    },

    resetStore(): void {
      this.$reset();
      this.loading = false;
      this.initialized = false;
      this.firebaseUser = null;
      this.user = null;
      this.error = null;
      this.cleanupAuthListener();
    },

    async init(): Promise<void> {
      if (unsubscribeAuth) {
        this.initialized = true;
        this.loading = false;
        return;
      }

      this.loading = true;
      this.error = null;

      unsubscribeAuth = subscribeToAuth(async (firebaseUser) => {
        try {
          if (firebaseUser) {
            await this.setFirebaseUser(firebaseUser);
          } else {
            this.firebaseUser = null;
            this.user = null;
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : "Unknown error";
          this.error = message;
        } finally {
          this.initialized = true;
          this.loading = false;
        }
      });
    },

    async signIn(password: string): Promise<{ success: boolean; error: string | null }> {
      this.error = null;
      this.loading = true;
      try {
        const result = await signInWithEmail(this.email, password);
        if (result.ok) {
          await this.setFirebaseUser(result.data);
          return { success: true, error: null };
        }
        this.error = result.message;
        return { success: false, error: result.message };
      } finally {
        this.loading = false;
      }
    },

    async signInWithGoogle(): Promise<{ success: boolean; error: string | null }> {
      this.error = null;
      this.loading = true;
      try {
        const result = await serviceSignInWithGoogle();
        if (result.ok) {
          await this.setFirebaseUser(result.data);
          return { success: true, error: null };
        }
        this.error = result.message;
        return { success: false, error: result.message };
      } finally {
        this.loading = false;
      }
    },

    async signUp(password: string): Promise<{ success: boolean; error: string | null }> {
      this.error = null;
      this.loading = true;
      try {
        const result = await signUpWithEmail(this.email, password);
        if (result.ok) {
          await this.setFirebaseUser(result.data);
          return { success: true, error: null };
        }
        this.error = result.message;
        return { success: false, error: result.message };
      } finally {
        this.loading = false;
      }
    },

    async signOut(): Promise<{ success: boolean; error: string | null }> {
      this.error = null;
      this.loading = true;
      try {
        const result = await signOutUser();
        if (result.ok) {
          await this.setFirebaseUser(null);
          return { success: true, error: null };
        }
        this.error = result.message;
        return { success: false, error: result.message };
      } finally {
        this.loading = false;
      }
    },

    async resetPassword(email?: string): Promise<{ success: boolean; error: string | null }> {
      this.error = null;
      this.loading = true;
      try {
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        const result = await sendPasswordReset(email || this.email, `${origin}/signin`);
        if (result.ok) {
          return { success: true, error: null };
        }
        this.error = result.message;
        return { success: false, error: result.message };
      } finally {
        this.loading = false;
      }
    },

    async setFirebaseUser(firebaseUser: FirebaseUser | null): Promise<void> {
      this.error = null;
      if (!firebaseUser) {
        this.firebaseUser = null;
        this.user = null;
        return;
      }

      this.firebaseUser = firebaseUser;
      await this.loadUserData(firebaseUser);
    },

    async loadUserData(firebaseUser: FirebaseUser): Promise<void> {
      console.log("loading user data");
      const userRef = doc(db, "users", firebaseUser.uid);
      const userDoc = await getDoc(userRef);

      const publicUser = mapFirebaseUser(firebaseUser);

      if (userDoc.exists()) {
        const data = userDoc.data() as Omit<UserData, "user">;
        // Ensure defaults for possibly missing fields in legacy docs
        this.user = {
          ...(data as any),
          assessmentScores: (data as any).assessmentScores || {},
          personalityAnalysis: (data as any).personalityAnalysis || {},
          mythicMirror: (data as any).mythicMirror || [],
        } as UserData;

        return;
      }

      const defaultProfile: Omit<UserData, "user"> = {
        id: firebaseUser.uid,
        payments: [],
        assessmentScores: {},
        personalityAnalysis: {},
        mythicMirror: [],
        openaiApiCalls: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(userRef, defaultProfile, { merge: true });
      this.user = { ...(defaultProfile as any), user: publicUser } as UserData;
    },


    async generateMythicMirrorAnalysis(challenge: string): Promise<{ success: boolean; error: string | null; response?: { title: string; details: string } }> {
      this.error = null;
      this.generatingPersonalityAnalysis = true;
      console.log('generating mythic mirror analysis for challenge:', challenge.substring(0, 50) + '...');

      try {
        // Get the current user's ID token for authentication
        if (!this.firebaseUser) {
          throw new Error('User not authenticated');
        }
        
        const idToken = await this.firebaseUser.getIdToken();
        
        const result = await fetch('/.netlify/functions/generate-mythic-mirror', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
          },
          body: JSON.stringify({ challenge }),
        });
        
        if (!result.ok) {
          const errorData = await result.json();
          throw new Error(errorData.error || `HTTP ${result.status}`);
        }
        
        const data = await result.json();
        
        // Update the user data with the new mythic mirror entry
        if (this.user && data.response) {
          // The backend already updated the user document, so we need to refresh our local data
          await this.loadUserData(this.firebaseUser);
        }
        
        return { success: true, error: null, response: data.response };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        this.error = message;
        return { success: false, error: message };
      } finally {
        this.generatingPersonalityAnalysis = false;
      }
    },
  },
});
