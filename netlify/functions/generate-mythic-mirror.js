import {
  success,
  error as errorResponse,
  handleOptions,
} from "./utils/response.js";
import {
  authenticateUser,
  callOpenAI,
  validateUserAttributes,
  checkApiCallLimit,
} from "./utils/openai.js";
import { FieldValue } from "firebase-admin/firestore";

// Import the shared configuration to ensure consistency
import {
  PERSONALITY_ANALYSIS_SECTIONS,
  SHARED_PROMPT_INSTRUCTIONS,
} from "../../shared/config/personalityAnalysis.js";
import { API_LIMITS } from "../../src/config/limits.js";
import PersonalityData from "../../data/personalityData.js";

/**
 * Netlify function to generate mythic mirror analysis
 */
export async function handler(event, context) {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return handleOptions();
  }

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return errorResponse("Method not allowed", 405);
  }

  try {
    // Parse the request body - handle both string and parsed JSON
    let requestBody;
    if (typeof event.body === "string") {
      requestBody = JSON.parse(event.body);
    } else if (event.body && typeof event.body === "object") {
      requestBody = event.body;
    } else {
      return errorResponse("Invalid request body", 400);
    }

    const { challenge } = requestBody;

    if (!challenge || typeof challenge !== 'string' || challenge.trim().length === 0) {
      return errorResponse("Challenge text is required", 400);
    }

    if (challenge.length > 500) {
      return errorResponse("Challenge text must be 500 characters or less", 400);
    }

    console.log("Processing mythic mirror challenge:", challenge.substring(0, 50) + "...");

    // Authenticate user and get user data
    const { userRef, userData } = await authenticateUser(event);
    const assessmentScores = userData.assessmentScores || {};

    // Validate that user has completed assessments
    validateUserAttributes(assessmentScores);

    // Check if user has reached the API call limit
    checkApiCallLimit(userData, API_LIMITS);

    // Generate the analysis prompt with the user's challenge
    const prompt = generateMythicMirrorPrompt(assessmentScores, challenge.trim());
    console.log('Generated prompt for mythic mirror');

    // Call OpenAI API
    const rawAnalysis = await callOpenAI(prompt, {
      model: "gpt-5",
      max_output_tokens: 800,
    });

    // Parse the response
    const parsedAnalysis = JSON.parse(rawAnalysis);
    
    // Extract the mythic mirror response
    const mythicMirrorResponse = parsedAnalysis.mythicMirror;
    if (!mythicMirrorResponse || !mythicMirrorResponse.title || !mythicMirrorResponse.details) {
      throw new Error("Invalid response format from OpenAI");
    }

    // Create the new mythic mirror entry
    const newEntry = {
      challenge: challenge.trim(),
      response: mythicMirrorResponse,
      createdAt: new Date(),
    };

    // Get existing mythic mirror entries
    const existingEntries = userData.mythicMirror || [];
    
    // Add the new entry to the beginning of the array (most recent first)
    const updatedEntries = [newEntry, ...existingEntries];

    // Save the new entry to Firestore
    await userRef.update({
      mythicMirror: updatedEntries,
      openai_api_calls: FieldValue.increment(1),
      updatedAt: FieldValue.serverTimestamp(),
      lastMythicMirrorGenerated: FieldValue.serverTimestamp(),
    });

    // Return the response
    return success({
      response: mythicMirrorResponse,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`❌ Error generating mythic mirror analysis: ${error.message}`);
    console.error("Error stack:", error.stack);

    // Return appropriate error based on type
    if (
      error.message.includes("token") ||
      error.message.includes("Unauthorized")
    ) {
      return errorResponse("Authentication failed", 401);
    } else if (error.message.includes("OpenAI")) {
      return errorResponse("AI analysis service temporarily unavailable", 503);
    } else if (
      error.message.includes("personality data") ||
      error.message.includes("assessments")
    ) {
      return errorResponse(error.message, 400);
    } else if (error.message.includes("AI analysis limit")) {
      return errorResponse(error.message, 403);
    } else if (error.message.includes("Challenge text")) {
      return errorResponse(error.message, 400);
    } else {
      return errorResponse(
        `Failed to generate mythic mirror analysis: ${error.message}`,
        500
      );
    }
  }
}

const formatAttributesIntoText = (assessmentScores) => {
  let text = "Personality Traits:\n";

  // put most intense traits first
  const sortedKeys = Object.keys(assessmentScores).sort(
    (a, b) => Math.abs(assessmentScores[b]) - Math.abs(assessmentScores[a])
  );

  // each line: descriptive leaning text per absolute score range
  sortedKeys.forEach((key) => {
    const scale = PersonalityData.find((scale) => scale.id === key);
    if (!scale) return;

    const score = assessmentScores[key] || 0;
    const absScore = Math.abs(score);

    const dominantTraitName = score >= 0 ? scale.positive : scale.negative;
    const oppositeTraitName = score >= 0 ? scale.negative : scale.positive;

    let description = "";
    if (absScore <= 10 && absScore > 0) {
      description = `Slightly more ${dominantTraitName} than ${oppositeTraitName}`;
    } else if (absScore <= 25) {
      description = `Light leaning toward ${dominantTraitName}`;
    } else if (absScore <= 45) {
      description = `Moderate leaning toward ${dominantTraitName}`;
    } else if (absScore <= 65) {
      description = `Clear leaning toward ${dominantTraitName}`;
    } else if (absScore <= 85) {
      description = `Strong leaning toward ${dominantTraitName}`;
    } else {
      description = `Extreme leaning toward ${dominantTraitName}`;
    }

    text += `- ${description}\n`;
  });

  return text.trim();
};

// Generate prompt specifically for mythic mirror with user's challenge
const generateMythicMirrorPrompt = (assessmentScores, challenge) => {
  // Build prompt
  let prompt = `${SHARED_PROMPT_INSTRUCTIONS}\n\n`;

  // Format attributes as key-value pairs
  const attributeText = formatAttributesIntoText(assessmentScores);

  prompt += `${attributeText}\n\n`;
  prompt += `Provide responses in the following JSON format:\n{\n`;

  // Get the mythic mirror section configuration
  const mythicMirrorSection = PERSONALITY_ANALYSIS_SECTIONS.find(s => s.id === 'mythicMirror');
  if (!mythicMirrorSection) {
    throw new Error("Mythic mirror section not found in configuration");
  }

  // Replace the &CHALLENGE& placeholder with the user's actual challenge
  const detailsWithChallenge = mythicMirrorSection.promptInstructions.details.replace(
    '&CHALLENGE&',
    challenge
  );

  prompt += `"mythicMirror": {\n`;
  prompt += `"title": "${mythicMirrorSection.promptInstructions.title}",\n`;
  prompt += `"details": "${detailsWithChallenge}",\n`;
  prompt += `},\n`;

  prompt += `}\n`;

  return prompt;
};
