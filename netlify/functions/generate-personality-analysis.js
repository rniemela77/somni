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

    const { cluster } = requestBody;

    if (!cluster) {
      return errorResponse("Missing cluster parameter", 400);
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
    const prompt = generateAnalysisPrompt(assessmentScores, cluster);
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
  let text =
    "The user has taken a set of personality tests. Each test measures a spectrum between two opposite traits. The score is not about intensity, but about which side of the spectrum the user leans toward. A score of 0 means the user is perfectly balanced between the two traits. A score of 50 means the user moderately leans toward that trait. A score of 100 means the user strongly and consistently expresses that trait. Importantly: A lower score does not mean “low” in the trait. It only shows that the user is closer to balance. For example, if Extraversion is 25, that means the user expresses Extraversion fairly often, just not extremely. You can think of 25 Extraversion as the same as 75 Introversion.\n\n";

  // put most intense traits first
  let sortedScores = Object.keys(assessmentScores).sort(
    (a, b) => Math.abs(assessmentScores[b]) - Math.abs(assessmentScores[a])
  );

  // each line: <dominant trait>: <absolute score>
  sortedScores.forEach((key) => {
    const scale = PersonalityData.find((scale) => scale.id === key);
    const dominantTraitName =
      assessmentScores[key] > 0 ? scale.positive : scale.negative;
    if (assessmentScores[key] === 0) {
      // if balanced, show both traits
      text += `${scale.positive}: 0\n${scale.negative}: 0\n`;
    } else {
      // if not balanced, show only the dominant trait
      text += `${dominantTraitName}: ${Math.abs(assessmentScores[key])}\n`;
    }
  });

  return text;
};

// Generate prompt for a specific category or section
export const generateAnalysisPrompt = (assessmentScores, category) => {
  // console.log('generateAnalysisPrompt', assessmentScores, category, '\n');
  // Build prompt
  let prompt = `${SHARED_PROMPT_INSTRUCTIONS}\n\n`;

  // Format attributes as key-value pairs
  const attributeText = formatAttributesIntoText(assessmentScores);

  prompt += `${attributeText}\n\n`;
  prompt += `Provide responses in the following JSON format:\n{\n`;

  // filter only sections for the given category
  const sectionsForCategory = Object.values(
    PERSONALITY_ANALYSIS_SECTIONS
  ).filter((section) => section.category === category);

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
  sectionsForCategory.forEach((section) => {
    prompt += `"${section.id}": {\n`;
    Object.entries(section.promptInstructions).forEach(([field, value]) => {
      prompt += `"${field}": "${value}",\n`;
    });
    prompt += `},\n`;
  });

  prompt += `}\n`;

  return prompt;
};
