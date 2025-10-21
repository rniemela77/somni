<template>
  <div class="py-2">
    <!-- Locked Content -->
    <div v-if="isLocked" class="text-center py-4">
      <i class="bi bi-lock-fill display-4 text-muted mb-3"></i>
      <p class="text-muted">Unlocks in {{ unlocksIn }} quests</p>
    </div>

    <!-- No Analysis Content -->
    <div v-else-if="!analysis?.details" class="text-center py-4">
      <i class="bi bi-lightbulb display-1 text-muted mb-3"></i>
      <h4>No Insights Available</h4>
      <p class="text-muted mb-4">
        Generate your insights to get started.
      </p>
      <button 
        @click="generateCluster(section.id)" 
        class="btn btn-primary" 
        :disabled="isGenerating"
      >
        <span v-if="isGenerating" class="spinner-border spinner-border-sm me-2"></span>
        Generate Insights
      </button>
    </div>

    <!-- Analysis Content -->
    <div v-else>
      <div class="mb-3">
        <h3 class="h4 fw-bold">{{ analysis.title }}</h3>
      </div>
      
      <div class="mb-3 text-primary">
        <p class="fs-5 lh-lg">{{ analysis.details }}</p>
      </div>

      <!-- Re-generate Button -->
      <div class="text-center mt-4 pt-3">
        <Button 
          @click="generateCluster(section.id)" 
          outline variant="primary" 
          :disabled="isGenerating"
        >
          <span v-if="isGenerating" class="spinner-border spinner-border-sm me-2"></span>
          Re-generate
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '../../stores/user';
import Button from '../ui/Button.vue';

interface Props {
  section: {
    id: string;
    title: string;
    description: string;
  };
  isLocked: boolean;
  unlocksIn: number;
  analysis?: {
    title?: string;
    details?: string;
  } | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  generateCluster: [clusterId: string];
}>();

const userStore = useUserStore();

const isGenerating = computed(() => userStore.generatingPersonalityAnalysis);

const generateCluster = (clusterId: string) => {
  emit('generateCluster', clusterId);
};
</script>

<style scoped>
/* Minimal styling - relying on Bootstrap classes */
</style>
