<template>
  <div>
    <Card class="mx-auto" shadow="dark">
        <h2 class="card-title text-center">Create Account</h2>
        
        <form @submit.prevent="handleSignUp" class="mt-4">
          <div class="mb-3">
            <label class="form-label" for="email">Email</label>
            <input 
              id="email"
              v-model="userStore.email" 
              type="email" 
              class="form-control"
              placeholder="Enter your email"
              autocomplete="email"
              required
              :disabled="userStore.isLoading"
            />
          </div>

          <div class="mb-3">
            <label class="form-label" for="password">Password</label>
            <input 
              id="password"
              v-model="password" 
              type="password" 
              class="form-control"
              placeholder="Choose a password"
              required
              :disabled="userStore.isLoading"
            />
            <small class="form-text text-muted">Password should be at least 6 characters</small>
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

          <p v-if="!isPasswordMatch && password && confirmPassword" 
             class="text-danger text-center mt-3">
            Passwords do not match
          </p>

          <p v-if="userStore.error" class="text-center mt-3 text-danger">
            {{ userStore.error }}
          </p>

          <Button 
            type="submit" 
            variant="primary" 
            class="w-100" 
            :disabled="userStore.isLoading || !isPasswordMatch"
          >
            {{ userStore.isLoading ? 'Creating Account...' : 'Sign Up' }}
          </Button>
        </form>

        <div class="text-center my-3">
          <span>or</span>
        </div>

        <Button 
          @click="handleGoogleSignIn" 
          outline variant="secondary" 
          class="w-100 d-flex align-items-center justify-content-center" 
          :disabled="userStore.isLoading"
        >
          <svg class="me-2" width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
            <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
          </svg>
          Continue with Google
        </Button>

        <div class="text-center mt-4">
          <p>Already have an account? 
            <router-link to="/signin" class="text-primary">Sign In</router-link>
          </p>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '../../stores/user';
import { useRouter } from 'vue-router';
import Card from '../ui/Card.vue';
import Button from '../ui/Button.vue';

const userStore = useUserStore();
const router = useRouter();
const password = ref<string>("");
const confirmPassword = ref<string>("");

const isPasswordMatch = computed<boolean>(() => {
  return password.value === confirmPassword.value;
});

const handleSignUp = async (): Promise<void> => {
  if (!isPasswordMatch.value) {
    userStore.error = "Passwords do not match";
    return;
  }
  
  const { success } = await userStore.signUp(password.value);
  if (success) {
    router.push('/');
  }
};

const handleGoogleSignIn = async (): Promise<void> => {
  const { success } = await userStore.signInWithGoogle();
  if (success) {
    router.push('/');
  }
};
</script>

<style scoped>
</style>