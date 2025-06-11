import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

export function useAuth() {
  const router = useRouter();
  const authStore = useAuthStore();
  const email = ref("");
  const password = ref("");
  const message = ref("");
  
  const isLoading = computed(() => authStore.loading);

  const handleAuth = async (action, redirectPath = '/quiz') => {
    message.value = "";
    
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
    }
  };

  const signIn = () => handleAuth(() => authStore.signIn(email.value, password.value));
  const signUp = () => handleAuth(() => authStore.signUp(email.value, password.value));
  const signInWithGoogle = () => handleAuth(() => authStore.signInWithGoogle());
  const logout = () => handleAuth(() => authStore.logout(), '/signin');

  return {
    email,
    password,
    message,
    isLoading,
    signIn,
    signUp,
    signInWithGoogle,
    logout
  };
} 