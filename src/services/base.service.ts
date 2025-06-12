import { FirebaseError } from 'firebase/app';
import { serverTimestamp } from 'firebase/firestore';

export class BaseService {
  protected async handleOperation<T>(operation: () => Promise<T>) {
    try {
      return {
        data: await operation(),
        error: null
      };
    } catch (error) {
      console.error('Operation error:', error);
      return {
        data: null,
        error: error instanceof FirebaseError ? error.message : 'An unknown error occurred'
      };
    }
  }

  protected addTimestamps(data: any) {
    return {
      ...data,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    };
  }
} 