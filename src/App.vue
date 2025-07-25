<template>
  <div class="app-container shadow rounded-5" style="position: relative;">
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
import NavBar from './components/layout/NavBar.vue'
import Footer from './components/layout/Footer.vue'
import AppBackground from './components/layout/AppBackground.vue'
</script>

<style scoped>
</style>