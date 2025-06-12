import { doc, getDoc, writeBatch, collection, query, where, orderBy, getDocs, updateDoc } from 'firebase/firestore';
import { db } from './firebase-config';
import { BaseService } from './base.service';
import { PERSONALITY_ANALYSIS_SECTIONS } from '../config/personalityAnalysis';
import { UserService } from './user.service';

interface QuizResult {
  quizId: string;
  attribute: string;
  timestamp: string;
  answers: Record<string, string>;
  score: number;
}

export class PersonalityService extends BaseService {
  private userService: UserService;

  constructor() {
    super();
    this.userService = new UserService();
  }

  async getUserPersonality(userId: string) {
    return this.handleOperation(async () => {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      const data = userDoc.data();
      return {
        personalityAnalysis: data?.personalityAnalysis || {},
        results: data?.results || []
      };
    });
  }

  async updatePersonalityAnalysis(userId: string, data: { results?: QuizResult[], personalityAnalysis?: Record<string, any> }) {
    return this.handleOperation(async () => {
      const userRef = doc(db, 'users', userId);
      
      // If updating personality analysis sections, validate them
      if (data.personalityAnalysis) {
        const validSections = Object.keys(PERSONALITY_ANALYSIS_SECTIONS);
        const invalidSections = Object.keys(data.personalityAnalysis).filter(
          key => !validSections.includes(key)
        );

        if (invalidSections.length > 0) {
          throw new Error(`Invalid personality sections: ${invalidSections.join(', ')}`);
        }
      }

      // Update user document
      await updateDoc(userRef, this.addTimestamps(data));

      // Return updated data
      const updatedDoc = await getDoc(userRef);
      const updatedData = updatedDoc.data();
      
      return {
        personalityAnalysis: updatedData?.personalityAnalysis || {},
        results: updatedData?.results || []
      };
    });
  }

  async getUserResults(userId: string) {
    return this.handleOperation(async () => {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return [];
      }

      const userData = userDoc.data();
      return userData.results || [];
    });
  }

  async submitQuizResult(userId: string, result: QuizResult) {
    return this.handleOperation(async () => {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      const userData = userDoc.data();
      const currentResults = userData.results || [];
      const currentAttributes = userData.attributes || {};

      // Update the attributes with the new quiz score
      const updatedAttributes = {
        ...currentAttributes,
        [result.attribute]: result.score
      };

      // Update both results and attributes atomically
      const batch = writeBatch(db);
      batch.update(userRef, {
        results: [...currentResults, result],
        attributes: updatedAttributes,
        updatedAt: new Date()
      });

      await batch.commit();

      return {
        results: [...currentResults, result],
        attributes: updatedAttributes
      };
    });
  }
} 