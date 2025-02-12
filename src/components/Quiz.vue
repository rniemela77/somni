<template>
    <div class="quiz-container">
        <!-- Quiz Selection Section -->
        <div v-if="!selectedQuiz">
            <h2>Select a Quiz</h2>
            <div v-if="availableQuizzes.length === 0" class="message">
                <p>Loading quizzes...</p>
            </div>
            <div v-else class="quiz-grid">
                <div v-for="quiz in availableQuizzes" 
                     :key="quiz.id" 
                     class="quiz-card">
                    <h3>{{ quiz.title }}</h3>
                    <div class="quiz-card-footer">
                        <button class="start-button" @click="selectQuiz(quiz.id)">Start Quiz</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quiz Questions Section -->
        <div v-else class="active-quiz">
            <div class="quiz-header">
                <h2>{{ quizTitle }}</h2>
                <button class="back-button" @click="backToSelection">
                    ← Back to Quiz Selection
                </button>
            </div>

            <form @submit.prevent="submitQuiz" class="quiz-form">
                <div v-for="(question, index) in questions" 
                     :key="question.id"
                     class="question-card">
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
                                   required />
                            <span class="option-text">{{ option }}</span>
                        </label>
                    </div>
                </div>

                <div class="submit-section">
                    <button type="submit" class="submit-button">Submit Quiz</button>
                </div>
            </form>

            <p v-if="message" class="message" :class="{ 'error': message.includes('Error') }">
                {{ message }}
            </p>
        </div>
    </div>
</template>

<script>
import { db } from "../../firebase";
import { collection, addDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { auth } from "../../firebase";

export default {
    data() {
        return {
            availableQuizzes: [],
            selectedQuiz: null,
            quizTitle: "",
            questions: [],
            answers: {},
            message: "",
        };
    },
    async mounted() {
        await this.loadQuizzes();
    },
    methods: {
        async loadQuizzes() {
            try {
                const quizzesSnapshot = await getDocs(collection(db, "quizzes"));
                this.availableQuizzes = quizzesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    title: doc.data().title
                }));
            } catch (error) {
                console.error("Error loading quizzes:", error);
                this.message = "Error loading quizzes.";
            }
        },
        async selectQuiz(quizId) {
            try {
                const quizRef = doc(db, "quizzes", quizId);
                const quizSnap = await getDoc(quizRef);

                if (quizSnap.exists()) {
                    const quizData = quizSnap.data();
                    this.quizTitle = quizData.title;
                    this.questions = quizData.questions;
                    this.selectedQuiz = quizId;
                    this.answers = {};
                    this.message = "";
                } else {
                    console.error("Quiz document does not exist!");
                    this.message = "Error: Quiz not found.";
                }
            } catch (error) {
                console.error("Error fetching quiz data:", error);
                this.message = "Error loading quiz.";
            }
        },
        backToSelection() {
            this.selectedQuiz = null;
            this.quizTitle = "";
            this.questions = [];
            this.answers = {};
            this.message = "";
        },
        async submitQuiz() {
            try {
                const user = auth.currentUser;
                if (!user) {
                    this.message = "You must be logged in to submit the quiz.";
                    return;
                }
                const userId = user.uid;

                await addDoc(collection(db, "results"), {
                    userId: userId,
                    quizId: this.selectedQuiz,
                    answers: this.answers,
                    timestamp: new Date(),
                });
                this.message = "Quiz submitted successfully!";
                this.answers = {};
            } catch (error) {
                console.error("Error submitting quiz:", error);
                this.message = "Error submitting quiz. Please try again.";
            }
        },
    },
};
</script>

<style scoped>
.quiz-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.quiz-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.quiz-card {
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.quiz-card h3 {
    margin: 0 0 15px 0;
    color: #333;
}

.quiz-card-footer {
    margin-top: 15px;
}

.start-button {
    width: 100%;
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.start-button:hover {
    background-color: #0056b3;
}

.active-quiz {
    background: white;
    border-radius: 8px;
    padding: 20px;
}

.quiz-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
}

.back-button {
    background: none;
    border: none;
    color: #007bff;
    cursor: pointer;
    font-size: 1em;
    padding: 5px 10px;
    transition: color 0.2s;
}

.back-button:hover {
    color: #0056b3;
}

.quiz-form {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.question-card {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.question-number {
    color: #666;
    font-size: 0.9em;
    margin-bottom: 8px;
}

.question-text {
    font-size: 1.1em;
    color: #333;
    margin-bottom: 15px;
    font-weight: 500;
}

.options-grid {
    display: grid;
    gap: 12px;
}

.option-label {
    display: flex;
    align-items: center;
    padding: 12px;
    background: white;
    border: 1px solid #ddd;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
}

.option-label:hover {
    border-color: #007bff;
    background: #f0f7ff;
}

.option-label input[type="radio"] {
    margin-right: 12px;
}

.option-text {
    font-size: 1em;
    color: #444;
}

.submit-section {
    margin-top: 30px;
    display: flex;
    justify-content: center;
}

.submit-button {
    background-color: #28a745;
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 5px;
    font-size: 1.1em;
    cursor: pointer;
    transition: background-color 0.2s;
}

.submit-button:hover {
    background-color: #218838;
}

.message {
    margin-top: 20px;
    padding: 12px;
    border-radius: 5px;
    text-align: center;
    background-color: #d4edda;
    color: #155724;
}

.message.error {
    background-color: #f8d7da;
    color: #721c24;
}

@media (max-width: 768px) {
    .quiz-header {
        flex-direction: column;
        gap: 15px;
        text-align: center;
    }

    .options-grid {
        grid-template-columns: 1fr;
    }
}
</style>
