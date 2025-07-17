import { createRouter, createWebHistory, RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import SignUp from "./components/SignUp.vue";
import SignIn from "./components/SignIn.vue";
import Quiz from "./components/Quiz.vue";
import Success from "./components/Success.vue";
import Cancel from "./components/Cancel.vue";
import Dashboard from "./components/Dashboard.vue";
import Account from "./components/Account.vue";
import PrivacyPolicy from "./components/PrivacyPolicy.vue";
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
    path: "/quiz", 
    component: Quiz,
    name: 'quiz',
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "quiz-list",
        component: () => import("./components/QuizList.vue")
      },
      {
        path: ":id",
        name: "quiz-detail",
        component: () => import("./components/QuizDetail.vue"),
        props: true
      }
    ]
  },
  { 
    path: "/account", 
    component: Account,
    name: 'account',
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
  },
  { 
    path: "/privacy-policy", 
    component: PrivacyPolicy,
    name: 'privacy-policy'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guards with proper typing
router.beforeEach(async (
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const requiresAuth = to.matched.some(record => record.meta?.requiresAuth);
  const requiresGuest = to.matched.some(record => record.meta?.requiresGuest);
  
  // Use the user store for authentication check
  const userStore = useUserStore();
  const isAuthenticated = userStore.isAuthenticated;
  const isReady = userStore.isReady;
  
  // If auth is still initializing, wait for it to complete
  if (!isReady) {
    // For protected routes, wait until auth is ready before proceeding
    if (requiresAuth) {
      console.log('[Router] Auth not ready, waiting for auth state...');
      
      // Wait for auth to be ready
      await new Promise<void>((resolve) => {
        const unsubscribe = userStore.$subscribe((_mutation, state) => {
          if (state.initialized && !state.loading) {
            unsubscribe();
            resolve();
          }
        });
      });
      
      // Re-check auth after waiting
      if (userStore.isAuthenticated) {
        next();
      } else {
        console.log('[Router] User not authenticated, redirecting to signin');
        next('/signin');
      }
      return;
    }
    
    // For non-protected routes, allow navigation but let App.vue handle loading
    next();
    return;
  }

  // Auth is ready, proceed with normal flow
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