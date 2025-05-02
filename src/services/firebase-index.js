// Firebase Services Index
// This file centralizes all Firebase-related exports

// Export Firebase core configuration
export { auth, db, firebaseConfig } from './firebase-config';

// Export user-related services
export {
  initializeUserDocument
} from './firebase-user';

// Export personality-related services
export {
  updateDimensionValue,
  getUserPersonality,
  incrementDimensionValue,
  updateUserPersonalityAnalysis,
  getUserPersonalityAnalysis
} from './firebase-personality';

// Export subscription-related services
export {
  markUserAsPaid,
  checkUserPaidStatus
} from './firebase-subscription';

// Export authentication services
export { authService } from './firebase-auth';

// Export quiz services
export { quizService } from './firebase-quiz';

// Export results services
export { resultsService } from './firebase-results'; 
