<template>
  <SectionCard v-if="latestResult && scale" title="Latest Result"
    :subtitle="`${dominantTrait} [${Math.abs(latestResult?.score)}%]`" iconClass="bi bi-person-lines-fill">
    <template #content>
      <div class="d-flex gap-4 flex-wrap">
        <div class="flex-grow-1">
          <strong>Assessment:</strong>
          <p>{{ scale.title || scale.displayName }}</p>
        </div>
        <div class="flex-grow-1">
          <strong>Dominant Trait:</strong>
          <p>{{ dominantTrait }}</p>
        </div>
        <div class="flex-grow-1">
          <strong>Explanation:</strong>
          <p>You are [<span class="text-primary">{{ Math.abs(latestResult?.score) }}%</span>] higher on <span
              class="text-primary">{{ dominantTrait }}</span> than <span class="text-primary">{{ weakerTrait }}</span>
          </p>
        </div>
      </div>

      <div class="my-4">
        <strong>Description:</strong>
        <p class="result-description">{{ traitDescription }}</p>
      </div>
    </template>
  </SectionCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '../../stores/user';
import { usePersonalityTraits } from '../../composables/usePersonalityTraits';
import SectionCard from '../ui/SectionCard.vue';

const userStore = useUserStore();
const { getScaleById, getDominantTrait, getTraitDescription, getWeakerTrait } = usePersonalityTraits();

const latestResult = computed(() => {
  if (!userStore.results || userStore.results.length === 0) return null;
  // Sort by timestamp descending (most recent first)
  return [...userStore.results].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
});

const scale = computed(() => {
  if (!latestResult.value) return null;
  return getScaleById(latestResult.value.attribute);
});

const dominantTrait = computed(() => {
  if (!scale.value || !latestResult.value) return '';
  return getDominantTrait(scale.value, latestResult.value.score);
});

const weakerTrait = computed(() => {
  if (!scale.value || !latestResult.value) return '';
  return getWeakerTrait(scale.value, latestResult.value.score);
});

const traitDescription = computed(() => {
  if (!scale.value || !latestResult.value) return '';
  const traitType = latestResult.value.score > 0 ? 'positive' : 'negative';
  return getTraitDescription(scale.value, traitType);
});
</script>

<style scoped>
h3 {
  color: var(--text-primary);
}

strong {
  font-style: italic;
  color: var(--text-primary);
}

p {
  margin-bottom: 0;
}

strong~p {
  font-size: 1.1rem;
  font-weight: 700;
  background-color: var(--card-bg-color);
  padding: 0.5rem 1.5rem;
  border-radius: 0.25rem;
}

.text-primary {
  color: var(--text-primary)!important;
}

.result-description {
  line-height: 2;
}
</style>
