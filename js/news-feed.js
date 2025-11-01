// Real-time Stock News Feed using Finnhub API

// Fetch news for a specific stock
async function fetchStockNews(symbol, apiKey) {
    try {
        const toDate = new Date().toISOString().split('T')[0];
        const fromDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const response = await fetch(
            `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${fromDate}&to=${toDate}&token=${apiKey}`
        );

        if (!response.ok) {
            console.warn(`Failed to fetch news for ${symbol}`);
            return [];
        }

        const data = await response.json();

        // Format and limit to top 10 articles
        return (data || []).slice(0, 10).map(article => ({
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
    } catch (error) {
        console.error(`Error fetching news for ${symbol}:`, error);
        return [];
    }
}

// Fetch general market news
async function fetchMarketNews(apiKey) {
    try {
        const response = await fetch(
            `https://finnhub.io/api/v1/news?category=general&token=${apiKey}`
        );

        if (!response.ok) {
            console.warn('Failed to fetch market news');
            return [];
        }

        const data = await response.json();

        return (data || []).slice(0, 20).map(article => ({
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
