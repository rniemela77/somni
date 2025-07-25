<template>
  <div v-if="visible" :class="['alert', alertClass, 'd-flex', 'align-items-center', 'my-3']">
    <span v-if="icon" class="me-2">{{ icon }}</span>
    <div class="flex-grow-1">
      <slot>{{ message }}</slot>
    </div>

    <button v-if="closable" @click="handleClose" class="btn-close align-self-start" aria-label="Close">
      <i class="bi bi-x-lg"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'info', // 'success', 'error', 'warning', 'info'
  },
  message: {
    type: String,
    default: '',
  },
  closable: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['update:modelValue', 'close']);
const visible = ref(props.modelValue);

watch(() => props.modelValue, (val) => {
  visible.value = val;
});

const alertClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'alert-success';
    case 'error':
      return 'alert-danger';
    case 'warning':
      return 'alert-warning';
    default:
      return 'alert-info';
  }
});

const icon = computed(() => {
  switch (props.type) {
    case 'success':
      return '🎉';
    case 'error':
      return '✗';
    case 'warning':
      return '⚠️';
    default:
      return '';
  }
});

function handleClose() {
  visible.value = false;
  emit('update:modelValue', false);
  emit('close');
}
</script>

<style scoped>
.alert {
  border-radius: 0.75rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.05);
  padding: 1rem 1.5rem;
  font-size: 1rem;
  color: var(--body-text-color);
  background: var(--card-bg-color);
  position: relative;
}
.btn-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: var(--body-text-color);
  height: 3rem;
  width: 3rem;
  position: absolute;
  top: 0;
  right: 0;
}
</style> 