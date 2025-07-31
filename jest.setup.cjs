// Mock environment variables for testing
process.env.OPENAI_API_KEY = 'test-api-key';
process.env.STRIPE_SECRET_KEY = 'test-stripe-key';
process.env.STRIPE_WEBHOOK_SECRET = 'test-webhook-secret';

// Suppress console.error for expected error tests
const originalConsoleError = console.error;
beforeEach(() => {
  jest.clearAllMocks();
  // Suppress console.error during tests
  console.error = jest.fn();
});

afterEach(() => {
  // Restore console.error after each test
  console.error = originalConsoleError;
}); 