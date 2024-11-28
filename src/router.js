import { createRouter, createWebHistory } from "vue-router";
import SignUp from "./components/SignUp.vue";
import SignIn from "./components/SignIn.vue";
import Quiz from "./components/Quiz.vue";

const routes = [
  { path: "/", redirect: "/sign-up" },
  { path: "/sign-up", component: SignUp },
  { path: "/sign-in", component: SignIn },
  { path: "/quiz", component: Quiz },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
