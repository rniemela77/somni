import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { userState } from "./provide/inject";
import "./styles/global.css";

createApp(App).use(router).provide("userState", userState).mount("#app");
