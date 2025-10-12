<template>
  <div class="assessment-result text-center pt-0">
    <img src="/images/compass.png" class="icon icon-light" loading="lazy" />

    <h1 class="mb-3 text-cinzel">Your Discovery</h1>

    <i class="text-primary mb-3">
      From this quest, a fragment of your myth is revealed
    </i>

    <Card class="text-left mt-4" padding="sm" shadow="dark" border="medium">
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

      <div class="text-center">
        <router-link class="btn btn-primary" :to="getContinueButtonDestination()"
          >Continue</router-link
        >
      </div>
    </Card>
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
  getTraitIntensityText,
  getDominantTraitLabel,
} = useAssessmentProgress();

const { getContinueButtonDestination } = useRevelations();

const assessment = getAssessmentFromSlug(assessmentSlug);
const thisAssessmentWithScore = getAssessmentWithScore(assessment);
const dominantTrait = getDominantTrait(thisAssessmentWithScore);
const isBalanced = thisAssessmentWithScore.score === 0;
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
</style>
