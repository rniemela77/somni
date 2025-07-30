import personalityData from '../../data/personalityData';

export interface PersonalitySection {
  id: string;
  title: string;
  description: string;
  promptInstructions: string;
  display: {
    order: number;
  };
  icon: string;
}

export interface PersonalityScale {
  id: string;
  displayName: string;
  positive: string;
  negative: string;
}

export interface PersonalityAttributes {
  [key: string]: number;
}

export const PERSONALITY_ANALYSIS_SECTIONS: Record<string, PersonalitySection> = {
  core: {
    id: "core",
    title: "Core Personality",
    description: "A concise description of the core aspects of the individual's personality, focusing on uncovering hidden emotional patterns and key psychological traits.",
    promptInstructions: "Write exactly two sentences that describe the core personality of the individual based on their quiz responses. Focus on revealing unique, non-obvious emotional patterns and psychological traits that provide genuine insight. Avoid generic descriptions that could apply to many people.",
    display: {
      order: 1,
    },
    icon: "brain-gear.svg"
  },
  archetype: {
    id: "archetype",
    title: "Archetype",
    description: "A specific personality archetype that best represents the individual's psychological makeup.",
    promptInstructions: "Identify a unique and specific archetype that best fits this person. Go beyond common archetypes (like Hero, Rebel, Caregiver) and consider unusual or complex ones (like Alchemist, Shapeshifter, Divine Child, Trickster, Mystic, etc). Be creative and unexpected in your selection, while still accurately reflecting their personality.",
    display: {
      order: 2,
    },
    icon: "mask.svg"
  },
  spiritAnimal: {
    id: "spiritAnimal",
    title: "Spirit Animal",
    description: "An animal that embodies the essence of the individual's personality traits, strengths, and natural tendencies.",
    promptInstructions: "Identify a distinctive, unexpected spirit animal (consider insects, marine life, reptiles, lesser-known mammals, etc) that metaphorically captures the complexity, emotional essence, and interesting contradictions in this personality profile. Focus on animal behavior and personality traits.",
    display: {
      order: 3,
    },
    icon: "paw-print.svg"
  },
  mythologicalFigure: {
    id: "mythologicalFigure",
    title: "Mythological Figure",
    description: "A character from mythology or folklore whose qualities, journey, or attributes mirror the individual's personality.",
    promptInstructions: "Identify a unique and specific mythological or folklore figure from ANY cultural tradition (Norse, Celtic, Egyptian, Chinese, Indian, Native American, African, etc. - not just Greek/Roman) that best matches this person's personality. Be creative and avoid commonly chosen figures like Athena, Zeus, or Apollo. Explain in one sentence why this figure reflects their character.",
    display: {
      order: 4,
    },
    icon: "dragon.svg"
  },
  tarotCardArchetype: {
    id: "tarotCardArchetype",
    title: "Tarot Card Archetype",
    description: "A tarot card archetype that best represents the individual's personality.",
    promptInstructions: "Identify a unique and specific tarot card archetype that best fits this person's personality. Be creative and avoid commonly chosen archetypes like The Fool or The Magician. Explain in one sentence why this card reflects their character.",
    display: {
      order: 5,
    },
    icon: "tarot.svg"
  },
  elementalAlignment: {
    id: "elementalAlignment",
    title: "Elemental Alignment",
    description: "An elemental alignment that best represents the individual's personality.",
    promptInstructions: "Identify a unique and specific elemental alignment that best fits this person's personality. Air, Earth, Fire, or Water. Explain in one sentence why this alignment reflects their character.",
    display: {
      order: 6,
    },
    icon: "earth.svg"
  },
  heroesJourney: {
    id: "heroesJourney",
    title: "Heroes Journey",
    description: "A heroes journey that best represents the individual's personality.",
    promptInstructions: "Identify a unique and specific heroes journey that best fits this person's personality. Be creative and avoid commonly chosen journeys like The Quest or The Return. Explain in one sentence why this journey reflects their character.",
    display: {
      order: 7,
    },
    icon: "journey.svg"
  },
  myersBriggs: {
    id: "myersBriggs",
    title: "Myers-Briggs Type Indicator (MBTI)",
    description: "A Myers-Briggs personality type that best represents the individual's personality.",
    promptInstructions: "Identify this person's Myers-Briggs personality type out of the options: ISTJ, ISFJ, INFJ, INTJ, ISTP, ISFP, INFP, INTP, ESTP, ESFP, ENFP, ENTP, ESTJ, ESFJ, ENFJ, ENTJ. Explain in one sentence why this type reflects their character.",
    display: {
      order: 8,
    },
    icon: "myers-briggs.svg"
  }
};

/**
 * Generates the OpenAI prompt based on attribute scores
 */
export const generateAnalysisPrompt = (attributes: PersonalityAttributes): string => {
  let prompt = "Given the user's personality traits below:\n\n";

  // Add the attribute scores in a formatted way
  Object.entries(attributes).forEach(([key, value]) => {
    const scale = personalityData.find(
      (scale) => scale.id === key.toLowerCase().replace(/-/g, "_")
    );
    if (scale) {
      prompt += `- ${scale.positive} vs. ${scale.negative}: ${value} `;

      const absValue = Math.abs(value);
      let intensity = "";
      if (absValue >= 80) intensity = "extremely";
      else if (absValue >= 60) intensity = "strongly";
      else if (absValue >= 40) intensity = "moderately";
      else if (absValue >= 20) intensity = "somewhat";
      else if (absValue > 0) intensity = "slightly";
      else intensity = "";

      if (value < 0) {
        prompt += `(${intensity} more ${scale.negative})`;
      } else if (value > 0) {
        prompt += `(${intensity} more ${scale.positive})`;
      } else {
        prompt += "(perfectly balanced)";
      }
      prompt += "\n";
    }
  });

  prompt += `\n\nProvide your response clearly using layman's terms, without too many references to personality terms, and in this format: \n\n`;
  prompt += `{\n`;

  // Add instructions for all uncommented personality analysis sections
  Object.values(PERSONALITY_ANALYSIS_SECTIONS).forEach((section, index) => {
    prompt += `"${section.title}": {\n`;
    prompt += `"Name": "<Name>",\n`;
    prompt += `"Description": "<${section.promptInstructions} Provide one concise, vivid sentence explaining the symbolic match.>",\n`;
    prompt += `"Key Insights": "<Provide some key insights that will help the user in their daily life. Focus on the practical application of the insights.>",\n`;
    prompt += `"Quote/Maxim": "<A quote/maxim that the user can use to reflect on the previous sentences.>,"\n`;
    prompt += `"Quote/Maxim Source": "<The source of the quote/maxim.>"\n`;
    prompt += `}`;

    if (index < Object.values(PERSONALITY_ANALYSIS_SECTIONS).length - 1) {
      prompt += `,\n`;
    }
  });

  prompt += `\n}`;
  
  return prompt;
};

export default {
  PERSONALITY_ANALYSIS_SECTIONS,
  generateAnalysisPrompt
}; 