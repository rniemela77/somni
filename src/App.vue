<template>
  <div class="app-container px-1 px-md-3" style="position: relative;">
    <!-- Main App Content -->
    <NavBar />

    <main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="$route.fullPath"/>
        </transition>
      </router-view>
    </main>

    <Footer />
  </div>

  <AppBackground />
</template>

<script setup lang="ts">
import { onUnmounted, watch } from 'vue'
import NavBar from './components/layout/NavBar.vue'
import Footer from './components/layout/Footer.vue'
import AppBackground from './components/layout/AppBackground.vue'
import { useUserStore } from './stores/user'
import { useAssessmentStore } from './stores/assessment'

const userStore = useUserStore()
onUnmounted(() => {
  userStore.cleanupAuthListener()
})

// Load assessments only when authenticated; avoid fetching when logged out
const assessmentStore = useAssessmentStore();
watch(
  () => userStore.isAuthenticated,
  (isAuthenticated) => {
    if (isAuthenticated) {
      assessmentStore.fetchAllAssessments();
    }
  },
  { immediate: true }
)
</script>

<style scoped>
</style>