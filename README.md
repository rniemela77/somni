# Somni - Personality Quiz App

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


## Quiz questions

- Questions are located in /quizData.js
- Seed the database with questions with `npm run seed`

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

## How the app works
- quiz questions are stored in /quizData.js, and seeded into the firebase database using `npm run seed`
- user authentication is handled by firebase
- frontend fetches quiz questions from the firebase database
- user quiz answers are stored in the firebase database
- home/dashboard has a button to generate a personality report
- the personality report instructions are in `config/personalityAnalysis.js`
- the personality report api call is in `netlify/functions/openai.js`
- the personality report is displayed on the dashboard