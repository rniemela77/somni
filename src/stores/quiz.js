import { defineStore } from 'pinia';
import { quizService, resultsService } from '../services/firebase';
import { useAuthStore } from './auth';

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    quizzes: [],
    selectedQuiz: null,
    userResults: [],
    loading: false,
    error: null,
  }),

  getters: {
    availableQuizzes: (state) => state.quizzes,
    currentQuiz: (state) => state.selectedQuiz,
    filteredResults: (state) => (quizId) => {
      if (!quizId) return state.userResults;
      return state.userResults.filter(result => result.quizId === quizId);
    },
  },

  actions: {
    async loadQuizzes() {
      this.loading = true;
      this.error = null;

      const { quizzes, error } = await quizService.getAllQuizzes();
      
      if (error) {
        this.error = error;
      } else {
        this.quizzes = quizzes;
      }

      this.loading = false;
      return { error };
    },

    async selectQuiz(quizId) {
      this.loading = true;
      this.error = null;

      const { quiz, error } = await quizService.getQuizById(quizId);
      
      if (error) {
        this.error = error;
      } else {
        this.selectedQuiz = quiz;
      }

      this.loading = false;
      return { error };
    },

    async submitQuiz(answers) {
      this.loading = true;
      this.error = null;

      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        this.error = "You must be logged in to submit the quiz.";
        this.loading = false;
        return { error: this.error };
      }

      const { resultId, error } = await resultsService.submitQuizResult(
        authStore.userId,
        this.selectedQuiz.id,
        answers
      );

      if (error) {
        this.error = error;
      }

      this.loading = false;
      return { resultId, error };
    },

    async loadUserResults() {
      this.loading = true;
      this.error = null;

      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        this.error = "You must be logged in to view results.";
        this.loading = false;
        return { error: this.error };
      }

      const { results, error } = await resultsService.getUserResults(authStore.userId);
      
      if (error) {
        this.error = error;
      } else {
        this.userResults = results;
      }

      this.loading = false;
      return { error };
    },

    clearSelectedQuiz() {
      this.selectedQuiz = null;
      this.error = null;
    },

    clearError() {
      this.error = null;
    },
  },
}); 