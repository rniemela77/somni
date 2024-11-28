import { reactive } from "vue";
import { auth } from "../../firebase";

export const userState = reactive({
  user: null,
});

auth.onAuthStateChanged((user) => {
  userState.user = user;
});
