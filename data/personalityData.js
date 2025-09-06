const personalityData = [
  {
    id: "introversion_extraversion",
    displayName: "Introversion-Extraversion",
    positive: "Extraversion",
    negative: "Introversion",
    positive_label: "Outer World",
    negative_label: "Inner World",
    title: "Social Dynamics",
    slug: "social_dynamics",
    description:
      "This quest reveals how you move through the world: inward and deep, or outward and bright.",
    traits: {
      positive: {
        name: "Extraversion",
        strength:
          "Masterful at forging instant alliances, turning strangers into collaborators during crises or high-stakes negotiations",
        blindspot:
          "Often chase external validation, missing subtle internal cues that signal burnout before it crashes your momentum",
        description:
          "Extraverts thrive in chaotic environments, turning social noise into fuel for innovation, like DJs remixing a crowd's energy into breakthroughs. They draw energy from social interaction and external stimulation. They tend to think out loud, seek out group activities, and feel energized by being around others. They often process experiences by discussing them and prefer active engagement with the world around them.",
      },
      negative: {
        name: "Introversion",
        strength:
          "Unmatched ability to listen actively, extracting unspoken truths from conversations that lead to profound empathy and strategic insights",
        blindspot:
          "Tendency to over-rehearse responses, delaying action in fast-paced scenarios where spontaneity could seize unexpected opportunities",
        description:
          "Introverts excel in 'mental marathons', sustaining deep dives into complex problems where others tire, uncovering hidden patterns in data or ideas. They gain energy from solitude and internal reflection. They prefer deep one-on-one conversations, need quiet time to recharge, and process experiences internally before sharing. They often have rich inner lives and value meaningful, intimate connections over broad social networks.",
      },
    },
    questions: [
      {
        id: 1,
        text: "I seek out lively gatherings to share ideas and stories with many people",
        points: 1,
      },
      {
        id: 2,
        text: "I find deep satisfaction in exploring my thoughts alone for long periods",
        points: -1,
      },
      {
        id: 3,
        text: "I strike up conversations with unfamiliar people in most situations",
        points: 1,
      },
      {
        id: 4,
        text: "I prefer to reflect carefully before sharing my opinions with others",
        points: -1,
      },
      {
        id: 5,
        text: "I feel energized by being the center of attention in a group",
        points: 1,
      },
    ],
  },
  {
    id: "neuroticism_emotional_stability",
    displayName: "Neuroticism-Emotional Stability",
    positive: "Emotional Stability",
    negative: "Neuroticism",
    positive_label: "Stillness",
    negative_label: "Storm",
    title: "Emotional Landscape",
    slug: "emotional_landscape",
    description:
      "This quest explores how you carry tension — whether storms pass through you or settle in your bones.",
    traits: {
      positive: {
        name: "Emotional Stability",
        strength:
          "Unwavering composure that fosters trust and steady progress, even when external pressures mount, enabling long-term goal pursuit",
        blindspot:
          "Underestimating emotional undercurrents in others, leading to overlooked interpersonal frictions that could erupt unexpectedly",
        description:
          "Emotionally stable individuals serve as anchors in storms, maintaining clarity amid chaos, allowing teams to navigate crises without panic. They maintain a balanced emotional state, experience fewer mood swings, and are better able to manage stress. They tend to be more resilient and have a more positive outlook on life.",
      },
      negative: {
        name: "Neuroticism",
        strength:
          "Heightened vigilance that turns potential threats into opportunities for proactive fixes, like spotting flaws in plans before they derail success",
        blindspot:
          "Over-amplifying minor setbacks into catastrophes, draining energy on imagined worst-cases that rarely materialize",
        description:
          "Neurotics act as human seismographs, detecting emotional tremors early, which can preempt disasters in relationships or projects by sensing unspoken tensions. They experience more frequent mood fluctuations, are more sensitive to stress, and may struggle with anxiety and depression. They often have a more negative outlook on life and may be more prone to emotional outbursts.",
      },
    },
    questions: [
      {
        id: 1,
        text: "I worry extensively about possible future misfortunes, even when things are going well",
        points: -1,
      },
      {
        id: 2,
        text: "I remain calm and focused during unexpected challenges or setbacks",
        points: 1,
      },
      {
        id: 3,
        text: "I experience intense mood swings in response to daily events",
        points: -1,
      },
      {
        id: 4,
        text: "I bounce back quickly from disappointments without dwelling on them",
        points: 1,
      },
      {
        id: 5,
        text: "I feel overwhelmed by stress from minor issues in my routine",
        points: -1,
      },
    ],
  },
  {
    id: "openness_closedness",
    displayName: "Openness-Closedness",
    positive: "Openness",
    negative: "Closedness",
    positive_label: "Seeker",
    negative_label: "Steward",
    title: "Curiosity Continuum",
    slug: "curiosity_continuum",
    description:
      "This quest unveils your relationship with the unknown: do you seek the uncharted, or walk trusted ground?",
    traits: {
      positive: {
        name: "Openness",
        strength:
          "Adapts swiftly to novel ideas, synthesizing diverse perspectives into groundbreaking solutions",
        blindspot:
          "May overlook practical constraints, chasing visionary ideas that are hard to implement",
        description:
          "Open individuals are intellectual explorers, diving into uncharted ideas with curiosity, like artists weaving new patterns from chaos. They embrace novelty, value creativity, and seek diverse experiences, often thriving in ambiguity and abstract thinking.",
      },
      negative: {
        name: "Closedness",
        strength:
          "Excels at refining proven methods, ensuring reliability and efficiency in stable environments",
        blindspot:
          "May resist innovative approaches, missing opportunities for growth in rapidly changing contexts",
        description:
          "Closed individuals are guardians of tradition, finding comfort in the familiar, like craftsmen perfecting a time-tested skill. They prioritize practicality, prefer routine, and value stability, often excelling in structured settings.",
      },
    },
    questions: [
      {
        id: 1,
        text: "I seek out new and unfamiliar experiences to broaden my perspective",
        points: 1,
      },
      {
        id: 2,
        text: "I prefer familiar routines over exploring untested possibilities",
        points: -1,
      },
      {
        id: 3,
        text: "I enjoy experimenting with ideas that challenge conventional thinking",
        points: 1,
      },
      {
        id: 4,
        text: "I find comfort in sticking to traditions and established methods",
        points: -1,
      },
      {
        id: 5,
        text: "I am eager to learn about subjects outside my usual interests",
        points: 1,
      },
    ],
  },
  {
    id: "agreeableness_antagonism",
    displayName: "Agreeableness-Antagonism",
    positive: "Agreeableness",
    negative: "Antagonism",
    positive_label: "Harmony",
    negative_label: "Edge",
    title: "Interpersonal Harmony",
    slug: "interpersonal_harmony",
    description:
      "This quest reveals how you navigate others — through harmony and trust, or through testing and truth.",
    traits: {
      positive: {
        name: "Agreeableness",
        strength:
          "Builds trust through empathy, creating cohesive teams that thrive on mutual support",
        blindspot:
          "May avoid necessary conflict, allowing unresolved issues to fester",
        description:
          "Agreeable individuals are social glue, fostering harmony with kindness, like mediators calming a stormy debate. They prioritize cooperation, empathy, and altruism, often putting others' needs first.",
      },
      negative: {
        name: "Antagonism",
        strength:
          "Drives progress by challenging flawed ideas, ensuring decisions are rigorously vetted",
        blindspot:
          "May alienate allies with bluntness, undermining collaboration when tact is needed",
        description:
          "Antagonistic individuals are bold truth-seekers, unafraid to confront, like debaters exposing weak arguments. They value honesty and competition, often prioritizing goals over feelings.",
      },
    },
    questions: [
      {
        id: 1,
        text: "I prioritize others' needs even when it inconveniences me",
        points: 1,
      },
      {
        id: 2,
        text: "I challenge others' ideas openly to ensure the best outcome",
        points: -1,
      },
      {
        id: 3,
        text: "I strive to maintain harmony in my interactions with others",
        points: 1,
      },
      {
        id: 4,
        text: "I push back against decisions I disagree with, regardless of feelings",
        points: -1,
      },
      {
        id: 5,
        text: "I go out of my way to help others resolve their conflicts",
        points: 1,
      },
    ],
  },
  {
    id: "conscientiousness_disinhibition",
    displayName: "Conscientiousness-Disinhibition",
    positive: "Conscientiousness",
    negative: "Disinhibition",
    positive_label: "Structure",
    negative_label: "Flow",
    title: "Duty and Drive",
    slug: "duty_and_drive",
    description:
      "This quest weighs the rhythm of your will — structured and steady, or spontaneous and free.",
    traits: {
      positive: {
        name: "Conscientiousness",
        strength:
          "Delivers consistent results through meticulous planning, ensuring long-term success",
        blindspot:
          "May over-plan, missing opportunities that require quick, intuitive decisions",
        description:
          "Conscientious individuals are the architects of order, building success with discipline, like navigators charting a precise course. They are organized, reliable, and goal-driven, prioritizing duty and structure.",
      },
      negative: {
        name: "Disinhibition",
        strength:
          "Embraces spontaneity, seizing fleeting opportunities others miss due to hesitation",
        blindspot:
          "May neglect long-term goals, derailed by impulsive choices or distractions",
        description:
          "Disinhibited individuals are free-spirited opportunists, thriving in the moment, like improvisers on a stage. They act on impulse, embrace flexibility, and often resist rigid plans.",
      },
    },
    questions: [
      {
        id: 1,
        text: "I follow a structured plan to achieve my goals",
        points: 1,
      },
      {
        id: 2,
        text: "I act on sudden impulses without much forethought",
        points: -1,
      },
      {
        id: 3,
        text: "I complete tasks thoroughly before moving to new ones",
        points: 1,
      },
      {
        id: 4,
        text: "I prefer to go with the flow rather than stick to schedules",
        points: -1,
      },
      {
        id: 5,
        text: "I take time to organize my tasks to ensure efficiency",
        points: 1,
      },
    ],
  },
  {
    id: "humility_arrogance",
    displayName: "Humility–Arrogance",
    positive: "Humility",
    negative: "Arrogance",
    positive_label: "Hidden Light",
    negative_label: "Shining Crown",
    title: "Integrity Spectrum",
    slug: "integrity_spectrum",
    description:
      "This quest explores how you hold your worth: quietly, like a hidden ember, or boldly, like a rising flame.",
    traits: {
      positive: {
        name: "Humility",
        strength:
          "Builds trust through genuine transparency, fostering authentic and lasting relationships",
        blindspot:
          "May undervalue self-promotion, missing chances to showcase strengths and contributions",
        description:
          "Humble individuals are grounded and sincere, acting with honesty and fairness, like guides who prioritize truth over status. They are modest, cooperative, and avoid manipulation or entitlement.",
      },
      negative: {
        name: "Arrogance",
        strength:
          "Commands attention with confidence, driving bold initiatives and inspiring followership",
        blindspot:
          "May overestimate their abilities, dismissing valuable input and undermining collaboration",
        description:
          "Arrogant individuals are self-assured trailblazers, projecting dominance like leaders claiming the spotlight. They prioritize recognition and status, sometimes bending fairness to maintain superiority.",
      },
    },
    questions: [
      {
        id: 1,
        text: "I treat others fairly, even if it means less gain for me",
        points: 1,
      },
      {
        id: 2,
        text: "I seek recognition for my achievements above others",
        points: -1,
      },
      {
        id: 3,
        text: "I admit my mistakes openly to maintain honesty",
        points: 1,
      },
      {
        id: 4,
        text: "I believe my abilities surpass most people around me",
        points: -1,
      },
      {
        id: 5,
        text: "I avoid taking credit for others' contributions",
        points: 1,
      },
    ],
  },
  {
    id: "sensing_intuition",
    displayName: "Sensing-Intuition",
    positive: "Intuition",
    negative: "Sensing",
    positive_label: "The Unseen",
    negative_label: "The Known",
    title: "Perception Pathways",
    slug: "perception_pathways",
    description:
      "This quest reveals how you perceive: through what is seen and touched, or what is sensed and felt.",
    traits: {
      positive: {
        name: "Intuition",
        strength:
          "Anticipates future trends by connecting abstract patterns, driving innovation",
        blindspot:
          "May overlook present realities, chasing ideas detached from practicality",
        description:
          "Intuitive individuals are visionaries, weaving possibilities from abstract clues, like poets seeing meaning in the unseen. They focus on future potential, patterns, and big-picture thinking.",
      },
      negative: {
        name: "Sensing",
        strength:
          "Masters details, ensuring accuracy and reliability in tangible tasks",
        blindspot:
          "May miss broader implications, sticking too closely to immediate facts",
        description:
          "Sensing individuals are grounded observers, excelling in the present, like artisans perfecting the details of their craft. They prioritize concrete facts, sensory input, and practical realities.",
      },
    },
    questions: [
      {
        id: 1,
        text: "I focus on future possibilities over current realities",
        points: 1,
      },
      {
        id: 2,
        text: "I rely on concrete facts to guide my decisions",
        points: -1,
      },
      {
        id: 3,
        text: "I explore abstract ideas to solve complex problems",
        points: 1,
      },
      {
        id: 4,
        text: "I prefer to work with tangible, observable information",
        points: -1,
      },
      {
        id: 5,
        text: "I trust my hunches about what might happen next",
        points: 1,
      },
    ],
  },
  {
    id: "thinking_feeling",
    displayName: "Thinking-Feeling",
    positive: "Thinking",
    negative: "Feeling",
    positive_label: "Clarity",
    negative_label: "Warmth",
    title: "Decision Dynamics",
    slug: "decision_dynamics",
    description:
      "This quest explores how you choose — by reason's edge or the heart's pull.",
    traits: {
      positive: {
        name: "Thinking",
        strength:
          "Makes impartial decisions, ensuring fairness in complex dilemmas",
        blindspot:
          "May neglect emotional impacts, causing unintended relational strain",
        description:
          "Thinkers are analytical judges, weighing decisions with logic, like scientists testing hypotheses. They prioritize objectivity, consistency, and rational analysis over emotions.",
      },
      negative: {
        name: "Feeling",
        strength:
          "Aligns decisions with values, fostering empathy-driven solutions",
        blindspot:
          "May compromise logic for harmony, leading to inconsistent outcomes",
        description:
          "Feelers are compassionate decision-makers, guided by values, like diplomats balancing human needs. They prioritize empathy, personal beliefs, and relational harmony.",
      },
    },
    questions: [
      {
        id: 1,
        text: "I base decisions on logical analysis over personal values",
        points: 1,
      },
      {
        id: 2,
        text: "I consider my emotions when making important choices",
        points: -1,
      },
      {
        id: 3,
        text: "I prioritize fairness over feelings in resolving disputes",
        points: 1,
      },
      {
        id: 4,
        text: "I make choices to align with my core beliefs and values",
        points: -1,
      },
      {
        id: 5,
        text: "I evaluate options using objective criteria over gut feelings",
        points: 1,
      },
    ],
  },
  {
    id: "judging_perceiving",
    displayName: "Judging-Perceiving",
    positive: "Judging",
    negative: "Perceiving",
    positive_label: "The Path",
    negative_label: "The Wind",
    title: "Life Approach",
    slug: "life_approach",
    description:
      "This quest uncovers your pathfinding style — clear maps or shifting winds.",
    traits: {
      positive: {
        name: "Judging",
        strength:
          "Drives progress with decisive plans, ensuring timely goal achievement",
        blindspot:
          "May resist adapting to unexpected changes, limiting flexibility",
        description:
          "Judging individuals are master planners, creating order, like conductors leading a symphony. They prefer structure, decisiveness, and clear goals, thriving in organized settings.",
      },
      negative: {
        name: "Perceiving",
        strength:
          "Adapts fluidly to change, seizing opportunities in unpredictable settings",
        blindspot:
          "May procrastinate, leaving tasks unfinished due to indecision",
        description:
          "Perceiving individuals are adaptable explorers, embracing flexibility, like sailors navigating shifting winds. They prefer spontaneity, openness, and freedom from rigid plans.",
      },
    },
    questions: [
      {
        id: 1,
        text: "I plan my activities to avoid last-minute changes",
        points: 1,
      },
      {
        id: 2,
        text: "I keep my options open rather than commit early",
        points: -1,
      },
      {
        id: 3,
        text: "I prefer to follow a clear schedule for my tasks",
        points: 1,
      },
      {
        id: 4,
        text: "I enjoy adapting to unexpected opportunities as they arise",
        points: -1,
      },
      {
        id: 5,
        text: "I set firm goals and work steadily to achieve them",
        points: 1,
      },
    ],
  },
  {
    id: "psychoticism_socialization",
    displayName: "Psychoticism-Socialization",
    positive: "Socialization",
    negative: "Psychoticism",
    positive_label: "The Weaver",
    negative_label: "The Wanderer",
    title: "Social Integration",
    slug: "social_integration",
    description:
      "This quest reveals your place in the pattern — do you walk the circle, or redraw its lines?",
    traits: {
      positive: {
        name: "Socialization",
        strength:
          "Fosters group cohesion by upholding shared norms, building trust",
        blindspot:
          "May conform excessively, stifling personal expression or innovation",
        description:
          "Socialized individuals are community builders, aligning with norms, like citizens strengthening a society. They value cooperation, social harmony, and adherence to rules.",
      },
      negative: {
        name: "Psychoticism",
        strength:
          "Challenges norms boldly, sparking unconventional ideas and change",
        blindspot:
          "May disrupt group dynamics, creating conflict with nonconformity",
        description:
          "Psychotic individuals are rebels, defying conventions, like pioneers breaking new ground. They prioritize individuality, risk-taking, and unconventional thinking.",
      },
    },
    questions: [
      {
        id: 1,
        text: "I follow social norms to maintain harmony with others",
        points: 1,
      },
      {
        id: 2,
        text: "I challenge societal rules that seem restrictive or outdated",
        points: -1,
      },
      {
        id: 3,
        text: "I respect traditions to strengthen group bonds",
        points: 1,
      },
      {
        id: 4,
        text: "I act in ways that stand out from typical expectations",
        points: -1,
      },
      {
        id: 5,
        text: "I align my actions with widely accepted values",
        points: 1,
      },
    ],
  },
  {
    id: "optimism_pessimism",
    displayName: "Optimism-Pessimism",
    positive: "Optimism",
    negative: "Pessimism",
    positive_label: "Lightward",
    negative_label: "Shadowward",
    title: "Outlook Orientation",
    slug: "outlook_orientation",
    description:
      "This quest explores your outlook — do you look for dawn, or guard against dusk?",
    traits: {
      positive: {
        name: "Optimism",
        strength:
          "Inspires action by envisioning positive outcomes, rallying others",
        blindspot:
          "May underestimate risks, leading to unpreparedness for setbacks",
        description:
          "Optimists are beacons of hope, seeing possibilities, like adventurers expecting treasure. They focus on positive outcomes, resilience, and opportunity-driven thinking.",
      },
      negative: {
        name: "Pessimism",
        strength:
          "Anticipates risks thoroughly, preparing robust contingency plans",
        blindspot: "May dwell on negatives, dampening motivation or innovation",
        description:
          "Pessimists are cautious sentinels, guarding against failure, like watchmen scanning for danger. They focus on risks, challenges, and potential pitfalls.",
      },
    },
    questions: [
      {
        id: 1,
        text: "I expect positive outcomes from my endeavors",
        points: 1,
      },
      {
        id: 2,
        text: "I prepare for the worst to avoid disappointment",
        points: -1,
      },
      {
        id: 3,
        text: "I see challenges as opportunities for growth",
        points: 1,
      },
      {
        id: 4,
        text: "I focus on potential obstacles before taking action",
        points: -1,
      },
      {
        id: 5,
        text: "I believe things will generally work out well",
        points: 1,
      },
    ],
  },
  {
    id: "assertiveness_passivity",
    displayName: "Assertiveness-Passivity",
    positive: "Assertiveness",
    negative: "Passivity",
    positive_label: "Flame",
    negative_label: "River",
    title: "Influence Style",
    slug: "influence_style",
    description:
      "This quest reveals how you meet resistance — by stepping forward or holding ground.",
    traits: {
      positive: {
        name: "Assertiveness",
        strength:
          "Drives change by confidently voicing needs, shaping outcomes",
        blindspot: "May dominate discussions, overlooking quieter voices",
        description:
          "Assertive individuals are bold influencers, shaping their world, like captains steering a ship. They express needs clearly, take initiative, and lead decisively.",
      },
      negative: {
        name: "Passivity",
        strength:
          "Fosters collaboration by listening, ensuring all perspectives are heard",
        blindspot:
          "May avoid leadership, missing chances to shape critical outcomes",
        description:
          "Passive individuals are quiet supporters, yielding to others, like crew members harmonizing a team. They avoid conflict, defer decisions, and prioritize group consensus.",
      },
    },
    questions: [
      {
        id: 1,
        text: "I express my needs clearly, even in tense situations",
        points: 1,
      },
      {
        id: 2,
        text: "I defer to others’ preferences to maintain peace",
        points: -1,
      },
      {
        id: 3,
        text: "I take the lead in group decisions when needed",
        points: 1,
      },
      {
        id: 4,
        text: "I avoid confrontation by agreeing with others",
        points: -1,
      },
      {
        id: 5,
        text: "I advocate for my ideas to influence outcomes",
        points: 1,
      },
    ],
  },
  {
    id: "empathy_callousness",
    displayName: "Empathy-Callousness",
    positive: "Empathy",
    negative: "Callousness",
    positive_label: "Open Heart",
    negative_label: "Iron Veil",
    title: "Emotional Connection",
    slug: "emotional_connection",
    description:
      "This quest unveils how you hold the feelings of others — close to the chest or at a careful distance.",
    traits: {
      positive: {
        name: "Empathy",
        strength:
          "Builds deep bonds by understanding others’ emotions, fostering trust",
        blindspot:
          "May over-prioritize others’ feelings, neglecting personal needs",
        description:
          "Empathetic individuals are emotional bridges, connecting hearts, like healers soothing pain. They sense others’ feelings, prioritize compassion, and nurture relationships.",
      },
      negative: {
        name: "Callousness",
        strength:
          "Maintains focus on goals, undeterred by emotional distractions",
        blindspot: "May harm relationships by ignoring others’ emotional needs",
        description:
          "Callous individuals are pragmatic taskmasters, prioritizing outcomes, like generals focused on victory. They detach from emotions, value efficiency, and may seem cold.",
      },
    },
    questions: [
      { id: 1, text: "I feel deeply affected by others’ struggles", points: 1 },
      {
        id: 2,
        text: "I prioritize my goals over others’ emotional needs",
        points: -1,
      },
      {
        id: 3,
        text: "I try to understand others’ feelings before acting",
        points: 1,
      },
      {
        id: 4,
        text: "I focus on results over emotional considerations",
        points: -1,
      },
      { id: 5, text: "I comfort others when they are distressed", points: 1 },
    ],
  },
  {
    id: "impulsivity_self_control",
    displayName: "Impulsivity-Self-Control",
    positive: "Self-Control",
    negative: "Impulsivity",
    positive_label: "Measured Hand",
    negative_label: "Wild Spark",
    title: "Behavioral Regulation",
    slug: "behavioral_regulation",
    description:
      "This quest explores how you act — in sparks, or in steps.",
    traits: {
      positive: {
        name: "Self-Control",
        strength:
          "Maintains focus on long-term goals, avoiding costly distractions",
        blindspot:
          "May miss spontaneous opportunities by over-regulating actions",
        description:
          "Self-controlled individuals are disciplined navigators, steering steadily, like pilots avoiding turbulence. They prioritize restraint, planning, and long-term outcomes.",
      },
      negative: {
        name: "Impulsivity",
        strength:
          "Seizes fleeting moments, acting decisively in fast-paced scenarios",
        blindspot: "May act recklessly, undermining goals with hasty decisions",
        description:
          "Impulsive individuals are bold opportunists, diving into action, like dancers moving to a sudden beat. They act on instinct, embrace risk, and prioritize immediate rewards.",
      },
    },
    questions: [
      { id: 1, text: "I think carefully before making decisions", points: 1 },
      { id: 2, text: "I act on sudden urges without much thought", points: -1 },
      {
        id: 3,
        text: "I resist temptations to stay focused on my goals",
        points: 1,
      },
      { id: 4, text: "I pursue immediate rewards even if risky", points: -1 },
      {
        id: 5,
        text: "I plan my actions to avoid impulsive mistakes",
        points: 1,
      },
    ],
  },
  {
    id: "resilience_fragility",
    displayName: "Resilience-Fragility",
    positive: "Resilience",
    negative: "Fragility",
    positive_label: "Oak",
    negative_label: "Glass",
    title: "Adversity Response",
    slug: "adversity_response",
    description:
      "This quest uncovers how you bend under pressure — and whether you break, or become something new.",
    traits: {
      positive: {
        name: "Resilience",
        strength:
          "Thrives under pressure, turning setbacks into growth opportunities",
        blindspot: "May push through pain, ignoring needed rest or support",
        description:
          "Resilient individuals are sturdy oaks, bending but not breaking, like warriors enduring storms. They recover quickly, adapt to challenges, and maintain optimism.",
      },
      negative: {
        name: "Fragility",
        strength:
          "Senses vulnerabilities early, prompting cautious protective measures",
        blindspot:
          "May crumble under pressure, amplifying setbacks into crises",
        description:
          "Fragile individuals are delicate sensors, highly aware of stress, like glass attuned to cracks. They may struggle to recover, feeling overwhelmed by challenges.",
      },
    },
    questions: [
      {
        id: 1,
        text: "I recover quickly from setbacks and move forward",
        points: 1,
      },
      { id: 2, text: "I feel overwhelmed by life’s challenges", points: -1 },
      { id: 3, text: "I adapt easily to difficult circumstances", points: 1 },
      {
        id: 4,
        text: "I struggle to cope with unexpected hardships",
        points: -1,
      },
      { id: 5, text: "I find strength in adversity to keep going", points: 1 },
    ],
  },
  {
    id: "creativity_conventionality",
    displayName: "Creativity-Conventionality",
    positive: "Creativity",
    negative: "Conventionality",
    positive_label: "The Artist",
    negative_label: "The Architect",
    title: "Innovation Spectrum",
    slug: "innovation_spectrum",
    description:
      "This quest reveals your relationship with creation — do you weave new shapes, or tend the ancient forms?",
    traits: {
      positive: {
        name: "Creativity",
        strength:
          "Generates novel solutions, transforming challenges into opportunities",
        blindspot:
          "May prioritize originality over practicality, risking inefficiency",
        description:
          "Creative individuals are idea alchemists, crafting novelty, like artists painting new worlds. They value originality, imagination, and unconventional approaches.",
      },
      negative: {
        name: "Conventionality",
        strength:
          "Ensures reliability by refining trusted methods, avoiding risky experiments",
        blindspot: "May resist change, missing innovative breakthroughs",
        description:
          "Conventional individuals are stewards of tradition, perfecting the known, like builders using proven blueprints. They prioritize reliability, tradition, and practicality.",
      },
    },
    questions: [
      { id: 1, text: "I seek original ways to solve problems", points: 1 },
      {
        id: 2,
        text: "I prefer proven methods over new approaches",
        points: -1,
      },
      { id: 3, text: "I enjoy creating unique ideas or products", points: 1 },
      { id: 4, text: "I stick to familiar ways to ensure success", points: -1 },
      {
        id: 5,
        text: "I explore unconventional ideas for inspiration",
        points: 1,
      },
    ],
  },
  {
    id: "religiosity_secularism",
    displayName: "Religiosity-Secularism",
    positive: "Secularism",
    negative: "Religiosity",
    positive_label: "The Scholar",
    negative_label: "The Believer",
    title: "Belief Orientation",
    slug: "belief_orientation",
    description:
      "This quest explores how you seek meaning — through faith in something higher, or trust in what you can hold.",
    traits: {
      positive: {
        name: "Secularism",
        strength:
          "Grounds decisions in evidence, fostering objective problem-solving",
        blindspot:
          "May dismiss spiritual insights, missing deeper meaning or motivation",
        description:
          "Secular individuals are rational navigators, guided by evidence, like scientists probing reality. They prioritize logic, skepticism, and empirical reasoning.",
      },
      negative: {
        name: "Religiosity",
        strength:
          "Finds purpose through faith, inspiring resilience in tough times",
        blindspot: "May cling to beliefs, overlooking contradictory evidence",
        description:
          "Religious individuals are spiritual anchors, finding meaning in faith, like pilgrims seeking divine guidance. They prioritize spiritual values, tradition, and community.",
      },
    },
    questions: [
      {
        id: 1,
        text: "I rely on evidence and reason to form my beliefs",
        points: 1,
      },
      {
        id: 2,
        text: "I find guidance in spiritual or religious beliefs",
        points: -1,
      },
      {
        id: 3,
        text: "I question beliefs that lack empirical support",
        points: 1,
      },
      {
        id: 4,
        text: "I draw strength from my spiritual convictions",
        points: -1,
      },
      { id: 5, text: "I base decisions on logic over faith", points: 1 },
    ],
  },
  {
    id: "masculinity_femininity",
    displayName: "Masculinity-Femininity",
    positive: "Femininity",
    negative: "Masculinity",
    positive_label: "The Nurturer",
    negative_label: "The Warrior",
    title: "Gender Expression",
    slug: "gender_expression",
    description:
      "This quest reveals your balance of strength and nurture, direction and depth.",
    traits: {
      positive: {
        name: "Femininity",
        strength:
          "Nurtures relationships with warmth, fostering deep emotional bonds",
        blindspot:
          "May prioritize others’ needs, neglecting personal ambitions",
        description:
          "Feminine individuals are relational caregivers, weaving connection, like gardeners tending bonds. They emphasize nurturing, empathy, and collaboration.",
      },
      negative: {
        name: "Masculinity",
        strength:
          "Drives outcomes with bold assertiveness, leading decisive action",
        blindspot: "May suppress emotions, straining interpersonal connections",
        description:
          "Masculine individuals are action-oriented leaders, pushing forward, like warriors claiming victory. They prioritize assertiveness, independence, and achievement.",
      },
    },
    questions: [
      {
        id: 1,
        text: "I prioritize nurturing others’ emotional needs",
        points: 1,
      },
      {
        id: 2,
        text: "I focus on achieving goals over emotional bonds",
        points: -1,
      },
      { id: 3, text: "I show warmth to strengthen relationships", points: 1 },
      { id: 4, text: "I assert my needs to drive results", points: -1 },
      { id: 5, text: "I comfort others to build trust", points: 1 },
    ],
  },
  {
    id: "authoritarianism_egalitarianism",
    displayName: "Authoritarianism-Egalitarianism",
    positive: "Egalitarianism",
    negative: "Authoritarianism",
    positive_label: "The Circle",
    negative_label: "The Pyramid",
    title: "Power Dynamics",
    slug: "power_dynamics",
    description:
      "This quest explores your sense of order — built from hierarchy or shared ground.",
    traits: {
      positive: {
        name: "Egalitarianism",
        strength:
          "Promotes fairness, empowering diverse voices in group decisions",
        blindspot:
          "May struggle with leadership voids in high-stakes scenarios",
        description:
          "Egalitarian individuals are champions of fairness, leveling power, like mediators ensuring all are heard. They value equality, collaboration, and shared responsibility.",
      },
      negative: {
        name: "Authoritarianism",
        strength:
          "Provides clear direction, ensuring efficiency in critical moments",
        blindspot: "May suppress dissent, stifling creativity or fairness",
        description:
          "Authoritarian individuals are decisive commanders, enforcing order, like generals leading with authority. They prioritize hierarchy, control, and swift decision-making.",
      },
    },
    questions: [
      {
        id: 1,
        text: "I believe everyone’s input deserves equal consideration",
        points: 1,
      },
      {
        id: 2,
        text: "I support strong leadership to maintain order",
        points: -1,
      },
      { id: 3, text: "I promote shared decision-making in groups", points: 1 },
      { id: 4, text: "I value clear authority to guide actions", points: -1 },
      {
        id: 5,
        text: "I advocate for fairness over rigid hierarchies",
        points: 1,
      },
    ],
  },
  {
    id: "narcissism_modesty",
    displayName: "Narcissism-Modesty",
    positive: "Modesty",
    negative: "Narcissism",
    positive_label: "The Mirror",
    negative_label: "The Spotlight",
    title: "Self-Perception",
    slug: "self_perception",
    description:
      "This quest uncovers how you reflect the self — as a spotlight, or a mirror turned outward.",
    traits: {
      positive: {
        name: "Modesty",
        strength:
          "Builds trust by sharing credit, fostering collaborative success",
        blindspot:
          "May undervalue own contributions, missing leadership opportunities",
        description:
          "Modest individuals are quiet contributors, deflecting praise, like team players sharing glory. They prioritize humility, teamwork, and collective achievement.",
      },
      negative: {
        name: "Narcissism",
        strength:
          "Drives ambition with bold self-confidence, inspiring others to follow",
        blindspot: "May alienate others by seeking excessive admiration",
        description:
          "Narcissistic individuals are self-focused stars, craving the spotlight, like performers commanding a stage. They prioritize personal recognition, confidence, and status.",
      },
    },
    questions: [
      { id: 1, text: "I share credit for successes with others", points: 1 },
      { id: 2, text: "I seek admiration for my accomplishments", points: -1 },
      {
        id: 3,
        text: "I downplay my achievements to focus on others",
        points: 1,
      },
      {
        id: 4,
        text: "I feel entitled to special recognition for my efforts",
        points: -1,
      },
      { id: 5, text: "I value group success over personal praise", points: 1 },
    ],
  },
];

export default personalityData;
