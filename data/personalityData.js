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
    negative: "Routine Preference",
    title: "Experience Variety",
    description: "This quiz assesses your preference for variety and new experiences versus established routines and familiar patterns. Move the slider to indicate how each statement reflects your typical behavior.",
    traitDescriptions: {
      positive: "Novelty seekers crave variety and new experiences in their daily lives. They enjoy breaking up routines, trying different approaches, and exploring unfamiliar environments. They tend to get restless with repetition and are energized by change, whether in activities, places, people, or experiences.",
      negative: "Routine preferrers find comfort and efficiency in established patterns and familiar experiences. They excel at optimizing their habits, creating reliable systems, and finding depth through repetition. They often perform better when they can predict what's coming and have mastered their environment."
    },
    questions: [
      {
        id: 1,
        text: "I like to vary my daily routine regularly",
        points: 0.1
      },
      {
        id: 2,
        text: "I follow the same patterns each day because they work for me",
        points: -0.1
      },
      {
        id: 3,
        text: "I seek out new restaurants rather than returning to favorites",
        points: 0.1
      },
      {
        id: 4,
        text: "I prefer to order the same dishes at places I know I like",
        points: -0.1
      },
      {
        id: 5,
        text: "I enjoy taking different routes to familiar destinations",
        points: 0.1
      },
      {
        id: 6,
        text: "I stick to the most efficient path I've already figured out",
        points: -0.1
      },
      {
        id: 7,
        text: "I get bored doing the same activities repeatedly",
        points: 0.1
      },
      {
        id: 8,
        text: "I find comfort in doing things the same way each time",
        points: -0.1
      },
      {
        id: 9,
        text: "I like to rearrange my living space periodically",
        points: 0.1
      },
      {
        id: 10,
        text: "I keep my belongings in the same places so I always know where they are",
        points: -0.1
      }
    ]
  },
  {
    id: "analytical_intuitive",
    displayName: "Analytical-Intuitive Cognition",
    positive: "Analytical",
    negative: "Intuitive",
    title: "Thinking Style",
    description: "This quiz assesses your cognitive processing style when approaching problems and making decisions. Move the slider to indicate how each statement reflects your typical thinking patterns.",
    traitDescriptions: {
      positive: "Analytical thinkers prefer step-by-step reasoning and systematic approaches to problems. They excel at breaking down complex issues into manageable parts, following logical sequences, and making decisions based on careful evaluation of evidence. They tend to want to understand the 'why' behind things and value methodical processes.",
      negative: "Intuitive thinkers rely on gut feelings, pattern recognition, and holistic understanding. They excel at seeing connections that aren't immediately obvious, making quick insights, and grasping the essence of situations without detailed analysis. They often 'just know' things and trust their instincts when making decisions."
    },
    questions: [
      {
        id: 1,
        text: "I break down complex problems into smaller, manageable steps",
        points: 0.1
      },
      {
        id: 2,
        text: "I often know the right answer without being able to explain how",
        points: -0.1
      },
      {
        id: 3,
        text: "I want to see all the data before making important decisions",
        points: 0.1
      },
      {
        id: 4,
        text: "I trust my first impression about people and situations",
        points: -0.1
      },
      {
        id: 5,
        text: "I like to understand the logical reasoning behind recommendations",
        points: 0.1
      },
      {
        id: 6,
        text: "I can sense when something feels 'right' or 'wrong' without analysis",
        points: -0.1
      },
      {
        id: 7,
        text: "I work through problems systematically from start to finish",
        points: 0.1
      },
      {
        id: 8,
        text: "I see patterns and connections that others often miss",
        points: -0.1
      },
      {
        id: 9,
        text: "I prefer to have concrete evidence before drawing conclusions",
        points: 0.1
      },
      {
        id: 10,
        text: "I make decisions based on gut feelings that usually turn out right",
        points: -0.1
      }
    ]
  },
  {
    id: "detail_big_picture",
    displayName: "Detail Focus-Big-Picture Focus",
    positive: "Detail Focus",
    negative: "Big-Picture Focus",
    title: "Attention to Detail",
    description: "This quiz assesses whether you naturally focus on specific details versus broad patterns and overall themes. Move the slider to indicate how each statement reflects your typical approach.",
    traitDescriptions: {
      positive: "Detail-focused individuals naturally notice specifics, precision, and particulars. They excel at careful analysis, thorough examination, and ensuring accuracy in their work. They tend to be methodical, catch errors others miss, and prefer to understand all the components before seeing the whole picture.",
      negative: "Big-picture focused individuals naturally see overall patterns, themes, and general concepts. They excel at understanding systems, recognizing broader implications, and grasping the essence of complex situations. They tend to think strategically, see how parts connect to the whole, and prefer to understand the forest before examining individual trees."
    },
    questions: [
      {
        id: 1,
        text: "I notice small errors that others tend to miss",
        points: 0.1
      },
      {
        id: 2,
        text: "I focus on the overall theme rather than specific details",
        points: -0.1
      },
      {
        id: 3,
        text: "I prefer to examine each component thoroughly before moving on",
        points: 0.1
      },
      {
        id: 4,
        text: "I grasp the general concept quickly without needing all the specifics",
        points: -0.1
      },
      {
        id: 5,
        text: "I double-check my work for accuracy and precision",
        points: 0.1
      },
      {
        id: 6,
        text: "I see how different ideas connect to form larger patterns",
        points: -0.1
      },
      {
        id: 7,
        text: "I focus on getting the facts exactly right",
        points: 0.1
      },
      {
        id: 8,
        text: "I think about implications and broader consequences",
        points: -0.1
      },
      {
        id: 9,
        text: "I pay attention to specific wording and precise language",
        points: 0.1
      },
      {
        id: 10,
        text: "I understand complex situations by looking at the big picture first",
        points: -0.1
      }
    ]
  },
  {
    id: "temporal_orientation",
    displayName: "Temporal Orientation",
    positive: "Future Focus",
    negative: "Past Focus",
    title: "Time Perspective",
    description: "This quiz assesses whether you naturally orient toward the future or draw more from past experiences. Move the slider to indicate how each statement reflects your typical perspective.",
    traitDescriptions: {
      positive: "Future-focused individuals are oriented toward what's coming next and what could be. They tend to be goal-oriented, plan ahead, and are motivated by potential outcomes and possibilities. They often think about improvements, innovations, and how things could be different or better in the time ahead.",
      negative: "Past-focused individuals draw wisdom and guidance from previous experiences and established knowledge. They tend to value traditions, learn from history, and use past patterns to inform current decisions. They often appreciate proven methods, honor legacy, and find meaning in continuity and lessons learned."
    },
    questions: [
      {
        id: 1,
        text: "I spend more time thinking about upcoming goals than reflecting on past achievements",
        points: 0.1
      },
      {
        id: 2,
        text: "I often draw on past experiences to guide my current decisions",
        points: -0.1
      },
      {
        id: 3,
        text: "I'm more excited about future possibilities than nostalgic about the past",
        points: 0.1
      },
      {
        id: 4,
        text: "I find wisdom in traditional ways of doing things",
        points: -0.1
      },
      {
        id: 5,
        text: "I focus on what I want to accomplish rather than what I've already done",
        points: 0.1
      },
      {
        id: 6,
        text: "I often think about 'the good old days' and how things used to be",
        points: -0.1
      },
      {
        id: 7,
        text: "I prefer to plan for tomorrow rather than reminisce about yesterday",
        points: 0.1
      },
      {
        id: 8,
        text: "I believe we can learn important lessons from history",
        points: -0.1
      },
      {
        id: 9,
        text: "I'm motivated by visions of what could be rather than memories of what was",
        points: 0.1
      },
      {
        id: 10,
        text: "I value preserving traditions and maintaining connections to the past",
        points: -0.1
      }
    ]
  },
  {
    id: "sensation_seeking",
    displayName: "Sensation Seeking-Sensation Avoidance",
    positive: "Sensation Seeking",
    negative: "Sensation Avoidance",
    title: "Stimulation Preferences",
    description: "This quiz assesses your preference for intense, varied, and stimulating experiences versus calm, predictable environments. Move the slider to indicate how each statement reflects your typical preferences.",
    traitDescriptions: {
      positive: "Sensation seekers crave intense, varied, and novel experiences. They enjoy high stimulation environments, seek out thrilling activities, and are drawn to situations that provide strong sensory input. They often enjoy loud music, bright lights, exciting adventures, and activities that provide adrenaline rushes or intense emotional experiences.",
      negative: "Sensation avoiders prefer calm, peaceful, and low-stimulation environments. They tend to be sensitive to overwhelming sensory input and find comfort in quiet, predictable settings. They often prefer gentle activities, soft sounds, muted lighting, and environments that allow for relaxation and tranquility."
    },
    questions: [
      {
        id: 1,
        text: "I enjoy loud, energetic music and lively atmospheres",
        points: 0.1
      },
      {
        id: 2,
        text: "I prefer quiet, peaceful environments where I can think clearly",
        points: -0.1
      },
      {
        id: 3,
        text: "I seek out thrilling activities like roller coasters or extreme sports",
        points: 0.1
      },
      {
        id: 4,
        text: "I avoid activities that might be too intense or overwhelming",
        points: -0.1
      },
      {
        id: 5,
        text: "I'm drawn to bright lights, vivid colors, and bold visual experiences",
        points: 0.1
      },
      {
        id: 6,
        text: "I find comfort in soft lighting and muted, calming colors",
        points: -0.1
      },
      {
        id: 7,
        text: "I enjoy the rush of adrenaline from exciting experiences",
        points: 0.1
      },
      {
        id: 8,
        text: "I get overstimulated easily in busy, chaotic environments",
        points: -0.1
      },
      {
        id: 9,
        text: "I like parties and events with lots of energy and activity",
        points: 0.1
      },
      {
        id: 10,
        text: "I prefer gentle, low-key activities that don't overwhelm my senses",
        points: -0.1
      }
    ]
  },
  {
    id: "authority_orientation",
    displayName: "Authority Acceptance-Authority Rejection",
    positive: "Authority Acceptance",
    negative: "Authority Rejection",
    title: "Authority Orientation",
    description: "This quiz assesses your relationship with authority figures and hierarchical structures. Move the slider to indicate how each statement reflects your typical attitudes and behaviors.",
    traitDescriptions: {
      positive: "Authority accepters tend to respect hierarchical structures and value the guidance of established leaders. They generally follow rules and procedures, appreciate clear chains of command, and believe that authority figures often have valuable expertise and perspective. They work well within structured systems and value order and stability.",
      negative: "Authority rejecters tend to question hierarchical structures and prefer more egalitarian approaches. They value independent thinking, often challenge established rules when they seem unfair, and believe that good ideas can come from anyone regardless of position. They prefer collaborative decision-making and may resist top-down directives."
    },
    questions: [
      {
        id: 1,
        text: "I generally follow rules and procedures without questioning them",
        points: 0.1
      },
      {
        id: 2,
        text: "I often challenge decisions made by people in authority positions",
        points: -0.1
      },
      {
        id: 3,
        text: "I respect the experience and expertise that comes with leadership positions",
        points: 0.1
      },
      {
        id: 4,
        text: "I believe good ideas can come from anyone, regardless of their rank",
        points: -0.1
      },
      {
        id: 5,
        text: "I feel comfortable working within established hierarchies",
        points: 0.1
      },
      {
        id: 6,
        text: "I prefer collaborative decision-making over top-down directives",
        points: -0.1
      },
      {
        id: 7,
        text: "I believe that clear chains of command make organizations work better",
        points: 0.1
      },
      {
        id: 8,
        text: "I question authority when I think they're making poor decisions",
        points: -0.1
      },
      {
        id: 9,
        text: "I defer to supervisors and leaders when they give direction",
        points: 0.1
      },
      {
        id: 10,
        text: "I think everyone should have an equal say in important decisions",
        points: -0.1
      }
    ]
  },
  {
    id: "competitive_cooperative",
    displayName: "Competitive-Cooperative Drive",
    positive: "Competitive",
    negative: "Cooperative",
    title: "Achievement Style",
    description: "This quiz assesses your natural tendency toward competitive achievement versus cooperative collaboration. Move the slider to indicate how each statement reflects your typical approach to goals and success.",
    traitDescriptions: {
      positive: "Competitive individuals are driven by personal achievement and outperforming others. They excel in environments where they can measure their success against others, set ambitious personal goals, and push themselves to be the best. They often thrive on challenges and are motivated by recognition and winning.",
      negative: "Cooperative individuals are driven by collective success and working together toward shared goals. They excel in collaborative environments where they can contribute to team achievements, build consensus, and help others succeed. They often prioritize group harmony and are motivated by mutual support and shared accomplishments."
    },
    questions: [
      {
        id: 1,
        text: "I'm motivated by the chance to outperform others",
        points: 0.1
      },
      {
        id: 2,
        text: "I prefer working together toward shared goals",
        points: -0.1
      },
      {
        id: 3,
        text: "I set personal records and try to beat them",
        points: 0.1
      },
      {
        id: 4,
        text: "I find satisfaction in helping others succeed",
        points: -0.1
      },
      {
        id: 5,
        text: "I enjoy competitions and contests",
        points: 0.1
      },
      {
        id: 6,
        text: "I prioritize team success over individual recognition",
        points: -0.1
      },
      {
        id: 7,
        text: "I compare my performance to others' achievements",
        points: 0.1
      },
      {
        id: 8,
        text: "I share credit and resources with others willingly",
        points: -0.1
      },
      {
        id: 9,
        text: "I'm driven by the desire to be the best",
        points: 0.1
      },
      {
        id: 10,
        text: "I believe we accomplish more when we work together",
        points: -0.1
      }
    ]
  },
  {
    id: "social_boldness",
    displayName: "Social Boldness-Social Reserve",
    positive: "Social Boldness",
    negative: "Social Reserve",
    title: "Social Confidence",
    description: "This quiz assesses your comfort level with social visibility and taking social risks. Move the slider to indicate how each statement reflects your typical social behavior and comfort level.",
    traitDescriptions: {
      positive: "Socially bold individuals are comfortable being the center of attention and taking social risks. They tend to speak up confidently in groups, volunteer for public roles, and aren't afraid to express controversial opinions. They often enjoy leadership positions and are comfortable with social visibility.",
      negative: "Socially reserved individuals prefer to avoid the spotlight and are more cautious in social situations. They tend to observe before participating, prefer behind-the-scenes roles, and are careful about what they share publicly. They often excel at listening and providing thoughtful, considered input."
    },
    questions: [
      {
        id: 1,
        text: "I'm comfortable being the center of attention",
        points: 0.1
      },
      {
        id: 2,
        text: "I prefer to observe social situations before participating",
        points: -0.1
      },
      {
        id: 3,
        text: "I volunteer to speak in front of groups",
        points: 0.1
      },
      {
        id: 4,
        text: "I think carefully before sharing my opinions publicly",
        points: -0.1
      },
      {
        id: 5,
        text: "I enjoy taking on leadership roles in social settings",
        points: 0.1
      },
      {
        id: 6,
        text: "I prefer to work behind the scenes rather than be in the spotlight",
        points: -0.1
      },
      {
        id: 7,
        text: "I'm not afraid to express controversial opinions",
        points: 0.1
      },
      {
        id: 8,
        text: "I'm cautious about how others might perceive my actions",
        points: -0.1
      },
      {
        id: 9,
        text: "I feel energized by social visibility and recognition",
        points: 0.1
      },
      {
        id: 10,
        text: "I prefer to let others take the lead in social situations",
        points: -0.1
      }
    ]
  },
  {
    id: "empathy_detachment",
    displayName: "Empathy-Emotional Detachment",
    positive: "Empathy",
    negative: "Emotional Detachment",
    title: "Emotional Connection",
    description: "This quiz assesses your tendency to connect with and respond to others' emotions versus maintaining emotional distance. Move the slider to indicate how each statement reflects your typical emotional responses to others.",
    traitDescriptions: {
      positive: "Empathetic individuals naturally connect with and respond to others' emotions. They tend to feel what others are feeling, are moved by others' experiences, and often prioritize emotional understanding in their relationships. They excel at providing emotional support and understanding different perspectives.",
      negative: "Emotionally detached individuals maintain emotional distance and are less affected by others' emotional states. They tend to approach situations objectively, make decisions based on logic rather than feelings, and are less likely to be overwhelmed by others' emotions. They often excel at remaining calm in emotionally charged situations."
    },
    questions: [
      {
        id: 1,
        text: "I can easily sense when someone is upset, even if they don't say anything",
        points: 0.1
      },
      {
        id: 2,
        text: "I make decisions based on facts rather than feelings",
        points: -0.1
      },
      {
        id: 3,
        text: "I feel affected by other people's emotional states",
        points: 0.1
      },
      {
        id: 4,
        text: "I can remain objective even in emotionally charged situations",
        points: -0.1
      },
      {
        id: 5,
        text: "I often feel what others are feeling",
        points: 0.1
      },
      {
        id: 6,
        text: "I prefer to analyze situations logically rather than emotionally",
        points: -0.1
      },
      {
        id: 7,
        text: "I'm moved by stories of other people's experiences",
        points: 0.1
      },
      {
        id: 8,
        text: "I can separate my emotions from the emotions of others",
        points: -0.1
      },
      {
        id: 9,
        text: "I prioritize understanding how others feel in conflicts",
        points: 0.1
      },
      {
        id: 10,
        text: "I prefer to focus on solutions rather than emotional support",
        points: -0.1
      }
    ]
  },
  {
    id: "assertiveness_passivity",
    displayName: "Assertiveness-Passivity",
    positive: "Assertiveness",
    negative: "Passivity",
    title: "Communication Style",
    description: "This quiz assesses your tendency to express your needs and opinions directly versus avoiding conflict and deferring to others. Move the slider to indicate how each statement reflects your typical communication approach.",
    traitDescriptions: {
      positive: "Assertive individuals confidently express their needs, opinions, and boundaries. They tend to speak up for themselves, ask for what they want, and address conflicts directly. They often take initiative in situations and are comfortable advocating for their interests while respecting others.",
      negative: "Passive individuals tend to avoid conflict and defer to others' preferences. They often put others' needs before their own, hesitate to express their true feelings, and may go along with things they don't want to avoid confrontation. They often excel at maintaining harmony and being accommodating."
    },
    questions: [
      {
        id: 1,
        text: "I confidently express my needs and wants",
        points: 0.1
      },
      {
        id: 2,
        text: "I often go along with others' preferences to avoid conflict",
        points: -0.1
      },
      {
        id: 3,
        text: "I speak up when I disagree with something",
        points: 0.1
      },
      {
        id: 4,
        text: "I hesitate to ask for what I want",
        points: -0.1
      },
      {
        id: 5,
        text: "I address conflicts directly rather than avoiding them",
        points: 0.1
      },
      {
        id: 6,
        text: "I put others' needs before my own",
        points: -0.1
      },
      {
        id: 7,
        text: "I take initiative in group situations",
        points: 0.1
      },
      {
        id: 8,
        text: "I prefer to let others make decisions",
        points: -0.1
      },
      {
        id: 9,
        text: "I advocate for my interests when necessary",
        points: 0.1
      },
      {
        id: 10,
        text: "I avoid expressing opinions that might upset others",
        points: -0.1
      }
    ]
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