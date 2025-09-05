<template>
  <div class="insights-layout">
    <!-- Sidebar Navigation -->
    <InsightsSidebar
      :selectedItem="selectedItem"
      :completedAssessmentsWithScores="completedAssessmentsWithScores"
      :totalCompletedAssessments="totalCompletedAssessments"
      @selectRevelation="selectRevelation"
      @selectDiscovery="selectDiscovery"
    />

    <!-- Main Content Area -->
    <InsightsContent
      :selectedItem="selectedItem"
      :completedAssessmentsWithScores="completedAssessmentsWithScores"
      :totalCompletedAssessments="totalCompletedAssessments"
      @generateCluster="generateCluster"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '../../stores/user';
import InsightsSidebar from '../insights/InsightsSidebar.vue';
import InsightsContent from '../insights/InsightsContent.vue';
import { useAssessmentProgress } from '../../composables/useAssessmentProgress';

// Store and state
const userStore = useUserStore();
const { totalCompletedAssessments, completedAssessmentsWithScores } = useAssessmentProgress();

// Selected item state
const selectedItem = ref<{ type: 'revelation' | 'discovery', id: string } | null>(null);

// Auto-select first available revelation on mount
onMounted(() => {
  if (!selectedItem.value && completedAssessmentsWithScores.value.length > 0) {
    // If there are completed assessments, select the first one
    selectedItem.value = { type: 'discovery', id: completedAssessmentsWithScores.value[0].slug };
  } else if (!selectedItem.value) {
    // Otherwise, select the first revelation
    selectedItem.value = { type: 'revelation', id: 'theFlame' };
  }
});

const generateCluster = async (cluster: string) => {
  try {
    const { success, error: analysisError } = await userStore.generatePersonalityAnalysisForCluster(cluster);

    if (!success) {
      throw new Error(analysisError || 'Failed to generate personality analysis');
    }
  } catch (err) {
    console.error("Exception in generateCluster:", err);
  }
};

// Navigation methods
const selectRevelation = (sectionId: string) => {
  selectedItem.value = { type: 'revelation', id: sectionId };
};

const selectDiscovery = (assessmentSlug: string) => {
  selectedItem.value = { type: 'discovery', id: assessmentSlug };
};
</script>

<style scoped>
.insights-layout {
  display: flex;
  background: var(--body-bg-color);
  min-height: 100vh;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .insights-layout {
    flex-direction: column;
  }
}
</style>