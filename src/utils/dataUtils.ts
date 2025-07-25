/**
 * Shared utilities for data management across stores
 */

export interface StalenessConfig {
  maxAgeMs: number;
  lastFetch: number | null;
}

/**
 * Check if data is stale based on last fetch time and max age
 */
export function isDataStale(config: StalenessConfig): boolean {
  if (!config.lastFetch) return true;
  return Date.now() - config.lastFetch > config.maxAgeMs;
}

/**
 * Default staleness configurations
 */
export const STALENESS_CONFIGS = {
  QUIZ_DATA: { maxAgeMs: 5 * 60 * 1000 }, // 5 minutes
  USER_DATA: { maxAgeMs: 10 * 60 * 1000 }, // 10 minutes
  PERSONALITY_ANALYSIS: { maxAgeMs: 30 * 60 * 1000 }, // 30 minutes
} as const; 