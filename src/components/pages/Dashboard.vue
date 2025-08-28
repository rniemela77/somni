<template>
  <div>
    <!-- Landing Page -->
    <LandingPage v-if="!userStore.isAuthenticated" />

    <!-- Dashboard -->
    <div v-else class="container">
      <WelcomeCard v-if="totalCompletedAssessments === 0" />

      <h1 class="text-cinzel page-title">YOUR JOURNEY</h1>

      <!-- Progress Bar -->
      <ProgressBar :completedAssessments="totalCompletedAssessments"
        :totalAssessments="totalAssessments" class="mb-5"/>

      <!-- Next Assessment Section -->
      <div class="d-flex gap-4 flex-column flex-md-row">
        <NextAssessment v-if="nextAssessment" :assessment="nextAssessment" class="mb-md-4"/>
        
        <!-- AI Insights Section -->
        <InsightsCard class="mb-4"/>
      </div>

      <!-- Completed Assessments Section -->
      <CompletedAssessments v-if="completedAssessmentsWithScores.length > 0" :completedAssessmentsWithScores="completedAssessmentsWithScores" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../../stores/user';
import ProgressBar from '../dashboard/ProgressBar.vue';
import NextAssessment from '../dashboard/NextAssessment.vue';
import CompletedAssessments from '../dashboard/CompletedAssessments.vue';
import WelcomeCard from '../dashboard/WelcomeCard.vue';
import LandingPage from './LandingPage.vue';
import InsightsCard from '../dashboard/InsightsCard.vue';
import { useAssessmentProgress } from '../../composables/useAssessmentProgress';

const userStore = useUserStore();

const { nextAssessment, totalCompletedAssessments, totalAssessments, completedAssessmentsWithScores } = useAssessmentProgress();

</script>

<style scoped></style>
