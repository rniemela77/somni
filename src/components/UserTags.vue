<template>
  <div class="user-stats card">
    <h3>Your Personality Profile</h3>
    
    <!-- Dimensions Section -->
    <div class="dimensions-container">
      <div v-for="(config, key) in PERSONALITY_DIMENSIONS" 
           :key="key" 
           class="dimension-item">
        <h4>{{ config.name }}</h4>
        <div class="dimension-scale">
          <span class="scale-label left">{{ config.leftLabel }}</span>
          <div class="scale-bar-container">
            <div class="scale-bar">
              <div class="scale-marker"
                   :style="{ left: getMarkerPosition(getDimensionValue(key)) + '%' }">
                {{ getDimensionValue(key).toFixed(1) }}
              </div>
            </div>
          </div>
          <span class="scale-label right">{{ config.rightLabel }}</span>
        </div>
      </div>
    </div>

    <!-- Active Tags Section -->
    <div v-if="tags.length" class="tags-section">
      <h4>Your Personality Type</h4>
      <div class="tags-container">
        <div v-for="tag in tags" :key="tag" class="tag">
          {{ tag }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { authService } from '../services/firebase';
import { getUserPersonality, PERSONALITY_DIMENSIONS } from '../../firebase';

export default {
  name: 'PersonalityProfile',
  setup() {
    const dimensions = ref(getInitialDimensions());
    const tags = ref([]);

    // Initialize dimensions with default values
    function getInitialDimensions() {
      const initial = {};
      Object.keys(PERSONALITY_DIMENSIONS).forEach(key => {
        initial[key] = 0;
      });
      return initial;
    }

    // Safely get dimension value with fallback to 0
    const getDimensionValue = (key) => {
      return dimensions.value[key] ?? 0;
    };

    // Convert dimension value (-2 to 2) to position percentage (0 to 100)
    const getMarkerPosition = (value) => {
      // Convert from -2,2 range to 0,100 range
      return ((value + 2) / 4) * 100;
    };

    const loadPersonality = async () => {
      const user = authService.getCurrentUser();
      if (user) {
        const userData = await getUserPersonality(user.uid);
        dimensions.value = userData.dimensions;
        tags.value = userData.tags;
      }
    };
    
    // Method to refresh dimensions from the database
    const refreshDimensions = async () => {
      await loadPersonality();
    };

    onMounted(loadPersonality);

    return {
      dimensions,
      tags,
      PERSONALITY_DIMENSIONS,
      getMarkerPosition,
      getDimensionValue,
      refreshDimensions
    };
  }
};
</script>

<style scoped>
.user-stats {
  margin: var(--spacing-lg) 0;
  padding: var(--spacing-xl);
}

.dimensions-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  margin: var(--spacing-lg) 0;
}

.dimension-item h4 {
  margin-bottom: var(--spacing-md);
  color: var(--text-secondary);
}

.dimension-scale {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.scale-label {
  min-width: 80px;
  font-weight: 500;
  font-size: var(--font-size-sm);
}

.scale-label.left {
  text-align: right;
  color: var(--primary-dark);
}

.scale-label.right {
  text-align: left;
  color: var(--secondary-dark);
}

.scale-bar-container {
  flex-grow: 1;
  padding: var(--spacing-xs) 0;
}

.scale-bar {
  height: 4px;
  background: linear-gradient(to right, var(--primary), var(--secondary));
  border-radius: var(--radius-lg);
  position: relative;
}

.scale-marker {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  background: white;
  border: 2px solid var(--primary);
  border-radius: var(--radius-round);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xs);
  font-weight: 500;
  color: var(--text-primary);
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);
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
  background: var(--gradient-primary);
  color: white;
  font-weight: 500;
  box-shadow: var(--shadow-sm);
}
</style> 