import { computed } from 'vue';
import { useUserStore } from '../stores/user';
import { useQuizStore } from '../stores/quiz';

export function useNextAssessment() {
  const userStore = useUserStore();
  const quizStore = useQuizStore();

  const availableQuizzes = computed(() => quizStore.availableQuizzes);
  const incompleteQuizzes = computed(() =>
    availableQuizzes.value.filter(quiz => userStore.userAttributes[quiz.id] === undefined)
  );
  const firstIncomplete = computed(() =>
    incompleteQuizzes.value.length > 0 ? incompleteQuizzes.value[0] : null
  );

  return {
    firstIncompleteAssessment: firstIncomplete,
  };
} 