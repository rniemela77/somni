import { createRouter, createWebHistory } from "vue-router";
import SignUp from "./components/SignUp.vue";
import SignIn from "./components/SignIn.vue";
import Quiz from "./components/Quiz.vue";
import Success from "./components/Success.vue";
import Cancel from "./components/Cancel.vue";
import Dashboard from "./components/Dashboard.vue";
import Account from "./components/Account.vue";
import { useAuthStore } from "./stores/auth";

const routes = [
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
  if (isAuthLoading) {
    console.log('Auth state is still loading, allowing navigation to proceed');
    // Allow the navigation to proceed - the loading screen in App.vue will handle the waiting
    next();
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
