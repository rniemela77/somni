/**
 * Personality Analysis Configuration
 * 
 * This file defines the structure and content of personality analysis features
 * throughout the application. Changing this config will affect:
 * 
 * 1. How data is stored in Firebase
 * 2. What is displayed in the UI
 * 3. How prompts are constructed for OpenAI
 */

export const PERSONALITY_DIMENSIONS = {
  INTROVERT_EXTROVERT: {
    id: "INTROVERT_EXTROVERT",
    name: "Introversion-Extroversion",
    description: "Measures where a person directs their energy and attention. Introverts focus inward and recharge through solitude, while extroverts focus outward and gain energy from social interactions.",
    range: [-2, 2],
    defaultValue: 0,
    leftLabel: "Introvert",
    rightLabel: "Extrovert",
    thresholds: {
      "-2": "Strong Introvert",
      "-1": "Moderate Introvert",
      "0": "Balanced",
      "1": "Moderate Extrovert", 
      "2": "Strong Extrovert"
    }
  },
  SENSING_INTUITION: {
    id: "SENSING_INTUITION",
    name: "Sensing-Intuition",
    description: "Describes how a person processes information. Sensing types focus on concrete facts and details, while intuitive types focus on patterns, possibilities, and the big picture.",
    range: [-2, 2],
    defaultValue: 0,
    leftLabel: "Sensing",
    rightLabel: "Intuition",
    thresholds: {
      "-2": "Strong Sensing",
      "-1": "Moderate Sensing",
      "0": "Balanced",
      "1": "Moderate Intuitive",
      "2": "Strong Intuitive"
    }
  },
  THINKING_FEELING: {
    id: "THINKING_FEELING",
    name: "Thinking-Feeling",
    description: "Reflects how a person makes decisions. Thinking types prioritize logic and consistency, while feeling types prioritize empathy and interpersonal harmony.",
    range: [-2, 2],
    defaultValue: 0,
    leftLabel: "Thinking",
    rightLabel: "Feeling",
    thresholds: {
      "-2": "Strong Thinker",
      "-1": "Moderate Thinker",
      "0": "Balanced",
      "1": "Moderate Feeler",
      "2": "Strong Feeler"
    }
  },
  JUDGING_PERCEIVING: {
    id: "JUDGING_PERCEIVING",
    name: "Judging-Perceiving",
    description: "Indicates how a person approaches structure and decisions. Judging types prefer order, planning, and resolution, while perceiving types prefer flexibility, spontaneity, and openness.",
    range: [-2, 2],
    defaultValue: 0,
    leftLabel: "Judging",
    rightLabel: "Perceiving",
    thresholds: {
      "-2": "Strong Judger",
      "-1": "Moderate Judger",
      "0": "Balanced",
      "1": "Moderate Perceiver",
      "2": "Strong Perceiver"
    }
  }
};

export const PERSONALITY_ANALYSIS_SECTIONS = {
  core: {
    id: "core",
    title: "Core Personality",
    description: "A concise description of the core aspects of the individual's personality, focusing on uncovering hidden emotional patterns and key psychological traits.",
    promptInstructions: "Write exactly two sentences that describe the core personality of the individual based on their quiz responses, focusing on uncovering hidden emotional patterns and key psychological traits.",
    display: {
      order: 1,
      borderColor: "#5e35b1"
    }
  },
  archetype: {
    id: "archetype",
    title: "Archetype",
    description: "A specific personality archetype that best represents the individual's psychological makeup.",
    promptInstructions: "Write one sentence identifying the archetype they best fit (e.g., Visionary, Caregiver, Explorer, Sage, etc.).",
    display: {
      order: 2,
      borderColor: "#7e57c2"
    }
  },
  keywords: {
    id: "keywords",
    title: "Keywords",
    description: "A set of key traits, qualities, and characteristics that define the individual's personality, including aspects they may not have previously recognized.",
    promptInstructions: "Provide a series of keywords (5-10) that represent aspects of their personality, including elements they may not have previously recognized.",
    display: {
      order: 3,
      borderColor: "#9575cd"
    }
  }
};

/**
 * Helper function to get initial dimensions state
 */
export const getInitialDimensions = () => {
  const dimensions = {};
  Object.values(PERSONALITY_DIMENSIONS).forEach(dimension => {
    dimensions[dimension.id] = dimension.defaultValue;
  });
  return dimensions;
};

/**
 * Helper to calculate personality tags based on dimension values
 */
export const calculatePersonalityTags = (dimensions) => {
  const tags = [];
  Object.entries(dimensions).forEach(([dimensionId, value]) => {
    const dimension = PERSONALITY_DIMENSIONS[dimensionId];
    if (dimension) {
      const roundedValue = Math.round(value); // Round to nearest integer
      const threshold = dimension.thresholds[roundedValue];
      if (threshold && threshold !== "Balanced") {
        tags.push(threshold);
      }
    }
  });
  return tags;
};

/**
 * Generates the OpenAI prompt based on config
 */
export const generateAnalysisPrompt = (formattedResults) => {
  let prompt = 'Here are quiz results for someone taking a personality test. Please analyze the personality based on these responses:\n\n';
  
  // Add the formatted results
  prompt += formattedResults + '\n\n';
  
  // Add dimension instructions
  prompt += "Analyze this person's personality along the four MBTI dimensions with a score from -2 to +2 for each dimension:\n\n";
  
  // Add each dimension
  Object.values(PERSONALITY_DIMENSIONS).forEach(dimension => {
    prompt += `${dimension.id} (from -2 = strongly ${dimension.leftLabel.toLowerCase()} to +2 = strongly ${dimension.rightLabel.toLowerCase()})\n`;
  });
  
  // Add section instructions
  prompt += '\n';
  Object.values(PERSONALITY_ANALYSIS_SECTIONS).forEach(section => {
    prompt += `${section.title}: ${section.promptInstructions}\n`;
  });
  
  // Add formatting instructions
  prompt += '\nFormat your response like this:\n\n';
  prompt += 'DIMENSIONS:\n';
  Object.values(PERSONALITY_DIMENSIONS).forEach(dimension => {
    prompt += `${dimension.id}: [score]\n`;
  });
  
  prompt += '\n';
  Object.values(PERSONALITY_ANALYSIS_SECTIONS).forEach(section => {
    prompt += `${section.title}: [${section.id === 'keywords' ? 'comma-separated list' : 'your analysis'}]\n\n`;
  });
  
  return prompt;
};

export default {
  PERSONALITY_DIMENSIONS,
  PERSONALITY_ANALYSIS_SECTIONS,
  getInitialDimensions,
  calculatePersonalityTags,
  generateAnalysisPrompt
}; 