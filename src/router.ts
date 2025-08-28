import { createRouter, createWebHistory, RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from "vue-router";
const SignUp = () => import("./components/pages/SignUp.vue");
const SignIn = () => import("./components/pages/SignIn.vue");
const Dashboard = () => import("./components/pages/Dashboard.vue");
const Account = () => import("./components/pages/Account.vue");
const Insights = () => import("./components/pages/Insights.vue");
const PrivacyPolicy = () => import("./components/pages/PrivacyPolicy.vue");
const TermsOfService = () => import("./components/pages/TermsOfService.vue");
const AssessmentView = () => import('./components/pages/Assessment.vue');
const AssessmentResult = () => import('./components/pages/AssessmentResult.vue');
const ResetPassword = () => import('./components/pages/ResetPassword.vue');
const Revelation = () => import('./components/pages/Revelation.vue');
import { useUserStore } from "./stores/user";

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
    path: "/reset-password",
    component: ResetPassword,
    name: 'reset-password',
    meta: { requiresGuest: true }
  },
  {
    path: "/assessment/:assessmentSlug",
    component: AssessmentView,
    name: 'assessment',
    meta: { requiresAuth: true }
  },
  {
    path: "/assessment-result/:assessmentSlug",
    component: AssessmentResult,
    name: 'assessment-result',
    meta: { requiresAuth: true }
  },
  {
    path: "/revelation/:revelationSlug",
    component: Revelation,
    name: 'revelation',
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
  scrollBehavior(_to, _from, savedPosition) {
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
  const requiresAuth = to.matched.some(record => record.meta?.requiresAuth);
  const requiresGuest = to.matched.some(record => record.meta?.requiresGuest);
  
  const userStore = useUserStore();
  
  // If auth is still initializing, wait for it to complete
  if (!userStore.isReady) {
    console.log('[Router] Auth not ready, waiting for initialization...');
    
    // Wait for the store to be initialized
    while (!userStore.isReady) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    console.log('[Router] Auth initialization complete');
  }

  // Auth is ready, proceed with normal guard logic
  const isAuthenticated = userStore.isAuthenticated;
  
  if (requiresAuth && !isAuthenticated) {
    console.log('[Router] Redirecting to sign in page due to missing authentication');
    next('/signin');
  } else if (requiresGuest && isAuthenticated) {
    console.log('[Router] Authenticated user accessing guest route, redirecting to dashboard');
    next('/');
  } else {
    next();
  }
});

export default router; 