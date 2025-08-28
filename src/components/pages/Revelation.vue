<template>
  <div class="revelation-card mx-auto text-center" shadow="dark">
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
    <div class="revelation-content" v-else>
      <h1 class="mt-0 mb-4 display-4 text-cinzel revelation-title">{{ thisRevelation.title }}</h1>
      <i class="text-primary my-4 text-description">{{ revelationConfig.description }}</i>
      <p class="my-4 text-details">{{ thisRevelation.details }}</p>
    </div>

    <div
      class="d-flex justify-content-center mt-5"
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
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "../../stores/user";
import { useRevelations } from "../../composables/useRevelations";
import Card from "../ui/Card.vue";

const userStore = useUserStore();
const { getRevelationContent, getRevelationBySlug } = useRevelations();

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
</script>

<style scoped>
.revelation-card {
  max-width: 500px;
}

.image-container {
  position: relative;
  height: 150px;
  user-select: none;
  pointer-events: none;

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
}


.text-description {
    display: block;
    margin: 0 auto;
    max-width: 380px!important;
}

.text-details {
    max-width: 500px!important;
    margin: 0 auto;
    font-size: 18px;
    line-height: 1.6;
    display: block;

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
</style>
