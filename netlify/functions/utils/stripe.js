import Stripe from 'stripe';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Check if the STRIPE_SECRET_KEY is available
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("ERROR: STRIPE_SECRET_KEY is not defined in environment variables!");
  console.log("Make sure you have a .env file with STRIPE_SECRET_KEY defined.");
}

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default stripe; 