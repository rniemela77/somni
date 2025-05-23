<template>
  <div class="container mt-5">
    <div class="row">
      <template v-for="section in getSortedAnalysisSections()" :key="section.id">
        <div class="col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <h4 class="card-title">{{ section.title }}</h4>
              <template v-if="parsedFeeling[section.id]">
                <p v-if="section.id !== 'keywords'">{{ parsedFeeling[section.id] }}</p>
                <div v-else class="d-flex flex-wrap gap-2">
                  <span v-for="(keyword, index) in parsedFeeling[section.id].split(',').map(k => k.trim())" 
                        :key="index"
                        class="badge bg-light text-dark">
                    {{ keyword }}
                  </span>
                </div>
              </template>
              <p v-else class="text-muted fst-italic">N/A</p>
            </div>
          </div>
        </div>
      </template>

      <template v-for="dimension in Object.values(personalityDimensions)" :key="dimension.id">
        <div class="col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <h4 class="card-title">{{ dimension.name }}</h4>
              <p v-if="hasDimensionValues" class="dimension-value">
                {{ formatDimensionValue(displayDimensions[dimension.id] || 0, dimension) }}
              </p>
              <p v-else class="text-muted fst-italic">N/A</p>
            </div>
          </div>
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
      const colors = [
        'rgba(58, 81, 153, 0.08)',
        'rgba(92, 116, 87, 0.08)',
        'rgba(140, 156, 214, 0.15)',
        'rgba(169, 190, 166, 0.15)',
        'rgba(78, 136, 199, 0.08)',
      ];
      return colors[index % colors.length];
    },
    formatDimensionValue(value, dimension) {
      const normalizedValue = Math.max(-2, Math.min(2, value));
      const descriptors = {
        '-2': `Strong ${dimension.leftLabel}`,
        '-1': `Moderate ${dimension.leftLabel}`,
        '0': `Balanced`,
        '1': `Moderate ${dimension.rightLabel}`,
        '2': `Strong ${dimension.rightLabel}`
      };
      const roundedValue = Math.round(normalizedValue);
      return descriptors[roundedValue.toString()];
    }
  }
};
</script>

<style scoped>
</style>