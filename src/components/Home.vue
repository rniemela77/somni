<template>
  <div class="home fade-in">
    
    <!-- Personality Analysis Section for authenticated users -->
    <div v-if="authStore.isAuthenticated" class="personality-section">
      <PersonalityDashboard />
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth';
import PersonalityDashboard from './PersonalityDashboard.vue';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';

export default {
  name: 'Home',
  components: {
    PersonalityDashboard
  },
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  mounted() {
    console.log('Home component mounted');
  }
};
</script>

<style scoped>
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

/* Personality Section */
.personality-section {
  max-width: 950px;
  margin-left: auto;
  margin-right: auto;
}

@media (min-width: 768px) {
  .hero h1 {
    font-size: calc(var(--font-size-xxl) * 1.2);
  }

  .cta-buttons {
    flex-direction: column;
    padding: 0 var(--spacing-lg);
  }
}
</style> 
