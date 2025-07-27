/**
 * Centralized configuration for API call limits
 * This ensures consistency across frontend and backend
 */

export const API_LIMITS = {
  FREE_OPENAI_CALLS_LIMIT: 10,
  PAID_OPENAI_CALLS_LIMIT: 30,
} as const;

/**
 * Get the appropriate call limit based on user's paid status
 */
export const getCallLimit = (isPaid: boolean): number => {
  return isPaid ? API_LIMITS.PAID_OPENAI_CALLS_LIMIT : API_LIMITS.FREE_OPENAI_CALLS_LIMIT;
};

export default API_LIMITS; 