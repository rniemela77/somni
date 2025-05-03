import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the root directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Make sure the service account variable exists
if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  console.error("FIREBASE_SERVICE_ACCOUNT environment variable is not set!");
  process.exit(1);
}

// Parse the service account from environment variable
let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  console.log("Successfully parsed Firebase service account");
} catch (error) {
  console.error("Error parsing FIREBASE_SERVICE_ACCOUNT:", error.message);
  console.error("Make sure the FIREBASE_SERVICE_ACCOUNT value is valid JSON");
  process.exit(1);
}

import quizzes from "../quizData.js";

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
