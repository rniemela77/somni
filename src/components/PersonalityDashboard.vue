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
      
      <!-- Add Scales -->
      <div class="card mb-4">
        <div class="card-body">
          <PersonalityScales 
            :scores="attributeScores"
          />
        </div>
      </div>

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
import { ref, computed, watch, onMounted } from 'vue';
import PersonalityScales from './PersonalityScales.vue';
import PersonalityAnalysisSection from './PersonalityAnalysisSection.vue';
import { PersonalityService } from '../services/personality.service';
import { UserService } from '../services/user.service';
import { openaiService } from '../services/openai';
import { PERSONALITY_ANALYSIS_SECTIONS } from '../config/personalityAnalysis';
import { useAuthStore } from '../stores/auth';

export default {
  name: 'PersonalityDashboard',
  components: {
    PersonalityAnalysisSection,
    PersonalityScales
  },
  setup() {
    const authStore = useAuthStore();
    const personalityService = new PersonalityService();
    const userService = new UserService();
    const dashboardLoading = ref(true);
    const results = ref([]);

    const loadResults = async () => {
      if (authStore.loading) {
        console.log('Auth still loading, delaying loadResults');
        return;
      }
      
      if (!authStore.user) {
        console.error("User not logged in");
        return;
      }

      try {
        const { data: personalityData, error: personalityError } = 
          await personalityService.getUserPersonality(authStore.user.uid);
        
        if (personalityError) {
          console.error("Error fetching personality data:", personalityError);
          return;
        }

        if (personalityData) {
          results.value = personalityData.results || [];
          console.log("Loaded results:", results.value);
          
          if (results.value.length === 0) {
            console.log("No quiz results found. Please take some quizzes first.");
          }
        }
      } catch (err) {
        console.error("Exception in loadResults:", err);
      }
    };

    onMounted(async () => {
      if (authStore.user) {
        try {
          // Fetch fresh user data
          const { data: userData, error } = await userService.getUser(authStore.user.uid);
          if (error) {
            console.error('Error fetching user data:', error);
            return;
          }
          
          // Update auth store with fresh data
          authStore.setUserAttributes(userData.attributes || {});
          
          await loadResults();
        } catch (err) {
          console.error('Error initializing dashboard:', err);
        } finally {
          dashboardLoading.value = false;
        }
      }
    });
    
    return { 
      authStore,
      personalityService,
      userService,
      dashboardLoading,
      results,
      loadResults
    };
  },
  data() {
    return {
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
    attributeScores() {
      return this.authStore.userAttributes || {};
    },
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

        // Save the analysis
        if (this.authStore.user) {
          const { error: updateError } = await this.personalityService.updatePersonalityAnalysis(
            this.authStore.user.uid,
            this.parsedFeeling
          );
          
          if (updateError) {
            console.error("Error saving personality analysis:", updateError);
          }
        }
      } catch (error) {
        console.error("Exception in generateDescription:", error);
      } finally {
        this.generatingDescription = false;
      }
    }
  }
};
</script>