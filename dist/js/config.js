// Configuration constants for FinClash Trading Simulator

// Stripe Payment Links - REPLACE THESE WITH YOUR ACTUAL STRIPE LINKS
// Follow STRIPE_SETUP_GUIDE.md to create your payment links
const STRIPE_FAMILY_PUBLIC_LINK = 'https://buy.stripe.com/test_REPLACE_WITH_YOUR_LINK';
const STRIPE_FAMILY_PRIVATE_LINK = 'https://buy.stripe.com/test_REPLACE_WITH_YOUR_LINK';

// Popular stocks for quick access
const POPULAR_STOCKS = [
    'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA',
    'NVDA', 'META', 'NFLX', 'AMD', 'DIS'
];

// Top 12 stocks for live market ticker
const TOP_12_STOCKS = [
    'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA',
    'NVDA', 'META', 'NFLX', 'AMD', 'COIN',
    'JPM', 'V'
];

// Finnhub API for real-time stock data (free tier: 60 calls/minute)
const FINNHUB_API_KEY = 'd3sop19r01qpdd5kkpsgd3sop19r01qpdd5kkpt0';
const FINNHUB_API_BASE = 'https://finnhub.io/api/v1';

// Alpha Vantage API as backup (free tier: 500 calls/day, 5 calls/minute)
// Get your free key at: https://www.alphavantage.co/support/#api-key
const ALPHA_VANTAGE_API_KEY = 'demo'; // Replace with your key
const ALPHA_VANTAGE_API_BASE = 'https://www.alphavantage.co/query';

// Market hours configuration (US stock market)
const MARKET_CONFIG = {
    timezone: 'America/New_York',
    openHour: 9,
    openMinute: 30,
    closeHour: 16,
    closeMinute: 0,
    weekdays: [1, 2, 3, 4, 5] // Monday-Friday
};

// Trading configuration
const COMMISSION_RATE = 0.03;
const COOLDOWN_MINUTES = 15;
const COOLDOWN_MS = COOLDOWN_MINUTES * 60 * 1000;

// Stock database for search - Comprehensive list of 150+ stocks across all sectors
const STOCK_DATABASE = [
    // Mega-cap Technology
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation' },
    { symbol: 'META', name: 'Meta Platforms Inc.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },

    // Technology & Software
    { symbol: 'ADBE', name: 'Adobe Inc.' },
    { symbol: 'CRM', name: 'Salesforce Inc.' },
    { symbol: 'ORCL', name: 'Oracle Corporation' },
    { symbol: 'CSCO', name: 'Cisco Systems' },
    { symbol: 'INTC', name: 'Intel Corporation' },
    { symbol: 'AMD', name: 'Advanced Micro Devices' },
    { symbol: 'QCOM', name: 'Qualcomm Inc.' },
    { symbol: 'TXN', name: 'Texas Instruments' },
    { symbol: 'AVGO', name: 'Broadcom Inc.' },
    { symbol: 'NOW', name: 'ServiceNow Inc.' },
    { symbol: 'SNOW', name: 'Snowflake Inc.' },
    { symbol: 'PLTR', name: 'Palantir Technologies' },
    { symbol: 'TEAM', name: 'Atlassian Corporation' },
    { symbol: 'MDB', name: 'MongoDB Inc.' },
    { symbol: 'DDOG', name: 'Datadog Inc.' },
    { symbol: 'NET', name: 'Cloudflare Inc.' },

    // Semiconductors
    { symbol: 'MU', name: 'Micron Technology' },
    { symbol: 'LRCX', name: 'Lam Research' },
    { symbol: 'AMAT', name: 'Applied Materials' },
    { symbol: 'KLAC', name: 'KLA Corporation' },
    { symbol: 'MRVL', name: 'Marvell Technology' },
    { symbol: 'ARM', name: 'Arm Holdings' },

    // Streaming & Entertainment
    { symbol: 'NFLX', name: 'Netflix Inc.' },
    { symbol: 'DIS', name: 'Walt Disney Company' },
    { symbol: 'WBD', name: 'Warner Bros Discovery' },
    { symbol: 'SPOT', name: 'Spotify Technology' },
    { symbol: 'ROKU', name: 'Roku Inc.' },
    { symbol: 'PARA', name: 'Paramount Global' },

    // Social Media & Communication
    { symbol: 'SNAP', name: 'Snap Inc.' },
    { symbol: 'PINS', name: 'Pinterest Inc.' },
    { symbol: 'RDDT', name: 'Reddit Inc.' },
    { symbol: 'ZM', name: 'Zoom Video Communications' },

    // E-commerce & Retail
    { symbol: 'SHOP', name: 'Shopify Inc.' },
    { symbol: 'EBAY', name: 'eBay Inc.' },
    { symbol: 'ETSY', name: 'Etsy Inc.' },
    { symbol: 'WMT', name: 'Walmart Inc.' },
    { symbol: 'TGT', name: 'Target Corporation' },
    { symbol: 'COST', name: 'Costco Wholesale' },
    { symbol: 'HD', name: 'Home Depot' },
    { symbol: 'LOW', name: 'Lowe\'s Companies' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },

    // Fintech & Payments
    { symbol: 'V', name: 'Visa Inc.' },
    { symbol: 'MA', name: 'Mastercard Inc.' },
    { symbol: 'PYPL', name: 'PayPal Holdings' },
    { symbol: 'SQ', name: 'Block Inc.' },
    { symbol: 'COIN', name: 'Coinbase Global Inc.' },
    { symbol: 'SOFI', name: 'SoFi Technologies' },
    { symbol: 'AFRM', name: 'Affirm Holdings' },
    { symbol: 'NU', name: 'Nu Holdings' },

    // Banking & Financial Services
    { symbol: 'JPM', name: 'JPMorgan Chase' },
    { symbol: 'BAC', name: 'Bank of America' },
    { symbol: 'WFC', name: 'Wells Fargo' },
    { symbol: 'C', name: 'Citigroup Inc.' },
    { symbol: 'GS', name: 'Goldman Sachs' },
    { symbol: 'MS', name: 'Morgan Stanley' },
    { symbol: 'USB', name: 'U.S. Bancorp' },
    { symbol: 'PNC', name: 'PNC Financial Services' },
    { symbol: 'SCHW', name: 'Charles Schwab' },
    { symbol: 'BLK', name: 'BlackRock Inc.' },

    // Transportation & Mobility
    { symbol: 'UBER', name: 'Uber Technologies' },
    { symbol: 'LYFT', name: 'Lyft Inc.' },
    { symbol: 'ABNB', name: 'Airbnb Inc.' },
    { symbol: 'DAL', name: 'Delta Air Lines' },
    { symbol: 'UAL', name: 'United Airlines' },
    { symbol: 'AAL', name: 'American Airlines' },
    { symbol: 'LUV', name: 'Southwest Airlines' },

    // Automotive
    { symbol: 'GM', name: 'General Motors' },
    { symbol: 'F', name: 'Ford Motor Company' },
    { symbol: 'RIVN', name: 'Rivian Automotive' },
    { symbol: 'LCID', name: 'Lucid Group' },
    { symbol: 'NIO', name: 'NIO Inc.' },
    { symbol: 'XPEV', name: 'XPeng Inc.' },

    // Energy
    { symbol: 'XOM', name: 'Exxon Mobil' },
    { symbol: 'CVX', name: 'Chevron Corporation' },
    { symbol: 'COP', name: 'ConocoPhillips' },
    { symbol: 'SLB', name: 'Schlumberger' },
    { symbol: 'EOG', name: 'EOG Resources' },
    { symbol: 'OXY', name: 'Occidental Petroleum' },

    // Healthcare & Pharma
    { symbol: 'JNJ', name: 'Johnson & Johnson' },
    { symbol: 'UNH', name: 'UnitedHealth Group' },
    { symbol: 'PFE', name: 'Pfizer Inc.' },
    { symbol: 'ABBV', name: 'AbbVie Inc.' },
    { symbol: 'MRK', name: 'Merck & Co.' },
    { symbol: 'TMO', name: 'Thermo Fisher Scientific' },
    { symbol: 'ABT', name: 'Abbott Laboratories' },
    { symbol: 'LLY', name: 'Eli Lilly' },
    { symbol: 'BMY', name: 'Bristol-Myers Squibb' },
    { symbol: 'GILD', name: 'Gilead Sciences' },
    { symbol: 'AMGN', name: 'Amgen Inc.' },
    { symbol: 'VRTX', name: 'Vertex Pharmaceuticals' },

    // Biotech
    { symbol: 'MRNA', name: 'Moderna Inc.' },
    { symbol: 'BNTX', name: 'BioNTech SE' },
    { symbol: 'REGN', name: 'Regeneron Pharmaceuticals' },
    { symbol: 'BIIB', name: 'Biogen Inc.' },

    // Consumer Goods
    { symbol: 'PG', name: 'Procter & Gamble' },
    { symbol: 'KO', name: 'Coca-Cola Company' },
    { symbol: 'PEP', name: 'PepsiCo Inc.' },
    { symbol: 'NKE', name: 'Nike Inc.' },
    { symbol: 'SBUX', name: 'Starbucks Corporation' },
    { symbol: 'MCD', name: 'McDonald\'s Corporation' },
    { symbol: 'CMG', name: 'Chipotle Mexican Grill' },
    { symbol: 'YUM', name: 'Yum! Brands' },

    // Telecom
    { symbol: 'T', name: 'AT&T Inc.' },
    { symbol: 'VZ', name: 'Verizon Communications' },
    { symbol: 'TMUS', name: 'T-Mobile US' },

    // Industrial & Aerospace
    { symbol: 'BA', name: 'Boeing Company' },
    { symbol: 'LMT', name: 'Lockheed Martin' },
    { symbol: 'RTX', name: 'Raytheon Technologies' },
    { symbol: 'GE', name: 'General Electric' },
    { symbol: 'CAT', name: 'Caterpillar Inc.' },
    { symbol: 'DE', name: 'Deere & Company' },
    { symbol: 'HON', name: 'Honeywell International' },

    // Real Estate & REITs
    { symbol: 'AMT', name: 'American Tower' },
    { symbol: 'PLD', name: 'Prologis Inc.' },
    { symbol: 'CCI', name: 'Crown Castle' },
    { symbol: 'SPG', name: 'Simon Property Group' },

    // Media & Advertising
    { symbol: 'GOOG', name: 'Alphabet Inc. Class C' },
    { symbol: 'CMCSA', name: 'Comcast Corporation' },
    { symbol: 'NDAQ', name: 'Nasdaq Inc.' },

    // Emerging Tech
    { symbol: 'RBLX', name: 'Roblox Corporation' },
    { symbol: 'U', name: 'Unity Software' },
    { symbol: 'PATH', name: 'UiPath Inc.' },
    { symbol: 'DASH', name: 'DoorDash Inc.' },
    { symbol: 'CRWD', name: 'CrowdStrike Holdings' },
    { symbol: 'ZS', name: 'Zscaler Inc.' },
    { symbol: 'OKTA', name: 'Okta Inc.' },
    { symbol: 'PANW', name: 'Palo Alto Networks' },
    { symbol: 'FTNT', name: 'Fortinet Inc.' },

    // International & Others
    { symbol: 'BABA', name: 'Alibaba Group' },
    { symbol: 'PDD', name: 'PDD Holdings' },
    { symbol: 'JD', name: 'JD.com Inc.' },
    { symbol: 'BIDU', name: 'Baidu Inc.' },
    { symbol: 'TSM', name: 'Taiwan Semiconductor' },
];

// Fallback stock prices for when API is unavailable
const FALLBACK_STOCK_DATA = {
    'AAPL': { price: 178.50, change: 1.2 },
    'GOOGL': { price: 142.30, change: -0.8 },
    'MSFT': { price: 378.90, change: 0.9 },
    'AMZN': { price: 145.60, change: 1.5 },
    'TSLA': { price: 242.80, change: -2.3 },
    'NVDA': { price: 495.20, change: 3.2 },
    'META': { price: 325.40, change: 0.7 },
    'NFLX': { price: 445.30, change: -1.1 },
    'AMD': { price: 143.20, change: 2.1 },
    'DIS': { price: 91.30, change: -0.5 }
};
