<template>
  <!-- Desktop Sidebar -->
  <div class="insights-sidebar d-none d-md-block">
    <div class="sidebar-content">
      <!-- Revelations Section -->
      <div class="sidebar-section">
        <h3 class="section-label text-primary">
          <span class="d-block text-uppercase">REVELATIONS</span>
          <i
            style="font-size: 0.75rem"
            class="text-muted fw-light pt-1 pl-1 d-block"
            >Your archetypal journey</i
          >
        </h3>
        <div class="nav-items">
          <button
            v-for="section in allSections"
            :key="section.id"
            @click="selectRevelation(section.id)"
            class="nav-item"
            :class="{
              'nav-item--active':
                selectedItem?.type === 'revelation' &&
                selectedItem?.id === section.id,
              'nav-item--locked': isSectionLocked(section.id),
            }"
            :disabled="isSectionLocked(section.id)"
          >
            <div class="nav-item-content">
              <span class="nav-item-title">{{ section.title }}</span>
              <span v-if="isSectionLocked(section.id)" class="nav-item-lock">
                <i class="bi bi-lock-fill"></i>
              </span>
            </div>
          </button>
        </div>
      </div>

      <!-- Discoveries Section -->
      <div
        class="sidebar-section"
        v-if="completedAssessmentsWithScores.length > 0"
      >
        <h3 class="section-label text-primary">
          <span class="d-block text-uppercase">DISCOVERIES</span>
          <i
            style="font-size: 0.75rem"
            class="text-muted fw-light pt-1 pl-1 d-block"
            >Your unique traits</i
          >
        </h3>
        <div class="nav-items">
          <button
            v-for="assessment in completedAssessmentsWithScores"
            :key="assessment.slug"
            @click="selectDiscovery(assessment.slug)"
            class="nav-item"
            :class="{
              'nav-item--active':
                selectedItem?.type === 'discovery' &&
                selectedItem?.id === assessment.slug,
            }"
          >
            <div class="nav-item-content">
              <span class="nav-item-title">{{
                getTraitDisplayName(assessment)
              }}</span>
              <span class="nav-item-score"
                >{{ Math.abs(Math.round(assessment.score)) }}%</span
              >
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile Dropdown Menu -->
  <div class="mobile-menu d-md-none">
    <!-- Mobile Menu Toggle Button -->
    <div class="mobile-menu-header">
      <button 
        @click="toggleMobileMenu" 
        class="mobile-menu-toggle btn btn-outline-primary w-100 d-flex justify-content-between align-items-center"
      >
        <span class="mobile-menu-title">
          <i class="bi bi-list me-2"></i>
          {{ getCurrentSelectionTitle() }}
        </span>
        <i class="bi bi-chevron-down" :class="{ 'rotate-180': isMobileMenuOpen }"></i>
      </button>
    </div>

    <!-- Mobile Menu Dropdown -->
    <div class="mobile-menu-dropdown" :class="{ 'show': isMobileMenuOpen }">
      <div class="mobile-menu-content">
        <!-- Revelations Section -->
        <div class="mobile-section">
          <h4 class="mobile-section-label text-primary">
            <span class="d-block text-uppercase">REVELATIONS</span>
            <small class="text-muted fw-light">Your archetypal journey</small>
          </h4>
          <div class="mobile-nav-items">
            <button
              v-for="section in allSections"
              :key="section.id"
              @click="selectRevelation(section.id); closeMobileMenu()"
              class="mobile-nav-item"
              :class="{
                'mobile-nav-item--active':
                  selectedItem?.type === 'revelation' &&
                  selectedItem?.id === section.id,
                'mobile-nav-item--locked': isSectionLocked(section.id),
              }"
              :disabled="isSectionLocked(section.id)"
            >
              <div class="mobile-nav-item-content">
                <span class="mobile-nav-item-title">{{ section.title }}</span>
                <span v-if="isSectionLocked(section.id)" class="mobile-nav-item-lock">
                  <i class="bi bi-lock-fill"></i>
                </span>
              </div>
            </button>
          </div>
        </div>

        <!-- Discoveries Section -->
        <div class="mobile-section" v-if="completedAssessmentsWithScores.length > 0">
          <h4 class="mobile-section-label text-primary">
            <span class="d-block text-uppercase">DISCOVERIES</span>
            <small class="text-muted fw-light">Your unique traits</small>
          </h4>
          <div class="mobile-nav-items">
            <button
              v-for="assessment in completedAssessmentsWithScores"
              :key="assessment.slug"
              @click="selectDiscovery(assessment.slug); closeMobileMenu()"
              class="mobile-nav-item"
              :class="{
                'mobile-nav-item--active':
                  selectedItem?.type === 'discovery' &&
                  selectedItem?.id === assessment.slug,
              }"
            >
              <div class="mobile-nav-item-content">
                <span class="mobile-nav-item-title">{{
                  getTraitDisplayName(assessment)
                }}</span>
                <span class="mobile-nav-item-score"
                  >{{ Math.abs(Math.round(assessment.score)) }}%</span
                >
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import {
  PERSONALITY_ANALYSIS_SECTIONS,
  REVELATION_MILESTONES,
} from "../../../shared/config/personalityAnalysis";
import { useAssessmentProgress } from "../../composables/useAssessmentProgress";
import type { AssessmentWithScore } from "../../../shared/types/shared";

interface Props {
  selectedItem: { type: "revelation" | "discovery"; id: string } | null;
  completedAssessmentsWithScores: AssessmentWithScore[];
  totalCompletedAssessments: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  selectRevelation: [sectionId: string];
  selectDiscovery: [assessmentSlug: string];
}>();

const { getDominantTrait } = useAssessmentProgress();

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

// Mobile menu state
const isMobileMenuOpen = ref(false);

const allSections = computed(() => PERSONALITY_ANALYSIS_SECTIONS);

const isSectionLocked = (sectionId: string): boolean => {
  const milestone = REVELATION_MILESTONES.find((m) => m.key === sectionId);
  if (!milestone) return false;
  return props.totalCompletedAssessments < milestone.requiredAssessments;
};

const selectRevelation = (sectionId: string) => {
  emit("selectRevelation", sectionId);
};

const selectDiscovery = (assessmentSlug: string) => {
  emit("selectDiscovery", assessmentSlug);
};

// Mobile menu functions
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const getCurrentSelectionTitle = () => {
  if (!props.selectedItem) return "Select an item";
  
  if (props.selectedItem.type === "revelation") {
    const section = allSections.value.find(s => s.id === props.selectedItem!.id);
    return section?.title || "Revelation";
  } else {
    const assessment = props.completedAssessmentsWithScores.find(a => a.slug === props.selectedItem!.id);
    return assessment ? getTraitDisplayName(assessment) : "Discovery";
  }
};
</script>

<style scoped>
.insights-sidebar {
  width: 300px;
  background: var(--card-bg-color);
  border-right: 1px solid var(--card-border-color);
  position: sticky;
  top: 0;
  align-self: flex-start;
}

.sidebar-content {
  padding: 1.5rem 0;
}

.sidebar-section {
  margin-bottom: 2rem;
}

.section-label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 1px;
  color: var(--body-text-color);
  margin: 0 1.5rem 1rem 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--card-border-color);
}

.nav-items {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-item {
  width: 100%;
  padding: 0.75rem 1.5rem;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.nav-item:hover:not(:disabled) {
  background: var(--primary-color);
  color: white;
  border-left-color: var(--primary-color);
}

.nav-item--active {
  background: var(--primary-color);
  color: white;
  border-left-color: var(--primary-color);
}

.nav-item--locked {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.nav-item-title {
  font-weight: 500;
  font-size: 0.9rem;
  color: var(--body-text-color);
  flex: 1;
  text-align: left;
}

.nav-item-score {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  margin-left: 0.5rem;
}

.nav-item-lock {
  font-size: 0.8rem;
  margin-left: 0.5rem;
}

/* Mobile Menu Styles */
.mobile-menu {
  position: relative;
  z-index: 1000;
}

.mobile-menu-header {
  position: sticky;
  top: 0;
  z-index: 1001;
  background: var(--body-bg-color);
  padding: 1rem;
  border-bottom: 1px solid var(--card-border-color);
}

.mobile-menu-toggle {
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  border-radius: 0.5rem;
}

.mobile-menu-title {
  font-weight: 500;
  color: var(--body-text-color);
}

.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.2s ease;
}

.mobile-menu-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--card-bg-color);
  border: 1px solid var(--card-border-color);
  border-top: none;
  border-radius: 0 0 0.5rem 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(8px);
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 1000;
}

.mobile-menu-dropdown.show {
  max-height: 70vh;
  opacity: 1;
  overflow-y: auto;
}

.mobile-menu-content {
  padding: 1rem;
}

.mobile-section {
  margin-bottom: 1.5rem;
}

.mobile-section:last-child {
  margin-bottom: 0;
}

.mobile-section-label {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 1px;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--card-border-color);
}

.mobile-nav-items {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.mobile-nav-item {
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 0.375rem;
  border-left: 3px solid transparent;
}

.mobile-nav-item:hover:not(:disabled) {
  background: var(--primary-color);
  color: white;
  border-left-color: var(--primary-color);
}

.mobile-nav-item--active {
  background: var(--primary-color);
  color: white;
  border-left-color: var(--primary-color);
}

.mobile-nav-item--locked {
  opacity: 0.5;
  cursor: not-allowed;
}

.mobile-nav-item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.mobile-nav-item-title {
  font-weight: 500;
  font-size: 0.9rem;
  color: var(--body-text-color);
  flex: 1;
  text-align: left;
}

.mobile-nav-item-score {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  margin-left: 0.5rem;
}

.mobile-nav-item-lock {
  font-size: 0.8rem;
  margin-left: 0.5rem;
}

/* Override text colors for active/hover states */
.mobile-nav-item--active .mobile-nav-item-title,
.mobile-nav-item:hover:not(:disabled) .mobile-nav-item-title {
  color: white;
}

.mobile-nav-item--active .mobile-nav-item-score,
.mobile-nav-item:hover:not(:disabled) .mobile-nav-item-score {
  color: white;
  background: rgba(255, 255, 255, 0.3);
}
</style>
