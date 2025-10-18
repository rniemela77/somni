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

      <!-- Cards Section -->
      <div class="row g-4">
        <div class="col-12 col-md-5">
          <!-- Personality Role Section -->
          <PersonalityRoleCard/>
        </div>
        
        <div class="col-12 col-md-7">
          <!-- Right side cards wrapper -->
          <div class="right-cards-wrapper d-flex flex-column gap-4 h-100">
            <NextAssessment v-if="nextAssessment" :assessment="nextAssessment"/>
            <InsightsCard/>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../../stores/user';
import ProgressBar from '../dashboard/ProgressBar.vue';
import NextAssessment from '../dashboard/NextAssessment.vue';
import WelcomeCard from '../dashboard/WelcomeCard.vue';
import LandingPage from './LandingPage.vue';
import InsightsCard from '../dashboard/InsightsCard.vue';
import PersonalityRoleCard from '../dashboard/PersonalityRoleCard.vue';
import { useAssessmentProgress } from '../../composables/useAssessmentProgress';

const userStore = useUserStore();

const { nextAssessment, totalCompletedAssessments, totalAssessments } = useAssessmentProgress();

</script>

<style scoped>
.right-cards-wrapper {
  min-height: 100%;
}

/* Ensure cards in the right wrapper have equal height on larger screens */
@media (min-width: 992px) {
  .right-cards-wrapper {
    height: 100%;
  }
  
  .right-cards-wrapper > * {
    flex: 1;
  }
}
</style>
