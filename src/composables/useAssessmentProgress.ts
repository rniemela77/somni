import { computed } from "vue";
import { useUserStore } from "../stores/user";
import { useAssessmentStore } from "../stores/assessment";
import {
  Assessment,
  AssessmentTrait,
  AssessmentWithScore,
} from "../../shared/types/shared";

export const useAssessmentProgress = () => {
  const userStore = useUserStore();
  const assessmentStore = useAssessmentStore();

  const userProfileAssessmentScores = computed(
    () => userStore.user?.assessmentScores
  );

  const nextAssessment = computed(() => {
    return assessmentStore.allAssessments.find(
      (assessment) =>
        !Object.keys(userProfileAssessmentScores.value || {}).includes(
          assessment.id
        )
    );
  });

  const completedAssessments = computed(() => {
    return assessmentStore.allAssessments.filter((assessment) =>
      Object.keys(userProfileAssessmentScores.value || {}).includes(assessment.id)
    );
  });

  const totalCompletedAssessments = computed(() => {
    if (!userProfileAssessmentScores.value) return 0;
    return Object.keys(userProfileAssessmentScores.value).length;
  });

  const totalAssessments = computed(() => {
    return assessmentStore.allAssessments.length;
  });

  const completedAssessmentsWithScores = computed(() => {
    return completedAssessments.value.map((assessment) => ({
      ...assessment,
      score: userProfileAssessmentScores.value?.[assessment.id] ?? 0,
    }));
  });

  const isInsightsUnlocked = computed(() => {
    return totalCompletedAssessments.value >= 3;
  });

  const assessmentsUntilInsights = computed(() => {
    return 3 - totalCompletedAssessments.value;
  });

  const getAssessmentFromSlug = (slug: string): Assessment => {
    return assessmentStore.allAssessments.find(
      (assessment) => assessment.slug === slug
    ) as Assessment;
  };

  const getAssessmentWithScore = (
    assessment: Assessment
  ): AssessmentWithScore => {
    return {
      ...assessment,
      score: userProfileAssessmentScores.value?.[assessment.id] ?? 0,
    };
  };

  const getTraitIntensityText = (score: number): string => {
    const absScore = Math.abs(score);
    if (absScore <= 20) return "slightly leans towards";
    if (absScore <= 50) return "moderately expresses";
    if (absScore <= 80) return "strongly expresses";
    return "very strongly expresses";
  };

  const getDominantTrait = (
    assessment: AssessmentWithScore
  ): AssessmentTrait => {
    return assessment.score < 0
      ? assessment.traits.negative
      : assessment.traits.positive;
  };

  const getWeakerTrait = (
    assessment: AssessmentWithScore
  ): AssessmentTrait => {
    return assessment.score < 0
      ? assessment.traits.negative
      : assessment.traits.positive;
  };

  const calculatePosition = (score: number): number => {
    return (score + 100) / 2;
  };

  return {
    userProfileAssessmentScores,
    nextAssessment,
    completedAssessments,
    totalCompletedAssessments,
    totalAssessments,
    completedAssessmentsWithScores,
    isInsightsUnlocked,
    assessmentsUntilInsights,
    getAssessmentFromSlug,
    getAssessmentWithScore,
    getTraitIntensityText,
    getDominantTrait,
    getWeakerTrait,
    calculatePosition,
  };
};
