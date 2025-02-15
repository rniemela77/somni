<template>
  <div class="sign-up-container fade-in">
    <div class="card auth-card">
      <h2 class="auth-title">Create Account</h2>
      <p class="auth-subtitle">Join our community of learners</p>
      
      <form @submit.prevent="signUp" class="auth-form">
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
            placeholder="Choose a password"
            required
            :disabled="isLoading"
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="confirmPassword">Confirm Password</label>
          <input 
            id="confirmPassword"
            v-model="confirmPassword" 
            type="password" 
            class="form-control"
            placeholder="Confirm your password"
            required
            :disabled="isLoading"
          />
        </div>

        <button 
          type="submit" 
          class="btn btn-primary submit-btn" 
          :disabled="isLoading || !isPasswordMatch"
        >
          {{ isLoading ? 'Creating Account...' : 'Sign Up' }}
        </button>
      </form>

      <p v-if="!isPasswordMatch && password && confirmPassword" 
         class="message error mt-3">
        Passwords do not match
      </p>

      <p v-if="message" 
         class="message mt-3" 
         :class="{ 'error': message.includes('Error') || message.includes('failed'), 'success': message.includes('successful') }">
        {{ message }}
      </p>

      <div class="auth-footer">
        <p>Already have an account? 
          <router-link to="/signin" class="auth-link">Sign In</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default {
  name: 'SignUp',
  setup() {
    const router = useRouter();
    const email = ref("");
    const password = ref("");
    const confirmPassword = ref("");
    const message = ref("");
    const isLoading = ref(false);

    const isPasswordMatch = computed(() => {
      return password.value === confirmPassword.value;
    });

    const signUp = async () => {
      if (!isPasswordMatch.value) {
        message.value = "Passwords do not match";
        return;
      }

      isLoading.value = true;
      message.value = "";
      
      try {
        await createUserWithEmailAndPassword(auth, email.value, password.value);
        message.value = "Account created successfully!";
        router.push('/quiz');
      } catch (error) {
        message.value = error.message;
      } finally {
        isLoading.value = false;
      }
    };

    return {
      email,
      password,
      confirmPassword,
      message,
      isLoading,
      isPasswordMatch,
      signUp
    };
  }
};
</script>

<style scoped>
.sign-up-container {
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
  margin-bottom: var(--spacing-lg);
}

.submit-btn {
  width: 100%;
  margin-top: var(--spacing-lg);
}

.submit-btn:disabled {
  background: var(--bg-muted);
  cursor: not-allowed;
  transform: none;
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
  transition: color var(--transition-fast);
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
  .sign-up-container {
    padding: var(--spacing-md);
  }

  .auth-card {
    padding: var(--spacing-lg);
  }
}
</style>