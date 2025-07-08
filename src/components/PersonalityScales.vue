<template>
  <div>
    <div class="scales-container">
      <div v-for="scale in availableScales" :key="scale.id" class="scale-item">
        <button class="scale-header" @click="toggleScale(scale.id)">
          <div class="scale-labels">
            <span class="negative-label" :class="{ 'label--dominant': getScoreForScale(scale, props.scores) < 0 }">{{ scale.negative }}</span>
            <span class="score">{{ Math.round(getScoreForScale(scale, props.scores)) }}</span>
            <span class="positive-label" :class="{ 'label--dominant': getScoreForScale(scale, props.scores) > 0 }">{{ scale.positive }}</span>
          </div>
          <div class="scale-bar">
            <div class="scale-line"></div>
            <!-- Score line from center -->
            <div class="scale-value" 
                 :style="{ 
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
        </button>
        <div class="scale-content" :class="{ 'scale-content-hidden': !expandedScales.has(scale.id) }">
          <div class="trait-description">
            <div class="trait-intensity">
              <template v-if="getScoreForScale(scale, props.scores) < 0">
                User {{ getTraitIntensityText(getScoreForScale(scale, props.scores)) }} {{ scale.negative.toLowerCase() }}
              </template>
            </div>
            <h4>{{ scale.negative }}</h4>
            <p>{{ getTraitDescription(scale, 'negative') }}</p>
          </div>
          <div class="trait-description">
            <div class="trait-intensity">
              <template v-if="getScoreForScale(scale, props.scores) > 0">
                User {{ getTraitIntensityText(getScoreForScale(scale, props.scores)) }} {{ scale.positive.toLowerCase() }}
              </template>
            </div>
            <h4>{{ scale.positive }}</h4>
            <p>{{ getTraitDescription(scale, 'positive') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePersonalityTraits } from '../composables/usePersonalityTraits';

interface Props {
  scores: Record<string, number>;
}

const props = defineProps<Props>();

const {
  getTraitIntensityText,
  getScoreForScale,
  getTraitDescription,
  calculatePosition,
  getAllScales
} = usePersonalityTraits();

const expandedScales = ref<Set<string>>(new Set());
const allScales = getAllScales();

// Sort scales by absolute score value (prominence)
const availableScales = computed(() => {
  return [...allScales].sort((a, b) => {
    const scoreA = Math.abs(getScoreForScale(a, props.scores));
    const scoreB = Math.abs(getScoreForScale(b, props.scores));
    return scoreB - scoreA; // Sort in descending order
  });
});

const toggleScale = (scaleId: string) => {
  if (expandedScales.value.has(scaleId)) {
    expandedScales.value.delete(scaleId);
  } else {
    expandedScales.value.add(scaleId);
  }
  // Force reactivity update since Set mutations aren't automatically tracked
  expandedScales.value = new Set(expandedScales.value);
};
</script>

<style scoped>

.scales-title {
  font-size: 24px;
  color: #212529;
  margin-bottom: 2rem;
  text-align: center;
}

.scales-container {
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 2vw, 2rem);
  max-width: 1200px;
  margin: 0 auto;
}

.scale-item {
  width: 100%;
  min-width: 0;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.scale-item:hover {
  border-color: #dee2e6;
}

.scale-header {
  width: 100%;
  border: none;
  background: none;
  padding: 1rem;
  cursor: pointer;
  text-align: left;
}

.scale-header:hover {
  background: #f8f9fa;
}

.scale-content {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  padding: 0 1rem 1rem 1rem;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
  max-height: 500px;
  opacity: 1;
  overflow: hidden;
  transition: max-height 0.3s ease-out, opacity 0.3s ease-out, padding 0.3s ease-out;
}

.scale-content > * {
  flex: 1 1 300px;
}

.scale-content-hidden {
  max-height: 0;
  opacity: 0;
  padding: 0 1rem;
}

.trait-description {
  padding: 1rem;
}

.trait-description h4 {
  font-size: 1rem;
  color: #495057;
  margin-bottom: 0.5rem;
  margin-top: 0;
}

.trait-description p {
  font-size: 0.85rem;
  color: #6c757d;
  line-height: 1.5;
}

.scale-labels {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  gap: 0.5rem;
}

.negative-label, .positive-label {
  flex: 1;
  color: #5d5d5d;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.label--dominant {
  font-weight: bold;
  color: #000000;
}

.negative-label {
  text-align: left;
}

.positive-label {
  text-align: right;
}

.score {
  font-weight: bold;
  color: #0d6efd;
  font-size: 0.8rem;
  text-align: center;
  flex-shrink: 0; /* Prevents score from shrinking */
}

.scale-bar {
  position: relative;
  height: 24px;
  background: #f8f9fa;
  border-radius: 12px;
}

/* Center line */
.scale-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: #dee2e6;
  transform: translateY(-50%);
}

/* Center marker */
.scale-line::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  width: 2px;
  height: 0;
  background: #dee2e6;
  transform: translate(-50%, 0);
}

/* Score line */
.scale-value {
  position: absolute;
  top: 50%;
  left: 50%;
  height: 4px;
  background: #0d6efd;
  transform: translateY(-50%);
}

/* Score marker */
.scale-marker {
  position: absolute;
  top: 50%;
  width: 12px;
  height: 12px;
  background: #0d6efd;
  border: 2px solid white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.2s ease;
}

.scale-marker:hover {
  transform: translate(-50%, -50%) scale(1.2);
}

.trait-intensity {
  color: #026ecd;
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
  font-style: italic;
  min-height: 1.5rem;
}
</style> 