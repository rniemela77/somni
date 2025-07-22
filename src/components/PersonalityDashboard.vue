<template>
  <div>
    <h2 class="text-center mb-4">Personality Overview</h2>

    <!-- No assessments message -->
    <div v-if="userStore.noQuizzesCompleted" class="alert alert-warning mb-4 text-center">
      <h4>No Overview Available</h4>
      <p>Complete personality assessments to see your overview here.</p>
      <router-link to="/quiz" class="btn btn-primary btn-lg">Take Your First Assessment</router-link>
    </div>

    <!-- Main overview content -->
    <div v-else>
      <!-- Missing assessments warning -->
      <div v-if="userStore.hasIncompleteQuizzes" class="alert alert-info text-center mb-4">
        <strong>Overview in Progress</strong><br>
        You've completed {{ userStore.completedQuizzesCount }} of {{ userStore.totalQuizzesCount }} assessments.
        <router-link to="/quiz">Complete remaining assessments</router-link> for your complete overview.
      </div>

      <!-- Personality Scales Section -->
      <div class="results-section">
        <h3 class="section-title">Your Personality Dimensions</h3>
        <PersonalityScales :scores="userStore.userAttributes" />
      </div>

      <!-- Call-to-action for insights -->
      <div class="text-center mt-5">
        <div class="card bg-light">
          <div class="card-body">
            <h4 class="card-title">Ready for AI Insights?</h4>
            <p class="card-text text-muted">Get comprehensive AI analysis of what your overview means.</p>
            <router-link to="/insights" class="btn btn-primary">View AI Insights</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PersonalityScales from './PersonalityScales.vue';
import { useUserStore } from '../stores/user';

const userStore = useUserStore();
</script>

<style scoped>
.results-section {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.section-title {
  color: #2d3748;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
}
</style>