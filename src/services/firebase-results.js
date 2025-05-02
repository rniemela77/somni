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
} from "firebase/firestore";
import { quizService } from "./firebase-quiz";

// Results Service
export const resultsService = {
  async submitQuizResult(userId, quizId, answers) {
    try {
      const resultDoc = await addDoc(collection(db, "results"), {
        userId,
        quizId,
        answers,
        timestamp: new Date(),
      });
      return { resultId: resultDoc.id, error: null };
    } catch (error) {
      console.error("Error submitting quiz:", error);
      return { resultId: null, error: error.message };
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