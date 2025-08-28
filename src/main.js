import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
// Defer Bootstrap JS to a separate async chunk
void import(/* webpackChunkName: "bootstrap" */ "bootstrap/dist/js/bootstrap.bundle.min.js");
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles/global.css";
import "./styles/dark.css";
import { useUserStore } from "./stores/user";

// Create Vue application
const app = createApp(App);
const pinia = createPinia();
app.use(pinia);

// Initialize app data
async function initializeApp() {
  const userStore = useUserStore();
  await userStore.init();
}

// Initialize and mount app
initializeApp().then(() => {
  app.use(router);
  app.mount("#app");
});
