<template>
  <div class="personality-dashboard">
    
    
    <div class="feeling-result">
      <div>
        <h3>
          Your Personality Dashboard
          
          <!-- Generate Description Button -->
          <div class="generate-description-section">
            <div class="description-header">
              <button @click="generateDescription" 
                      class="generate-btn"
                      :disabled="buttonDisabled">
                  {{ generateButtonText }}
              </button>
              <!-- No quizzes message -->
              <div v-if="noQuizzesCompleted" class="no-quizzes-message">
              No quizzes completed yet.
                <br>
                <router-link to="/quiz">Take a quiz now</router-link>
              </div>
            </div>
          </div>
        </h3>
      </div>

      <!-- Loading state -->
    <div v-if="dashboardLoading" class="dashboard-loading">
      <div class="spinner"></div>
      <p>Loading your Personality Dashboard...</p>
    </div>
      
    <!-- Personality Dashboard Section -->
    <div v-else>
      <!-- Use the new PersonalityAnalysisSection component -->
      <PersonalityAnalysisSection 
        :parsedFeeling="parsedFeeling"
        :displayDimensions="displayDimensions"
        :hasDimensionValues="hasDimensionValues"
      />
    </div>
    </div>
  </div>
</template>

<script>
import { quizService, resultsService, authService } from '../services/firebase';
import { openaiService } from '../services/openai';
import { 
  updateDimensionValue, 
  getUserPersonality, 
  updateUserPersonalityAnalysis, 
  getUserPersonalityAnalysis 
} from '../../firebase';
import { 
  PERSONALITY_DIMENSIONS, 
  PERSONALITY_ANALYSIS_SECTIONS 
} from '../config/personalityAnalysis';
import { useAuthStore } from '../stores/auth';
import PersonalityAnalysisSection from './PersonalityAnalysisSection.vue';

export default {
  name: 'PersonalityDashboard',
  components: {
    PersonalityAnalysisSection
  },
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  data() {
    return {
      results: [],
      dashboardLoading: false,
      
      // Core feeling description
      generatingDescription: false,
      coreFeeling: null,
      
      // Parsed feeling (using configuration)
      parsedFeeling: {
        dimensions: {},
      },
      
      // User dimensions
      userDimensions: {},
      
      // Personality tags
      userTags: [],
      
      // Dimensions updated flag
      dimensionsUpdated: false,
      
      // Flag to show if we have saved analysis data
      hasSavedAnalysis: false,
      
      // Flag to determine if a full analysis is needed
      needsFullAnalysis: false,
      
      // Configuration
      personalityDimensions: PERSONALITY_DIMENSIONS,
      personalityAnalysisSections: PERSONALITY_ANALYSIS_SECTIONS
    };
  },
  computed: {
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
    },
    // Get dimensions that should be displayed in the sliders
    displayDimensions() {
      // After analysis is done, use the parsed dimensions
      if (this.coreFeeling && this.parsedFeeling.dimensions) {
        return this.parsedFeeling.dimensions;
      }
      // Otherwise use the user's stored dimensions
      return this.userDimensions;
    },
    // Computed property for generate button text
    generateButtonText() {
      if (this.generatingDescription) {
        return 'GENERATING...';
      } else {
        return 'GENERATE NEW ANALYSIS';
      }
    },
    // Check if there are no quizzes completed
    noQuizzesCompleted() {
      return this.results.length === 0;
    },
    // Determine if the button should be disabled
    buttonDisabled() {
      return this.generatingDescription || this.noQuizzesCompleted;
    },
    hasDimensionValues() {
      return Object.values(this.displayDimensions).some(value => value !== null && !isNaN(value));
    }
  },
  methods: {
    // Get dimension value with fallback
    getDimensionValue(key) {
      return this.userDimensions[key] ?? 0;
    },
    
    // Convert dimension value (-2 to 2) to position percentage (0 to 100)
    getMarkerPosition(value) {
      // Convert from -2,2 range to 0,100 range
      return ((value + 2) / 4) * 100;
    },
    
    // Load user's personality data
    async loadUserPersonality() {
      // If auth is not ready, don't try to load
      if (this.authStore.loading) {
        console.log('Auth still loading, delaying loadUserPersonality');
        return;
      }
      
      const user = authService.getCurrentUser();
      if (user) {
        try {
          const userData = await getUserPersonality(user.uid);
          this.userDimensions = userData.dimensions || {};
          this.userTags = userData.tags || [];
        } catch (error) {
          console.error("Error loading user personality:", error);
        }
      }
    },
    
    async loadResults() {
      // If auth is not ready, don't try to load
      if (this.authStore.loading) {
        console.log('Auth still loading, delaying loadResults');
        return;
      }
      
      const user = authService.getCurrentUser();
      if (!user) {
        console.error("User not logged in");
        return;
      }
      
      try {
        const { results, error } = await resultsService.getUserResults(user.uid);
        if (error) {
          console.error("Error fetching results:", error);
          return;
        }

        console.log("Loaded results:", results);
        this.results = results;
        
        // If no results were loaded, log a message
        if (results.length === 0) {
          console.log("No quiz results found. Please take some quizzes first.");
        }
      } catch (err) {
        console.error("Exception in loadResults:", err);
      }
    },
    
    // Generate core feeling description from all answers
    async generateDescription() {
      // Debug the results data
      console.log('Results data:', this.results);
      console.log('Computed all answers:', this.allAnswers);
      
      // Make sure results are loaded before proceeding
      if (this.results.length === 0) {
        console.log("Loading quiz results...");
        await this.loadResults();
        
        // Check again after loading
        if (this.results.length === 0) {
          console.log("No quiz results available to analyze. Please take some quizzes first.");
          return;
        }
      }
      
      // Verify we have answers to analyze
      if (this.allAnswers.length === 0) {
        console.log("No quiz answers found. Please make sure you have completed quizzes with answers.");
        return;
      }
      
      this.generatingDescription = true;
      this.coreFeeling = null;
      this.dimensionsUpdated = false; // Reset dimensions updated flag
      this.hasSavedAnalysis = false;  // Reset the saved analysis flag
      this.needsFullAnalysis = false; // Reset the needs full analysis flag
      
      try {
        // Get current templates to display for debugging
        const templates = openaiService.getPromptTemplates('personalityDescription');
        console.log('Using prompt templates:', templates);
        
        // Use the dedicated method for analyzing personality
        const { completion, error, usage } = await openaiService.analyzePersonality(this.allAnswers);
        
        if (error) {
          console.error(`Error: ${error}`);
        } else {
          this.coreFeeling = completion;
          console.log('Token usage:', usage);
          
          // Parse the completion into three sections
          this.parsedFeeling = this.parsePersonalityAnalysis(completion);
        }
      } catch (error) {
        console.error(`Error generating description: ${error.message}`);
      } finally {
        this.generatingDescription = false;
      }
    },
    
    parsePersonalityAnalysis(text) {
      // Initialize parsed result with dimensions from config
      const result = {
        dimensions: {}
      };
      
      // Initialize all dimensions with default values
      Object.keys(this.personalityDimensions).forEach(key => {
        result.dimensions[key] = 0;
      });
      
      // Initialize all analysis sections with null
      Object.keys(this.personalityAnalysisSections).forEach(key => {
        result[key] = null;
      });
      
      // Check if there's any text to parse
      if (!text || typeof text !== 'string') {
        console.warn('No text to parse in parsePersonalityAnalysis');
        return result;
      }
      
      console.log('Parsing personality analysis text, length:', text.length);
      console.log('Text sample:', text.substring(0, 200) + '...');
      
      // Extract MBTI dimensions using config
      const dimensionsSection = text.match(/DIMENSIONS:([\s\S]*?)(?=Core Personality:|$)/i);
      if (dimensionsSection) {
        console.log('Found dimensions section');
        const dimensionsText = dimensionsSection[1];
        
        // Extract each dimension value using config
        Object.keys(this.personalityDimensions).forEach(dimensionKey => {
          const dimension = this.personalityDimensions[dimensionKey];
          const regex = new RegExp(`${dimensionKey}:\\s*([-+]?\\d+(\\.\\d+)?)`, 'i');
          const match = dimensionsText.match(regex);
          
          if (match) {
            result.dimensions[dimensionKey] = parseFloat(match[1]);
            console.log(`Parsed ${dimensionKey}:`, result.dimensions[dimensionKey]);
          }
        });
      } else {
        console.warn('No dimensions section found in the text');
      }
      
      // Extract each analysis section using config
      Object.keys(this.personalityAnalysisSections).forEach(sectionKey => {
        const section = this.personalityAnalysisSections[sectionKey];
        const regex = new RegExp(`${section.title}:(.+?)(?=${Object.values(this.personalityAnalysisSections).map(s => s.title).join('|')}:|$)`, 'is');
        const match = text.match(regex);
        
        if (match) {
          result[sectionKey] = match[1].trim();
          console.log(`Parsed ${section.title}:`, result[sectionKey]?.substring(0, 50) + '...');
        } else {
          console.warn(`No ${section.title} section found`);
        }
      });
      
      // If regex didn't find structured format, fall back to simple line-based parsing
      const allSectionsEmpty = Object.keys(this.personalityAnalysisSections).every(key => !result[key]);
      
      if (allSectionsEmpty) {
        console.log('Using fallback line-based parsing');
        const lines = text.split('\n').filter(line => line.trim());
        
        // Get section keys in order of display
        const sectionKeys = Object.keys(this.personalityAnalysisSections);
        
        let currentSection = 0;
        let currentText = '';
        
        for (const line of lines) {
          if (line.trim() === '') {
            // Empty line marks section boundary
            if (currentText && currentSection < sectionKeys.length) {
              result[sectionKeys[currentSection]] = currentText;
              console.log(`Set ${sectionKeys[currentSection]} from line parsing`);
              currentSection++;
              currentText = '';
            }
          } else {
            currentText += (currentText ? ' ' : '') + line.trim();
          }
        }
        
        // Handle the last section
        if (currentText && currentSection < sectionKeys.length) {
          result[sectionKeys[currentSection]] = currentText;
          console.log(`Set ${sectionKeys[currentSection]} from last section`);
        }
      }
      
      console.log('Final parsed data:', {
        dimensions: result.dimensions,
        sections: Object.keys(this.personalityAnalysisSections).map(key => 
          `${key}: ${result[key] ? 'Present' : 'Missing'}`)
      });
      
      // Update user profile with new dimension values
      this.updateUserProfile(result);
      
      return result;
    },
    
    // Update user's personality profile with all the parsed data
    async updateUserProfile(parsedResult) {
      try {
        const user = authService.getCurrentUser();
        if (!user) {
          console.error('Cannot update profile: no user logged in');
          return;
        }
        
        console.log('Updating user profile with parsed results');
        
        // Update each dimension that has a valid value
        for (const [dimension, value] of Object.entries(parsedResult.dimensions)) {
          if (value !== null && !isNaN(value)) {
            // Clamp values to valid range (-2 to 2)
            const dimensionConfig = this.personalityDimensions[dimension];
            const [min, max] = dimensionConfig.range;
            const clampedValue = Math.max(min, Math.min(max, value));
            
            await updateDimensionValue(user.uid, dimension, clampedValue);
            
            // Update local dimensions
            this.userDimensions[dimension] = clampedValue;
            this.parsedFeeling.dimensions[dimension] = clampedValue;
          }
        }
        
        // Prepare the analysis data for saving from all analysis sections
        const analysisDataToSave = {};
        
        Object.keys(this.personalityAnalysisSections).forEach(sectionKey => {
          analysisDataToSave[sectionKey] = parsedResult[sectionKey] || null;
          
          // Also update local parsed feeling data
          this.parsedFeeling[sectionKey] = parsedResult[sectionKey];
        });
        
        console.log('Saving personality analysis data:', analysisDataToSave);
        
        await updateUserPersonalityAnalysis(user.uid, analysisDataToSave);
        console.log('Successfully updated user personality analysis in Firebase');
        
        // Set flags
        this.dimensionsUpdated = true;
        this.hasSavedAnalysis = true;
        this.needsFullAnalysis = false;
        
        // Reload the saved data to confirm it was saved correctly
        await this.loadSavedPersonalityAnalysis();
      } catch (error) {
        console.error('Error updating user profile:', error);
      }
    },
    
    // Load the saved personality analysis data
    async loadSavedPersonalityAnalysis() {
      try {
        const user = authService.getCurrentUser();
        if (!user) {
          console.log('No user logged in, cannot load personality analysis');
          // Always show sections even if no user is logged in
          this.hasSavedAnalysis = true;
          return;
        }
        
        // Load both personality dimensions and analysis data
        const userPersonality = await getUserPersonality(user.uid);
        const analysisData = await getUserPersonalityAnalysis(user.uid);
        
        console.log('Loaded user personality:', userPersonality);
        console.log('Loaded personality analysis:', analysisData);
        
        // Initialize parsedFeeling with default structure from config
        this.parsedFeeling = {
          dimensions: {}
        };
        
        // Add all dimensions with default values
        Object.keys(this.personalityDimensions).forEach(key => {
          this.parsedFeeling.dimensions[key] = 0;
        });
        
        // Add all analysis sections with null
        Object.keys(this.personalityAnalysisSections).forEach(key => {
          this.parsedFeeling[key] = null;
        });
        
        // Load dimensions
        if (userPersonality && userPersonality.dimensions) {
          // Update the dimensions in our parsed feeling
          Object.entries(userPersonality.dimensions).forEach(([key, value]) => {
            this.parsedFeeling.dimensions[key] = value;
          });
        }
        
        // Track whether we have valid data
        let hasAnalysisData = false;
        
        // Load analysis sections
        if (analysisData && analysisData.personalityAnalysis) {
          Object.keys(this.personalityAnalysisSections).forEach(sectionKey => {
            if (analysisData.personalityAnalysis[sectionKey]) {
              this.parsedFeeling[sectionKey] = analysisData.personalityAnalysis[sectionKey];
              hasAnalysisData = true;
            }
          });
        }
        
        // Check if we have any dimensions with non-zero values
        const hasDimensionData = Object.values(this.parsedFeeling.dimensions).some(value => value !== 0);
        
        // Always set hasSavedAnalysis to true after loading, even if no data was found
        this.coreFeeling = hasDimensionData || hasAnalysisData ? "Loaded from previous analysis" : "No previous analysis";
        this.hasSavedAnalysis = true;
        console.log('Setting hasSavedAnalysis to true');
        
        // Set needsFullAnalysis flag if we have dimensions but no analysis text
        this.needsFullAnalysis = hasDimensionData && !hasAnalysisData;
        console.log('Needs full analysis:', this.needsFullAnalysis);
      } catch (error) {
        console.error('Error loading saved personality analysis:', error);
        // Even if there's an error, show the sections with N/A
        this.hasSavedAnalysis = true;
      }
    },
    // Init method to load all data when component is created
    async initDashboard() {
      // Check if auth is still loading
      if (this.authStore.loading) {
        console.log('Auth state still loading, delaying dashboard initialization');
        // Set up a watcher to initialize once auth is ready
        const unwatch = this.$watch(
          () => this.authStore.loading,
          (isLoading) => {
            if (!isLoading) {
              console.log('Auth loading completed, initializing dashboard');
              unwatch(); // Stop watching
              this.initDashboardAfterAuth();
            }
          }
        );
        return;
      }
      
      // Auth is ready, proceed with initialization
      this.initDashboardAfterAuth();
    },
    
    // Initialize dashboard after auth is ready
    async initDashboardAfterAuth() {
      this.dashboardLoading = true;
      try {
        await Promise.all([
          this.loadUserPersonality(),
          this.loadResults(),
          this.loadSavedPersonalityAnalysis()
        ]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        this.dashboardLoading = false;
      }
    }
  },
  mounted() {
    console.log('PersonalityDashboard component mounted');
    // Initialize the dashboard when mounted
    this.initDashboard();
  }
};
</script>

<style scoped>
/* Personality Dashboard Section */
.personality-dashboard {
  max-width: 950px;
  margin-left: auto;
  margin-right: auto;
}

.generate-description-section {
  background-color: transparent;
  border-radius: 0;
  border: none;
  position: relative;
  max-width: 950px;
  text-align: center;
}

.generate-description-section::before {
  display: none;
}

.description-header {
  margin-bottom: 10px;
}

.generate-btn {
  background-color: transparent;
  color: var(--primary);
  border: 1px solid var(--primary);
  padding: 1rem 2rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-weight: 500;
  font-size: 1.2rem;
  transition: all var(--transition-fast);
  letter-spacing: 0.02em;
  margin-bottom: 8px;
}

.generate-btn:hover {
  background-color: var(--primary);
  color: white;
  transform: none;
  letter-spacing: 0.02em;
}

.generate-btn:disabled {
  background-color: transparent;
  color: var(--text-muted);
  border-color: var(--text-muted);
  cursor: not-allowed;
  transform: none;
}

.no-quizzes-message {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-top: 8px;
  font-style: italic;
}

.analysis-source {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.feeling-result {
  margin-top: 0;
  padding: 0;
  background-color: transparent;
  border-radius: 0;
  border-left: none;
  box-shadow: none;
  position: relative;
}

.feeling-result::before {
  display: none;
}

.feeling-result h3 {
  margin-top: 0;
  color: var(--text-primary);
  font-size: 1.2rem;
  letter-spacing: -0.01em;
  margin-bottom: var(--spacing-md);
  font-weight: 500;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  padding-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Loading spinner styles */
.dashboard-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: var(--radius-sm);
  margin: 20px auto;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  transition: transform 0.4s ease-out, box-shadow 0.4s ease-out;
}

.dashboard-loading p {
  margin-top: 20px;
  color: var(--text-secondary);
  font-weight: 500;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(58, 81, 153, 0.1);
  border-radius: 50%;
  border-top-color: var(--primary);
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style> 