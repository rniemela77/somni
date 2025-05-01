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

                const { sessionId, url } = await response.json();

                // Open Stripe Checkout in a new window
                if (url) {
                    // If the backend provides a direct URL, use it
                    window.open(url, '_blank');
                } else {
                    // If no direct URL is provided, use the sessionId approach
                    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
                    const { error } = await stripe.redirectToCheckout({ sessionId });
                    
                    if (error) {
                        console.error('Stripe redirect error:', error);
                        this.message = "Failed to start payment. Please try again.";
                    }
                }
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