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
  keywords: {
    id: "keywords",
    title: "Keywords",
    description: "A set of key traits, qualities, and characteristics that define the individual's personality, including aspects they may not have previously recognized.",
    promptInstructions: "Provide 5-7 distinctive keywords that represent this person's personality. Include at least 2 unexpected or paradoxical traits they may not recognize in themselves. Avoid generic terms like 'kind' or 'intelligent' - instead use more specific, nuanced, and evocative words.",
    display: {
      order: 3,
    }
  },
  challenges: {
    id: "challenges",
    title: "Key Challenges",
    description: "The main obstacles and difficulties the individual faces in their personal growth and daily life.",
    promptInstructions: "Identify 3-4 specific challenges or obstacles this person likely encounters based on their personality patterns. Focus on deep, psychological challenges rather than surface-level issues. Each challenge should be described in one clear, insightful sentence.",
    display: {
      order: 4,
    }
  },
  strengths: {
    id: "strengths",
    title: "Core Strengths",
    description: "The fundamental strengths and capabilities that define the individual's potential.",
    promptInstructions: "List 3-4 unique and specific strengths this person possesses, going beyond obvious traits to reveal deeper capabilities. Each strength should be described with one sentence that explains how it manifests in their life.",
    display: {
      order: 5,
    }
  },
  weaknesses: {
    id: "weaknesses",
    title: "Growth Areas",
    description: "Areas where the individual has the most potential for meaningful personal growth.",
    promptInstructions: "Identify 2-3 specific areas where this person has the most potential for growth. Frame these as opportunities rather than criticisms, and explain how each could be transformed into a strength.",
    display: {
      order: 6,
    }
  },
  blindspots: {
    id: "blindspots",
    title: "Blind Spots",
    description: "Aspects of personality or behavior that the individual may not be fully aware of.",
    promptInstructions: "Reveal 2-3 significant blind spots in this person's self-awareness, based on patterns in their responses. These should be insightful observations that might surprise them but ring true upon reflection.",
    display: {
      order: 7,
    }
  },
  recurringFeelings: {
    id: "recurringFeelings",
    title: "Recurring Feelings",
    description: "Deep-seated emotional patterns that frequently surface in the individual's life.",
    promptInstructions: "Identify 3-4 core emotional patterns that regularly appear in this person's life. Focus on the deeper, underlying feelings rather than surface emotions, and explain the typical triggers or contexts for each.",
    display: {
      order: 8,
    }
  },
  recurringEmotions: {
    id: "recurringEmotions",
    title: "Emotional Patterns",
    description: "The emotional cycles and responses that characterize the individual's experience.",
    promptInstructions: "Describe 2-3 distinctive emotional cycles or patterns this person tends to experience. Include both the triggering situations and the typical progression of emotions that follow.",
    display: {
      order: 9,
    }
  },
  hiddenInsight: {
    id: "hiddenInsight",
    title: "Hidden Insight",
    description: "A surprising but accurate insight about the individual that they might not be aware of.",
    promptInstructions: "Provide one significant insight about this person that they likely haven't recognized about themselves. This should be a non-obvious observation that connects multiple patterns in their responses and offers genuine self-understanding.",
    display: {
      order: 10,
    }
  },
  spiritAnimal: {
    id: "spiritAnimal",
    title: "Spirit Animal",
    description: "An animal that embodies the essence of the individual's personality traits, strengths, and natural tendencies.",
    promptInstructions: "Identify a distinctive spirit animal that best represents this person's personality traits. Look beyond common choices (like wolf, lion, eagle) and consider unexpected animals (including insects, marine life, or lesser-known species) that offer a more nuanced reflection. Explain in one sentence why this specific animal reflects their essence.",
    display: {
      order: 11,
    }
  },
  mythologicalFigure: {
    id: "mythologicalFigure",
    title: "Mythological Figure",
    description: "A character from mythology or folklore whose qualities, journey, or attributes mirror the individual's personality.",
    promptInstructions: "Identify a unique and specific mythological or folklore figure from ANY cultural tradition (Norse, Celtic, Egyptian, Chinese, Indian, Native American, African, etc. - not just Greek/Roman) that best matches this person's personality. Be creative and avoid commonly chosen figures like Athena, Zeus, or Apollo. Explain in one sentence why this figure reflects their character.",
    display: {
      order: 12,
    }
  },
  typeOfFood: {
    id: "typeOfFood",
    title: "Type of Food",
    description: "A type of food that best represents the individual's personality.",
    promptInstructions: "Identify a very specific type of food (not just a general category like 'pasta' but a specific dish like 'squid ink risotto') that best represents this person's personality. Consider cuisines from around the world and avoid obvious choices. The food should have complexity that mirrors their personality traits. Explain in one sentence why this specific food reflects their character.",
    display: {
      order: 13,
    }
  },
  growthStrategies: {
    id: "growthStrategies",
    title: "Growth Strategies",
    description: "Personalized strategies and practices for personal development based on the individual's unique personality patterns.",
    promptInstructions: "Suggest 3-4 specific, actionable strategies for personal growth that align with this person's personality patterns. Each strategy should be concrete and immediately applicable, addressing their challenges while leveraging their strengths. Include one short-term (daily/weekly) practice, one medium-term habit to develop, and one longer-term transformation goal.",
    display: {
      order: 14,
    }
  },
  personalMantras: {
    id: "personalMantras",
    title: "Personal Mantras",
    description: "Powerful, personalized affirmations that resonate with the individual's core nature and growth path.",
    promptInstructions: "Create 2-3 unique and specific mantras that would be particularly meaningful for this person. Each mantra should address a key aspect of their personality or growth journey, using language and metaphors that would naturally resonate with them. Avoid generic affirmations - these should feel personally crafted for their specific patterns and potential.",
    display: {
      order: 15,
    }
  },
  journalPrompt: {
    id: "journalPrompt",
    title: "Exploration Prompt",
    description: "A thought-provoking writing prompt designed to facilitate deeper self-discovery.",
    promptInstructions: "Create one detailed, multi-layered writing prompt that would help this person explore their most significant patterns or potential areas of growth. The prompt should be specific to their personality profile and include 2-3 follow-up questions that guide deeper reflection. Frame it in a way that encourages genuine insight rather than surface-level responses.",
    display: {
      order: 16,
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
      if (value < 0) {
        prompt += `(Strong ${scale.negative})`;
      } else if (value > 0) {
        prompt += `(Strong ${scale.positive})`;
      } else {
        prompt += '(Balanced)';
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