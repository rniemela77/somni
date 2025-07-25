<template>
  <div>
    <!-- Completed Quizzes Section -->
    <Card v-if="completedScales.length > 0" class="quiz-section">
      <h3 class="section-title">Completed Assessments</h3>
      <div class="completed-scales-container">
        <Card v-for="scale in completedScales" :key="scale.id" class="scale-item" padding="0">
          <button class="scale-header btn btn-outline-secondary" @click="toggleScale(scale.id)">
            <div class="scale-header-content">
              <div class="scale-title">
                <span class="dominant-trait">{{ getDominantTraitName(scale) }}</span>
                <span class="score-display">{{ Math.abs(Math.round(getScoreForScale(scale, props.scores))) }}%</span>
              </div>
            </div>
            <div class="chevron" :class="{ 'chevron--expanded': expandedScales.has(scale.id) }"></div>
          </button>
          <div class="scale-content" :class="{ 'scale-content-hidden': !expandedScales.has(scale.id) }">
            <!-- Visual Scale Bar -->
            <div class="scale-visual" padding="sm">
              <div class="scale-labels">
                <span class="negative-label"
                  :class="{ 'label--dominant': getScoreForScale(scale, props.scores) < 0 }">{{ scale.negative }}</span>
                <span class="positive-label"
                  :class="{ 'label--dominant': getScoreForScale(scale, props.scores) > 0 }">{{ scale.positive }}</span>
              </div>
              <div class="scale-bar">
                <div class="scale-line"></div>
                <!-- Score line from center -->
                <div class="scale-value" :style="{
                  width: Math.abs(getScoreForScale(scale, props.scores)) / 2 + '%',
                  left: getScoreForScale(scale, props.scores) >= 0 ? '50%' : 'auto',
                  right: getScoreForScale(scale, props.scores) < 0 ? '50%' : 'auto'
                }">
                </div>
                <!-- Score marker -->
                <div class="scale-marker"
                  :style="{ left: calculatePosition(getScoreForScale(scale, props.scores)) + '%' }"
                  :title="`Score: ${Math.round(getScoreForScale(scale, props.scores))}`">
                </div>
              </div>
            </div>

            <div class="traits-container">
              <div class="trait-description">
                <div class="trait-intensity">
                  <template v-if="getScoreForScale(scale, props.scores) < 0">
                    User {{ getTraitIntensityText(getScoreForScale(scale, props.scores)) }} {{
                      scale.negative.toLowerCase() }}
                  </template>
                </div>
                <h4>{{ scale.negative }}</h4>
                <p>{{ getTraitDescription(scale, 'negative') }}</p>
              </div>
              <div class="trait-description">
                <div class="trait-intensity">
                  <template v-if="getScoreForScale(scale, props.scores) > 0">
                    User {{ getTraitIntensityText(getScoreForScale(scale, props.scores)) }} {{
                      scale.positive.toLowerCase() }}
                  </template>
                </div>
                <h4>{{ scale.positive }}</h4>
                <p>{{ getTraitDescription(scale, 'positive') }}</p>
              </div>
            </div>

            <!-- Retake Quiz button for completed scales -->
            <div class="d-flex justify-content-center">
              <button @click="openAssessment(scale)" class="btn btn-outline-primary btn-sm">
                <i class="bi bi-arrow-clockwise me-1"></i>
                Retake Assessment
              </button>
            </div>
          </div>
        </Card>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { usePersonalityTraits } from '../../composables/usePersonalityTraits';
import type { ExtendedPersonalityScale } from '../../composables/usePersonalityTraits';
import Card from '../ui/Card.vue';

interface Props {
  scores: Record<string, number>;
}

const props = defineProps<Props>();
const router = useRouter();
const expandedScales = ref<Set<string>>(new Set());
const { getAllScales, getScoreForScale, getTraitIntensityText, getTraitDescription } = usePersonalityTraits();

const completedScales = computed(() => {
  return getAllScales().filter(scale => {
    const hasQuestions = scale.questions && scale.questions.length > 0;
    const isComplete = props.scores[scale.id] !== undefined;
    return hasQuestions && isComplete;
  });
});

const toggleScale = (scaleId: string) => {
  if (expandedScales.value.has(scaleId)) {
    expandedScales.value.delete(scaleId);
  } else {
    expandedScales.value.add(scaleId);
  }
  expandedScales.value = new Set(expandedScales.value);
};

const openAssessment = (scale: ExtendedPersonalityScale) => {
  router.push({ name: 'assessment', params: { scaleId: scale.id } });
};

const calculatePosition = (score: number): number => {
  return ((score + 100) / 2);
};

const getDominantTraitName = (scale: ExtendedPersonalityScale): string => {
  const score = getScoreForScale(scale, props.scores);
  if (score === 0) {
    return `${scale.negative}/${scale.positive}`;
  }
  return score < 0 ? scale.negative : scale.positive;
};
</script>

<style scoped>
.featured-assessment-container {
  margin-bottom: 2rem;
}

.remaining-assessments {
  margin-top: 1rem;
}

.collapse {
  transition: all 0.3s ease;
}

.scales-container {
  display: flex;
  flex-direction: column;
  gap: clamp(2rem, 3vw, 3rem);
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: left;
}

.incomplete-scales-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.completed-scales-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.scale-item {
  width: 100%;
  min-width: 0;
  overflow: hidden;
  transition: all 0.2s ease;
}

.scale-header {
  width: 100%;
  padding: 1rem;
  cursor: pointer;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.scale-header .chevron {
  border-color: var(--body-text-color-medium);
}

.scale-header-content {
  flex: 1;
}

.scale-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dominant-trait {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--body-text-color);
}

.scale-visual {
  padding-top: 2rem;
}

.score-display {
  font-size: 1rem;
  font-weight: bold;
  color: var(--body-text-color);
  background: var(--text-primary-bg);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
}

.scale-content {
  display: flex;
  flex-direction: column;
  padding: 0 1rem 1rem 1rem;
  max-height: 700px;
  opacity: 1;
  overflow: hidden;
  transition: max-height 0.3s ease-out, opacity 0.3s ease-out, padding 0.3s ease-out;
}

@media (max-width: 768px) {
  .scale-content {
    max-height: 1000px;
  }
}

.traits-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 1rem;
}

.traits-container>* {
  flex: 1 1 300px;
}

.scale-content-hidden {
  max-height: 0;
  opacity: 0;
  padding: 0 1rem;
}

.trait-description {
  margin-top: 1rem;
}

.trait-description h4 {
  font-size: 1rem;
  font-weight: bold;
  color: var(--body-text-color);
  margin-bottom: 0.5rem;
  margin-top: 0;
}

.trait-description p {
  color: var(--body-text-color-medium);
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
  color: var(--body-text-color-medium);
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.label--dominant {
  font-weight: bold;
  color: var(--body-text-color);
}

.negative-label {
  text-align: left;
}

.positive-label {
  text-align: right;
}

.score {
  font-weight: bold;
  color: var(--primary-color);
  font-size: 0.8rem;
  text-align: center;
  flex-shrink: 0;
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
  height: 2px;
  background: rgba(0,0,0, 0.2);
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

.scale-marker:hover {
  transform: translate(-50%, -50%) scale(1.2);
}

.trait-intensity {
  color: var(--text-primary);
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
  font-style: italic;
  min-height: 1.5rem;
}

.chevron {
  width: 12px;
  height: 12px;
  border-right: 2px solid #5d5d5d;
  border-bottom: 2px solid #5d5d5d;
  transform: rotate(45deg);
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.chevron--expanded {
  transform: rotate(225deg);
}
</style>