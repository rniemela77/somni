<template>
  <div>
    <!-- Landing Page -->
    <LandingPage v-if="!userStore.isAuthenticated" />

    <!-- Dashboard -->
    <div v-else class="container">
      <WelcomeCard v-if="!userStore.completedQuizzesCount" />

      <!-- Assessment Result -->
      <AssessmentResult v-if="route.query.showResult" class="mb-4"/>

      <!-- Progress Bar -->
      <ProgressBar :completedAssessments="userStore.completedQuizzesCount"
        :totalAssessments="userStore.totalQuizzesCount" class="mb-4"/>

      <!-- Next Assessment Section -->
      <NextAssessment v-if="firstIncompleteAssessment" :scale="firstIncompleteAssessment" class="mb-4"/>

      <!-- AI Insights Section -->
      <InsightsCard class="mb-4"/>

      <!-- Completed Assessments Section -->
      <CompletedAssessments :scores="userStore.userAttributes" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../../stores/user';
import ProgressBar from '../dashboard/ProgressBar.vue';
import NextAssessment from '../dashboard/NextAssessment.vue';
import CompletedAssessments from '../dashboard/CompletedAssessments.vue';
import AssessmentResult from '../dashboard/AssessmentResult.vue';
import WelcomeCard from '../dashboard/WelcomeCard.vue';
import LandingPage from './LandingPage.vue';
import { useRoute } from 'vue-router';
import { useNextAssessment } from '../../composables/useNextAssessment';
import InsightsCard from '../dashboard/InsightsCard.vue';

const userStore = useUserStore();
const { firstIncompleteAssessment } = useNextAssessment();
const route = useRoute();
</script>

<style scoped></style>
