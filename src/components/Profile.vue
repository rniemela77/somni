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
        <div v-if="firestoreUserData && firestoreUserData.isPaid" class="subscription-status-paid">
          <div class="premium-badge">Premium Access</div>
          <p class="subscription-info">
            You have full access to all premium features. Thank you for your support!
          </p>
          <p class="subscription-date" v-if="firestoreUserData.premiumPurchaseDate">
            Purchased on {{ formatDate(firestoreUserData.premiumPurchaseDate.toDate()) }}
          </p>
        </div>
        
        <div v-else>
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
                <span class="amount">1.99</span>
              </div>
              <div class="price-details">One-time payment • Instant access</div>
            </div>

            <button @click="startCheckout" class="payment-button" :disabled="isLoading">
              {{ isLoading ? 'Processing...' : 'Buy Now' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Success Banner -->
    <div v-if="paymentSuccess" class="payment-success-banner">
      <div class="success-icon">✓</div>
      <div class="success-message">
        <h3>Payment Successful!</h3>
        <p>{{ paymentSuccessMessage }}</p>
      </div>
      <button @click="dismissSuccessMessage" class="dismiss-btn">
        <i class="fas fa-times"></i>
      </button>
    </div>

    <!-- Payment Error Banner -->
    <div v-if="paymentError" class="payment-error-banner">
      <div class="error-icon">✗</div>
      <div class="error-message">
        <h3>Payment Error</h3>
        <p>{{ paymentError }}</p>
      </div>
      <button @click="dismissSuccessMessage" class="dismiss-btn">
        <i class="fas fa-times"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { loadStripe } from "@stripe/stripe-js";
import { useAuthStore } from '../stores/auth';
import { useRoute, useRouter } from 'vue-router';
import { getFirestore, doc, getDoc } from 'firebase/firestore';


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '/.netlify/functions';
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_your_stripe_key_here';

export default {
  name: 'ProfilePage',
  setup() {
    const authStore = useAuthStore();
    const route = useRoute();
    const router = useRouter();
    return { authStore, route, router };
  },
  data() {
    return {
      userInfo: null,
      waitingForAuth: false,
      isLoading: false,
      paymentError: null,
      paymentSuccess: false,
      stripePromise: null,
      firestoreUserData: null,
      paymentSuccessMessage: 'Your premium access has been activated successfully. Enjoy all the benefits!'
    };
  },
  async mounted() {
    console.log('Profile component mounted');

    // Initialize Stripe
    this.stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

    // Get the current authenticated user from the store
    const currentUser = this.authStore.getCurrentUser();
    console.log('Current user on mount:', currentUser?.uid || 'No user');

    await this.loadUserInfo();
    
    // Fetch complete user data from Firestore, including payment status
    if (currentUser) {
      await this.loadFirestoreUserData(currentUser.uid);
    }
    
    // Check for payment status from redirect
    if (this.route.query.payment_status) {
      if (this.route.query.payment_status === 'success') {
        console.log('Payment success detected in URL parameters');
        this.paymentSuccess = true;
        
        // Poll for Firestore data updates after successful payment
        if (currentUser) {
          this.pollForFirestoreUpdates(currentUser.uid);
        }
        
        // Clear query parameters to avoid showing success message on refresh
        this.router.replace({ query: {} });
      } else if (this.route.query.payment_status === 'canceled') {
        console.log('Payment cancellation detected in URL parameters');
        this.paymentError = 'Payment was canceled. Please try again.';
        this.router.replace({ query: {} });
      }
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
      console.log('Starting checkout');
      
      try {
        if (!this.userInfo) {
          throw new Error('User must be logged in to make a purchase');
        }
        
        this.isLoading = true;
        this.paymentError = null;
        
        // Get the current user
        const currentUser = this.authStore.getCurrentUser();
        if (!currentUser) {
          throw new Error('Authentication required. Please log in again.');
        }
        
        // Get the auth token
        let idToken;
        try {
          idToken = await currentUser.getIdToken();
        } catch (tokenError) {
          console.error('Error getting ID token:', tokenError);
          throw new Error('Failed to authenticate your session. Please try logging in again.');
        }
        
        // 1. Create a checkout session on the backend
        const response = await fetch(`${BACKEND_URL}/create-checkout-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify({
            userId: this.userInfo.uid,
            userEmail: this.userInfo.email,
            price: 199,
            productName: 'Premium Subscription'
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create checkout session');
        }
        
        const data = await response.json();
        
        // 2. Redirect to Stripe Checkout using the provided URL
        // This will use the same tab/window rather than opening a new one
        window.location.href = data.url;
      } catch (error) {
        console.error('Checkout error:', error);
        if (error.message.includes('Unexpected token')) {
          this.paymentError = 'Error connecting to the payment server. Please try again later.';
        } else {
          this.paymentError = error.message || 'An error occurred during checkout';
        }
      } finally {
        this.isLoading = false;
      }
    },
    dismissSuccessMessage() {
      this.paymentSuccess = false;
    },
    async loadFirestoreUserData(userId) {
      try {
        console.log('🔄 Loading Firestore data for user:', userId);
        const firestore = getFirestore();
        const userDoc = doc(firestore, 'users', userId);
        const userData = await getDoc(userDoc);

        if (userData.exists()) {
          this.firestoreUserData = userData.data();
          console.log('📊 Complete user object from Firestore:', {
            ...this.firestoreUserData,
            id: userId
          });
          console.log('💰 Payment status (isPaid):', this.firestoreUserData.isPaid 
            ? '✅ Paid' 
            : '❌ Not paid');
          
          // Log all fields related to payment/premium status
          const paymentFields = {
            isPaid: this.firestoreUserData.isPaid,
            isPremium: this.firestoreUserData.isPremium,
            premiumPurchaseDate: this.firestoreUserData.premiumPurchaseDate
          };
          console.log('💳 Payment-related fields:', paymentFields);
        } else {
          console.log('⚠️ No user data found in Firestore. User may not have completed payment yet.');
        }
      } catch (error) {
        console.error('❌ Error fetching user data from Firestore:', error);
      }
    },
    async pollForFirestoreUpdates(userId) {
      console.log('🔄 Starting to poll for Firestore payment updates...');
      
      // Check for payment status updates 5 times with a 3 second interval
      let attempts = 0;
      const maxAttempts = 5;
      const interval = 3000; // 3 seconds
      
      const pollInterval = setInterval(async () => {
        attempts++;
        console.log(`🔍 Checking for payment update (Attempt ${attempts}/${maxAttempts})...`);
        
        try {
          const firestore = getFirestore();
          const userDoc = doc(firestore, 'users', userId);
          const userData = await getDoc(userDoc);
          
          if (userData.exists()) {
            const data = userData.data();
            this.firestoreUserData = data;
            console.log('Current Firestore data:', data);
            
            if (data.isPaid) {
              console.log('✅ Payment confirmed in Firestore! isPaid=true');
              clearInterval(pollInterval);
            } else {
              console.log('⏳ Payment not yet reflected in Firestore (isPaid=false or missing)');
            }
          } else {
            console.log('⚠️ User document still not found in Firestore');
          }
        } catch (error) {
          console.error('❌ Error polling Firestore:', error);
        }
        
        // Stop polling after max attempts
        if (attempts >= maxAttempts) {
          console.log('⚠️ Max polling attempts reached. Webhook may not have been triggered yet.');
          clearInterval(pollInterval);
        }
      }, interval);
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

.payment-button,
.manage-button {
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
  margin-bottom: 16px;
}

.premium-badge::before {
  content: '✓';
  margin-right: 8px;
  font-weight: bold;
}

/* Premium subscription styles */
.subscription-status-paid {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.subscription-info {
  font-size: 1rem;
  color: var(--text-primary);
  margin: 8px 0;
  line-height: 1.5;
}

.subscription-date {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-top: 8px;
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

/* Payment Error Banner */
.payment-error-banner {
  background-color: rgba(209, 71, 71, 0.1);
  border: 1px solid var(--error);
  border-radius: var(--radius-sm);
  padding: 16px 20px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
}

.error-icon {
  background-color: var(--error);
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

.error-message {
  flex-grow: 1;
}

.error-message h3 {
  margin: 0 0 6px 0;
  font-size: 1.1rem;
  color: var(--error);
  border: none;
  padding: 0;
}

.error-message p {
  margin: 0;
  color: var(--text-primary);
  font-size: 0.9rem;
}
</style>
