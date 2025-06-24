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
      
      <!-- No quizzes message -->
      <div v-if="noQuizzesCompleted" class="alert alert-warning mb-4">
        No quizzes completed yet. <router-link to="/quiz">Take a quiz now</router-link>
      </div>
      
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
      </div>

      <PersonalityAnalysisSection 
        :parsedFeeling="parsedFeeling"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
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
    const parsedFeeling = ref({});
    const generatingDescription = ref(false);
    const error = ref(null);

    const loadPersonalityData = async () => {
      if (authStore.loading) {
        console.log('Auth still loading, delaying loadPersonalityData');
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

        if (personalityData && personalityData.personalityAnalysis) {
          parsedFeeling.value = personalityData.personalityAnalysis;
        }
      } catch (err) {
        console.error("Exception in loadPersonalityData:", err);
      }
    };

    onMounted(async () => {
      if (authStore.user) {
        try {
          // Fetch fresh user data
          const { data: userData, error: userError } = await userService.getUser(authStore.user.uid);
          if (userError) {
            console.error('Error fetching user data:', userError);
            return;
          }
          
          // Update auth store with fresh data
          authStore.setUserAttributes(userData.attributes || {});
          
          // Load saved personality analysis
          await loadPersonalityData();
        } catch (err) {
          console.error('Error initializing dashboard:', err);
        } finally {
          dashboardLoading.value = false;
        }
      }
    });

    // Computed properties
    const attributeScores = computed(() => authStore.userAttributes || {});
    
    const generateButtonText = computed(() => 
      generatingDescription.value ? 'GENERATING...' : 'GENERATE NEW ANALYSIS'
    );
    
    const noQuizzesCompleted = computed(() => {
      const attributes = attributeScores.value;
      return !attributes || Object.keys(attributes).length === 0;
    });
    
    const buttonDisabled = computed(() => 
      generatingDescription.value || noQuizzesCompleted.value
    );

    // Methods
    const generateDescription = async () => {
      generatingDescription.value = true;
      error.value = null;

      try {
        // Get the user's attribute scores
        const attributes = attributeScores.value;
        
        // Check if we have any attributes to analyze
        if (Object.keys(attributes).length === 0) {
          throw new Error('No personality attributes found. Please take some quizzes first.');
        }

        // Generate personality analysis based on attributes
        const { completion, error: analysisError, usage } = await openaiService.analyzePersonality(attributes);
        
        if (analysisError) {
          throw new Error(analysisError);
        }

        // Update the parsedFeeling ref
        parsedFeeling.value = completion;

        // Save the analysis
        if (authStore.user) {
          const { error: updateError } = await personalityService.updatePersonalityAnalysis(
            authStore.user.uid,
            { personalityAnalysis: completion }
          );
          
          if (updateError) {
            console.error("Error saving personality analysis:", updateError);
          }
        }
      } catch (err) {
        console.error("Exception in generateDescription:", err);
        error.value = err.message;
      } finally {
        generatingDescription.value = false;
      }
    };

    return {
      // State
      dashboardLoading,
      parsedFeeling,
      generatingDescription,
      error,
      
      // Computed
      attributeScores,
      generateButtonText,
      noQuizzesCompleted,
      buttonDisabled,
      
      // Methods
      generateDescription,
      loadPersonalityData
    };
  }
};
</script>