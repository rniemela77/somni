<template>
    <div>
        <h2>Your Quiz Results</h2>
        
        <!-- Quiz Filter -->
        <div class="filter-section">
            <label for="quizFilter">Filter by Quiz: </label>
            <select id="quizFilter" v-model="selectedQuizId" class="quiz-filter">
                <option value="">All Quizzes</option>
                <option v-for="quiz in availableQuizzes" 
                        :key="quiz.id" 
                        :value="quiz.id">
                    {{ quiz.title }}
                </option>
            </select>
        </div>

        <p v-if="loading">Loading...</p>
        <p v-else-if="!filteredResults.length">No results found.</p>
        
        <div v-else class="results-container">
            <div v-for="result in filteredResults" 
                 :key="result.timestamp" 
                 class="result-card">
                <div class="result-header">
                    <h3>{{ result.quizTitle }}</h3>
                    <span class="timestamp">{{ formatDate(result.timestamp) }}</span>
                </div>
                <ul>
                    <li v-for="(answer, index) in result.answers" :key="index">
                        <strong>{{ answer.questionText }}</strong><br />
                        Your Answer: <span class="answer">{{ answer.userAnswer }}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import { db } from "../../firebase";
import {
    doc,
    getDoc,
    query,
    collection,
    where,
    getDocs,
    orderBy,
} from "firebase/firestore";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

export default {
    data() {
        return {
            results: [],
            availableQuizzes: [],
            selectedQuizId: "",
            loading: true,
        };
    },
    computed: {
        filteredResults() {
            if (!this.selectedQuizId) {
                return this.results;
            }
            return this.results.filter(result => result.quizId === this.selectedQuizId);
        }
    },
    methods: {
        formatDate(timestamp) {
            if (!timestamp) return "";
            const date = timestamp.toDate();
            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        },
        async loadQuizzes() {
            try {
                const quizzesSnapshot = await getDocs(collection(db, "quizzes"));
                this.availableQuizzes = quizzesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    title: doc.data().title
                }));
            } catch (error) {
                console.error("Error loading quizzes:", error);
            }
        },
        async loadResults(userId) {
            try {
                // Fetch all user's quiz results
                const resultsQuery = query(
                    collection(db, "results"),
                    where("userId", "==", userId),
                    orderBy("timestamp", "desc")
                );
                const resultsSnapshot = await getDocs(resultsQuery);

                if (resultsSnapshot.empty) {
                    this.results = [];
                    return;
                }

                // Process each result
                const processedResults = await Promise.all(
                    resultsSnapshot.docs.map(async (resultDoc) => {
                        const resultData = resultDoc.data();
                        
                        // Fetch the corresponding quiz
                        const quizRef = doc(db, "quizzes", resultData.quizId);
                        const quizSnap = await getDoc(quizRef);
                        
                        if (!quizSnap.exists()) {
                            console.error(`Quiz ${resultData.quizId} not found`);
                            return null;
                        }

                        const quizData = quizSnap.data();
                        
                        // Combine questions with answers
                        const answers = quizData.questions.map((question) => ({
                            questionText: question.text,
                            userAnswer: resultData.answers[question.id],
                        }));

                        return {
                            quizId: resultData.quizId,
                            quizTitle: quizData.title,
                            timestamp: resultData.timestamp,
                            answers
                        };
                    })
                );

                // Filter out any null results (from quizzes that weren't found)
                this.results = processedResults.filter(result => result !== null);
            } catch (error) {
                console.error("Error fetching results:", error);
            }
        }
    },
    async mounted() {
        await this.loadQuizzes();
        
        onAuthStateChanged(auth, async (user) => {
            if (!user) {
                console.error("User not logged in");
                this.loading = false;
                return;
            }
            
            await this.loadResults(user.uid);
            this.loading = false;
        });
    }
};
</script>

<style scoped>
.filter-section {
    margin: 20px 0;
}

.quiz-filter {
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ddd;
    margin-left: 10px;
    min-width: 200px;
}

.results-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.result-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.result-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
}

.timestamp {
    color: #666;
    font-size: 0.9em;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    margin-bottom: 15px;
    padding: 10px;
    background-color: #f8f9fa;
    border-radius: 4px;
}

strong {
    color: #333;
    display: block;
    margin-bottom: 5px;
}

.answer {
    color: #007bff;
}
</style>