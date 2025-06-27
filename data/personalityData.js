const personalityData = [
  {
    id: "introversion_extraversion",
    displayName: "Introversion-Extraversion",
    positive: "Extraversion",
    negative: "Introversion",
    title: "Social Dynamics",
    description: "This quiz assesses your tendency toward introversion or extraversion. Move the slider to indicate how each statement reflects your regular behavior.",
    questions: [
      {
        id: 1,
        text: "I find it energizing to dive into large group activities",
        points: 0.1
      },
      {
        id: 2,
        text: "I feel comfortable reflecting on ideas in solitude",
        points: -0.1
      },
      {
        id: 3,
        text: "I often initiate conversations with unfamiliar people",
        points: 0.1
      },
      {
        id: 4,
        text: "I prefer low-key gatherings over bustling events",
        points: -0.1
      },
      {
        id: 5,
        text: "I enjoy sharing thoughts in group discussions",
        points: 0.1
      },
      {
        id: 6,
        text: "I retreat to quiet spaces to recharge",
        points: -0.1
      },
      {
        id: 7,
        text: "I seek out opportunities to meet new people",
        points: 0.1
      },
      {
        id: 8,
        text: "I find long stretches of solo time fulfilling",
        points: -0.1
      },
      {
        id: 9,
        text: "I feel at ease when speaking up in a crowd",
        points: 0.1
      },
      {
        id: 10,
        text: "I value moments of silence over lively chatter",
        points: -0.1
      }
    ]
  },
  {
    id: "neuroticism_emotional_stability",
    displayName: "Neuroticism-Emotional Stability",
    positive: "Emotional Stability",
    negative: "Neuroticism",
    title: "Emotional Landscape",
    description: "This quiz explores your level of emotional stability versus neurotic tendencies. Move the slider to indicate how each statement reflects your experience.",
    questions: [
      {
        id: 1,
        text: "I replay conversations in my mind after they happen",
        points: -0.1
      },
      {
        id: 2,
        text: "I adapt easily when plans shift",
        points: 0.1
      },
      {
        id: 3,
        text: "I sometimes struggle to switch off my thoughts at night",
        points: -0.1
      },
      {
        id: 4,
        text: "I can carry on as usual when things don't go my way",
        points: 0.1
      },
      {
        id: 5,
        text: "I notice tension building in my body under pressure",
        points: -0.1
      },
      {
        id: 6,
        text: "I feel grounded even in chaotic situations",
        points: 0.1
      },
      {
        id: 7,
        text: "I find small setbacks weigh on me longer than expected",
        points: -0.1
      },
      {
        id: 8,
        text: "I quickly let go of frustrations",
        points: 0.1
      },
      {
        id: 9,
        text: "I feel uneasy without a clear plan",
        points: -0.1
      },
      {
        id: 10,
        text: "I remain steady when facing uncertainty",
        points: 0.1
      }
    ]
  },
  {
    id: "openness_closedness",
    displayName: "Openness-Closedness to Experience",
    positive: "Openness",
    negative: "Closedness",
    title: "Experience Spectrum",
    description: "This quiz assesses your openness to new ideas versus preference for familiar approaches. Move the slider to indicate how each statement reflects your typical behavior.",
    questions: [
      {
        id: 1,
        text: "I explore unfamiliar topics just for the sake of learning",
        points: -0.1
      },
      {
        id: 2,
        text: "I prefer routines that have worked for me before",
        points: 0.1
      },
      {
        id: 3,
        text: "I notice different perspectives in everyday situations",
        points: -0.1
      },
      {
        id: 4,
        text: "I stick to tried-and-true solutions when problems arise",
        points: 0.1
      },
      {
        id: 5,
        text: "I feel energized by unexpected detours",
        points: -0.1
      },
      {
        id: 6,
        text: "I find comfort in predictable outcomes",
        points: 0.1
      },
      {
        id: 7,
        text: "I question assumptions I encounter",
        points: -0.1
      },
      {
        id: 8,
        text: "I avoid stepping outside my usual methods",
        points: 0.1
      },
      {
        id: 9,
        text: "I seek out diverse experiences when I can",
        points: -0.1
      },
      {
        id: 10,
        text: "I prefer familiarity over novelty",
        points: 0.1
      }
    ]
  },
  {
    id: "conscientiousness_impulsivity",
    displayName: "Conscientiousness-Impulsivity",
    positive: "Conscientiousness",
    negative: "Impulsivity"
  },
  {
    id: "agreeableness_antagonism",
    displayName: "Agreeableness-Antagonism",
    positive: "Agreeableness",
    negative: "Antagonism"
  },
  {
    id: "risk_safety",
    displayName: "Risk-Safety Orientation",
    positive: "Risk",
    negative: "Safety"
  },
  {
    id: "novelty_routine",
    displayName: "Novelty Seeking-Routine Preference",
    positive: "Novelty Seeking",
    negative: "Routine Preference"
  },
  {
    id: "analytical_intuitive",
    displayName: "Analytical-Intuitive Cognition",
    positive: "Analytical",
    negative: "Intuitive"
  },
  {
    id: "detail_big_picture",
    displayName: "Detail Focus-Big-Picture Focus",
    positive: "Detail Focus",
    negative: "Big-Picture Focus"
  },
  {
    id: "temporal_orientation",
    displayName: "Temporal Orientation",
    positive: "Future Focus",
    negative: "Past Focus"
  },
  {
    id: "sensation_seeking",
    displayName: "Sensation Seeking-Sensation Avoidance",
    positive: "Sensation Seeking",
    negative: "Sensation Avoidance"
  },
  {
    id: "authority_orientation",
    displayName: "Authority Acceptance-Authority Rejection",
    positive: "Authority Acceptance",
    negative: "Authority Rejection"
  },
  {
    id: "competitive_cooperative",
    displayName: "Competitive-Cooperative Drive",
    positive: "Competitive",
    negative: "Cooperative"
  },
  {
    id: "social_boldness",
    displayName: "Social Boldness-Social Reserve",
    positive: "Social Boldness",
    negative: "Social Reserve"
  },
  {
    id: "empathy_detachment",
    displayName: "Empathy-Emotional Detachment",
    positive: "Empathy",
    negative: "Emotional Detachment"
  },
  {
    id: "assertiveness_passivity",
    displayName: "Assertiveness-Passivity",
    positive: "Assertiveness",
    negative: "Passivity"
  },
  {
    id: "work_leisure",
    displayName: "Workaholism-Leisure-Orientation",
    positive: "Workaholism",
    negative: "Leisure-Orientation"
  },
  {
    id: "moral_care",
    displayName: "Moral Foundations: Care-Harm Sensitivity",
    positive: "Care",
    negative: "Harm"
  },
  {
    id: "moral_fairness",
    displayName: "Moral Foundations: Fairness-Cheating Sensitivity",
    positive: "Fairness",
    negative: "Cheating"
  },
  {
    id: "moral_loyalty",
    displayName: "Moral Foundations: Loyalty-Betrayal Sensitivity",
    positive: "Loyalty",
    negative: "Betrayal"
  },
  {
    id: "moral_authority",
    displayName: "Moral Foundations: Authority-Subversion Sensitivity",
    positive: "Authority",
    negative: "Subversion"
  },
  {
    id: "moral_purity",
    displayName: "Moral Foundations: Purity-Degradation Sensitivity",
    positive: "Purity",
    negative: "Degradation"
  },
  {
    id: "learning_visual_verbal",
    displayName: "Learning Style: Visual-Verbal Preference",
    positive: "Visual",
    negative: "Verbal"
  },
  {
    id: "learning_sequential_global",
    displayName: "Learning Style: Sequential-Global Processing",
    positive: "Sequential",
    negative: "Global"
  },
  {
    id: "time_urgency",
    displayName: "Time Urgency-Time Relaxation",
    positive: "Time Urgency",
    negative: "Time Relaxation"
  },
  {
    id: "planning_hedonism",
    displayName: "Future Planning-Present Hedonism",
    positive: "Future Planning",
    negative: "Present Hedonism"
  },
  {
    id: "self_efficacy",
    displayName: "Self-Efficacy-Self-Doubt",
    positive: "Self-Efficacy",
    negative: "Self-Doubt"
  },
  {
    id: "control_spontaneity",
    displayName: "Control Need-Spontaneity Need",
    positive: "Control Need",
    negative: "Spontaneity Need"
  },
  {
    id: "conformity_nonconformity",
    displayName: "Conformity-Nonconformity",
    positive: "Conformity",
    negative: "Nonconformity"
  },
  {
    id: "detail_conceptual",
    displayName: "Detail Orientation-Conceptual Orientation",
    positive: "Detail Orientation",
    negative: "Conceptual Orientation"
  },
  {
    id: "persistence_disengagement",
    displayName: "Persistence-Disengagement",
    positive: "Persistence",
    negative: "Disengagement"
  },
  {
    id: "gratitude_entitlement",
    displayName: "Gratitude-Entitlement",
    positive: "Gratitude",
    negative: "Entitlement"
  },
  {
    id: "spiritual_material",
    displayName: "Spiritual-Material Orientation",
    positive: "Spiritual",
    negative: "Material"
  },
  {
    id: "environmentalism_anthropocentrism",
    displayName: "Environmentalism-Anthropocentrism",
    positive: "Environmentalism",
    negative: "Anthropocentrism"
  },
  {
    id: "altruism_self_interest",
    displayName: "Altruism-Self-Interest",
    positive: "Altruism",
    negative: "Self-Interest"
  },
  {
    id: "innovation_tradition",
    displayName: "Innovation-Tradition Preference",
    positive: "Innovation",
    negative: "Tradition"
  },
  {
    id: "sensory_sensitivity",
    displayName: "Sensory Sensitivity-Sensory Under-Responsiveness",
    positive: "Sensory Sensitivity",
    negative: "Sensory Under-Responsiveness"
  },
  {
    id: "interdependence_independence",
    displayName: "Interdependence-Independence",
    positive: "Interdependence",
    negative: "Independence"
  },
  {
    id: "information_seeking",
    displayName: "Information Seeking-Information Avoidance",
    positive: "Information Seeking",
    negative: "Information Avoidance"
  },
  {
    id: "structure_ambiguity",
    displayName: "Structure Seeking-Ambiguity Tolerance",
    positive: "Structure Seeking",
    negative: "Ambiguity Tolerance"
  }
];

export default personalityData; 