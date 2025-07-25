import { computed } from 'vue';
import { useUserStore } from '../stores/user';

const GOAL_PERCENT = 0.75;

export function useInsightsProgress() {
  const userStore = useUserStore();

  const totalQuizzes = computed(() => userStore.totalQuizzesCount);
  const completedQuizzes = computed(() => userStore.completedQuizzesCount);
  const requiredToUnlock = computed(() => Math.ceil(totalQuizzes.value * GOAL_PERCENT));
  const isUnlocked = computed(() => completedQuizzes.value >= requiredToUnlock.value);
  const quizzesLeft = computed(() => Math.max(0, requiredToUnlock.value - completedQuizzes.value));
  const percentComplete = computed(() => totalQuizzes.value === 0 ? 0 : completedQuizzes.value / totalQuizzes.value);

  return {
    totalQuizzes,
    completedQuizzes,
    requiredToUnlock,
    isUnlocked,
    quizzesLeft,
    percentComplete,
    GOAL_PERCENT,
  };
} 