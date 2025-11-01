// Real-time Stock News Feed using Finnhub API

// Fetch news for a specific stock
async function fetchStockNews(symbol, apiKey) {
    try {
        const toDate = new Date().toISOString().split('T')[0];
        // Fetch news from last 30 days to ensure we get at least 3 articles
        const fromDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const response = await fetch(
            `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${fromDate}&to=${toDate}&token=${apiKey}`
        );

        if (!response.ok) {
            console.warn(`Failed to fetch news for ${symbol}`);
            return [];
        }

        const data = await response.json();

        // Format and return at least 3 articles, up to 20 for good coverage
        const articles = (data || []).slice(0, 20).map(article => ({
            id: article.id,
            headline: article.headline,
            summary: article.summary,
            source: article.source,
            url: article.url,
            image: article.image,
            datetime: article.datetime,
            symbol: symbol,
            sentiment: analyzeSentiment(article.headline + ' ' + article.summary)
        }));

        // Log warning if less than 3 articles found
        if (articles.length < 3) {
            console.warn(`⚠️ Only ${articles.length} news articles found for ${symbol}`);
        }

        return articles;
    } catch (error) {
        console.error(`Error fetching news for ${symbol}:`, error);
        return [];
    }
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
            const text = (article.headline + ' ' + article.summary).toLowerCase();
            return tradingKeywords.some(keyword => text.includes(keyword));
        });

        // Return up to 30 trading-related articles for comprehensive coverage
        return tradingNews.slice(0, 30).map(article => ({
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

// Simple sentiment analysis (positive/negative/neutral)
function analyzeSentiment(text) {
    if (!text) return 'neutral';

    const lowerText = text.toLowerCase();

    const positiveWords = [
        'surge', 'soar', 'rally', 'gain', 'profit', 'growth', 'rise', 'jump',
        'climb', 'advance', 'beat', 'exceed', 'strong', 'bullish', 'success',
        'upgrade', 'record', 'high', 'up', 'positive', 'win', 'boom', 'breakthrough'
    ];

    const negativeWords = [
        'plunge', 'drop', 'fall', 'loss', 'decline', 'crash', 'tank', 'tumble',
        'sink', 'slide', 'miss', 'weak', 'bearish', 'fail', 'downgrade',
        'low', 'down', 'negative', 'concern', 'risk', 'warning', 'cut', 'slash'
    ];

    let positiveCount = 0;
    let negativeCount = 0;

    positiveWords.forEach(word => {
        if (lowerText.includes(word)) positiveCount++;
    });

    negativeWords.forEach(word => {
        if (lowerText.includes(word)) negativeCount++;
    });

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
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
