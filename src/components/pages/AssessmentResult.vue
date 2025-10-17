<template>
  <div class="assessment-result text-center pt-0">
    <img src="/images/compass.png" class="icon icon-light result-icon" loading="lazy" />

    <h1 class="mb-3 text-cinzel result-title">Your Discovery</h1>

    <i class="mb-3 result-subtitle">
      From this quest, a fragment of your myth is revealed
    </i>

    <Card class="text-left mt-4 result-card" padding="sm" shadow="dark" border="medium">
      <Card class="inner-card-section text-capitalize" padding="sm">
        <p class="text-muted mb-0 text-cinzel">Dominant Trait</p>
        <p class="display-5 text-primary my-1">{{ getDominantTraitLabel(thisAssessmentWithScore) }}</p> 
        <small>({{ dominantTrait?.name.toLowerCase() }})</small>
      </Card>

      <Card class="inner-card-section" padding="sm">
        <p class="text-muted mb-0 text-cinzel">Your strength</p>
        <p class="my-3">{{ dominantTrait?.strength }}</p>
      </Card>

      <Card class="inner-card-section" padding="sm">
        <p class="text-muted mb-0 text-cinzel">Your blindspot</p>
        <p class="my-3">{{ dominantTrait?.blindspot }}</p>
      </Card>
    </Card>

    <div class="text-center mt-3 continue-button-container">
      <router-link class="btn btn-primary" :to="getContinueButtonDestination()"
        >Continue</router-link
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useAssessmentProgress } from "../../composables/useAssessmentProgress";
import { useRevelations } from "../../composables/useRevelations";
import Card from "../ui/Card.vue";

const route = useRoute();
const assessmentSlug = route.params.assessmentSlug as string;

const {
  getAssessmentFromSlug,
  getAssessmentWithScore,
  getDominantTrait,
  getDominantTraitLabel,
} = useAssessmentProgress();

const { getContinueButtonDestination } = useRevelations();

const assessment = getAssessmentFromSlug(assessmentSlug);
const thisAssessmentWithScore = getAssessmentWithScore(assessment);
const dominantTrait = getDominantTrait(thisAssessmentWithScore);
</script>

<style scoped>
.assessment-result {
  padding: 1rem;
}

.icon {
  width: 100px;
  height: 100px;
}

.inner-card-section {
  margin-bottom: 1rem;
  border: 1px solid rgba(var(--primary-color), 0.5) !important;
  box-shadow: 0 0 2px 0 var(--primary-color);
  background: transparent!important;
}

.result-content {
  margin-top: 1rem;
}

.no-result {
  margin-top: 1rem;
  color: #666;
  font-style: italic;
}

.text-left {
  text-align: left;
}

.icon-light {
  filter: invert(1);
}

/* Staggered fade-in sequence */
.result-icon,
.result-title,
.result-subtitle,
.result-card,
.continue-button-container {
  opacity: 0;
  transform: translateY(6px);
  animation: fadeInUp 1s ease-out forwards;
}

.result-icon { animation-delay: 0s; }
.result-title { animation-delay: 0.4s; }
.result-subtitle { animation-delay: 0.8s; }
.result-card { animation-delay: 1.2s; }
.continue-button-container { animation-delay: 1.8s; }

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Subtitle visual treatment to match other pages */
.result-subtitle {
  display: block;
  margin: 0 auto;
  max-width: 420px;
  color: var(--text-secondary);
  font-style: italic;
}
</style>
