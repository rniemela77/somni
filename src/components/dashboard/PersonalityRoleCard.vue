<template>
  <SectionCard
    title="PERSONA"
    iconClass="bi bi-person"
    border="light"
  >
    <template #content>
      <div class="personality-role-container text-center">
        <!-- Avatar placeholder circle -->
        <div class="avatar-placeholder mb-3">
          <div class="avatar-circle">
            <img src="/images/hooded-portrait.jpg" alt="Personality Role" class="avatar-image">
          </div>
        </div>
        
        <!-- Role name -->
        <div v-if="userStore.user?.personalityAnalysis?.theAwakening?.title" class="role-display">
          <h3 class="role-name mb-2">{{ userStore.user.personalityAnalysis.theAwakening.title }}</h3>
          <p
            v-if="userStore.user?.personalityAnalysis?.theAwakening?.personaQuote"
            class="role-subtitle text-muted mb-3"
          >
            &ldquo;{{ userStore.user.personalityAnalysis.theAwakening.personaQuote }}&rdquo;
          </p>
          
          <!-- Regenerate button, disabled for now -->
          <!-- <button 
            @click="generateAwakening" 
            class="btn btn-sm btn-outline-secondary regenerate-btn mb-3"
            :disabled="userStore.generatingPersonalityAnalysis"
            title="Generate The Awakening"
          >
            <i v-if="userStore.generatingPersonalityAnalysis" class="bi bi-arrow-clockwise spin"></i>
            <i v-else class="bi bi-arrow-clockwise"></i>
          </button> -->
          
          <!-- Dominant traits -->
          <div v-if="dominantTraits.length > 0" class="dominant-traits">
            <h6 class="traits-title mb-2 text-muted d-flex justify-content-between">
              <span>Core Traits</span>
              <span>Intensity</span>
            </h6>
            <div class="traits-list">
              <div 
                v-for="trait in dominantTraits" 
                :key="trait.id" 
                class="trait-item flex-wrap"
              >
                <div class="flex-grow-1 me-2 min-w-0">
                  <span class="trait-name d-block">{{ trait.name }}</span>
                </div>
                <div class="trait-dots">
                  <span 
                    v-for="i in trait.dotCount" 
                    :key="i" 
                    class="dot filled"
                  ></span>
                  <span 
                    v-for="i in (10 - trait.dotCount)" 
                    :key="i + trait.dotCount" 
                    class="dot"
                  ></span>
                </div>
                <div v-if="trait.keywords?.length" class="trait-keywords">
                  <em>
                    <span v-for="(kw, idx) in trait.keywords" :key="kw">
                      {{ kw }}<span v-if="idx < trait.keywords.length - 1">, </span>
                    </span>
                  </em>
                </div>
              </div>
            </div>
            
            <!-- Read More button -->
            <div class="read-more-container mt-3">
              <router-link 
                to="/insights" 
                class="btn btn-sm btn-outline-primary read-more-btn"
              >
                View Full Persona
                <i class="bi bi-arrow-right ms-1"></i>
              </router-link>
            </div>
          </div>
        </div>
        
        <!-- Placeholder when no role yet -->
        <div v-else class="role-placeholder">
          <p class="text-muted mb-2">Complete 3 quests to unlock your mythic identity</p>
          <div class="progress-indicator">
            <span class="badge bg-secondary">{{ completedAssessments }}/3</span>
          </div>
        </div>
      </div>
    </template>
  </SectionCard>
</template>

<script setup lang="ts">
import { computed } from "vue";
import SectionCard from "../ui/SectionCard.vue";
import { useUserStore } from "../../stores/user";
import { useAssessmentProgress } from "../../composables/useAssessmentProgress";

const userStore = useUserStore();
const { totalCompletedAssessments, completedAssessmentsWithScores } = useAssessmentProgress();

const completedAssessments = totalCompletedAssessments;

// Calculate dominant traits for display
const dominantTraits = computed(() => {
  if (!userStore.user?.assessmentScores || !completedAssessmentsWithScores.value.length) {
    return [];
  }

  // Get all traits with their scores
  const traitsWithScores = completedAssessmentsWithScores.value.map(assessment => {
    const score = assessment.score;
    const isPositive = score >= 0;
    const dominantTrait = isPositive ? assessment.traits.positive : assessment.traits.negative;
    const absScore = Math.abs(score);
    
    // Use the new label system
    const label = isPositive ? assessment.positive_label : assessment.negative_label;
    
    return {
      id: assessment.id,
      name: label || dominantTrait.name, // Fallback to trait name if label not available
      keywords: dominantTrait.keywords || [],
      score: absScore,
      dotCount: Math.ceil(absScore / 10) // Convert to dots (0-100 score becomes 0-10 dots)
    };
  });

  // Sort by score (highest first) and take top 3
  return traitsWithScores
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
});
</script>

<style scoped>
.avatar-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2c3e50, #34495e);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 3px solid var(--bs-primary);
  position: relative;
  overflow: hidden;
  box-shadow: 0 3px 20px var(--primary-color);
}

.avatar-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  user-select: none;
  pointer-events: none;
  filter: brightness(1.2) saturate(27) hue-rotate(223deg);
}

.role-display {
  animation: fadeInUp 0.6s ease-out;
}

.role-name {
  font-family: 'Cinzel', serif;
  font-weight: 600;
  color: var(--text-primary);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  margin: 0;
  text-align: center;
}

.regenerate-btn {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  border: 1px solid var(--bs-gray-400);
  background: transparent;
  margin: 0 auto;
  font-size: 0.8rem;
}

.regenerate-btn:hover:not(:disabled) {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
  color: white;
  transform: scale(1.05);
}

.regenerate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.role-subtitle {
  font-size: 0.85rem;
  font-style: italic;
}

.role-placeholder {
  animation: fadeIn 0.4s ease-out;
}

.progress-indicator {
  margin-top: 0.5rem;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Dominant traits styling */
.dominant-traits {
  margin-top: 1rem;
  text-align: left;
}

.traits-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.75rem;
}

.traits-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.trait-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 0.75rem;
  row-gap: 0.2rem;
}

.trait-keywords {
  width: 100%;
  font-size: 0.8rem;
  font-style: italic;
  color: var(--text-primary);
}

.trait-name {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--body-text-color);
  flex-shrink: 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.trait-dots {
  display: flex;
  gap: 0.25rem;
  flex-shrink: 0;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  border: 1px solid var(--primary-color);
  opacity: 0.5;
  transition: all 0.2s ease;
}

.dot.filled {
  background-color: var(--text-primary);
  box-shadow: 0 0 4px rgba(var(--bs-primary-rgb), 1);
  filter: brightness(1.9);
  opacity: 1;
}

/* Read More button styling */
.read-more-container {
  text-align: center;
  padding-top: 0.5rem;
}

.read-more-btn {
  font-size: 0.8rem;
  padding: 0.4rem 1rem;
  border-radius: 1rem;
  transition: all 0.2s ease;
}

.read-more-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
