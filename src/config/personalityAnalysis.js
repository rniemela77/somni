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
  keywords: {
    id: "keywords",
    title: "Keywords",
    description: "A set of key traits, qualities, and characteristics that define the individual's personality, including aspects they may not have previously recognized.",
    promptInstructions: "Provide 5-7 distinctive keywords that represent this person's personality. Include at least 2 unexpected or paradoxical traits they may not recognize in themselves. Avoid generic terms like 'kind' or 'intelligent' - instead use more specific, nuanced, and evocative words.",
    display: {
      order: 3,
    }
  },
  spiritAnimal: {
    id: "spiritAnimal",
    title: "Spirit Animal",
    description: "An animal that embodies the essence of the individual's personality traits, strengths, and natural tendencies.",
    promptInstructions: "Identify a distinctive spirit animal that best represents this person's personality traits. Look beyond common choices (like wolf, lion, eagle) and consider unexpected animals (including insects, marine life, or lesser-known species) that offer a more nuanced reflection. Explain in one sentence why this specific animal reflects their essence.",
    display: {
      order: 4,
    }
  },
  mythologicalFigure: {
    id: "mythologicalFigure",
    title: "Mythological Figure",
    description: "A character from mythology or folklore whose qualities, journey, or attributes mirror the individual's personality.",
    promptInstructions: "Identify a unique and specific mythological or folklore figure from ANY cultural tradition (Norse, Celtic, Egyptian, Chinese, Indian, Native American, African, etc. - not just Greek/Roman) that best matches this person's personality. Be creative and avoid commonly chosen figures like Athena, Zeus, or Apollo. Explain in one sentence why this figure reflects their character.",
    display: {
      order: 5,
    }
  },
  typeOfFood: {
    id: "typeOfFood",
    title: "Type of Food",
    description: "A type of food that best represents the individual's personality.",
    promptInstructions: "Identify a very specific type of food (not just a general category like 'pasta' but a specific dish like 'squid ink risotto') that best represents this person's personality. Consider cuisines from around the world and avoid obvious choices. The food should have complexity that mirrors their personality traits. Explain in one sentence why this specific food reflects their character.",
    display: {
      order: 6,
    }
  }
};

/**
 * Generates the OpenAI prompt based on config
 */
export const generateAnalysisPrompt = (formattedResults) => {
  let prompt = 'Here are quiz results for someone taking a personality test. Please analyze the personality based on these responses:\n\n';
  
  // Add the formatted results
  prompt += formattedResults + '\n\n';
  
  // Add section instructions
  prompt += '\n';
  Object.values(PERSONALITY_ANALYSIS_SECTIONS).forEach(section => {
    prompt += `${section.title}: ${section.promptInstructions}\n`;
  });
  
  prompt += '\n';
  Object.values(PERSONALITY_ANALYSIS_SECTIONS).forEach(section => {
    prompt += `${section.title}: [${section.id === 'keywords' ? 'comma-separated list' : 'your analysis'}]\n\n`;
  });
  
  return prompt;
};

export default {
  PERSONALITY_ANALYSIS_SECTIONS,
  generateAnalysisPrompt
}; 