<template>
  <div class="container">
    <h2 class="mb-4 fw-bold position-relative">Your Account</h2>

    <!-- Auth Status Message (temporary for debugging) -->
    <div v-if="userStore.loading" class="alert alert-warning d-flex align-items-center">
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
            <div v-if="userStore.isPaid" class="subscription-status-paid">
              <div class="badge bg-success mb-2">Premium Access</div>
              <p class="subscription-info">
                You have full access to all premium features. Thank you for your support!
              </p>
              <p class="subscription-date text-muted" v-if="userStore.premiumPurchaseDate">
                Purchased on {{ formatDate(userStore.premiumPurchaseDate.toDate()) }}
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

<script setup lang="ts">
import { loadStripe } from "@stripe/stripe-js";
import { useUserStore } from '../stores/user';
import { useRoute, useRouter } from 'vue-router';
import { computed, ref, onMounted } from 'vue';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '/.netlify/functions';
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_your_stripe_key_here';

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const stripePromise = ref(null);
const isLoading = ref(false);
const paymentError = ref(null);
const paymentSuccess = ref(false);
const paymentSuccessMessage = ref('Your premium access has been activated successfully. Enjoy all the benefits!');

// Computed properties for user data
const userInfo = computed(() => ({
  uid: userStore.user?.uid,
  email: userStore.user?.email,
  createdAt: userStore.user?.metadata.creationTime
}));

// Initialize component
onMounted(async () => {
  // Initialize Stripe
  stripePromise.value = loadStripe(STRIPE_PUBLIC_KEY);

  // Check for payment status from redirect
  if (route.query.payment_status) {
    if (route.query.payment_status === 'success') {
      console.log('Payment success detected in URL parameters');
      paymentSuccess.value = true;
      
      // Clear query parameters to avoid showing success message on refresh
      router.replace({ query: {} });
    } else if (route.query.payment_status === 'canceled') {
      console.log('Payment cancellation detected in URL parameters');
      paymentError.value = 'Payment was canceled. Please try again.';
      router.replace({ query: {} });
    }
  }
});

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

const startCheckout = async () => {
  console.log('Starting checkout');
  
  try {
    if (!userInfo.value) {
      throw new Error('User must be logged in to make a purchase');
    }
    
    isLoading.value = true;
    paymentError.value = null;
    
    // Get the current user
    const currentUser = userStore.user;
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
    
    // Create a checkout session on the backend
    const response = await fetch(`${BACKEND_URL}/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({
        userId: userInfo.value.uid,
        userEmail: userInfo.value.email,
        price: 199,
        productName: 'Premium Subscription'
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create checkout session');
    }
    
    const data = await response.json();
    
    // Redirect to Stripe Checkout
    window.location.href = data.url;
  } catch (error) {
    console.error('Checkout error:', error);
    if (error instanceof Error) {
      if (error.message.includes('Unexpected token')) {
        paymentError.value = 'Error connecting to the payment server. Please try again later.';
      } else {
        paymentError.value = error.message || 'An error occurred during checkout';
      }
    }
  } finally {
    isLoading.value = false;
  }
};

const dismissSuccessMessage = () => {
  paymentSuccess.value = false;
  paymentError.value = null;
};
</script>

<style scoped>
</style>
