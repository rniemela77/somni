import { success, error as errorResponse, handleOptions } from "./utils/response.js";
import { authenticateUser, callOpenAI, validateUserAttributes } from "./utils/openai.js";
import { FieldValue } from "firebase-admin/firestore";
import { formatPersonalityAttributes } from "../../src/utils/personalityUtils.js";

/**
 * Generate a personalized story based on personality data
 */
const generateStoryPrompt = (attributes) => {
  
  let prompt = "Given the user personality profile below: \n\n";

  // Add the attribute scores in a formatted way
  prompt += formatPersonalityAttributes(attributes);

  prompt += `\n\nIdentify the three metrics with the largest absolute values. Write a single narrative about an animal whose temperament, choices, and environment subtly reflect those dominant traits without naming them. The story must:

1. Name a specific animal protagonist and show its daily world.  
2. Pose a realistic obstacle that invokes those three dominant drives.  
3. Reveal how the animal's behavior, internal perceptions, and sensory details embody those traits in solving the problem.  
4. Emphasize the constructive edge of traits often undervalued.  
5. Use clear, straightforward language accessible to a broad adult audience at a Grade 8-10 reading level.  
6. Conclude with a positive, earned resolution.

Length: 350-450 words.  
Output: Title followed immediately by the story text. Do not include any commentary or trait analysis—only the narrative itself.`;

  return prompt;
};

/**
 * Netlify function to generate personalized story
 */
export async function handler(event, context) {
  console.log(
    "📖 Story generation requested:",
    event.httpMethod,
    new Date().toISOString()
  );

  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return handleOptions();
  }

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    console.log("⚠️ Request rejected: Not a POST request");
    return errorResponse("Method not allowed", 405);
  }

  try {
    // Authenticate user and get user data
    const { userRef, userData } = await authenticateUser(event);
    const userAttributes = userData.attributes || {};

    // Validate that user has completed some assessments
    validateUserAttributes(userAttributes);

    console.log("👤 Authenticated user:", userData.id);
    console.log("🔥 Firebase initialized for story generation");

    // Generate the story prompt
    const prompt = generateStoryPrompt(userAttributes);
    console.log("🔍 Story prompt:", prompt);

    // Call OpenAI API
    console.log("🤖 Calling OpenAI for story generation...");
    const story = await callOpenAI(prompt, {
      model: "gpt-4",
      temperature: 0.8,
      max_tokens: 800
    });

    if (!story) {
      throw new Error("No story generated from OpenAI");
    }

    console.log("✅ Story generated successfully");

    // Save the story to Firestore
    await userRef.update({
      lastStoryGenerated: FieldValue.serverTimestamp(),
      storyCount: FieldValue.increment(1),
      currentStory: story,
      storyGeneratedAt: new Date().toISOString(),
    });

    console.log("💾 Story metadata saved to user document");

    // Return the story
    return success({
      story: story,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`❌ Error generating story: ${error.message}`);

    // Return appropriate error based on type
    if (error.message.includes("token") || error.message.includes("Unauthorized")) {
      return errorResponse("Authentication failed", 401);
    } else if (error.message.includes("OpenAI")) {
      return errorResponse(
        "AI story generation service temporarily unavailable",
        503
      );
    } else if (error.message.includes("personality data") || error.message.includes("assessments")) {
      return errorResponse(error.message, 400);
    } else {
      return errorResponse(`Failed to generate story: ${error.message}`, 500);
    }
  }
}
