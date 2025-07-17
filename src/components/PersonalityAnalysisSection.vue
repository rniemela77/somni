<template>
  <div>
    <div class="personality-analysis-list">
      <template v-for="section in getSortedAnalysisSections()" :key="section.id">
        <div class="analysis-card mb-4">
          <div class="card h-100">
            <div class="card-body p-0">
              <div class="d-flex">
                <!-- Left side: Image/Icon area with title -->
                <div class="analysis-image-section d-flex align-items-center justify-content-center">
                  <div class="analysis-icon-container">
                    <!-- Background icon -->
                    <div class="analysis-icon-background">
                      <img src="../assets/svg/tarot.svg" alt="Tarot" />
                    </div>
                    <!-- Overlayed title text -->
                    <h5 class="analysis-title text-white fw-bold">{{ section.title }}</h5>
                  </div>
                </div>
                
                <!-- Right side: Content area -->
                <div class="analysis-content-section flex-grow-1 p-5">
                  <template v-if="parsedFeeling[section.id]">
                    <p class="mb-0">{{ parsedFeeling[section.id] }}</p>
                  </template>
                  <p v-else class="text-muted fst-italic mb-0">N/A</p>
                </div>
              </div>
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
.analysis-card {
  max-width: 100%;
}

.analysis-image-section {
  width: 17rem;
  min-height: 12rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba287 100%);
  border-top-left-radius: 0.375rem;
  border-bottom-left-radius: 0.375rem;
  flex-shrink: 0;
}

.analysis-icon-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.analysis-icon-background {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(15deg);
  width: 100%;
  height: 100%;
  transform-origin: center;
  opacity: 0.1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.analysis-icon-background svg {
  width: 100%;
  height: 100%;
}

.analysis-title {
  position: relative;
  z-index: 2;
  font-size: 2rem;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  text-align: center;
  padding: 0 1rem;
  line-height: 1.3;
}

.analysis-content-section {
  background: white;
  border-top-right-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
  display: flex;
  align-items: center;
}

.analysis-content-section p {
  line-height: 2;
  font-size: 1.05rem;
}

.card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .analysis-image-section {
    width: 150px;
    height: 120px;
  }
  
  .analysis-icon-background {
    width: 60px;
    height: 60px;
  }
  
  .analysis-title {
    font-size: 0.8rem;
  }
  
  .analysis-content-section {
    padding: 1rem !important;
  }
}
</style>