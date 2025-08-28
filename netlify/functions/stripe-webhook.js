export const config = { bodyParser: false };

import stripe from './utils/stripe.js';
import { initializeFirebase } from './utils/firebase.js';
import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';
import { success, error as errorResponse, handleOptions } from './utils/response.js';

/**
 * Netlify function to handle Stripe webhook events
 */
export async function handler(event, context) {
  
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }
  
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }
  
  try {
    // Initialize Firebase
    await initializeFirebase();
    const db = getFirestore();
    
    // Get webhook secret from environment
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    let stripeEvent;
    
    // Verify webhook signature in production
    if (webhookSecret) {
      const signature = event.headers['stripe-signature'];
      if (!signature) {
        return errorResponse('Missing Stripe signature', 400);
      }
      
      try {
        stripeEvent = stripe.webhooks.constructEvent(event.body, signature, webhookSecret);
      } catch (err) {
        return errorResponse('Invalid webhook signature', 400);
      }
    } else {
      // Development mode - parse directly
      stripeEvent = JSON.parse(event.body);
    }

    // Handle checkout.session.completed events
    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object;
      
      // Extract user ID from metadata
      const userId = session.metadata?.userId;
      if (!userId) {
        return errorResponse('No user ID found in session metadata', 400);
      }
      
      // Update user's paid status in Firestore
      const userRef = db.collection('users').doc(userId);
      const paymentData = {
        id: session.id,
        amount: session.amount_total,
        currency: session.currency,
        status: session.status,
        stripeCustomerId: session.customer,
        subscriptionId: session.subscription,
        createdAt: Timestamp.now(),
      }

      // add it to payments array
      await userRef.update({
        payments: FieldValue.arrayUnion(paymentData),
        updatedAt: FieldValue.serverTimestamp(),  
      }, { merge: true });
    }
    
    return success({ received: true });
  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    return errorResponse('Webhook processing failed', 500);
  }
}
