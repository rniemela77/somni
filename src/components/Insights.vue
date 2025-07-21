<template>
  <div class="container">
    <h2 class="text-center mb-4">AI Personality Insights</h2>
    
    <!-- No assessments message -->
    <div v-if="userStore.noQuizzesCompleted" class="alert alert-info text-center mb-4">
      <h4>No Assessments Completed Yet</h4>
      <p>Complete personality assessments to generate your AI insights.</p>
      <router-link to="/quiz" class="btn btn-primary">Take Your First Assessment</router-link>
    </div>

    <!-- Missing assessments warning -->
    <div v-else-if="userStore.hasIncompleteQuizzes" class="alert alert-warning text-center mb-4">
      You have completed {{ userStore.completedQuizzesCount }} of {{ userStore.totalQuizzesCount }} assessments.
      For best AI analysis, please <router-link to="/quiz">complete all assessments</router-link>.
    </div>

    <!-- Generate analysis section -->
    <div v-if="!userStore.noQuizzesCompleted">
      <div class="text-center mb-4">
        <p class="lead mb-4">Generate a comprehensive AI analysis of your personality based on your assessment results.</p>
        <button @click="generateDescription" class="btn btn-primary btn-lg" :disabled="buttonDisabled">
          {{ generateButtonText }}
        </button>
      </div>

      <!-- Error message -->
      <div v-if="error" class="alert alert-danger text-center mb-4">
        <strong>Error:</strong> {{ error }}
      </div>

      <!-- Analysis Results -->
      <PersonalityAnalysisSection :personalityAnalysis="userStore.personalityAnalysis || {}" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import PersonalityAnalysisSection from './PersonalityAnalysisSection.vue';
import { openaiService } from '../services/openai';
import { useUserStore } from '../stores/user';

const userStore = useUserStore();
const generatingDescription = ref(false);
const error = ref<string | null>(null);

const generateButtonText = computed(() => {
  if (generatingDescription.value) return 'GENERATING...';
  return userStore.personalityAnalysis ? 'REGENERATE ANALYSIS' : 'GENERATE ANALYSIS';
});

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

<style scoped>
.lead {
  color: #6c757d;
}
</style> 