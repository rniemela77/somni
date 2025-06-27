import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import personalityData from "../../data/personalityData.js";

// Parse the service account from environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Initialize Firebase Admin with the service account
const app = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

// Update any usage of quizzes to filter personalityData for items with questions
const quizzes = personalityData.filter(item => item.questions);

// Using ES module export
const handler = async (event, context) => {
  try {
    for (const quiz of quizzes) {
      // Use set with merge:true to update existing documents or create new ones
      await db.collection("quizzes").doc(quiz.id).set({
        title: quiz.title,
        description: quiz.description,
        questions: quiz.questions,
        id: quiz.id,
        displayName: quiz.displayName,
        positive: quiz.positive,
        negative: quiz.negative
      }, { merge: true });
      console.log(`Quiz ${quiz.id} updated successfully!`);
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

export { handler };
