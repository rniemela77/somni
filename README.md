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

2. Run the development server with Netlify functions:
   ```
   npm run dev:netlify
   ```

This will start both the frontend and the Netlify functions together.

## Deployment

To deploy to Netlify:

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Set up the environment variables in the Netlify dashboard
4. Deploy!

## API Endpoints

The following API endpoints are available:

- `/.netlify/functions/create-checkout-session` - Create a Stripe checkout session
- `/.netlify/functions/subscription-status/:userId` - Check subscription status
- `/.netlify/functions/activate-subscription/:userId` - Activate subscription manually
- `/.netlify/functions/webhook` - Handle Stripe webhooks
- `/.netlify/functions/paid-status/:userId` - Check if a user has paid

See the `/netlify/functions/README.md` file for more details on the functions.

# Website URL
https://somni.netlify.app/

# Backend local development
`cd backend && npm run server`

## Quiz questions
- Questions are located in /quizData.js
- Seed the database with questions with `npm run seed`

## Database
Firebase.google.com

## Payment
Stripe