import { createRouter, createWebHistory } from "vue-router";
import SignUp from "./components/SignUp.vue";
import SignIn from "./components/SignIn.vue";
import Quiz from "./components/Quiz.vue";
import Results from "./components/Results.vue";
import Payment from "./components/Payment.vue";
import Success from "./components/Success.vue";
import Cancel from "./components/Cancel.vue";
import Home from "./components/Home.vue";
import Profile from "./components/Profile.vue";
import { auth } from "../firebase";

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
    path: "/results", 
    component: Results,
    name: 'results',
    meta: { requiresAuth: true }
  },
  { 
    path: "/profile", 
    component: Profile,
    name: 'profile',
    meta: { requiresAuth: true }
  },
  { 
    path: "/payment", 
    component: Payment,
    name: 'payment',
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
  const isAuthenticated = auth.currentUser;
  
  console.log('Router guard: Auth state =', isAuthenticated ? 'authenticated' : 'not authenticated');
  
  // Check if this is a return from payment
  const isPaymentReturn = to.query.payment_success === 'true';
  const hasSessionId = !!to.query.session_id;
  
  // Handle post-payment navigation specially
  if (isPaymentReturn && hasSessionId && to.path === '/profile') {
    console.log('Detected return from successful payment, allowing access to profile');
    
    // Store session ID in localStorage for verification if needed
    localStorage.setItem('stripe_session_id', to.query.session_id);
    
    // IMPORTANT: When returning from payment, we'll bypass auth check completely
    // This ensures the user can access the profile page even if Firebase hasn't
    // restored their auth state yet
    console.log('Bypassing auth check for post-payment return');
    next();
    return; // Important: exit the guard here
  }

  // Log authentication check
  if (requiresAuth) {
    console.log('Route requires auth, current auth state:', !!isAuthenticated);
  }

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
