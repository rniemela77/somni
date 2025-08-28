import {
  success,
  error as errorResponse,
  handleOptions,
} from "./utils/response.js";
import {
  authenticateUser,
  callOpenAI,
  validateUserAttributes,
} from "./utils/openai.js";
import { FieldValue } from "firebase-admin/firestore";
import { formatPersonalityAttributes } from "../../src/utils/personalityUtils.js";

/**
 * Generate a personalized story based on personality data
 */
const generateStoryPrompt = (attributes) => {
  let prompt = "Given the user personality profile below: \n\n";

  // Add the attribute scores in a formatted way
  prompt += formatPersonalityAttributes(attributes);

  prompt += `\n\nWrite a single narrative about an animal whose temperament, choices, and environment subtly reflect those dominant traits without naming them. The story must:

1. Introduce a specific animal species and individual as the protagonist.  
2. Present a realistic, meaningful obstacle or challenge.  
3. Demonstrate how the dominant traits directly informs the animal's decisions, actions, and problem-solving strategies.  
4. Highlight the constructive advantages of traits that are often undervalued or misjudged (for example, showing how introversion can foster insight).  
5. Maintain a mature, non-judgmental tone—avoid childlike language, overt moralizing, or bias.  
6. Conclude with a positive resolution that feels earned and uplifting.
7. Use clear, straightforward language accessible to a broad adult audience at a Grade 8-10 reading level.
8. Do not use fairy-tale clichés (no “Once upon a time”).

Length: Roughly 300 words.  
Output: Title followed immediately by the story text. Do not include any commentary or trait analysis—only the narrative itself.`;

  return prompt;
};

/**
 * Netlify function to generate personalized story
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
    // Authenticate user and get user data
    const { userRef, userData } = await authenticateUser(event);
    const userAttributes = userData.attributes || {};

    // Validate that user has completed some assessments
    validateUserAttributes(userAttributes);

    // Generate the story prompt
    const prompt = generateStoryPrompt(userAttributes);

    // Call OpenAI API
    const story = await callOpenAI(prompt, {
      model: "gpt-5",
      max_output_tokens: 800,
    });

    if (!story) {
      throw new Error("No story generated from OpenAI");
    }

    // Save the story to Firestore
    await userRef.update({
      stories: [
        ...userRef.data()?.stories,
        {
          lastStoryGenerated: FieldValue.serverTimestamp(),
          storyCount: FieldValue.increment(1),
          currentStory: story,
          storyGeneratedAt: new Date().toISOString(),
        },
      ],
    });

    // Return the story
    return success({
      story: story,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`❌ Error generating story: ${error.message}`);

    // Return appropriate error based on type
    if (
      error.message.includes("token") ||
      error.message.includes("Unauthorized")
    ) {
      return errorResponse("Authentication failed", 401);
    } else if (error.message.includes("OpenAI")) {
      return errorResponse(
        "AI story generation service temporarily unavailable",
        503
      );
    } else if (
      error.message.includes("personality data") ||
      error.message.includes("assessments")
    ) {
      return errorResponse(error.message, 400);
    } else {
      return errorResponse(`Failed to generate story: ${error.message}`, 500);
    }
  }
}
