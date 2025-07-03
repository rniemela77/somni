import { createRouter, createWebHistory, RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import SignUp from "./components/SignUp.vue";
import SignIn from "./components/SignIn.vue";
import Quiz from "./components/Quiz.vue";
import Success from "./components/Success.vue";
import Cancel from "./components/Cancel.vue";
import Dashboard from "./components/Dashboard.vue";
import Account from "./components/Account.vue";
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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guards with proper typing
router.beforeEach(async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const requiresAuth = to.matched.some(record => record.meta?.requiresAuth);
  const requiresGuest = to.matched.some(record => record.meta?.requiresGuest);
  
  // Use the user store for authentication check
  const userStore = useUserStore();
  const isAuthenticated = userStore.isAuthenticated;
  const isLoading = userStore.loading;
  
  // If auth is still loading, prevent navigation by waiting until auth is ready
  if (isLoading) {
    // Allow the navigation to proceed - the loading screen in App.vue will handle the waiting
    next();
    return;
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