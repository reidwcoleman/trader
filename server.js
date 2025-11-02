require('dotenv').config();

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3001;

// User data files
const usersFile = path.join(__dirname, 'family-users.json');
const accountsFile = path.join(__dirname, 'accounts.json');

// Helper functions
function readUsers() {
    try {
        if (fs.existsSync(usersFile)) {
            return JSON.parse(fs.readFileSync(usersFile, 'utf8'));
        }
        return [];
    } catch (error) {
        console.error('Error reading users:', error);
        return [];
    }
}

function writeUsers(users) {
    try {
        fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing users:', error);
        return false;
    }
}

function generateUserId() {
    return crypto.randomBytes(16).toString('hex');
}

function isValidEmail(email) {
    return email && email.includes('@');
}

function readAccounts() {
    try {
        if (fs.existsSync(accountsFile)) {
            return JSON.parse(fs.readFileSync(accountsFile, 'utf8'));
        }
        return [];
    } catch (error) {
        console.error('Error reading accounts:', error);
        return [];
    }
}

function writeAccounts(accounts) {
    try {
        fs.writeFileSync(accountsFile, JSON.stringify(accounts, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing accounts:', error);
        return false;
    }
}

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

// Stripe checkout session endpoint for $5 family access
app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { email, userId } = req.body;

        if (!email || !isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Check if user already has family access
        const users = readUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (user && user.familyAccess) {
            return res.status(400).json({
                success: false,
                message: 'You already have family access'
            });
        }

        // Get the origin from headers
        const baseUrl = req.headers.origin || req.headers.referer?.replace(/\/$/, '') || `http://localhost:${PORT}`;

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: process.env.STRIPE_PRICE_ID,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${baseUrl}/family-success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/family-join.html`,
            customer_email: email,
            client_reference_id: userId || email,
            metadata: {
                email: email,
                userId: userId || '',
                accessType: 'family'
            }
        });

        res.json({
            success: true,
            sessionId: session.id,
            url: session.url
        });

    } catch (error) {
        console.error('Stripe checkout error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create checkout session. Please try again.'
        });
    }
});

// Verify payment and grant family access
app.get('/api/verify-payment/:sessionId', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);

        if (session.payment_status === 'paid') {
            const email = session.customer_email || session.metadata.email;

            // Grant family access
            const users = readUsers();
            let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

            if (!user) {
                // Create new user with family access
                user = {
                    id: generateUserId(),
                    email: email.toLowerCase().trim(),
                    familyAccess: true,
                    familyAccessGrantedAt: new Date().toISOString(),
                    stripeSessionId: session.id
                };
                users.push(user);
            } else {
                // Update existing user
                user.familyAccess = true;
                user.familyAccessGrantedAt = new Date().toISOString();
                user.stripeSessionId = session.id;
            }

            writeUsers(users);

            res.json({
                success: true,
                message: 'Family access granted!',
                user: {
                    email: user.email,
                    familyAccess: true
                }
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Payment not completed'
            });
        }
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify payment'
        });
    }
});

// Check family access status
app.get('/api/family-access/:email', (req, res) => {
    const email = req.params.email;

    if (!email || !isValidEmail(email)) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid email address'
        });
    }

    try {
        const users = readUsers();
        const user = users.find(u => u.email.toLowerCase() === decodeURIComponent(email).toLowerCase());

        if (!user) {
            return res.json({
                success: true,
                hasAccess: false
            });
        }

        res.json({
            success: true,
            hasAccess: !!user.familyAccess,
            grantedAt: user.familyAccessGrantedAt || null
        });
    } catch (error) {
        console.error('Family access check error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while checking access'
        });
    }
});

// Create account endpoint
app.post('/api/accounts/create', async (req, res) => {
    try {
        const { email, userName, password, accountCode } = req.body;

        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ error: 'Valid email is required' });
        }

        if (!userName) {
            return res.status(400).json({ error: 'User name is required' });
        }

        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }

        if (!accountCode) {
            return res.status(400).json({ error: 'Account code is required' });
        }

        const accounts = readAccounts();

        // Check if email already exists
        const existingAccount = accounts.find(acc => acc.email.toLowerCase() === email.toLowerCase());
        if (existingAccount) {
            return res.status(400).json({ error: 'An account with this email already exists' });
        }

        // Hash the password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create new account
        const newAccount = {
            email: email.toLowerCase().trim(),
            userName: userName,
            passwordHash: passwordHash,
            accountCode: accountCode,
            portfolio: { cash: 100000, stocks: [] },
            createdAt: new Date().toISOString()
        };

        accounts.push(newAccount);
        writeAccounts(accounts);

        res.json({
            success: true,
            account: {
                email: newAccount.email,
                userName: newAccount.userName,
                accountCode: newAccount.accountCode
            }
        });
    } catch (error) {
        console.error('Account creation error:', error);
        res.status(500).json({ error: 'Failed to create account' });
    }
});

// Login endpoint
app.post('/api/accounts/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ error: 'Valid email is required' });
        }

        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }

        const accounts = readAccounts();
        const account = accounts.find(acc => acc.email.toLowerCase() === email.toLowerCase());

        if (!account) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Verify password
        const isValid = await bcrypt.compare(password, account.passwordHash);

        if (!isValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Return account data
        res.json({
            success: true,
            account: {
                email: account.email,
                userName: account.userName,
                accountCode: account.accountCode,
                portfolio: account.portfolio,
                createdAt: account.createdAt
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
});

// Update portfolio endpoint
app.post('/api/accounts/update-portfolio', async (req, res) => {
    try {
        const { email, portfolio } = req.body;

        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ error: 'Valid email is required' });
        }

        const accounts = readAccounts();
        const account = accounts.find(acc => acc.email.toLowerCase() === email.toLowerCase());

        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }

        account.portfolio = portfolio;
        account.updatedAt = new Date().toISOString();

        writeAccounts(accounts);

        res.json({
            success: true,
            message: 'Portfolio updated successfully'
        });
    } catch (error) {
        console.error('Portfolio update error:', error);
        res.status(500).json({ error: 'Failed to update portfolio' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📧 Email service configured: ${process.env.EMAIL_USER || 'Not configured'}`);
    console.log(`💳 Stripe configured: ${!!process.env.STRIPE_SECRET_KEY}`);
});
