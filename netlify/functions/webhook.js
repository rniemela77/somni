import stripe from './utils/stripe.js';
import { 
  initializeFirebase, 
} from './utils/firebase.js';
import { success, error } from './utils/response.js';

export const handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return error('Method not allowed', 405);
  }

}; 