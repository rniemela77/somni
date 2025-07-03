import personalityData from '../../data/personalityData';
import { PersonalityScale } from '../config/personalityAnalysis';

interface PersonalityScores {
  [key: string]: number;
}

interface TraitDescriptions {
  positive?: string;
  negative?: string;
  [key: string]: string | undefined;
}

// Extend PersonalityScale to include optional traitDescriptions and questions
interface ExtendedPersonalityScale extends PersonalityScale {
  traitDescriptions?: TraitDescriptions;
  questions?: Array<any>; // Replace 'any' with proper Question interface if available
}

export function usePersonalityTraits() {
  const getTraitIntensityText = (score: number): string => {
    const absScore = Math.abs(score);
    if (absScore <= 20) return 'slightly leans towards';
    if (absScore <= 50) return 'moderately expresses';
    if (absScore <= 80) return 'strongly expresses';
    return 'very strongly expresses';
  };

  const getScoreForScale = (scale: ExtendedPersonalityScale, scores: PersonalityScores): number => {
    return scores[scale.id] || 0;
  };

  const getDominantTrait = (scale: ExtendedPersonalityScale | null, score: number): string | null => {
    if (!scale) return null;
    return score > 0 ? scale.positive : scale.negative;
  };

  const getTraitDescription = (scale: ExtendedPersonalityScale | null, type: string): string => {
    if (!scale) return '';
    return scale.traitDescriptions?.[type] || '';
  };

  const calculatePosition = (score: number): number => {
    return ((score + 100) / 2);
  };

  const getScaleById = (scaleId: string): ExtendedPersonalityScale | undefined => {
    return personalityData.find(scale => scale.id === scaleId);
  };

  const getAllScales = (): ExtendedPersonalityScale[] => {
    return personalityData.filter(scale => scale.questions && scale.questions.length > 0);
  };

  return {
    getTraitIntensityText,
    getScoreForScale,
    getDominantTrait,
    getTraitDescription,
    calculatePosition,
    getScaleById,
    getAllScales
  };
} 