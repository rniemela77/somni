<template>
    <div>
        <!-- Quiz Selection Section -->
        <div v-if="!selectedQuiz">
            <h2>Select a Quiz</h2>
            <div v-if="availableQuizzes.length === 0">
                <p>Loading quizzes...</p>
            </div>
            <div v-else class="quiz-list">
                <div v-for="quiz in availableQuizzes" 
                     :key="quiz.id" 
                     class="quiz-item"
                     @click="selectQuiz(quiz.id)">
                    <h3>{{ quiz.title }}</h3>
                </div>
            </div>
        </div>

        <!-- Quiz Questions Section -->
        <div v-else>
            <h2>{{ quizTitle }}</h2>
            <form @submit.prevent="submitQuiz">
                <div v-for="(question, index) in questions" :key="question.id">
                    <p>{{ question.text }}</p>
                    <div>
                        <label v-for="(option, i) in question.options" :key="i">
                            <input type="radio" :name="'question-' + index" :value="option" v-model="answers[question.id]"
                                required />
                            {{ option }}
                        </label>
                    </div>
                </div>
                <div class="button-group">
                    <button type="button" @click="backToSelection">Back to Quiz Selection</button>
                    <button type="submit">Submit</button>
                </div>
            </form>
            <p v-if="message">{{ message }}</p>
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
form {
    margin-top: 20px;
}

.quiz-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.quiz-item {
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.quiz-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-color: #007bff;
}

.button-group {
    margin-top: 20px;
    display: flex;
    gap: 10px;
}

button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
</style>
