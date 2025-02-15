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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default {
  name: 'SignIn',
  setup() {
    const router = useRouter();
    const email = ref("");
    const password = ref("");
    const message = ref("");
    const isLoading = ref(false);

    const signIn = async () => {
      isLoading.value = true;
      message.value = "";
      
      try {
        await signInWithEmailAndPassword(auth, email.value, password.value);
        message.value = "Login successful!";
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
      message,
      isLoading,
      signIn
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
  margin-bottom: var(--spacing-lg);
}

.submit-btn {
  width: 100%;
  margin-top: var(--spacing-lg);
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
  .sign-in-container {
    padding: var(--spacing-md);
  }

  .auth-card {
    padding: var(--spacing-lg);
  }
}
</style>