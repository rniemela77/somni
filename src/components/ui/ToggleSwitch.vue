<template>
  <div class="toggle-switch">
    <button 
      class="toggle-option" 
      :class="{ 'active': !isActive }"
      @click="toggle"
    >
      {{ leftLabel }}
    </button>
    <button 
      class="toggle-option" 
      :class="{ 'active': isActive }"
      @click="toggle"
    >
      {{ rightLabel }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  leftLabel: string;
  rightLabel: string;
  modelValue: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const isActive = computed(() => props.modelValue);

const toggle = () => {
  emit('update:modelValue', !isActive.value);
};
</script>

<style scoped>
.toggle-switch {
  display: inline-flex;
  background: var(--card-bg-color);
  border-radius: 0.75rem;
  padding: 4px;
  border: 1px solid var(--primary-color);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.toggle-option {
  background: none;
  border: none;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  color: var(--neutral-color);
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  min-width: 100px;
  text-align: center;
}

.toggle-option:hover {
  filter: brightness(1.5);
}

.toggle-option.active {
  background: var(--primary-color);
  color: #fff;
  box-shadow: 0 2px 4px rgba(95, 85, 238, 0.15);
  font-weight: 700;
}

.toggle-option:focus {
  outline: 2px solid var(--primary-color-darker);
  outline-offset: 2px;
}

.toggle-option:focus:not(:focus-visible) {
  outline: none;
}
</style>
