<template>
  <div class="insights-content">
    <!-- Loading State -->
    <div v-if="userStore.generatingPersonalityAnalysis" class="loading-state text-center">
      <div class="spinner-border mb-2" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="text-muted">Generating insights...</p>
    </div>

    <!-- Revelation Content -->
    <div v-else-if="selectedItem?.type === 'revelation'" class="revelation-content">
      <Card class="insights-card" padding="0">
        <!-- Section Header -->
        <div class="section-header mb-3">
          <div class="section-name mb-2">
            <h4 class="section-name-text">{{ currentSection?.title }}</h4>
          </div>
          <h3 class="section-title">
            {{ currentSection?.analysis?.title || 'No Title Available' }}
          </h3>
        </div>

        <!-- Section Content -->
        <div class="section-content mb-4">
          <template v-if="isCurrentSectionLocked">
            <div class="locked-content text-center">
              <i class="bi bi-lock-fill display-4 text-muted mb-3"></i>
              <p class="text-muted">Unlocks in {{ currentSectionUnlocksIn }} quests</p>
            </div>
          </template>
          <template v-else-if="currentSection?.analysis?.details">
            <p class="section-details">
              {{ currentSection.analysis.details }}
            </p>
          </template>
          <template v-else>
            <div class="no-content text-center">
              <i class="bi bi-lightbulb display-1 text-muted mb-3"></i>
              <h4>No Insights Available</h4>
              <p class="text-muted mb-4">
                Generate your insights to get started.
              </p>
              <button 
                @click="generateCluster(currentSection?.id || 'theFlame')" 
                class="btn btn-primary" 
                :disabled="userStore.generatingPersonalityAnalysis"
              >
                <span v-if="userStore.generatingPersonalityAnalysis" class="spinner-border spinner-border-sm me-2"></span>
                Generate Insights
              </button>
            </div>
          </template>
        </div>

        <!-- Re-generate Button - only when current section is unlocked and has content -->
        <div v-if="!isCurrentSectionLocked && currentSection?.analysis?.details" class="regenerate-button-container text-center mt-4 pt-3 border-top">
          <button 
            @click="generateCluster(currentSection?.id || 'theFlame')" 
            class="btn btn-outline-primary" 
            :disabled="userStore.generatingPersonalityAnalysis"
          >
            <span v-if="userStore.generatingPersonalityAnalysis" class="spinner-border spinner-border-sm me-2"></span>
            Re-generate
          </button>
        </div>
      </Card>
    </div>

    <!-- Discovery Content -->
    <div v-else-if="selectedItem?.type === 'discovery'" class="discovery-content">
      <Card class="insights-card" padding="0">
        <div class="discovery-header mb-4">
          <h3 class="discovery-title">{{ selectedAssessment?.name || 'Assessment Details' }}</h3>
          <div class="discovery-score">
            <span class="score-label">Score:</span>
            <span class="score-value">{{ Math.abs(Math.round(selectedAssessment?.score || 0)) }}%</span>
          </div>
        </div>

        <div class="discovery-content-body">
          <!-- Visual Scale Bar -->
          <div class="scale-visual mb-4">
            <div class="scale-labels">
              <span class="negative-label" :class="{ 'label--dominant': (selectedAssessment?.score || 0) < 0 }">
                {{ selectedAssessment?.traits.negative.name }}
              </span>
              <span class="positive-label" :class="{ 'label--dominant': (selectedAssessment?.score || 0) > 0 }">
                {{ selectedAssessment?.traits.positive.name }}
              </span>
            </div>
            <div class="scale-bar">
              <div class="scale-line"></div>
              <!-- Score line from center -->
              <div class="scale-value" :style="{
                width: Math.abs(selectedAssessment?.score || 0) / 2 + '%',
                left: (selectedAssessment?.score || 0) >= 0 ? '50%' : 'auto',
                right: (selectedAssessment?.score || 0) < 0 ? '50%' : 'auto'
              }">
              </div>
              <!-- Score marker -->
              <div class="scale-marker" :style="{ left: calculatePosition(selectedAssessment?.score || 0) + '%' }"
                :title="`Score: ${selectedAssessment?.score || 0}`">
              </div>
            </div>
          </div>

          <!-- Traits Description -->
          <div class="traits-container">
            <div class="trait-description">
              <div class="trait-intensity">
                <template v-if="(selectedAssessment?.score || 0) < 0">
                  You {{ getTraitIntensityText(selectedAssessment?.score || 0) }} {{
                    selectedAssessment?.traits.negative.name.toLowerCase() }}
                </template>
              </div>
              <h4>{{ selectedAssessment?.traits.negative.name }}</h4>
              <p>{{ selectedAssessment?.traits.negative.description }}</p>
              
              <!-- Strength and Blindspot for negative trait -->
              <div class="trait-details">
                <div class="trait-detail-item">
                  <h5 class="trait-detail-label">
                    <i class="bi bi-shield-check me-1"></i>
                    Strength
                  </h5>
                  <p class="trait-detail-text">{{ selectedAssessment?.traits.negative.strength }}</p>
                </div>
                <div class="trait-detail-item">
                  <h5 class="trait-detail-label">
                    <i class="bi bi-eye-slash me-1"></i>
                    Blindspot
                  </h5>
                  <p class="trait-detail-text">{{ selectedAssessment?.traits.negative.blindspot }}</p>
                </div>
              </div>
            </div>
            <div class="trait-description">
              <div class="trait-intensity">
                <template v-if="(selectedAssessment?.score || 0) > 0">
                  You {{ getTraitIntensityText(selectedAssessment?.score || 0) }} {{
                    selectedAssessment?.traits.positive.name.toLowerCase() }}
                </template>
              </div>
              <h4>{{ selectedAssessment?.traits.positive.name }}</h4>
              <p>{{ selectedAssessment?.traits.positive.description }}</p>
              
              <!-- Strength and Blindspot for positive trait -->
              <div class="trait-details">
                <div class="trait-detail-item">
                  <h5 class="trait-detail-label">
                    <i class="bi bi-shield-check me-1"></i>
                    Strength
                  </h5>
                  <p class="trait-detail-text">{{ selectedAssessment?.traits.positive.strength }}</p>
                </div>
                <div class="trait-detail-item">
                  <h5 class="trait-detail-label">
                    <i class="bi bi-eye-slash me-1"></i>
                    Blindspot
                  </h5>
                  <p class="trait-detail-text">{{ selectedAssessment?.traits.positive.blindspot }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="discovery-actions text-center mt-4 pt-3 border-top">
            <button @click="retakeAssessment" class="btn btn-outline-primary">
              <i class="bi bi-arrow-clockwise me-1"></i>
              Retake Assessment
            </button>
          </div>
        </div>
      </Card>
    </div>

    <!-- No Selection State -->
    <div v-else class="no-selection text-center">
      <Card class="insights-card">
        <i class="bi bi-compass display-1 text-muted mb-3"></i>
        <h4>Select a Revelation or Discovery</h4>
        <p class="text-muted">
          Choose an item from the sidebar to view its details.
        </p>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../stores/user';
import { useAssessmentProgress } from '../../composables/useAssessmentProgress';
import Card from '../ui/Card.vue';
import { PERSONALITY_ANALYSIS_SECTIONS, REVELATION_MILESTONES } from '../../../shared/config/personalityAnalysis';
import type { AssessmentWithScore } from '../../../shared/types/shared';

interface Props {
  selectedItem: { type: 'revelation' | 'discovery', id: string } | null;
  completedAssessmentsWithScores: AssessmentWithScore[];
  totalCompletedAssessments: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  generateCluster: [clusterId: string];
}>();

const userStore = useUserStore();
const router = useRouter();
const { getTraitIntensityText, calculatePosition } = useAssessmentProgress();

const currentSection = computed(() => {
  if (props.selectedItem?.type !== 'revelation') return null;
  const section = PERSONALITY_ANALYSIS_SECTIONS.find(s => s.id === props.selectedItem.id);
  if (!section) return null;
  return {
    ...section,
    analysis: userStore.user?.personalityAnalysis?.[section.id]
  };
});

const selectedAssessment = computed(() => {
  if (props.selectedItem?.type !== 'discovery') return null;
  return props.completedAssessmentsWithScores.find(a => a.slug === props.selectedItem.id);
});

const isCurrentSectionLocked = computed(() => {
  const section = currentSection.value;
  if (!section) return false;
  const required = getRequiredAssessmentsForSection(section.id);
  if (required == null) return false;
  return props.totalCompletedAssessments < required;
});

const currentSectionUnlocksIn = computed(() => {
  const section = currentSection.value;
  if (!section) return 0;
  const required = getRequiredAssessmentsForSection(section.id) || 0;
  const remaining = required - props.totalCompletedAssessments;
  return remaining > 0 ? remaining : 0;
});

const getRequiredAssessmentsForSection = (sectionId: string): number | null => {
  const milestone = REVELATION_MILESTONES.find(m => m.key === sectionId);
  return milestone ? milestone.requiredAssessments : null;
};

const generateCluster = (clusterId: string) => {
  emit('generateCluster', clusterId);
};

const retakeAssessment = () => {
  if (selectedAssessment.value) {
    router.push({ name: 'assessment', params: { assessmentSlug: selectedAssessment.value.slug } });
  }
};
</script>

<style scoped>
.insights-content {
  flex: 1;
  padding: 2rem;
}

.loading-state {
  padding: 3rem 0;
  max-width: 400px;
  margin: 0 auto;
}

.insights-card {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.section-header {
  border-bottom: 1px solid var(--card-border-color);
  padding-bottom: 1rem;
}

.section-name-text {
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
  font-size: 1rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.8;
}

.section-title {
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  font-size: 1.5rem;
}

.section-content {
  min-height: 120px;
}

.section-details {
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--text-primary);
}

.locked-content {
  padding: 2rem 0;
}

.no-content {
  padding: 2rem 0;
}

.no-selection {
  padding: 3rem 0;
}

.discovery-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--card-border-color);
  padding-bottom: 1rem;
}

.discovery-title {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.5rem;
}

.discovery-score {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.score-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.score-value {
  font-size: 1.2rem;
  font-weight: bold;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
}

.scale-visual {
  padding: 1rem 0;
}

.scale-labels {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.negative-label,
.positive-label {
  flex: 1;
  color: var(--text-secondary);
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.label--dominant {
  font-weight: bold;
  color: var(--text-primary);
}

.negative-label {
  text-align: left;
}

.positive-label {
  text-align: right;
}

.scale-bar {
  position: relative;
  height: 24px;
}

.scale-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--primary-color);
  transform: translateY(-50%);
}

.scale-line::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  width: 2px;
  height: 0;
  background: var(--text-primary);
  transform: translate(-50%, 0);
}

.scale-value {
  position: absolute;
  top: 50%;
  left: 50%;
  height: 4px;
  background: var(--text-primary);
  transform: translateY(-50%);
}

.scale-marker {
  position: absolute;
  top: 50%;
  width: 12px;
  height: 12px;
  background: var(--text-primary);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.2s ease;
}

.traits-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 1rem;
}

.traits-container > * {
  flex: 1 1 300px;
}

.trait-description {
  margin-top: 1rem;
}

.trait-description h4 {
  font-size: 1rem;
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  margin-top: 0;
}

.trait-description p {
  color: var(--text-secondary);
}

.trait-intensity {
  color: var(--text-primary);
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
  font-style: italic;
  min-height: 1.5rem;
}

.trait-details {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--card-border-color);
}

.trait-detail-item {
  margin-bottom: 1rem;
}

.trait-detail-item:last-child {
  margin-bottom: 0;
}

.trait-detail-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

.trait-detail-label i {
  color: var(--primary-color);
  font-size: 0.9rem;
}

.trait-detail-text {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
}

.regenerate-button-container {
  border-color: var(--primary-color) !important;
}

.discovery-actions {
  border-color: var(--card-border-color) !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .insights-content {
    padding: 1rem;
  }
  
  .insights-card {
    padding: 1rem;
  }
  
  .discovery-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .traits-container {
    flex-direction: column;
    gap: 0;
  }
  
  .traits-container > * {
    flex: none;
  }
}
</style>
