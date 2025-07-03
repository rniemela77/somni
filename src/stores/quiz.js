// @ts-nocheck
import { defineStore } from 'pinia';
import { useUserStore } from './user';
import { quizService } from '../services/firebase-quiz';

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    currentQuiz: null,
    quizResults: [],
    availableQuizzes: [],
    loading: false,
    error: null
  }),
  
  actions: {
    async loadQuizzes() {
      this.loading = true;
      this.error = null;
      
      try {
        const userStore = useUserStore();
        if (!userStore.isAuthenticated) {
          throw new Error('User must be authenticated to load quizzes');
        }

        const { quizzes, error } = await quizService.getAllQuizzes();
        if (error) {
          throw new Error(error);
        }

        this.availableQuizzes = quizzes;
        console.log('Quizzes loaded successfully:', this.availableQuizzes);
      } catch (error) {
        this.error = error instanceof Error ? error.message : String(error);
        console.error('Failed to load quizzes:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async selectQuiz(quizId) {
      this.loading = true;
      this.error = null;
      
      try {
        const { quiz, error } = await quizService.getQuizById(quizId);
        if (error) {
          throw new Error(error);
        }
        
        if (!quiz) {
          throw new Error(`Quiz with ID ${quizId} not found`);
        }
        
        this.currentQuiz = quiz;
        return { error: null };
      } catch (error) {
        this.error = error instanceof Error ? error.message : String(error);
        console.error('Failed to select quiz:', error);
        return { error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async submitQuiz(answers) {
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
        const results = {
          quizId: this.currentQuiz.id,
          attribute: this.currentQuiz.id,
          timestamp: new Date().toISOString(),
          answers,
          score: score * 100 // Convert from -1..1 to -100..100 scale
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
        console.error('Failed to submit quiz:', error);
        return { resultId: null, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    calculateScore(answers) {
      if (!this.currentQuiz || !this.currentQuiz.questions) {
        return 0;
      }

      return this.currentQuiz.questions.reduce((total, question) => {
        const answer = parseFloat(answers[question.id]) || 0;
        // Normalize answer from -100 to 100 scale to -1 to 1 scale
        const normalizedAnswer = answer / 100;
        // Multiply by the question's point value
        return total + (normalizedAnswer * question.points);
      }, 0);
    },

    async loadUserResults() {
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
        console.error('Failed to load user results:', error);
      } finally {
        this.loading = false;
      }
    }
  }
}); 