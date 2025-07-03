<template>
  <div class="user-stats card">
    <h3>Your Personality Profile</h3>

    <!-- Active Tags Section -->
    <div v-if="userStore.tags.length" class="tags-section">
      <h4>Your Personality Type</h4>
      <div class="tags-container">
        <div v-for="tag in userStore.tags" :key="tag" class="tag">
          {{ tag }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/user';

const userStore = useUserStore();
</script>

<style scoped>
.user-stats {
  margin: var(--spacing-lg) 0;
  padding: var(--spacing-xl);
}

.tags-section {
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--bg-muted);
}

.tags-section h4 {
  margin-bottom: var(--spacing-md);
  color: var(--text-secondary);
  text-align: center;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  justify-content: center;
}

.tag {
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-lg);
  background-color: var(--primary);
  color: white;
  font-weight: 500;
  box-shadow: var(--shadow-sm);
}
</style> 