<template>
  <div class="app">
    <nav class="navbar">
      <div class="container nav-container">
        <router-link to="/" class="nav-brand">
          <h1>
            <span class="gradient-text">Quiz</span>
            <span class="gradient-text-alt">App</span>
          </h1>
        </router-link>
        <div class="nav-links">
          <router-link to="/" class="nav-link" exact-active-class="active">Home</router-link>
          <router-link to="/quiz" class="nav-link" active-class="active">Quizzes</router-link>
          <router-link to="/results" class="nav-link" active-class="active">Results</router-link>
          <div class="nav-divider"></div>
          <template v-if="!authStore.isAuthenticated">
            <router-link to="/signin" class="nav-link btn btn-primary">Sign In</router-link>
          </template>
          <template v-else>
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
          <p class="copyright">&copy; 2024 Quiz App. All rights reserved.</p>
          <div class="footer-links">
            <a href="#" class="footer-link">Privacy Policy</a>
            <a href="#" class="footer-link">Terms of Service</a>
            <a href="#" class="footer-link">Contact</a>
          </div>
        </div>
      </div>
    </footer>
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
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.copyright {
  color: var(--text-muted);
  margin: 0;
}

.footer-links {
  display: flex;
  gap: var(--spacing-lg);
}

.footer-link {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color var(--transition);
}

.footer-link:hover {
  color: var(--primary);
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

  .footer-links {
    justify-content: center;
  }

  .user-info {
    display: none;
  }
}
</style>