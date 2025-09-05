<template>
  <div class="breakdown-container">
    <!-- Generate analysis section -->
    <div>
      <div class="mb-4">
        <div class="alert alert-info" role="alert">
          <p class="mb-0">Generate a comprehensive AI analysis of your personality based on your assessment results.</p>
        </div>

        <button @click="generateCluster('innerRealm')" class="btn btn-primary btn-lg" :disabled="false">
          Cluster innerRealm
        </button>


        <button @click="generateCluster('mythicMirror')" class="btn btn-primary btn-lg" :disabled="false">
          Cluster mythicMirror
        </button>

        <button @click="generateCluster('cosmicPath')" class="btn btn-primary btn-lg" :disabled="false">
          Cluster cosmicPath
        </button>
      </div>

      <!-- Analysis Results -->
      <div class="personality-analysis-list">
        <Card v-for="(section, index) in userStore.personalityProfile?.personalityAnalysis" :key="index" class="mb-4">
          <!-- section key name -->
          <h1>{{ index }}</h1>
          <h2 v-if="section.title">{{ section.title }}</h2>
          <div v-if="section.details">{{ section.details }}</div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '../../stores/user';
import type { AnalysisData } from '../../../shared/types/shared';
import Alert from '../ui/Alert.vue';
import { API_LIMITS } from '../../config/limits';
import { PERSONALITY_ANALYSIS_SECTIONS } from '../../config/personalityAnalysis';
import PersonalityAnalysisSection from './PersonalityAnalysisSection.vue';
import Card from '../ui/Card.vue';

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

const generateCluster = async (cluster: string) => {
  error.value = null;

  try {
    const { success, error: analysisError } = await userStore.generatePersonalityAnalysisForCluster(cluster);

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