<template>
  <div class="container">
    <h2 class="mb-4 fw-bold position-relative">Your Account</h2>

    <!-- Auth Status Message (temporary for debugging) -->
    <div v-if="waitingForAuth" class="alert alert-warning d-flex align-items-center">
      <div class="warning-icon me-2">!</div>
      <div class="warning-message">
        <h3>Authentication in progress...</h3>
        <p>Please wait while we restore your session.</p>
      </div>
    </div>

    <div class="row">
      <!-- User Information Section -->
      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title">Account Information</h3>
            <div class="user-details" v-if="userInfo">
              <div class="detail-item d-flex">
                <span class="label fw-bold me-2">Email:</span>
                <span class="value">{{ userInfo.email }}</span>
              </div>
              <div class="detail-item d-flex">
                <span class="label fw-bold me-2">Account Created:</span>
                <span class="value">{{ formatDate(userInfo.createdAt) }}</span>
              </div>
            </div>
            <div v-else class="loading-message text-muted fst-italic">
              Loading account information...
            </div>
          </div>
        </div>
      </div>

      <!-- Subscription Section -->
      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-body">
            <div v-if="firestoreUserData && firestoreUserData.isPaid" class="subscription-status-paid">
              <div class="badge bg-success mb-2">Premium Access</div>
              <p class="subscription-info">
                You have full access to all premium features. Thank you for your support!
              </p>
              <p class="subscription-date text-muted" v-if="firestoreUserData.premiumPurchaseDate">
                Purchased on {{ formatDate(firestoreUserData.premiumPurchaseDate.toDate()) }}
              </p>
            </div>
            
            <div v-else>
              <div class="subscription-benefits">
                <h4>Premium Benefits:</h4>
                <ul class="list-unstyled">
                  <li class="d-flex align-items-start mb-2">
                    <span class="benefit-icon text-success me-2">✓</span>
                    <span>Deeper personality insights and analytics</span>
                  </li>
                  <li class="d-flex align-items-start mb-2">
                    <span class="benefit-icon text-success me-2">✓</span>
                    <span>Unlimited quiz attempts and result storage</span>
                  </li>
                </ul>
              </div>

              <div class="payment-section mt-3">
                <div class="price-display">
                  <div class="price-amount d-flex align-items-baseline">
                    <span class="currency fs-5 fw-bold me-1">$</span>
                    <span class="amount display-4">1.99</span>
                  </div>
                  <div class="price-details text-muted">One-time payment • Instant access</div>
                </div>

                <button @click="startCheckout" class="btn btn-primary mt-3" :disabled="isLoading">
                  {{ isLoading ? 'Processing...' : 'Buy Now' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Success Banner -->
    <div v-if="paymentSuccess" class="alert alert-success d-flex align-items-center mt-4">
      <div class="success-icon me-2">✓</div>
      <div class="success-message">
        <h3>Payment Successful!</h3>
        <p>{{ paymentSuccessMessage }}</p>
      </div>
      <button @click="dismissSuccessMessage" class="btn-close ms-auto" aria-label="Close"></button>
    </div>

    <!-- Payment Error Banner -->
    <div v-if="paymentError" class="alert alert-danger d-flex align-items-center mt-4">
      <div class="error-icon me-2">✗</div>
      <div class="error-message">
        <h3>Payment Error</h3>
        <p>{{ paymentError }}</p>
      </div>
      <button @click="dismissSuccessMessage" class="btn-close ms-auto" aria-label="Close"></button>
    </div>
  </div>
</template>

<script>
import { loadStripe } from "@stripe/stripe-js";
import { useAuthStore } from '../stores/auth';
import { useRoute, useRouter } from 'vue-router';
import { UserService } from '../services/user.service';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '/.netlify/functions';
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_your_stripe_key_here';

export default {
  name: 'AccountPage',
  setup() {
    const authStore = useAuthStore();
    const route = useRoute();
    const router = useRouter();
    const userService = new UserService();
    return { authStore, route, router, userService };
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
    console.log('Account component mounted');

    // Initialize Stripe
    this.stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

    // Get the current authenticated user from the store
    const currentUser = this.authStore.user;
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
      const currentUser = this.authStore.user;

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
    async loadFirestoreUserData(userId) {
      try {
        const { data: userData, error } = await this.userService.getUser(userId);
        if (error) {
          console.error('Error loading user data:', error);
          return;
        }
        this.firestoreUserData = userData;
      } catch (error) {
        console.error('Error in loadFirestoreUserData:', error);
      }
    },
    async pollForFirestoreUpdates(userId) {
      const maxAttempts = 10;
      let attempts = 0;
      
      const pollInterval = setInterval(async () => {
        attempts++;
        
        const { data: userData, error } = await this.userService.getUser(userId);
        if (userData?.isPaid) {
          clearInterval(pollInterval);
          this.firestoreUserData = userData;
        } else if (attempts >= maxAttempts) {
          clearInterval(pollInterval);
          console.log('Max polling attempts reached');
        }
      }, 2000);
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
        const currentUser = this.authStore.user;
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
    }
  }
};
</script>

<style scoped>
</style>
