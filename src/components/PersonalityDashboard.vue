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

      <PersonalityScales :scores="attributeScores" class="mb-5"/>

      <h3 class="text-center">Deeper Analysis</h3>

      <div class="text-center mb-4">
        <button @click="generateDescription" class="btn btn-outline-primary" :disabled="buttonDisabled">
          {{ generateButtonText }}
        </button>
      </div>

      <PersonalityAnalysisSection :parsedFeeling="parsedFeeling" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import PersonalityScales from './PersonalityScales.vue';
import PersonalityAnalysisSection from './PersonalityAnalysisSection.vue';
import { openaiService } from '../services/openai';
import { useUserStore } from '../stores/user';

const userStore = useUserStore();
const dashboardLoading = ref(true);
const parsedFeeling = ref<Record<string, string>>({});
const generatingDescription = ref(false);
const error = ref<string | null>(null);

const loadPersonalityData = async () => {
  if (userStore.loading) {
    console.log('User store still loading, delaying loadPersonalityData');
    return;
  }

  if (!userStore.isAuthenticated) {
    console.error("User not logged in");
    return;
  }

  try {
    // Get personality analysis directly from user store
    if (userStore.personalityAnalysis) {
      parsedFeeling.value = userStore.personalityAnalysis;
    }
  } catch (err) {
    console.error("Exception in loadPersonalityData:", err);
  }
};

onMounted(async () => {
  if (userStore.isAuthenticated) {
    try {
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
const attributeScores = computed(() => userStore.userAttributes || {});

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
    const { completion, error: analysisError } = await openaiService.analyzePersonality(attributes);

    if (analysisError) {
      throw new Error(analysisError);
    }

    if (!completion) {
      throw new Error('Failed to generate personality analysis');
    }

    // Update the parsedFeeling ref
    parsedFeeling.value = completion;

    // Save the analysis using the user store
    if (userStore.isAuthenticated) {
      const { success, error: updateError } = await userStore.updatePersonalityAnalysis({
        personalityAnalysis: completion
      });

      if (!success) {
        console.error("Error saving personality analysis:", updateError);
      }
    }
  } catch (err) {
    console.error("Exception in generateDescription:", err);
    error.value = err instanceof Error ? err.message : String(err);
  } finally {
    generatingDescription.value = false;
  }
};
</script>