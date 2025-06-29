import { doc, getDoc, setDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from './firebase-config';
import { BaseService } from './base.service';
import { serverTimestamp } from 'firebase/firestore';

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
  async getOrCreateUser(userId: string): Promise<{ data: User | null; error: string | null }> {
    return this.handleOperation(async () => {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        return userDoc.data() as User;
      }
      
      // Default user structure
      const newUser: User = {
        id: userId,
        isPaid: false,
        tags: [],
        attributes: {},
        personalityAnalysis: {},
        results: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(userRef, newUser);
      return newUser;
    });
  }

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