// Serverless function to send a password reset code via email
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Generate cryptographically strong 6-digit code
function generateSixDigitCode() {
    const n = crypto.randomInt(0, 1_000_000);
    return n.toString().padStart(6, '0');
}

// Hash code using SHA-256
function hashCode(code) {
    return crypto.createHash('sha256').update(code).digest('hex');
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

        // Generate code and hash
        const code = generateSixDigitCode();
        const codeHash = hashCode(code);
        const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000).toISOString();

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
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px 12px 0 0;">
                        <h1 style="color: white; margin: 0; font-size: 28px;">🔐 FinClash</h1>
                    </div>
                    <div style="background: #f9fafb; padding: 40px 30px; border-radius: 0 0 12px 12px;">
                        <h2 style="color: #1f2937; margin-top: 0;">Password Reset Request</h2>
                        <p style="color: #4b5563; font-size: 16px;">You requested to reset your FinClash passcode. Use the code below:</p>
                        <div style="background: white; border: 3px solid #3b82f6; padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0;">
                            <div style="color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;">Your Reset Code</div>
                            <div style="color: #1f2937; font-size: 48px; font-weight: bold; letter-spacing: 12px; font-family: 'Courier New', monospace;">${code}</div>
                        </div>
                        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin: 20px 0;">
                            <p style="color: #92400e; margin: 0; font-size: 14px;">⏱️ This code expires in <strong>${CODE_TTL_MINUTES} minutes</strong></p>
                        </div>
                        <p style="color: #6b7280; font-size: 14px;">If you didn't request this password reset, you can safely ignore this email.</p>
                    </div>
                    <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
                        <p>FinClash - Virtual Trading Simulator</p>
                        <p>Educational purposes only • Not financial advice</p>
                    </div>
                </div>
            `
        });

        console.log(`✅ Reset code sent to: ${email}`);

        // Return the hash and expiry so frontend can store it
        return res.status(200).json({
            ok: true,
            codeHash,
            expiresAt,
            message: 'If that email exists in our system, we sent a verification code.'
        });

    } catch (error) {
        console.error('Error in send-reset-code:', error);
        return res.status(500).json({
            error: 'Failed to send reset code',
            message: error.message
        });
    }
}
