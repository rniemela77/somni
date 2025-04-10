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
                     class="card card-interactive quiz-card"
                     @click="selectQuiz(quiz.id)">
                    <h3>{{ quiz.title }}</h3>
                    <p class="quiz-description">Click to start this quiz</p>
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
    </div>
</template>

<script>
import { quizService, resultsService, authService } from '../services/firebase';

export default {
    data() {
        return {
            availableQuizzes: [],
            selectedQuiz: null,
            quizTitle: "",
            questions: [],
            answers: {},
            message: "",
            isSubmitting: false,
            submissionSuccess: false,
        };
    },
    async mounted() {
        await this.loadQuizzes();
    },
    methods: {
        async loadQuizzes() {
            const { quizzes, error } = await quizService.getAllQuizzes();
            if (error) {
                this.message = "Error loading quizzes.";
                return;
            }
            this.availableQuizzes = quizzes;
        },
        async selectQuiz(quizId) {
            const { quiz, error } = await quizService.getQuizById(quizId);
            if (error) {
                this.message = "Error loading quiz.";
                return;
            }
            
            this.quizTitle = quiz.title;
            this.questions = quiz.questions;
            this.selectedQuiz = quizId;
            this.answers = {};
            this.message = "";
        },
        backToSelection() {
            this.selectedQuiz = null;
            this.quizTitle = "";
            this.questions = [];
            this.answers = {};
            this.message = "";
            this.submissionSuccess = false;
        },
        async submitQuiz() {
            this.isSubmitting = true;
            this.message = "";
            
            const user = authService.getCurrentUser();
            if (!user) {
                this.message = "You must be logged in to submit the quiz.";
                this.isSubmitting = false;
                return;
            }

            const { resultId, error } = await resultsService.submitQuizResult(
                user.uid,
                this.selectedQuiz,
                this.answers
            );

            if (error) {
                this.message = "Error submitting quiz. Please try again.";
                this.submissionSuccess = false;
            } else {
                this.message = "Quiz submitted successfully!";
                this.submissionSuccess = true;
            }
            
            this.isSubmitting = false;
        },
    },
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
    justify-content: space-between;
    min-height: 200px;
}

.quiz-card h3 {
    color: var(--text-primary);
    font-size: var(--font-size-lg);
    margin-bottom: var(--spacing-sm);
}

.quiz-description {
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
    margin: 0;
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

.take-another-section {
    text-align: center;
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
}
</style>
