<template>
  <div class="personality-scales">
    <div class="scales-container">
      <div v-for="scale in availableScales" :key="scale.id" class="scale-item">
        <div class="scale-labels">
          <span class="negative-label">{{ scale.negative }}</span>
          <span class="score">{{ Math.round(getScoreForScale(scale)) }}</span>
          <span class="positive-label">{{ scale.positive }}</span>
        </div>
        <div class="scale-bar">
          <div class="scale-line"></div>
          <div class="scale-marker" 
               :style="{ left: `${calculatePosition(getScoreForScale(scale))}%` }"
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
  padding: 2rem;
}

.scales-title {
  font-size: 24px;
  color: #212529;
  margin-bottom: 2rem;
  text-align: center;
}

.scales-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.scale-item {
  width: 100%;
}

.scale-labels {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.negative-label, .positive-label {
  flex: 1;
  font-size: 0.9rem;
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
  background: rgba(13, 110, 253, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.9rem;
  min-width: 4rem;
  text-align: center;
}

.scale-bar {
  position: relative;
  height: 24px;
  background: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
}

.scale-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: #dee2e6;
  transform: translateY(-50%);
}

/* Add tick marks for -50, 0, and 50 */
.scale-line::before,
.scale-line::after {
  content: '';
  position: absolute;
  top: -5px;
  width: 2px;
  height: 12px;
  background: #dee2e6;
}

.scale-line::before {
  left: 25%;
}

.scale-line::after {
  right: 25%;
}

.scale-marker {
  position: absolute;
  top: 50%;
  width: 16px;
  height: 16px;
  background: #0d6efd;
  border: 2px solid white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  transition: all 0.3s ease;
}

.scale-marker:hover {
  transform: translate(-50%, -50%) scale(1.2);
  background: #0a58ca;
}
</style> 