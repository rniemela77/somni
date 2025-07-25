# Somni - Personality Analysis App
## About
- Somni is an in-depth personality analysis app that examines both micro and macro aspects of your personality. At the micro level, it measures specific traits like Agreeableness. At the macro level, it identifies larger patterns, such as which Hero's Journey archetype your life story may follow.

- The app's goal is to help users understand their unique traits in a new light, showing them how to transform their statistically-uncommon qualities into practical, real-world strengths.

Creator: Robert Niemela

## Website URL

https://somni.netlify.app/

## Structure

- `/netlify/functions/` - Contains serverless functions for payment processing and user management
- `/src/` - Contains the Vue.js frontend application

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


## Updating Assessments
1. Make changes to `/data/personalityData.js`

   ```
   npm run seed:firestore
   ```

## Database
Firebase.google.com

## Notes
Netlify Functions:
- is a simple alternative to traditional backend servers
- are HTTP endpoints that run on-demand
- are located in /netlify/functions/
- can be tested locally using `netlify dev` command

Stripe:
- is a payment processing platform
- offers a webhook that can be used to trigger actions in your application

Firebase:
- allows you to connect your frontend to a database
- is an alternative to a traditional database
- offers authentication, realtime database, storage, and more