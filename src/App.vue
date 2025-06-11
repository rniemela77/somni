<template>
  <div class="app">
    <!-- Auth Loading Screen -->
    <div v-if="authStore.loading" class="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="ms-3">Loading...</p>
    </div>
    
    <!-- Main App Content -->
    <template v-else>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container">
          <router-link to="/" class="navbar-brand">
            <h1 class="h3 mb-0">
              <span class="text-primary">Somni</span>
              <small class="text-muted d-block">Personality Analyzer</small>
            </h1>
          </router-link>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto mb-2 gap-3 mb-lg-0 align-items-center">
              <template v-if="!authStore.isAuthenticated">
                <li class="nav-item">
                  <router-link to="/" class="nav-link" exact-active-class="active">Home</router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/signin" class="btn btn-primary">Sign In</router-link>
                </li>
              </template>
              <template v-else>
                <li class="nav-item">
                  <router-link to="/" class="nav-link" exact-active-class="active">Dashboard</router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/quiz" class="nav-link" active-class="active">Analyzers</router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/account" class="nav-link" active-class="active">Account</router-link>
                </li>
                <li class="nav-item">
                  <button @click="handleSignOut" class="btn btn-outline-secondary">Sign Out</button>
                </li>
              </template>
            </ul>
          </div>
        </div>
      </nav>

      <main class="container my-5 mt-5">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

      <footer class="bg-light py-3">
        <div class="container text-center">
          <p class="mb-0">&copy; {{ new Date().getFullYear() }} Somni Personality Analyzer. Created by Robert Niemela - rvniemela@hotmail.com</p>
        </div>
      </footer>
    </template>
  </div>
</template>

<script>
import { useAuthStore } from './stores/auth';
import { useRouter } from 'vue-router';

export default {
  name: 'App',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const handleSignOut = async () => {
      const { error } = await authStore.logout();
      if (!error) {
        router.push('/signin');
      }
    };

    return {
      authStore,
      handleSignOut
    };
  }
};
</script>

<style>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>