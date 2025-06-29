import personalityData from '../../data/personalityData';

export function usePersonalityTraits() {
  const getTraitIntensityText = (score) => {
    const absScore = Math.abs(score);
    if (absScore <= 20) return 'slightly leans towards';
    if (absScore <= 50) return 'moderately expresses';
    if (absScore <= 80) return 'strongly expresses';
    return 'very strongly expresses';
  };

  const getScoreForScale = (scale, scores) => {
    return scores[scale.id] || 0;
  };

  const getDominantTrait = (scale, score) => {
    if (!scale) return null;
    return score > 0 ? scale.positive : scale.negative;
  };

  const getTraitDescription = (scale, type) => {
    if (!scale) return '';
    return scale.traitDescriptions?.[type] || '';
  };

  const calculatePosition = (score) => {
    return ((score + 100) / 2);
  };

  const getScaleById = (scaleId) => {
    return personalityData.find(scale => scale.id === scaleId);
  };

  const getAllScales = () => {
    return personalityData;
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