import { defineStore } from 'pinia';
import { useUserStore } from './user';
import { quizService } from '../services/firebase-quiz';
import type { Quiz } from '../services/firebase-quiz';
import type { QuizResult } from './user';
import { isDataStale, STALENESS_CONFIGS } from '../utils/dataUtils';

interface Question {
  id: string;
  points: number;
  text: string;
}

interface State {
  currentQuiz: Quiz | null;
  quizResults: QuizResult[];
  availableQuizzes: Quiz[];
  loading: boolean;
  error: string | null;
  // Cache management
  dataLoaded: boolean;
  lastFetch: number | null;
}

export const useQuizStore = defineStore('quiz', {
  state: (): State => ({
    currentQuiz: null,
    quizResults: [],
    availableQuizzes: [],
    loading: false,
    error: null,
    // Cache management
    dataLoaded: false,
    lastFetch: null,
  }),
  
  actions: {
    async loadQuizzes(): Promise<void> {
      // Check if we already have fresh data
      if (this.dataLoaded && this.availableQuizzes.length > 0 && !this.isDataStale()) {
        return;
      }

      this.loading = true;
      this.error = null;
      
      try {
        const userStore = useUserStore();
        if (!userStore.isAuthenticated) {
          throw new Error('User must be authenticated to load quizzes');
        }

        const response = await quizService.getAllQuizzes();

        if (response.error) {
          throw new Error(response.error);
        }

        this.availableQuizzes = response.quizzes || [];
        this.dataLoaded = true;
        this.lastFetch = Date.now();
      } catch (error) {
        this.error = error instanceof Error ? error.message : String(error);
        this.dataLoaded = false;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Check if cached data is stale (older than 5 minutes)
    isDataStale(): boolean {
      return isDataStale({
        maxAgeMs: STALENESS_CONFIGS.QUIZ_DATA.maxAgeMs,
        lastFetch: this.lastFetch
      });
    },

    async selectQuiz(quizId: string): Promise<{ error: string | null }> {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await quizService.getQuizById(quizId);
        if (response.error) {
          throw new Error(response.error);
        }
        
        if (!response.quiz) {
          throw new Error(`Quiz with ID ${quizId} not found`);
        }
        
        this.currentQuiz = response.quiz;
        return { error: null };
      } catch (error) {
        this.error = error instanceof Error ? error.message : String(error);
        return { error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async submitQuiz(answers: Record<string, string>): Promise<{ resultId: string | null; error: string | null }> {
      this.loading = true;
      this.error = null;
      
      try {
        const userStore = useUserStore();
        if (!userStore.isAuthenticated) {
          throw new Error('User must be authenticated to submit quiz');
        }

        if (!this.currentQuiz) {
          throw new Error('No quiz is currently selected');
        }

        // Calculate quiz results
        const score = this.calculateScore(answers);
        const results: QuizResult = {
          quizId: this.currentQuiz.id,
          attribute: this.currentQuiz.id,
          timestamp: new Date().toISOString(),
          answers,
          score: Math.round(score * 100) // Convert from -1..1 to -100..100 scale and round
        };

        // Submit quiz results using the user store
        const { success, error } = await userStore.submitQuizResult(results);

        if (!success) {
          throw new Error(error || 'Failed to submit quiz');
        }

        // Update local quiz results
        this.quizResults.push(results);
        
        return { resultId: results.timestamp, error: null };
      } catch (error) {
        this.error = error instanceof Error ? error.message : String(error);
        return { resultId: null, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    calculateScore(answers: Record<string, string>): number {
      if (!this.currentQuiz || !this.currentQuiz.questions) {
        return 0;
      }

      return this.currentQuiz.questions.reduce((total: number, question: Question) => {
        const answer = parseFloat(answers[question.id]) || 0;
        // Normalize answer from -100 to 100 scale to -1 to 1 scale
        const normalizedAnswer = answer / 100;
        // Multiply by the question's point value
        return total + (normalizedAnswer * question.points);
      }, 0);
    },

    async loadUserResults(): Promise<void> {
      this.loading = true;
      this.error = null;
      
      try {
        const userStore = useUserStore();
        if (!userStore.isAuthenticated) {
          throw new Error('User must be authenticated to load results');
        }

        // Get results directly from user store
        this.quizResults = userStore.results || [];
      } catch (error) {
        this.error = error instanceof Error ? error.message : String(error);
      } finally {
        this.loading = false;
      }
    }
  }
}); 