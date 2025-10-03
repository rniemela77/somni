<template>
  <div>
    <!-- Hero Section -->
    <section class="hero-section text-center mb-6">
      <div class="hero-content">
        <h1 class="hero-title text-cinzel mb-4">
          <span class="hero-main">Discover</span>
          <span class="hero-accent text-primary">Your Archetype</span>
        </h1>
        <p class="hero-subtitle lead col-lg-8 mx-auto mb-4">
          Uncover  hidden strengths through quick quizzes, then read AI-crafted stories that bring your traits to life through a mythic character.
        </p>
        <div class="hero-cta d-flex justify-content-center gap-3 mt-5">
          <router-link to="/signup" class="btn btn-primary btn-lg px-5" :disabled="!userStore.isReady">
            <i class="bi bi-compass me-2"></i>Begin Your Quest
          </router-link>
        </div>
      </div>
    </section>

    <!-- Mystical Features -->
    <section class="mystical-features mb-6 mt-5">

      <h2 class="text-center text-cinzel mb-2">What's inside?</h2>
      
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



    
  </div>
</template>

<script setup lang="ts">
import Card from '../ui/Card.vue';
import { useUserStore } from '../../stores/user';
const userStore = useUserStore();


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
  text-shadow: 0 2px 4px rgba(95, 85, 238, 0.3);
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
  box-shadow: 0 8px 25px rgba(95, 85, 238, 0.3);
}

/* Section Titles */
.section-title {
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--body-text-color);
  margin-bottom: 3rem;
}

/* Mystical Features */
.mystical-card {
  background: var(--card-fancy-bg-color);
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
  

  
  .cta-title {
    font-size: 2rem;
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