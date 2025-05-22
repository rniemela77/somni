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
    
    // For local development without a webhook secret
    if (!webhookSecret) {
      console.log('⚠️ DEVELOPMENT MODE: No webhook secret found, skipping signature verification');
      try {
        stripeEvent = JSON.parse(event.body);
        console.log('📝 Parsed webhook payload directly, event type:', stripeEvent.type);
      } catch (error) {
        console.error('❌ Failed to parse webhook payload:', error.message);
        return {
          statusCode: 400,
          body: JSON.stringify({ message: `Failed to parse webhook payload: ${error.message}` })
        };
      }
    } else {
      // Production mode with signature verification
      const signature = event.headers['stripe-signature'];
      console.log('🔑 Webhook secret available:', !!webhookSecret);
      console.log('📝 Stripe signature received:', signature ? 'Yes' : 'No');
      
      if (!signature) {
        console.error('❌ Missing stripe-signature header');
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Webhook Error: Missing stripe-signature header' })
        };
      }
      
      // Log request body type for debugging
      console.log('📦 Request body type:', typeof event.body);
      console.log('📦 Request body length:', event.body?.length || 0);
      
      try {
        // Raw body is needed for signature verification
        stripeEvent = stripe.webhooks.constructEvent(
          event.body,
          signature,
          webhookSecret
        );
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
      
      if (!userId) {
        console.error('❌ No userId found in session metadata');
        throw new Error('No userId found in session metadata');
      }
      
      // Update the user's subscription status in Firestore
      const userRef = db.collection('users').doc(userId);
      console.log('📝 Updating user document:', userId);
      
      // Check if the user document exists
      const userDoc = await userRef.get();
      
      if (!userDoc.exists) {
        console.log(`✨ Creating new user document for userId: ${userId}`);
        // Create the user document if it doesn't exist
        await userRef.set({
          email: session.customer_email,
          isPremium: true,
          isPaid: true,
          premiumPurchaseDate: FieldValue.serverTimestamp(),
          createdAt: FieldValue.serverTimestamp()
        });
        console.log(`✅ New user document created with isPaid=true for ${userId}`);
      } else {
        // Update the existing user document
        await userRef.update({
          isPremium: true,
          isPaid: true,
          premiumPurchaseDate: FieldValue.serverTimestamp()
        });
        console.log(`✅ Existing user updated with isPaid=true for ${userId}`);
      }
      
      console.log(`User ${userId} subscription updated successfully`);
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