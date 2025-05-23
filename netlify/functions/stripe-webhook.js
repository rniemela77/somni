export const config = { bodyParser: false };

import stripe from './utils/stripe.js';
import { initializeFirebase } from './utils/firebase.js';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

/**
 * Netlify function to handle Stripe webhook events
 */
export async function handler(event, context) {
  console.log('💰 Stripe webhook received:', event.httpMethod, new Date().toISOString());
  
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    console.log('⚠️ Webhook rejected: Not a POST request');
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }
  
  try {
    // Initialize Firebase
    await initializeFirebase();
    const db = getFirestore();
    console.log('🔥 Firebase initialized for webhook processing');

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let stripeEvent;

    // Signature verification
    const signature = event.headers['stripe-signature'];
    if (!webhookSecret) {
      console.log('⚠️ DEVELOPMENT MODE: No webhook secret found, skipping signature verification');
      stripeEvent = JSON.parse(event.body);
      console.log('📝 Parsed webhook payload directly, event type:', stripeEvent.type);
    } else {
      console.log('🔑 Webhook secret available:', !!webhookSecret);
      if (!signature) {
        console.error('❌ Missing stripe-signature header');
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Webhook Error: Missing stripe-signature header' })
        };
      }

      // Raw body is needed for signature verification
      const buf = Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf8');
      try {
        stripeEvent = stripe.webhooks.constructEvent(buf, signature, webhookSecret);
        console.log('✅ Webhook signature verified, event type:', stripeEvent.type);
      } catch (error) {
        console.error('❌ Webhook signature verification failed:', error.message);
        return {
          statusCode: 400,
          body: JSON.stringify({ message: `Webhook Error: ${error.message}` })
        };
      }
    }

    // Handle different event types
    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object;
      console.log('💳 Processing completed checkout:', session.id);
      
      // Get the user ID from the client_reference_id
      const userId = session.client_reference_id;
      console.log('👤 User ID from session:', userId);
      
      if (!userId) throw new Error('No userId found in session metadata');
      
      // Update the user's subscription status in Firestore
      const userRef = db.collection('users').doc(userId);
      console.log('📝 Updating user document:', userId);
      
      // Check if the user document exists
      const userDoc = await userRef.get();
      if (!userDoc.exists) {
        await userRef.set({
          email: session.customer_email,
          isPremium: true,
          isPaid: true,
          premiumPurchaseDate: FieldValue.serverTimestamp(),
          createdAt: FieldValue.serverTimestamp()
        });
      } else {
        await userRef.update({
          isPremium: true,
          isPaid: true,
          premiumPurchaseDate: FieldValue.serverTimestamp()
        });
      }
    } else {
      console.log(`📌 Received non-checkout webhook event: ${stripeEvent.type}`);
    }

    // Return a success response
    console.log('✅ Webhook processed successfully');
    return {
      statusCode: 200,
      body: JSON.stringify({ received: true })
    };
  } catch (error) {
    console.error(`❌ Error processing webhook event: ${error.message}`);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: `Error processing webhook: ${error.message}` })
    };
  }
}
