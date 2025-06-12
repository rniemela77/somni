import { defineStore } from 'pinia';
import { UserService } from '../services/user.service';
import { PersonalityService } from '../services/personality.service';
import { useAuthStore } from './auth';
import quizzes from '../data/quizData';

const userService = new UserService();
const personalityService = new PersonalityService();

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
        const authStore = useAuthStore();
        if (!authStore.isAuthenticated) {
          throw new Error('User must be authenticated to load quizzes');
        }

        console.log('Loading quizzes:', quizzes);
        this.availableQuizzes = quizzes;
        console.log('Quizzes loaded successfully:', this.availableQuizzes);
      } catch (err) {
        this.error = err.message;
        console.error('Failed to load quizzes:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async selectQuiz(quizId) {
      this.loading = true;
      this.error = null;
      
      try {
        const quiz = this.availableQuizzes.find(q => q.id === quizId);
        if (!quiz) {
          throw new Error(`Quiz with ID ${quizId} not found`);
        }
        
        this.currentQuiz = quiz;
        return { error: null };
      } catch (err) {
        this.error = err.message;
        console.error('Failed to select quiz:', err);
        return { error: err.message };
      } finally {
        this.loading = false;
      }
    },

    async submitQuiz(answers) {
      this.loading = true;
      this.error = null;
      
      try {
        const authStore = useAuthStore();
        if (!authStore.isAuthenticated) {
          throw new Error('User must be authenticated to submit quiz');
        }

        if (!this.currentQuiz) {
          throw new Error('No quiz is currently selected');
        }

        // Calculate quiz results
        const score = this.calculateScore(answers);
        const results = {
          quizId: this.currentQuiz.id,
          attribute: this.currentQuiz.attribute,
          timestamp: new Date().toISOString(),
          answers,
          score: score * 100 // Convert from -1..1 to -100..100 scale
        };

        // Submit quiz results to personality service
        const { error } = await personalityService.submitQuizResult(authStore.userId, results);

        if (error) {
          throw new Error(error);
        }

        // Update local quiz results
        this.quizResults.push(results);
        
        return { resultId: results.timestamp, error: null };
      } catch (err) {
        this.error = err.message;
        console.error('Failed to submit quiz:', err);
        return { resultId: null, error: err.message };
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
        const authStore = useAuthStore();
        if (!authStore.isAuthenticated) {
          throw new Error('User must be authenticated to load results');
        }

        const { data, error } = await personalityService.getUserPersonality(authStore.userId);
        if (error) {
          throw new Error(error);
        }

        this.quizResults = data.results || [];
      } catch (err) {
        this.error = err.message;
        console.error('Failed to load user results:', err);
      } finally {
        this.loading = false;
      }
    }
  }
}); 