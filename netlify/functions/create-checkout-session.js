const stripe = require('stripe');

exports.handler = async (event, context) => {
  // Add CORS headers for preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: false, message: 'Method Not Allowed' }) 
    };
  }

  try {
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRICE_ID) {
      console.error('Missing Stripe configuration');
      console.error('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'Set' : 'NOT SET');
      console.error('STRIPE_PRICE_ID:', process.env.STRIPE_PRICE_ID ? 'Set' : 'NOT SET');
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ 
          success: false, 
          message: 'Stripe is not configured. Please set STRIPE_SECRET_KEY and STRIPE_PRICE_ID environment variables in Netlify.' 
        })
      };
    }

    // Initialize Stripe with the secret key
    const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

    const { email, userId } = JSON.parse(event.body);

    if (!email || !email.includes('@')) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ success: false, message: 'Please provide a valid email address' })
      };
    }

    // Get the origin from the request
    const protocol = event.headers['x-forwarded-proto'] || 'https';
    const host = event.headers.host;
    const origin = `${protocol}://${host}`;

    console.log('Creating Stripe session for:', email);
    console.log('Origin:', origin);
    
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      mode: 'payment',
      success_url: `${origin}/family-success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/family-join.html`,
      customer_email: email,
      client_reference_id: userId || email,
      metadata: { email, userId: userId || '', accessType: 'family' }
    });

    console.log('Stripe session created successfully:', session.id);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: true, sessionId: session.id, url: session.url })
    };
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ 
        success: false, 
        message: error.message || 'Failed to create checkout session',
        error: error.toString()
      })
    };
  }
};
