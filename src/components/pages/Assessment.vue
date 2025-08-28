<template>
  <div class="assessment-view container">
    <button class="btn btn-outline-secondary mb-4" @click="goBack">
      <i class="bi bi-arrow-left me-2"></i>Back
    </button>

    <!-- Tips Section -->
    <div class="tips-section mb-4">
      <h3 class="h6 d-flex mb-3">
        <i class="bi bi-lightbulb text-primary me-2"></i>
        Tips for Accurate Results
      </h3>

      <ul class="list-unstyled m-0">
        <li v-for="(tip, index) in tips" :key="index" class="d-flex mb-1">
          <i class="bi bi-check text-success me-2"
            style="height: 1.4rem; width: 1.4rem; font-size: 1.4rem; transform: translateY(-4px)"></i>
          <span>{{ tip }}</span>
        </li>
      </ul>
    </div>

    <!-- Assessment questions -->
    <div v-if="currentAssessment">
      <h2 class="mb-3">{{ currentAssessment.title }}</h2>
      <p class="text-muted mb-4">{{ currentAssessment.description }}</p>

      <form @submit.prevent="submitAssessment">
        <Card v-for="(question, index) in currentAssessment.questions" padding="sm" :key="question.id" class="mb-4">
          <div>
            <p class="fw-bold">Question {{ index + 1 }}</p>
            <p class="mb-4">{{ question.text }}</p>

            <div class="slider-value text-center">
              <div class="score-label">
                <strong>{{ getScoreLabel(assessmentAnswers[question.id] || '0') }}</strong>
              </div>
            </div>

            <div class="slider-container">
              <div class="slider-labels d-flex justify-content-between mb-2">
                <span>Almost Never</span>
                <span>Sometimes</span>
                <span>Almost Always</span>
              </div>
              <div class="slider-track position-relative">
                <!-- Negative fill (from 0 to negative values) -->
                <div class="slider-fill negative" :style="{
                  width: parseFloat(assessmentAnswers[question.id] || '0') < 0 ? (Math.abs(parseFloat(assessmentAnswers[question.id] || '0')) / 2) + '%' : '0%',
                  right: '50%'
                }"></div>
                <!-- Positive fill (from 0 to positive values) -->
                <div class="slider-fill positive" :style="{
                  width: parseFloat(assessmentAnswers[question.id] || '0') > 0 ? (parseFloat(assessmentAnswers[question.id] || '0') / 2) + '%' : '0%',
                  left: '50%'
                }"></div>
                <input type="range" class="form-range" v-model="assessmentAnswers[question.id]" min="-100" max="100"
                  :disabled="isSubmittingAssessment" required />
              </div>
            </div>
          </div>
        </Card>
        <div class="d-flex justify-content-between gap-2 mt-4">
          <button type="button" class="btn btn-secondary" @click="goBack">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary" :disabled="isSubmittingAssessment">
            {{ isSubmittingAssessment ? 'Completing...' : 'Complete Quest' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAssessmentStore } from '../../stores/assessment';
import { useUserStore } from '../../stores/user';
import Card from '../ui/Card.vue';

const route = useRoute();
const router = useRouter();

const assessmentSlug = route.params.assessmentSlug;
const assessmentStore = useAssessmentStore();
const userStore = useUserStore();

const currentAssessment = assessmentStore.allAssessments.find(assessment => assessment.slug === assessmentSlug);
// create '0' for each question in the assessment
const assessmentAnswers = ref<Record<string, string>>(
  Object.fromEntries(
    currentAssessment?.questions.map(question => [question.id, '0']) || []
  )
);

const isSubmittingAssessment = ref(false);

const tips = ref([
  "Choose a time when your mood is neutral - avoid taking assessments on exceptionally good or bad days",
  "Find a quiet, distraction-free environment to focus on your responses",
  "Answer based on your general tendencies, not just recent events",
  "Take your time - there's no rush to complete the assessment"
]);

const submitAssessment = async () => {
  if (!currentAssessment) return;
    
  // average score answers. multiply each score by the points value
  let assessmentScore = 0;
  Object.values(assessmentAnswers.value).forEach((answer, index) => {
    assessmentScore += Number(answer) * currentAssessment.questions[index].points;
  });
  assessmentScore = Math.round(assessmentScore / Object.values(assessmentAnswers.value).length);

  //submit to user store
  await userStore.submitAssessment(currentAssessment.id , assessmentScore);
  router.push({ name: 'assessment-result' });
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
/* Assessment slider styles */
.slider-container {
  padding: 1.5rem 0;
  position: relative;
}

.slider-track {
  height: 3rem;
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
  background: linear-gradient(to right, var(--primary-color) 50%, transparent);
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.slider-fill.positive {
  background: linear-gradient(to left, var(--primary-color) 50%, transparent);
  border-radius: 16px;
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}

.form-range {
  width: 100%;
  height: 3rem;
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
  --thumb-width: 3rem;
  --thumb-height: 3rem;
  --thumb-radius: 50%;
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
  height: 3rem;
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