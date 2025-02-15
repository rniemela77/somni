import { auth, db } from "../../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// Auth Service
export const authService = {
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, error: null };
    } catch (error) {
      console.error("Sign in error:", error);
      return { user: null, error: error.message };
    }
  },

  async signUp(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, error: null };
    } catch (error) {
      console.error("Sign up error:", error);
      return { user: null, error: error.message };
    }
  },

  async logout() {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error) {
      console.error("Logout error:", error);
      return { error: error.message };
    }
  },

  getCurrentUser() {
    return auth.currentUser;
  },
};

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