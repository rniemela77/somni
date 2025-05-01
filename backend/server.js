import dotenv from "dotenv";
dotenv.config();

import express from "express";
import Stripe from "stripe";
import cors from "cors";
import fs from 'fs/promises';
import path from 'path';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { readFile } from 'fs/promises';

// Load the service account key JSON file
const serviceAccountPath = new URL('./serviceAccountKey.json', import.meta.url);
const serviceAccount = JSON.parse(await readFile(serviceAccountPath, 'utf8'));

// Check if the STRIPE_SECRET_KEY is available
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("ERROR: STRIPE_SECRET_KEY is not defined in environment variables!");
  console.log("Make sure you have a .env file in the backend directory with STRIPE_SECRET_KEY defined.");
  process.exit(1);
}

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();

// Database file path - in a production app, use a real database
const DB_FILE = path.join(process.cwd(), 'backend', 'subscriptions.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const adminDb = getFirestore();

// Function to read subscriptions from JSON file
async function getSubscriptions() {
  try {
    // Create file if it doesn't exist
    try {
      await fs.access(DB_FILE);
    } catch (error) {
      await fs.writeFile(DB_FILE, JSON.stringify({}));
      return {};
    }
    
    const data = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading subscriptions:', error);
    return {};
  }
}

// Function to save subscriptions to JSON file
async function saveSubscription(userId, subscriptionData) {
  try {
    console.log(`Attempting to save subscription for user ${userId}`);
    console.log('Working directory:', process.cwd());
    console.log('DB_FILE path:', DB_FILE);
    
    const subscriptions = await getSubscriptions();
    
    // Debug log
    console.log('Current subscriptions:', JSON.stringify(subscriptions, null, 2));
    
    // Update or create subscription data for this user
    subscriptions[userId] = {
      ...subscriptionData,
      updatedAt: new Date().toISOString()
    };
    
    try {
      await fs.writeFile(DB_FILE, JSON.stringify(subscriptions, null, 2));
      console.log(`Saved subscription for user ${userId}`);
      
      // Verify file was written
      const written = await fs.readFile(DB_FILE, 'utf8');
      console.log('File content after write:', written.substring(0, 100) + '...');
      
      return true;
    } catch (writeError) {
      console.error('Error writing to subscription file:', writeError);
      return false;
    }
  } catch (error) {
    console.error('Error saving subscription:', error);
    return false;
  }
}

// Middleware
app.use(cors());
app.use(express.json({
  // This is needed for Stripe webhook verification
  verify: (req, res, buf) => {
    if (req.originalUrl.startsWith('/webhook')) {
      req.rawBody = buf.toString();
    }
  }
}));

// Route to create a Stripe checkout session
app.post("/create-checkout-session", async (req, res) => {
  try {
    // Get user ID from request body, if provided
    const { userId } = req.body || {};
    
    // Determine if this is a one-time payment or subscription
    const isSubscription = req.body.isSubscription !== false; // Default to subscription
    
    // Create different line items based on payment type
    const lineItems = [{
      price_data: {
        currency: "usd",
        product_data: {
          name: isSubscription ? "Quiz Analyzer Pro Subscription" : "Quiz Results",
          description: isSubscription ? 
            "Monthly subscription to premium personality insights" : 
            "Purchase access to your quiz results",
        },
        unit_amount: 1000, // Price in cents ($10.00)
        ...(isSubscription && { recurring: { interval: "month" } }),
      },
      quantity: 1,
    }];
    
    // Create the checkout session with appropriate parameters
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: isSubscription ? "subscription" : "payment",
      success_url: `${process.env.CLIENT_URL}/profile?payment_success=true&session_id={CHECKOUT_SESSION_ID}`, 
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      // Store user ID as metadata for reference
      metadata: { 
        userId: userId || "anonymous",
        product: isSubscription ? "premium_subscription" : "quiz_results"
      },
      // Add customer email if provided
      ...(req.body.userEmail && { customer_email: req.body.userEmail }),
      // Payment intent data only applies to non-subscription payments
      ...(isSubscription ? {} : {
        payment_intent_data: {
          metadata: {
            userId: userId || "anonymous",
            product: "quiz_results"
          },
        }
      }),
    });

    // After creating the session, also store a temporary record
    // This will be properly updated when payment is completed via webhook
    if (userId) {
      await updateSessionInFirebase(userId, session.id);
    }

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).send("Something went wrong.");
  }
});

// Enhanced endpoint to check subscription status
app.get("/subscription-status/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    
    // Query Firebase for the user's subscription status
    const userRef = adminDb.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return res.json({
        hasActiveSubscription: false,
        subscriptionData: null
      });
    }
    
    const userData = userDoc.data();
    
    // Check if user has a subscription object
    if (userData.subscription && userData.subscription.active) {
      console.log(`Found active subscription for user ${userId}`);
      
      // Check if the subscription has expired
      const endDate = userData.subscription.endDate?.toDate() || new Date(0);
      const now = new Date();
      
      if (endDate > now) {
        // Return subscription status
        return res.json({
          hasActiveSubscription: true,
          subscriptionData: userData.subscription
        });
      } else {
        console.log(`Subscription expired for user ${userId}`);
        return res.json({
          hasActiveSubscription: false,
          subscriptionData: {
            ...userData.subscription,
            status: 'expired'
          }
        });
      }
    }
    
    // Check if the user is marked as paid (simple payment)
    if (userData.isPaid === true) {
      return res.json({
        hasActiveSubscription: true,
        isPaid: true,
        paidAt: userData.paidAt
      });
    }
    
    // No active subscription or payment found
    res.json({
      hasActiveSubscription: false,
      subscriptionData: userData.subscription || null
    });
  } catch (error) {
    console.error("Error checking subscription status:", error);
    res.status(500).json({ error: "Failed to check subscription status" });
  }
});

// API endpoint to manually mark a user as paid (simplified from the subscription endpoint)
app.post("/activate-subscription/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log(`Marking user as paid via API: ${userId}`);
    
    if (!userId) {
      console.log('Error: User ID is required but was not provided');
      return res.status(400).json({ error: "User ID is required" });
    }
    
    // Mark the user as paid in Firebase
    const success = await markUserAsPaidInFirebase(userId);
    
    if (success) {
      console.log(`Successfully marked user ${userId} as paid`);
      res.json({ success: true, message: "User marked as paid successfully" });
    } else {
      console.log(`Failed to mark user ${userId} as paid`);
      res.status(500).json({ error: "Failed to mark user as paid" });
    }
  } catch (error) {
    console.error("Error marking user as paid:", error);
    res.status(500).json({ error: "Failed to mark user as paid" });
  }
});

// Function to activate subscription in Firebase
async function activateSubscriptionInFirebase(userId, sessionId, subscriptionId, customerId) {
  try {
    console.log(`Activating subscription in Firebase for user ${userId}`);
    
    // Generate subscription end date (one month from now)
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    
    // Update user document with subscription info
    const userRef = adminDb.collection('users').doc(userId);
    
    // Get existing document to ensure it exists
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      // Create user document if it doesn't exist
      await userRef.set({
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    
    // Update with subscription data
    await userRef.update({
      subscription: {
        active: true,
        stripeSessionId: sessionId || null,
        stripeSubscriptionId: subscriptionId || null,
        stripeCustomerId: customerId || null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        endDate: endDate,
        status: 'active',
        plan: 'monthly',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }
    });
    
    console.log(`Subscription successfully activated in Firebase for user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error activating subscription in Firebase:', error);
    return false;
  }
}

// Function to update subscription status in Firebase
async function updateSubscriptionInFirebase(userId, status, canceledAt = null) {
  try {
    console.log(`Updating subscription status in Firebase for user ${userId} to ${status}`);
    
    const userRef = adminDb.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (userDoc.exists && userDoc.data().subscription) {
      const subscriptionData = userDoc.data().subscription;
      
      await userRef.update({
        'subscription.active': status === 'active',
        'subscription.status': status,
        'subscription.updatedAt': admin.firestore.FieldValue.serverTimestamp(),
        ...(canceledAt && { 'subscription.canceledAt': canceledAt })
      });
      
      console.log(`Subscription status updated to ${status} for user ${userId}`);
      return true;
    } else {
      console.warn(`No subscription found for user ${userId}`);
      return false;
    }
  } catch (error) {
    console.error('Error updating subscription in Firebase:', error);
    return false;
  }
}

// Function to find user by subscription ID
async function findUserBySubscriptionId(subscriptionId) {
  try {
    console.log(`Finding user by subscription ID: ${subscriptionId}`);
    
    const usersSnapshot = await adminDb.collection('users')
      .where('subscription.stripeSubscriptionId', '==', subscriptionId)
      .limit(1)
      .get();
    
    if (usersSnapshot.empty) {
      console.warn(`No user found with subscription ID: ${subscriptionId}`);
      return null;
    }
    
    const userId = usersSnapshot.docs[0].id;
    console.log(`Found user ${userId} with subscription ID: ${subscriptionId}`);
    return userId;
  } catch (error) {
    console.error('Error finding user by subscription ID:', error);
    return null;
  }
}

// Function to store Stripe session data in Firebase
async function updateSessionInFirebase(userId, sessionId, status = 'pending') {
  try {
    console.log(`Storing session ${sessionId} for user ${userId} in Firebase`);
    
    // Update user document with session info
    const userRef = adminDb.collection('users').doc(userId);
    
    // Get existing document to ensure it exists
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      // Create user document if it doesn't exist
      await userRef.set({
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    
    // Update with session data
    await userRef.update({
      stripeSession: {
        sessionId: sessionId,
        status: status,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }
    });
    
    console.log(`Session data stored in Firebase for user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error storing session in Firebase:', error);
    return false;
  }
}

// Function to mark user as paid in Firebase
async function markUserAsPaidInFirebase(userId) {
  try {
    console.log(`Marking user ${userId} as paid in Firebase`);
    
    // Reference to user document
    const userRef = adminDb.collection('users').doc(userId);
    
    // Get existing document to ensure it exists
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      // Create user document if it doesn't exist
      await userRef.set({
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    
    // Update with paid status
    await userRef.update({
      isPaid: true,
      paidAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`User ${userId} successfully marked as paid in Firebase`);
    return true;
  } catch (error) {
    console.error('Error marking user as paid in Firebase:', error);
    return false;
  }
}

// Add Stripe webhook handler to process payment events
app.post('/webhook', async (req, res) => {
  let event;
  
  try {
    // Get the signature from the headers
    const signature = req.headers['stripe-signature'];
    
    // Verify the event using the webhook secret
    // In production, use a proper webhook secret from your env variables
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        webhookSecret
      );
    } else {
      // For testing without webhook signature verification
      event = req.body;
    }
    
    console.log(`Webhook received: ${event.type}`);
    
    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        
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
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error(`Webhook error: ${error.message}`);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

// API endpoint to check if a user is paid
app.get("/paid-status/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    
    // Query Firebase for the user's paid status
    const userRef = adminDb.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (userDoc.exists && userDoc.data().isPaid === true) {
      console.log(`User ${userId} is paid`);
      return res.json({
        isPaid: true,
        paidAt: userDoc.data().paidAt || null
      });
    } else {
      console.log(`User ${userId} is not paid`);
      return res.json({
        isPaid: false
      });
    }
  } catch (error) {
    console.error("Error checking paid status:", error);
    res.status(500).json({ error: "Failed to check paid status" });
  }
});

// Start the server
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
