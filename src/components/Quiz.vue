<template>
    <div>
        <QuizList v-if="!selectedQuiz" @select-quiz="selectQuiz" />
        <QuizDetail v-else :quizId="selectedQuiz" @back-to-selection="backToSelection" />
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import QuizList from './QuizList.vue';
import QuizDetail from './QuizDetail.vue';
import { useQuizStore } from '../stores/quiz';
import { authService } from '../services/firebase-auth';

export default {
    components: {
        QuizList,
        QuizDetail
    },
    setup() {
        const quizStore = useQuizStore();
        const selectedQuiz = ref(null);
        const availableQuizzes = computed(() => quizStore.availableQuizzes);

        const loadQuizzes = async () => {
            await quizStore.loadQuizzes();
        };

        const selectQuiz = (quizId) => {
            selectedQuiz.value = quizId;
        };

        const backToSelection = () => {
            selectedQuiz.value = null;
        };

        onMounted(loadQuizzes);

        return {
            availableQuizzes,
            selectedQuiz,
            selectQuiz,
            backToSelection
        };
    }
};
</script>

<style scoped>
.fade-in {
    animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
</style>
