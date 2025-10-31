require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

exports.handler = async (event, context) => {
  const sessionId = event.path.split('/').pop();

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      const email = session.customer_email || session.metadata.email;
      
      // Store in Neon database
      await sql`
        INSERT INTO family_users (email, family_access, family_access_granted_at, stripe_session_id)
        VALUES (${email.toLowerCase()}, true, NOW(), ${session.id})
        ON CONFLICT (email) 
        DO UPDATE SET 
          family_access = true,
          family_access_granted_at = NOW(),
          stripe_session_id = ${session.id}
      `;
      
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          success: true,
          message: 'Family access granted!',
          user: { email, familyAccess: true }
        })
      };
    }
    
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: 'Payment not completed' })
    };
  } catch (error) {
    console.error('Payment verification error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Failed to verify payment' })
    };
  }
};
