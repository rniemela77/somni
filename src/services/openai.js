// OpenAI API service for interacting with GPT models
// This service handles API calls to OpenAI GPT models via Netlify Functions
import { generateAnalysisPrompt } from '../config/personalityAnalysis';

// Configuration options
const defaultOptions = {
  model: 'gpt-4',
  temperature: 0.7, // higher temperature = more creative
  max_tokens: 1000,
  api_version: '2023-05-15',
  stream: false
};

// Default prompt templates (legacy, will eventually be replaced by config)
const defaultPrompts = {
  // Personality description from all quiz answers
  personalityDescription: {
    prompt1: 'Here are quiz results for someone taking a personality test. Please analyze the personality based on these responses:\n\n',
    prompt2: '{{formattedResults}}',
    prompt3: "\n\nAnalyze this person's personality along the four MBTI dimensions with a score from -2 to +2 for each dimension:" +
    "\n\n1. INTROVERT_EXTROVERT (from -2 = strongly introverted to +2 = strongly extroverted)" +
    "\n2. SENSING_INTUITION (from -2 = strongly sensing to +2 = strongly intuitive)" + 
    "\n3. THINKING_FEELING (from -2 = strongly thinking to +2 = strongly feeling)" +
    "\n4. JUDGING_PERCEIVING (from -2 = strongly judging to +2 = strongly perceiving)" +
    "\n\nThen, write exactly two sentences that describe the core personality of the individual based on their quiz responses, focusing on uncovering hidden emotional patterns and key psychological traits. Then, write one sentence identifying the archetype they best fit. Finally, provide a series of keywords that represent aspects of their personality, including elements they may not have previously recognized." +
    "\n\nFormat your response like this:" +
    "\n\nDIMENSIONS:" +
    "\nINTROVERT_EXTROVERT: [score]" +
    "\nSENSING_INTUITION: [score]" +
    "\nTHINKING_FEELING: [score]" +
    "\nJUDGING_PERCEIVING: [score]" +
    "\n\nCore Personality: [Two sentences describing core personality]" +
    "\n\nArchetype: [Name of archetype]" +  
    "\n\nKeywords: [comma-separated list of keywords]"
  }
};

// OpenAI Service
export const openaiService = {
  // Store current configuration
  config: { ...defaultOptions },
  
  // Store prompt templates
  promptTemplates: { ...defaultPrompts },
  
  // Update configuration
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    return this.config;
  },
  
  // Reset configuration to defaults
  resetConfig() {
    this.config = { ...defaultOptions };
    return this.config;
  },
  
  // Get current configuration
  getConfig() {
    return { ...this.config };
  },
  
  // Update prompt templates
  updatePromptTemplates(template, newTemplates) {
    if (this.promptTemplates[template]) {
      this.promptTemplates[template] = { ...this.promptTemplates[template], ...newTemplates };
    }
    return this.promptTemplates[template];
  },
  
  // Get prompt templates
  getPromptTemplates(template = null) {
    if (template) {
      return { ...this.promptTemplates[template] };
    }
    return { ...this.promptTemplates };
  },
  
  // Reset prompt templates to defaults
  resetPromptTemplates(template) {
    if (defaultPrompts[template]) {
      this.promptTemplates[template] = { ...defaultPrompts[template] };
    }
    return this.promptTemplates[template];
  },
  
  // Send a prompt to OpenAI via Netlify function
  async getCompletion(prompt, customOptions = {}) {
    try {
      const options = { ...this.config, ...customOptions };
      
      console.log('Sending prompt to OpenAI via Netlify function:', prompt.substring(0, 100) + '...');
      
      // Call the Netlify function instead of OpenAI directly
      const response = await fetch('/.netlify/functions/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt,
          model: options.model,
          temperature: options.temperature,
          max_tokens: options.max_tokens,
          stream: options.stream
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get completion from OpenAI');
      }
      
      const data = await response.json();
      console.log('Received response from Netlify function');
      
      return { 
        completion: data.completion, 
        error: null,
        usage: data.usage
      };
    } catch (error) {
      console.error('Error calling OpenAI API via Netlify function:', error);
      return { completion: null, error: error.message, usage: null };
    }
  },
  
  // Analyze all quiz results and generate personality description
  async analyzePersonality(quizResults, customPrompt = null) {
    try {
      // Format all the results into a meaningful prompt
      let formattedResults = '';
      quizResults.forEach((item, index) => {
        formattedResults += `Quiz: ${item.quizTitle || 'Personality Quiz'}\n`;
        formattedResults += `Question ${index+1}: ${item.question}\n`;
        formattedResults += `Answer: ${item.answer}\n\n`;
      });
      
      // Build the prompt
      let promptText;
      
      if (customPrompt) {
        // Use custom prompt if provided
        promptText = customPrompt;
      } else {
        // Use the new config-based prompt generator
        promptText = generateAnalysisPrompt(formattedResults);
      }
      
      console.log('Analyzing personality based on', quizResults.length, 'quiz answers');
      
      // Get completion from OpenAI via Netlify function
      return this.getCompletion(promptText);
    } catch (error) {
      console.error('Error analyzing personality:', error);
      return { completion: null, error: error.message, usage: null };
    }
  }
};

export default openaiService; 