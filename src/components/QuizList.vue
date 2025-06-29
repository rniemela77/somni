<template>
  <div class="container">
    <h2 class="text-center mb-4">Select a Quiz</h2>

    <!-- Tips Section -->
    <div class="tips-section mb-5">
      <h3 class="h6 d-flex align-items-center mb-3">
        <i class="bi bi-lightbulb text-primary me-2"></i>
        Tips for Accurate Results
      </h3>
      <div class="row">
        <div class="col-md-6">
          <ul class="list-unstyled">
            <li class="mb-2 d-flex align-items-start">
              <i class="bi bi-check text-success me-2"></i>
              <span>Choose a time when your mood is neutral - avoid taking quizzes on exceptionally good or bad days</span>
            </li>
            <li class="mb-2 d-flex align-items-start">
              <i class="bi bi-check text-success me-2"></i>
              <span>Find a quiet, distraction-free environment to focus on your responses</span>
            </li>
          </ul>
        </div>
        <div class="col-md-6">
          <ul class="list-unstyled">
            <li class="mb-2 d-flex align-items-start">
              <i class="bi bi-check text-success me-2"></i>
              <span>Answer based on your general tendencies, not just recent events</span>
            </li>
            <li class="mb-2 d-flex align-items-start">
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
      <p>Loading quizzes...</p>
    </div>
    <div v-else-if="availableQuizzes.length === 0" class="alert alert-warning text-center">
      <p>No quizzes available.</p>
    </div>
    <div v-else class="row row-cols-1 row-cols-md-2 g-4">
      <div v-for="quiz in availableQuizzes" 
           :key="quiz.id" 
           class="col">
        <div class="card h-100">
          <div class="card-body">
            <h3 class="card-title">{{ quiz.title }}</h3>
            <p class="card-text">{{ quiz.description }}</p>
            
            <!-- Score Display -->
            <div v-if="getUserScore(quiz.id) !== null" class="mt-3 p-3 bg-light rounded">
              <div class="d-flex align-items-center gap-2">
                <span class="score-badge">{{ Math.round(getUserScore(quiz.id)) }}</span>
                <span class="text-muted">
                  {{ getTraitIntensityText(getUserScore(quiz.id)) }}
                  <strong>{{ getDominantTrait(getScaleById(quiz.id), getUserScore(quiz.id)) }}</strong>
                </span>
              </div>
            </div>
          </div>
          <div class="card-footer text-center">
            <button 
              :class="[
                'btn w-100',
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

<script>
import { computed, onMounted, ref } from 'vue';
import { useQuizStore } from '../stores/quiz';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { usePersonalityTraits } from '../composables/usePersonalityTraits';

export default {
  name: 'QuizList',
  setup() {
    const router = useRouter();
    const quizStore = useQuizStore();
    const authStore = useAuthStore();
    const loading = ref(false);
    const error = ref(null);
    const availableQuizzes = computed(() => quizStore.availableQuizzes);

    const {
      getTraitIntensityText,
      getDominantTrait,
      getScaleById
    } = usePersonalityTraits();

    const getUserScore = (quizId) => {
      const attributes = authStore.userAttributes || {};
      return attributes[quizId] !== undefined ? attributes[quizId] : null;
    };

    onMounted(async () => {
      try {
        loading.value = true;
        error.value = null;

        // Wait for auth to be ready
        if (authStore.loading) {
          console.log('[QuizList] Auth is loading, waiting...');
          await new Promise(resolve => {
            const unsubscribe = authStore.$subscribe((mutation, state) => {
              console.log('[QuizList] Auth state changed:', {
                loading: state.loading,
                isAuthenticated: state.isAuthenticated
              });
              if (!state.loading) {
                unsubscribe();
                resolve();
              }
            });
          });
        }

        if (!authStore.isAuthenticated) {
          console.log('[QuizList] User is not authenticated');
          error.value = 'Please sign in to view quizzes';
          return;
        }

        console.log('[QuizList] Auth ready, loading quizzes...');
        await quizStore.loadQuizzes();
        console.log('[QuizList] Quizzes loaded:', quizStore.availableQuizzes.length);
      } catch (err) {
        error.value = err.message || 'Failed to load quizzes';
        console.error('[QuizList] Error:', err);
      } finally {
        loading.value = false;
        console.log('[QuizList] Loading complete');
      }
    });

    return {
      availableQuizzes,
      loading,
      error,
      getUserScore,
      getTraitIntensityText,
      getDominantTrait,
      getScaleById
    };
  }
};
</script>

<style scoped>
.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.tips-section {
  color: #666;
}

.tips-section h3 {
  color: #333;
  font-weight: 500;
}

.tips-section i {
  font-size: 0.9rem;
}

.tips-section span {
  font-size: 0.9rem;
  line-height: 1.4;
}

.score-badge {
  background: rgba(13, 110, 253, 0.1);
  color: #0d6efd;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-weight: bold;
}

.bg-light {
  background-color: rgba(13, 110, 253, 0.05) !important;
}
</style> 