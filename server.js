require('dotenv').config();

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
// Initialize Stripe only if key is provided (optional for personal accounts)
const stripe = process.env.STRIPE_SECRET_KEY
    ? require('stripe')(process.env.STRIPE_SECRET_KEY)
    : null;
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: [
            'http://localhost:3000',
            'http://localhost:3001',
            'https://reidwcoleman.github.io',
            'https://trader-snowy.vercel.app'
        ],
        methods: ["GET", "POST"],
        credentials: true
    }
});
const PORT = process.env.PORT || 3001;

// User data files
const usersFile = path.join(__dirname, 'family-users.json');
const accountsFile = path.join(__dirname, 'accounts.json');
const chatMessagesFile = path.join(__dirname, 'chat-messages.json');

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

function readChatMessages() {
    try {
        if (fs.existsSync(chatMessagesFile)) {
            return JSON.parse(fs.readFileSync(chatMessagesFile, 'utf8'));
        }
        return [];
    } catch (error) {
        console.error('Error reading chat messages:', error);
        return [];
    }
}

function writeChatMessages(messages) {
    try {
        fs.writeFileSync(chatMessagesFile, JSON.stringify(messages, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing chat messages:', error);
        return false;
    }
}

// Middleware - Configure CORS to allow requests from GitHub Pages
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:3001',
            'https://reidwcoleman.github.io',
            'https://trader-snowy.vercel.app'
        ];

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('⚠️  CORS blocked origin:', origin);
            callback(null, true); // Allow all origins temporarily to debug
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Content-Type'],
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

// Add explicit CORS headers for all responses
app.use((req, res, next) => {
    const origin = req.headers.origin;
    const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://reidwcoleman.github.io',
        'https://trader-snowy.vercel.app'
    ];

    console.log(`📨 ${req.method} ${req.path} from origin: ${origin}`);

    // Always set CORS headers for allowed origins or allow all temporarily
    if (allowedOrigins.includes(origin) || origin) {
        res.setHeader('Access-Control-Allow-Origin', origin || '*');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
        console.log(`✅ CORS headers set for ${origin}`);
    }

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        console.log(`✈️  Preflight request handled for ${req.path}`);
        res.setHeader('Access-Control-Allow-Origin', origin || '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
        res.setHeader('Access-Control-Max-Age', '86400');
        return res.status(204).end();
    }

    next();
});

app.use(express.json());

// Serve static files (HTML, CSS, JS, images)
app.use(express.static(__dirname));

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
        // Check if Stripe is configured
        if (!stripe) {
            return res.status(503).json({
                success: false,
                message: 'Payment processing is not configured. Please use a Personal account instead.'
            });
        }

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
        // Check if Stripe is configured
        if (!stripe) {
            return res.status(503).json({
                success: false,
                message: 'Payment processing is not configured.'
            });
        }

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
            portfolio: {
                cash: 100000,
                positions: {},
                history: [],
                lastBuyTime: {},
                watchlist: []
            },
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

        console.log('📊 Portfolio update request for:', email);
        console.log('📊 Portfolio data:', JSON.stringify(portfolio, null, 2));

        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ error: 'Valid email is required' });
        }

        const accounts = readAccounts();
        const account = accounts.find(acc => acc.email.toLowerCase() === email.toLowerCase());

        if (!account) {
            console.error('❌ Account not found:', email);
            return res.status(404).json({ error: 'Account not found' });
        }

        account.portfolio = portfolio;
        account.updatedAt = new Date().toISOString();

        writeAccounts(accounts);
        console.log('✅ Portfolio updated successfully for:', email);

        res.json({
            success: true,
            message: 'Portfolio updated successfully'
        });
    } catch (error) {
        console.error('Portfolio update error:', error);
        res.status(500).json({ error: 'Failed to update portfolio' });
    }
});

// Reset account endpoint (requires developer code)
app.post('/api/accounts/reset', async (req, res) => {
    try {
        const { email, developerCode } = req.body;

        console.log('🔄 Account reset request for:', email);

        // Validate developer code
        if (developerCode !== 'RWC#1') {
            console.error('❌ Invalid developer code');
            return res.status(403).json({ error: 'Invalid developer code' });
        }

        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ error: 'Valid email is required' });
        }

        const accounts = readAccounts();
        const account = accounts.find(acc => acc.email.toLowerCase() === email.toLowerCase());

        if (!account) {
            console.error('❌ Account not found:', email);
            return res.status(404).json({ error: 'Account not found' });
        }

        // Reset portfolio to initial state
        account.portfolio = {
            cash: 100000,
            positions: {},
            shortPositions: {},
            history: [],
            lastBuyTime: {},
            watchlist: [],
            performanceHistory: []
        };
        account.updatedAt = new Date().toISOString();

        writeAccounts(accounts);
        console.log('✅ Account reset successfully for:', email);

        res.json({
            success: true,
            message: 'Account reset successfully',
            portfolio: account.portfolio
        });
    } catch (error) {
        console.error('Account reset error:', error);
        res.status(500).json({ error: 'Failed to reset account' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Get chat history endpoint
app.get('/api/chat/history', (req, res) => {
    try {
        const messages = readChatMessages();
        // Return last 100 messages
        res.json({ success: true, messages: messages.slice(-100) });
    } catch (error) {
        console.error('Chat history error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch chat history' });
    }
});

// Socket.io chat handlers
io.on('connection', (socket) => {
    console.log('💬 User connected to chat:', socket.id);

    // Send recent chat history to new user
    const messages = readChatMessages();
    socket.emit('chat_history', messages.slice(-100));

    // Handle new chat messages
    socket.on('chat_message', (data) => {
        const { userName, message, timestamp } = data;

        if (!userName || !message) {
            return;
        }

        const chatMessage = {
            id: crypto.randomBytes(16).toString('hex'),
            userName: userName,
            message: message.substring(0, 500), // Limit message length
            timestamp: timestamp || new Date().toISOString()
        };

        // Save message to file
        const messages = readChatMessages();
        messages.push(chatMessage);

        // Keep only last 1000 messages
        if (messages.length > 1000) {
            messages.splice(0, messages.length - 1000);
        }

        writeChatMessages(messages);

        // Broadcast to all connected clients
        io.emit('chat_message', chatMessage);

        console.log(`💬 ${userName}: ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}`);
    });

    socket.on('disconnect', () => {
        console.log('👋 User disconnected from chat:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📧 Email service configured: ${process.env.EMAIL_USER || 'Not configured'}`);
    console.log(`💳 Stripe configured: ${!!process.env.STRIPE_SECRET_KEY}`);
    console.log(`💬 Chat server ready`);
});
