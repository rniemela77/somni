import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const serviceAccount = require("./firebase-service-account.json");
import quizzes from "./quizData.js";

// Initialize Firebase Admin with the service account
const app = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const seedFirestore = async () => {
  try {
    for (const quiz of quizzes) {
      await db.collection("quizzes").doc(quiz.id).set({
        title: quiz.title,
        questions: quiz.questions,
      });
      console.log(`Quiz ${quiz.id} added successfully!`);
    }
    console.log("Firestore seeding complete!");
  } catch (error) {
    console.error("Error seeding Firestore:", error);
  }
};

seedFirestore();
