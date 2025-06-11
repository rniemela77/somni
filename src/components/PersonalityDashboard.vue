<template>
  <div>
    <div class="alert alert-info" v-if="dashboardLoading">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3">Loading your Personality Dashboard...</p>
    </div>

    <div v-else>
      <h3 class="text-center mb-4">Your Personality Dashboard</h3>
      <div class="text-center mb-4">
        <button @click="generateDescription" 
                class="btn btn-outline-primary"
                :disabled="buttonDisabled">
            {{ generateButtonText }}
        </button>
        <div v-if="noQuizzesCompleted" class="alert alert-warning mt-3">
          No quizzes completed yet. <router-link to="/quiz">Take a quiz now</router-link>
        </div>
      </div>

      <PersonalityAnalysisSection 
        :parsedFeeling="parsedFeeling"
      />
    </div>
  </div>
</template>

<script>
import { quizService, resultsService, authService } from '../services/firebase-index';
import { openaiService } from '../services/openai';
import { 
  updateUserPersonalityAnalysis, 
  getUserPersonalityAnalysis,
  getUserPersonality 
} from '../../firebase';
import { 
  PERSONALITY_ANALYSIS_SECTIONS 
} from '../config/personalityAnalysis';
import { useAuthStore } from '../stores/auth';
import PersonalityAnalysisSection from './PersonalityAnalysisSection.vue';

export default {
  name: 'PersonalityDashboard',
  components: {
    PersonalityAnalysisSection
  },
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  data() {
    return {
      results: [],
      dashboardLoading: false,
      generatingDescription: false,
      coreFeeling: null,
      parsedFeeling: {},
      userTags: [],
      hasSavedAnalysis: false,
      needsFullAnalysis: false,
      personalityAnalysisSections: PERSONALITY_ANALYSIS_SECTIONS
    };
  },
  computed: {
    allAnswers() {
      const answers = [];
      this.results.forEach(result => {
        result.answers.forEach(answer => {
          answers.push({
            question: answer.questionText,
            answer: answer.userAnswer,
            quizTitle: result.quizTitle
          });
        });
      });
      return answers;
    },
    generateButtonText() {
      return this.generatingDescription ? 'GENERATING...' : 'GENERATE NEW ANALYSIS';
    },
    noQuizzesCompleted() {
      return this.results.length === 0;
    },
    buttonDisabled() {
      return this.generatingDescription || this.noQuizzesCompleted;
    }
  },
  methods: {
    async loadUserPersonality() {
      if (this.authStore.loading) {
        console.log('Auth still loading, delaying loadUserPersonality');
        return;
      }
      const user = authService.getCurrentUser();
      if (user) {
        try {
          const userData = await getUserPersonality(user.uid);
          this.userTags = userData.tags || [];
        } catch (error) {
          console.error("Error loading user personality:", error);
        }
      }
    },
    async loadResults() {
      if (this.authStore.loading) {
        console.log('Auth still loading, delaying loadResults');
        return;
      }
      const user = authService.getCurrentUser();
      if (!user) {
        console.error("User not logged in");
        return;
      }
      try {
        const { results, error } = await resultsService.getUserResults(user.uid);
        if (error) {
          console.error("Error fetching results:", error);
          return;
        }
        console.log("Loaded results:", results);
        this.results = results;
        if (results.length === 0) {
          console.log("No quiz results found. Please take some quizzes first.");
        }
      } catch (err) {
        console.error("Exception in loadResults:", err);
      }
    },
    async generateDescription() {
      console.log('Results data:', this.results);
      console.log('Computed all answers:', this.allAnswers);
      if (this.results.length === 0) {
        console.log("Loading quiz results...");
        await this.loadResults();
        if (this.results.length === 0) {
          console.log("No quiz results available to analyze. Please take some quizzes first.");
          return;
        }
      }
      if (this.allAnswers.length === 0) {
        console.log("No quiz answers found. Please make sure you have completed quizzes with answers.");
        return;
      }
      this.generatingDescription = true;
      this.coreFeeling = null;
      this.hasSavedAnalysis = false;
      this.needsFullAnalysis = false;
      try {
        const templates = openaiService.getPromptTemplates('personalityDescription');
        console.log('Using prompt templates:', templates);
        const { completion, error, usage } = await openaiService.analyzePersonality(this.allAnswers);
        if (error) {
          console.error("Error generating personality analysis:", error);
          return;
        }
        
        this.parsedFeeling = completion;
        
      } catch (error) {
        console.error("Exception in generateDescription:", error);
      } finally {
        this.generatingDescription = false;
      }
    }
  }
};
</script>