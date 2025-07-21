<template>
  <div class="container">
    <h2 class="text-center mb-4">Select an Assessment</h2>

    <!-- Tips Section -->
    <div class="tips-section mb-5">
      <h3 class="h6 d-flex align-items-center mb-3">
        <i class="bi bi-lightbulb text-primary me-2"></i>
        Tips for Accurate Results
      </h3>
      <div class="row">
        <div class="col-md-6">
          <ul class="list-unstyled">
            <li class="mb-2 d-flex align-items-center">
              <i class="bi bi-check text-success me-2"></i>
              <span>Choose a time when your mood is neutral - avoid taking assessments on exceptionally good or bad days</span>
            </li>
            <li class="mb-2 d-flex align-items-center">
              <i class="bi bi-check text-success me-2"></i>
              <span>Find a quiet, distraction-free environment to focus on your responses</span>
            </li>
          </ul>
        </div>
        <div class="col-md-6">
          <ul class="list-unstyled">
            <li class="mb-2 d-flex align-items-center">
              <i class="bi bi-check text-success me-2"></i>
              <span>Answer based on your general tendencies, not just recent events</span>
            </li>
            <li class="mb-2 d-flex align-items-center">
              <i class="bi bi-check text-success me-2"></i>
              <span>Take your time - there's no rush to complete the assessment</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger text-center">
      <p>{{ error }}</p>
    </div>
    <div v-else-if="loading" class="alert alert-info text-center">
      <p>Loading assessments...</p>
    </div>
    <div v-else-if="availableQuizzes.length === 0" class="alert alert-warning text-center">
      <p>No assessments available.</p>
    </div>
    <div v-else class="row row-cols-1 row-cols-md-2 g-4">
      <div v-for="quiz in availableQuizzes" 
           :key="quiz.id" 
           class="col">
        <div class="card h-100">
          <div class="card-body">
            <h3 class="card-title">{{ quiz.title }}</h3>
            <p class="card-text">{{ quiz.questions?.length || 0 }} questions</p>
            
            <!-- Score Display -->
            <div v-if="getUserScore(quiz.id) !== null" class="mt-3 p-3 bg-light rounded">
              <div class="d-flex align-items-center gap-2">
                <span class="score-badge">{{ Math.round(getUserScore(quiz.id) || 0) }}</span>
                <span class="text-muted">
                  {{ getTraitIntensityTextSafe(getUserScore(quiz.id)) }}
                  <strong>{{ getDominantTraitSafe(getScaleById(quiz.id), getUserScore(quiz.id)) }}</strong>
                </span>
              </div>
            </div>
          </div>
          <div class="card-footer text-center p-0 border-0">
            <button 
              :class="[
                'btn w-100 rounded-3',
                getUserScore(quiz.id) !== null ? 'btn-link text-primary text-decoration-none' : 'btn-primary'
              ]"
              @click="$router.push({ name: 'quiz-detail', params: { id: quiz.id }})">
              <i class="bi bi-pencil-fill me-1"></i>
              {{ getUserScore(quiz.id) !== null ? 'Retake Assessment' : 'Begin Assessment' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useQuizStore } from '../stores/quiz';
import { useUserStore } from '../stores/user';
import { usePersonalityTraits } from '../composables/usePersonalityTraits';
import type { ExtendedPersonalityScale } from '../composables/usePersonalityTraits';

const quizStore = useQuizStore();
const userStore = useUserStore();
const loading = ref(false);
const error = ref<string | null>(null);
const availableQuizzes = computed(() => quizStore.availableQuizzes);

const {
  getTraitIntensityText,
  getDominantTrait,
  getScaleById
} = usePersonalityTraits();

const getUserScore = (quizId: string): number | null => {
  const attributes = userStore.userAttributes || {};
  return attributes[quizId] !== undefined ? attributes[quizId] : null;
};

// Helper function to safely get trait intensity text
const getTraitIntensityTextSafe = (score: number | null): string => {
  if (score === null) return '';
  return getTraitIntensityText(score);
};

// Helper function to safely get dominant trait
const getDominantTraitSafe = (scale: ExtendedPersonalityScale | undefined | null, score: number | null): string => {
  if (score === null || !scale) return '';
  const trait = getDominantTrait(scale, score);
  return trait || '';
};

onMounted(async () => {
  try {
    loading.value = true;
    error.value = null;

    // Since this is a protected route, we can assume user is authenticated
    if (!userStore.isAuthenticated) {
      console.log('[QuizList] User is not authenticated - this should not happen on protected route');
      error.value = 'Authentication required';
      return;
    }

    console.log('[QuizList] Loading quizzes...');
    await quizStore.loadQuizzes();
    console.log('[QuizList] Quizzes loaded:', quizStore.availableQuizzes.length);
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Failed to load quizzes';
    console.error('[QuizList] Error:', err);
  } finally {
    loading.value = false;
    console.log('[QuizList] Loading complete');
  }
});
</script>

<style scoped>
.tips-section {
  color: #666;
}

.tips-section h3 {
  color: #333;
  font-weight: 500;
}

.tips-section span {
  font-size: 0.9rem;
  line-height: 1.4;
}

.score-badge {
  background: #0d6efd;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-weight: bold;
  font-size: 0.9rem;
  min-width: 3rem;
  text-align: center;
  display: inline-block;
}
</style> 