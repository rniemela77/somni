// Mock node-fetch before requiring the module
jest.mock('node-fetch');

const { handler } = require('../openai');

describe('OpenAI Function', () => {
  const mockEvent = {
    httpMethod: 'POST',
    body: JSON.stringify({
      prompt: 'Test prompt',
      model: 'gpt-4',
      temperature: 0.7,
      max_tokens: 1000
    })
  };

  const mockContext = {};

  beforeEach(() => {
    // Reset fetch mock
    jest.clearAllMocks();
  });

  describe('HTTP Method Validation', () => {
    test('should return 405 for non-POST requests', async () => {
      const event = { ...mockEvent, httpMethod: 'GET' };
      
      const result = await handler(event, mockContext);
      
      expect(result.statusCode).toBe(405);
      expect(result.headers.Allow).toBe('POST');
      expect(JSON.parse(result.body)).toEqual({ error: 'Method Not Allowed' });
    });
  });

  describe('Request Validation', () => {
    test('should return 400 when prompt is missing', async () => {
      const event = {
        ...mockEvent,
        body: JSON.stringify({
          model: 'gpt-4',
          temperature: 0.7
        })
      };
      
      const result = await handler(event, mockContext);
      
      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body)).toEqual({ error: 'Prompt is required' });
    });

    test('should return 400 when body is invalid JSON', async () => {
      const event = {
        ...mockEvent,
        body: 'invalid json'
      };
      
      const result = await handler(event, mockContext);
      
      expect(result.statusCode).toBe(500);
      expect(JSON.parse(result.body).error).toBeDefined();
    });
  });

  describe('API Key Validation', () => {
    test('should return 500 when API key is not configured', async () => {
      const originalApiKey = process.env.OPENAI_API_KEY;
      delete process.env.OPENAI_API_KEY;
      
      const result = await handler(mockEvent, mockContext);
      
      expect(result.statusCode).toBe(500);
      expect(JSON.parse(result.body)).toEqual({ 
        error: 'API key not configured on server' 
      });
      
      // Restore API key
      process.env.OPENAI_API_KEY = originalApiKey;
    });
  });

  describe('OpenAI API Integration', () => {
    test('should successfully call OpenAI API with correct parameters', async () => {
      const mockResponse = {
        ok: true,
        text: () => Promise.resolve(JSON.stringify({
          choices: [{ message: { content: 'Test response' } }],
          usage: { total_tokens: 10 }
        }))
      };
      
      const fetch = require('node-fetch');
      fetch.mockResolvedValue(mockResponse);
      
      const result = await handler(mockEvent, mockContext);
      
      expect(result.statusCode).toBe(200);
      expect(JSON.parse(result.body)).toEqual({
        completion: 'Test response',
        usage: { total_tokens: 10 }
      });
      
      // Verify fetch was called with correct parameters
      expect(fetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-api-key'
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [{ role: 'user', content: 'Test prompt' }],
            temperature: 0.7,
            max_tokens: 1000
          })
        })
      );
    });

    test('should use default values when optional parameters are not provided', async () => {
      const event = {
        ...mockEvent,
        body: JSON.stringify({ prompt: 'Test prompt' })
      };
      
      const mockResponse = {
        ok: true,
        text: () => Promise.resolve(JSON.stringify({
          choices: [{ message: { content: 'Test response' } }],
          usage: { total_tokens: 10 }
        }))
      };
      
      const fetch = require('node-fetch');
      fetch.mockResolvedValue(mockResponse);
      
      const result = await handler(event, mockContext);
      
      expect(result.statusCode).toBe(200);
      
      // Verify default values were used
      expect(fetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/chat/completions',
        expect.objectContaining({
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [{ role: 'user', content: 'Test prompt' }],
            temperature: 0.7,
            max_tokens: 1000
          })
        })
      );
    });

    test('should handle OpenAI API errors', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        text: () => Promise.resolve(JSON.stringify({
          error: { message: 'Invalid API key' }
        }))
      };
      
      const fetch = require('node-fetch');
      fetch.mockResolvedValue(mockResponse);
      
      const result = await handler(mockEvent, mockContext);
      
      expect(result.statusCode).toBe(500);
      expect(JSON.parse(result.body)).toEqual({
        error: 'Invalid API key'
      });
    });

    test('should handle malformed OpenAI response', async () => {
      const mockResponse = {
        ok: true,
        text: () => Promise.resolve(JSON.stringify({
          choices: [] // No choices array
        }))
      };
      
      const fetch = require('node-fetch');
      fetch.mockResolvedValue(mockResponse);
      
      const result = await handler(mockEvent, mockContext);
      
      expect(result.statusCode).toBe(500);
      expect(JSON.parse(result.body)).toEqual({
        error: 'Invalid response format from OpenAI'
      });
    });

    test('should handle network errors', async () => {
      const fetch = require('node-fetch');
      fetch.mockRejectedValue(new Error('Network error'));
      
      const result = await handler(mockEvent, mockContext);
      
      expect(result.statusCode).toBe(500);
      expect(JSON.parse(result.body)).toEqual({
        error: 'Network error'
      });
    });
  });
}); 