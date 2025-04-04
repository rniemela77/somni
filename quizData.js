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
];

export default quizzes;