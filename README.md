# Somni - Personality Quiz App

This project has been migrated from an Express server to Netlify serverless functions for payment processing and user management.

## Structure

- `/netlify/functions/` - Contains serverless functions for payment processing and user management
- `/backend/` - Contains the legacy Express server (now replaced by Netlify functions)
- `/src/` - Contains the Vue.js frontend application

## Environment Variables

Create a `.env` file in the project root with the following variables:

```
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
CLIENT_URL=http://localhost:8888
```

## Local Development

1. Install dependencies:

   ```
   npm install
   ```

2. (Optional) Run the development server with Stripe locally:

   This sets up a listener for Stripe webhooks on your local machine. 
   Without it, you can't test the payment process locally.


   i. Run this command in the root of the project:
   ```
   stripe listen \
   --api-key sk_test_... \
   --forward-to http://localhost:8888/.netlify/functions/stripe-webhook
   ```
   ii. It will provide you with a webhook secret, `whsec_...`
   Put that key in the .env file as `STRIPE_WEBHOOK_SECRET`
   

3. Run the development server with Netlify functions:

   ```
   npm run dev:netlify
   ```

# Website URL

https://somni.netlify.app/

## Quiz questions

- Questions are located in /quizData.js
- Seed the database with questions with `npm run seed`

## Database
Firebase.google.com