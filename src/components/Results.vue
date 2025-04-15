<template>
    <div>
        <h2 class="section-title">Your Quiz Results</h2>
        
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

export default {
    components: {},
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

            this.loading = true; // Make sure loading is true when starting to load
            
            try {
                const { results, error } = await resultsService.getUserResults(user.uid);
                if (error) {
                    console.error("Error fetching results:", error);
                    return;
                }

                console.log("Loaded results:", results);
                this.results = results;
            } catch (err) {
                console.error("Exception in loadResults:", err);
            } finally {
                this.loading = false;
            }
        }
    },
    async mounted() {
        console.log('Loading quiz data...');
        await this.loadQuizzes();
        await this.loadResults();
    }
};
</script>

<style scoped>
.tags-section {
    margin-bottom: var(--spacing-lg);
}

.filter-section {
    margin: 24px 0;
    display: flex;
    align-items: center;
}

.quiz-filter {
    padding: 8px 12px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--bg-muted);
    margin-left: 12px;
    min-width: 200px;
    background-color: var(--bg-primary);
    color: var(--text-primary);
    transition: all var(--transition-fast);
    font-size: 0.9rem;
}

.quiz-filter:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 1px var(--primary-bg);
}

.quiz-filter:hover:not(:focus) {
    border-color: var(--text-muted);
}

.results-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.result-card {
    border: none;
    border-radius: var(--radius-sm);
    padding: 20px;
    background-color: var(--bg-primary);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
    position: relative;
    overflow: hidden;
    transition: all var(--transition-normal);
}

.result-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 2px;
    height: 0;
    background-color: var(--primary-light);
    transition: height var(--transition-normal);
}

.result-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.result-card:hover::before {
    height: 100%;
}

.result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--bg-muted);
}

.timestamp {
    color: var(--text-muted);
    font-size: 0.9em;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    margin-bottom: 15px;
    padding: 14px;
    background-color: var(--bg-secondary);
    border-radius: var(--radius-sm);
    position: relative;
    border-left: none;
}

li::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 2px;
    background-color: var(--primary-light);
    opacity: 0.6;
}

li:hover {
    background-color: rgba(140, 156, 214, 0.05);
}

strong {
    color: var(--text-primary);
    display: block;
    margin-bottom: 5px;
}

.answer {
    color: var(--primary);
}

/* Main page title */
h2.section-title {
    font-size: 1.4rem;
    margin-bottom: var(--spacing-xl);
    color: var(--text-primary);
    letter-spacing: -0.01em;
    font-weight: 500;
    position: relative;
    display: inline-block;
    max-width: 950px;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
}

h2.section-title::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 0;
    width: 30px;
    height: 1px;
    background-color: var(--primary-light);
}
</style>