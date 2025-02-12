const quizzes = [
  {
    id: "quiz1",
    title: "Sample Quiz",
    questions: [
      {
        id: 1,
        text: "What is your favorite color?",
        options: ["Red", "Blue", "Green", "Yellow"],
      },
      {
        id: 2,
        text: "How do you feel today?",
        options: ["Happy", "Sad", "Excited", "Angry"],
      },
    ],
  },
  {
    id: "user-personality",
    title: "User Profile",
    questions: [
      {
        id: 1,
        text: "What is your zodiac sign?",
        options: ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"],
      },
      {
        id: 2,
        text: "What is your MBTI personality type?",
        options: ["ISTJ", "ISFJ", "INFJ", "INTJ", "ISTP", "ISFP", "INFP", "INTP", "ESTP", "ESFP", "ENFP", "ENTP", "ESTJ", "ESFJ", "ENFJ", "ENTJ"],
      },
    ],
  },
];

export default quizzes;