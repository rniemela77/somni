<template>
  <div class="accordion-item" :class="{ 'accordion-item--expanded': isExpanded }">
    <button 
      class="accordion-header" 
      @click="toggle"
      :disabled="disabled"
    >
      <div class="accordion-header__content">
        <h3 class="accordion-title">{{ title }}</h3>
        <div v-if="subtitle" class="accordion-subtitle text-primary">{{ subtitle }}</div>
      </div>
      <div class="accordion-header__actions">
        <div v-if="badge" class="accordion-badge">{{ badge }}</div>
        <i class="bi accordion-icon text-primary" :class="isExpanded ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
      </div>
    </button>
    
    <div class="accordion-content" :class="{ 'accordion-content--expanded': isExpanded }">
      <div class="accordion-content__inner">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  title: string;
  subtitle?: string;
  badge?: string;
  disabled?: boolean;
  modelValue?: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  modelValue: false
});

const emit = defineEmits<Emits>();

const isExpanded = computed(() => props.modelValue);

const toggle = () => {
  if (!props.disabled) {
    emit('update:modelValue', !isExpanded.value);
  }
};
</script>

<style scoped>
.accordion-item {
  background: var(--card-bg-color);
  border: 1px solid var(--card-border-color);
  border-radius: 0.5rem;
  margin-bottom: 0.75rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.accordion-item--expanded {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.accordion-header {
  width: 100%;
  padding: 1.25rem 1.5rem;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
}

.accordion-header:hover:not(:disabled) {
  background: var(--primary-color);
  color: white;
}

.accordion-header:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.accordion-header__content {
  flex: 1;
  min-width: 0;
}

.accordion-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: var(--text-primary);
  transition: color 0.2s ease;
}

.accordion-subtitle {
  font-size: 0.85rem;
  margin: 0;
  transition: color 0.2s ease;
}

.accordion-header:hover:not(:disabled) .accordion-title,
.accordion-header:hover:not(:disabled) .accordion-subtitle {
  color: white;
}

.accordion-header__actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-left: 1rem;
}

.accordion-badge {
  background: var(--primary-color);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.accordion-header:hover:not(:disabled) .accordion-badge {
  background: rgba(255, 255, 255, 0.2);
}

.accordion-icon {
  font-size: 1rem;
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.accordion-header:hover:not(:disabled) .accordion-icon {
  color: white;
}

.accordion-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.accordion-content--expanded {
  max-height: 1000px; /* Large enough to accommodate content */
}

.accordion-content__inner {
  padding: 0 1.5rem 1.5rem 1.5rem;
  border-top: 1px solid var(--card-border-color);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .accordion-header {
    padding: 1rem;
  }
  
  .accordion-content__inner {
    padding: 0 1rem 1rem 1rem;
  }
  
  .accordion-title {
    font-size: 1rem;
  }
  
  .accordion-subtitle {
    font-size: 0.8rem;
  }
}
</style>
