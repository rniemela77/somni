<template>
  <div class="personality-analysis-section">
    <div class="feeling-content">
      <!-- Dynamically generate analysis sections based on config -->
      <template v-for="section in getSortedAnalysisSections()" :key="section.id">
        <div class="feeling-section" :class="section.id">
          <h4>{{ section.title }}</h4>
          <template v-if="parsedFeeling[section.id]">
            <p v-if="section.id !== 'keywords'">{{ parsedFeeling[section.id] }}</p>
            <div v-else class="keyword-list">
              <span v-for="(keyword, index) in parsedFeeling[section.id].split(',').map(k => k.trim())" 
                    :key="index"
                    :style="{ backgroundColor: getKeywordColor(index) }">
                {{ keyword }}
              </span>
            </div>
          </template>
          <p v-else class="no-data">N/A</p>
        </div>
      </template>
      
      <!-- Dimensions Section -->
      <template v-for="dimension in Object.values(personalityDimensions)" :key="dimension.id">
        <div class="feeling-section" :class="'dimension-' + dimension.id">
          <h4>{{ dimension.name }}</h4>
          <p v-if="hasDimensionValues" class="dimension-value">
            {{ formatDimensionValue(displayDimensions[dimension.id] || 0, dimension) }}
          </p>
          <p v-else class="no-data">N/A</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { 
  PERSONALITY_DIMENSIONS, 
  PERSONALITY_ANALYSIS_SECTIONS 
} from '../config/personalityAnalysis';

export default {
  name: 'PersonalityAnalysisSection',
  props: {
    parsedFeeling: {
      type: Object,
      required: true
    },
    displayDimensions: {
      type: Object,
      required: true
    },
    hasDimensionValues: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      personalityDimensions: PERSONALITY_DIMENSIONS,
      personalityAnalysisSections: PERSONALITY_ANALYSIS_SECTIONS
    };
  },
  methods: {
    getSortedAnalysisSections() {
      return Object.values(this.personalityAnalysisSections)
        .sort((a, b) => a.display.order - b.display.order);
    },
    getKeywordColor(index) {
      // Array of soft background colors for the keywords
      const colors = [
        'rgba(58, 81, 153, 0.08)',   // primary color
        'rgba(92, 116, 87, 0.08)',   // secondary color
        'rgba(140, 156, 214, 0.15)', // primary light
        'rgba(169, 190, 166, 0.15)', // secondary light
        'rgba(78, 136, 199, 0.08)',  // info color
      ];
      
      // Cycle through the colors for each keyword
      return colors[index % colors.length];
    },
    formatDimensionValue(value, dimension) {
      // Convert numeric value to a descriptive text based on the value and dimension properties
      const normalizedValue = Math.max(-2, Math.min(2, value)); // Ensure value is between -2 and 2
      
      // Create a scale of descriptors
      const descriptors = {
        '-2': `Strong ${dimension.leftLabel}`,
        '-1': `Moderate ${dimension.leftLabel}`,
        '0': `Balanced`,
        '1': `Moderate ${dimension.rightLabel}`,
        '2': `Strong ${dimension.rightLabel}`
      };
      
      // Round to the nearest descriptor
      const roundedValue = Math.round(normalizedValue);
      return descriptors[roundedValue.toString()];
    }
  }
};
</script>

<style scoped>
/* Personality Analysis Section */
.personality-analysis-section {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 40px;
  border-radius: var(--radius-sm);
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  position: relative;
  max-width: 950px;
  margin-left: auto;
  margin-right: auto;
  transition: transform 0.4s ease-out, box-shadow 0.4s ease-out;
}

.personality-analysis-section:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.03);
}

.feeling-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-top: var(--spacing-md);
}

.feeling-section {
  padding: 20px 25px;
  border-radius: var(--radius-sm);
  background-color: rgba(255, 255, 255, 0.8);
  border-left: 2px solid transparent;
  transition: background-color var(--transition);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.feeling-section:hover {
  background-color: var(--bg-primary);
}

.feeling-section h4 {
  color: var(--text-primary);
  margin-top: 0;
  margin-bottom: 16px;
  font-weight: 500;
  font-size: 0.95rem;
}

.feeling-section p {
  margin: 0;
  line-height: 1.5;
  color: var(--text-secondary);
  flex-grow: 1;
  font-size: 0.92rem;
}

.keyword-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.keyword-list span {
  display: inline-block;
  background-color: rgba(58, 81, 153, 0.04);
  padding: 3px 12px;
  border-radius: var(--radius-sm);
  font-size: 0.82rem;
  color: var(--text-secondary);
  border: 1px solid rgba(58, 81, 153, 0.08);
}

/* Add specific color borders for each dimension type */
.dimension-IE::before {
  background-color: var(--primary);
}

.dimension-SI::before {
  background-color: var(--secondary);
}

.dimension-TF::before {
  background-color: var(--primary-light);
}

.dimension-JP::before {
  background-color: var(--secondary-light);
}

.core::before {
  background-color: var(--primary);
}

.archetype::before {
  background-color: var(--primary-light);
}

.keywords::before {
  background-color: var(--secondary-light);
}

@media (min-width: 768px) {
  .feeling-content {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px 40px;
  }
}

/* Add this style for N/A text */
.no-data {
  color: var(--text-muted);
  font-style: italic;
  font-size: 0.9rem;
}
</style> 