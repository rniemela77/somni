<template>
  <Card class="mx-auto" style="max-width: 400px;" shadow="dark">
    <h2 class="card-title text-center">Reset Password</h2>
    <p class="text-center text-muted">Enter your email to receive a reset link</p>
    <form @submit.prevent="handleResetPassword" class="mt-4">
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

      <button type="submit" class="btn btn-primary w-100" :disabled="userStore.isLoading">
        {{ userStore.isLoading ? 'Sending email...' : 'Send Reset Email' }}
      </button>

      <p v-if="successMessage" class="text-success text-center mt-3">{{ successMessage }}</p>
      <p v-if="userStore.error" class="text-danger text-center mt-3">{{ userStore.error }}</p>
      <router-link v-if="successMessage" to="/signin" class="btn text-primary w-100 mt-2">Back to Sign In</router-link>
    </form>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '../../stores/user';
import Card from '../ui/Card.vue';

const userStore = useUserStore();
const successMessage = ref<string>('');

const handleResetPassword = async () => {
  const { success } = await userStore.resetPassword();
  if (success) {
    successMessage.value = 'Password reset email sent. Please check your inbox (or spam folder).';
    userStore.email = '';
  }
};
</script>