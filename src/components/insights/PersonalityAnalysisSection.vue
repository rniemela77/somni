<template>
  <div class="analysis-card rounded-3 shadow-sm overflow-hidden">
    <div class="d-flex flex-column flex-md-row">
      <!-- Left side: Image/Icon area with title -->
      <div class="analysis-image-section d-flex align-items-center justify-content-center col-12 col-md-4">
        <div class="analysis-icon-container">
          <!-- Background icon -->
          <div class="analysis-icon-background">
            <img :src="`/svg/${icon}`" alt="Section Icon" />
          </div>
          <!-- Overlayed title text -->
          <h3 class="analysis-title text-white fw-bold">{{ title }}</h3>
        </div>
      </div>

      <!-- Right side: Content area -->
      <div class="analysis-content-section p-3 p-md-5 col-12 col-md-8">
        <template v-if="hasAnalysis">
          <div class="analysis-content">
            <div class="analysis-header mb-3">
              <h4 class="fw-bold text-primary mb-2">{{ name }}</h4>
              <p class="lead mb-0">{{ description }}</p>
            </div>

            <div class="key-insights mb-2 text-primary border-start border-primary ps-3">
              <p class="mb-0">{{ keyInsights }}</p>
            </div>

            <div class="quote-maxim py-3">
              <p class="mb-0">
                {{ quoteMaxim }}
              </p>
            </div>
          </div>
        </template>
        <p v-else class="text-muted fst-italic mb-0">No analysis yet - click the "Generate Analysis" button above to see
          deeper
          insights.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  title: string;
  icon: string;
  name?: string;
  description?: string;
  keyInsights?: string;
  quoteMaxim?: string;
}

const props = defineProps<Props>();

const hasAnalysis = computed(() => {
  return props.name && props.description && props.keyInsights && props.quoteMaxim;
});
</script>

<style scoped>
.analysis-card {
  max-width: 100%;
  position: relative;
  margin-bottom: 3rem;
}

.analysis-image-section {
  background: var(--card-fancy-img-bg);
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
  width: 100%;
  height: 100%;
  transform-origin: center;
  opacity: 0.1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.analysis-icon-background img {
  filter: invert(1);
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
  background: var(--card-fancy-bg-color);
  display: flex;
  align-items: center;
}

.analysis-content-section p {
  line-height: 2;
  font-size: 1.05rem;
}

.analysis-header h4 {
  color: var(--bs-primary);
  font-size: 2rem;
}

.analysis-header .lead {
  font-size: 1.1rem;
}

.quote-maxim {
  color: var(--body-text-color-medium);
  font-style: italic;
  text-shadow: 0 2px 8px var(--text-primary-bg);
  letter-spacing: 0.03em;
}

.card {
  border: none;
}
</style>