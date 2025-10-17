<template>
  <div class="revelation-card w-100 text-center" shadow="dark">
    <div class="image-container">
      <img src="/images/flame-sigil.png" class="icon" loading="lazy" />
      <img
        src="/images/flame-sigil.png"
        class="icon icon-glow"
        loading="lazy"
      />
    </div>

    <div
      class="revelation-content"
      v-if="userStore.generatingPersonalityAnalysis"
    >
      <h1 class="mt-0 text-cinzel">Revelation</h1>
      <p class="pulse-fade">Patterns are emerging... Please wait...</p>
    </div>
    <div class="revelation-content" v-else-if="!revelationConfig">
      <h1 class="mt-0">Revelation not found</h1>
      <p>This revelation doesn't exist.</p>
    </div>
    <div class="revelation-content" v-else-if="!thisRevelation">
      <h1 class="mt-0">Uncovering your revelation...</h1>
      <p>Something went wrong. Please try refreshing the page.</p>
    </div>
    <BeamParticleAnimation v-else>
      <div class="revelation-content">
        <h1 class="mt-0 mb-4 display-4 text-cinzel revelation-title">{{ thisRevelation.title }}</h1>
        <i class="text-primary my-4 text-description">{{ revelationConfig.description }}</i>
        <p class="my-4 text-details">{{ thisRevelation.details }}</p>
      </div>
    </BeamParticleAnimation>

    <div
      class="d-flex justify-content-center mt-2 continue-button-container"
      v-if="
        userStore.user &&
        !userStore.generatingPersonalityAnalysis &&
        thisRevelation
      "
    >
      <router-link class="btn btn-primary mx-auto" :to="{ name: 'home' }">
        Continue
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "../../stores/user";
import { useRevelations } from "../../composables/useRevelations";
import { useAssessmentProgress } from "../../composables/useAssessmentProgress";
import BeamParticleAnimation from "../ui/BeamParticleAnimation.vue";

const userStore = useUserStore();
const { getRevelationContent, getRevelationBySlug } = useRevelations();
const { totalCompletedAssessments } = useAssessmentProgress();

const route = useRoute();
const revelationSlug = computed(() => route.params.revelationSlug as string);

const revelationConfig = computed(() =>
  getRevelationBySlug(revelationSlug.value)
);
const revelationKey = computed(() => revelationConfig.value?.key || null);

const thisRevelation = computed(() => {
  if (!revelationKey.value) {
    return null;
  }
  return getRevelationContent(revelationKey.value);
});

// Determine if this revelation is unlocked based on completed assessments
const isUnlocked = computed(() => {
  if (!revelationConfig.value) return false;
  return totalCompletedAssessments.value >= (revelationConfig.value.requiredAssessments || 0);
});

// Auto-generate the revelation if it's unlocked, missing, and we're not already generating
const maybeGenerate = async () => {
  if (!revelationKey.value) return;
  if (userStore.generatingPersonalityAnalysis) return;
  if (!isUnlocked.value) return;
  if (thisRevelation.value && (thisRevelation.value as any).details) return;
  await userStore.generatePersonalityAnalysisForCluster(revelationKey.value);
};

onMounted(() => {
  void maybeGenerate();
});

watch([
  revelationKey,
  () => totalCompletedAssessments.value,
  thisRevelation,
], () => {
  void maybeGenerate();
});
</script>

<style scoped>
.image-container {
  position: relative;
  height: 150px;
  user-select: none;
  pointer-events: none;
  opacity: 0;
  animation: fadeInButton 1.6s ease-out forwards;
  animation-delay: 0.4s;

  .icon {
    width: 150px;
    height: 150px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  .icon-glow {
    z-index: 2;
    mix-blend-mode: screen;
    animation: pulse 2s infinite ease-in-out;
  }
}

.revelation-title {
    text-shadow: 0px 1px 2px var(--text-primary);
    opacity: 0;
    animation: fadeInButton 1.6s ease-out forwards;
    animation-delay: 0.8s;
}


.text-description {
    display: block;
    margin: 0 auto;
    max-width: 380px!important;
    opacity: 0;
    animation: fadeInButton 1.6s ease-out forwards;
    animation-delay: 1.1s;
}

.text-details {
    max-width: 500px!important;
    margin: 0 auto;
    font-size: 18px;
    line-height: 1.6;
    display: block;
    opacity: 0;
    animation: fadeInButton 3s ease-out forwards;
    animation-delay: 1.4s;

    &:first-letter {
        font-size: 1.5rem;
        font-weight: 600;
    }
}

.pulse-fade {
  animation: pulse-fade 1s infinite ease-in-out;
}

@keyframes pulse-fade {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.1;
  }
}

@keyframes pulse {
  0%,
  100% {
    filter: saturate(1) blur(5px);
  }
  50% {
    filter: saturate(5) blur(5px);
  }
}

.continue-button-container {
  opacity: 0;
  animation: fadeInButton 2s ease-out forwards;
  animation-delay: 2.2s; /* Start after main animation finishes */
}

@keyframes fadeInButton {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
