import { createRouter, createWebHistory, RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import SignUp from "./components/pages/SignUp.vue";
import SignIn from "./components/pages/SignIn.vue";
import Dashboard from "./components/pages/Dashboard.vue";
import Account from "./components/pages/Account.vue";
import Insights from "./components/pages/Insights.vue";
import PrivacyPolicy from "./components/pages/PrivacyPolicy.vue";
import TermsOfService from "./components/pages/TermsOfService.vue";
import AssessmentView from './components/pages/Assessment.vue';
import { useUserStore } from "./stores/user";
import { watch } from "vue";

// Define custom meta types
interface RouteMeta {
  requiresAuth?: boolean;
  requiresGuest?: boolean;
}

// Extend the route record type to include our custom meta
type AppRouteRecord = RouteRecordRaw & {
  meta?: RouteMeta;
  children?: AppRouteRecord[];
};

const routes: AppRouteRecord[] = [
  { 
    path: "/", 
    component: Dashboard,
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
    path: "/assessment/:scaleId",
    component: AssessmentView,
    name: 'assessment',
    meta: { requiresAuth: true }
  },
  { 
    path: "/insights", 
    component: Insights,
    name: 'insights',
    meta: { requiresAuth: true }
  },
  { 
    path: "/account", 
    component: Account,
    name: 'account',
    meta: { requiresAuth: true }
  },
  { 
    path: "/privacy-policy", 
    component: PrivacyPolicy,
    name: 'privacy-policy'
  },
  { 
    path: "/terms-of-service", 
    component: TermsOfService,
    name: 'terms-of-service'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // If there's a saved position (browser back/forward), use it
    if (savedPosition) {
      return savedPosition;
    }
    // Otherwise, scroll to top for new navigation
    return { top: 0 };
  },
});

// Navigation guards with proper typing
router.beforeEach(async (
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const userStore = useUserStore();
  
  // Wait for auth to be ready
  if (!userStore.isReady) {
    await new Promise<void>((resolve) => {
      const unwatch = watch(() => userStore.isReady, (ready) => {
        if (ready) {
          unwatch();
          resolve();
        }
      });
    });
  }

  // Check if user is authenticated
  const isAuthenticated = userStore.isAuthenticated;

  // Handle guest routes (sign in, sign up, landing)
  if (to.meta.requiresGuest) {
    if (isAuthenticated) {
      return { name: 'dashboard' };
    }
    return;
  }

  // Handle protected routes
  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'signin' };
  }
  next();
});

export default router; 