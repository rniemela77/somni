export const SHARED_PROMPT_INSTRUCTIONS =
  "You are helping create a personality experience that reflects back to people the truth and quiet power of who they are. The goal is not to analyze or explain personality traits, but to translate them into archetypal reflections that feel timeless, beautiful, and true. Everything you generate should be emotionally resonant, accessible, and evocative — like modern myth, not academic analysis. Write for a smart, curious reader — somewhere between literary fiction and thoughtful introspection — but keep it clear and human. The ideal tone is: grounded but poetic, warm but precise, mysterious but never vague. Every output should leave the reader feeling seen, intrigued, and slightly more in love with who they already are. Never address the reader; instead use the archetype role name or “they/their.” Use simple grade 6-8 language."; // Master object containing all personality analysis data

export const PERSONALITY_ANALYSIS_SECTIONS = [
  {
    id: "theAwakening",
    slug: "the-awakening",
    requiredAssessments: 3,
    title: "The Awakening",
    description: "An introduction to your mythical persona.",
    promptInstructions: {
      title:
        "<Archetypal role name, 1-2 words. (Example: The Silent Sage, The Radiant Guide, The Adventurous Pathfinder, The Revelling Maverick, The Steadfast Champion, The Solitary Rebel)>",
      details:
        "<Write a short narrative (3 sentences) that reimagines the user's personality as if they were a mythic or timeless figure. Use metaphor and grounded imagery to express how their traits shape their way of being — how they move, decide, and thrive in the world. Do not label or name the traits. Instead, embody them through behavior, pattern, and symbolic choices. Sentence 1: Establish how they move through the world — their natural orientation. Sentence 2: Show how they respond to structure, challenge, or uncertainty. Sentence 3: Offer a moment of clarity, power, or overlooked strength — something the user might recognize but rarely celebrate. Keep it subtle, specific, and emotionally insightful. It should feel like a mirror that shows the soul, not a list of qualities.>",
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
        "<Write a short, vivid scene (3–4 sentences) showing how the character known as ‘&ROLE&’ is perceived by others in the world. Choose a setting that symbolically echoes their inner world — a marketplace, council chamber, crossroads, forest trail, ocean shore, or similar. In this scene: Let the character’s personality traits manifest through action, rhythm, or presence. Include a quiet, observant reaction from one stranger or ally — someone who notices what others might miss. Include a subtle misunderstanding, projection, or rumor that arises from how others perceive the character. Close with a small but meaningful insight — a gesture, look, or moment that hints at the deeper truth beneath the surface. Do not name the traits directly. Instead, show them — through small decisions, quiet patterns, or the way others feel around them. Focus on emotional realism and symbolic detail. The goal is to reflect how the character is experienced by others — with warmth, ambiguity, and quiet strength.>",
    },
  },
  {
    id: "theDestiny",
    slug: "the-destiny",
    requiredAssessments: 9,
    title: "The Destiny",
    description: "The persona's greater purpose is revealed.",
    promptInstructions: {
      title: "<2-3 words to describe the persona's greater purpose.>",
      details:
        "<Write a short passage (3–4 sentences) describing the quiet, essential role this character (‘&ROLE&’) is uniquely suited to play in the world. This isn’t a job or title — it’s the deeper work of their nature: the pattern they hold, the shift they bring, the gift they can’t help but offer. The tone should be mythic but grounded — a mix of destiny and subtle inevitability. Let their traits manifest as hidden strengths that shape their impact, even if others don’t always see it. You may hint at: What they protect or preserve, What they help others see or feel, What would be missing if they weren’t there. Do not name personality traits or get abstract. Use concrete image, motion, and quiet clarity. This is not about praise — it’s about placement in the larger world.>",
    },
  },
  {
    id: "theTrial",
    slug: "the-trial",
    requiredAssessments: 12,
    title: "The Inner Trial",
    description: "A short legend that mirrors the persona's choices.",
    promptInstructions: {
      title: "<2-3 words to describe the persona's inner trial.>",
      details:
        "<Write a short, emotionally resonant passage (3–4 sentences) showing the kind of challenges or tensions this persona faces as a result of how they’re wired. These are not flaws — they are the natural friction of being this way in a world that often moves differently. Show: What weighs on them or wears them down, What they carry quietly or what others don’t realize takes effort, How they adapt, protect themselves, or recover. Use metaphor and grounded image, not analysis or abstract phrasing. The tone should be honest but gentle — never self-pitying. The purpose is to reflect back their quiet endurance and the cost of their gifts.>",
    },
  },
  {
    id: "theProphecy",
    slug: "the-prophecy",
    requiredAssessments: 15,
    title: "The Prophecy",
    description: "A glimpse of the persona's possible future.",
    promptInstructions: {
      title: "<2-3 words to describe the persona's prophecy.>",
      details:
        "<Write around 100 words that reflects the quiet change this persona leaves in their wake. This is not about success, status, or attention — it is about the pattern they restore, the question they help others ask, or the feeling they make possible. Show: What softens, reorients, or opens around them, What others slowly realize after they’re gone, What grows differently because of how they moved through a space, moment, or season. Use grounded metaphor or poetic image. Do not make it grandiose — it should feel subtle, real, and resonant. Leave the reader with a quiet sense of beauty, meaning, and contribution.>",
    },
  },
  {
    id: "theTurningPoint",
    slug: "the-turning-point",
    requiredAssessments: 18,
    title: "The Turning Point",
    description: "How the persona’s story is retold in the mythic world.",
    promptInstructions: {
      title: "<2-3 words to describe the persona's turning point.>",
      details:
        "<Write a short, charged scene (3–5 sentences) where the character (‘&ROLE&’) reaches a turning point — a moment that draws them out of their pattern and into decisive presence. It might be: A quiet crisis that only they notice, A moment where others falter and their unique strength fills the gap, A subtle threshold that requires them to act — not as someone new, but as who they’ve always been becoming. This is not a climax — it is a shift. A calling. A sense that the time for hiding, hesitating, or simply observing is over. Use imagery and mood to show the atmosphere of this moment. Do not describe what happens next. The story pauses on the edge — with clarity, weight, and anticipation.>",
    },
  },
  {
    id: "theShadow",
    slug: "the-shadow",
    requiredAssessments: 19,
    title: "The Shadow",
    description: "The persona's shadow side.",
    promptInstructions: {
      title: "<2-3 words to describe the persona's shadow.>",
      details:
        "<Write a short, emotionally honest reflection (3–4 sentences) describing the shadow of this persona — the tension, habit, or reaction that can overgrow their gifts when they are tired, unseen, or uncertain. This is not a flaw to be fixed, but a pattern to understand: the way their strength can become sharp, or soft, or small in the wrong season. Show: What they tend to avoid, deny, or overdo, What emerges when they are overwhelmed or disconnected from purpose, What they might not notice until it's already shaping how they move. Use grounded image or metaphor. Do not be clinical or harsh. The tone is reflective, compassionate, and true.>",
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
        "<Write a short, emotionally resonant reflection (3–4 sentences) that reveals a strength this persona carries that is rarely seen — even by themselves. This is a capacity that grows quietly beneath their patterns: something that appears slowly, under pressure, or in moments when no one is watching. Show: What strength lives in their restraint, observation, care, or refusal to follow the crowd, How they endure, shift others, or hold meaning without needing recognition, Why this strength is rarely named, but deeply needed in the world. Use metaphor or poetic image, but make the impact feel real. The tone should be reverent, clear, and affirming — not grandiose, just true.>",
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
