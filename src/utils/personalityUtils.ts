import personalityData from '../../data/personalityData';
import { PersonalityAttributes } from '../../shared/types/shared';

/**
 * Format personality attributes into a readable string
 */
export const formatPersonalityAttributes = (attributes: PersonalityAttributes): string => {
  let formatted = '';

  // Sort attributes by absolute value in descending order
  const sortedEntries = Object.entries(attributes).sort(([, a], [, b]) => {
    return Math.abs(b) - Math.abs(a);
  });

  sortedEntries.forEach(([key, value]) => {
    const scale = personalityData.find(
      (scale) => scale.id === key.toLowerCase().replace(/-/g, "_")
    );
    if (scale) {
      formatted += `- ${scale.positive} vs. ${scale.negative}: ${value} `;

      const absValue = Math.abs(value);
      let intensity = "";
      if (absValue >= 80) intensity = "extremely";
      else if (absValue >= 60) intensity = "strongly";
      else if (absValue >= 40) intensity = "moderately";
      else if (absValue >= 20) intensity = "somewhat";
      else if (absValue > 0) intensity = "slightly";
      else intensity = "";

      if (value < 0) {
        formatted += `(${intensity} more ${scale.negative})`;
      } else if (value > 0) {
        formatted += `(${intensity} more ${scale.positive})`;
      } else {
        formatted += "(perfectly balanced)";
      }
      formatted += "\n";
    }
  });

  return formatted;
}; 