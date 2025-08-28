import { computed } from 'vue';
import { useUserStore } from '../stores/user';
import { useAssessmentProgress } from './useAssessmentProgress';
import { REVELATION_MILESTONES } from '../../shared/config/personalityAnalysis';


export const useRevelations = () => {
  const userStore = useUserStore();
  const { totalCompletedAssessments } = useAssessmentProgress();

  // Get the destination for the "Continue" button based on current progress
  const getContinueButtonDestination = () => {
    const completed = totalCompletedAssessments.value;
    
    // Find the milestone that should unlock at the current assessment count
    const currentMilestone = REVELATION_MILESTONES.find(config => config.requiredAssessments === completed);
    if (currentMilestone) {
      return { name: 'revelation', params: { revelationSlug: currentMilestone.slug } };
    }

    // Default: go to dashboard
    return { name: 'home' };
  };

  // Get revelation content from user's personality analysis
  const getRevelationContent = (revelationKey: string) => {
    if (!userStore.user?.personalityAnalysis) return null;
    
    const key = revelationKey as keyof typeof userStore.user.personalityAnalysis;
    return userStore.user.personalityAnalysis[key];
  };

  // Get revelation configuration by slug (for routing)
  const getRevelationBySlug = (revelationSlug: string) => {
    return REVELATION_MILESTONES.find(config => config.slug === revelationSlug) || null;
  };

  return {
    getContinueButtonDestination,
    getRevelationContent,
    getRevelationBySlug,
    totalCompletedAssessments: totalCompletedAssessments
  };
};
