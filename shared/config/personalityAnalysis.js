export const SHARED_PROMPT_INSTRUCTIONS =
"You are crafting a mythic character based on traits below. Write extremely clear descriptions using grade 6-8 language, avoiding modern settings and poetic terms; use ‘they/their’ and keep it open-ended to spark curiosity. Express traits in simple, positive ways without analysis, prioritizing intensity (Extreme > Clear > Moderate > Light). Think long and hard on how the character's traits may be expressed in ways that are not commonly known or understood.";

export const PERSONALITY_ANALYSIS_SECTIONS = [
  {
    id: "theAwakening",
    slug: "the-awakening",
    requiredAssessments: 3,
    title: "The Awakening",
    description: "An introduction to your mythical persona.",
    promptInstructions: {
      title:
        "<Archetypal role name, 1-2 words (e.g., Silent Sage, Radiant Guide, Steadfast Champion)>",
      details:
        "<Write a clear introduction to this character as a 3-4 sentence narrative, ending with a hook about the core essence of the character and their depth that will want the reader to learn more.>",
      personaQuote: "<Write a clear quote from the character that will be used as a tagline for the character.>",
    },
  },
  {
    id: "theReflection",
    slug: "the-reflection",
    requiredAssessments: 6,
    title: "The Reflection",
    description: "How others perceive the persona.",
    promptInstructions: {
      title:
        "<2-3 words to describe how the user's personality is perceived by others.>",
      details:
        "<From the perspective of those around the character, write 4-5 sentences describing how others perceive the character. Consider observations, rumors, misunderstandings, and how they are seen and understood by the world.>",
    },
  },
  {
    id: "theDestiny",
    slug: "the-destiny",
    requiredAssessments: 9,
    title: "The Destiny",
    description: "The persona's greater purpose is revealed.",
    promptInstructions: {
      title: "<3-5 words that describe the persona's greater purpose.>",
      details:
        "<Write a clear passage (50-75 words) describing the character's greater purpose in the world. How they relate to others, the role they play in the world, and the impact they have on the world.>",
    },
  },
  {
    id: "theTrial",
    slug: "the-trial",
    requiredAssessments: 12,
    title: "The Inner Trial",
    description: "A description of the character's inner trial.",
    promptInstructions: {
      title: "<2-3 words to describe the persona's inner trial.>",
      details:
        "<Describe in 60 words or less the single feeling that haunts them, like a low hum they can't shut off.>",
    },
  },
  {
    id: "theTurningPoint",
    slug: "the-turning-point",
    requiredAssessments: 15,
    title: "The Turning Point",
    description: "How the persona’s story is retold in the mythic world.",
    promptInstructions: {
      title: "<2-3 words to describe the persona's turning point.>",
      details:
        "<Write a clear passage (50-75 words) describing the character's turning point- how they reach a new level of self-awareness and understanding of their nature and how it relates to the world.>",
    },
  },
  {
    id: "theShadow",
    slug: "the-shadow",
    requiredAssessments: 18,
    title: "The Shadow",
    description: "The persona's shadow side.",
    promptInstructions: {
      title: "<2-3 words to describe the persona's shadow.>",
      details:
        "<Write a short passage (50-75 words) describing the character's shadow side- the tension, habit, or reaction that can overgrow their gifts when they are tired, unseen, or uncertain.>",
    },
  },
  {
    id: "untoldStrengths",
    slug: "untold-strengths",
    requiredAssessments: 20,
    title: "Untold Strengths",
    description: "The persona's untold strengths.",
    promptInstructions: {
      title: "<2-3 words to describe the persona's untold strengths.>",
      details:
        "<Write a clear passage (50-75 words) describing the character's untold strengths- the strength that lives in their restraint, observation, care, or refusal to follow the crowd, How they endure, shift others, or hold meaning without needing recognition, Why this strength is rarely named, but deeply needed in the world.>",
    },
  },
];

// Derived objects for backward compatibility
export const REVELATION_MILESTONES = PERSONALITY_ANALYSIS_SECTIONS.map(
  (section) => ({
    key: section.id,
    slug: section.slug,
    requiredAssessments: section.requiredAssessments,
    title: section.title,
    description: section.description,
  })
);

// Create categories object - currently no categories defined in sections
export const CATEGORIES = {};

export default {
  SHARED_PROMPT_INSTRUCTIONS,
  REVELATION_MILESTONES,
  CATEGORIES,
  PERSONALITY_ANALYSIS_SECTIONS,
};
