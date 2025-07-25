import { createApp } from "vue";
import { createPinia } from 'pinia';
import App from "./App.vue";
import router from "./router";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./styles/global.css";
import "./styles/dark.css";
import { useUserStore } from './stores/user';

// Create Vue application
const app = createApp(App);
const pinia = createPinia();

// Set up plugins
app.use(pinia);

const userStore = useUserStore();
userStore.init().then(() => {
  app.use(router);
  app.mount("#app");
  console.log('[App] Application mounted');
});
