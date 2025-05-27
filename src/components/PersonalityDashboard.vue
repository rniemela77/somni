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
import { quizService, resultsService, authService } from '../services/firebase';
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
          console.error(`Error: ${error}`);
        } else {
          this.coreFeeling = completion;
          console.log('Token usage:', usage);
          this.parsedFeeling = this.parsePersonalityAnalysis(completion);
        }
      } catch (error) {
        console.error(`Error generating description: ${error.message}`);
      } finally {
        this.generatingDescription = false;
      }
    },
    parsePersonalityAnalysis(text) {
      const result = {};
      Object.keys(this.personalityAnalysisSections).forEach(key => {
        result[key] = null;
      });
      if (!text || typeof text !== 'string') {
        console.warn('No text to parse in parsePersonalityAnalysis');
        return result;
      }
      console.log('Parsing personality analysis text, length:', text.length);
      console.log('Text sample:', text.substring(0, 200) + '...');
      Object.keys(this.personalityAnalysisSections).forEach(sectionKey => {
        const section = this.personalityAnalysisSections[sectionKey];
        const regex = new RegExp(`${section.title}:(.+?)(?=${Object.values(this.personalityAnalysisSections).map(s => s.title).join('|')}:|$)`, 'is');
        const match = text.match(regex);
        if (match) {
          result[sectionKey] = match[1].trim();
          console.log(`Parsed ${section.title}:`, result[sectionKey]?.substring(0, 50) + '...');
        } else {
          console.warn(`No ${section.title} section found`);
        }
      });
      const allSectionsEmpty = Object.keys(this.personalityAnalysisSections).every(key => !result[key]);
      if (allSectionsEmpty) {
        console.log('Using fallback line-based parsing');
        const lines = text.split('\n').filter(line => line.trim());
        const sectionKeys = Object.keys(this.personalityAnalysisSections);
        let currentSection = 0;
        let currentText = '';
        for (const line of lines) {
          if (line.trim() === '') {
            if (currentText && currentSection < sectionKeys.length) {
              result[sectionKeys[currentSection]] = currentText;
              console.log(`Set ${sectionKeys[currentSection]} from line parsing`);
              currentSection++;
              currentText = '';
            }
          } else {
            currentText += (currentText ? ' ' : '') + line.trim();
          }
        }
        if (currentText && currentSection < sectionKeys.length) {
          result[sectionKeys[currentSection]] = currentText;
          console.log(`Set ${sectionKeys[currentSection]} from last section`);
        }
      }
      console.log('Final parsed data:', {
        sections: Object.keys(this.personalityAnalysisSections).map(key => 
          `${key}: ${result[key] ? 'Present' : 'Missing'}`)
      });
      this.updateUserProfile(result);
      return result;
    },
    async updateUserProfile(parsedResult) {
      try {
        const user = authService.getCurrentUser();
        if (!user) {
          console.error('Cannot update profile: no user logged in');
          return;
        }
        
        const analysisDataToSave = {};
        Object.keys(this.personalityAnalysisSections).forEach(sectionKey => {
          analysisDataToSave[sectionKey] = parsedResult[sectionKey] || null;
          this.parsedFeeling[sectionKey] = parsedResult[sectionKey];
        });
        console.log('Saving personality analysis data:', analysisDataToSave);
        await updateUserPersonalityAnalysis(user.uid, analysisDataToSave);
        console.log('Successfully updated user personality analysis in Firebase');
        this.hasSavedAnalysis = true;
        this.needsFullAnalysis = false;
        await this.loadSavedPersonalityAnalysis();
      } catch (error) {
        console.error('Error updating user profile:', error);
      }
    },
    async loadSavedPersonalityAnalysis() {
      try {
        const user = authService.getCurrentUser();
        if (!user) {
          console.log('No user logged in, cannot load personality analysis');
          this.hasSavedAnalysis = true;
          return;
        }
        const userPersonality = await getUserPersonality(user.uid);
        const analysisData = await getUserPersonalityAnalysis(user.uid);
        console.log('Loaded user personality:', userPersonality);
        console.log('Loaded personality analysis:', analysisData);
        this.parsedFeeling = {};
        let hasAnalysisData = false;
        if (analysisData && analysisData.personalityAnalysis) {
          Object.keys(this.personalityAnalysisSections).forEach(sectionKey => {
            if (analysisData.personalityAnalysis[sectionKey]) {
              this.parsedFeeling[sectionKey] = analysisData.personalityAnalysis[sectionKey];
              hasAnalysisData = true;
            }
          });
        }
        this.coreFeeling = hasAnalysisData ? "Loaded from previous analysis" : "No previous analysis";
        this.hasSavedAnalysis = true;
        console.log('Setting hasSavedAnalysis to true');
        this.needsFullAnalysis = !hasAnalysisData;
        console.log('Needs full analysis:', this.needsFullAnalysis);
      } catch (error) {
        console.error('Error loading saved personality analysis:', error);
        this.hasSavedAnalysis = true;
      }
    },
    async initDashboard() {
      if (this.authStore.loading) {
        console.log('Auth state still loading, delaying dashboard initialization');
        const unwatch = this.$watch(
          () => this.authStore.loading,
          (isLoading) => {
            if (!isLoading) {
              console.log('Auth loading completed, initializing dashboard');
              unwatch();
              this.initDashboardAfterAuth();
            }
          }
        );
        return;
      }
      this.initDashboardAfterAuth();
    },
    async initDashboardAfterAuth() {
      this.dashboardLoading = true;
      try {
        await Promise.all([
          this.loadUserPersonality(),
          this.loadResults(),
          this.loadSavedPersonalityAnalysis()
        ]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        this.dashboardLoading = false;
      }
    }
  },
  mounted() {
    console.log('PersonalityDashboard component mounted');
    this.initDashboard();
  }
};
</script>

<style scoped>
</style> 