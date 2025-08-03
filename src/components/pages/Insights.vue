<template>
  <div class="container">
    <h2 class="mb-4">AI Personality Insights</h2>

    <!-- View Toggle -->
    <div class="view-toggle mb-4">
      <div class="btn-group" role="group">
        <button @click="currentView = 'breakdown'" class="btn"
          :class="currentView === 'breakdown' ? 'btn-primary' : 'btn-outline-primary'">
          <i class="bi bi-list-check me-2"></i>
          Breakdown
        </button>
        <button @click="currentView = 'narrative'" class="btn"
          :class="currentView === 'narrative' ? 'btn-primary' : 'btn-outline-primary'">
          <i class="bi bi-book me-2"></i>
          Narrative
        </button>
      </div>
    </div>

    <!-- Insights View -->
    <div v-if="currentView === 'breakdown'">
      <BreakdownList 
        :api-calls-description="apiCallsDescription"
        :generate-button-text="generateButtonText"
        :is-unlocked="isUnlocked"
        :quizzes-left="quizzesLeft"
      />
    </div>

    <div v-else-if="currentView === 'narrative'">
      <Narrative 
        :api-calls-description="apiCallsDescription"
        :generate-button-text="generateButtonText"
        :is-unlocked="isUnlocked"
        :quizzes-left="quizzesLeft"
      />
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '../../stores/user';
import { useInsightsProgress } from '../../composables/useInsightsProgress';
import { API_LIMITS } from '../../config/limits';
import BreakdownList from '../insights/BreakdownList.vue';
import Narrative from '../insights/Narrative.vue';

const userStore = useUserStore();
const currentView = ref<'breakdown' | 'narrative'>('breakdown');

const {
  isUnlocked,
  quizzesLeft,
} = useInsightsProgress();

const generateButtonText = computed(() => {
  if (!isUnlocked.value) {
    return `Complete ${quizzesLeft.value} more assessment${quizzesLeft.value === 1 ? '' : 's'} to generate a comprehensive analysis.`;
  }
  if (userStore.isGeneratingAnalysis) return 'Generating...';
  if (userStore.openaiApiCallsRemaining <= 0) {
    return userStore.isPaid ? 'CONTACT SUPPORT FOR ADDITIONAL ACCESS' : `UPGRADE TO PREMIUM FOR ${API_LIMITS.PAID_OPENAI_CALLS_LIMIT} REQUESTS`;
  }
  return userStore.personalityAnalysis && Object.keys(userStore.personalityAnalysis).length > 0 ? 'Regenerate Analysis' : 'Generate Analysis';
});

const apiCallsDescription = computed(() => {
  if (userStore.openaiApiCallsRemaining <= 0 && !userStore.isPaid) {
    return `You have run out of free AI analysis requests. Upgrade to premium for ${API_LIMITS.PAID_OPENAI_CALLS_LIMIT} total requests.`;
  }
  else if (userStore.openaiApiCallsRemaining <= 0 && userStore.isPaid) {
    return `You have run out of AI analysis requests. Contact support for additional access.`;
  }
  return `${userStore.openaiApiCallsRemaining} remaining.`;
});
</script>

<style scoped>
.view-toggle {
  display: flex;
  justify-content: center;
}

.feature-card {
  background: var(--card-bg-color);
  border: 1px solid var(--card-border-color);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.feature-card i {
  font-size: 2.5rem;
  display: block;
}

.feature-card h5 {
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.feature-card p {
  margin-bottom: 0;
  line-height: 1.5;
}
</style>