<template>
  <div class="container">
    <h2 class="mb-4">AI Personality Insights</h2>

    <!-- View Toggle -->
    <div class="view-toggle mb-4">
      <div class="btn-group" role="group">
        <button @click="currentView = 'breakdown'" class="btn"
          :class="currentView === 'breakdown' ? 'btn-primary' : 'btn-outline-primary'">
          <i class="bi bi-list-check me-2"></i>
          Breakdown
        </button>
        <button @click="currentView = 'narrative'" class="btn"
          :class="currentView === 'narrative' ? 'btn-primary' : 'btn-outline-primary'">
          <i class="bi bi-book me-2"></i>
          Narrative
        </button>
      </div>
    </div>

    <!-- Insights View -->
    <div v-if="currentView === 'breakdown'">
      <BreakdownList />
    </div>

    <div v-else-if="currentView === 'narrative'">
      <Story />
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BreakdownList from '../insights/BreakdownList.vue';
import Story from '../insights/Story.vue';

const currentView = ref<'breakdown' | 'narrative'>('breakdown');
</script>

<style scoped>
.view-toggle {
  display: flex;
  justify-content: center;
}

.feature-card {
  background: var(--card-bg-color);
  border: 1px solid var(--card-border-color);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.feature-card i {
  font-size: 2.5rem;
  display: block;
}

.feature-card h5 {
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.feature-card p {
  margin-bottom: 0;
  line-height: 1.5;
}
</style>