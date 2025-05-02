import { reactive } from "vue";
import { auth } from "../../firebase"; // Ensure the path is correct
import { signOut } from "firebase/auth";
import { useAuthStore } from "../stores/auth";

// This reactive state is deprecated and only kept for backward compatibility
// Use the auth store (useAuthStore) instead for all new code
export const userState = reactive({
  user: null,
});

// Keep this updated via the centralized auth store - for compatibility
// This function can be used during app initialization
export const syncLegacyUserState = () => {
  const authStore = useAuthStore();
  
  // Set initial value
  userState.user = authStore.getCurrentUser();
  
  // Watch for changes to update the legacy state
  authStore.$subscribe((mutation, state) => {
    userState.user = state.user;
  });
};

// This logout function is deprecated
// Use authStore.logout() instead
export const logout = async () => {
  try {
    const authStore = useAuthStore();
    await authStore.logout();
    console.log("User logged out");
  } catch (error) {
    console.error("Error logging out:", error);
  }
};
