<template>
  <div>
    <section class="text-center mb-5">
      <h1 class="display-4 mb-4">Discover <span class="text-primary fw-semibold">Personality Insights</span></h1>
      <p class="lead col-lg-8 mx-auto">
        Discover your unique personality profile across dozens of different traits and dimensions.
      </p>
      <div class="d-flex justify-content-center gap-3 mt-4">
        <router-link to="/signin" class="btn btn-outline-primary btn-lg px-4" :disabled="!userStore.isReady">Sign
          In</router-link>
        <router-link to="/signup" class="btn btn-primary btn-lg px-4" :disabled="!userStore.isReady">Sign
          Up</router-link>
      </div>
    </section>

    <section class="mb-6">
      <h2 class="text-center h1 mb-5">How It Works</h2>

      <div class="row g-4">
        <div v-for="item in processSteps" :key="item.title" class="col-md-4">
          <Card class="text-center">
            <div class="process-icon mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path :d="item.icon" fill="currentColor" />
              </svg>
            </div>
            <h3 class="h4 mb-3">{{ item.title }}</h3>
            <p class="text-muted mb-0">{{ item.description }}</p>
          </Card>
        </div>
      </div>
    </section>

    <section class="mt-5">
      <h2 class="text-center h1 mb-5">What Makes Us Different</h2>

      <div class="row justify-content-center">
        <div class="col-lg-10">
          <Card>
            <div class="content-section">
              <h3 class="section-title">
                <span class="section-number text-primary">01</span>
                Multi-Dimensional Measurement
              </h3>
              <p class="section-text">
                Most personality tests only look at a few basic traits. Our assessment measures you across more than 12
                different personality dimensions. This includes well-known ones like <span class="fw-bold">Extravert
                  versus Introvert</span>, as well as less common and more specific traits such as <span
                  class="fw-bold">Authority Acceptance</span> versus <span class="fw-bold">Authority Rejection</span>. You will see exactly where you
                fall on each spectrum.
              </p>
            </div>

            <div class="content-section">
              <h3 class="section-title">
                <span class="section-number text-primary">02</span>
                Personalized AI Insights
              </h3>
              <p class="section-text">
                After you complete your profile, our AI reviews your unique combination of answers and generates <span
                  class="fw-bold">insights that are tailored specifically to you</span>. This approach gives you a much
                deeper and more accurate understanding of your personality than generic quiz sites, because it takes all
                of your results into account.
              </p>
            </div>

            <div class="content-section">
              <h3 class="section-title">
                <span class="section-number text-primary">03</span>
                Comprehensive Analysis
              </h3>
              <p class="section-text">
                By considering your results across every dimension, our platform provides a complete view of your
                personality. You will discover not only your <span class="fw-bold">strongest traits</span>, but also the
                subtle details that make you unique.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import Card from '../ui/Card.vue';
import { useUserStore } from '../../stores/user';
const userStore = useUserStore();

const processSteps = [
  {
    title: 'Assessment',
    description: 'Rate behavioral statements across multiple personality dimensions.',
    icon: 'M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM17 13H13V17H11V13H7V11H11V7H13V11H17V13Z'
  },
  {
    title: 'Analysis',
    description: 'AI identifies your unique patterns and where you stand out most.',
    icon: 'M21 8C19.55 8 18.74 9.44 19.07 10.51L15.52 14.07C15.22 13.98 14.78 13.98 14.48 14.07L11.93 11.52C12.27 10.45 11.46 9 10 9C8.55 9 7.73 10.44 8.07 11.52L3.51 16.07C2.44 15.74 1 16.55 1 18C1 19.1 1.9 20 3 20C4.45 20 5.26 18.56 4.93 17.49L9.48 12.93C9.78 13.02 10.22 13.02 10.52 12.93L13.07 15.48C12.73 16.55 13.54 18 15 18C16.45 18 17.27 16.56 16.93 15.48L20.49 11.93C21.56 12.26 23 11.45 23 10C23 8.9 22.1 8 21 8Z'
  },
  {
    title: 'Insights',
    description: 'Get detailed analysis of your personality profile and what makes you unique.',
    icon: 'M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z'
  }
];
</script>

<style scoped>
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

.content-section {
  padding: 2rem 0;

  &:not(:last-child) {
    border-bottom: 1px solid var(--card-bg-color);
  }
}

.section-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.section-number {
  font-size: 1rem;
  background: rgba(0, 102, 255, 0.1);
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-weight: 600;
}

.text-muted,
.section-text {
  color: var(--body-text-color-medium);
}

.process-icon,
.section-number {
  color: var(--text-primary) !important;
  background-color: var(--text-primary-bg) !important;
}

.section-text .fw-bold {
  color: var(--text-primary) !important;
}
</style>