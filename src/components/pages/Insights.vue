<template>
  <div class="container-fluid py-4">
    <!-- Toggle Switch -->
    <div class="d-flex justify-content-center mb-5">
      <ToggleSwitch
        v-model="showRevelations"
        left-label="Discoveries"
        right-label="Revelations"
      />
    </div>

    <!-- Content Area -->
    <div class="row justify-content-center">
      <div class="col-12 col-lg-8">
        <!-- Loading State -->
        <div v-if="userStore.generatingPersonalityAnalysis" class="text-center py-5">
          <div class="spinner-border mb-2" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="text-muted">Generating insights...</p>
        </div>

        <!-- Revelations Accordion -->
        <div v-else-if="showRevelations">
          <div class="text-center mb-4">
            <h2 class="h3 fw-bold text-cinzel">REVELATIONS</h2>
            <p class="text-muted">Your archetypal journey</p>
          </div>
          
          <div class="mb-4">
            <Accordion
              v-for="section in allSections"
              :key="section.id"
              :title="section.title"
              :subtitle="section.description"
              :badge="isSectionLocked(section.id) ? `Unlocks in ${getUnlocksIn(section.id)} quest${getUnlocksIn(section.id) === 1 ? '' : 's'}` : undefined"
              :disabled="isSectionLocked(section.id)"
              v-model="expandedRevelations[section.id]"
            >
              <RevelationContent
                :section="section"
                :isLocked="isSectionLocked(section.id)"
                :unlocksIn="getUnlocksIn(section.id)"
                :analysis="userStore.user?.personalityAnalysis?.[section.id]"
                @generateCluster="generateCluster"
              />
            </Accordion>
          </div>
        </div>

        <!-- Discoveries List -->
        <div v-else-if="!showDiscoveryDetail">
          <div class="text-center mb-4">
            <h2 class="h3 fw-bold text-cinzel">DISCOVERIES</h2>
            <p class="text-muted">Your unique traits</p>
          </div>
          
          <Card v-if="completedAssessmentsWithScores.length === 0" class="text-center">
            <i class="bi bi-compass display-1 text-muted mb-3"></i>
            <h4>No Discoveries Yet</h4>
            <p class="text-muted">Complete quests to unlock discoveries.</p>
          </Card>
          
          <div v-else class="mb-4">
            <!-- Discovery Buttons -->
            <div class="discovery-buttons">
              <button
                v-for="assessment in completedAssessmentsWithScores"
                :key="assessment.slug"
                @click="selectDiscovery(assessment)"
                class="discovery-button"
              >
                <div class="discovery-button__content">
                  <div class="discovery-button__info">
                    <h4 class="discovery-button__title">{{ getTraitDisplayName(assessment) }}</h4>
                    <p class="discovery-button__subtitle">{{ assessment.displayName }}</p>
                  </div>
                  <div class="discovery-button__badge">
                    <span class="badge bg-primary">{{ Math.abs(Math.round(assessment.score)) }}%</span>
                    <i class="bi bi-chevron-right discovery-button__arrow"></i>
                  </div>
                </div>
              </button>
            </div>
            
            <!-- Progress Message -->
            <p v-if="completedAssessmentsWithScores.length < 20" class="text-center text-muted small mt-3">
              Complete more assessments to unlock additional discoveries.
            </p>
          </div>
        </div>

        <!-- Discovery Detail View -->
        <div v-else-if="showDiscoveryDetail && selectedDiscovery">
          <button @click="goBackToDiscoveries" class="btn btn-outline-secondary mb-3">
            <i class="bi bi-arrow-left me-2"></i>
            Back to Discoveries
          </button>
          
          <Card>
            <div class="mb-4">
              <h2 class="h3 fw-bold mb-0">{{ getTraitDisplayName(selectedDiscovery) }}</h2>
              <p class="text-muted mb-0">{{ selectedDiscovery.displayName }}</p>
            </div>
            
            <DiscoveryContent
              :assessment="selectedDiscovery"
              @retakeAssessment="retakeAssessment"
            />
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../stores/user';
import { useAssessmentProgress } from '../../composables/useAssessmentProgress';
import { PERSONALITY_ANALYSIS_SECTIONS, REVELATION_MILESTONES } from '../../../shared/config/personalityAnalysis';
import ToggleSwitch from '../ui/ToggleSwitch.vue';
import Accordion from '../ui/Accordion.vue';
import RevelationContent from '../insights/RevelationContent.vue';
import DiscoveryContent from '../insights/DiscoveryContent.vue';
import type { AssessmentWithScore } from '../../../shared/types/shared';
import Card from '../ui/Card.vue';

// Store and state
const userStore = useUserStore();
const router = useRouter();
const { totalCompletedAssessments, completedAssessmentsWithScores, getDominantTrait } = useAssessmentProgress();

// Toggle state - no URL routing
const showRevelations = ref(false);

// Discovery view state
const selectedDiscovery = ref<AssessmentWithScore | null>(null);
const showDiscoveryDetail = ref(false);

// Accordion expansion states for revelations
const expandedRevelations = reactive<Record<string, boolean>>({});

// Computed properties
const allSections = computed(() => PERSONALITY_ANALYSIS_SECTIONS);

// Function to get display name with both label and trait name
const getTraitDisplayName = (assessment: AssessmentWithScore): string => {
  const dominantTrait = getDominantTrait(assessment);
  const isPositive = assessment.score >= 0;
  const label = isPositive ? assessment.positive_label : assessment.negative_label;
  
  if (label) {
    return `${label} (${dominantTrait.name})`;
  }
  
  return dominantTrait.name;
};

const isSectionLocked = (sectionId: string): boolean => {
  const milestone = REVELATION_MILESTONES.find((m) => m.key === sectionId);
  if (!milestone) return false;
  return totalCompletedAssessments.value < milestone.requiredAssessments;
};

const getUnlocksIn = (sectionId: string): number => {
  const milestone = REVELATION_MILESTONES.find((m) => m.key === sectionId);
  if (!milestone) return 0;
  const remaining = milestone.requiredAssessments - totalCompletedAssessments.value;
  return remaining > 0 ? remaining : 0;
};

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

const retakeAssessment = (assessment: AssessmentWithScore) => {
  router.push({ name: 'assessment', params: { assessmentSlug: assessment.slug } });
};

// Select discovery for detail view
const selectDiscovery = (assessment: AssessmentWithScore) => {
  selectedDiscovery.value = assessment;
  showDiscoveryDetail.value = true;
};

// Go back to discoveries list
const goBackToDiscoveries = () => {
  showDiscoveryDetail.value = false;
  selectedDiscovery.value = null;
};
</script>

<style scoped>
/* Discovery Buttons */
.discovery-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.discovery-button {
  width: 100%;
  padding: 1rem 1.5rem;
  background: var(--card-bg-color);
  border: 1px solid var(--primary-color-lighter);
  border-radius: 0.75rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.discovery-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(95, 85, 238, 0.15);
  filter: brightness(1.5);
}

.discovery-button--active {
  background: var(--primary-color-lightest);
  border-color: var(--primary-color);
  box-shadow: 0 2px 6px rgba(95, 85, 238, 0.2);
}

.discovery-button__content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.discovery-button__info {
  flex: 1;
  min-width: 0;
}

.discovery-button__title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.discovery-button__subtitle {
  font-size: 0.9rem;
  color: var(--neutral-color);
  margin: 0;
}

.discovery-button__badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-left: 1rem;
}

.discovery-button__arrow {
  font-size: 1rem;
  color: var(--primary-color);
  transition: transform 0.3s ease;
}

.discovery-button:hover .discovery-button__arrow {
  transform: translateX(3px);
}
</style>