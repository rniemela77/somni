// Netlify function to proxy OpenAI API requests
// This ensures API keys are never exposed to the client
const fetch = require('node-fetch');

exports.handler = async function(event, context) {

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
      headers: {
        'Allow': 'POST'
      }
    };
  }

  try {
    // Parse the request body
    const requestBody = JSON.parse(event.body);
    const { prompt, model, temperature, max_tokens, stream } = requestBody;

    // Validate required fields
    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Prompt is required' })
      };
    }

    // Get API key from environment variable (set in Netlify dashboard)
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'API key not configured on server' })
      };
    }

    // Set up request options
    const options = {
      model: model || 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: temperature || 0.7,
      max_tokens: max_tokens || 1000
    };

    // Make the request to OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(options)
    });

    const responseData = await response.text();

    if (!response.ok) {
      let errorMessage = 'Failed to get completion from OpenAI';
      try {
        const errorData = JSON.parse(responseData);
        errorMessage = errorData.error?.message || errorMessage;
      } catch (e) {
        console.error('Error parsing error response:', e);
      }
      throw new Error(errorMessage);
    }

    const data = JSON.parse(responseData);
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from OpenAI');
    }

    // Return the response
    return {
      statusCode: 200,
      body: JSON.stringify({
        completion: data.choices[0].message.content,
        usage: data.usage
      })
    };
  } catch (error) {
    console.error('Error in OpenAI function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || 'Internal Server Error'
      })
    };
  }
}; 