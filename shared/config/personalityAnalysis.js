export const SHARED_PROMPT_INSTRUCTIONS = `
Generate insights based on the user's personality scores that are specific, actionable, and distinct from common personality test outputs.
Craft responses in a vivid, mythic, and poetic narrative tone to align with the 'self myth' aesthetic, evoking timeless storytelling.
Use clear, accessible language, emphasizing practical strategies for daily life (e.g., work, relationships, personal growth).
`;

// Master object containing all personality analysis data
export const PERSONALITY_ANALYSIS_SECTIONS = {
  theFlame: {
    id: "theFlame",
    slug: "the-flame",
    requiredAssessments: 3,
    title: "The Flame",
    description: "A primal light flares, whispering your soul's first truths.",
    promptInstructions: {
      title: "<2-3 word mythic title reflecting the user's initial trait>",
      details: "<Write a 2-3 sentence actionable insight using mythic, poetic language to describe the user's nature, then provide a specific, practical tip for leveraging this trait in daily life (e.g., relationships, work, self-growth). Example: 'A shadowed flame flickers in your soul, revealing a reflective spirit. Journal nightly to capture insights, guiding wiser choices in work or relationships.'>",
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
      details: "<3 sentences total: one mythic metaphor sentence, one explanation sentence, one actionable strategy sentence.>",
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
      title: "<2 word mythic title reflecting the user's external impact>",
      details: "<Write a 2-3 sentence actionable insight using mythic language to describe how the user's traits influence others, then offer a unique, practical strategy for enhancing their impact (e.g., communication, leadership, social settings). Example: 'Your vigilant ripple stirs hearts, a sensitive force that captivates quietly. In meetings, listen deeply, then share one bold idea to inspire trust.'>",
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
      title: "<The name of the tarot card archetype the user is most aligned with>",
      details: "<Write a 2-3 sentence actionable insight using mythic language to align the user with a tarot card archetype, then offer a unique, practical strategy for using this archetype's energy in daily life (e.g., personal growth, social interactions). Example: 'The Star's Light shines through your empathetic soul, guiding with hope. Schedule weekly reflection time to turn your sensitivity into creative insights for projects.'>",
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
      details: "<Write exactly two sentences using mythic language to reveal a unique emotional or psychological pattern, then provide a specific, actionable tip for leveraging or balancing this pattern in a real-world context (e.g., decision-making, stress management). Example: 'Your heart weaves bold visions with sharp fears, creating restless wisdom. Practice brief mindfulness pauses during stress to channel sensitivity into clarity.'>",
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
      details: "<Write a 2-3 sentence actionable insight using mythic language to align the user with an element (Fire, Water, Earth, Air), then provide a specific, practical strategy for channeling this element in daily life (e.g., leadership, relationships). Example: 'The Water's Flow courses through your empathetic soul, nurturing connections. In conflicts, use your compassion to mediate, fostering harmony in groups.'>",
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
      details: "<Write a 2-3 sentence actionable insight using mythic language to align the user with a specific hero's journey stage (e.g., The Threshold, The Mentor, avoiding The Quest or The Return), then offer a unique, practical strategy for embracing this stage in daily life (e.g., personal growth, challenges). Example: 'The Threshold calls your vigilant spirit, poised to face new challenges. Take one small risk weekly, like sharing an idea, to build confidence.'>",
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