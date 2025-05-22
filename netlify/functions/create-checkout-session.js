import stripe from './utils/stripe.js';
import { initializeFirebase } from './utils/firebase.js';
import { getAuth } from 'firebase-admin/auth';

/**
 * Netlify function to create a Stripe checkout session
 */
export async function handler(event, context) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  // Ensure requests are POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed. Please use POST.' })
    };
  }

  try {
    // Initialize Firebase (from existing utils)
    await initializeFirebase();

    // Parse request body
    const requestBody = JSON.parse(event.body);
    
    // Get the ID token from the Authorization header
    const authHeader = event.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ message: 'Unauthorized. Missing or invalid token.' })
      };
    }

    const idToken = authHeader.split('Bearer ')[1];
    
    // Verify the ID token
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const userId = decodedToken.uid;
    
    // Get user data from request
    const { userEmail, price, productName } = requestBody;
    
    // Create a new checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName,
              description: 'One-time payment for premium access',
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      customer_email: userEmail,
      client_reference_id: userId, // Store user ID for reference
      mode: 'payment',
      success_url: `${event.headers.origin || process.env.FRONTEND_URL}/profile?payment_status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${event.headers.origin || process.env.FRONTEND_URL}/profile?payment_status=canceled`,
      metadata: {
        userId: userId
      }
    });

    // Return the session ID to the client
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        sessionId: session.id,
        url: session.url  // Include the direct checkout URL
      })
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: 'Failed to create checkout session', 
        error: error.message 
      })
    };
  }
} 