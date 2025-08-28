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
 * Netlify function to generate personality analysis
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

    const { cluster, sectionId } = requestBody;

    if (!cluster && !sectionId) {
      return errorResponse("Missing cluster or sectionId parameter", 400);
    }

    console.log("Processing cluster:", cluster);

    // Authenticate user and get user data
    const { userRef, userData } = await authenticateUser(event);
    const assessmentScores = userData.assessmentScores || {};

    // Validate that user has completed assessments
    validateUserAttributes(assessmentScores);

    // Check if user has reached the API call limit
    checkApiCallLimit(userData, API_LIMITS);

    // Generate the analysis prompt
    const prompt = generateAnalysisPrompt(assessmentScores, { category: cluster, sectionId });
    console.log('prompt', prompt);

    // Call OpenAI API
    const rawAnalysis = await callOpenAI(prompt, {
      model: "gpt-5",
      max_output_tokens: 800,
    });

    // convert into json array of objects
    const parsedAnalysis = JSON.parse(rawAnalysis);

    // Save the analysis back to Firestore
    await userRef.update({
      personalityAnalysis: parsedAnalysis,
      openai_api_calls: FieldValue.increment(1),
      updatedAt: FieldValue.serverTimestamp(),
      lastAnalysisGenerated: FieldValue.serverTimestamp(),
    });

    // Return the parsed analysis
    return success({
      personalityAnalysis: parsedAnalysis,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`❌ Error generating personality analysis: ${error.message}`);
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
    } else {
      return errorResponse(
        `Failed to generate personality analysis: ${error.message}`,
        500
      );
    }
  }
}

const formatAttributesIntoText = (assessmentScores) => {
  let text = "";

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
    if (absScore <= 10) {
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

    text += `${description}\n`;
  });

  return text.trim();
};

// Generate prompt for a specific category or section
export const generateAnalysisPrompt = (assessmentScores, { category, sectionId }) => {
  // console.log('generateAnalysisPrompt', assessmentScores, category, '\n');
  // Build prompt
  let prompt = `${SHARED_PROMPT_INSTRUCTIONS}\n\n`;

  // Format attributes as key-value pairs
  const attributeText = formatAttributesIntoText(assessmentScores);

  prompt += `${attributeText}\n\n`;
  prompt += `Provide responses in the following JSON format:\n{\n`;

  // Determine which sections to generate
  let sectionsToGenerate = [];
  if (sectionId) {
    const one = Object.values(PERSONALITY_ANALYSIS_SECTIONS).find((s) => s.id === sectionId);
    if (!one) {
      throw new Error(`Unknown sectionId: ${sectionId}`);
    }
    sectionsToGenerate = [one];
  } else if (category) {
    sectionsToGenerate = Object.values(PERSONALITY_ANALYSIS_SECTIONS).filter((s) => s.category === category);
    if (!sectionsToGenerate.length) {
      throw new Error(`No sections found for category: ${category}`);
    }
  } else {
    throw new Error("No category or sectionId provided for analysis generation");
  }

  /*
   example:
  {
    "core": {
      "title": "<The core personality in 2-4 words>",
      "details": "<Write exactly two sentences describing the core personality. Focus on revealing unique, non-obvious emotional patterns and psychological traits that provide genuine insight>",
    },
    "myersBriggs": {
      "title": "<The Myers-Briggs type that best fits the user's personality (ISTJ, ISFJ, INFJ, INTJ, ISTP, ISFP, INFP, INTP, ESTP, ESFP, ENFP, ENTP, ESTJ, ESFJ, ENFJ, ENTJ).>",
      "details": "<Explain two or three sentences why this type reflects their character.>",
    },
  }
  */
  sectionsToGenerate.forEach((section) => {
    prompt += `"${section.id}": {\n`;
    Object.entries(section.promptInstructions).forEach(([field, value]) => {
      prompt += `"${field}": "${value}",\n`;
    });
    prompt += `},\n`;
  });

  prompt += `}\n`;

  return prompt;
};
