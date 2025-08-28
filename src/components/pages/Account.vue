<template>
  <div class="container">
    <h2 class="mb-4 text-cinzel page-title">ACCOUNT</h2>

    <!-- Payment Success Banner -->
    <Alert
      v-if="paymentSuccess"
      type="success"
      :message="paymentSuccessMessage"
      closable
      @close="dismissAllMessages"
      class="my-4"
    />

    vCpsrxtaZVQm0Zv8bAiynlK2Lqp2
    uT3hojMzWSNouKDxsAFvc1scbpP2
    zpipokoUbmhNjr5gCSXkFUTfshI3
    v1l4hHUAAmOkRock7CBewiQyDSH2
    M68XyEpRuaTeT3lsQfd5UzdiJOH3



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
          <div class="user-details" v-if="userStore.firebaseUser">
            <div class="detail-item d-flex">
              <span class="label fw-bold me-2">Email:</span>
              <span class="value text-muted">{{
                userStore.firebaseUser.email
              }}</span>
            </div>
            <div class="detail-item d-flex">
              <span class="label fw-bold me-2">Account Created:</span>
              <span class="value text-muted">{{
                formatDate(userStore.user?.createdAt)
              }}</span>
            </div>
            <div class="detail-item d-flex" v-if="userStore.user?.payments.length">
              <p class="label fw-bold me-2">Payments:</p>
              <div>
                <p
                  class="value d-flex align-items-center"
                  v-for="payment in userStore.user?.payments"
                  :key="payment.id"
                >
                  <span class="text-muted">${{ payment.amount / 100 }}</span>
                  <span class="mx-2 text-muted">on</span>
                  <span class="text-muted">{{
                    new Date(payment.createdAt.toDate()).toLocaleDateString()
                  }}</span>
                </p>
              </div>
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
          <div class="subscription-benefits">
            <h4>Purchase to unlock:</h4>
            <ul class="list-unstyled">
              <li class="d-flex align-items-start mb-2">
                <span class="benefit-icon text-success me-2">✓</span>
                <span>10 additional AI personality analysis requests</span>
              </li>
            </ul>
          </div>

          <div class="payment-section mt-3">
            <div class="price-display">
              <div class="price-amount d-flex align-items-baseline">
                <span class="currency fs-5 fw-bold me-1">$</span>
                <span class="amount display-4">1.99</span>
              </div>
              <div class="price-details text-muted">
                One-time payment • Instant access
              </div>
            </div>

            <button
              @click="startCheckout"
              class="btn btn-primary mt-3"
              :disabled="isLoading"
            >
              {{ isLoading ? "Processing..." : "Buy Now" }}
            </button>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { useUserStore } from "../../stores/user";
import { useRoute, useRouter } from "vue-router";
import { computed, ref, onMounted } from "vue";
import Card from "../ui/Card.vue";
import Alert from "../ui/Alert.vue";
import { API_LIMITS } from "../../config/limits";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "/.netlify/functions";
const STRIPE_PUBLIC_KEY =
  import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_your_stripe_key_here";

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const stripePromise = ref<Promise<Stripe | null> | null>(null);
const isLoading = ref(false);
const paymentError = ref<string | null>(null);
const paymentSuccess = ref(false);
const paymentSuccessMessage = ref(
  "Payment successful! Enjoy all the benefits!"
);
const paymentCanceled = ref(false);
const paymentCanceledMessage = ref(
  "Your payment was canceled. No charges were made to your account."
);

onMounted(async () => {
  stripePromise.value = loadStripe(STRIPE_PUBLIC_KEY);

  if (route.query.payment_status) {
    if (route.query.payment_status === "success") {
      paymentSuccess.value = true;
      paymentError.value = null;
      paymentCanceled.value = false;
    } else if (route.query.payment_status === "canceled") {
      paymentCanceled.value = true;
      paymentError.value = null;
      paymentSuccess.value = false;
    }
  }
});

const formatDate = (dateString: { seconds: number } | undefined) => {
  if (!dateString) return "N/A";

  const date = new Date(dateString.seconds * 1000);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

const startCheckout = async () => {
  try {
    isLoading.value = true;
    paymentError.value = null;
    paymentSuccess.value = false;
    paymentCanceled.value = false;

    // Get the current user
    if (!userStore.user) {
      throw new Error("Authentication required. Please log in again.");
    }

    // Get the auth token
    let idToken;
    try {
      idToken = await userStore.getIdToken();
    } catch (tokenError) {
      console.error("Error getting ID token:", tokenError);
      throw new Error(
        "Failed to authenticate your session. Please try logging in again."
      );
    }

    // Create a checkout session on the backend
    const response = await fetch(`${BACKEND_URL}/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        userId: userStore.firebaseUser?.uid,
        userEmail: userStore.firebaseUser?.email,
        price: 199,
        productName: "Premium Subscription",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create checkout session");
    }

    const data = await response.json();

    // Redirect to Stripe Checkout
    window.location.href = data.url;
  } catch (error) {
    console.error("Checkout error:", error);
    if (error instanceof Error) {
      if (error.message.includes("Unexpected token")) {
        paymentError.value =
          "Error connecting to the payment server. Please try again later.";
      } else {
        paymentError.value =
          error.message || "An error occurred during checkout";
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

<style scoped></style>
