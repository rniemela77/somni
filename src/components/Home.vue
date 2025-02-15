<template>
  <div class="home fade-in">
    <div class="hero">
      <h1>Welcome to <span class="gradient-text">Quiz</span><span class="gradient-text-alt">App</span></h1>
      <p class="hero-text">Test your knowledge with our interactive quizzes</p>
      
      <div class="cta-buttons">
        <template v-if="!userState.user">
          <router-link to="/signin" class="btn btn-primary">Get Started</router-link>
          <router-link to="/signup" class="btn btn-outline">Create Account</router-link>
        </template>
        <template v-else>
          <router-link to="/quiz" class="btn btn-primary">Take a Quiz</router-link>
          <router-link to="/results" class="btn btn-outline">View Results</router-link>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { inject } from 'vue';

export default {
  name: 'Home',
  setup() {
    const userState = inject('userState');
    return { userState };
  }
};
</script>

<style scoped>
.home {
  padding: var(--spacing-xl) 0;
}

.hero {
  text-align: center;
  margin-bottom: var(--spacing-xxl);
}

.hero h1 {
  font-size: calc(var(--font-size-xxl) * 1.5);
  margin-bottom: var(--spacing-md);
}

.hero-text {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
}

.cta-buttons {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: calc(var(--font-size-xxl) * 1.2);
  }

  .cta-buttons {
    flex-direction: column;
    padding: 0 var(--spacing-lg);
  }
}
</style> 
