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

// Trading configuration
const COMMISSION_RATE = 0.03;
const COOLDOWN_MINUTES = 15;
const COOLDOWN_MS = COOLDOWN_MINUTES * 60 * 1000;

// Stock database for search
const STOCK_DATABASE = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation' },
    { symbol: 'META', name: 'Meta Platforms Inc.' },
    { symbol: 'NFLX', name: 'Netflix Inc.' },
    { symbol: 'AMD', name: 'Advanced Micro Devices' },
    { symbol: 'DIS', name: 'Walt Disney Company' },
    { symbol: 'COIN', name: 'Coinbase Global Inc.' },
    { symbol: 'BA', name: 'Boeing Company' },
    { symbol: 'BABA', name: 'Alibaba Group' },
    { symbol: 'NKE', name: 'Nike Inc.' },
    { symbol: 'INTC', name: 'Intel Corporation' },
    { symbol: 'V', name: 'Visa Inc.' },
    { symbol: 'JPM', name: 'JPMorgan Chase' },
    { symbol: 'WMT', name: 'Walmart Inc.' },
    { symbol: 'PFE', name: 'Pfizer Inc.' },
    { symbol: 'KO', name: 'Coca-Cola Company' },
    { symbol: 'PEP', name: 'PepsiCo Inc.' },
    { symbol: 'PYPL', name: 'PayPal Holdings' },
    { symbol: 'ADBE', name: 'Adobe Inc.' },
    { symbol: 'CRM', name: 'Salesforce Inc.' },
    { symbol: 'CSCO', name: 'Cisco Systems' },
    { symbol: 'ORCL', name: 'Oracle Corporation' },
    { symbol: 'T', name: 'AT&T Inc.' },
    { symbol: 'VZ', name: 'Verizon Communications' },
    { symbol: 'GM', name: 'General Motors' },
    { symbol: 'F', name: 'Ford Motor Company' },
    { symbol: 'UBER', name: 'Uber Technologies' },
    { symbol: 'LYFT', name: 'Lyft Inc.' },
    { symbol: 'SQ', name: 'Block Inc.' },
    { symbol: 'SHOP', name: 'Shopify Inc.' },
    { symbol: 'SPOT', name: 'Spotify Technology' },
    { symbol: 'SNAP', name: 'Snap Inc.' },
    { symbol: 'TWTR', name: 'Twitter Inc.' },
    { symbol: 'ZM', name: 'Zoom Video Communications' },
    { symbol: 'ROKU', name: 'Roku Inc.' },
    { symbol: 'PINS', name: 'Pinterest Inc.' }
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
