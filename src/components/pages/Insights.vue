<template>
  <div class="container">
    <h2 class="mb-4">AI Personality Insights</h2>

    <!-- Generate analysis section -->
    <div>
      <div class="mb-4">
        <p class="lead mb-4">
          Generate a comprehensive AI analysis of your personality based on your assessment results.
        </p>

        <!-- API Calls Info -->
        <div class="mb-3 d-flex flex-column align-items-start rounded">
          <span class="fw-bold">AI Analysis Requests:</span>
          <span class="fw-bold" :class="{
            'text-danger': userStore.openaiApiCallsRemaining <= 0,
            'text-warning': (userStore.openaiApiCallsRemaining === 1 && !userStore.isPaid) || (userStore.openaiApiCallsRemaining <= 5 && userStore.isPaid),
            'text-success': userStore.isPaid && userStore.openaiApiCallsRemaining > 5
          }">
            {{ `${userStore.openaiApiCallsRemaining} remaining` }}
          </span>

          <small class="text-muted">
            {{ userStore.isPaid
              ? 'Premium users get 30 AI analysis requests.'
              : userStore.openaiApiCallsRemaining <= 1 ? 'Last analysis remaining! Upgrade to premium for 30 total requests.'
                : `You have ${userStore.openaiApiCallsRemaining} more AI personality analysis requests. Upgrade to premium
              for 30 total requests.` }} </small>
        </div>

        <button @click="generateDescription" class="btn btn-primary btn-lg" :disabled="buttonDisabled">
          {{ generateButtonText }}
        </button>

        <!-- Upgrade prompt when limit reached -->
        <div v-if="userStore.openaiApiCallsRemaining <= 0 && !userStore.isPaid" class="mt-3">
          <router-link to="/account" class="btn btn-outline-primary">
            <i class="bi bi-arrow-up-circle me-2"></i>
            Upgrade to Premium (30 Requests)
          </router-link>
        </div>
      </div>

      <!-- Error message -->
      <Alert v-if="error" type="error" class="text-center mb-4" :message="error" />

      <!-- Analysis Results -->
      <PersonalityAnalysisSection :personalityAnalysis="userStore.personalityAnalysis || {}" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import PersonalityAnalysisSection from '../insights/PersonalityAnalysisSection.vue';
import { useUserStore } from '../../stores/user';
import Alert from '../ui/Alert.vue';
import { useInsightsProgress } from '../../composables/useInsightsProgress';

const userStore = useUserStore();
const error = ref<string | null>(null);
const {
  isUnlocked,
  quizzesLeft,
  requiredToUnlock,
  completedQuizzes,
  totalQuizzes
} = useInsightsProgress();

const generateButtonText = computed(() => {
  if (!isUnlocked.value) {
    return `Complete ${quizzesLeft.value} more assessment${quizzesLeft.value === 1 ? '' : 's'} to generate a comprehensive analysis.`;
  }
  if (userStore.isGeneratingAnalysis) return 'GENERATING...';
  if (userStore.openaiApiCallsRemaining <= 0) {
    return userStore.isPaid ? 'CONTACT SUPPORT FOR ADDITIONAL ACCESS' : 'UPGRADE TO PREMIUM FOR 30 REQUESTS';
  }
  return userStore.personalityAnalysis && Object.keys(userStore.personalityAnalysis).length > 0 ? 'REGENERATE ANALYSIS' : 'GENERATE ANALYSIS';
});

const buttonDisabled = computed(() =>
  userStore.isGeneratingAnalysis ||
  userStore.noQuizzesCompleted ||
  !isUnlocked.value ||
  (userStore.openaiApiCallsRemaining <= 0 && !userStore.isPaid)
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