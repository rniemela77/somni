import { createApp } from "vue";
import { createPinia } from 'pinia';
import App from "./App.vue";
import router from "./router";
import { useAuthStore } from "./stores/auth";
import "./styles/global.css";
import 'bootstrap/dist/css/bootstrap.min.css';

// Create Vue application
const app = createApp(App);
const pinia = createPinia();

// Set up plugins
app.use(pinia);
app.use(router);

// Initialize auth state using the centralized store method
const authStore = useAuthStore();

// Set up auth listener first
authStore.initAuthListener();

// Mount app immediately
// The loading screen will be shown until auth state is determined
app.mount("#app");

console.log('App initialized, auth loading state will show until Firebase confirms auth status');
