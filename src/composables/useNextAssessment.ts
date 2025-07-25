import { computed } from 'vue';
import { useUserStore } from '../stores/user';
import { usePersonalityTraits } from './usePersonalityTraits';

export function useNextAssessment() {
  const userStore = useUserStore();
  const { getAllScales } = usePersonalityTraits();

  const allScales = computed(() => getAllScales());
  const incompleteScales = computed(() =>
    allScales.value.filter(scale => userStore.userAttributes[scale.id] === undefined)
  );
  const firstIncomplete = computed(() =>
    incompleteScales.value.length > 0 ? incompleteScales.value[0] : null
  );

  return {
    firstIncompleteAssessment: firstIncomplete,
  };
} 