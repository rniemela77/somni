<template>
    <div>
        <QuizList v-if="!selectedQuiz" @select-quiz="selectQuiz" @show-answers="showAnswers" />
        <QuizDetail v-else :quizId="selectedQuiz" @back-to-selection="backToSelection" />

        <!-- Answers Modal -->
        <div v-if="showAnswersModal" class="modal fade show d-block" tabindex="-1" role="dialog" @click="closeAnswersModal">
            <div class="modal-dialog modal-lg" role="document" @click.stop>
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ currentAnswersQuizTitle }}</h5>
                        <button type="button" class="btn-close" @click="closeAnswersModal"></button>
                    </div>
                    <div class="modal-body">
                        <p class="text-muted">Completed on {{ formatDate(currentAnswersResult.timestamp) }}</p>
                        <div v-if="currentAnswersResult && currentAnswersResult.answers">
                            <div v-for="(answer, index) in currentAnswersResult.answers" 
                                 :key="index"
                                 class="mb-3">
                                <p class="fw-bold">{{ answer.questionText }}</p>
                                <p>Your Answer: <span class="text-primary">{{ answer.userAnswer }}</span></p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" @click="closeAnswersModal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import QuizList from './QuizList.vue';
import QuizDetail from './QuizDetail.vue';
import { useQuizStore } from '../stores/quiz';
import { authService } from '../services/firebase';

export default {
    components: {
        QuizList,
        QuizDetail
    },
    setup() {
        const quizStore = useQuizStore();
        const selectedQuiz = ref(null);
        const showAnswersModal = ref(false);
        const currentAnswersQuizTitle = ref("");
        const currentAnswersResult = ref(null);

        const availableQuizzes = computed(() => quizStore.availableQuizzes);
        const userResults = computed(() => quizStore.userResults);

        const getQuizResult = (quizId) => {
            return userResults.value.find(result => result.quizId === quizId);
        };

        const formatDate = (timestamp) => {
            if (!timestamp) return 'N/A';
            const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        };

        const loadQuizzes = async () => {
            await quizStore.loadQuizzes();
            const user = authService.getCurrentUser();
            if (user) {
                await quizStore.loadUserResults();
            }
        };

        const selectQuiz = (quizId) => {
            selectedQuiz.value = quizId;
        };

        const backToSelection = () => {
            selectedQuiz.value = null;
        };

        const showAnswers = (quizId) => {
            const result = getQuizResult(quizId);
            if (!result) {
                console.warn("No results found for quiz", quizId);
                return;
            }

            const quiz = availableQuizzes.value.find(q => q.id === quizId);
            if (!quiz) {
                console.warn("Quiz not found:", quizId);
                return;
            }

            currentAnswersQuizTitle.value = quiz.title;
            currentAnswersResult.value = result;
            showAnswersModal.value = true;
            document.body.style.overflow = 'hidden';
        };

        const closeAnswersModal = () => {
            showAnswersModal.value = false;
            currentAnswersQuizTitle.value = "";
            currentAnswersResult.value = null;
            document.body.style.overflow = 'auto';
        };

        onMounted(loadQuizzes);

        return {
            availableQuizzes,
            selectedQuiz,
            showAnswersModal,
            currentAnswersQuizTitle,
            currentAnswersResult,
            selectQuiz,
            backToSelection,
            showAnswers,
            closeAnswersModal,
            formatDate
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
