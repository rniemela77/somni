import dotenv from "dotenv";
dotenv.config();

import express from "express";
import Stripe from "stripe";
import cors from "cors";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route to create a Stripe checkout session
app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Quiz Results",
              description: "Purchase access to your quiz results",
            },
            unit_amount: 1000, // Price in cents ($10.00)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success`, // Dynamic success URL
      cancel_url: `${process.env.CLIENT_URL}/cancel`,  // Dynamic cancel URL
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).send("Something went wrong.");
  }
});

// Start the server
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
