<template>
  <div>
    <!-- Hero Section -->
    <section class="hero-section text-center mb-6">
      <div class="hero-content">
        <h1 class="hero-title text-cinzel mb-4">
          <span class="hero-main">Discover</span>
          <span class="hero-accent text-primary">Your Unique Archetype</span>
        </h1>
        <p class="hero-subtitle lead col-lg-8 mx-auto mb-4">
          Uncover your hidden strengths through personality quizzes, then read personalized AI-crafted stories that bring your traits to life through a mythic character.
        </p>
        <div class="hero-cta d-flex justify-content-center gap-3 mt-5">
          <Button :to="'/signup'" variant="primary" class="btn-lg px-5" :disabled="!userStore.isReady">
            <i class="bi bi-compass me-2"></i>Begin Your Quest
          </Button>
        </div>
      </div>
    </section>

    <!-- Mystical Features -->
    <section class="mystical-features mb-6 mt-5">
      <h2 class="text-center text-cinzel mb-4">What's inside?</h2>
      
      <div class="row justify-content-center">
        <div class="col-lg-10">
          <Card class="mystical-card">
            <div class="feature-grid">
              <div class="feature-item">
                <div class="feature-icon">
                  <i class="bi bi-stars"></i>
                </div>
                <div class="feature-content">
                  <h3 class="feature-title text-cinzel">Traits & Dimensions</h3>
                  <p class="feature-description">
                    Uncover your persona archetype in <span class="text-primary fw-semibold">20+ dimensions</span> resembling those found in the Myers-Briggs Type Indicator (MBTI), Big Five, and more.
                    Clear results, no fluff.
                  </p>
                </div>
              </div>

              <div class="feature-item">
                <div class="feature-icon">
                  <i class="bi bi-book"></i>
                </div>
                <div class="feature-content">
                  <h3 class="feature-title text-cinzel">Your Archetype Story</h3>
                  <p class="feature-description">
                    Watch your traits assemble into a personalized persona tailored to your unique personality- a timeless AI-crafted character story.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>

    <!-- Available Quizzes Section -->
    <section class="available-quizzes mb-6 mt-5">
      <h2 class="text-center text-cinzel mb-4">Available Personality Quizzes</h2>
      
      <div class="row justify-content-center">
        <div class="col-lg-10">
          <Card class="quizzes-card">
            <div class="quizzes-grid">
              <div class="quiz-item" v-for="quiz in availableQuizzes" :key="quiz.id">
                <div class="quiz-icon">
                  <i class="bi bi-compass"></i>
                </div>
                <div class="quiz-content">
                  <h4 class="quiz-title">{{ quiz.negative_label }} vs {{ quiz.positive_label }}</h4>
                  <p class="quiz-subtitle text-primary">{{ quiz.negative }} vs {{ quiz.positive }}</p>
                </div>
              </div>
            </div>
            <div class="more-to-come text-center">
              <p class="text-muted">
                <i class="bi bi-plus-circle me-2"></i>
                <em>With more to come...</em>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>

    <!-- AI Insights Section -->
    <section class="ai-insights mb-6 mt-5">
      <h2 class="text-center text-cinzel mb-4">AI-Powered Insights</h2>
      
      <div class="row justify-content-center">
        <div class="col-lg-10">
          <Card class="insights-card">
            <div class="insights-grid">
              <div class="insight-item">
                <div class="insight-icon">
                  <i class="bi bi-stars"></i>
                </div>
                <div class="insight-content">
                  <h4 class="insight-title">The Awakening</h4>
                  <p class="insight-description text-primary">Discover your mythical persona through AI-crafted archetypal character analysis</p>
                </div>
              </div>

              <div class="insight-item">
                <div class="insight-icon">
                  <i class="bi bi-eye"></i>
                </div>
                <div class="insight-content">
                  <h4 class="insight-title">The Reflection</h4>
                  <p class="insight-description text-primary">See yourself through others' eyes with personalized perception analysis</p>
                </div>
              </div>

              <div class="insight-item">
                <div class="insight-icon">
                  <i class="bi bi-compass"></i>
                </div>
                <div class="insight-content">
                  <h4 class="insight-title">The Destiny</h4>
                  <p class="insight-description text-primary">Uncover your greater purpose and role in the world through AI insights</p>
                </div>
              </div>

              <div class="insight-item">
                <div class="insight-icon">
                  <i class="bi bi-shield"></i>
                </div>
                <div class="insight-content">
                  <h4 class="insight-title">The Inner Trial</h4>
                  <p class="insight-description text-primary">Explore your inner challenges and how they shape your journey</p>
                </div>
              </div>

              <div class="insight-item">
                <div class="insight-icon">
                  <i class="bi bi-arrow-right-circle"></i>
                </div>
                <div class="insight-content">
                  <h4 class="insight-title">The Turning Point</h4>
                  <p class="insight-description text-primary">Discover pivotal moments of growth and self-awareness</p>
                </div>
              </div>

              <div class="insight-item">
                <div class="insight-icon">
                  <i class="bi bi-moon"></i>
                </div>
                <div class="insight-content">
                  <h4 class="insight-title">The Shadow</h4>
                  <p class="insight-description text-primary">Understand your shadow side and hidden tensions</p>
                </div>
              </div>

              <div class="insight-item">
                <div class="insight-icon">
                  <i class="bi bi-gem"></i>
                </div>
                <div class="insight-content">
                  <h4 class="insight-title">Untold Strengths</h4>
                  <p class="insight-description text-primary">Reveal hidden strengths that live in your restraint and observation</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>

    <!-- Final CTA Section -->
    <section class="final-cta mb-6 mt-5">
      <div class="row justify-content-center">
        <div class="col-lg-8 text-center">
          <h2 class="cta-title text-cinzel mb-3">Ready to Discover Your Mythical Self?</h2>
          <i class="cta-description mb-4 text-primary">
            Your journey of discovering your unique archetype awaits.
          </i>
          <div class="hero-cta d-flex justify-content-center gap-3 mt-5">
          <Button :to="'/signup'" variant="primary" class="btn-lg px-5" :disabled="!userStore.isReady">
            <i class="bi bi-compass me-2"></i>Begin Your Quest
          </Button>
        </div>
        </div>
      </div>
    </section>

    
  </div>
</template>

<script setup lang="ts">
import Card from '../ui/Card.vue';
import Button from '../ui/Button.vue';
import { useUserStore } from '../../stores/user';
import { ref, onMounted } from 'vue';
import { fetchAllAssessments } from '../../services/firebase-assessment-service';
import type { Assessment } from '../../../shared/types/shared';

const userStore = useUserStore();
const availableQuizzes = ref<Assessment[]>([]);

onMounted(async () => {
  try {
    availableQuizzes.value = await fetchAllAssessments();
  } catch (error) {
    console.error('Failed to load quizzes:', error);
  }
});


</script>

<style scoped>
/* Hero Section */
.hero-section {
  padding: 3rem 0;
}

.hero-title {
  font-size: 4rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

.hero-main {
  display: block;
  color: var(--body-text-color);
  font-size: 0.65em;
}

.hero-accent {
  display: block;
  text-shadow: 0px 2px 2px black, 0 2px 46px rgb(119 109 255 / 69%);
}

.hero-subtitle {
  font-size: 1.25rem;
  line-height: 1.6;
  color: var(--body-text-color-medium);
}

.hero-cta .btn {
  border-radius: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  font-size: 1.125rem;
}

.hero-cta .btn:hover {
  transform: translateY(-2px);
  filter: brightness(2);
  box-shadow: 0 3px 25px rgba(32 16 255 / 0.9);
}

/* Section Titles */
.section-title {
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--body-text-color);
  margin-bottom: 3rem;
}

/* Mystical Features */
.mystical-features {
  position: relative;
  z-index: 1;
}

.mystical-card {
  border: 1px solid rgba(95, 85, 238, 0.2);
  backdrop-filter: blur(10px);
}

.feature-grid {
  display: grid;
  gap: 3rem;
  padding: 2rem 0;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
}

.feature-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-color-light));
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 8px 25px rgba(95, 85, 238, 0.3);
}

.feature-icon i {
  font-size: 2rem;
  color: white;
}

.feature-content {
  flex: 1;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--body-text-color);
  margin-bottom: 1rem;
}

.feature-description {
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--body-text-color-medium);
}

/* Available Quizzes */
.quizzes-card {
  border: 1px solid rgba(95, 85, 238, 0.2);
  backdrop-filter: blur(10px);
}

.quizzes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 2rem 0;
}

.quiz-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: rgba(95, 85, 238, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(95, 85, 238, 0.1);
  transition: all 0.3s ease;
}

.quiz-item:hover {
  background: rgba(95, 85, 238, 0.1);
  border-color: rgba(95, 85, 238, 0.2);
  transform: translateY(-2px);
}

.quiz-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-color-light));
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 15px rgba(95, 85, 238, 0.3);
}

.quiz-icon i {
  font-size: 1rem;
  color: white;
}

.quiz-content {
  flex: 1;
}

.quiz-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--body-text-color);
  margin-bottom: 0.25rem;
  line-height: 1.3;
}

.quiz-subtitle {
  font-size: 0.8rem;
  line-height: 1.4;
  color: var(--body-text-color-medium);
  margin: 0;
  font-style: italic;
}

.more-to-come {
  padding: 1rem 0;
  border-top: 1px solid rgba(95, 85, 238, 0.1);
}

.more-to-come p {
  margin: 0;
  font-size: 1rem;
}

.more-to-come i {
  color: var(--primary-color);
}

/* AI Insights */
.insights-card {
  background: var(--card-fancy-bg-color);
  border: 1px solid rgba(95, 85, 238, 0.2);
  backdrop-filter: blur(10px);
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 2rem 0;
}

.insight-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(95, 85, 238, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(95, 85, 238, 0.1);
  transition: all 0.3s ease;
}

.insight-item:hover {
  background: rgba(95, 85, 238, 0.1);
  border-color: rgba(95, 85, 238, 0.2);
  transform: translateY(-2px);
}

.insight-icon {
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-color-light));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 15px rgba(95, 85, 238, 0.3);
}

.insight-icon i {
  font-size: 1.1rem;
  color: white;
}

.insight-content {
  flex: 1;
}

.insight-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--body-text-color);
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.insight-description {
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--body-text-color-medium);
  margin: 0;
}

/* CTA Section */
.cta-section {
  margin-top: 4rem;
}

.cta-card {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-color-dark));
  color: white;
  border: none;
  position: relative;
  overflow: hidden;
}

.cta-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('/images/flame-sigil.png') center/contain no-repeat;
  opacity: 0.1;
  pointer-events: none;
}

.cta-content {
  position: relative;
  z-index: 1;
  padding: 3rem 2rem;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 600;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.cta-description {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 600px;
  margin: 0 auto 2rem;
}

.cta-buttons .btn {
  border-radius: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.cta-buttons .btn-primary {
  background: white;
  color: var(--primary-color);
  border: 2px solid white;
}

.cta-buttons .btn-primary:hover {
  background: transparent;
  color: white;
  border-color: white;
  transform: translateY(-2px);
}

.cta-buttons .btn-outline-primary {
  color: white;
  border-color: white;
}

.cta-buttons .btn-outline-primary:hover {
  background: white;
  color: var(--primary-color);
  transform: translateY(-2px);
}

/* Final CTA Section */
.final-cta .cta-title {
  font-size: 2.25rem;
  font-weight: 600;
  color: var(--body-text-color);
  margin-bottom: 1rem;
}

.final-cta .cta-description {
  font-size: 1.1rem;
  color: var(--body-text-color-medium);
  max-width: 500px;
  margin: 0 auto 2rem;
  line-height: 1.6;
}

.final-cta .cta-buttons .btn {
  border-radius: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  font-size: 1.125rem;
}

.final-cta .cta-buttons .btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(95, 85, 238, 0.3);
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .feature-item {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
    align-items: center;
  }
  
  .quizzes-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .quiz-item {
    /* flex-direction: column; */
    /* text-align: center; */
    gap: 0.75rem;
  }
  
  .insights-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .insight-item {
  display: flex;
    /* flex-direction: column;
    text-align: center; */
    gap: 0.75rem;
  }
  
  .cta-title {
    font-size: 2rem;
  }
  
  .final-cta .cta-title {
    font-size: 1.75rem;
  }
  
  .hero-cta,
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .hero-cta .btn,
  .cta-buttons .btn {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 576px) {
  .hero-section {
    padding: 2rem 0;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .feature-icon {
    width: 60px;
    height: 60px;
  }
  
  .feature-icon i {
    font-size: 1.5rem;
  }
}
</style>