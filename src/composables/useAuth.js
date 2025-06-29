import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

export function useAuth() {
  const router = useRouter();
  const authStore = useAuthStore();
  const email = ref("");
  const password = ref("");
  const message = ref("");
  const isProcessing = ref(false);
  
  // Computed properties for better state management
  const isReady = computed(() => !authStore.loading);
  const isAuthenticated = computed(() => authStore.isAuthenticated);
  const currentUser = computed(() => authStore.user);
  const errorMessage = computed(() => message.value);
  const isLoading = computed(() => isProcessing.value || authStore.loading);

  const handleAuth = async (action, redirectPath = '/quiz') => {
    // Don't start if already processing
    if (isProcessing.value) return;

    message.value = "";
    isProcessing.value = true;
    
    try {
      const { error } = await action();
      
      if (error) {
        message.value = error;
      } else {
        message.value = "Success!";
        router.push(redirectPath);
      }
    } catch (error) {
      message.value = error.message;
    } finally {
      isProcessing.value = false;
    }
  };

  const signIn = () => handleAuth(() => authStore.signIn(email.value, password.value));
  const signUp = () => handleAuth(() => authStore.signUp(email.value, password.value));
  const signInWithGoogle = () => handleAuth(() => authStore.signInWithGoogle());
  const logout = () => handleAuth(() => authStore.signOut(), '/signin');

  return {
    email,
    password,
    errorMessage,
    isLoading,
    isReady,
    isAuthenticated,
    currentUser,
    signIn,
    signUp,
    signInWithGoogle,
    logout
  };
} 