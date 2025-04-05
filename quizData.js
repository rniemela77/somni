/*
  Quiz question instructions:
  - The questions must not lead the user to think that there is a right or wrong answer
  - The questions must be everyday occurences that are easy to understand
  - The answers should be short and concise
  - The answers should not be too abstract
  - The questions and answers should be culturally neutral
  - The questions and answers should be appropriate for a general audience
  - The questions and answers should be designed to learn about the user's personality
  - The questions and answers should be designed to learn about the user's personality
    by bypassing the conscious mind and going straight to the subconscious.
  - The quiz identifies how the user reacts to everyday occurences.
  - The quiz should not require the user to think too much about the question.
  - The quiz should be designed to be answered quickly and easily.
  - The quiz should be designed to be answered in a single sentence or phrase.
*/

const quizzes = [
  {
    id: "daily-choices",
    title: "Everyday Choices",
    questions: [
      {
        id: 1,
        text: "You find a wallet on the sidewalk. What do you do first?",
        options: ["Look for ID to return it", "Turn it in to authorities", "Check if anyone is nearby", "Leave it where it is"],
      },
      {
        id: 2,
        text: "When entering a crowded elevator, where do you stand?",
        options: ["Near the buttons", "In the back corner", "Wherever there's space", "By the door"],
      },
      {
        id: 3,
        text: "How do you react when someone is running late to meet you?",
        options: ["Check my phone", "Think about other things", "Get slightly annoyed", "Plan what to do next"],
      },
      {
        id: 4,
        text: "What do you notice first when entering someone's home?",
        options: ["The overall tidiness", "How it smells", "The decorations", "How comfortable it feels"],
      },
      {
        id: 5,
        text: "Your phone battery is at 15%. What do you do?",
        options: ["Immediately look for a charger", "Use it normally until it dies", "Turn on power saving mode", "Limit usage to essentials"],
      },
      {
        id: 6,
        text: "When trying a new restaurant, what influences your order?",
        options: ["Staff recommendations", "What others at your table order", "Something familiar", "Something you've never tried"],
      },
      {
        id: 7,
        text: "It starts raining unexpectedly. You:",
        options: ["Seek shelter immediately", "Continue what you're doing", "Enjoy the rain briefly", "Find another route"],
      },
      {
        id: 8,
        text: "How do you typically spend time in a waiting room?",
        options: ["On your phone", "Observing others", "Reading available materials", "Lost in thought"],
      },
      {
        id: 9,
        text: "When cooking a meal, you prefer to:",
        options: ["Follow a recipe exactly", "Improvise with available ingredients", "Multitask several dishes", "Keep it simple and quick"],
      },
      {
        id: 10,
        text: "A stranger compliments you unexpectedly. You feel:",
        options: ["Slightly awkward but pleased", "Genuinely appreciative", "Suspicious of their intentions", "Like returning the compliment"],
      },
    ],
  },
  {
    id: "response-patterns",
    title: "How You Respond",
    questions: [
      {
        id: 1,
        text: "When you hear an unusual noise at night, your first instinct is to:",
        options: ["Investigate immediately", "Listen more carefully", "Ignore it", "Feel concerned but stay put"],
      },
      {
        id: 2,
        text: "Your friend suggests a spontaneous weekend trip. You think about:",
        options: ["What you'll need to pack", "Who else is going", "What plans you might need to change", "Where you'll be going"],
      },
      {
        id: 3,
        text: "When assembling furniture without clear instructions, you:",
        options: ["Try different approaches until something works", "Look for online tutorials", "Follow your intuition", "Get frustrated quickly"],
      },
      {
        id: 4,
        text: "You're in a conversation that shifts to a topic you know well. You typically:",
        options: ["Share your knowledge enthusiastically", "Listen to others' views first", "Mention relevant experiences briefly", "Stay quiet unless directly asked"],
      },
      {
        id: 5,
        text: "When you have free time unexpectedly, you prefer to:",
        options: ["Catch up on tasks", "Contact someone to meet up", "Enjoy the solitude", "Find entertainment"],
      },
      {
        id: 6,
        text: "Someone cuts in line in front of you. Your reaction is to:",
        options: ["Say something directly", "Give them a disapproving look", "Let it go", "Mention it to someone else later"],
      },
      {
        id: 7,
        text: "After a busy day, you usually want to:",
        options: ["Talk about your day with someone", "Spend time alone to decompress", "Distract yourself with entertainment", "Plan for tomorrow"],
      },
      {
        id: 8,
        text: "When using the last of something in a shared space, you typically:",
        options: ["Replace it immediately", "Make a note to replace it later", "Mention it to others", "Assume someone else will notice"],
      },
      {
        id: 9,
        text: "During group activities, you often find yourself:",
        options: ["Taking the lead", "Supporting others' ideas", "Observing dynamics", "Focusing on your contribution"],
      },
      {
        id: 10,
        text: "When remembering events, you most easily recall:",
        options: ["How you felt", "What was said", "Visual details", "The sequence of events"],
      },
    ],
  },
  {
    id: "personal-preferences",
    title: "Personal Preferences",
    questions: [
      {
        id: 1,
        text: "When choosing a seat in a coffee shop, you prefer:",
        options: ["By the window", "In a quiet corner", "Near other people", "Close to an outlet"],
      },
      {
        id: 2,
        text: "You're planning your day off. You're most drawn to:",
        options: ["Something active outdoors", "Relaxing at home", "Meeting with friends", "Working on a personal project"],
      },
      {
        id: 3,
        text: "When you browse through photos, you're most drawn to images of:",
        options: ["Natural landscapes", "Urban environments", "People and faces", "Abstract patterns"],
      },
      {
        id: 4,
        text: "Your ideal workspace is:",
        options: ["Clean and minimalist", "Comfortable with personal touches", "Bustling with activity", "Variable depending on the task"],
      },
      {
        id: 5,
        text: "When selecting a movie to watch, you often choose based on:",
        options: ["The storyline", "Who's in the cast", "Recommendations from others", "Visual style or genre"],
      },
      {
        id: 6,
        text: "If you could improve one thing about your living space, it would be:",
        options: ["More natural light", "Better organization", "More comfortable furniture", "Different color scheme"],
      },
      {
        id: 7,
        text: "When giving a gift, you tend to choose something:",
        options: ["Practical they'll use daily", "Unique and unexpected", "Related to their interests", "With emotional significance"],
      },
      {
        id: 8,
        text: "You have a free afternoon. You're most likely to:",
        options: ["Read a book or watch a show", "Go for a walk or exercise", "Connect with friends", "Work on a hobby"],
      },
      {
        id: 9,
        text: "When choosing what to wear, you prioritize:",
        options: ["Comfort above all", "How it looks on you", "Appropriateness for the occasion", "Your personal style"],
      },
      {
        id: 10,
        text: "During a group meal, you prefer to sit:",
        options: ["Where you can see everyone", "Next to someone you know well", "Where conversation flows easily", "At the end of the table"],
      },
    ],
  },
  {
    id: "hidden-patterns",
    title: "Subtle Instincts",
    questions: [
      {
        id: 1,
        text: "You glance at a clock. Which do you notice first?",
        options: ["The exact time", "Whether you're early or late", "The clock's appearance", "The sound it makes"],
      },
      {
        id: 2,
        text: "When you doodle absent-mindedly, you tend to draw:",
        options: ["Geometric shapes", "Natural elements", "Letters or words", "Abstract patterns"],
      },
      {
        id: 3,
        text: "Walking past a mirror unexpectedly, your first reaction is to:",
        options: ["Check your appearance", "Barely notice", "Make brief eye contact with yourself", "Look at your surroundings in the reflection"],
      },
      {
        id: 4,
        text: "When you're alone and hear your favorite song, you instinctively:",
        options: ["Sing or hum along", "Move or dance slightly", "Turn up the volume", "Listen more attentively"],
      },
      {
        id: 5,
        text: "In a dream where you can fly, you would most likely:",
        options: ["Soar as high as possible", "Explore familiar places", "Fly toward something specific", "Enjoy the sensation of freedom"],
      },
      {
        id: 6,
        text: "When given a wrapped gift, you first:",
        options: ["Open it carefully preserving the paper", "Tear into it immediately", "Shake or weigh it first", "Thank the giver before opening"],
      },
      {
        id: 7,
        text: "You see a ladder against a wall. Your immediate thought is:",
        options: ["Where it leads", "Whether it's safe", "If you should use it", "Who left it there"],
      },
      {
        id: 8,
        text: "If you found yourself in complete silence, you would feel:",
        options: ["Peaceful", "Uncomfortable", "Alert and aware", "Like breaking the silence"],
      },
      {
        id: 9,
        text: "You're handed a menu in a new restaurant. Your eyes first go to:",
        options: ["The prices", "Dishes you recognize", "The descriptions", "Pictures or highlights"],
      },
      {
        id: 10,
        text: "When you wake up naturally (no alarm), your first instinct is to:",
        options: ["Check the time", "Lie still with your thoughts", "Stretch or move immediately", "Reach for your phone or device"],
      },
    ],
  },
];

export default quizzes;