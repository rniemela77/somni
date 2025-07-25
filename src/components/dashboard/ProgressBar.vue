<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h4 class="mb-0">Assessment Progress</h4>
      <span><span class="progress-fraction">{{ completedAssessments }}/{{ totalAssessments }}</span> Completed</span>
    </div>

    <div class="progress">
      <div class="progress-bar bg-primary rounded-pill" role="progressbar" :style="{ width: progressPercentage + '%' }"
        :aria-valuenow="completedAssessments" :aria-valuemin="0" :aria-valuemax="totalAssessments"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// props
const props = defineProps({
  completedAssessments: {
    type: Number,
    default: 0,
    required: true
  },
  totalAssessments: {
    type: Number,
    default: 0,
    required: true
  }
});

const progressPercentage = computed(() => {
  return (props.completedAssessments / props.totalAssessments) * 100;
});
</script>

<style scoped>
.progress {
  background: var(--card-bg-color);
  height: 18px;
  overflow: unset;
  box-shadow: inset 0 5px 20px -10px rgba(0,0,0,0.1);
}

.progress-fraction {
  color: var(--text-primary)!important;
  letter-spacing: 0.1rem;
}
</style>