require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

exports.handler = async (event, context) => {
  const email = decodeURIComponent(event.path.split('/').pop());

  if (!email || !email.includes('@')) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: 'Invalid email' })
    };
  }

  try {
    const result = await sql`
      SELECT email, family_access, family_access_granted_at 
      FROM family_users 
      WHERE LOWER(email) = LOWER(${email})
    `;

    const user = result[0];

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: true,
        hasAccess: user ? !!user.family_access : false,
        grantedAt: user?.family_access_granted_at || null
      })
    };
  } catch (error) {
    console.error('Family access check error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Error checking access' })
    };
  }
};
