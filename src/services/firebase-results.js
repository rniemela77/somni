// Results Service Module
import { db } from "./firebase-config";
import {
  collection,
  doc,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { quizService } from "./firebase-quiz";

// Results Service
export const resultsService = {
  async submitQuizResult(userId, quizId, answers) {
    try {
      // First, get the quiz data to access the questions and their points
      const { quiz, error: quizError } = await quizService.getQuizById(quizId);
      if (quizError) {
        throw new Error(quizError);
      }

      // Calculate the total score for this attribute
      let totalScore = 0;
      for (const question of quiz.questions) {
        // answers[question.id] will be between -100 and 100 from the slider
        // we multiply it by the question's points (-0.1 or 0.1) to get the weighted score
        const answerValue = answers[question.id];
        const weight = question.points;
        totalScore += (answerValue / 100) * weight;
      }

      // Scale the total score to be between -100 and 100
      const scaledScore = Math.round(totalScore * 1000);

      // Get the user's document
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        throw new Error("User not found");
      }

      // Update the user's document with the new attribute score
      const attribute = quiz.attribute;
      await updateDoc(userRef, {
        [`attributes.${attribute}`]: scaledScore
      });
      
      return { 
        attribute,
        score: scaledScore,
        error: null 
      };
    } catch (error) {
      console.error("Error submitting quiz:", error);
      return { 
        attribute: null,
        score: null,
        error: error.message 
      };
    }
  },

  async getUserResults(userId) {
    try {
      const resultsQuery = query(
        collection(db, "results"),
        where("userId", "==", userId),
        orderBy("timestamp", "desc")
      );
      const resultsSnapshot = await getDocs(resultsQuery);

      if (resultsSnapshot.empty) {
        return { results: [], error: null };
      }

      const results = await Promise.all(
        resultsSnapshot.docs.map(async (resultDoc) => {
          const resultData = resultDoc.data();
          const { quiz } = await quizService.getQuizById(resultData.quizId);

          if (!quiz) {
            return null;
          }

          return {
            id: resultDoc.id,
            quizId: resultData.quizId,
            quizTitle: quiz.title,
            timestamp: resultData.timestamp,
            answers: quiz.questions.map((question) => ({
              questionText: question.text,
              userAnswer: resultData.answers[question.id],
            })),
          };
        })
      );

      return {
        results: results.filter(result => result !== null),
        error: null,
      };
    } catch (error) {
      console.error("Error fetching results:", error);
      return { results: [], error: error.message };
    }
  },
}; 