<template>
  <div class="personality-scales">
    <div class="scales-container">
      <div v-for="scale in availableScales" :key="scale.id" class="scale-item">
        <div class="scale-labels">
          <span class="negative-label" :class="{ 'label--dominant': getScoreForScale(scale) < 0 }">{{ scale.negative }}</span>
          <span class="score">{{ Math.round(getScoreForScale(scale)) }}</span>
          <span class="positive-label" :class="{ 'label--dominant': getScoreForScale(scale) > 0 }">{{ scale.positive }}</span>
        </div>
        <div class="scale-bar">
          <div class="scale-line"></div>
          <!-- Score line from center -->
          <div class="scale-value" 
               :style="{ 
                 width: Math.abs(getScoreForScale(scale)) / 2 + '%',
                 left: getScoreForScale(scale) >= 0 ? '50%' : 'auto',
                 right: getScoreForScale(scale) < 0 ? '50%' : 'auto'
               }">
          </div>
          <!-- Score marker -->
          <div class="scale-marker" 
               :style="{ left: calculatePosition(getScoreForScale(scale)) + '%' }"
               :title="`Score: ${Math.round(getScoreForScale(scale))}`">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import personalityData from '../../data/personalityData';

export default {
  name: 'PersonalityScales',
  props: {
    scores: {
      type: Object,
      required: true
    }
  },
  computed: {
    availableScales() {
      // Get all scales that have questions defined
      return personalityData.filter(scale => scale.questions);
    }
  },
  methods: {
    calculatePosition(score) {
      // Map -100 to 0% and 100 to 100%
      return ((score + 100) / 2);
    },
    getScoreForScale(scale) {
      // Return the score for the scale or 0 if not yet taken
      return this.scores[scale.id] || 0;
    }
  }
}
</script>

<style scoped>
.personality-scales {
  padding: 1rem;
}

.scales-title {
  font-size: 24px;
  color: #212529;
  margin-bottom: 2rem;
  text-align: center;
}

.scales-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 350px), 1fr));
  gap: clamp(1rem, 2vw, 2rem);
  max-width: 1200px;
  margin: 0 auto;
}

.scale-item {
  width: 100%;
  min-width: 0; /* Prevents overflow in grid items */
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
  top: 50%;
  width: 2px;
  height: 16px;
  background: #dee2e6;
  transform: translate(-50%, -50%);
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
</style> 