<template>
  <div>
    <!-- Header only shown when not submitted -->
    <div v-if="!submissionSuccess" class="d-flex justify-content-between align-items-center mb-4">
      <h2>{{ quizTitle }}</h2>
      <button class="btn btn-outline-secondary" @click="$router.push({ name: 'quiz-list' })">
        ← Back to Quiz Selection
      </button>
    </div>

    <div v-if="loading" class="text-center">
      <p>Loading quiz...</p>
    </div>
    <div v-else-if="error" class="alert alert-danger">
      <p>{{ error }}</p>
      <button class="btn btn-outline-primary mt-2" @click="loadQuiz">
        Try Again
      </button>
    </div>
    <div v-else>
      <!-- Quiz Form -->
      <div v-if="!submissionSuccess">
        <p class="text-muted mb-4">{{ quizStore.currentQuiz?.description }}</p>

        <form @submit.prevent="submitQuiz" class="mb-4">
          <div v-for="(question, index) in questions" 
               :key="question.id"
               class="card mb-3">
            <div class="card-body">
              <p class="fw-bold">Question {{ index + 1 }}</p>
              <p class="mb-4">{{ question.text }}</p>
              
              <div class="slider-container">
                <div class="slider-labels d-flex justify-content-between mb-2">
                  <span>Almost Never (-100)</span>
                  <span>Sometimes (0)</span>
                  <span>Almost Always (+100)</span>
                </div>
                
                <div class="slider-track position-relative">
                  <!-- Negative fill (from 0 to negative values) -->
                  <div class="slider-fill negative" :style="{ 
                    width: parseFloat(answers[question.id]) < 0 ? (Math.abs(parseFloat(answers[question.id])) / 2) + '%' : '0%',
                    right: '50%'
                  }"></div>
                  <!-- Positive fill (from 0 to positive values) -->
                  <div class="slider-fill positive" :style="{ 
                    width: parseFloat(answers[question.id]) > 0 ? (parseFloat(answers[question.id]) / 2) + '%' : '0%',
                    left: '50%'
                  }"></div>
                  <input type="range"
                         class="form-range"
                         v-model="answers[question.id]"
                         min="-100"
                         max="100"
                         :disabled="isSubmitting"
                         required />
                </div>
                
                <div class="slider-value text-center mt-2">
                  <small class="text-muted">Current value: {{ answers[question.id] }}</small>
                </div>
              </div>
            </div>
          </div>

          <div class="text-center">
            <button type="submit" 
                    class="btn btn-primary w-100"
                    :disabled="isSubmitting">
              {{ isSubmitting ? 'Submitting...' : 'Submit Quiz' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Success View -->
      <div v-else class="text-center">
        <div class="success-icon mb-4">
          <i class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i>
        </div>
        <h2 class="mb-4">Quiz Submitted Successfully!</h2>
        <p class="text-muted mb-4">Your responses have been recorded and your personality profile has been updated.</p>
        <div class="d-flex justify-content-center gap-3">
          <button @click="$router.push({ name: 'quiz-list' })" class="btn btn-primary">
            Take Another Quiz
          </button>
          <button @click="$router.push({ name: 'home' })" class="btn btn-outline-primary">
            View Dashboard
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useQuizStore } from '../stores/quiz';
import { useRouter } from 'vue-router';

export default {
  name: 'QuizDetail',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const router = useRouter();
    const quizStore = useQuizStore();
    const loading = ref(true);
    const error = ref(null);
    const quizTitle = ref("");
    const questions = ref([]);
    const answers = ref({});
    const message = ref("");
    const isSubmitting = ref(false);
    const submissionSuccess = ref(false);

    const loadQuiz = async () => {
      loading.value = true;
      error.value = null;
      
      try {
        const result = await quizStore.selectQuiz(props.id);
        if (result.error) {
          error.value = result.error;
          return;
        }

        quizTitle.value = quizStore.currentQuiz.title;
        questions.value = quizStore.currentQuiz.questions;
        // Initialize all answers to 0 (neutral/sometimes)
        answers.value = questions.value.reduce((acc, q) => {
          acc[q.id] = "0";
          return acc;
        }, {});
        message.value = "";
      } catch (err) {
        error.value = "Failed to load quiz. Please try again.";
        console.error('Error loading quiz:', err);
      } finally {
        loading.value = false;
      }
    };

    const submitQuiz = async () => {
      isSubmitting.value = true;
      message.value = "";

      const { resultId, error } = await quizStore.submitQuiz(answers.value);

      if (error) {
        message.value = "Error submitting quiz. Please try again.";
        submissionSuccess.value = false;
      } else {
        message.value = "Quiz submitted successfully!";
        submissionSuccess.value = true;
        await quizStore.loadUserResults();
      }

      isSubmitting.value = false;
    };

    loadQuiz();

    return {
      quizStore,
      loading,
      error,
      quizTitle,
      questions,
      answers,
      message,
      isSubmitting,
      submissionSuccess,
      submitQuiz,
      loadQuiz
    };
  }
};
</script>

<style scoped>
.slider-container {
  padding: 1.5rem 0;
  position: relative;
}

.slider-track {
  height: 32px;
  background: #e9ecef;
  border-radius: 16px;
  position: relative;
  margin: 1.5rem 0;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
}

.slider-fill {
  height: 100%;
  background: #4facfe;
  position: absolute;
  top: 0;
  transition: width 0.3s ease;
  border-radius: 16px;
}

.slider-fill.negative {
  background: #4facfe;
  border-radius: 16px;
}

.slider-fill.positive {
  background: #4facfe;
  border-radius: 16px;
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
  --thumb-shadow: 0 1px 3px rgba(0,0,0,0.2);
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
  color: #6c757d;
  font-size: 0.875rem;
  font-weight: 500;
}

.slider-labels span {
  position: relative;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  background: rgba(233, 236, 239, 0.5);
  transition: all 0.2s ease;
}

.slider-labels span:hover {
  background: rgba(233, 236, 239, 0.8);
}

.slider-value {
  position: absolute;
  top: -2rem;
  left: 50%;
  transform: translateX(-50%);
  background: #4facfe;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;
  opacity: 0;
  transition: all 0.2s ease;
  pointer-events: none;
}

.form-range:hover + .slider-value,
.form-range:focus + .slider-value {
  opacity: 1;
  top: -2.5rem;
}

.slider-container::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 2px;
  height: 32px;
  background-color: rgba(0,0,0,0.1);
  pointer-events: none;
}
</style> 