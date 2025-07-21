<template>
  <div>
    <h3 class="text-center mb-4">Your Personality Dashboard</h3>

    <!-- No assessments message -->
    <div v-if="userStore.noQuizzesCompleted" class="alert alert-warning mb-4 text-center">
      <b>No assessments completed yet!</b>
      <p>Visit the assessment page to begin your personality analysis.</p>
      <router-link to="/quiz">Visit the assessment page</router-link>
    </div>

    <PersonalityScales :scores="userStore.userAttributes" class="mb-5" />

    <h3 class="text-center">Deeper Analysis</h3>

    <!-- Missing assessments warning -->
    <div v-if="userStore.hasIncompleteQuizzes" class="alert alert-warning text-center mb-3">
      You have completed {{ userStore.completedQuizzesCount }} of {{ userStore.totalQuizzesCount }} assessments.
      For best personality analysis results, please <router-link to="/quiz">complete all assessments</router-link>.
    </div>

    <!-- Generate analysis button -->
    <div class="text-center mb-4">
      <button @click="generateDescription" class="btn btn-outline-primary" :disabled="buttonDisabled">
        {{ generateButtonText }}
      </button>
    </div>

    <PersonalityAnalysisSection :parsedFeeling="userStore.personalityAnalysis || {}" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import PersonalityScales from './PersonalityScales.vue';
import PersonalityAnalysisSection from './PersonalityAnalysisSection.vue';
import { openaiService } from '../services/openai';
import { useUserStore } from '../stores/user';

const userStore = useUserStore();
const generatingDescription = ref(false);
const error = ref<string | null>(null);

const generateButtonText = computed(() =>
  generatingDescription.value ? 'GENERATING...' : 'GENERATE NEW ANALYSIS'
);

const buttonDisabled = computed(() =>
  generatingDescription.value || userStore.noQuizzesCompleted
);

const generateDescription = async () => {
  generatingDescription.value = true;
  error.value = null;

  try {
    // Get the user's attribute scores
    const attributes = userStore.userAttributes;

    // Check if we have any attributes to analyze
    if (Object.keys(attributes).length === 0) {
      throw new Error('No personality attributes found. Please take some assessments first.');
    }

    // Generate personality analysis based on attributes
    const { completion, error: analysisError } = await openaiService.analyzePersonality(attributes);

    if (analysisError) {
      throw new Error(analysisError);
    }

    if (!completion) {
      throw new Error('Failed to generate personality analysis');
    }

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