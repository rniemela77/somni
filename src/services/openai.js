// OpenAI API service for interacting with GPT models
// This service handles API calls to OpenAI GPT models via Netlify Functions
import { generateAnalysisPrompt, PERSONALITY_ANALYSIS_SECTIONS } from '../config/personalityAnalysis';

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
    prompt3: 
    "\n\nThen, write exactly two sentences that describe the core personality of the individual based on their quiz responses, focusing on uncovering hidden emotional patterns and key psychological traits. Then, write one sentence identifying the archetype they best fit. Finally, provide a series of keywords that represent aspects of their personality, including elements they may not have previously recognized." +
    "\n\nFormat your response like this:" +
    "\n\nCore Personality: [Two sentences describing core personality]" +
    "\n\nArchetype: [Name of archetype]" +  
    "\n\nKeywords: [comma-separated list of keywords]"
  }
};

class OpenAIService {
  constructor() {
    this.config = { ...defaultOptions };
    this.promptTemplates = { ...defaultPrompts };
  }

  // Update configuration
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    return this.config;
  }
  
  // Reset configuration to defaults
  resetConfig() {
    this.config = { ...defaultOptions };
    return this.config;
  }
  
  // Get current configuration
  getConfig() {
    return { ...this.config };
  }
  
  // Update prompt templates
  updatePromptTemplates(template, newTemplates) {
    if (this.promptTemplates[template]) {
      this.promptTemplates[template] = { ...this.promptTemplates[template], ...newTemplates };
    }
    return this.promptTemplates[template];
  }
  
  // Get prompt templates
  getPromptTemplates(template = null) {
    if (template) {
      return { ...this.promptTemplates[template] };
    }
    return { ...this.promptTemplates };
  }
  
  // Reset prompt templates to defaults
  resetPromptTemplates(template) {
    if (defaultPrompts[template]) {
      this.promptTemplates[template] = { ...defaultPrompts[template] };
    }
    return this.promptTemplates[template];
  }
  
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
  }
  
  // Analyze personality based on attribute scores
  async analyzePersonality(attributes) {
    try {
      const prompt = generateAnalysisPrompt(attributes);
      
      const response = await fetch('/.netlify/functions/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          ...this.config
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // The Netlify function returns data.completion directly
      return {
        completion: this.parseAnalysis(data.completion),
        error: null,
        usage: data.usage
      };
    } catch (error) {
      console.error('Error in analyzePersonality:', error);
      return {
        completion: null,
        error: error.message,
        usage: null
      };
    }
  }

  // Parse the analysis text into sections
  parseAnalysis(text) {
    const sections = {};
    let currentSection = null;
    
    text.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;
      
      // Check if this line is a section header
      const sectionMatch = Object.values(PERSONALITY_ANALYSIS_SECTIONS).find(
        section => trimmedLine.startsWith(section.title + ':')
      );
      
      if (sectionMatch) {
        currentSection = sectionMatch.id;
        sections[currentSection] = trimmedLine.substring(sectionMatch.title.length + 1).trim();
      } else if (currentSection && trimmedLine) {
        // Append to current section if it's a continuation
        sections[currentSection] += ' ' + trimmedLine;
      }
    });
    
    return sections;
  }
}

export const openaiService = new OpenAIService(); 