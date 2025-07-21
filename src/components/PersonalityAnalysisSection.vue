<template>
  <div>
    <div class="personality-analysis-list">
      <template v-for="section in getSortedAnalysisSections" :key="section.id">
        <div class="analysis-card rounded-3 shadow-sm overflow-hidden">
          <div class="card h-100">
            <div class="card-body p-0">
              <div class="d-flex flex-column flex-md-row">
                <!-- Left side: Image/Icon area with title -->
                <div class="analysis-image-section d-flex align-items-center justify-content-center col-12 col-md-4">
                  <div class="analysis-icon-container">
                    <!-- Background icon -->
                    <div class="analysis-icon-background">
                      <img :src="`/svg/${section.icon}`" alt="Section Icon" />
                    </div>
                    <!-- Overlayed title text -->
                    <h5 class="analysis-title text-white fw-bold">{{ section.title }}</h5>
                  </div>
                </div>
                
                <!-- Right side: Content area -->
                <div class="analysis-content-section p-5 col-12 col-md-8">
                  <template v-if="personalityAnalysis[section.id]">
                    <p class="mb-0">{{ personalityAnalysis[section.id] }}</p>
                  </template>
                  <p v-else class="text-muted fst-italic mb-0">No analysis yet - click the "Generate Analysis" button above to see deeper insights.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { 
  PERSONALITY_ANALYSIS_SECTIONS 
} from '../config/personalityAnalysis';

interface Props {
  personalityAnalysis: Record<string, string>;
}

const props = defineProps<Props>();

const personalityAnalysisSections = PERSONALITY_ANALYSIS_SECTIONS;

const getSortedAnalysisSections = computed(() => {
  return Object.values(personalityAnalysisSections)
    .sort((a, b) => a.display.order - b.display.order);
});
</script>

<style scoped>
.analysis-card {
  max-width: 100%;
  position: relative;
  margin-bottom: 3rem;
  /* min-height: 15rem; */
}
/* .analysis-card::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(144deg, #b6a6ff -114%, transparent 75%);
} */

.analysis-image-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba287 100%);
}

.analysis-icon-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.analysis-icon-background {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-71%, -50%) rotate(15deg);
  width: 75%;
  height: 75%;
  transform-origin: center;
  opacity: 0.1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.analysis-icon-background img {
  filter:invert(1);
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
  padding: 2rem;
  line-height: 1.5;
}

.analysis-content-section {
  background: linear-gradient(144deg, #b6a6ff70 -114%, transparent 75%);
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
</style>