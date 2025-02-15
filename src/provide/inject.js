import { reactive } from "vue";
import { auth } from "../../firebase"; // Ensure the path is correct
import { signOut } from "firebase/auth";

export const userState = reactive({
  user: null,
});

auth.onAuthStateChanged((user) => {
  userState.user = user;
});

export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User logged out");
  } catch (error) {
    console.error("Error logging out:", error);
  }
};
