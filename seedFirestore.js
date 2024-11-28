import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { quizData } from "./quizData.js";
import { firebaseConfig } from "./firebase.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Seed Firestore with quiz data
const seedFirestore = async () => {
  try {
    for (const quiz of quizData.quizzes) {
      const quizRef = doc(db, "quizzes", quiz.id); // Document ID matches quiz.id
      await setDoc(quizRef, {
        title: quiz.title,
        questions: quiz.questions,
      });
      console.log(`Quiz ${quiz.id} added successfully!`);
    }
    console.log("Firestore seeding complete!");
    process.exit(0); // Exit the process successfully
  } catch (error) {
    console.error("Error seeding Firestore:", error);
    process.exit(1); // Exit the process with an error code
  }
};

seedFirestore();
