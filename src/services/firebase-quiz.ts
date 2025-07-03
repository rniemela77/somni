// Quiz Service Module
// @ts-ignore todo: fix this
import { db } from "./firebase-config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  DocumentData,
  QueryDocumentSnapshot
} from "firebase/firestore";

// Define types for quiz data
export interface Quiz {
  id: string;
  title?: string;
  description?: string;
  questions?: any[];
}

export interface QuizzesResponse {
  quizzes: Quiz[];
  error: string | null;
}

export interface QuizResponse {
  quiz: Quiz | null;
  error: string | null;
}

// Quiz Service
export const quizService = {
  async getAllQuizzes(): Promise<QuizzesResponse> {
    try {
      const quizzesSnapshot = await getDocs(collection(db, "quizzes"));
      return {
        quizzes: quizzesSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
          id: doc.id,
          ...doc.data(),
        })),
        error: null,
      };
    } catch (error: any) {
      console.error("Error loading quizzes:", error);
      return { quizzes: [], error: error.message };
    }
  },

  async getQuizById(quizId: string): Promise<QuizResponse> {
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
    } catch (error: any) {
      console.error("Error fetching quiz:", error);
      return { quiz: null, error: error.message };
    }
  },
}; 