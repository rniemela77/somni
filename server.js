import express from "express";
import Stripe from "stripe";
import cors from "cors";

const stripe = new Stripe("sk_test_51QQFgPFqyPsEGf4n1GLlgBdxZPkxeX2uXah4K6RLS0mMqTW4dWhqZvq4sBmRvdKrcBWXfCPvPjqH615wHJYYADrl00eEK5nVv9"); // Replace with your secret key
const app = express();

app.use(cors());
app.use(express.json());

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
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).send("Something went wrong.");
  }
});

const PORT = 4242;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
