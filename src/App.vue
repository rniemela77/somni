<template>
  <div class="app-container shadow rounded-5">
    <!-- Auth Loading Screen -->
    <div v-if="userStore.loading" class="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div class="spinner-border text-primary" role="status" aria-label="Loading">
      </div>
      <p class="mb-0 ms-3">Loading...</p>
    </div>
    
    <!-- Main App Content -->
    <template v-else>
      <NavBar />

      <main>
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

      <Footer />
    </template>
  </div>

  <!-- <div class="app-bg"></div> -->

  <AppBackground />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from './stores/user';
import NavBar from './components/layout/NavBar.vue'
import Footer from './components/layout/Footer.vue'
import AppBackground from './components/layout/AppBackground.vue'

const userStore = useUserStore();

// Initialize auth state when app starts
onMounted(async () => {
  await userStore.init();
});
</script>