import { db } from "./firebase-config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  deleteDoc,
  setDoc,
} from "firebase/firestore";

// Re-export the authService from the dedicated module
export { authService } from './firebase-auth';

// Quiz Service
export const quizService = {
  async getAllQuizzes() {
    try {
      const quizzesSnapshot = await getDocs(collection(db, "quizzes"));
      return {
        quizzes: quizzesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })),
        error: null,
      };
    } catch (error) {
      console.error("Error loading quizzes:", error);
      return { quizzes: [], error: error.message };
    }
  },

  async getQuizById(quizId) {
    try {
      const quizRef = doc(db, "quizzes", quizId);
      const quizSnap = await getDoc(quizRef);

      if (!quizSnap.exists()) {
        return { quiz: null, error: "Quiz not found" };
      }

      return {
        quiz: {
          id: quizSnap.id,
          ...quizSnap.data(),
        },
        error: null,
      };
    } catch (error) {
      console.error("Error fetching quiz:", error);
      return { quiz: null, error: error.message };
    }
  },
};

// Results Service
export const resultsService = {
  async submitQuizResult(userId, quizId, answers) {
    try {
      // First, check if there's an existing result for this user and quiz
      const existingResultsQuery = query(
        collection(db, "results"),
        where("userId", "==", userId),
        where("quizId", "==", quizId)
      );
      
      const existingResultsSnapshot = await getDocs(existingResultsQuery);
      
      let resultId;
      
      // If there's an existing result, update it instead of deleting and creating a new one
      if (!existingResultsSnapshot.empty) {
        // Use the first existing document (there should only be one)
        resultId = existingResultsSnapshot.docs[0].id;
        const resultRef = doc(db, "results", resultId);
        
        // Update the existing document
        await setDoc(resultRef, {
          userId,
          quizId,
          answers,
          timestamp: new Date(),
        });
      } else {
        // No existing result, create a new one
        const resultDoc = await addDoc(collection(db, "results"), {
          userId,
          quizId,
          answers,
          timestamp: new Date(),
        });
        resultId = resultDoc.id;
      }
      
      return { resultId, error: null };
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