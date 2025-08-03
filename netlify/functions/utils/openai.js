import { initializeFirebase } from './firebase.js';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

/**
 * Common authentication and user validation logic
 */
export const authenticateUser = async (event) => {
  // Initialize Firebase
  await initializeFirebase();
  const db = getFirestore();

  // Authenticate user
  const authHeader = event.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized. Missing or invalid token.');
  }

  const idToken = authHeader.split('Bearer ')[1];
  const decodedToken = await getAuth().verifyIdToken(idToken);
  const userId = decodedToken.uid;

  // Get user data from Firestore
  const userRef = db.collection('users').doc(userId);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    throw new Error('User not found');
  }

  return {
    db,
    userRef,
    userId,
    userData: userDoc.data()
  };
};

/**
 * Call OpenAI API using the existing openai function
 */
export const callOpenAI = async (prompt, options = {}) => {
  const {
    model = 'gpt-4',
    temperature = 0.8,
    max_tokens = 800
  } = options;

  try {
    const response = await fetch(
      `${process.env.URL || 'http://localhost:8888'}/.netlify/functions/openai`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          model,
          temperature,
          max_tokens
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `OpenAI service error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.completion) {
      throw new Error('Invalid response from OpenAI service');
    }

    return data.completion;
  } catch (error) {
    console.error('Error calling OpenAI service:', error);
    throw new Error(`OpenAI service failed: ${error.message}`);
  }
};

/**
 * Validate that user has completed assessments
 */
export const validateUserAttributes = (attributes) => {
  if (!attributes || Object.keys(attributes).length === 0) {
    throw new Error('No personality data found. Please complete some assessments first.');
  }
};

/**
 * Check OpenAI API call limits
 */
export const checkApiCallLimit = (userData, limits) => {
  const { openaiApiCalls = 0, isPaid = false } = userData;
  const callLimit = isPaid ? limits.PAID_OPENAI_CALLS_LIMIT : limits.FREE_OPENAI_CALLS_LIMIT;
  
  if (openaiApiCalls >= callLimit) {
    throw new Error(`You have reached your AI analysis limit (${callLimit} requests). Please contact support for additional access.`);
  }
  
  return { openaiApiCalls, isPaid, callLimit };
}; 