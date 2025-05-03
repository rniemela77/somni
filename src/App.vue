<template>
  <div class="app">
    <!-- Auth Loading Screen -->
    <div v-if="authStore.loading" class="auth-loading-screen">
      <div class="spinner"></div>
      <p>Loading...</p>
    </div>
    
    <!-- Main App Content -->
    <template v-else>
      <nav class="navbar">
        <div class="container nav-container">
          <router-link to="/" class="nav-brand">
            <h1>
              <span class="gradient-text">Somni</span>
              <div class="subtitle">Personality Analyzer</div>
            </h1>
          </router-link>
          <div class="nav-links">
            <router-link to="/" class="nav-link" exact-active-class="active">Home</router-link>
            
            <!-- Show these links only for authenticated users -->
            <template v-if="authStore.isAuthenticated">
              <router-link to="/quiz" class="nav-link" active-class="active">Analyzers</router-link>
            </template>
            
            <div class="nav-divider"></div>
            
            <!-- Authentication links -->
            <template v-if="!authStore.isAuthenticated">
              <router-link to="/signin" class="nav-link btn btn-primary">Sign In</router-link>
            </template>
            <template v-else>
              <router-link to="/profile" class="nav-link" active-class="active">Profile</router-link>
              <span class="user-info">{{ authStore.user.email }}</span>
              <button @click="handleSignOut" class="nav-link btn btn-outline">Sign Out</button>
            </template>
          </div>
        </div>
      </nav>

      <main class="main-content">
        <div class="container">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>

      <footer class="footer">
        <div class="container">
          <div class="footer-content">
            <p class="copyright">&copy; {{ new Date().getFullYear() }} Somni Personality Analyzer. Created by Robert Niemela - rvniemela@hotmail.com</p>
          </div>
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

.navbar {
  background-color: var(--bg-primary);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-md) 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid var(--bg-muted);
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  text-decoration: none;
  padding: var(--spacing-xs) var(--spacing-sm);
}

.gradient-text {
  color: var(--primary);
  font-size: var(--font-size-xl);
  font-weight: 600;
}

.subtitle {
  color: var(--secondary);
  font-size: var(--font-size-sm);
  font-weight: 500;
  margin-top: -5px;
}

.gradient-text-alt {
  color: var(--secondary);
  font-size: var(--font-size-xl);
  font-weight: 600;
}

.nav-links {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.nav-link {
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 500;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
  transition: color var(--transition);
  position: relative;
}

.nav-link:not(.btn)::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: var(--spacing-md);
  right: var(--spacing-md);
  height: 2px;
  background-color: var(--primary);
  opacity: 0;
  transition: opacity var(--transition);
}

.nav-link:not(.btn):hover::after,
.nav-link:not(.btn).active::after {
  opacity: 1;
}

.nav-link:not(.btn):hover,
.nav-link.active {
  color: var(--primary);
}

.nav-divider {
  width: 1px;
  height: 24px;
  background: var(--bg-muted);
  margin: 0 var(--spacing-sm);
}

.user-info {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.main-content {
  flex: 1;
  padding: var(--spacing-xl) 0;
  background-color: var(--bg-secondary);
}

.footer {
  background-color: var(--bg-primary);
  padding: var(--spacing-lg) 0;
  border-top: 1px solid var(--bg-muted);
}

.footer-content {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.copyright {
  color: var(--text-muted);
  margin: 0;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .nav-links {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }

  .nav-link {
    padding: var(--spacing-xs) var(--spacing-sm);
  }

  .nav-divider {
    display: none;
  }

  .footer-content {
    flex-direction: column;
    text-align: center;
  }

  .user-info {
    display: none;
  }
}

/* Auth Loading Screen */
.auth-loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--bg-secondary);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.auth-loading-screen .spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(58, 81, 153, 0.1);
  border-radius: 50%;
  border-top-color: var(--primary);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: var(--spacing-md);
}

.auth-loading-screen p {
  color: var(--text-secondary);
  font-weight: 500;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>