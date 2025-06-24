import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import quizzes from "../../src/data/quizData.js";

// Parse the service account from environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Initialize Firebase Admin with the service account
const app = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

// Using named export for Netlify Functions
export const handler = async (event, context) => {
  try {
    for (const quiz of quizzes) {
      await db.collection("quizzes").doc(quiz.id).set({
        title: quiz.title,
        description: quiz.description,
        questions: quiz.questions,
        attribute: quiz.attribute
      });
      console.log(`Quiz ${quiz.id} added successfully!`);
    }
    console.log("Firestore seeding complete!");
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Firestore seeding complete!" })
    };
  } catch (error) {
    console.error("Error seeding Firestore:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error seeding Firestore" })
    };
  }
};
