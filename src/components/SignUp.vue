<template>
  <div>
    <div class="card mx-auto" style="max-width: 400px;">
      <div class="card-body">
        <h2 class="card-title text-center">Create Account</h2>
        <p class="text-center text-muted">Join our community of learners</p>
        
        <form @submit.prevent="handleSignUp" class="mt-4">
          <div class="mb-3">
            <label class="form-label" for="email">Email</label>
            <input 
              id="email"
              v-model="userStore.email" 
              type="email" 
              class="form-control"
              placeholder="Enter your email"
              required
              :disabled="userStore.isLoading"
            />
          </div>

          <div class="mb-3">
            <label class="form-label" for="password">Password</label>
            <input 
              id="password"
              v-model="userStore.password" 
              type="password" 
              class="form-control"
              placeholder="Choose a password"
              required
              :disabled="userStore.isLoading"
            />
          </div>

          <div class="mb-3">
            <label class="form-label" for="confirmPassword">Confirm Password</label>
            <input 
              id="confirmPassword"
              v-model="confirmPassword" 
              type="password" 
              class="form-control"
              placeholder="Confirm your password"
              required
              :disabled="userStore.isLoading"
            />
          </div>

          <button 
            type="submit" 
            class="btn btn-primary w-100" 
            :disabled="userStore.isLoading || !isPasswordMatch"
          >
            {{ userStore.isLoading ? 'Creating Account...' : 'Sign Up' }}
          </button>
        </form>

        <div class="text-center my-3">
          <span>or</span>
        </div>

        <button 
          @click="handleGoogleSignIn" 
          class="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center" 
          :disabled="userStore.isLoading"
        >
          <svg class="me-2" width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
            <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
          </svg>
          Continue with Google
        </button>

        <p v-if="!isPasswordMatch && userStore.password && confirmPassword" 
           class="text-danger text-center mt-3">
          Passwords do not match
        </p>

        <p v-if="userStore.error" 
           class="text-center mt-3 text-danger">
          {{ userStore.error }}
        </p>

        <div class="text-center mt-4">
          <p>Already have an account? 
            <router-link to="/signin" class="text-primary">Sign In</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();
const confirmPassword = ref<string>("");

const isPasswordMatch = computed<boolean>(() => {
  return userStore.password === confirmPassword.value;
});

const handleSignUp = async (): Promise<void> => {
  if (!isPasswordMatch.value) {
    userStore.error = "Passwords do not match";
    return;
  }
  
  const { success } = await userStore.signUp();
  if (success) {
    router.push('/quiz');
  }
};

const handleGoogleSignIn = async (): Promise<void> => {
  const { success } = await userStore.signInWithGoogle();
  if (success) {
    router.push('/quiz');
  }
};
</script>

<style scoped>
</style>