<template>
  <div class="container">
    <!-- Personality Analysis Section for authenticated users -->
    <PersonalityDashboard v-if="userStore.isAuthenticated" class="mb-4" />
    
    <!-- Landing Page for non-authenticated users -->
    <LandingPage v-else /> 
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/user';
import PersonalityDashboard from './PersonalityDashboard.vue';
import LandingPage from './features/dashboard/LandingPage.vue';

const userStore = useUserStore();
</script>

<style scoped>
.mb-6 {
  margin-bottom: 5rem;
}

.process-icon {
  color: var(--bs-primary);
  background-color: rgba(13, 110, 253, 0.1);
  width: 80px;
  height: 80px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.hover-card {
  transition: all 0.3s ease;
}

.hover-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 1rem 3rem rgba(0,0,0,.075)!important;
}

.lead {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #4a5568;
}

.rounded-4 {
  border-radius: 1rem !important;
}

.bg-opacity-75 {
  backdrop-filter: blur(10px);
}

h1, h2 {
  font-weight: 600;
  color: #2d3748;
}

.text-primary {
  color: #0066ff !important;
}

.btn {
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn-primary {
  background-color: #0066ff !important;
  border-color: #0066ff !important;
}

.btn-outline-primary {
  border-color: #0066ff !important;
  color: #0066ff !important;
}

.btn-outline-primary:hover {
  background-color: #0066ff !important;
  color: white !important;
}

.content-sections {
  background: white;
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.03);
}

.content-section {
  padding: 2rem 0;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.content-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.content-section:first-child {
  padding-top: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #2d3748;
}

.section-number {
  font-family: 'Inter', monospace;
  font-size: 1rem;
  font-weight: 600;
  color: #0066ff;
  background: rgba(0,102,255,0.1);
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
}

.section-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #4a5568;
  margin: 0;
}

@media (max-width: 768px) {
  .content-sections {
    padding: 2rem;
  }
  
  .content-section {
    padding: 1.5rem 0;
  }
  
  .section-title {
    font-size: 1.25rem;
  }
}
</style> 
