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
                                 class="mb-4">
                                <p class="fw-bold">{{ answer.questionText }}</p>
                                <div class="answer-slider-container p-3 bg-light rounded">
                                    <div class="slider-bar position-relative">
                                        <div class="slider-fill" :style="{ 
                                            width: (Math.abs(parseFloat(answer.userAnswer)) / 2) + '%',
                                            left: parseFloat(answer.userAnswer) < 0 ? 'auto' : '50%',
                                            right: parseFloat(answer.userAnswer) < 0 ? '50%' : 'auto'
                                        }"></div>
                                        <div class="slider-marker" :style="{ left: ((parseFloat(answer.userAnswer) + 100) / 2) + '%' }">
                                            {{ answer.userAnswer }}
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-between mt-2">
                                        <small class="text-muted">Almost Never (-100)</small>
                                        <small class="text-muted">Almost Always (+100)</small>
                                    </div>
                                </div>
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
import { authService } from '../services/firebase-auth';

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
.modal {
    background-color: rgba(0, 0, 0, 0.5);
}

.slider-bar {
    height: 8px;
    background-color: #dee2e6;
    border-radius: 4px;
    margin: 1rem 0;
}

.slider-fill {
    height: 100%;
    background-color: #0d6efd;
    border-radius: 4px;
    transition: all 0.3s ease;
    position: absolute;
    top: 0;
}

.slider-marker {
    position: absolute;
    top: -25px;
    transform: translateX(-50%);
    background-color: #0d6efd;
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.875rem;
}

.answer-slider-container {
    border: 1px solid #dee2e6;
    position: relative;
}

/* Add center line marker */
.slider-bar::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    height: 100%;
    width: 2px;
    background-color: #6c757d;
    opacity: 0.3;
    transform: translateX(-50%);
}

.fade-in {
    animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
</style>
