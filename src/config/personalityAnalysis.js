import personalityData from '../../data/personalityData';

export const PERSONALITY_ANALYSIS_SECTIONS = {
  core: {
    id: "core",
    title: "Core Personality",
    description: "A concise description of the core aspects of the individual's personality, focusing on uncovering hidden emotional patterns and key psychological traits.",
    promptInstructions: "Write exactly two sentences that describe the core personality of the individual based on their quiz responses. Focus on revealing unique, non-obvious emotional patterns and psychological traits that provide genuine insight. Avoid generic descriptions that could apply to many people.",
    display: {
      order: 1,
    }
  },
  archetype: {
    id: "archetype",
    title: "Archetype",
    description: "A specific personality archetype that best represents the individual's psychological makeup.",
    promptInstructions: "Identify a unique and specific archetype that best fits this person. Go beyond common archetypes (like Hero, Rebel, Caregiver) and consider unusual or complex ones (like Alchemist, Shapeshifter, Divine Child, Trickster, Mystic, etc). Be creative and unexpected in your selection, while still accurately reflecting their personality.",
    display: {
      order: 2,
    }
  },
  spiritAnimal: {
    id: "spiritAnimal",
    title: "Spirit Animal",
    description: "An animal that embodies the essence of the individual's personality traits, strengths, and natural tendencies.",
    promptInstructions: "Identify a distinctive spirit animal that best represents this person's personality traits. Look beyond common choices (like wolf, lion, eagle) and consider unexpected animals (including insects, marine life, or lesser-known species) that offer a more nuanced reflection. Explain in one sentence why this specific animal reflects their essence.",
    display: {
      order: 3,
    }
  },
  mythologicalFigure: {
    id: "mythologicalFigure",
    title: "Mythological Figure",
    description: "A character from mythology or folklore whose qualities, journey, or attributes mirror the individual's personality.",
    promptInstructions: "Identify a unique and specific mythological or folklore figure from ANY cultural tradition (Norse, Celtic, Egyptian, Chinese, Indian, Native American, African, etc. - not just Greek/Roman) that best matches this person's personality. Be creative and avoid commonly chosen figures like Athena, Zeus, or Apollo. Explain in one sentence why this figure reflects their character.",
    display: {
      order: 4,
    }
  }
};

/**
 * Generates the OpenAI prompt based on attribute scores
 */
export const generateAnalysisPrompt = (attributes) => {
  let prompt = 'Here is a personality profile based on various psychological scales. Each scale ranges from -100 to +100, where:\n\n';
  prompt += '- Negative values (-100 to -1) indicate stronger alignment with the first trait\n';
  prompt += '- Positive values (1 to 100) indicate stronger alignment with the second trait\n';
  prompt += '- The magnitude indicates the strength of the tendency\n\n';
  prompt += 'Here are the individual\'s scores on each scale:\n\n';

  // Add the attribute scores in a formatted way
  Object.entries(attributes).forEach(([key, value]) => {
    const scale = personalityData.find(scale => scale.id === key.toLowerCase().replace(/-/g, '_'));
    if (scale) {
      prompt += `${scale.displayName}: ${value} `;
      
      const absValue = Math.abs(value);
      let intensity;
      if (absValue >= 80) intensity = "extremely";
      else if (absValue >= 60) intensity = "strongly";
      else if (absValue >= 40) intensity = "moderately";
      else if (absValue >= 20) intensity = "somewhat";
      else if (absValue > 0) intensity = "slightly";
      
      if (value < 0) {
        prompt += `(${intensity} more ${scale.negative} than ${scale.positive})`;
      } else if (value > 0) {
        prompt += `(${intensity} more ${scale.positive} than ${scale.negative})`;
      } else {
        prompt += '(perfectly balanced between the two)';
      }
      prompt += '\n';
    }
  });
  prompt += '\nBased on these attribute scores, please provide a comprehensive personality analysis. ';
  prompt += 'Consider how different attributes interact and influence each other. ';
  prompt += 'Look for unique patterns and combinations that reveal deeper insights about the individual.\n\n';
  
  // Add section instructions
  Object.values(PERSONALITY_ANALYSIS_SECTIONS).forEach(section => {
    prompt += `${section.title}: ${section.promptInstructions}\n\n`;
  });
  
  return prompt;
};

export default {
  PERSONALITY_ANALYSIS_SECTIONS,
  generateAnalysisPrompt
}; 