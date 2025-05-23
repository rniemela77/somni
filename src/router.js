import { createRouter, createWebHistory } from "vue-router";
import SignUp from "./components/SignUp.vue";
import SignIn from "./components/SignIn.vue";
import Quiz from "./components/Quiz.vue";
import Success from "./components/Success.vue";
import Cancel from "./components/Cancel.vue";
import Home from "./components/Home.vue";
import Profile from "./components/Profile.vue";
import { useAuthStore } from "./stores/auth";

const routes = [
  { 
    path: "/", 
    component: Home,
    name: 'home'
  },
  { 
    path: "/signup", 
    component: SignUp,
    name: 'signup',
    meta: { requiresGuest: true }
  },
  { 
    path: "/signin", 
    component: SignIn,
    name: 'signin',
    meta: { requiresGuest: true }
  },
  { 
    path: "/quiz", 
    component: Quiz,
    name: 'quiz',
    meta: { requiresAuth: true }
  },
  { 
    path: "/profile", 
    component: Profile,
    name: 'profile',
    meta: { requiresAuth: true }
  },
  { 
    path: "/success", 
    component: Success,
    name: 'success',
    meta: { requiresAuth: true }
  },
  { 
    path: "/cancel", 
    component: Cancel,
    name: 'cancel',
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guards
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest);
  
  // Use the auth store for authentication check
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;
  const isAuthLoading = authStore.loading;
  
  console.log('Router guard: Auth state =', isAuthenticated ? 'authenticated' : 'not authenticated', 'loading =', isAuthLoading);
  
  // If auth is still loading, prevent navigation by waiting until auth is ready
  // Exception: allow initial navigation to home page even while loading
  if (isAuthLoading && to.path !== '/' && to.path !== '/signin' && to.path !== '/signup') {
    console.log('Auth state is still loading, delaying navigation until ready');
    
    // Check if this is a navigation triggered during app startup
    if (from.name === undefined || from.name === null) {
      console.log('Initial navigation, allowing to proceed to home page');
      next('/'); // Redirect to home where loading screen will be shown
      return;
    }
    
    // For non-initial navigation, stay on current page until auth is ready
    console.log('Non-initial navigation while auth loading, staying on current page');
    next(false);
    return;
  }
  
  // Log authentication check
  if (requiresAuth) {
    console.log('Route requires auth, current auth state:', isAuthenticated);
  }

  // Normal auth flow once loading is complete
  if (requiresAuth && !isAuthenticated) {
    console.log('Redirecting to sign in page due to missing authentication');
    next('/signin');
  } else if (requiresGuest && isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;
