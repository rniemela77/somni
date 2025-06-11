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

    <div v-if="availableQuizzes.length === 0" class="alert alert-info text-center">
      <p>Loading quizzes...</p>
    </div>
    <div v-else class="row row-cols-1 row-cols-md-2 g-4">
      <div v-for="quiz in availableQuizzes" 
           :key="quiz.id" 
           class="col">
        <div class="card h-100">
          <div class="card-body">
            <h3 class="card-title">{{ quiz.title }}</h3>
            <div v-if="getQuizResult(quiz.id)" class="mb-2">
              <p class="text-muted">
                Last completed on {{ formatDate(getQuizResult(quiz.id).timestamp) }}
              </p>
            </div>
            <p class="card-text">{{ getQuizResult(quiz.id) ? 'Retaking this quiz will replace your previous answers.' : 'Start this assessment to discover more about yourself' }}</p>
          </div>
          <div class="card-footer text-center">
            <div v-if="getQuizResult(quiz.id)" class="d-grid gap-2">
              <button 
                class="btn btn-outline-primary" 
                @click="$emit('select-quiz', quiz.id)">
                Retake Quiz
              </button>
              <button 
                class="btn btn-link" 
                @click="$emit('show-answers', quiz.id)">
                See Answers
              </button>
            </div>
            <button 
              v-else
              class="btn btn-primary w-100" 
              @click="$emit('select-quiz', quiz.id)">
              Begin Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useQuizStore } from '../stores/quiz';

export default {
  name: 'QuizList',
  setup() {
    const quizStore = useQuizStore();
    const availableQuizzes = computed(() => quizStore.availableQuizzes);
    const userResults = computed(() => quizStore.userResults);

    const getQuizResult = (quizId) => {
      return userResults.value.find(result => result.quizId === quizId);
    };

    const formatDate = (timestamp) => {
      if (!timestamp) return 'N/A';
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    };

    return {
      availableQuizzes,
      getQuizResult,
      formatDate
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
</style> 