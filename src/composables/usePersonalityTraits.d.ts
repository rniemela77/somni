import type { PersonalityScale } from '../config/personalityAnalysis';

export interface TraitDescriptions {
  positive?: string;
  negative?: string;
  [key: string]: string | undefined;
}

export interface ExtendedPersonalityScale extends PersonalityScale {
  traitDescriptions?: TraitDescriptions;
  questions?: Array<any>; // Replace 'any' with proper Question interface if available
}

export interface PersonalityTraitsComposable {
  getTraitIntensityText: (score: number) => string;
  getScoreForScale: (scale: ExtendedPersonalityScale, scores: Record<string, number>) => number;
  getDominantTrait: (scale: ExtendedPersonalityScale | null, score: number) => string | null;
  getTraitDescription: (scale: ExtendedPersonalityScale | null, type: string) => string;
  calculatePosition: (score: number) => number;
  getScaleById: (scaleId: string) => ExtendedPersonalityScale | undefined;
  getAllScales: () => ExtendedPersonalityScale[];
}

export function usePersonalityTraits(): PersonalityTraitsComposable; 