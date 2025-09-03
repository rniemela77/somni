export const SHARED_PROMPT_INSTRUCTIONS = `
Generate insights based on the user's personality scores that are specific, concise, and distinct from common personality test outputs.
Craft responses in a mythic, poetic narrative tone to align with the 'self myth' aesthetic, evoking timeless storytelling.
Use clear, simple language at a Grade 6-8 reading level, with varied timeless imagery such as archetypal roles, life stories, or mythic figures, to reveal a unique, enlightening aspect of the user's fundamental self, clearly showing how their personality traits combine into a hidden strength or pattern in their inner nature, keeping descriptions meaningful and specific.`;

// Master object containing all personality analysis data
export const PERSONALITY_ANALYSIS_SECTIONS = {
  theFlame: {
    id: "theFlame",
    slug: "the-flame",
    requiredAssessments: 3,
    title: "The Flame",
    description: "A primal light flares, whispering your soul's first truths.",
    promptInstructions: {
      title: "<2-3 word mythic title reflecting the user's primary personality trait, using timeless imagery like archetypal roles or life stories>",
      details: "<Write exactly 2 concise sentences in a mythic, poetic tone at a Grade 6-8 reading level to reveal how the user's core personality traits combine into a unique, timeless essence. Use varied imagery like archetypal roles, life stories, or mythic figures to clearly show a hidden strength or pattern in their inner self, ensuring descriptions are meaningful and specific to their traits.>",
    },
    category: "originRealm",
    categoryDescription: "The dawn of your myth, where primal essence takes shape.",
    icon: "flame.svg",
  },
  spiritAnimal: {
    id: "spiritAnimal",
    slug: "spirit-animal",
    requiredAssessments: 6,
    title: "Spirit Animal",
    description: "A primal guide rises, embodying instincts that steer your path.",
    promptInstructions: {
      title: "<2-3 word mythic title naming the user's spirit animal>",
      details: "<Write exactly 3-4 concise sentences to describe the nature and behavior of a single, named spirit animal embodying a timeless essence. Use imagery tied to the animal's characteristics to indirectly reflect the user's core personality traits, revealing a hidden strength or pattern in their inner self through the animal's distinct qualities, ensuring descriptions are meaningful and specific to their traits.>",
    },
    category: "originRealm",
    categoryDescription: "The dawn of your myth, where primal essence takes shape.",
    icon: "animal.svg",
  },
  theRipple: {
    id: "theRipple",
    slug: "the-ripple",
    requiredAssessments: 9,
    title: "The Ripple",
    description: "Your essence ripples outward, shaping the world's vision of your myth.",
    promptInstructions: {
      title: "<2-3 word mythic title reflecting how others perceive the user's personality>",
      details: "<Write 2-3 concise sentences to describe how the user's core personality traits are perceived by others as a timeless, mythic presence. Use imagery tied to archetypal roles, life stories, or mythic figures to reveal a hidden strength or pattern in how their traits shape others’ views, ensuring descriptions are meaningful and specific to their traits.>",
    },
    category: "outerRealm",
    categoryDescription: "The waves you cast, shaping the world's view of your story.",
    icon: "wave.svg",
  },
  tarotArchetype: {
    id: "tarotArchetype",
    slug: "tarot-archetype",
    requiredAssessments: 12,
    title: "Tarot Archetype",
    description: "A mystic card unveils a facet of your soul, guiding you through life's mysteries.",
    promptInstructions: {
      title: "<The specific tarot card that the user is most aligned with>",
      details: "<Write a 2-3 sentence description of the tarot card that the user is most aligned with. Use imagery tied to the card's characteristics to reveal a hidden strength or pattern in their inner self, ensuring descriptions are meaningful and specific to their traits.>",
    },
    category: "innerRealm",
    categoryDescription: "The core of your being, where truth and desire forge your essence.",
    icon: "card.svg",
  },
  theHeart: {
    id: "theHeart",
    slug: "the-heart",
    requiredAssessments: 15,
    title: "The Heart",
    description: "At your core burns a truth, forged where drives meet fears.",
    promptInstructions: {
      title: "<2-4 word mythic title reflecting the user's core personality>",
      details: "<Write 2-3 concise sentences to describe the user's core personality traits as a timeless, mythic essence embodying what matters most to their inner self. Use imagery tied to archetypal roles, life stories, or mythic figures to reveal a hidden strength or pattern in their deepest values, ensuring descriptions are meaningful and specific to their traits.>",
    },
    category: "innerRealm",
    categoryDescription: "The core of your being, where truth and desire forge your essence.",
    icon: "heart-flame.svg",
  },
  elementalAlignment: {
    id: "elementalAlignment",
    slug: "elemental-alignment",
    requiredAssessments: 17,
    title: "Elemental Alignment",
    description: "An ancient element binds your traits, anchoring you to the cosmos.",
    promptInstructions: {
      title: "<The name of the element the user is most aligned with (Fire, Water, Earth, Air, Spirit)>",
      details: "<Write 2-3 concise sentences to describe the user’s core personality traits as a timeless cosmic element guiding their inner path. Use imagery tied to the element’s nature, archetypal roles, or mythic figures to reveal a hidden strength or pattern in how their traits align with the cosmos, ensuring descriptions are meaningful and specific to their traits.>",
    },
    category: "cosmicPath",
    categoryDescription: "The cosmic forces aligning your spirit with the universe's rhythm.",
    icon: "element.svg",
  },
  heroesJourney: {
    id: "heroesJourney",
    slug: "heroes-journey",
    requiredAssessments: 18,
    title: "Hero's Journey",
    description: "A stage of your epic unfolds, revealing your role in life's grand tale.",
    promptInstructions: {
      title: "<2-4 word mythic title naming the user's hero's journey stage>",
      details: "<Write 2-3 concise sentences to describe the user’s core personality traits as a timeless stage in a hero’s journey. Use imagery tied to archetypal roles, life stories, or mythic figures to reveal a hidden strength or pattern in their current life path, ensuring descriptions are meaningful and specific to their traits.>",
    },
    category: "cosmicPath",
    categoryDescription: "The cosmic forces aligning your spirit with the universe's rhythm.",
    icon: "path.svg",
  },
  theWeave: {
    id: "theWeave",
    slug: "the-weave",
    requiredAssessments: 19,
    title: "The Weave",
    description: "Your myth weaves together, threading past to destined path.",
    promptInstructions: {
      title: "<2-4 word mythic title reflecting the user's unifying destiny>",
      details: "<Write a 2-3 sentence actionable insight using mythic language to unify the user's dominant traits into a sense of purpose, then offer a unique, practical strategy for pursuing this purpose (e.g., career, relationships, personal growth). Example: 'Your weave binds empathy and vision, crafting a healer's path. Lead small group discussions to foster connection, using your insight to guide others.'>",
    },
    category: "destinyRealm",
    categoryDescription: "The path where traits converge, guiding you to your purpose.",
    icon: "tapestry.svg",
  },
  narrative: {
    id: "narrative",
    slug: "narrative",
    requiredAssessments: 20,
    title: "Narrative",
    description: "Your life's story unfolds, told through instinct and choice.",
    promptInstructions: {
      title: "<2-4 word mythic title naming the narrative's theme>",
      details: "<Write a 250-300 word narrative about an animal protagonist whose temperament, choices, and environment reflect the user's dominant traits from all dimensions, without naming the traits. Introduce a specific animal species and individual as the protagonist, present a realistic challenge, show how their traits inform their actions, highlight undervalued trait advantages (e.g., introversion fostering insight), maintain a mature, non-judgmental tone at a Grade 8-10 reading level, avoid fairy-tale clichés, and conclude with an earned, uplifting resolution. Example: 'The Quiet Fox navigates a storm-threatened forest, using keen senses to find a safe path, guiding others with subtle wisdom.'>",
    },
    category: "narrative",
    categoryDescription: "Your life's story, woven through instinct and choice.",
    icon: "scroll.svg",
  }
};

// Derived objects for backward compatibility
export const REVELATION_MILESTONES = Object.values(PERSONALITY_ANALYSIS_SECTIONS).map(section => ({
  key: section.id,
  slug: section.slug,
  requiredAssessments: section.requiredAssessments,
  title: section.title,
  description: section.description
}));

// Create categories object from unique categories in sections
const uniqueCategories = [...new Set(Object.values(PERSONALITY_ANALYSIS_SECTIONS).map(section => section.category))];
export const CATEGORIES = Object.fromEntries(
  uniqueCategories.map(categoryId => {
    const section = Object.values(PERSONALITY_ANALYSIS_SECTIONS).find(s => s.category === categoryId);
    return [categoryId, {
      id: categoryId,
      description: section?.categoryDescription || ''
    }];
  })
);

export default {
  SHARED_PROMPT_INSTRUCTIONS,
  REVELATION_MILESTONES,
  CATEGORIES,
  PERSONALITY_ANALYSIS_SECTIONS
};