import { doc, getDoc, setDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from './firebase-config';
import { BaseService } from './base.service';

export interface User {
  id: string;
  isPaid: boolean;
  tags: string[];
  attributes: Record<string, number>;
  personalityAnalysis: Record<string, any>;
  results: Array<{
    id?: string;
    quizId: string;
    quizTitle: string;
    timestamp: any;
    answers: Array<{
      questionText: string;
      userAnswer: number;
    }>;
  }>;
  createdAt: any;
  updatedAt: any;
}

export class UserService extends BaseService {
  async getUser(userId: string) {
    return this.handleOperation(async () => {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }
      
      return userDoc.data() as User;
    });
  }

  async initializeUser(userId: string, userData: Partial<User> = {}) {
    return this.handleOperation(async () => {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        const newUserData = this.addTimestamps({
          isPaid: false,
          tags: [],
          personalityAnalysis: {},
          ...userData
        });
        
        await setDoc(userRef, newUserData);
        return { id: userId, ...newUserData } as User;
      }
      
      return {
        id: userDoc.id,
        ...userDoc.data()
      } as User;
    });
  }

  async updateUser(userId: string, data: Partial<User>) {
    return this.handleOperation(async () => {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, this.addTimestamps(data));

      const updatedDoc = await getDoc(userRef);
      return updatedDoc.data() as User;
    });
  }

  async checkPaidStatus(userId: string) {
    return this.handleOperation(async () => {
      const { data: user } = await this.getUser(userId);
      return user?.isPaid || false;
    });
  }
} 