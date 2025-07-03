<template>
  <div class="app">
    <!-- Auth Loading Screen -->
    <div v-if="userStore.loading" class="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div class="spinner-border text-primary" role="status" aria-label="Loading">
      </div>
      <p class="mb-0 ms-3">Loading...</p>
    </div>
    
    <!-- Main App Content -->
    <template v-else>
      <NavBar />

      <main class="container my-5 mt-5">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

      <Footer />
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from './stores/user';
import NavBar from './components/NavBar.vue'
import Footer from './Footer.vue'

const userStore = useUserStore();

// Initialize auth state when app starts
onMounted(async () => {
  await userStore.init();
});
</script>

<style>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>