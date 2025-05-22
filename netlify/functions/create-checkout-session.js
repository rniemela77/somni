import stripe from './utils/stripe.js';
import { initializeFirebase, updateSessionInFirebase } from './utils/firebase.js';
import { success, error, handleOptions } from './utils/response.js';

export const handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }
  
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return error('Method not allowed', 405);
  }
  
  try {
    // Initialize Firebase
    await initializeFirebase();
    
    // Parse the request body
    const body = JSON.parse(event.body || '{}');
    
    // Get user ID from request body, if provided
    const { userId } = body || {};
    
    // Create different line items based on payment type
    const lineItems = [{
      price_data: {
        currency: "usd",
        product_data: {
          name: "Somni AI Personality Quiz",
          description: "Purchase access to quiz results",
        },
        unit_amount: 1000, // Price in cents ($10.00)
      },
      quantity: 1,
    }];

    const data = {
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/profile?payment_success=true&session_id={CHECKOUT_SESSION_ID}`, 
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      // Store user ID as metadata for reference
      metadata: { 
        userId: userId || "anonymous",
        product: "quiz_results"
      },
      // Add customer email if provided
      ...(body.userEmail && { customer_email: body.userEmail }),
      // Add payment intent metadata
      payment_intent_data: {
        metadata: {
          userId: userId || "anonymous",
          product: "quiz_results"
        }
      }
    };
    
    // Create the checkout session with appropriate parameters
    const session = await stripe.checkout.sessions.create(data);

    // After creating the session, also store a temporary record
    // This will be properly updated when payment is completed via webhook
    if (userId) {
      await updateSessionInFirebase(userId, session.id);
    }

    // Return both the sessionId and the checkout URL
    return success({ 
      sessionId: session.id,
      url: session.url  // Stripe's session object includes a URL property
    });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    return error("Failed to create checkout session", 500);
  }
}; 