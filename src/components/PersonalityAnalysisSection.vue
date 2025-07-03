<template>
  <div>
    <div class="row">
      <template v-for="section in getSortedAnalysisSections()" :key="section.id">
        <div class="col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <h4 class="card-title">{{ section.title }}</h4>
              <template v-if="parsedFeeling[section.id]">
                <p>{{ parsedFeeling[section.id] }}</p>
              </template>
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
  PERSONALITY_ANALYSIS_SECTIONS 
} from '../config/personalityAnalysis';

export default {
  name: 'PersonalityAnalysisSection',
  props: {
    parsedFeeling: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      personalityAnalysisSections: PERSONALITY_ANALYSIS_SECTIONS
    };
  },
  methods: {
    getSortedAnalysisSections() {
      return Object.values(this.personalityAnalysisSections)
        .sort((a, b) => a.display.order - b.display.order);
    },
  }
};
</script>

<style scoped>
</style>