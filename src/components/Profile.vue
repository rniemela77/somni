<template>
  <div class="profile-container">
    <h2 class="section-title">Your Profile</h2>
    
    <!-- Auth Status Message (temporary for debugging) -->
    <div v-if="waitingForAuth" class="auth-waiting-banner">
      <div class="warning-icon">!</div>
      <div class="warning-message">
        <h3>Authentication in progress...</h3>
        <p>Please wait while we restore your session.</p>
      </div>
    </div>
    
    <!-- Payment Success Message -->
    <div v-if="showPaymentSuccess" class="payment-success-banner">
      <div class="success-icon">✓</div>
      <div class="success-message">
        <h3>Payment Successful!</h3>
        <p>Thank you for your purchase. Your premium membership is now active.</p>
      </div>
      <button @click="dismissSuccessMessage" class="dismiss-btn">&times;</button>
    </div>
    
    <div class="profile-content">
      <!-- User Information Section -->
      <div class="profile-section user-info-section">
        <h3>Account Information</h3>
        <div class="user-details" v-if="userInfo">
          <div class="detail-item">
            <span class="label">Email:</span>
            <span class="value">{{ userInfo.email }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Account Created:</span>
            <span class="value">{{ formatDate(userInfo.createdAt) }}</span>
          </div>
        </div>
        <div v-else class="loading-message">
          Loading account information...
        </div>
      </div>
      
      <!-- Subscription Section -->
      <div class="profile-section subscription-section">
        <h3>Premium Membership Status</h3>
        <div class="subscription-details">
          <div class="subscription-status" :class="{ 'has-subscription': isPremiumMember }">
            <div class="status-indicator"></div>
            <div class="status-text">
              <strong>{{ isPremiumMember ? 'Active' : 'Not Subscribed' }}</strong>
              <span v-if="isPremiumMember">Your premium membership is active</span>
              <span v-else>Upgrade to access premium features</span>
            </div>
          </div>
          
          <div class="subscription-benefits">
            <h4>Premium Benefits:</h4>
            <ul class="benefits-list">
              <li>
                <span class="benefit-icon">✓</span>
                <span>Deeper personality insights and analytics</span>
              </li>
              <li>
                <span class="benefit-icon">✓</span>
                <span>Unlimited quiz attempts and result storage</span>
              </li>
            </ul>
          </div>
          
          <div class="payment-section">
            <div class="price-display">
              <div class="price-amount">
                <span class="currency">$</span>
                <span class="amount">10</span>
              </div>
              <div class="price-details">One-time payment • Instant access</div>
            </div>
            
            <button v-if="!isPremiumMember" 
                    @click="startCheckout" 
                    :disabled="processingPayment" 
                    class="payment-button">
              {{ processingPayment ? 'Processing...' : 'Buy Now' }}
            </button>
            <div v-else class="premium-badge">
              Premium Member
            </div>
          </div>
          
          <div v-if="paymentMessage" class="payment-message" :class="{ error: paymentError }">
            {{ paymentMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { loadStripe } from "@stripe/stripe-js";
import { useAuthStore } from '../stores/auth';
import { useRoute } from 'vue-router';


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default {
  name: 'ProfilePage',
  setup() {
    const authStore = useAuthStore();
    const route = useRoute();
    return { authStore, route };
  },
  data() {
    return {
      userInfo: null,
      isPremiumMember: false,
      processingPayment: false,
      paymentMessage: '',
      paymentError: false,
      showPaymentSuccess: false,
      waitingForAuth: false
    };
  },
  async mounted() {
    console.log('Profile component mounted');
    
    // Get the current authenticated user from the store
    const currentUser = this.authStore.getCurrentUser();
    console.log('Current user on mount:', currentUser?.uid || 'No user');
    
    // Detect if we need to wait for authentication
    if (this.route.query.payment_success === 'true' && !currentUser) {
      console.log('Detected post-payment return but auth state not ready, waiting for auth state...');
      this.waitingForAuth = true;
      
      // Watch the auth store for changes instead of setting up a separate listener
      const unwatch = this.$watch(
        () => this.authStore.user,
        (newUser) => {
          if (newUser) {
            console.log('Auth state changed via store: user is now authenticated');
            this.waitingForAuth = false;
            this.loadUserInfo();
            this.checkPaidStatus();
            
            // Re-trigger payment success handling now that we have authentication
            console.log('Re-triggering payment success handling after authentication');
            this.checkPaymentSuccess();
            
            // Stop watching once we've handled the authentication
            unwatch();
          }
        }
      );
    } else {
      // Normal flow
      await this.loadUserInfo();
    }
  },
  methods: {
    async loadUserInfo() {
      const currentUser = this.authStore.getCurrentUser();
      
      if (currentUser) {
        console.log('Loading user info for:', currentUser.email);
        this.userInfo = {
          uid: currentUser.uid,
          email: currentUser.email,
          createdAt: currentUser.metadata.creationTime
        };
      } else {
        console.log('No current user found when loading user info');
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date);
    },
    async startCheckout() {
      if (this.processingPayment) return;
      
      this.processingPayment = true;
      this.paymentMessage = '';
      this.paymentError = false;
      
      try {
        console.log('Attempting to connect to backend at:', BACKEND_URL);
        
        const currentUser = this.authStore.getCurrentUser();
        if (!currentUser) {
          throw new Error('You must be logged in to make a purchase');
        }
        
        // Pass the current user ID and email to associate with the payment
        const response = await fetch(`${BACKEND_URL}/create-checkout-session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUser.uid,
            userEmail: currentUser.email
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server returned ${response.status}: ${errorText}`);
        }

        const { sessionId } = await response.json();
        console.log('Received session ID:', sessionId);

        // Redirect to Stripe Checkout
        const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
        console.log('Using Stripe key:', stripeKey ? 'Key exists (not showing for security)' : 'Missing key');
        
        const stripe = await loadStripe(stripeKey);
        if (!stripe) {
          throw new Error('Failed to initialize Stripe');
        }
        
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          throw new Error(error.message);
        }
      } catch (error) {
        console.error("Error creating checkout session:", error);
        this.paymentMessage = `Payment error: ${error.message}. Please check console for details.`;
        this.paymentError = true;
      } finally {
        this.processingPayment = false;
      }
    },
    dismissSuccessMessage() {
      this.showPaymentSuccess = false;
    }
  }
};
</script>

<style scoped>
.profile-container {
  max-width: 900px;
  margin: 0 auto;
}

.section-title {
  font-size: 1.4rem;
  margin-bottom: var(--spacing-xl);
  color: var(--text-primary);
  letter-spacing: -0.01em;
  font-weight: 500;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 0;
  width: 30px;
  height: 1px;
  background-color: var(--primary-light);
}

.profile-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 768px) {
  .profile-content {
    grid-template-columns: 1fr 2fr;
  }
}

.profile-section {
  background-color: var(--bg-primary);
  border-radius: var(--radius-sm);
  padding: 24px;
  box-shadow: var(--shadow-sm);
}

.profile-section h3 {
  margin-top: 0;
  color: var(--text-primary);
  font-size: 1.1rem;
  letter-spacing: -0.01em;
  margin-bottom: var(--spacing-md);
  font-weight: 500;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  padding-bottom: 12px;
}

/* User Info Section */
.user-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-item {
  display: flex;
  align-items: flex-start;
}

.detail-item .label {
  font-weight: 500;
  color: var(--text-secondary);
  min-width: 120px;
}

.detail-item .value {
  color: var(--text-primary);
}

/* Subscription Section */
.subscription-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.subscription-status {
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: var(--bg-secondary);
  padding: 16px;
  border-radius: var(--radius-sm);
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--warning);
}

.has-subscription .status-indicator {
  background-color: var(--success);
}

.status-text {
  display: flex;
  flex-direction: column;
}

.status-text strong {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.status-text span {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* Benefits List */
.subscription-benefits {
  margin-top: 8px;
}

.subscription-benefits h4 {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 12px;
  color: var(--text-primary);
}

.benefits-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.benefits-list li {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 8px;
  padding: 0;
  background: none;
}

.benefits-list li::before {
  display: none;
}

.benefit-icon {
  color: var(--primary);
  font-weight: bold;
}

/* Payment Section */
.payment-section {
  margin-top: 16px;
  border-top: 1px solid var(--bg-muted);
  padding-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.price-display {
  display: flex;
  flex-direction: column;
}

.price-amount {
  display: flex;
  align-items: baseline;
}

.currency {
  font-size: 1.2rem;
  font-weight: 500;
  margin-right: 2px;
  color: var(--text-primary);
}

.amount {
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-primary);
}

.price-details {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 4px;
}

.payment-button, .manage-button {
  padding: 10px 24px;
  border-radius: var(--radius-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: 1rem;
}

.payment-button {
  background-color: var(--primary);
  color: white;
  border: none;
}

.payment-button:hover {
  background-color: var(--primary-dark);
}

.payment-button:disabled {
  background-color: var(--bg-muted);
  cursor: not-allowed;
}

.manage-button {
  background-color: transparent;
  color: var(--primary);
  border: 1px solid var(--primary);
}

.manage-button:hover {
  background-color: rgba(58, 81, 153, 0.05);
}

.premium-badge {
  background-color: var(--success);
  color: white;
  padding: 10px 24px;
  border-radius: var(--radius-sm);
  font-weight: 500;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.premium-badge::before {
  content: '✓';
  margin-right: 8px;
  font-weight: bold;
}

.payment-message {
  padding: 10px 16px;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
}

.payment-message.error {
  background-color: rgba(209, 71, 71, 0.05);
  color: var(--error);
}

.loading-message {
  color: var(--text-muted);
  font-style: italic;
  font-size: 0.9rem;
}

/* Payment Success Banner */
.payment-success-banner {
  background-color: rgba(72, 187, 120, 0.1);
  border: 1px solid var(--success);
  border-radius: var(--radius-sm);
  padding: 16px 20px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
}

.success-icon {
  background-color: var(--success);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.success-message {
  flex-grow: 1;
}

.success-message h3 {
  margin: 0 0 6px 0;
  font-size: 1.1rem;
  color: var(--success);
  border: none;
  padding: 0;
}

.success-message p {
  margin: 0;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.dismiss-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  transition: all var(--transition-fast);
}

.dismiss-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--text-primary);
}

/* Authentication Status Banner */
.auth-waiting-banner {
  background-color: rgba(246, 173, 85, 0.1);
  border: 1px solid var(--warning);
  border-radius: var(--radius-sm);
  padding: 16px 20px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
}

.warning-icon {
  background-color: var(--warning);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  flex-shrink: 0;
}

.warning-message h3 {
  margin: 0 0 6px 0;
  font-size: 1.1rem;
  color: var(--warning);
  border: none;
  padding: 0;
}

.warning-message p {
  margin: 0;
  color: var(--text-primary);
  font-size: 0.9rem;
}
</style>
