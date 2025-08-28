import { initializeFirebase } from './firebase.js';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
 * Call OpenAI API directly
 */
export const callOpenAI = async (
  prompt,
  {
    model = 'gpt-5',
    max_output_tokens = 800,           // cap to keep latency down
    reasoning_effort = 'minimal',      // faster for your use case
    // temperature not supported on gpt-5 family
  } = {}
) => {
  try {
    const resp = await openai.responses.create({
      model,
      input: prompt,
      reasoning: { effort: reasoning_effort },
      max_output_tokens,
      // If you require strict JSON, add a schema:
      // text: {
      //   format: {
      //     type: "json_schema",
      //     schema: { /* your schema here */ }
      //   }
      // }
    });

    // Prefer this helper field; falls back to the structured path if needed.
    const text =
      resp.output_text ??
      resp.output?.[0]?.content?.[0]?.text;

    if (!text) throw new Error('Invalid response from OpenAI API');

    return text;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error(`OpenAI API failed: ${error.message}`);
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