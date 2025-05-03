<template>
    <div class="quiz-container container">
        <!-- Quiz Selection Section -->
        <div v-if="!selectedQuiz" class="fade-in">
            <h2 class="section-title">Select a Quiz</h2>
            <div v-if="availableQuizzes.length === 0" class="message info">
                <p>Loading quizzes...</p>
            </div>
            <div v-else class="quiz-grid">
                <div v-for="quiz in availableQuizzes" 
                     :key="quiz.id" 
                     class="card quiz-card">
                    <div class="quiz-card-content">
                        <h3>{{ quiz.title }}</h3>
                        <div v-if="getQuizResult(quiz.id)" class="quiz-history">
                            <p class="quiz-status">
                                Last completed on {{ formatDate(getQuizResult(quiz.id).timestamp) }}
                            </p>
                        </div>
                        <p class="quiz-description">{{ getQuizResult(quiz.id) ? 'Retaking this quiz will replace your previous answers.' : 'Start this assessment to discover more about yourself' }}</p>
                    </div>
                    <div class="quiz-card-action">
                        <div v-if="getQuizResult(quiz.id)" class="button-group">
                            <button 
                                class="btn btn-outline" 
                                @click="selectQuiz(quiz.id)">
                                Retake Quiz
                            </button>
                            <button 
                                class="btn btn-text" 
                                @click="showAnswers(quiz.id)">
                                See Answers
                            </button>
                        </div>
                        <button 
                            v-else
                            class="btn btn-primary" 
                            @click="selectQuiz(quiz.id)">
                            Begin Assessment
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quiz Questions Section -->
        <div v-else class="active-quiz fade-in">
            <div class="quiz-header">
                <h2>{{ quizTitle }}</h2>
                <button class="btn btn-outline" @click="backToSelection">
                    ← Back to Quiz Selection
                </button>
            </div>

            <form @submit.prevent="submitQuiz" class="quiz-form">
                <div v-for="(question, index) in questions" 
                     :key="question.id"
                     class="card question-card">
                    <p class="question-number">Question {{ index + 1 }}</p>
                    <p class="question-text">{{ question.text }}</p>
                    <div class="options-grid">
                        <label v-for="(option, i) in question.options" 
                               :key="i"
                               class="option-label">
                            <input type="radio" 
                                   :name="'question-' + index" 
                                   :value="option" 
                                   v-model="answers[question.id]"
                                   :disabled="isSubmitting || submissionSuccess"
                                   required />
                            <span class="option-text">{{ option }}</span>
                        </label>
                    </div>
                </div>

                <div class="submit-section">
                    <button type="submit" 
                            class="btn btn-primary submit-button"
                            :disabled="isSubmitting || submissionSuccess">
                        {{ isSubmitting ? 'Submitting...' : 'Submit Quiz' }}
                    </button>
                </div>
            </form>

            <p v-if="message" 
               class="message mt-3" 
               :class="{ 'error': message.includes('Error'), 'success': message.includes('successfully') }">
                {{ message }}
            </p>

            <div v-if="submissionSuccess" class="take-another-section mt-4">
                <button @click="backToSelection" class="btn btn-secondary">
                    Take Another Quiz
                </button>
            </div>
        </div>

        <!-- Answers Modal -->
        <div v-if="showAnswersModal" class="modal-overlay" @click="closeAnswersModal">
            <div class="answers-modal" @click.stop>
                <div class="modal-header">
                    <h3>{{ currentAnswersQuizTitle }}</h3>
                    <span class="close-button" @click="closeAnswersModal">&times;</span>
                </div>
                <div class="modal-content">
                    <p class="timestamp">Completed on {{ formatDate(currentAnswersResult.timestamp) }}</p>
                    <div v-if="currentAnswersResult && currentAnswersResult.answers" class="answers-list">
                        <div v-for="(answer, index) in currentAnswersResult.answers" 
                             :key="index"
                             class="answer-item">
                            <p class="question-text">{{ answer.questionText }}</p>
                            <p class="answer-text">Your Answer: <span class="highlighted">{{ answer.userAnswer }}</span></p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" @click="closeAnswersModal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { quizService, resultsService, authService } from '../services/firebase';
import { useQuizStore } from '../stores/quiz';
import { ref, computed, onMounted } from 'vue';

export default {
    setup() {
        const quizStore = useQuizStore();
        const selectedQuiz = ref(null);
        const quizTitle = ref("");
        const questions = ref([]);
        const answers = ref({});
        const message = ref("");
        const isSubmitting = ref(false);
        const submissionSuccess = ref(false);
        
        // Answers modal state
        const showAnswersModal = ref(false);
        const currentAnswersQuizTitle = ref("");
        const currentAnswersResult = ref(null);

        const availableQuizzes = computed(() => quizStore.availableQuizzes);
        const userResults = computed(() => quizStore.userResults);

        const getQuizResult = (quizId) => {
            // Since we only keep one result per quiz, we can just find the first match
            return userResults.value.find(result => result.quizId === quizId);
        };

        const formatDate = (timestamp) => {
            if (!timestamp) return 'N/A';
            
            // Convert Firestore timestamp to Date object if necessary
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
            
            // If user is logged in, also load their results
            const user = authService.getCurrentUser();
            if (user) {
                await quizStore.loadUserResults();
            }
        };

        const selectQuiz = async (quizId) => {
            const { error } = await quizStore.selectQuiz(quizId);
            if (error) {
                message.value = "Error loading quiz.";
                return;
            }
            
            quizTitle.value = quizStore.currentQuiz.title;
            questions.value = quizStore.currentQuiz.questions;
            selectedQuiz.value = quizId;
            answers.value = {};
            message.value = "";
        };

        const backToSelection = () => {
            selectedQuiz.value = null;
            quizTitle.value = "";
            questions.value = [];
            answers.value = {};
            message.value = "";
            submissionSuccess.value = false;
            quizStore.clearSelectedQuiz();
        };

        const submitQuiz = async () => {
            isSubmitting.value = true;
            message.value = "";
            
            const user = authService.getCurrentUser();
            if (!user) {
                message.value = "You must be logged in to submit the quiz.";
                isSubmitting.value = false;
                return;
            }

            const { resultId, error } = await quizStore.submitQuiz(answers.value);

            if (error) {
                message.value = "Error submitting quiz. Please try again.";
                submissionSuccess.value = false;
            } else {
                message.value = "Quiz submitted successfully!";
                submissionSuccess.value = true;
                // Reload user results to update UI with the new submission
                await quizStore.loadUserResults();
            }
            
            isSubmitting.value = false;
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
            
            // Prevent scrolling of the background
            document.body.style.overflow = 'hidden';
        };
        
        const closeAnswersModal = () => {
            showAnswersModal.value = false;
            currentAnswersQuizTitle.value = "";
            currentAnswersResult.value = null;
            
            // Re-enable scrolling
            document.body.style.overflow = 'auto';
        };

        onMounted(loadQuizzes);

        return {
            availableQuizzes,
            selectedQuiz,
            quizTitle,
            questions,
            answers,
            message,
            isSubmitting,
            submissionSuccess,
            showAnswersModal,
            currentAnswersQuizTitle,
            currentAnswersResult,
            selectQuiz,
            backToSelection,
            submitQuiz,
            getQuizResult,
            formatDate,
            showAnswers,
            closeAnswersModal
        };
    }
};
</script>

<style scoped>
.quiz-container {
    padding: var(--spacing-lg) var(--spacing-md);
}

.section-title {
    text-align: center;
    margin-bottom: var(--spacing-xl);
}

.quiz-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--spacing-lg);
    margin-top: var(--spacing-lg);
}

.quiz-card {
    display: flex;
    flex-direction: column;
    min-height: 200px;
}

.quiz-card-content {
    flex: 1;
    padding: var(--spacing-md);
}

.quiz-card h3 {
    color: var(--text-primary);
    font-size: var(--font-size-lg);
    margin-bottom: var(--spacing-sm);
}

.quiz-description {
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
    margin: var(--spacing-sm) 0;
}

.quiz-history {
    margin: var(--spacing-sm) 0;
    padding: var(--spacing-xs) var(--spacing-sm);
    background: var(--bg-muted);
    border-radius: var(--radius-sm);
}

.quiz-status {
    margin: 0;
    color: var(--text-muted);
    font-size: var(--font-size-xs);
    font-style: italic;
}

.quiz-card-action {
    padding: var(--spacing-md);
    border-top: 1px solid var(--bg-muted);
    display: flex;
    justify-content: center;
}

.button-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);
    width: 100%;
    justify-content: center;
}

.button-group .btn-outline {
    width: 100%;
}

.button-group .btn-text {
    margin-top: -5px; /* Pull the text button closer to the button above it */
    font-size: var(--font-size-sm);
}

.active-quiz {
    max-width: 800px;
    margin: 0 auto;
}

.quiz-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-xl);
    padding-bottom: var(--spacing-md);
    border-bottom: 1px solid var(--bg-muted);
}

.quiz-form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
}

.question-card {
    background: var(--bg-primary);
}

.question-number {
    color: var(--primary);
    font-size: var(--font-size-sm);
    font-weight: 600;
    margin-bottom: var(--spacing-sm);
    display: inline-flex;
    align-items: center;
}

.question-text {
    font-size: var(--font-size-lg);
    color: var(--text-primary);
    margin-bottom: var(--spacing-lg);
    line-height: 1.4;
}

.options-grid {
    display: grid;
    gap: var(--spacing-md);
}

.option-label {
    display: flex;
    align-items: center;
    padding: var(--spacing-md) var(--spacing-lg);
    background: var(--bg-primary);
    border: 1px solid var(--bg-muted);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: border-color var(--transition);
}

.option-label:hover {
    border-color: var(--primary);
}

.option-label input[type="radio"] {
    margin-right: var(--spacing-md);
    width: 20px;
    height: 20px;
    accent-color: var(--primary);
}

.option-text {
    font-size: var(--font-size-md);
    color: var(--text-secondary);
}

.option-label:has(input:checked) {
    border-color: var(--primary);
    background: var(--primary-bg);
}

/* Disabled states */
.option-label:has(input:disabled) {
    opacity: 0.7;
    cursor: not-allowed;
}

.option-label input:disabled + .option-text {
    color: var(--text-muted);
}

.submit-section {
    display: flex;
    justify-content: center;
    margin-top: var(--spacing-xl);
}

.submit-button {
    min-width: 200px;
}

.message {
    text-align: center;
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    background: var(--primary-bg);
    color: var(--primary);
}

.message.error {
    background: var(--error);
    color: white;
}

.message.success {
    background: var(--success);
    color: white;
}

.message.info {
    background: var(--bg-muted);
    color: var(--text-secondary);
}

.take-another-section {
    text-align: center;
}

/* Modal styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--spacing-md);
}

.answers-modal {
    background-color: var(--bg-primary);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    max-width: 800px;
    width: 100%;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
}

.modal-header {
    padding: var(--spacing-md) var(--spacing-lg);
    border-bottom: 1px solid var(--bg-muted);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h3 {
    margin: 0;
    color: var(--text-primary);
}

.close-button {
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--text-muted);
    transition: color var(--transition);
}

.close-button:hover {
    color: var(--text-primary);
}

.modal-content {
    padding: var(--spacing-lg);
    overflow-y: auto;
    flex: 1;
}

.timestamp {
    color: var(--text-muted);
    font-size: var(--font-size-sm);
    margin-bottom: var(--spacing-md);
}

.answers-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
}

.answer-item {
    padding: var(--spacing-md);
    border-radius: var(--radius-sm);
    border: 1px solid var(--bg-muted);
    background-color: var(--bg-secondary);
}

.answer-item .question-text {
    font-size: var(--font-size-md);
    color: var(--text-primary);
    margin-bottom: var(--spacing-sm);
    font-weight: 500;
}

.answer-item .answer-text {
    color: var(--text-secondary);
    margin: 0;
}

.answer-item .highlighted {
    color: var(--primary);
    font-weight: 500;
}

.modal-footer {
    padding: var(--spacing-md) var(--spacing-lg);
    border-top: 1px solid var(--bg-muted);
    display: flex;
    justify-content: flex-end;
}

@media (max-width: 768px) {
    .quiz-container {
        padding: var(--spacing-md) var(--spacing-sm);
    }

    .quiz-header {
        flex-direction: column;
        gap: var(--spacing-md);
        text-align: center;
    }

    .question-card {
        padding: var(--spacing-md);
    }

    .option-label {
        padding: var(--spacing-sm) var(--spacing-md);
    }

    .quiz-card-action {
        padding: var(--spacing-sm);
    }
    
    .answers-modal {
        max-height: calc(100vh - var(--spacing-md) * 2);
    }
    
    .modal-content {
        padding: var(--spacing-md);
    }
}

.btn-text {
    background: none;
    border: none;
    color: var(--primary);
    box-shadow: none;
    padding: var(--spacing-sm) var(--spacing-md);
    font-weight: 500;
    text-decoration: none;
    transition: color var(--transition), transform var(--transition);
}

.btn-text:hover {
    color: var(--primary-dark);
    background: none;
    transform: translateY(-1px);
}

.btn-text:active {
    transform: translateY(0);
}
</style>
