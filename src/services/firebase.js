import { db } from "./firebase-config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
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