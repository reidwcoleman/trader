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
const axios = require('axios');
const cheerio = require('cheerio');

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

// Add explicit CORS headers for all responses - MUST be before routes
app.use((req, res, next) => {
    const origin = req.headers.origin;
    const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://reidwcoleman.github.io',
        'https://trader-snowy.vercel.app'
    ];

    console.log(`📨 ${req.method} ${req.path} from origin: ${origin}`);

    // ALWAYS set CORS headers for ALL requests
    const responseOrigin = (allowedOrigins.includes(origin) || !origin) ? (origin || '*') : '*';
    res.setHeader('Access-Control-Allow-Origin', responseOrigin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Type, Authorization');

    console.log(`✅ CORS headers set for ${origin} -> ${responseOrigin}`);

    // Handle preflight requests IMMEDIATELY
    if (req.method === 'OPTIONS') {
        console.log(`✈️  Preflight OPTIONS request for ${req.path} - responding with 200 OK`);
        res.setHeader('Access-Control-Max-Age', '86400');
        return res.status(200).end();
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

        // Fast validation
        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ error: 'Valid email is required' });
        }

        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }

        const accounts = readAccounts();
        const normalizedEmail = email.toLowerCase();
        const account = accounts.find(acc => acc.email.toLowerCase() === normalizedEmail);

        if (!account) {
            // Timing attack mitigation - still hash even if account not found
            await bcrypt.compare(password, '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGH');
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Fast password verification
        const isValid = await bcrypt.compare(password, account.passwordHash);

        if (!isValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Return minimal account data for speed
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

// Update account name endpoint
app.post('/api/accounts/update-name', async (req, res) => {
    try {
        const { email, name } = req.body;

        console.log('✏️ Name update request for:', email);

        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ error: 'Valid email is required' });
        }

        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return res.status(400).json({ error: 'Valid name is required' });
        }

        if (name.trim().length > 100) {
            return res.status(400).json({ error: 'Name must be 100 characters or less' });
        }

        const accounts = readAccounts();
        const account = accounts.find(acc => acc.email.toLowerCase() === email.toLowerCase());

        if (!account) {
            console.error('❌ Account not found:', email);
            return res.status(404).json({ error: 'Account not found' });
        }

        const oldName = account.name;
        account.name = name.trim();
        account.updatedAt = new Date().toISOString();

        writeAccounts(accounts);
        console.log(`✅ Name updated successfully: "${oldName}" → "${name.trim()}"`);

        res.json({
            success: true,
            message: 'Name updated successfully',
            name: account.name
        });
    } catch (error) {
        console.error('Name update error:', error);
        res.status(500).json({ error: 'Failed to update name' });
    }
});

// Reset account endpoint (requires developer code)
// ⚠️ PERMANENT DELETION - This irreversibly erases all account trading data
app.post('/api/accounts/reset', async (req, res) => {
    try {
        const { email, developerCode } = req.body;

        console.log('🔥 PERMANENT ACCOUNT RESET REQUEST for:', email);

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

        // Store old data for logging purposes
        const oldPositionsCount = Object.keys(account.portfolio?.positions || {}).length;
        const oldHistoryCount = account.portfolio?.history?.length || 0;
        const oldWatchlistCount = account.portfolio?.watchlist?.length || 0;

        console.log(`📊 Data being PERMANENTLY DELETED for ${email}:`);
        console.log(`   - ${oldPositionsCount} stock positions`);
        console.log(`   - ${oldHistoryCount} trading history records`);
        console.log(`   - ${oldWatchlistCount} watchlist items`);
        console.log(`   - All performance data`);

        // PERMANENT RESET - Overwrites all portfolio data with fresh state
        // ⚠️ OLD DATA IS PERMANENTLY LOST - NO RECOVERY POSSIBLE
        account.portfolio = {
            cash: 100000,
            positions: {},
            shortPositions: {},
            history: [],
            lastBuyTime: {},
            watchlist: [],
            performanceHistory: []
        };
        account.resetCount = (account.resetCount || 0) + 1;
        account.lastResetAt = new Date().toISOString();
        account.updatedAt = new Date().toISOString();

        // Write to file - OLD DATA IS NOW PERMANENTLY DELETED
        writeAccounts(accounts);

        console.log('🔥 PERMANENT RESET COMPLETE for:', email);
        console.log('   ⛔ All previous data has been IRREVERSIBLY DELETED');
        console.log(`   ✅ Account reset to $100,000 (Reset #${account.resetCount})`);

        res.json({
            success: true,
            message: 'Account permanently reset - all data deleted forever',
            portfolio: account.portfolio,
            resetCount: account.resetCount
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

// Scrape article text from free news sources
app.post('/api/scrape-article', async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        console.log('📰 Scraping article from:', url);

        // Fetch the article HTML
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 10000
        });

        const html = response.data;
        const $ = cheerio.load(html);

        // Remove unwanted elements
        $('script, style, nav, header, footer, iframe, .advertisement, .ad, .sidebar, .social-share').remove();

        // Try multiple common article selectors
        let articleText = '';
        let headline = '';
        let publishDate = '';
        let author = '';

        // Extract headline
        headline = $('h1').first().text().trim() ||
                   $('article h1').first().text().trim() ||
                   $('meta[property="og:title"]').attr('content') ||
                   $('title').text().trim();

        // Extract publish date
        publishDate = $('time').first().attr('datetime') ||
                     $('meta[property="article:published_time"]').attr('content') ||
                     $('meta[name="publish-date"]').attr('content') ||
                     '';

        // Extract author
        author = $('meta[name="author"]').attr('content') ||
                $('meta[property="article:author"]').attr('content') ||
                $('[rel="author"]').first().text().trim() ||
                '';

        // Try different article content selectors
        const articleSelectors = [
            'article p',
            '.article-body p',
            '.article-content p',
            '.story-body p',
            '.post-content p',
            '.entry-content p',
            'main p',
            '[role="main"] p'
        ];

        for (const selector of articleSelectors) {
            const paragraphs = $(selector);
            if (paragraphs.length > 3) {
                articleText = paragraphs
                    .map((i, el) => $(el).text().trim())
                    .get()
                    .filter(text => text.length > 50) // Filter out short snippets
                    .join('\n\n');
                if (articleText.length > 200) {
                    break;
                }
            }
        }

        // If still no content, try getting all paragraphs
        if (!articleText || articleText.length < 200) {
            articleText = $('p')
                .map((i, el) => $(el).text().trim())
                .get()
                .filter(text => text.length > 50)
                .join('\n\n');
        }

        // Check if we got meaningful content
        if (!articleText || articleText.length < 200) {
            return res.status(400).json({
                error: 'Unable to extract article content. This site may be paywalled or use dynamic content loading.'
            });
        }

        // Check for paywall indicators
        const paywallIndicators = [
            'subscribe to read',
            'subscription required',
            'paywall',
            'premium content',
            'sign in to continue',
            'register to read'
        ];

        const lowerText = articleText.toLowerCase();
        if (paywallIndicators.some(indicator => lowerText.includes(indicator))) {
            return res.status(403).json({
                error: 'This article appears to be behind a paywall.'
            });
        }

        console.log(`✅ Successfully scraped article: ${headline.substring(0, 50)}...`);
        console.log(`   Content length: ${articleText.length} characters`);

        res.json({
            success: true,
            article: {
                headline,
                text: articleText,
                publishDate,
                author,
                url
            }
        });

    } catch (error) {
        console.error('Article scraping error:', error.message);

        if (error.response?.status === 403) {
            return res.status(403).json({
                error: 'Access denied. This site may block automated requests.'
            });
        }

        if (error.response?.status === 404) {
            return res.status(404).json({
                error: 'Article not found.'
            });
        }

        res.status(500).json({
            error: 'Failed to scrape article. The site may be protected or require authentication.'
        });
    }
});

server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📧 Email service configured: ${process.env.EMAIL_USER || 'Not configured'}`);
    console.log(`💳 Stripe configured: ${!!process.env.STRIPE_SECRET_KEY}`);
    console.log(`💬 Chat server ready`);
    console.log(`📰 Article scraper ready`);
});
