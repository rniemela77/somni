import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase";
import type { Assessment } from "../../shared/types/shared";
import hardcodedAssessments from "../../data/personalityData.js";

const DEV_MODE = false; // dev mode = pull assessments from local file

export async function fetchAllAssessments() {
  if (DEV_MODE) {
    return hardcodedAssessments as unknown as Assessment[];
  }

  const assessments = await getDocs(collection(db, "quizzes"));
  return assessments.docs.map((doc) => doc.data() as Assessment);
}
