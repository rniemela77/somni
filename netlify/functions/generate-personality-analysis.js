import { initializeFirebase } from './utils/firebase.js';
import { success, error as errorResponse, handleOptions } from './utils/response.js';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// Import the frontend configuration to ensure consistency
import { PERSONALITY_ANALYSIS_SECTIONS, generateAnalysisPrompt } from '../../src/config/personalityAnalysis.js';
import { API_LIMITS } from '../../src/config/limits.js';

/**
 * Parse the OpenAI analysis text into sections using the same logic as frontend
 */
const parseAnalysis = (text) => {
  try {
    // Try to parse as JSON first (new format)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const jsonText = jsonMatch[0];
      const parsed = JSON.parse(jsonText);
      
      // Transform the parsed JSON to match the expected structure
      const result = {};
      Object.keys(PERSONALITY_ANALYSIS_SECTIONS).forEach(sectionKey => {
        const section = PERSONALITY_ANALYSIS_SECTIONS[sectionKey];
        const sectionData = parsed[section.title];
        
        if (sectionData && typeof sectionData === 'object') {
          result[section.id] = sectionData
        } else if (sectionData && typeof sectionData === 'string') {
          // Fallback to old format (just a string)
          result[section.id] = sectionData;
        } else {
          // No data found for this section
          result[section.id] = '';
        }
      });
      
      return result;
    }
  } catch (error) {
    console.log('Failed to parse as JSON, falling back to regex parsing:', error.message);
  }

  // Fallback to old regex parsing method
  const sections = Object.values(PERSONALITY_ANALYSIS_SECTIONS);
  const result = {};

  sections.forEach((section) => {
    const sectionTitle = section.title;
    const regex = new RegExp(`${sectionTitle}:\\s*(.+?)(?=\\n\\n|$)`, 's');
    const match = text.match(regex);
    result[section.id] = match ? match[1].trim() : '';
  });

  return result;
};

/**
 * Call OpenAI API for personality analysis using the existing openai function
 */
const callOpenAI = async (prompt) => {
  try {
    // Call the existing openai function internally
    const response = await fetch(`${process.env.URL || 'http://localhost:8888'}/.netlify/functions/openai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 1500
      })
    });

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
    throw new Error(`OpenAI analysis failed: ${error.message}`);
  }
};

/**
 * Netlify function to generate personality analysis
 */
export async function handler(event, context) {
  console.log('🧠 Personality analysis generation requested:', event.httpMethod, new Date().toISOString());

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    console.log('⚠️ Request rejected: Not a POST request');
    return errorResponse('Method not allowed', 405);
  }

  try {
    // Initialize Firebase
    await initializeFirebase();
    const db = getFirestore();
    console.log('🔥 Firebase initialized for personality analysis');

    // Authenticate user
    const authHeader = event.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse('Unauthorized. Missing or invalid token.', 401);
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const userId = decodedToken.uid;
    console.log('👤 Authenticated user:', userId);

    // Get user data from Firestore
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return errorResponse('User not found', 404);
    }

    const userData = userDoc.data();
    const attributes = userData.attributes || {};
    const openaiApiCalls = userData.openai_api_calls || 0;
    const isPaid = userData.isPaid || false;

    // Validate that user has completed assessments
    if (Object.keys(attributes).length === 0) {
      return errorResponse('No personality attributes found. Please complete some assessments first.', 400);
    }

    // Check if user has reached the API call limit
    const callLimit = isPaid ? API_LIMITS.PAID_OPENAI_CALLS_LIMIT : API_LIMITS.FREE_OPENAI_CALLS_LIMIT;
    if (openaiApiCalls >= callLimit) {
      return errorResponse(`You have reached your AI analysis limit (${callLimit} requests). Please contact support for additional access.`, 403);
    }

    console.log(`📊 Found ${Object.keys(attributes).length} personality attributes for analysis`);

    // Generate the analysis prompt
    const prompt = generateAnalysisPrompt(attributes);
    
    // Call OpenAI API
    console.log('🤖 Calling OpenAI for personality analysis...');
    const rawAnalysis = await callOpenAI(prompt);
    
    // Parse the analysis into sections
    const parsedAnalysis = parseAnalysis(rawAnalysis);

    console.log('✅ Analysis generated and parsed successfully');
    console.log('🔍 Backend: Parsed analysis structure:', {
      hasData: Object.keys(parsedAnalysis).length > 0,
      keys: Object.keys(parsedAnalysis),
      sampleSection: parsedAnalysis[Object.keys(parsedAnalysis)[0]]
    });

    // Save the analysis back to Firestore
    await userRef.update({
      personalityAnalysis: parsedAnalysis,
      openai_api_calls: FieldValue.increment(1),
      updatedAt: FieldValue.serverTimestamp(),
      lastAnalysisGenerated: FieldValue.serverTimestamp()
    });

    console.log('💾 Analysis saved to user document');

    // Return the parsed analysis
    return success({
      personalityAnalysis: parsedAnalysis,
      attributesAnalyzed: Object.keys(attributes).length,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error(`❌ Error generating personality analysis: ${error.message}`);
    
    // Return appropriate error based on type
    if (error.message.includes('token')) {
      return errorResponse('Authentication failed', 401);
    } else if (error.message.includes('OpenAI')) {
      return errorResponse('AI analysis service temporarily unavailable', 503);
    } else {
      return errorResponse(`Failed to generate personality analysis: ${error.message}`, 500);
    }
  }
}