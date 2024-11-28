import { createRouter, createWebHistory } from "vue-router";
import SignUp from "./components/SignUp.vue";
import SignIn from "./components/SignIn.vue";
import Quiz from "./components/Quiz.vue";
import Results from "./components/Results.vue";
import Payment from "./components/Payment.vue";
import Success from "./components/Success.vue";
import Cancel from "./components/Cancel.vue";

const routes = [
  { path: "/", redirect: "/sign-up" },
  { path: "/sign-up", component: SignUp },
  { path: "/sign-in", component: SignIn },
  { path: "/quiz", component: Quiz },
  { path: "/results", component: Results },
  { path: "/payment", component: Payment }, // Payment page
  { path: "/success", component: Success }, // Success page
  { path: "/cancel", component: Cancel },   // Cancel page
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
