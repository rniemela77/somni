import stripe from './utils/stripe.js';
import { 
  initializeFirebase, 
  activateSubscriptionInFirebase, 
  markUserAsPaidInFirebase 
} from './utils/firebase.js';
import { success, error } from './utils/response.js';

export const handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return error('Method not allowed', 405);
  }
  
  let stripeEvent;
  
  try {
    // Initialize Firebase
    await initializeFirebase();
    
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (webhookSecret) {
      // Get the signature from the headers
      const signature = event.headers['stripe-signature'];
      
      // Verify the event using the webhook secret
      stripeEvent = stripe.webhooks.constructEvent(
        event.body,
        signature,
        webhookSecret
      );
    } else {
      // For testing without webhook signature verification
      stripeEvent = JSON.parse(event.body);
    }
    
    console.log(`Webhook received: ${stripeEvent.type}`);
    
    // Handle different event types
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        const session = stripeEvent.data.object;
        
        // Get the user ID from metadata
        const userId = session.metadata.userId;
        
        if (userId && userId !== 'anonymous') {
          console.log(`Processing successful payment for user ${userId}`);
          
          // Determine if this was a subscription or one-time payment
          if (session.metadata.product === 'premium_subscription') {
            // This was a subscription payment
            // Get subscription details if available
            const subscriptionId = session.subscription;
            
            // Activate the subscription in Firebase
            await activateSubscriptionInFirebase(
              userId, 
              session.id, 
              subscriptionId,
              session.customer
            );
            
            console.log(`Subscription activated for user ${userId}`);
          } else {
            // This was a one-time payment for quiz results
            await markUserAsPaidInFirebase(userId);
            console.log(`User ${userId} marked as paid`);
          }
        }
        break;
        
      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }
    
    return success({ received: true });
  } catch (err) {
    console.error(`Webhook error: ${err.message}`);
    return error(`Webhook Error: ${err.message}`, 400);
  }
}; 