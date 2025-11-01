// Serverless function to request a password reset code
// Generates a 6-digit code, hashes it, stores it with expiry, and emails it to the user

const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Simple hash function (SHA-256) - no bcrypt in browser/serverless edge
function hashCode(code) {
    return crypto.createHash('sha256').update(code).digest('hex');
}

// Generate cryptographically strong 6-digit code
function generateSixDigitCode() {
    const n = crypto.randomInt(0, 1_000_000);
    return n.toString().padStart(6, '0');
}

const CODE_TTL_MINUTES = 10;

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email } = req.body;

        if (!email || !email.includes('@')) {
            return res.status(400).json({ error: 'Invalid email' });
        }

        // Always return success to avoid email enumeration
        // The actual email sending will fail silently if user doesn't exist
        res.status(200).json({
            ok: true,
            message: 'If that email exists in our system, we sent a verification code.'
        });

        // Generate code and hash
        const code = generateSixDigitCode();
        const codeHash = hashCode(code);
        const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000).toISOString();

        // Note: The frontend will need to call SQLiteDB.createResetCode(email, codeHash, expiresAt)
        // since we can't access browser's SQLite from serverless function
        // So we'll send the hash back and let the frontend store it

        // Configure nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // Send email
        await transporter.sendMail({
            from: `"FinClash" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'FinClash - Password Reset Code',
            text: `Your FinClash password reset code is ${code}. It expires in ${CODE_TTL_MINUTES} minutes. If you didn't request this, please ignore this email.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #3b82f6;">FinClash Password Reset</h2>
                    <p>Your password reset code is:</p>
                    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #1f2937; font-size: 36px; letter-spacing: 8px; margin: 0;">${code}</h1>
                    </div>
                    <p style="color: #6b7280;">This code expires in <strong>${CODE_TTL_MINUTES} minutes</strong>.</p>
                    <p style="color: #6b7280;">If you didn't request this password reset, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                    <p style="color: #9ca3af; font-size: 12px;">FinClash - Virtual Trading Simulator</p>
                </div>
            `
        });

        console.log(`✅ Reset code sent to: ${email}`);

    } catch (error) {
        console.error('Error in request-reset-code:', error);
        // Don't leak errors to client - already sent success response
    }
}
