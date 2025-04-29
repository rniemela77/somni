<template>
  <div class="home fade-in">
    
    <!-- Personality Analysis Section for authenticated users -->
    <div v-if="authStore.isAuthenticated" class="personality-section">
      <!-- Loading state -->
      <div v-if="dashboardLoading" class="dashboard-loading">
        <div class="spinner"></div>
        <p>Loading your Personality Dashboard...</p>
      </div>
      
      <div class="feeling-result">
          <div>
            <h3>
              Your Personality Dashboard
              
              <!-- Generate Description Button -->
              <div class="generate-description-section">
                <div class="description-header">
                  <button @click="generateDescription" 
                          class="generate-btn"
                          :disabled="generatingDescription">
                      {{ generateButtonText }}
                  </button>
                </div>
              </div>
            </h3>
          </div>
          
      <!-- Personality Dashboard Section -->
      <div v-if="hasSavedAnalysis" class="personality-analysis-section">
          <div class="feeling-content">
            <!-- Show message when dimensions exist but no analysis sections -->
            <div v-if="needsFullAnalysis" 
                 class="feeling-section missing-analysis">
              <h4>Complete Your Analysis</h4>
              <p>We found your personality dimensions, but you haven't generated a full analysis yet. 
                 Click the "GENERATE FULL ANALYSIS" button below to get detailed insights about your personality.</p>
            </div>
          
            <!-- Dynamically generate analysis sections based on config -->
            <template v-for="section in getSortedAnalysisSections()" :key="section.id">
              <div v-if="parsedFeeling[section.id]" 
                   class="feeling-section" 
                   :class="section.id">
                <h4>{{ section.title }}</h4>
                <p v-if="section.id !== 'keywords'">{{ parsedFeeling[section.id] }}</p>
                <div v-else class="keyword-list">
                  <span v-for="(keyword, index) in parsedFeeling[section.id].split(',').map(k => k.trim())" 
                        :key="index"
                        :style="{ backgroundColor: getKeywordColor(index) }">
                      {{ keyword }}
                  </span>
                </div>
              </div>
            </template>
            
            <!-- Dimensions Section -->
            <div class="feeling-section mbti-dimensions">
              <h4>Personality Dimensions:</h4>
              <div class="dimensions-container">
                <!-- Generate dimension sliders dynamically -->
                <div v-for="dimension in Object.values(personalityDimensions)" 
                     :key="dimension.id"
                     class="dimension-item">
                  <h5>{{ dimension.name }}</h5>
                  <div class="dimension-scale">
                    <span class="scale-label left">{{ dimension.leftLabel }}</span>
                    <div class="scale-bar-container">
                      <div class="scale-bar">
                        <div class="scale-marker"
                          :style="{ left: getMarkerPosition(displayDimensions[dimension.id] || 0) + '%' }">
                        </div>
                      </div>
                    </div>
                    <span class="scale-label right">{{ dimension.rightLabel }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="feelingError" class="feeling-error">
        {{ feelingError }}
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth';
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
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';

export default {
  name: 'Home',
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  data() {
    return {
      results: [],
      loading: false,
      dashboardLoading: false,
      
      // Core feeling description
      generatingDescription: false,
      coreFeeling: null,
      feelingError: null,
      
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
      } else if (this.hasSavedAnalysis) {
        return this.needsFullAnalysis ? 'GENERATE FULL ANALYSIS' : 'REGENERATE ANALYSIS';
      } else {
        return 'GENERATE DESCRIPTION';
      }
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
      const user = authService.getCurrentUser();
      if (!user) {
        console.error("User not logged in");
        this.loading = false;
        this.feelingError = "You must be logged in to view results";
        return;
      }

      this.loading = true;
      
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
        
        if (hasAnalysisData || hasDimensionData) {
          this.coreFeeling = "Loaded from previous analysis";
          this.hasSavedAnalysis = true;
          console.log('Setting hasSavedAnalysis to true');
          
          // Set needsFullAnalysis flag if we have dimensions but no analysis text
          this.needsFullAnalysis = hasDimensionData && !hasAnalysisData;
          console.log('Needs full analysis:', this.needsFullAnalysis);
        } else {
          console.log('No saved analysis data found');
        }
      } catch (error) {
        console.error('Error loading saved personality analysis:', error);
      }
    },
    // Add method to access analysis sections in order
    getSortedAnalysisSections() {
      return Object.values(this.personalityAnalysisSections)
        .sort((a, b) => a.display.order - b.display.order);
    },
    getKeywordColor(index) {
      // Array of soft background colors for the keywords
      const colors = [
        'rgba(58, 81, 153, 0.08)',   // primary color
        'rgba(92, 116, 87, 0.08)',   // secondary color
        'rgba(140, 156, 214, 0.15)', // primary light
        'rgba(169, 190, 166, 0.15)', // secondary light
        'rgba(78, 136, 199, 0.08)',  // info color
      ];
      
      // Cycle through the colors for each keyword
      return colors[index % colors.length];
    }
  },
  async mounted() {
    console.log('Home component mounted');
    
    // Get the current authenticated user
    const currentUser = auth.currentUser;
    console.log('Current user on mount:', currentUser?.uid || 'No user');
    
    // Check if we have authentication already
    if (this.authStore.isAuthenticated) {
      console.log('Auth state is ready, loading data immediately');
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
    } else {
      console.log('Auth state not ready, waiting for Firebase auth state');
      
      // Set up auth state changed listener
      onAuthStateChanged(auth, (user) => {
        console.log('Auth state changed:', user ? 'authenticated' : 'not authenticated');
        if (user) {
          console.log('User authenticated, loading personality data');
          this.dashboardLoading = true;
          Promise.all([
            this.loadUserPersonality(),
            this.loadResults(),
            this.loadSavedPersonalityAnalysis()
          ]).finally(() => {
            this.dashboardLoading = false;
          });
        }
      });
    }
  }
};
</script>

<style scoped>
.hero {
  text-align: center;
  margin-bottom: var(--spacing-xxl);
}

.hero h1 {
  font-size: calc(var(--font-size-xxl) * 1.5);
  margin-bottom: var(--spacing-md);
}

.hero-subtitle {
  font-size: var(--font-size-lg);
  font-weight: 500;
  color: var(--secondary);
  margin-bottom: var(--spacing-md);
}

.hero-text {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
}

.cta-buttons {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
}

/* Personality Analysis Section */
.personality-section {
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

.analysis-source {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.personality-analysis-section {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 40px;
  border-radius: var(--radius-sm);
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  position: relative;
  max-width: 950px;
  margin-left: auto;
  margin-right: auto;
  transition: transform 0.4s ease-out, box-shadow 0.4s ease-out;
}

.personality-analysis-section:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.03);
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

.feeling-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-top: var(--spacing-md);
}

.feeling-section {
  padding: 20px 25px;
  border-radius: var(--radius-sm);
  background-color: rgba(255, 255, 255, 0.8);
  border-left: 2px solid transparent;
  transition: background-color var(--transition);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.feeling-section:hover {
  background-color: var(--bg-primary);
}

.feeling-section h4 {
  color: var(--text-primary);
  margin-top: 0;
  margin-bottom: 16px;
  font-weight: 500;
  font-size: 0.95rem;
}

.feeling-section p {
  margin: 0;
  line-height: 1.5;
  color: var(--text-secondary);
  flex-grow: 1;
  font-size: 0.92rem;
}

.keyword-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.keyword-list span {
  display: inline-block;
  background-color: rgba(58, 81, 153, 0.04);
  padding: 3px 12px;
  border-radius: var(--radius-sm);
  font-size: 0.82rem;
  color: var(--text-secondary);
  border: 1px solid rgba(58, 81, 153, 0.08);
}

.feeling-error {
  margin-top: 15px;
  padding: 12px 16px;
  background-color: rgba(209, 71, 71, 0.05);
  color: var(--error);
  border-radius: var(--radius-sm);
  border-left: none;
  position: relative;
  overflow: hidden;
}

.feeling-error::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 2px;
  background-color: var(--error);
}

.missing-analysis {
  margin-bottom: 20px;
  padding: 16px;
  background-color: var(--bg-secondary);
  border-radius: var(--radius-sm);
  border-left: none;
  position: relative;
  overflow: hidden;
}

.missing-analysis::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 2px;
  background-color: var(--primary);
}

.missing-analysis h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: var(--primary);
  font-weight: 500;
}

.missing-analysis p {
  margin: 0;
  line-height: 1.5;
}

/* Dimensions Section */
.mbti-dimensions {
  border-left: none !important;
  background-color: var(--bg-primary);
  padding: 25px;
  margin-top: 10px;
  border-top: 1px solid var(--bg-muted);
}

.dimensions-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  margin: 0;
}

.dimension-item {
  margin-bottom: 0;
  background-color: transparent;
  padding: 0;
  border-radius: 0;
  transition: all var(--transition-fast);
}

.dimension-item:hover {
  background-color: transparent;
  box-shadow: none;
}

.dimension-item h5 {
  margin-bottom: 10px;
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.9rem;
  letter-spacing: 0;
  text-align: center;
}

.scale-bar {
  height: 2px;
  background: linear-gradient(to right, var(--primary), var(--secondary));
  border-radius: 0;
  position: relative;
  opacity: 0.7;
}

.scale-bar:before {
  content: "";
  position: absolute;
  left: 50%;
  height: 5px;
  width: 1px;
  background-color: var(--text-muted);
  transform: translateX(-50%);
  top: -2px;
  opacity: 0.2;
}

.scale-marker {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: white;
  border: 1px solid var(--primary);
  border-radius: 50%;
  box-shadow: 0 0 0 2px rgba(58, 81, 153, 0.03);
  transition: all var(--transition-fast);
}

.scale-bar-container:hover .scale-marker {
  box-shadow: 0 0 0 3px rgba(58, 81, 153, 0.06);
  transform: translate(-50%, -50%) scale(1.1);
}

.dimension-scale {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 32px;
}

.scale-bar-container {
  flex-grow: 1;
  padding: 6px 0;
  position: relative;
}

.scale-label {
  min-width: 75px;
  font-weight: 400;
  font-size: 0.8rem;
  letter-spacing: 0;
  line-height: 1.4;
  opacity: 0.8;
}

.scale-label.left {
  text-align: right;
  color: var(--primary);
  padding-right: 4px;
}

.scale-label.right {
  text-align: left;
  color: var(--secondary);
  padding-left: 4px;
}

.core::before {
  background-color: var(--primary);
}

.archetype::before {
  background-color: var(--primary-light);
}

.keywords::before {
  background-color: var(--secondary-light);
}

@media (min-width: 768px) {
  .hero h1 {
    font-size: calc(var(--font-size-xxl) * 1.2);
  }

  .cta-buttons {
    flex-direction: column;
    padding: 0 var(--spacing-lg);
  }

  .feeling-content {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px 40px;
  }
  
  .feeling-section.mbti-dimensions {
    grid-column: span 2;
    margin-top: 10px;
  }

  .dimensions-container {
    grid-template-columns: repeat(2, 1fr);
  }
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
