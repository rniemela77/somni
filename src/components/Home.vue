<template>
  <div class="container mt-5">
    
    <!-- Personality Analysis Section for authenticated users -->
    <div v-if="authStore.isAuthenticated" class="mb-4">
      <PersonalityDashboard />
    </div>
    
    <!-- Landing Page for non-authenticated users -->
    <div>
      <section class="text-center mb-5">
        <h1 class="display-4">Insight through <span class="text-primary">self-discovery</span></h1>
        <p class="lead">
          Somni provides meaningful personality analysis through thoughtfully designed assessments.
        </p>
        <div class="d-flex justify-content-center gap-3">
          <router-link to="/signup" class="btn btn-primary btn-lg">Create Account</router-link>
          <router-link to="/signin" class="btn btn-outline-primary btn-lg">Sign In</router-link>
        </div>
      </section>

      <section class="mb-5">
        <h2 class="text-center mb-4">The Process</h2>
        
        <div class="row">
          <div class="col-md-4 mb-4">
            <div class="card h-100">
              <div class="card-body text-center">
                <div class="mb-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM17 13H13V17H11V13H7V11H11V7H13V11H17V13Z" fill="currentColor"/>
                  </svg>
                </div>
                <h3 class="h5">Assessment</h3>
                <p>Respond to carefully crafted scenarios revealing personality traits.</p>
              </div>
            </div>
          </div>
          
          <div class="col-md-4 mb-4">
            <div class="card h-100">
              <div class="card-body text-center">
                <div class="mb-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 8C19.55 8 18.74 9.44 19.07 10.51L15.52 14.07C15.22 13.98 14.78 13.98 14.48 14.07L11.93 11.52C12.27 10.45 11.46 9 10 9C8.55 9 7.73 10.44 8.07 11.52L3.51 16.07C2.44 15.74 1 16.55 1 18C1 19.1 1.9 20 3 20C4.45 20 5.26 18.56 4.93 17.49L9.48 12.93C9.78 13.02 10.22 13.02 10.52 12.93L13.07 15.48C12.73 16.55 13.54 18 15 18C16.45 18 17.27 16.56 16.93 15.48L20.49 11.93C21.56 12.26 23 11.45 23 10C23 8.9 22.1 8 21 8Z" fill="currentColor"/>
                  </svg>
                </div>
                <h3 class="h5">Analysis</h3>
                <p>Visualize personality dimensions based on your responses.</p>
              </div>
            </div>
          </div>
          
          <div class="col-md-4 mb-4">
            <div class="card h-100">
              <div class="card-body text-center">
                <div class="mb-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
                  </svg>
                </div>
                <h3 class="h5">Insight</h3>
                <p>Receive comprehensive analysis of behavioral patterns and tendencies.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="mb-5">
        <h2 class="text-center mb-4">Available Analyzers</h2>
        <div class="row">
          <div class="col-md-4 mb-4">
            <div class="card h-100">
              <div class="card-body">
                <h3 class="h5">Odd Occurrences</h3>
                <p>How you respond to unusual situations reveals your adaptability and instinctive reactions.</p>
              </div>
            </div>
          </div>
          
          <div class="col-md-4 mb-4">
            <div class="card h-100">
              <div class="card-body">
                <h3 class="h5">Everyday Choices</h3>
                <p>Daily decisions and preferences reflect subtle patterns in your personality structure.</p>
              </div>
            </div>
          </div>
          
          <div class="col-md-4 mb-4">
            <div class="card h-100">
              <div class="card-body">
                <h3 class="h5">Response Patterns</h3>
                <p>Natural reaction patterns provide insight into your underlying character traits.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="text-center">
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
</style> 
