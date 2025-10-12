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
            
            <!-- Statement Pair Display -->
            <div class="statement-pair mb-4">
              <div class="statement-container d-flex justify-content-between">
                <div class="statement statement-left" :class="{ 'statement--active': parseFloat(assessmentAnswers[question.id] || '0') < 0 }">
                  <p class="statement-text">{{ getStatementA(question) }}</p>
                </div>
                <div class="statement statement-right" :class="{ 'statement--active': parseFloat(assessmentAnswers[question.id] || '0') > 0 }">
                  <p class="statement-text">{{ getStatementB(question) }}</p>
                </div>
              </div>
            </div>

            <div class="slider-container">
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

// Randomize statement positions for each question
const randomizedQuestions = ref<Record<string, { statementA: string; statementB: string; isReversed: boolean }>>({});

// Initialize randomization
if (currentAssessment) {
  currentAssessment.questions.forEach(question => {
    const isReversed = Math.random() < 0.5;
    randomizedQuestions.value[question.id] = {
      statementA: isReversed ? question.statementB : question.statementA,
      statementB: isReversed ? question.statementA : question.statementB,
      isReversed
    };
  });
}

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

const getStatementA = (question: any) => {
  return randomizedQuestions.value[question.id]?.statementA || question.statementA;
};

const getStatementB = (question: any) => {
  return randomizedQuestions.value[question.id]?.statementB || question.statementB;
};

const submitAssessment = async () => {
  if (!currentAssessment) return;
    
  // Calculate score based on randomized positioning
  let assessmentScore = 0;
  currentAssessment.questions.forEach((question, index) => {
    const answer = parseFloat(assessmentAnswers.value[question.id] || '0');
    const randomized = randomizedQuestions.value[question.id];
    
    // If statements were reversed, flip the score
    const adjustedAnswer = randomized?.isReversed ? -answer : answer;
    assessmentScore += adjustedAnswer * question.points;
  });
  assessmentScore = Math.round(assessmentScore / currentAssessment.questions.length);

  //submit to user store
  await userStore.submitAssessment(currentAssessment.id , assessmentScore);
  router.push({ name: 'assessment-result' });
};

const goBack = () => {
  router.push({ name: 'home' });
};

</script>

<style scoped>
/* Statement pair styles */
.statement-pair {
  margin: 1.5rem 0;
}

.statement-container {
  align-items: flex-start;
  gap: 1rem;
}

.statement {
  width: 400px;
  padding: 1rem;
  border-radius: 8px;
  background: var(--card-inset-bg-color);
  border: 2px solid transparent;
  transition: all 0.3s ease;
  min-height: 80px;
  display: flex;
  align-items: center;
}

.statement--active {
  border-color: var(--primary-color);
  background: rgba(var(--primary-color), 0.1);
  box-shadow: 0 0 0 1px var(--primary-color);
}

.statement-text {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.4;
  color: var(--text-primary);
  text-align: center;
  width: 100%;
}

.statement-left {
  text-align: left;
}

.statement-right {
  text-align: right;
}

/* Assessment slider styles */
.slider-container {
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