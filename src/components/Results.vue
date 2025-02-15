<template>
    <div>
        <h2>Your Quiz Results</h2>
        
        <!-- User Tags Section -->
        <UserTags class="tags-section" />
        
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
import { quizService, resultsService, authService } from '../services/firebase';
import UserTags from './UserTags.vue';

export default {
    components: {
        UserTags
    },
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
            const { quizzes, error } = await quizService.getAllQuizzes();
            if (error) {
                console.error("Error loading quizzes:", error);
                return;
            }
            this.availableQuizzes = quizzes;
        },
        async loadResults() {
            const user = authService.getCurrentUser();
            if (!user) {
                console.error("User not logged in");
                this.loading = false;
                return;
            }

            const { results, error } = await resultsService.getUserResults(user.uid);
            if (error) {
                console.error("Error fetching results:", error);
                return;
            }

            this.results = results;
            this.loading = false;
        }
    },
    async mounted() {
        await this.loadQuizzes();
        await this.loadResults();
    }
};
</script>

<style scoped>
.tags-section {
    margin-bottom: var(--spacing-xl);
}

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