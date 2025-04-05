<template>
    <div>
        <h2>Your Quiz Results</h2>
        
        <!-- User Tags Section -->
        <UserTags class="tags-section" />
        
        <!-- Generate Description Button -->
        <div class="generate-description-section">
            <div class="description-header">
                <button @click="generateDescription" 
                        class="generate-btn"
                        :disabled="generatingDescription">
                    {{ generatingDescription ? 'GENERATING...' : 'GENERATE DESCRIPTION' }}
                </button>
            </div>
            
            <div v-if="coreFeeling" class="feeling-result">
                <h3>Your Core Feeling Analysis</h3>
                <div class="feeling-content">
                    <div v-if="parsedFeeling.core" class="feeling-section core-personality">
                        <h4>Core Personality:</h4>
                        <p>{{ parsedFeeling.core }}</p>
                    </div>
                    <div v-if="parsedFeeling.archetype" class="feeling-section archetype">
                        <h4>Archetype:</h4>
                        <p>{{ parsedFeeling.archetype }}</p>
                    </div>
                    <div v-if="parsedFeeling.keywords" class="feeling-section keywords">
                        <h4>Keywords:</h4>
                        <p class="keyword-list">{{ parsedFeeling.keywords }}</p>
                    </div>
                </div>
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
                    
                    <!-- Add prompt template configuration -->
                    <div class="form-group prompt-templates">
                        <h4>Prompt Templates</h4>
                        <div class="prompt-template-group">
                            <label for="prompt1">Opening Prompt:</label>
                            <textarea id="prompt1" 
                                     v-model="promptTemplates.prompt1"
                                     rows="3"
                                     placeholder="Opening part of the prompt..."></textarea>
                        </div>
                        
                        <div class="prompt-template-group">
                            <label for="prompt2">User Data Placeholder:</label>
                            <p class="template-note">This section will be automatically filled with formatted user responses.</p>
                        </div>
                        
                        <div class="prompt-template-group">
                            <label for="prompt3">Closing Prompt:</label>
                            <textarea id="prompt3" 
                                     v-model="promptTemplates.prompt3"
                                     rows="3"
                                     placeholder="Closing part of the prompt..."></textarea>
                        </div>
                    </div>
                </div>
                
                <div class="dialog-actions">
                    <button @click="saveConfig" class="btn-primary">Save</button>
                    <button @click="resetPrompts" class="btn-reset">Reset Prompts</button>
                    <button @click="closeConfig" class="btn-secondary">Cancel</button>
                </div>
            </div>
        </div>
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
            
            // Core feeling description
            generatingDescription: false,
            coreFeeling: null,
            feelingError: null,
            
            // OpenAI configuration
            openaiConfig: { ...openaiService.getConfig() },
            showConfigDialog: false,
            
            // Prompt templates
            promptTemplates: { ...openaiService.getPromptTemplates('personalityDescription') },
            
            // Parsed feeling
            parsedFeeling: {
                core: null,
                archetype: null,
                keywords: null
            }
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
        
        // OpenAI configuration methods
        openConfig() {
            this.openaiConfig = { ...openaiService.getConfig() };
            this.promptTemplates = { ...openaiService.getPromptTemplates('personalityDescription') };
            this.showConfigDialog = true;
        },
        
        closeConfig() {
            this.showConfigDialog = false;
        },
        
        saveConfig() {
            openaiService.updateConfig(this.openaiConfig);
            openaiService.updatePromptTemplates('personalityDescription', this.promptTemplates);
            this.showConfigDialog = false;
        },
        
        resetPrompts() {
            this.promptTemplates = { ...openaiService.resetPromptTemplates('personalityDescription') };
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
                // Get current templates to display for debugging
                const templates = openaiService.getPromptTemplates('personalityDescription');
                console.log('Using prompt templates:', templates);
                
                // Use the dedicated method for analyzing personality
                const { completion, error, usage } = await openaiService.analyzePersonality(this.allAnswers);
                
                if (error) {
                    this.feelingError = `Error: ${error}`;
                } else {
                    this.coreFeeling = completion;
                    console.log('Token usage:', usage);
                    
                    // Parse the completion into three sections
                    this.parsedFeeling = this.parsePersonalityAnalysis(completion);
                }
            } catch (error) {
                this.feelingError = `Error: ${error.message}`;
            } finally {
                this.generatingDescription = false;
            }
        },
        parsePersonalityAnalysis(text) {
            const result = {
                core: null,
                archetype: null,
                keywords: null
            };
            
            // Check if there's any text to parse
            if (!text || typeof text !== 'string') {
                return result;
            }
            
            // Try to extract sections using regex patterns
            const coreMatch = text.match(/Core Personality:(.+?)(?=Archetype:|Keywords:|$)/s);
            const archetypeMatch = text.match(/Archetype:(.+?)(?=Core Personality:|Keywords:|$)/s);
            const keywordsMatch = text.match(/Keywords:(.+?)(?=Core Personality:|Archetype:|$)/s);
            
            if (coreMatch) {
                result.core = coreMatch[1].trim();
            }
            
            if (archetypeMatch) {
                result.archetype = archetypeMatch[1].trim();
            }
            
            if (keywordsMatch) {
                result.keywords = keywordsMatch[1].trim();
            }
            
            // If regex didn't find structured format, fall back to simple line-based parsing
            if (!result.core && !result.archetype && !result.keywords) {
                const lines = text.split('\n').filter(line => line.trim());
                
                // Assume the first paragraph is core personality
                let currentSection = 0;
                let currentText = '';
                
                for (const line of lines) {
                    if (line.trim() === '') {
                        // Empty line marks section boundary
                        if (currentText) {
                            if (currentSection === 0) {
                                result.core = currentText;
                            } else if (currentSection === 1) {
                                result.archetype = currentText;
                            } else if (currentSection === 2) {
                                result.keywords = currentText;
                            }
                            currentSection++;
                            currentText = '';
                        }
                    } else {
                        currentText += (currentText ? ' ' : '') + line.trim();
                    }
                }
                
                // Handle the last section
                if (currentText) {
                    if (currentSection === 0) {
                        result.core = currentText;
                    } else if (currentSection === 1) {
                        result.archetype = currentText;
                    } else if (currentSection === 2) {
                        result.keywords = currentText;
                    }
                }
            }
            
            return result;
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

.generate-description-section {
    margin: 20px 0;
    padding: 20px;
    background-color: #f9f6ff;
    border-radius: 8px;
    border: 1px solid #e1d7f5;
}

.description-header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 15px;
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

.settings-btn {
    display: none;
}

.feeling-result {
    margin-top: 20px;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    border-left: 4px solid #4527a0;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.feeling-result h3 {
    margin-top: 0;
    color: #4527a0;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 10px;
    margin-bottom: 15px;
}

.feeling-content {
    line-height: 1.6;
    font-size: 1.05rem;
    color: #333;
}

.feeling-section {
    margin-bottom: 20px;
    padding: 15px;
    border-radius: 6px;
    background-color: #f9f7fe;
}

.feeling-section:last-child {
    margin-bottom: 0;
}

.core-personality {
    border-left: 3px solid #5e35b1;
}

.archetype {
    border-left: 3px solid #7e57c2;
}

.keywords {
    border-left: 3px solid #9575cd;
}

.feeling-section h4 {
    color: #4527a0;
    margin-top: 0;
    margin-bottom: 10px;
    font-weight: 600;
}

.feeling-section p {
    margin: 0;
    line-height: 1.5;
}

.keyword-list {
    font-style: italic;
}

.feeling-error {
    margin-top: 15px;
    padding: 10px;
    background-color: #ffebee;
    color: #c62828;
    border-radius: 4px;
    border-left: 4px solid #c62828;
}

/* Prompt Templates Styles */
.prompt-templates {
    margin-top: 25px;
    border-top: 1px solid #e0e0e0;
    padding-top: 15px;
}

.prompt-template-group {
    margin-bottom: 15px;
}

.prompt-template-group textarea {
    width: 100%;
    font-family: monospace;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.9rem;
}

.template-note {
    font-size: 0.85rem;
    color: #666;
    margin: 5px 0;
    font-style: italic;
}

.btn-reset {
    background-color: #f5a623;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
}
</style>