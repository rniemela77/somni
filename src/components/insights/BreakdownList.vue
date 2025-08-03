<template>
  <div class="breakdown-container">
    <!-- Generate analysis section -->
    <div>
      <div class="mb-4">
        <div class="alert alert-info" role="alert">
          <p class="mb-0">Generate a comprehensive AI analysis of your personality based on your assessment results.</p>
        </div>

        <!-- API Calls Info -->
        <div class="mb-3 d-flex align-items-center">
          <span class="fw-bold">AI Analysis Requests:</span>

          <small class="text-muted ms-2">
            {{ apiCallsDescription }}
          </small>
        </div>

        <button v-if="userStore.openaiApiCallsRemaining > 0" @click="generateDescription"
          class="btn btn-primary btn-lg" :disabled="buttonDisabled">
          {{ generateButtonText }}
        </button>

        <!-- Upgrade prompt when limit reached -->
        <div v-if="userStore.openaiApiCallsRemaining <= 0 && !userStore.isPaid" class="mt-3">
          <router-link to="/account" class="btn btn-outline-primary">
            <i class="bi bi-arrow-up-circle me-2"></i>
            Upgrade to Premium ({{ API_LIMITS.PAID_OPENAI_CALLS_LIMIT }} Requests)
          </router-link>
        </div>
      </div>

      <!-- Error message -->
      <Alert v-if="error" type="error" class="text-center mb-4" :message="error" />

      <!-- Analysis Results -->
      <div class="personality-analysis-list">
        <PersonalityAnalysisSection v-for="section in sortedSections" :key="section.id" :title="section.title"
          :icon="section.icon" :name="userStore?.personalityAnalysis?.[section.id]?.['Name'] || ''"
          :description="userStore?.personalityAnalysis?.[section.id]?.['Description'] || ''"
          :key-insights="userStore?.personalityAnalysis?.[section.id]?.['Key Insights'] || ''"
          :quote-maxim="userStore?.personalityAnalysis?.[section.id]?.['Quote/Maxim'] || ''"
          :quote-maxim-author="userStore?.personalityAnalysis?.[section.id]?.['Quote/Maxim Source'] || ''"
          :loading="userStore.isGeneratingAnalysis" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '../../stores/user';
import Alert from '../ui/Alert.vue';
import { API_LIMITS } from '../../config/limits';
import { PERSONALITY_ANALYSIS_SECTIONS } from '../../config/personalityAnalysis';
import PersonalityAnalysisSection from './PersonalityAnalysisSection.vue';

// Props
interface Props {
  apiCallsDescription: string;
  generateButtonText: string;
  isUnlocked: boolean;
  quizzesLeft: number;
}

const props = defineProps<Props>();

const userStore = useUserStore();
const error = ref<string | null>(null);

const sortedSections = computed(() => {
  return Object.values(PERSONALITY_ANALYSIS_SECTIONS)
    .sort((a, b) => a.display.order - b.display.order);
});

const buttonDisabled = computed(() =>
  userStore.isGeneratingAnalysis ||
  userStore.noQuizzesCompleted ||
  !props.isUnlocked ||
  (userStore.openaiApiCallsRemaining <= 0 && !userStore.isPaid)
);

const generateDescription = async () => {
  error.value = null;

  try {
    const { success, error: analysisError } = await userStore.generatePersonalityAnalysis();

    if (!success) {
      throw new Error(analysisError || 'Failed to generate personality analysis');
    }
  } catch (err) {
    console.error("Exception in generateDescription:", err);
    error.value = err instanceof Error ? err.message : String(err);
  }
};
</script>

<style scoped>
.breakdown-container {
  max-width: 100%;
}
</style> 