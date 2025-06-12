export interface PersonalitySection {
  title: string;
  description: string;
  prompts: string[];
}

export const PERSONALITY_ANALYSIS_SECTIONS: Record<string, PersonalitySection>;

export function generateAnalysisPrompt(formattedResults: string): string; 