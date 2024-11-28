<template>
    <div>
      <h2>{{ quizTitle }}</h2>
      <form @submit.prevent="submitQuiz">
        <div v-for="(question, index) in questions" :key="question.id">
          <p>{{ question.text }}</p>
          <div>
            <label v-for="(option, i) in question.options" :key="i">
              <input
                type="radio"
                :name="'question-' + index"
                :value="option"
                v-model="answers[question.id]"
                required
              />
              {{ option }}
            </label>
          </div>
        </div>
        <button type="submit">Submit</button>
      </form>
      <p v-if="message">{{ message }}</p>
    </div>
  </template>
  
  <script>
  import { db } from "../../firebase";
  import { doc, getDoc, collection, addDoc } from "firebase/firestore";
  
  export default {
    data() {
      return {
        quizTitle: "Loading Quiz...",
        questions: [],
        answers: {}, // Stores user answers keyed by question ID
        message: "",
      };
    },
    async mounted() {
      try {
        // Fetch quiz data from Firestore
        const quizRef = doc(db, "quizzes", "K1TQryizWyxIrKaeKgaE"); // Replace with your actual document ID
        const quizSnap = await getDoc(quizRef);
  
        if (quizSnap.exists()) {
          const quizData = quizSnap.data();
          this.quizTitle = quizData.title;
          this.questions = quizData.questions;
        } else {
          console.error("Quiz document does not exist!");
          this.quizTitle = "Error: Quiz not found.";
        }
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        this.quizTitle = "Error loading quiz.";
      }
    },
    methods: {
      async submitQuiz() {
        try {
          // Save the quiz answers to Firestore
          await addDoc(collection(db, "results"), {
            userId: "12345", // Replace with the current user's ID if available
            answers: this.answers,
            timestamp: new Date(),
          });
          this.message = "Quiz submitted successfully!";
          this.answers = {}; // Reset answers
        } catch (error) {
          console.error("Error submitting quiz:", error);
          this.message = "Error submitting quiz. Please try again.";
        }
      },
    },
  };
  </script>
  
  <style scoped>
  form {
    margin-top: 20px;
  }
  button {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  button:hover {
    background-color: #0056b3;
  }
  </style>
  