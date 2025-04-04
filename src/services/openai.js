// OpenAI API service for interacting with GPT models
// This service handles API calls to OpenAI GPT models

// Configuration options
const defaultOptions = {
  model: 'gpt-4',
  temperature: 0.7,
  max_tokens: 1000,
  api_version: '2023-05-15',
  stream: false
};

// OpenAI Service
export const openaiService = {
  // Store current configuration
  config: { ...defaultOptions },
  
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
  
  // Send a prompt to OpenAI and get a completion
  async getCompletion(prompt, customOptions = {}) {
    try {
      // Try to get the API key from environment variables
      let apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      
      // If API key is not configured, inform the user
      if (!apiKey) {
        console.warn('OpenAI API key is not configured. Please add your API key to the .env.development file.');
        return { 
          completion: null, 
          error: "OpenAI API key is not configured. Please add your API key to continue.", 
          usage: null 
        };
      }
      
      const options = { ...this.config, ...customOptions };
      
      console.log('Sending prompt to OpenAI:', prompt.substring(0, 100) + '...');
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: options.model,
          messages: [{ role: 'user', content: prompt }],
          temperature: options.temperature,
          max_tokens: options.max_tokens,
          stream: options.stream
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get completion from OpenAI');
      }
      
      const data = await response.json();
      console.log('Received response from OpenAI');
      
      return { 
        completion: data.choices[0].message.content, 
        error: null,
        usage: data.usage
      };
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      return { completion: null, error: error.message, usage: null };
    }
  },
  
  // Analyze quiz results and provide insights
  async analyzeQuizResults(results, quizTitle, customPrompt = null) {
    try {
      // Format the results into a meaningful prompt
      let formattedResults = '';
      results.forEach((result, index) => {
        formattedResults += `Question ${index+1}: ${result.questionText}\n`;
        formattedResults += `Your Answer: ${result.userAnswer}\n\n`;
      });
      
      // Default prompt or custom prompt
      const promptText = customPrompt || 
        `Here are quiz results for someone taking a personality test titled "${quizTitle}". Please analyze their personality based on these responses:\n\n${formattedResults}\n\nPlease provide a thoughtful analysis of this person's personality traits, tendencies, and psychological patterns based solely on these quiz answers.`;
      
      // Get completion from OpenAI
      return this.getCompletion(promptText);
    } catch (error) {
      console.error('Error analyzing quiz results:', error);
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
      
      // Default prompt or custom prompt
      const promptText = customPrompt || 
        `Here are quiz results for someone taking a personality test. Please analyze the personality based on these responses:\n\n${formattedResults}\n\nWrite exactly 3 sentences that describe the core feeling or personality of the person who answered these questions. Focus on emotional patterns, personality traits, and psychological insights that emerge from these answers.`;
      
      console.log('Analyzing personality based on', quizResults.length, 'quiz answers');
      
      // Get completion from OpenAI
      return this.getCompletion(promptText);
    } catch (error) {
      console.error('Error analyzing personality:', error);
      return { completion: null, error: error.message, usage: null };
    }
  }
};

export default openaiService; 