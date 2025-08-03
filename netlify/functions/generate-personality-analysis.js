import { success, error as errorResponse, handleOptions } from './utils/response.js';
import { authenticateUser, callOpenAI, validateUserAttributes, checkApiCallLimit } from './utils/openai.js';
import { FieldValue } from 'firebase-admin/firestore';

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
    // Authenticate user and get user data
    const { userRef, userData } = await authenticateUser(event);
    const attributes = userData.attributes || {};
    const openaiApiCalls = userData.openai_api_calls || 0;
    const isPaid = userData.isPaid || false;

    console.log('👤 Authenticated user:', userData.id);
    console.log('🔥 Firebase initialized for personality analysis');

    // Validate that user has completed assessments
    validateUserAttributes(attributes);

    // Check if user has reached the API call limit
    checkApiCallLimit(userData, API_LIMITS);

    console.log(`📊 Found ${Object.keys(attributes).length} personality attributes for analysis`);

    // Generate the analysis prompt
    const prompt = generateAnalysisPrompt(attributes);
    
    // Call OpenAI API
    console.log('🤖 Calling OpenAI for personality analysis...');
    const rawAnalysis = await callOpenAI(prompt, {
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      max_tokens: 1500
    });
    
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
    if (error.message.includes('token') || error.message.includes('Unauthorized')) {
      return errorResponse('Authentication failed', 401);
    } else if (error.message.includes('OpenAI')) {
      return errorResponse('AI analysis service temporarily unavailable', 503);
    } else if (error.message.includes('personality data') || error.message.includes('assessments')) {
      return errorResponse(error.message, 400);
    } else if (error.message.includes('AI analysis limit')) {
      return errorResponse(error.message, 403);
    } else {
      return errorResponse(`Failed to generate personality analysis: ${error.message}`, 500);
    }
  }
}