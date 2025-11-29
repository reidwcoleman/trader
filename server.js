require('dotenv').config();

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
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
            'http://localhost:5173',
            'https://reidwcoleman.github.io',
            'https://trader-snowy.vercel.app',
            'https://finclash.us',
            'https://www.finclash.us'
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
            'http://localhost:5173',
            'https://reidwcoleman.github.io',
            'https://trader-snowy.vercel.app',
            'https://finclash.us',
            'https://www.finclash.us'
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

// Reset account endpoint (ONE TIME ONLY per account)
// ⚠️ PERMANENT DELETION - Clears all trading data, keeps email & password
app.post('/api/accounts/reset', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('🔄 ACCOUNT RESET REQUEST for:', email);

        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ error: 'Valid email is required' });
        }

        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }

        const accounts = readAccounts();
        const account = accounts.find(acc => acc.email.toLowerCase() === email.toLowerCase());

        if (!account) {
            console.error('❌ Account not found:', email);
            return res.status(404).json({ error: 'Account not found' });
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(password, account.passwordHash);
        if (!passwordMatch) {
            console.error('❌ Invalid password for:', email);
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Check if account has already been reset (ONE TIME ONLY)
        if (account.hasBeenReset === true) {
            console.error('❌ Account has already been reset (one-time limit reached):', email);
            return res.status(403).json({
                error: 'Account reset limit reached',
                message: 'You can only reset your account once. This account has already been reset.'
            });
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

        // PERMANENT RESET - Clears all trading data, keeps email & password
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

        // Mark account as reset (ONE TIME ONLY - can never reset again)
        account.hasBeenReset = true;
        account.resetAt = new Date().toISOString();
        account.updatedAt = new Date().toISOString();

        // Email and passwordHash remain unchanged - user can still log in

        // Write to file - OLD DATA IS NOW PERMANENTLY DELETED
        writeAccounts(accounts);

        console.log('🔄 ACCOUNT RESET COMPLETE for:', email);
        console.log('   ⛔ All trading data has been IRREVERSIBLY DELETED');
        console.log('   ✅ Account reset to $100,000');
        console.log('   ✅ Email and password preserved');
        console.log('   ⚠️  ONE-TIME RESET USED - Cannot reset again');

        res.json({
            success: true,
            message: 'Account reset successful. All trading data cleared. Email and password preserved.',
            portfolio: account.portfolio,
            hasBeenReset: true,
            warning: 'This was your one-time account reset. You cannot reset again.'
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

// Portfolio API endpoints
app.get('/api/portfolio/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const accounts = readAccounts();
        const account = accounts.find(acc => acc.id === userId);
        
        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }
        
        // Calculate portfolio value
        const cash = account.cash || 100000;
        const holdings = account.holdings || [];
        
        // Simulate real-time prices for holdings
        let holdingsValue = 0;
        const updatedHoldings = holdings.map(holding => {
            // Simulate price movement (±2%)
            const currentPrice = holding.avgCost * (1 + (Math.random() - 0.5) * 0.04);
            const value = holding.shares * currentPrice;
            holdingsValue += value;
            
            return {
                ...holding,
                currentPrice,
                totalValue: value,
                gainLoss: value - (holding.shares * holding.avgCost),
                gainLossPercent: ((currentPrice - holding.avgCost) / holding.avgCost) * 100
            };
        });
        
        const totalValue = cash + holdingsValue;
        const todayReturn = holdingsValue * (Math.random() - 0.5) * 0.02; // ±2% daily return
        const totalReturn = totalValue - 100000; // Assuming $100k start
        
        res.json({
            totalValue,
            cash,
            holdings: updatedHoldings,
            todayReturn,
            totalReturn,
            todayReturnPercent: (todayReturn / totalValue) * 100,
            totalReturnPercent: (totalReturn / 100000) * 100
        });
    } catch (error) {
        console.error('Portfolio error:', error);
        res.status(500).json({ error: 'Failed to load portfolio' });
    }
});

// Stock quotes API
app.get('/api/stocks/quotes', async (req, res) => {
    try {
        const symbols = req.query.symbols?.split(',') || [];
        const quotes = {};
        
        // Generate mock quotes for requested symbols
        symbols.forEach(symbol => {
            const basePrice = Math.random() * 200 + 50;
            const change = (Math.random() - 0.5) * 10;
            
            quotes[symbol] = {
                price: basePrice,
                change,
                changePercent: (change / basePrice) * 100,
                volume: Math.floor(Math.random() * 50000000) + 1000000
            };
        });
        
        res.json(quotes);
    } catch (error) {
        console.error('Quotes error:', error);
        res.status(500).json({ error: 'Failed to fetch quotes' });
    }
});

// Individual stock quote
app.get('/api/stocks/quote', async (req, res) => {
    try {
        const symbol = req.query.symbol;
        if (!symbol) {
            return res.status(400).json({ error: 'Symbol required' });
        }
        
        const basePrice = Math.random() * 200 + 50;
        const change = (Math.random() - 0.5) * 10;
        
        res.json({
            symbol: symbol.toUpperCase(),
            name: `${symbol.toUpperCase()} Corporation`,
            price: basePrice,
            change,
            changePercent: (change / basePrice) * 100,
            marketCap: `${(Math.random() * 3 + 0.5).toFixed(1)}T`,
            peRatio: (Math.random() * 40 + 10).toFixed(1),
            weekHigh: basePrice * 1.3,
            weekLow: basePrice * 0.7,
            volume: `${(Math.random() * 80 + 20).toFixed(1)}M`,
            avgVolume: `${(Math.random() * 60 + 30).toFixed(1)}M`
        });
    } catch (error) {
        console.error('Quote error:', error);
        res.status(500).json({ error: 'Failed to fetch quote' });
    }
});

// Trading API
app.post('/api/trades', async (req, res) => {
    try {
        const { userId, symbol, shares, action, orderType, limitPrice, currentPrice } = req.body;

        if (!userId || !symbol || !shares || !action) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const accounts = readAccounts();
        // Find account by email (userId is actually the email)
        const accountIndex = accounts.findIndex(acc => acc.email === userId);

        if (accountIndex === -1) {
            return res.status(404).json({ error: 'Account not found' });
        }

        const account = accounts[accountIndex];
        const tradePrice = limitPrice || currentPrice || 100;
        const totalCost = shares * tradePrice;
        const commission = totalCost * 0.001; // 0.1% commission

        // Initialize portfolio properties if they don't exist
        if (!account.portfolio) {
            account.portfolio = {
                cash: 100000,
                positions: {},
                history: [],
                lastBuyTime: {},
                watchlist: []
            };
        }
        if (!account.portfolio.cash) account.portfolio.cash = 100000;
        if (!account.portfolio.positions) account.portfolio.positions = {};
        if (!account.portfolio.history) account.portfolio.history = [];

        if (action === 'buy') {
            // Check if user has enough cash
            if (account.portfolio.cash < totalCost + commission) {
                return res.status(400).json({ error: 'Insufficient buying power' });
            }

            // Deduct cash
            account.portfolio.cash -= (totalCost + commission);

            // Add to positions (positions is an object, not array)
            if (account.portfolio.positions[symbol]) {
                // Update existing position - calculate new average cost
                const existingShares = account.portfolio.positions[symbol];
                account.portfolio.positions[symbol] = existingShares + shares;
            } else {
                account.portfolio.positions[symbol] = shares;
            }
        } else if (action === 'sell') {
            // Check if user has enough shares
            if (!account.portfolio.positions[symbol] || account.portfolio.positions[symbol] < shares) {
                return res.status(400).json({ error: 'Insufficient shares to sell' });
            }

            // Add cash (minus commission)
            account.portfolio.cash += (totalCost - commission);

            // Reduce positions
            account.portfolio.positions[symbol] -= shares;

            // Remove position if no shares left
            if (account.portfolio.positions[symbol] === 0) {
                delete account.portfolio.positions[symbol];
            }
        }

        // Add to history
        account.portfolio.history.unshift({
            type: action,
            symbol,
            quantity: shares,
            price: tradePrice,
            total: totalCost,
            fee: commission,
            timestamp: new Date().toISOString()
        });

        // Keep only last 50 history items
        if (account.portfolio.history.length > 50) {
            account.portfolio.history = account.portfolio.history.slice(0, 50);
        }

        // Update lastBuyTime if buying
        if (action === 'buy') {
            if (!account.portfolio.lastBuyTime) account.portfolio.lastBuyTime = {};
            account.portfolio.lastBuyTime[symbol] = new Date().toISOString();
        }

        // Update timestamp
        account.updatedAt = new Date().toISOString();

        // Save accounts
        writeAccounts(accounts);

        res.json({
            success: true,
            trade: {
                symbol,
                shares,
                action,
                price: tradePrice,
                total: totalCost,
                commission,
                newCash: account.portfolio.cash
            },
            portfolio: account.portfolio
        });

    } catch (error) {
        console.error('Trade error:', error);
        res.status(500).json({ error: 'Failed to execute trade' });
    }
});

// Watchlist API
app.get('/api/watchlist/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const accounts = readAccounts();
        const account = accounts.find(acc => acc.id === userId);
        
        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }
        
        // Default watchlist if none exists
        const defaultWatchlist = [
            { symbol: 'AAPL', name: 'Apple Inc.' },
            { symbol: 'NVDA', name: 'NVIDIA Corporation' },
            { symbol: 'MSFT', name: 'Microsoft Corporation' },
            { symbol: 'GOOGL', name: 'Alphabet Inc.' },
            { symbol: 'TSLA', name: 'Tesla, Inc.' }
        ];
        
        res.json(account.watchlist || defaultWatchlist);
    } catch (error) {
        console.error('Watchlist error:', error);
        res.status(500).json({ error: 'Failed to load watchlist' });
    }
});

// Activity API
app.get('/api/activity/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const accounts = readAccounts();
        const account = accounts.find(acc => acc.id === userId);
        
        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }
        
        res.json(account.activity || []);
    } catch (error) {
        console.error('Activity error:', error);
        res.status(500).json({ error: 'Failed to load activity' });
    }
});

// Stock chart API
app.get('/api/stocks/chart', async (req, res) => {
    try {
        const { symbol, period } = req.query;
        
        if (!symbol) {
            return res.status(400).json({ error: 'Symbol required' });
        }
        
        // Generate mock chart data
        const periodDays = {
            '1D': 1,
            '5D': 5,
            '1M': 30,
            '3M': 90,
            '6M': 180,
            '1Y': 365,
            '5Y': 1825
        };
        
        const days = periodDays[period] || 30;
        const data = [];
        const labels = [];
        let basePrice = Math.random() * 200 + 50;
        
        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toISOString().split('T')[0]);
            
            basePrice += (Math.random() - 0.5) * (basePrice * 0.02);
            data.push(parseFloat(basePrice.toFixed(2)));
        }
        
        res.json({ labels, data });
    } catch (error) {
        console.error('Chart error:', error);
        res.status(500).json({ error: 'Failed to generate chart' });
    }
});

// Stock news API
app.get('/api/news/stock', async (req, res) => {
    try {
        const symbol = req.query.symbol;
        
        // Generate mock news for the stock
        const mockNews = [
            {
                title: `${symbol} Reports Strong Quarterly Earnings`,
                summary: `${symbol} exceeded analyst expectations with strong revenue growth and improved margins in the latest quarter.`,
                source: 'Financial Times',
                time: '2 hours ago',
                url: '#'
            },
            {
                title: `Analysts Upgrade ${symbol} Price Target`,
                summary: 'Multiple investment firms have raised their price targets following positive market developments.',
                source: 'Bloomberg',
                time: '4 hours ago',
                url: '#'
            },
            {
                title: `${symbol} Announces Strategic Partnership`,
                summary: 'The company has entered into a strategic partnership expected to drive future growth.',
                source: 'Reuters',
                time: '6 hours ago',
                url: '#'
            },
            {
                title: `Market Volatility Affects ${symbol} Trading`,
                summary: 'Recent market conditions have led to increased trading volume and price fluctuations.',
                source: 'MarketWatch',
                time: '8 hours ago',
                url: '#'
            },
            {
                title: `${symbol} CEO Discusses Long-term Vision`,
                summary: 'Company leadership outlined strategic initiatives for the next fiscal year.',
                source: 'CNBC',
                time: '1 day ago',
                url: '#'
            }
        ];
        
        res.json(mockNews);
    } catch (error) {
        console.error('News error:', error);
        res.status(500).json({ error: 'Failed to load news' });
    }
});

server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📧 Email service configured: ${process.env.EMAIL_USER || 'Not configured'}`);
    console.log(`💬 Chat server ready`);
    console.log(`📰 Article scraper ready`);
    console.log(`💹 Trading API ready`);
});
