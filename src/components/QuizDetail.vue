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
                  <div class="slider-fill" :style="{ 
                    width: (Math.abs(parseFloat(answers[question.id])) / 2) + '%',
                    left: parseFloat(answers[question.id]) < 0 ? 'auto' : '50%',
                    right: parseFloat(answers[question.id]) < 0 ? '50%' : 'auto'
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
  padding: 0.5rem 0;
  position: relative;
}

.slider-track {
  height: 0.5rem;
  background: #dee2e6;
  border-radius: 0.25rem;
  position: relative;
  margin: 1rem 0;
}

.slider-fill {
  height: 100%;
  background-color: #0d6efd;
  border-radius: 0.25rem;
  transition: all 0.3s ease;
  position: absolute;
  top: 0;
}

.slider-container::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 2px;
  height: 24px;
  background-color: #6c757d;
  opacity: 0.3;
  pointer-events: none;
  border-radius: 1px;
}

.form-range {
  width: 100%;
  height: 2.5rem;
  padding: 0;
  background-color: transparent;
  appearance: none;
  position: relative;
  z-index: 1;
}

.form-range::-webkit-slider-thumb {
  appearance: none;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: #0d6efd;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: -0.5rem;
  box-shadow: 0 2px 4px rgba(13, 110, 253, 0.2);
  position: relative;
  z-index: 2;
}

.form-range::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 3px 6px rgba(13, 110, 253, 0.3);
}

.form-range::-webkit-slider-runnable-track {
  width: 100%;
  height: 0.5rem;
  background: transparent;
  border-radius: 0.25rem;
  cursor: pointer;
}

.slider-labels {
  color: #6c757d;
  font-size: 0.85rem;
  opacity: 0.8;
}

.slider-labels span {
  text-align: center;
  flex: 1;
}

.slider-labels span:first-child {
  text-align: left;
}

.slider-labels span:last-child {
  text-align: right;
}

.slider-value {
  font-size: 0.9rem;
  font-weight: 500;
}
</style> 