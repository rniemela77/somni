<template>
  <div class="sign-in-container fade-in">
    <div class="card auth-card">
      <h2 class="auth-title">Welcome Back</h2>
      <p class="auth-subtitle">Sign in to continue your learning journey</p>
      
      <form @submit.prevent="signIn" class="auth-form">
        <div class="form-group">
          <label class="form-label" for="email">Email</label>
          <input 
            id="email"
            v-model="email" 
            type="email" 
            class="form-control"
            placeholder="Enter your email"
            required
            :disabled="isLoading"
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="password">Password</label>
          <input 
            id="password"
            v-model="password" 
            type="password" 
            class="form-control"
            placeholder="Enter your password"
            required
            :disabled="isLoading"
          />
        </div>

        <button 
          type="submit" 
          class="btn btn-primary submit-btn" 
          :disabled="isLoading"
        >
          {{ isLoading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <div class="divider">
        <span>or</span>
      </div>

      <button 
        @click="signInWithGoogle" 
        class="btn btn-google" 
        :disabled="isLoading"
      >
        <svg class="google-icon" width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
          <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
        </svg>
        Continue with Google
      </button>

      <p v-if="message" 
         class="message mt-3" 
         :class="{ 'error': message.includes('Error') || message.includes('failed'), 'success': message.includes('successful') }">
        {{ message }}
      </p>

      <div class="auth-footer">
        <p>Don't have an account? 
          <router-link to="/signup" class="auth-link">Sign Up</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

export default {
  name: 'SignIn',
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const email = ref("");
    const password = ref("");
    const message = ref("");
    
    // Use the loading state from the auth store
    const isLoading = computed(() => authStore.loading);

    const signIn = async () => {
      message.value = "";
      
      try {
        const { error } = await authStore.signIn(email.value, password.value);
        
        if (error) {
          message.value = error;
        } else {
          message.value = "Login successful!";
          router.push('/quiz');
        }
      } catch (error) {
        message.value = error.message;
      }
    };

    const signInWithGoogle = async () => {
      message.value = "";
      
      try {
        const { error } = await authStore.signInWithGoogle();
        
        if (error) {
          message.value = error;
        } else {
          message.value = "Login successful!";
          router.push('/quiz');
        }
      } catch (error) {
        message.value = error.message;
      }
    };

    return {
      email,
      password,
      message,
      isLoading,
      signIn,
      signInWithGoogle
    };
  }
};
</script>

<style scoped>
.sign-in-container {
  max-width: 400px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.auth-card {
  padding: var(--spacing-xl);
}

.auth-title {
  text-align: center;
  margin-bottom: var(--spacing-xs);
}

.auth-subtitle {
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
}

.auth-form {
  margin-bottom: var(--spacing-md);
}

.submit-btn {
  width: 100%;
  margin-top: var(--spacing-lg);
}

.divider {
  position: relative;
  text-align: center;
  margin: var(--spacing-lg) 0;
}

.divider::before,
.divider::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 45%;
  height: 1px;
  background-color: var(--bg-muted);
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.divider span {
  background-color: var(--bg-card);
  padding: 0 var(--spacing-sm);
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.btn-google {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: white;
  color: var(--text-primary);
  border: 1px solid var(--bg-muted);
  gap: var(--spacing-sm);
}

.btn-google:hover {
  background-color: #f8f9fa;
}

.google-icon {
  fill: currentColor;
}

.auth-footer {
  text-align: center;
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--bg-muted);
}

.auth-link {
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
  transition: color var(--transition);
}

.auth-link:hover {
  color: var(--primary-dark);
}

.message {
  text-align: center;
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  background: var(--primary-bg);
  color: var(--primary);
}

.message.error {
  background: var(--error);
  color: white;
}

.message.success {
  background: var(--success);
  color: white;
}

@media (max-width: 768px) {
  .sign-in-container {
    padding: var(--spacing-md);
  }

  .auth-card {
    padding: var(--spacing-lg);
  }
}
</style>