import { createApp } from "vue";
import { createPinia } from 'pinia';
import App from "./App.vue";
import router from "./router";
import { useUserStore } from "./stores/user";
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

// Initialize application
async function initializeApp() {
  console.log('[App] Starting initialization...');
  try {
    // Initialize user store
    const userStore = useUserStore();
    await userStore.init();
    
    // Mount app
    app.mount("#app");
    console.log('[App] Application mounted');
  } catch (error) {
    console.error('[App] Failed to initialize:', error);
  }
}

// Start initialization
initializeApp();
