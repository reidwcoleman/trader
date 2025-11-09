// Real-time Stock News Feed using Finnhub API

// List of paywalled/premium news sources that require accounts
const PAYWALLED_SOURCES = [
    'Wall Street Journal',
    'WSJ',
    'Financial Times',
    'FT.com',
    'The Information',
    'Bloomberg',
    'Barron\'s',
    'Investor\'s Business Daily',
    'IBD',
    'Seeking Alpha Premium',
    'The Athletic',
    'New York Times',
    'NYT',
    'Washington Post',
    'WaPo',
    'The Economist',
    'Fortune Premium',
    'Harvard Business Review',
    'MIT Technology Review'
];

// Check if a URL or source is from a paywalled site
function isPaywalled(url, source) {
    const lowerUrl = (url || '').toLowerCase();
    const lowerSource = (source || '').toLowerCase();

    return PAYWALLED_SOURCES.some(paywalledSource => {
        const lower = paywalledSource.toLowerCase();
        return lowerUrl.includes(lower) || lowerSource.includes(lower);
    });
}

// Fetch news for a specific stock
async function fetchStockNews(symbol, apiKey) {
    try {
        const toDate = new Date().toISOString().split('T')[0];
        // Fetch news from last 60 days for better coverage
        const fromDate = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const response = await fetch(
            `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${fromDate}&to=${toDate}&token=${apiKey}`
        );

        if (!response.ok) {
            console.warn(`Failed to fetch news for ${symbol}`);
            return [];
        }

        const data = await response.json();

        // Filter for quality and relevance
        const relevantNews = (data || []).filter(article => {
            // Must have headline and summary
            if (!article.headline || !article.summary) return false;

            // Filter out paywalled sources
            if (isPaywalled(article.url, article.source)) {
                console.log(`🚫 Filtered out paywalled article from ${article.source}`);
                return false;
            }

            // Filter out very old articles (older than 60 days)
            const articleDate = new Date(article.datetime * 1000);
            const daysSincePublished = (Date.now() - articleDate.getTime()) / (1000 * 60 * 60 * 24);
            if (daysSincePublished > 60) return false;

            // Must mention the stock symbol or company name
            const text = (article.headline + ' ' + article.summary).toUpperCase();
            return text.includes(symbol.toUpperCase());
        });

        // Sort by date (most recent first)
        relevantNews.sort((a, b) => b.datetime - a.datetime);

        // Format and return top 25 articles for comprehensive coverage
        const articles = relevantNews.slice(0, 25).map(article => ({
            id: article.id,
            headline: article.headline,
            summary: article.summary,
            source: article.source,
            url: article.url,
            image: article.image,
            datetime: article.datetime,
            symbol: symbol,
            sentiment: analyzeSentiment(article.headline + ' ' + article.summary),
            relevance: calculateRelevance(article, symbol)
        }));

        console.log(`✅ Loaded ${articles.length} free news articles for ${symbol}`);
        return articles;
    } catch (error) {
        console.error(`Error fetching news for ${symbol}:`, error);
        return [];
    }
}

// Calculate article relevance score
function calculateRelevance(article, symbol) {
    const text = (article.headline + ' ' + article.summary).toUpperCase();
    const symbolMentions = (text.match(new RegExp(symbol.toUpperCase(), 'g')) || []).length;

    // Headline mentions are more important
    const headlineMention = article.headline.toUpperCase().includes(symbol.toUpperCase()) ? 2 : 0;

    return Math.min(10, symbolMentions + headlineMention);
}

// Fetch general market news (trading and financial news)
async function fetchMarketNews(apiKey) {
    try {
        // Fetch general financial/market news
        const response = await fetch(
            `https://finnhub.io/api/v1/news?category=general&token=${apiKey}`
        );

        if (!response.ok) {
            console.warn('Failed to fetch market news');
            return [];
        }

        const data = await response.json();

        // Comprehensive filter to ensure ALL news is trading/finance related
        const tradingKeywords = [
            // Market basics
            'stock', 'stocks', 'market', 'markets', 'trading', 'trade', 'shares', 'share', 'equity', 'equities',
            'wall street', 'nasdaq', 'dow', 'dow jones', 's&p', 's&p 500', 'sp500', 'nyse', 'index', 'indices',

            // Investors & trading
            'investor', 'investors', 'investment', 'investments', 'portfolio', 'portfolios', 'asset', 'assets',
            'trader', 'traders', 'fund', 'funds', 'hedge fund', 'mutual fund', 'etf', 'broker', 'brokerage',

            // Financial metrics
            'earnings', 'revenue', 'profit', 'profits', 'loss', 'losses', 'eps', 'p/e', 'valuation',
            'quarterly', 'quarter', 'q1', 'q2', 'q3', 'q4', 'annual', 'fiscal', 'guidance',

            // Market movements
            'bullish', 'bearish', 'rally', 'rallies', 'surge', 'surged', 'soar', 'soared', 'jump', 'jumped',
            'plunge', 'plunged', 'drop', 'dropped', 'fall', 'fell', 'decline', 'declined', 'crash', 'correction',
            'gain', 'gains', 'rise', 'rose', 'climb', 'climbed', 'spike', 'spiked', 'tumble', 'tumbled',

            // Analysis & ratings
            'analyst', 'analysts', 'upgrade', 'upgraded', 'downgrade', 'downgraded', 'rating', 'ratings',
            'price target', 'target price', 'forecast', 'outlook', 'guidance', 'estimate', 'estimates',

            // Corporate actions
            'ipo', 'merger', 'mergers', 'acquisition', 'acquisitions', 'm&a', 'buyout', 'takeover',
            'dividend', 'dividends', 'buyback', 'share buyback', 'split', 'stock split',

            // Executive & company
            'ceo', 'cfo', 'executive', 'management', 'board', 'chairman', 'earnings call',
            'sec', 'filing', '10-k', '10-q', '8-k', 'insider', 'institutional',

            // Economic indicators
            'fed', 'federal reserve', 'interest rate', 'inflation', 'gdp', 'unemployment',
            'treasury', 'yield', 'bond', 'bonds', 'monetary', 'fiscal', 'powell',

            // Sectors & industries
            'tech', 'technology', 'semiconductor', 'software', 'hardware', 'fintech',
            'healthcare', 'pharma', 'biotech', 'energy', 'oil', 'gas', 'renewable',
            'finance', 'financial', 'bank', 'banking', 'retail', 'consumer', 'industrial',

            // Crypto (relevant for trading)
            'bitcoin', 'crypto', 'cryptocurrency', 'blockchain', 'coinbase',

            // Trading terms
            'options', 'calls', 'puts', 'futures', 'short', 'long', 'volatility', 'vix',
            'bull market', 'bear market', 'volume', 'liquidity', 'bid', 'ask', 'spread'
        ];

        const tradingNews = (data || []).filter(article => {
            // Filter out paywalled sources first
            if (isPaywalled(article.url, article.source)) {
                console.log(`🚫 Filtered out paywalled market article from ${article.source}`);
                return false;
            }

            const text = (article.headline + ' ' + article.summary).toLowerCase();
            return tradingKeywords.some(keyword => text.includes(keyword));
        });

        console.log(`✅ Loaded ${tradingNews.length} free market news articles`);

        // Return up to 100 trading-related articles for comprehensive live coverage
        return tradingNews.slice(0, 100).map(article => ({
            id: article.id,
            headline: article.headline,
            summary: article.summary,
            source: article.source,
            url: article.url,
            image: article.image,
            datetime: article.datetime,
            category: article.category,
            sentiment: analyzeSentiment(article.headline + ' ' + article.summary)
        }));
    } catch (error) {
        console.error('Error fetching market news:', error);
        return [];
    }
}

// Enhanced sentiment analysis with scoring (positive/negative/neutral)
function analyzeSentiment(text) {
    if (!text) return 'neutral';

    const lowerText = text.toLowerCase();

    // Expanded and weighted sentiment words
    const strongPositive = [
        'soar', 'surge', 'skyrocket', 'explode', 'breakout', 'breakthrough', 'record high',
        'massive gain', 'strong buy', 'outperform', 'beat expectations', 'exceptional'
    ];

    const positiveWords = [
        'rally', 'gain', 'gains', 'profit', 'profits', 'growth', 'rise', 'rises', 'rising', 'jump', 'jumped',
        'climb', 'climbs', 'advance', 'beat', 'beats', 'exceed', 'exceeds', 'strong', 'bullish', 'success',
        'upgrade', 'upgraded', 'high', 'higher', 'up', 'positive', 'win', 'wins', 'boom', 'boost',
        'improve', 'improves', 'better', 'recovery', 'recover', 'momentum', 'opportunity',
        'outperform', 'outperformed', 'expand', 'expansion', 'innovative', 'promising'
    ];

    const strongNegative = [
        'crash', 'plunge', 'collapse', 'tank', 'catastrophic', 'disaster', 'plummet',
        'massive loss', 'strong sell', 'underperform', 'miss badly', 'devastating'
    ];

    const negativeWords = [
        'drop', 'drops', 'fall', 'falls', 'falling', 'loss', 'losses', 'decline', 'declines', 'tumble',
        'sink', 'sinks', 'slide', 'slides', 'miss', 'misses', 'weak', 'weaker', 'bearish', 'fail', 'fails',
        'downgrade', 'downgraded', 'low', 'lower', 'down', 'negative', 'concern', 'concerns', 'worried',
        'risk', 'risks', 'warning', 'warns', 'cut', 'cuts', 'slash', 'slashed', 'disappoint',
        'disappointing', 'struggle', 'struggles', 'hurt', 'damage', 'threat', 'volatile', 'volatility'
    ];

    let sentimentScore = 0;

    // Strong indicators count more
    strongPositive.forEach(phrase => {
        if (lowerText.includes(phrase)) sentimentScore += 3;
    });

    strongNegative.forEach(phrase => {
        if (lowerText.includes(phrase)) sentimentScore -= 3;
    });

    // Regular words
    positiveWords.forEach(word => {
        if (lowerText.includes(word)) sentimentScore += 1;
    });

    negativeWords.forEach(word => {
        if (lowerText.includes(word)) sentimentScore -= 1;
    });

    // Return sentiment based on score
    if (sentimentScore >= 3) return 'positive';
    if (sentimentScore <= -3) return 'negative';
    if (sentimentScore > 0) return 'positive';
    if (sentimentScore < 0) return 'negative';
    return 'neutral';
}

// Format timestamp to readable date
function formatNewsDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffMs = now - date;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHrs < 1) return 'Just now';
    if (diffHrs < 24) return `${diffHrs}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Make functions available globally
if (typeof window !== 'undefined') {
    window.newsFeed = {
        fetchStockNews,
        fetchMarketNews,
        analyzeSentiment,
        formatNewsDate
    };
}
