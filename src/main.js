import { createApp } from "vue";
import { createPinia } from 'pinia';
import App from "./App.vue";
import router from "./router";
import { useAuthStore } from "./stores/auth";
import { syncLegacyUserState } from "./provide/inject";
import "./styles/global.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Initialize auth state using the centralized store method
const authStore = useAuthStore();
authStore.initAuthListener();

// Sync the legacy userState for backward compatibility
syncLegacyUserState();

app.mount("#app");
