const personalityData = [
  {
    id: "introversion_extraversion",
    displayName: "Introversion-Extraversion",
    positive: "Extraversion",
    negative: "Introversion",
    title: "Social Dynamics",
    description: "This quiz assesses your tendency toward introversion or extraversion. Move the slider to indicate how each statement reflects your regular behavior.",
    traitDescriptions: {
      positive: "Extraverts draw energy from social interaction and external stimulation. They tend to think out loud, seek out group activities, and feel energized by being around others. They often process experiences by discussing them and prefer active engagement with the world around them.",
      negative: "Introverts gain energy from solitude and internal reflection. They prefer deep one-on-one conversations, need quiet time to recharge, and process experiences internally before sharing. They often have rich inner lives and value meaningful, intimate connections over broad social networks."
    },
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
    traitDescriptions: {
      positive: "Emotionally stable individuals maintain steady emotional states and recover quickly from setbacks. They tend to stay calm under pressure, adapt well to change, and maintain perspective in challenging situations. They generally experience less anxiety and are more resilient to stress.",
      negative: "Neurotic individuals experience emotions more intensely and are more sensitive to environmental changes. They tend to be more self-aware and perceptive of subtle emotional shifts, though this can lead to overthinking and anxiety. They often feel things deeply and may need more time to process emotional experiences."
    },
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
    traitDescriptions: {
      positive: "Those high in openness actively seek out new experiences and ideas. They tend to be curious, creative, and willing to challenge conventional wisdom. They often enjoy abstract thinking, appreciate art and beauty, and are drawn to exploring different perspectives and possibilities.",
      negative: "Those who prefer closedness value consistency and reliability in their experiences. They excel at maintaining stable routines, mastering established skills, and finding depth in familiar territory. They often have strong practical judgment and prefer concrete, proven solutions."
    },
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
    negative: "Impulsivity",
    title: "Planning and Action Style",
    description: "This quiz evaluates your tendency toward careful planning versus spontaneous action. Move the slider to indicate how each statement reflects your typical behavior.",
    traitDescriptions: {
      positive: "Conscientious individuals are organized, methodical, and detail-oriented. They excel at long-term planning, maintaining order, and following through on commitments. They often have strong self-discipline and prefer structured approaches to achieving goals.",
      negative: "Impulsive individuals are spontaneous, flexible, and quick to act on opportunities. They excel at thinking on their feet, adapting to the moment, and bringing fresh energy to situations. They often have a natural ability to seize the moment and think creatively under pressure."
    },
    questions: [
      {
        id: 1,
        text: "I create detailed plans before starting projects",
        points: 0.1
      },
      {
        id: 2,
        text: "I make decisions based on immediate feelings",
        points: -0.1
      },
      {
        id: 3,
        text: "I keep my workspace neat and organized",
        points: 0.1
      },
      {
        id: 4,
        text: "I prefer to go with the flow rather than stick to schedules",
        points: -0.1
      },
      {
        id: 5,
        text: "I complete tasks well ahead of deadlines",
        points: 0.1
      },
      {
        id: 6,
        text: "I often act without considering consequences",
        points: -0.1
      },
      {
        id: 7,
        text: "I maintain detailed records of my activities",
        points: 0.1
      },
      {
        id: 8,
        text: "I make purchases without much prior thought",
        points: -0.1
      },
      {
        id: 9,
        text: "I follow through on my commitments reliably",
        points: 0.1
      },
      {
        id: 10,
        text: "I change plans at the last minute when something more exciting comes up",
        points: -0.1
      }
    ]
  },
  {
    id: "agreeableness_antagonism",
    displayName: "Agreeableness-Antagonism",
    positive: "Agreeableness",
    negative: "Antagonism",
    title: "Social Dynamics",
    description: "This quiz assesses your tendency toward agreeableness versus antagonism. Move the slider to indicate how each statement reflects your regular behavior.",
    traitDescriptions: {
      positive: "Agreeable individuals are warm, cooperative, and empathetic. They tend to be good listeners, value harmony, and are generally easy to get along with. They often prioritize the needs of others and are willing to compromise to maintain positive relationships.",
      negative: "Antagonistic individuals are competitive, assertive, and sometimes confrontational. They tend to be more independent and value their own opinions, often prioritizing personal goals over group harmony. They may be more likely to challenge authority and express strong opinions."
    },
    questions: [
      {
        id: 1,
        text: "I find it easy to get along with others",
        points: 0.1
      },
      {
        id: 2,
        text: "I prioritize my own goals over group harmony",
        points: -0.1
      },
      {
        id: 3,
        text: "I often put others' needs before my own",
        points: 0.1
      },
      {
        id: 4,
        text: "I don't hesitate to challenge ideas I disagree with",
        points: -0.1
      },
      {
        id: 5,
        text: "I seek compromise when conflicts arise",
        points: 0.1
      },
      {
        id: 6,
        text: "I express my strong opinions even if they upset others",
        points: -0.1
      },
      {
        id: 7,
        text: "I genuinely care about other people's feelings",
        points: 0.1
      },
      {
        id: 8,
        text: "I compete with others rather than cooperate",
        points: -0.1
      },
      {
        id: 9,
        text: "I listen carefully to understand different perspectives",
        points: 0.1
      },
      {
        id: 10,
        text: "I find myself in arguments more often than most people",
        points: -0.1
      }
    ]
  },
  {
    id: "risk_safety",
    displayName: "Risk-Safety Orientation",
    positive: "Risk",
    negative: "Safety",
    title: "Risk-Safety Orientation",
    description: "This quiz assesses your tolerance for risk and uncertainty versus preference for safety and security. Move the slider to indicate how each statement reflects your regular behavior.",
    traitDescriptions: {
      positive: "Risk-oriented individuals are comfortable with uncertainty and willing to accept potential negative outcomes in pursuit of opportunities. They tend to embrace challenges where success isn't guaranteed, are willing to try new things that might not work out, and see potential setbacks as acceptable costs of exploration and growth.",
      negative: "Safety-oriented individuals prioritize security and prefer to minimize potential harm or loss. They tend to choose proven paths, value predictability and stability, and prefer to thoroughly assess potential downsides before proceeding. They often excel at protecting resources and maintaining steady progress."
    },
    questions: [
      {
        id: 1,
        text: "I'm willing to try activities even if there's a chance I might get hurt",
        points: 0.1
      },
      {
        id: 2,
        text: "I prefer to stick with proven approaches rather than risk failure",
        points: -0.1
      },
      {
        id: 3,
        text: "I invest money in opportunities that could lead to big gains or losses",
        points: 0.1
      },
      {
        id: 4,
        text: "I keep my money in safe, guaranteed returns",
        points: -0.1
      },
      {
        id: 5,
        text: "I speak up in situations where I might face social rejection",
        points: 0.1
      },
      {
        id: 6,
        text: "I avoid situations where I might embarrass myself",
        points: -0.1
      },
      {
        id: 7,
        text: "I take career opportunities even when the outcome is uncertain",
        points: 0.1
      },
      {
        id: 8,
        text: "I prefer job security over potentially rewarding but risky career moves",
        points: -0.1
      },
      {
        id: 9,
        text: "I enjoy the thrill of not knowing how things will turn out",
        points: 0.1
      },
      {
        id: 10,
        text: "I feel anxious when I can't predict what will happen next",
        points: -0.1
      }
    ]
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