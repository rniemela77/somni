import { createApp } from "vue";
import { createPinia } from 'pinia';
import App from "./App.vue";
import router from "./router";
import { useAuthStore } from "./stores/auth";
import { authService } from './services/firebase-auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./styles/global.css";
// Create Vue application
const app = createApp(App);
const pinia = createPinia();

// Set up plugins
app.use(pinia);
app.use(router);

// Initialize auth state using the centralized store method
const authStore = useAuthStore();

console.log('[App] Starting application initialization');

// Set up auth listener
authService.onAuthStateChanged(async (user) => {
  await authStore.setUser(user);
});

// Mount app immediately
// The loading screen will be shown until auth state is determined
app.mount("#app");

console.log('App initialized, auth loading state will show until Firebase confirms auth status');
