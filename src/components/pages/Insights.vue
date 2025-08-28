<template>
  <div class="container">
    <h2 class="m-0 text-cinzel page-title">REVELATIONS</h2>

    <p>
      <i class="text-primary mb-5">Your unique insights to your personality</i>
    </p>

    <!-- Section Navigation (one button per section) -->
    <div class="category-nav mb-4">
      <div class="btn-group" role="group">
        <button
          v-for="section in allSections"
          :key="section.id"
          @click="selectSection(section.id)"
          class="btn"
          :class="(currentSection && currentSection.id === section.id) ? 'btn-primary' : 'btn-outline-primary'"
        >
          {{ section.title }}
        </button>
      </div>
    </div>

    <!-- Generate Button - Only shown when no insights available -->
    <div v-if="!hasCategoryContent && !userStore.generatingPersonalityAnalysis" class="generate-button-container text-center mb-4">
      <button 
        @click="generateCluster(currentSection?.id || 'theFlame')" 
        class="btn btn-primary btn-lg" 
        :disabled="userStore.generatingPersonalityAnalysis"
      >
        <span v-if="userStore.generatingPersonalityAnalysis" class="spinner-border spinner-border-sm me-2"></span>
        Generate Insights
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="userStore.generatingPersonalityAnalysis" class="loading-state text-center">
      <div class="spinner-border mb-2" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="text-muted">Generating insights...</p>
    </div>

    <!-- Content Slider -->
    <div v-if="hasCategoryContent" class="content-slider">
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
            <p class="text-muted">Unlocks in {{ currentSectionUnlocksIn }} quests</p>
          </template>
          <template v-else>
            <p v-if="currentSection?.analysis?.details" class="section-details">
              {{ currentSection.analysis.details }}
            </p>
            <p v-else class="text-muted">
              No details available for this section.
            </p>
          </template>
        </div>

        <!-- Navigation Controls -->
          <div class="section-meta">
            <span class="section-counter">{{ currentSlideIndex + 1 }} / {{ availableSections.length }}</span>
          </div>
          
        <div class="navigation-controls d-flex justify-content-between align-items-center">
          <button 
            @click="previousSection" 
            class="btn btn-outline-primary"
            :disabled="currentSlideIndex === 0"
          >
            <i class="bi bi-chevron-left me-1"></i>
            Previous
          </button>
          
          <div class="slide-indicators">
            <span 
              v-for="(_, index) in availableSections" 
              :key="index"
              @click="goToSection(index)"
              class="indicator"
              :class="{ active: index === currentSlideIndex }"
            ></span>
          </div>
          
          <button 
            @click="nextSection" 
            class="btn btn-outline-primary"
            :disabled="currentSlideIndex === availableSections.length - 1"
          >
            Next
            <i class="bi bi-chevron-right ms-1"></i>
          </button>
        </div>

        <!-- Re-generate Button - only when current section is unlocked -->
        <div v-if="!isCurrentSectionLocked" class="regenerate-button-container text-center mt-4 pt-3 border-top">
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

    <!-- No Content Message -->
    <div v-else-if="!userStore.generatingPersonalityAnalysis" class="no-content">
      <Card class="text-center">
        <i class="bi bi-lightbulb display-1 text-muted mb-3"></i>
        <h4>No Insights Available</h4>
        <p class="text-muted">
          Generate your insights to get started.
        </p>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useUserStore } from '../../stores/user';
import Card from '../ui/Card.vue';
import { PERSONALITY_ANALYSIS_SECTIONS, REVELATION_MILESTONES } from '../../../shared/config/personalityAnalysis';
import { useAssessmentProgress } from '../../composables/useAssessmentProgress';

// Store and state
const userStore = useUserStore();
// Category is unused for navigation now, but kept for display text
const currentCategory = ref<string>('originRealm');
const currentSlideIndex = ref(0);
const { totalCompletedAssessments } = useAssessmentProgress();

// Flat list of all sections for navigation
const allSections = computed(() => Object.values(PERSONALITY_ANALYSIS_SECTIONS));


// Computed properties for better organization

const availableSections = computed(() => {
  // Flat list in the same order as the button group
  return Object.values(PERSONALITY_ANALYSIS_SECTIONS).map(section => ({
    ...section,
    analysis: userStore.user?.personalityAnalysis?.[section.id]
  }));
});

const hasCategoryContent = computed(() => {
  return availableSections.value.length > 0;
});

const currentSection = computed(() => {
  if (!hasCategoryContent.value || currentSlideIndex.value >= availableSections.value.length) {
    return null;
  }
  return availableSections.value[currentSlideIndex.value];
});

const generateCluster = async (cluster: string) => {
  try {
    const { success, error: analysisError } = await userStore.generatePersonalityAnalysisForCluster(cluster);

    if (!success) {
      throw new Error(analysisError || 'Failed to generate personality analysis');
    }
  } catch (err) {
    console.error("Exception in generateDescription:", err);
  }
};

// Select a section from the navigation
const selectSection = (sectionId: string) => {
  const section = (PERSONALITY_ANALYSIS_SECTIONS as any)[sectionId];
  if (!section) return;
  // Find index in the flat list
  const indexInAvailable = availableSections.value.findIndex((s: any) => s.id === sectionId);
  currentSlideIndex.value = indexInAvailable >= 0 ? indexInAvailable : 0;
};

// Unlock logic for current section
const getRequiredAssessmentsForSection = (sectionId: string): number | null => {
  const milestone = REVELATION_MILESTONES.find(m => m.key === sectionId);
  return milestone ? milestone.requiredAssessments : null;
};

const isCurrentSectionLocked = computed(() => {
  const section = currentSection.value as any;
  if (!section) return false;
  const required = getRequiredAssessmentsForSection(section.id);
  if (required == null) return false;
  return totalCompletedAssessments.value < required;
});

const currentSectionUnlocksIn = computed(() => {
  const section = currentSection.value as any;
  if (!section) return 0;
  const required = getRequiredAssessmentsForSection(section.id) || 0;
  const remaining = required - totalCompletedAssessments.value;
  return remaining > 0 ? remaining : 0;
});

// Navigation methods
const nextSection = () => {
  if (currentSlideIndex.value < availableSections.value.length - 1) {
    currentSlideIndex.value++;
  }
};

const previousSection = () => {
  if (currentSlideIndex.value > 0) {
    currentSlideIndex.value--;
  }
};

const goToSection = (index: number) => {
  if (index >= 0 && index < availableSections.value.length) {
    currentSlideIndex.value = index;
  }
};

// Reset slide index when category changes
watch(currentCategory, () => {
  currentSlideIndex.value = 0;
});
</script>

<style scoped>
.container {
  position: relative;
}

.category-nav {
  display: flex;
  justify-content: center;
}

.category-description {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.loading-state {
  padding: 3rem 0;
  max-width: 400px;
  margin: 0 auto;
}

.content-slider {
  max-width: 800px;
  margin: 0 auto;
}

.insights-card {
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

.section-meta {
  display: flex;
  justify-content: center;
  font-size: 0.9rem;
}

.section-category {
  color: var(--text-secondary);
  font-weight: 500;
}

.section-counter {
  color: var(--text-muted);
  background: var(--card-bg-color);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.section-content {
  min-height: 120px;
}

.section-details {
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--text-primary);
}

.slide-indicators {
  display: flex;
  gap: 0.5rem;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--primary-color);
  opacity: 0.3;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

@media screen and (max-width: 500px) {
  .slide-indicators {
    display: none;
  }
  .navigation-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    .btn {
      padding: 1rem 0.5rem;
      flex: 1;
    }
  }
}

.indicator.active {
  opacity: 1;
}

.indicator:hover {
  background: var(--primary-color);
  opacity: 0.7;
}

.no-content {
  max-width: 500px;
  margin: 0 auto;
}

.no-content i {
  color: var(--text-muted);
}

.generate-button-container {
  padding: 2rem 0;
}

.generate-button-container .btn {
  min-width: 200px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
}

.regenerate-button-container {
  border-color: var(--primary-color)!important;
}

/* Responsive adjustments */
.btn-group {
  flex-wrap: wrap;
  border-radius: 0!important;
  
  .btn {
    /* flex: 0; */
    border-radius: 0!important;
  }
}
@media (max-width: 500px) {
  /* .category-nav .btn-group {
    flex-direction: column;
    width: 100%;
  }
  
  .category-nav .btn {
    border-radius: 0.375rem !important;
    margin-bottom: 0.5rem;
  }
  
  .insights-card {
    padding: 1rem;
  }
  
  .section-meta {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  } */
}
</style>