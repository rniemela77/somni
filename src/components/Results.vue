<template>
    <div>
        <h2>Your Quiz Results</h2>
        
        <!-- User Tags Section -->
        <UserTags class="tags-section" />
        
        <!-- Generate Description Button -->
        <div class="generate-description-section">
            <button @click="generateDescription" 
                    class="generate-btn"
                    :disabled="generatingDescription">
                {{ generatingDescription ? 'GENERATING...' : 'GENERATE DESCRIPTION' }}
            </button>
            
            <div v-if="coreFeeling" class="feeling-result">
                <h3>Your Core Feeling Analysis</h3>
                <p class="feeling-content">{{ coreFeeling }}</p>
            </div>
            
            <div v-if="feelingError" class="feeling-error">
                {{ feelingError }}
            </div>
        </div>
        
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
                
                <!-- OpenAI analysis button -->
                <div class="analysis-section">
                    <button @click="analyzeResult(result)" 
                            class="analyze-btn"
                            :disabled="analyzing === result.id">
                        {{ analyzing === result.id ? 'Analyzing...' : 'Analyze with AI' }}
                    </button>
                    
                    <div v-if="result.id === currentAnalysisId && aiAnalysis" class="analysis-result">
                        <h4>AI Analysis</h4>
                        <div class="analysis-content">{{ aiAnalysis }}</div>
                    </div>
                    
                    <div v-if="result.id === currentAnalysisId && aiError" class="analysis-error">
                        {{ aiError }}
                    </div>
                </div>
            </div>
        </div>
        
        <!-- OpenAI Configuration Dialog -->
        <div v-if="showConfigDialog" class="config-dialog-overlay">
            <div class="config-dialog">
                <h3>OpenAI Configuration</h3>
                <div class="config-form">
                    <div class="form-group">
                        <label for="model">Model:</label>
                        <select id="model" v-model="openaiConfig.model">
                            <option value="gpt-4">GPT-4</option>
                            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="temperature">Temperature:</label>
                        <input type="range" id="temperature" 
                               v-model.number="openaiConfig.temperature" 
                               min="0" max="1" step="0.1">
                        <span>{{ openaiConfig.temperature }}</span>
                    </div>
                    
                    <div class="form-group">
                        <label for="maxTokens">Max Tokens:</label>
                        <input type="number" id="maxTokens" 
                               v-model.number="openaiConfig.max_tokens" 
                               min="100" max="4000">
                    </div>
                </div>
                
                <div class="dialog-actions">
                    <button @click="saveConfig" class="btn-primary">Save</button>
                    <button @click="closeConfig" class="btn-secondary">Cancel</button>
                </div>
            </div>
        </div>
        
        <!-- OpenAI Config Button -->
        <button @click="openConfig" class="config-btn">
            <span>AI Settings</span>
        </button>
    </div>
</template>

<script>
import { quizService, resultsService, authService } from '../services/firebase';
import { openaiService } from '../services/openai';
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
            
            // OpenAI analysis related data
            analyzing: null,
            aiAnalysis: null,
            aiError: null,
            currentAnalysisId: null,
            
            // Core feeling description
            generatingDescription: false,
            coreFeeling: null,
            feelingError: null,
            
            // OpenAI configuration
            openaiConfig: { ...openaiService.getConfig() },
            showConfigDialog: false
        };
    },
    computed: {
        filteredResults() {
            if (!this.selectedQuizId) {
                return this.results;
            }
            return this.results.filter(result => result.quizId === this.selectedQuizId);
        },
        // Compute all answers across all quizzes
        allAnswers() {
            const answers = [];
            this.results.forEach(result => {
                result.answers.forEach(answer => {
                    answers.push({
                        question: answer.questionText,
                        answer: answer.userAnswer,
                        quizTitle: result.quizTitle
                    });
                });
            });
            return answers;
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
                this.feelingError = "You must be logged in to view results";
                return;
            }

            this.loading = true; // Make sure loading is true when starting to load
            
            try {
                const { results, error } = await resultsService.getUserResults(user.uid);
                if (error) {
                    console.error("Error fetching results:", error);
                    this.feelingError = `Error loading results: ${error}`;
                    return;
                }

                console.log("Loaded results:", results);
                this.results = results;
                
                // If no results were loaded, show message
                if (results.length === 0) {
                    this.feelingError = "No quiz results found. Please take some quizzes first.";
                }
            } catch (err) {
                console.error("Exception in loadResults:", err);
                this.feelingError = `Error: ${err.message}`;
            } finally {
                this.loading = false;
            }
        },
        
        // OpenAI analysis methods
        async analyzeResult(result) {
            this.aiAnalysis = null;
            this.aiError = null;
            this.analyzing = result.id;
            this.currentAnalysisId = result.id;
            
            try {
                console.log(`Analyzing quiz "${result.quizTitle}" with ${result.answers.length} answers`);
                
                const { completion, error, usage } = await openaiService.analyzeQuizResults(
                    result.answers,
                    result.quizTitle
                );
                
                if (error) {
                    this.aiError = `Error: ${error}`;
                } else {
                    this.aiAnalysis = completion;
                    console.log('Token usage:', usage);
                }
            } catch (error) {
                this.aiError = `Error: ${error.message}`;
            } finally {
                this.analyzing = null;
            }
        },
        
        // OpenAI configuration methods
        openConfig() {
            this.openaiConfig = { ...openaiService.getConfig() };
            this.showConfigDialog = true;
        },
        
        closeConfig() {
            this.showConfigDialog = false;
        },
        
        saveConfig() {
            openaiService.updateConfig(this.openaiConfig);
            this.showConfigDialog = false;
        },
        
        // Generate core feeling description from all answers
        async generateDescription() {
            // Debug the results data
            console.log('Results data:', this.results);
            console.log('Computed all answers:', this.allAnswers);
            
            // Make sure results are loaded before proceeding
            if (this.loading) {
                this.feelingError = "Results are still loading, please wait...";
                return;
            }
            
            // Force reload results if they're empty
            if (this.results.length === 0) {
                this.feelingError = "Loading quiz results...";
                await this.loadResults();
                
                // Check again after loading
                if (this.results.length === 0) {
                    this.feelingError = "No quiz results available to analyze. Please take some quizzes first.";
                    return;
                }
            }
            
            // Verify we have answers to analyze
            if (this.allAnswers.length === 0) {
                this.feelingError = "No quiz answers found. Please make sure you have completed quizzes with answers.";
                return;
            }
            
            this.generatingDescription = true;
            this.coreFeeling = null;
            this.feelingError = null;
            
            try {
                // Use the dedicated method for analyzing personality
                const { completion, error } = await openaiService.analyzePersonality(this.allAnswers);
                
                if (error) {
                    this.feelingError = `Error: ${error}`;
                } else {
                    this.coreFeeling = completion;
                }
            } catch (error) {
                this.feelingError = `Error: ${error.message}`;
            } finally {
                this.generatingDescription = false;
            }
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

/* OpenAI Analysis Styles */
.analysis-section {
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px dashed #ddd;
}

.analyze-btn {
    background-color: #5e35b1;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s;
}

.analyze-btn:hover {
    background-color: #4527a0;
}

.analyze-btn:disabled {
    background-color: #9e9e9e;
    cursor: not-allowed;
}

.analysis-result {
    margin-top: 15px;
    padding: 15px;
    background-color: #f0f4f8;
    border-radius: 4px;
    border-left: 4px solid #5e35b1;
}

.analysis-content {
    white-space: pre-line;
    line-height: 1.5;
}

.analysis-error {
    margin-top: 15px;
    padding: 10px;
    background-color: #ffebee;
    color: #c62828;
    border-radius: 4px;
    border-left: 4px solid #c62828;
}

/* Config Dialog Styles */
.config-dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.config-dialog {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    width: 400px;
    max-width: 90%;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.config-form {
    margin: 20px 0;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.btn-primary {
    background-color: #5e35b1;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
}

.btn-secondary {
    background-color: #f5f5f5;
    color: #333;
    border: 1px solid #ddd;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
}

.config-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #5e35b1;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.config-btn:hover {
    background-color: #4527a0;
}

/* Generate Description Styles */
.generate-description-section {
    margin: 20px 0;
    padding: 20px;
    background-color: #f9f6ff;
    border-radius: 8px;
    border: 1px solid #e1d7f5;
}

.generate-btn {
    background-color: #4527a0;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    font-size: 1rem;
    letter-spacing: 0.5px;
    transition: background-color 0.2s, transform 0.1s;
}

.generate-btn:hover {
    background-color: #3a1f8c;
    transform: translateY(-1px);
}

.generate-btn:disabled {
    background-color: #9e9e9e;
    cursor: not-allowed;
    transform: none;
}

.feeling-result {
    margin-top: 20px;
    padding: 15px;
    background-color: #fff;
    border-radius: 6px;
    border-left: 4px solid #4527a0;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.feeling-result h3 {
    margin-top: 0;
    color: #4527a0;
}

.feeling-content {
    line-height: 1.6;
    font-size: 1.05rem;
    color: #333;
}

.feeling-error {
    margin-top: 15px;
    padding: 10px;
    background-color: #ffebee;
    color: #c62828;
    border-radius: 4px;
    border-left: 4px solid #c62828;
}
</style>