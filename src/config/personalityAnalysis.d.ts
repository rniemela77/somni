export interface PersonalitySection {
  id: string;
  title: string;
  description: string;
  promptInstructions: string;
  display: {
    order: number;
  };
}

export const PERSONALITY_ANALYSIS_SECTIONS: Record<string, PersonalitySection>;

export function generateAnalysisPrompt(formattedResults: string): string; 