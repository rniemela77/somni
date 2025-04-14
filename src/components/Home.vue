<template>
  <div class="home fade-in">
    <div class="hero">
      <h1><span class="gradient-text">Somni</span></h1>
      <div class="hero-subtitle">Personality Analyzer</div>
      <p class="hero-text">Discover your true personality traits through our interactive analyzers</p>
      
      <div class="cta-buttons">
        <template v-if="!authStore.isAuthenticated">
          <router-link to="/signin" class="btn btn-primary">Get Started</router-link>
          <router-link to="/signup" class="btn btn-outline">Create Account</router-link>
        </template>
        <template v-else>
          <router-link to="/quiz" class="btn btn-primary">Start an Analysis</router-link>
          <router-link to="/results" class="btn btn-outline">View Results</router-link>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth';

export default {
  name: 'Home',
  setup() {
    const authStore = useAuthStore();
    return { authStore };
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

.hero-subtitle {
  font-size: var(--font-size-lg);
  font-weight: 500;
  color: var(--secondary);
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
