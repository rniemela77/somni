<template>
  <div class="container mt-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>{{ quizTitle }}</h2>
      <button class="btn btn-outline-secondary" @click="$emit('back-to-selection')">
        ← Back to Quiz Selection
      </button>
    </div>

    <form @submit.prevent="submitQuiz" class="mb-4">
      <div v-for="(question, index) in questions" 
           :key="question.id"
           class="card mb-3">
        <div class="card-body">
          <p class="fw-bold">Question {{ index + 1 }}</p>
          <p class="mb-3">{{ question.text }}</p>
          <div class="form-check" v-for="(option, i) in question.options" :key="i">
            <input class="form-check-input" type="radio" 
                   :name="'question-' + index" 
                   :value="option" 
                   v-model="answers[question.id]"
                   :disabled="isSubmitting || submissionSuccess"
                   required />
            <label class="form-check-label">
              {{ option }}
            </label>
          </div>
        </div>
      </div>

      <div class="text-center">
        <button type="submit" 
                class="btn btn-primary w-100"
                :disabled="isSubmitting || submissionSuccess">
          {{ isSubmitting ? 'Submitting...' : 'Submit Quiz' }}
        </button>
      </div>
    </form>

    <p v-if="message" 
       class="alert mt-3" 
       :class="{ 'alert-danger': message.includes('Error'), 'alert-success': message.includes('successfully') }">
      {{ message }}
    </p>

    <div v-if="submissionSuccess" class="text-center mt-4">
      <button @click="$emit('back-to-selection')" class="btn btn-secondary">
        Take Another Quiz
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useQuizStore } from '../stores/quiz';

export default {
  name: 'QuizDetail',
  props: ['quizId'],
  setup(props) {
    const quizStore = useQuizStore();
    const quizTitle = ref("");
    const questions = ref([]);
    const answers = ref({});
    const message = ref("");
    const isSubmitting = ref(false);
    const submissionSuccess = ref(false);

    const loadQuiz = async () => {
      const { error } = await quizStore.selectQuiz(props.quizId);
      if (error) {
        message.value = "Error loading quiz.";
        return;
      }

      quizTitle.value = quizStore.currentQuiz.title;
      questions.value = quizStore.currentQuiz.questions;
      answers.value = {};
      message.value = "";
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
      quizTitle,
      questions,
      answers,
      message,
      isSubmitting,
      submissionSuccess,
      submitQuiz
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
</style> 