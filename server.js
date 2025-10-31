const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Email transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change this to any email service
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASSWORD // Your email password or app-specific password
    }
});

// Password reset email endpoint
app.post('/api/send-password-reset', async (req, res) => {
    const { email, passcode } = req.body;

    if (!email || !passcode) {
        return res.status(400).json({ error: 'Email and passcode are required' });
    }

    try {
        // Send email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Stock Trading Simulator Passcode',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); border-radius: 16px;">
                    <div style="background: white; padding: 30px; border-radius: 12px;">
                        <h1 style="color: #1e40af; margin-bottom: 20px; text-align: center;">🔐 Your Passcode</h1>

                        <p style="color: #333; font-size: 16px; line-height: 1.6;">
                            You requested to reset your passcode for the Stock Trading Simulator.
                        </p>

                        <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
                            <p style="color: #78350f; font-size: 14px; margin-bottom: 10px; font-weight: bold;">YOUR PASSCODE</p>
                            <p style="color: #1f2937; font-size: 48px; font-weight: black; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">
                                ${passcode}
                            </p>
                        </div>

                        <p style="color: #666; font-size: 14px; line-height: 1.6;">
                            Use this 6-digit passcode along with your email address to sign in to your account.
                        </p>

                        <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin-top: 20px;">
                            <p style="color: #1e40af; font-size: 13px; margin: 0;">
                                <strong>💡 Tip:</strong> Save this passcode in a secure location like a password manager.
                            </p>
                        </div>

                        <p style="color: #999; font-size: 12px; margin-top: 30px; text-align: center;">
                            If you didn't request this email, please ignore it.
                        </p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: 'Passcode sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email', details: error.message });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Password reset server is running' });
});

app.listen(PORT, () => {
    console.log(`🚀 Password reset server running on http://localhost:${PORT}`);
    console.log(`📧 Email service configured: ${process.env.EMAIL_USER || 'Not configured'}`);
});
