import { createApp } from "vue";
import { createPinia } from 'pinia';
import App from "./App.vue";
import router from "./router";
import { auth } from "../firebase";
import { useAuthStore } from "./stores/auth";
import "./styles/global.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Initialize auth state
auth.onAuthStateChanged((user) => {
  const authStore = useAuthStore();
  authStore.setUser(user);
});

app.mount("#app");
