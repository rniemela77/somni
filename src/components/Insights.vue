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
import { useUserStore } from '../stores/user';

const userStore = useUserStore();
const error = ref<string | null>(null);

const generateButtonText = computed(() => {
  if (userStore.isGeneratingAnalysis) return 'GENERATING...';
  return userStore.personalityAnalysis && Object.keys(userStore.personalityAnalysis).length > 0 ? 'REGENERATE ANALYSIS' : 'GENERATE ANALYSIS';
});

const buttonDisabled = computed(() =>
  userStore.isGeneratingAnalysis || userStore.noQuizzesCompleted
);

const generateDescription = async () => {
  error.value = null;

  try {
    const { success, error: analysisError } = await userStore.generatePersonalityAnalysis();

    if (!success) {
      throw new Error(analysisError || 'Failed to generate personality analysis');
    }

    // Analysis was successful and store has been updated automatically
  } catch (err) {
    console.error("Exception in generateDescription:", err);
    error.value = err instanceof Error ? err.message : String(err);
  }
};
</script>

<style scoped>
.lead {
  color: #6c757d;
}
</style> 