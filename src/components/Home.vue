<template>
  <div class="home fade-in">
    
    <!-- Personality Analysis Section for authenticated users -->
    <div v-if="authStore.isAuthenticated" class="personality-section">
      <PersonalityDashboard />
    </div>
    
    <!-- Landing Page for non-authenticated users -->
    <div v-else class="landing-page">
      <section class="hero">
        <h1>Insight through <span class="gradient-text">self-discovery</span></h1>
        <p class="hero-text">
          Somni provides meaningful personality analysis through thoughtfully designed assessments.
        </p>
        <div class="cta-buttons">
          <router-link to="/signup" class="btn btn-primary btn-lg">Create Account</router-link>
          <router-link to="/signin" class="btn btn-outline btn-lg">Sign In</router-link>
        </div>
      </section>

      <section class="features">
        <h2>The Process</h2>
        
        <div class="feature-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM17 13H13V17H11V13H7V11H11V7H13V11H17V13Z" fill="currentColor"/>
              </svg>
            </div>
            <h3>Assessment</h3>
            <p>Respond to carefully crafted scenarios revealing personality traits.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 8C19.55 8 18.74 9.44 19.07 10.51L15.52 14.07C15.22 13.98 14.78 13.98 14.48 14.07L11.93 11.52C12.27 10.45 11.46 9 10 9C8.55 9 7.73 10.44 8.07 11.52L3.51 16.07C2.44 15.74 1 16.55 1 18C1 19.1 1.9 20 3 20C4.45 20 5.26 18.56 4.93 17.49L9.48 12.93C9.78 13.02 10.22 13.02 10.52 12.93L13.07 15.48C12.73 16.55 13.54 18 15 18C16.45 18 17.27 16.56 16.93 15.48L20.49 11.93C21.56 12.26 23 11.45 23 10C23 8.9 22.1 8 21 8Z" fill="currentColor"/>
              </svg>
            </div>
            <h3>Analysis</h3>
            <p>Visualize personality dimensions based on your responses.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
              </svg>
            </div>
            <h3>Insight</h3>
            <p>Receive comprehensive analysis of behavioral patterns and tendencies.</p>
          </div>
        </div>
      </section>

      <section class="analyzers">
        <h2>Available Analyzers</h2>
        <div class="analyzer-list">
          <div class="analyzer-item">
            <div class="analyzer-content">
              <h3>Odd Occurrences</h3>
              <p>How you respond to unusual situations reveals your adaptability and instinctive reactions.</p>
            </div>
          </div>
          
          <div class="analyzer-item">
            <div class="analyzer-content">
              <h3>Everyday Choices</h3>
              <p>Daily decisions and preferences reflect subtle patterns in your personality structure.</p>
            </div>
          </div>
          
          <div class="analyzer-item">
            <div class="analyzer-content">
              <h3>Response Patterns</h3>
              <p>Natural reaction patterns provide insight into your underlying character traits.</p>
            </div>
          </div>
        </div>
        
        <div class="cta-section">
          <router-link to="/signup" class="btn btn-primary">Begin Assessment</router-link>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth';
import PersonalityDashboard from './PersonalityDashboard.vue';

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
  padding-top: var(--spacing-xl);
}

.hero h1 {
  font-size: calc(var(--font-size-xxl) * 1.2);
  margin-bottom: var(--spacing-lg);
  font-weight: 500;
  letter-spacing: -0.5px;
}

.hero-text {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
  max-width: 650px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.cta-buttons {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  margin-bottom: var(--spacing-xl);
}

/* Personality Section */
.personality-section {
  max-width: 950px;
  margin-left: auto;
  margin-right: auto;
}

/* Landing Page Styles */
.landing-page {
  max-width: 1100px;
  margin: 0 auto;
}

.features, 
.analyzers {
  margin-bottom: var(--spacing-xxl);
}

.features h2,
.analyzers h2 {
  text-align: center;
  margin-bottom: var(--spacing-xl);
  font-size: var(--font-size-xl);
  color: var(--text-primary);
  font-weight: 500;
  letter-spacing: -0.3px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.feature-card {
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
  text-align: left;
  border: 1px solid var(--bg-muted);
  height: 100%;
}

.feature-icon {
  color: var(--primary);
  margin-bottom: var(--spacing-md);
}

.feature-card h3 {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-sm);
  color: var(--text-primary);
  font-weight: 500;
}

.feature-card p {
  color: var(--text-secondary);
  line-height: 1.6;
}

.analyzer-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.analyzer-item {
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  border: 1px solid var(--bg-muted);
  overflow: hidden;
}

.analyzer-content {
  padding: var(--spacing-lg) var(--spacing-xl);
  border-left: 3px solid var(--primary);
}

.analyzer-item h3 {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-xs);
  color: var(--text-primary);
  font-weight: 500;
}

.analyzer-item p {
  color: var(--text-secondary);
  line-height: 1.6;
}

.cta-section {
  text-align: center;
  margin-top: var(--spacing-xl);
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: calc(var(--font-size-xl) * 1.2);
  }

  .cta-buttons {
    flex-direction: column;
    padding: 0 var(--spacing-lg);
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
}
</style> 
