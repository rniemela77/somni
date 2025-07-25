<template>
  <div class="assessment-view container">
    <button class="btn btn-outline-secondary mb-4" @click="goBack">
      <i class="bi bi-arrow-left me-2"></i>Back to Assessments
    </button>

    <!-- Tips Section -->
    <div class="tips-section mb-4">
      <h3 class="h6 d-flex mb-3">
        <i class="bi bi-lightbulb text-primary me-2"></i>
        Tips for Accurate Results
      </h3>

      <ul class="list-unstyled m-0">
        <li v-for="(tip, index) in tips" :key="index" class="d-flex mb-1">
          <i class="bi bi-check text-success me-2" style="height: 1.4rem; width: 1.4rem; font-size: 1.4rem; transform: translateY(-4px)"></i>
          <span>{{ tip }}</span>
        </li>
      </ul>
    </div>

    <div v-if="quizLoading" class="text-center">
      <h2 class="mb-3" style="text-align: left;">Loading assessment...</h2>
      <p class="skeleton-text-line"></p>
      <p class="skeleton-text-line"></p>
      <p class="skeleton-text-line mb-3"></p>

      <div class="skeleton-card"></div>
    </div>

    <div v-else-if="quizError" class="alert alert-danger">
      <p>{{ quizError }}</p>
      <button class="btn btn-outline-primary mt-2" @click="retryLoad">
        Try Again
      </button>
    </div>

    <div v-else-if="currentQuiz">
      <!-- Quiz questions -->
      <div>
        <h2 class="mb-3">{{ currentQuiz.title }}</h2>
        <p class="text-muted mb-4">{{ currentQuiz.description }}</p>

        <form @submit.prevent="submitAssessment">
          <Card v-for="(question, index) in currentQuiz.questions" padding="sm" :key="question.id" class="mb-4">
            <div>
              <p class="fw-bold">Question {{ index + 1 }}</p>
              <p class="mb-4">{{ question.text }}</p>
              <div class="slider-container">
                <div class="slider-labels d-flex justify-content-between mb-2">
                  <span>Almost Never</span>
                  <span>Sometimes</span>
                  <span>Almost Always</span>
                </div>
                <div class="slider-track position-relative">
                  <!-- Negative fill (from 0 to negative values) -->
                  <div class="slider-fill negative" :style="{
                    width: parseFloat(quizAnswers[question.id] || '0') < 0 ? (Math.abs(parseFloat(quizAnswers[question.id] || '0')) / 2) + '%' : '0%',
                    right: '50%'
                  }"></div>
                  <!-- Positive fill (from 0 to positive values) -->
                  <div class="slider-fill positive" :style="{
                    width: parseFloat(quizAnswers[question.id] || '0') > 0 ? (parseFloat(quizAnswers[question.id] || '0') / 2) + '%' : '0%',
                    left: '50%'
                  }"></div>
                  <input type="range" class="form-range" v-model="quizAnswers[question.id]" min="-100" max="100"
                    :disabled="isSubmittingQuiz" required />
                </div>
                <div class="slider-value text-center">
                  <div class="score-label">
                    <strong>{{ getScoreLabel(quizAnswers[question.id] || '0') }}</strong>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          <div class="d-flex justify-content-between gap-2 mt-4">
            <button type="button" class="btn btn-secondary" @click="goBack">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" :disabled="isSubmittingQuiz || !areAllQuestionsAnswered">
              {{ isSubmittingQuiz ? 'Submitting...' : 'Submit Assessment' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuizStore } from '../../stores/quiz';
import { useUserStore } from '../../stores/user';
import Card from '../ui/Card.vue';

const route = useRoute();
const router = useRouter();

const scaleId = computed(() => route.params.scaleId as string);
const quizStore = useQuizStore();
const userStore = useUserStore();

const currentQuiz = ref<any>(null);
const quizLoading = ref(false);
const quizError = ref<string | null>(null);
const quizAnswers = ref<Record<string, string>>({});
const isSubmittingQuiz = ref(false);
const assessmentSubmitted = ref(false);

const tips = ref([
  "Choose a time when your mood is neutral - avoid taking assessments on exceptionally good or bad days",
  "Find a quiet, distraction-free environment to focus on your responses",
  "Answer based on your general tendencies, not just recent events",
  "Take your time - there's no rush to complete the assessment"
]);

const areAllQuestionsAnswered = computed(() => {
  if (!currentQuiz.value?.questions) return false;
  return currentQuiz.value.questions.every((question: any) =>
    quizAnswers.value[question.id] !== undefined && quizAnswers.value[question.id] !== ''
  );
});

watch(scaleId, (newScaleId) => {
  if (newScaleId) {
    loadQuiz(newScaleId);
  }
});

onMounted(() => {
  console.log('Assessment mounted');
  loadQuiz(scaleId.value);
});

const loadQuiz = async (scaleId: string) => {
  quizLoading.value = true;
  quizError.value = null;
  try {
    const result = await quizStore.selectQuiz(scaleId);
    if (result.error) {
      quizError.value = result.error;
      return;
    }
    if (!quizStore.currentQuiz) {
      throw new Error('Quiz not found');
    }
    currentQuiz.value = quizStore.currentQuiz;
    quizAnswers.value = currentQuiz.value.questions.reduce((acc: Record<string, string>, q: any) => {
      acc[q.id] = "0";
      return acc;
    }, {});
  } catch (err) {
    quizError.value = "Failed to load assessment. Please try again.";
    console.error('Error loading quiz:', err);
  } finally {
    quizLoading.value = false;
  }
};

const resetState = () => {
  currentQuiz.value = null;
  quizError.value = null;
  assessmentSubmitted.value = false;
  quizAnswers.value = {};
};

const retryLoad = () => {
  if (scaleId.value) {
    loadQuiz(scaleId.value);
  }
};

const submitAssessment = async () => {
  if (!currentQuiz.value || !areAllQuestionsAnswered.value) return;
  isSubmittingQuiz.value = true;
  try {
    const { error: submitError } = await quizStore.submitQuiz(quizAnswers.value);
    if (submitError) {
      quizError.value = "Error submitting assessment. Please try again.";
      assessmentSubmitted.value = false;
    } else {
      assessmentSubmitted.value = true;
      await quizStore.loadUserResults();
      // Redirect to dashboard with showResult param
      router.push({ name: 'home', query: { showResult: currentQuiz.value.id } });
      return;
    }
  } catch (err) {
    quizError.value = err instanceof Error ? err.message : "An error occurred";
    assessmentSubmitted.value = false;
  } finally {
    isSubmittingQuiz.value = false;
  }
};

const goBack = () => {
  router.push({ name: 'home' });
};

const getScoreLabel = (score: string | number): string => {
  const numScore = parseFloat(score.toString());
  if (numScore >= 75) return "Almost Always";
  if (numScore >= 40) return "Frequently";
  if (numScore >= 10) return "Often";
  if (numScore >= -9) return "Sometimes";
  if (numScore >= -39) return "Seldom";
  if (numScore >= -74) return "Rarely";
  return "Almost Never";
};
</script>

<style scoped>
/* Quiz slider styles */
.slider-container {
  padding: 1.5rem 0;
  position: relative;
}

.slider-track {
  height: 32px;
  background: var(--card-inset-bg-color);
  border-radius: 16px;
  position: relative;
  margin: 0.5rem 0 1rem;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}

.slider-fill {
  height: 100%;
  background: var(--primary-color);
  position: absolute;
  top: 0;
  transition: width 0.3s ease;
  border-radius: 16px;
}

.slider-fill.negative {
  background: var(--primary-color);
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  /* border-top-left-radius: 0!important; */
  /* border-bottom-left-radius: 0!important; */
}

.slider-fill.positive {
  background: var(--primary-color);
  border-radius: 16px;
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}

.form-range {
  width: 100%;
  height: 32px;
  padding: 0;
  margin: 0;
  background-color: transparent;
  appearance: none;
  cursor: pointer;
  position: relative;
  z-index: 1;
}

.form-range:focus {
  outline: none;
}

/* Shared thumb styles through CSS variables */
.form-range {
  --thumb-width: 32px;
  --thumb-height: 32px;
  --thumb-radius: 16px;
  --thumb-bg: white;
  --thumb-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

/* WebKit (Chrome, Safari, Edge) */
.form-range::-webkit-slider-thumb {
  appearance: none;
  width: var(--thumb-width);
  height: var(--thumb-height);
  border-radius: var(--thumb-radius);
  background: var(--thumb-bg);
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0;
  box-shadow: var(--thumb-shadow);
  border: none;
  position: relative;
  z-index: 2;
}

.form-range::-webkit-slider-runnable-track {
  width: 100%;
  height: 32px;
  background: transparent;
  border-radius: 16px;
  cursor: pointer;
}

/* Firefox */
.form-range::-moz-range-thumb {
  width: var(--thumb-width);
  height: var(--thumb-height);
  border-radius: var(--thumb-radius);
  background: var(--thumb-bg);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--thumb-shadow);
  border: none;
  position: relative;
  z-index: 2;
}

.form-range::-moz-range-track {
  width: 100%;
  height: 32px;
  background: transparent;
  border-radius: 16px;
  cursor: pointer;
}

/* Hover and active states for both browsers */
.form-range::-webkit-slider-thumb:hover,
.form-range::-moz-range-thumb:hover {
  transform: scale(1.05);
}

.form-range::-webkit-slider-thumb:active,
.form-range::-moz-range-thumb:active {
  transform: scale(0.98);
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  color: var(--body-text-color);
  font-size: 0.875rem;
  font-weight: 500;
}

.slider-labels span {
  position: relative;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  background: var(--card-inset-bg-color);
  transition: all 0.2s ease;
}

.slider-value {
  position: relative;
  top: auto;
  left: auto;
  transform: none;
  background: transparent;
  color: inherit;
  padding: 0;
  border-radius: 0;
  font-size: 0.875rem;
  font-weight: 500;
  opacity: 1;
  transition: all 0.2s ease;
  pointer-events: auto;
}

.form-range:hover+.slider-value,
.form-range:focus+.slider-value {
  opacity: 1;
  top: auto;
}

.slider-container::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 2px;
  height: 32px;
  background-color: rgba(0, 0, 0, 0.1);
  pointer-events: none;
}

.score-label {
  color: var(--text-primary);
  font-size: 1.1rem;
  font-weight: 100;
  font-style: italic;
}

.success-icon {
  color: #28a745;
}

.tips-section {
  color: var(--body-text-color);
  background: var(--card-inset-bg-color);
  border-radius: 8px;
  padding: 1rem;
}

.tips-section h3 {
  color: var(--body-text-color);
  font-weight: 800;
  font-size: 1.2rem;
}

.tips-section span {
  font-size: 0.9rem;
  line-height: 1.4;
}
</style>