// Mock environment variables for testing
process.env.OPENAI_API_KEY = 'test-api-key';
process.env.STRIPE_SECRET_KEY = 'test-stripe-key';
process.env.STRIPE_WEBHOOK_SECRET = 'test-webhook-secret';

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
}); 