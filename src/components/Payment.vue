<template>
    <div>
        <h2>Purchase Quiz Results</h2>
        <p>{{ message }}</p>
        <button @click="startCheckout">Pay $10</button>
    </div>
</template>

<script>
import { loadStripe } from "@stripe/stripe-js";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default {
    data() {
        return {
            message: "",
        };
    },
    methods: {
        async startCheckout() {
            try {
                // Use the backend URL
                const response = await fetch(`${BACKEND_URL}/create-checkout-session`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                });

                if (!response.ok) {
                    throw new Error("Failed to create checkout session");
                }

                const { sessionId } = await response.json();

                // Redirect to Stripe Checkout
                const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY); // Updated
                await stripe.redirectToCheckout({ sessionId });
            } catch (error) {
                console.error("Error creating checkout session:", error);
                this.message = "Failed to start payment. Please try again.";
            }
        },
    },
};
</script>

<style scoped>
button {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
</style>