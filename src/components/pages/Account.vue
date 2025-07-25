<template>
  <div class="container">
    <h2 class="mb-4 fw-bold position-relative">Your Account</h2>

    <!-- Payment Success Banner -->
    <Alert
      v-if="paymentSuccess"
      type="success"
      :message="paymentSuccessMessage"
      closable
      @close="dismissAllMessages"
      class="my-4"
    />

    <!-- Payment Error Banner -->
    <Alert
      v-if="paymentError"
      type="error"
      :message="paymentError"
      closable
      @close="dismissAllMessages"
      class="my-4"
    />

    <!-- Payment Canceled Banner -->
    <Alert
      v-if="paymentCanceled"
      type="warning"
      :message="paymentCanceledMessage"
      closable
      @close="dismissAllMessages"
      class="my-4"
    />

    <div class="row align-items-start">
      <!-- User Information Section -->
      <div class="col-md-6 mb-4">
        <Card>
          <h3>Account Information</h3>
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
        </Card>
      </div>

      <!-- Subscription Section -->
      <div class="col-md-6 mb-4">
        <Card>
          <div v-if="userStore.isPaid" class="subscription-status-paid">
            <div class="badge bg-success mb-2">Premium Access</div>
            <p class="subscription-info">
              You have full access to all premium features. Thank you for your support!
            </p>
            <p class="subscription-date text-muted" v-if="userStore.user?.metadata?.creationTime">
              Purchased on {{ formatDate(userStore.user.metadata.creationTime) }}
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
                  <span>Unlimited assessment attempts and result storage</span>
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
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { useUserStore } from '../../stores/user';
import { useRoute, useRouter } from 'vue-router';
import { computed, ref, onMounted } from 'vue';
import Card from '../ui/Card.vue';
import Alert from '../ui/Alert.vue';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '/.netlify/functions';
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_your_stripe_key_here';

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const stripePromise = ref<Promise<Stripe | null> | null>(null);
const isLoading = ref(false);
const paymentError = ref<string | null>(null);
const paymentSuccess = ref(false);
const paymentSuccessMessage = ref('Your premium access has been activated successfully. Enjoy all the benefits!');
const paymentCanceled = ref(false);
const paymentCanceledMessage = ref('Your payment was canceled. No charges were made to your account.');

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
      paymentSuccess.value = true;
      paymentError.value = null;
      paymentCanceled.value = false;
    } else if (route.query.payment_status === 'canceled') {
      paymentCanceled.value = true;
      paymentError.value = null;
      paymentSuccess.value = false;
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
    paymentSuccess.value = false;
    paymentCanceled.value = false;

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

const dismissAllMessages = () => {
  paymentSuccess.value = false;
  paymentError.value = null;
  paymentCanceled.value = false;
  router.replace({ query: {} });
};
</script>

<style scoped>
</style>
