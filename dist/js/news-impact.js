// Enhanced News Impact Scoring for FinClash
// AI-powered news importance and impact analysis

/**
 * News event categories with impact weights
 */
const EVENT_CATEGORIES = {
    EARNINGS: {
        keywords: ['earnings', 'quarterly results', 'eps', 'revenue', 'earnings report', 'q1', 'q2', 'q3', 'q4'],
        baseImpact: 90,
        description: 'Earnings Report'
    },
    GUIDANCE: {
        keywords: ['guidance', 'forecast', 'outlook', 'expects', 'projects', 'estimates'],
        baseImpact: 85,
        description: 'Company Guidance'
    },
    MERGER_ACQUISITION: {
        keywords: ['merger', 'acquisition', 'acquire', 'takeover', 'buyout', 'deal', 'm&a'],
        baseImpact: 95,
        description: 'M&A Activity'
    },
    PRODUCT_LAUNCH: {
        keywords: ['launches', 'unveils', 'introduces', 'announces', 'new product', 'release'],
        baseImpact: 70,
        description: 'Product Launch'
    },
    ANALYST_RATING: {
        keywords: ['upgrade', 'downgrade', 'rating', 'price target', 'analyst', 'maintains'],
        baseImpact: 65,
        description: 'Analyst Rating Change'
    },
    REGULATORY: {
        keywords: ['fda', 'sec', 'investigation', 'lawsuit', 'regulatory', 'approval', 'lawsuit'],
        baseImpact: 85,
        description: 'Regulatory News'
    },
    LEADERSHIP: {
        keywords: ['ceo', 'cfo', 'executive', 'resigns', 'appointed', 'joins', 'leaves'],
        baseImpact: 75,
        description: 'Leadership Change'
    },
    PARTNERSHIP: {
        keywords: ['partnership', 'collaborates', 'partners with', 'agreement', 'signs deal'],
        baseImpact: 70,
        description: 'Partnership/Collaboration'
    },
    DIVIDEND: {
        keywords: ['dividend', 'buyback', 'share repurchase', 'special dividend'],
        baseImpact: 60,
        description: 'Dividend/Buyback'
    },
    RESTRUCTURING: {
        keywords: ['layoffs', 'restructuring', 'cost cutting', 'workforce reduction'],
        baseImpact: 75,
        description: 'Corporate Restructuring'
    }
};

/**
 * Detect news event type
 */
function detectEventType(headline, summary) {
    const text = (headline + ' ' + summary).toLowerCase();
    const detectedEvents = [];

    Object.entries(EVENT_CATEGORIES).forEach(([type, config]) => {
        const matches = config.keywords.filter(keyword =>
            text.includes(keyword.toLowerCase())
        );
        if (matches.length > 0) {
            detectedEvents.push({
                type,
                description: config.description,
                baseImpact: config.baseImpact,
                matches: matches.length
            });
        }
    });

    // Return highest impact event or null
    if (detectedEvents.length === 0) {
        return null;
    }

    return detectedEvents.sort((a, b) => b.baseImpact - a.baseImpact)[0];
}

/**
 * Calculate news freshness score (0-100)
 * More recent news has higher impact
 */
function calculateFreshnessScore(timestamp) {
    const now = Date.now();
    const articleTime = timestamp * 1000;
    const hoursAgo = (now - articleTime) / (1000 * 60 * 60);

    if (hoursAgo < 1) return 100;
    if (hoursAgo < 4) return 95;
    if (hoursAgo < 12) return 85;
    if (hoursAgo < 24) return 70;
    if (hoursAgo < 48) return 50;
    if (hoursAgo < 72) return 30;
    if (hoursAgo < 168) return 15; // 1 week
    return 5;
}

/**
 * Calculate source credibility score
 * More reputable sources get higher scores
 */
function calculateSourceCredibility(source) {
    const highCredibility = [
        'Reuters', 'Bloomberg', 'CNBC', 'MarketWatch', 'Barron\'s',
        'Financial Times', 'The Wall Street Journal', 'Yahoo Finance',
        'Dow Jones', 'Associated Press', 'Forbes'
    ];

    const mediumCredibility = [
        'Business Insider', 'TechCrunch', 'The Verge', 'Seeking Alpha',
        'Investor\'s Business Daily', 'TheStreet', 'Benzinga'
    ];

    const sourceLower = source.toLowerCase();

    if (highCredibility.some(s => sourceLower.includes(s.toLowerCase()))) {
        return 100;
    }
    if (mediumCredibility.some(s => sourceLower.includes(s.toLowerCase()))) {
        return 75;
    }
    return 50; // Default for unknown sources
}

/**
 * Analyze headline strength
 * Strong action words indicate higher impact
 */
function analyzeHeadlineStrength(headline) {
    const strongWords = [
        'surge', 'soar', 'plunge', 'crash', 'explode', 'skyrocket',
        'plummet', 'breaks', 'shatters', 'hits', 'reaches', 'exceeds'
    ];

    const moderateWords = [
        'rise', 'fall', 'gain', 'drop', 'increase', 'decrease',
        'jump', 'slide', 'climb', 'sink'
    ];

    const headlineLower = headline.toLowerCase();

    const strongMatches = strongWords.filter(word => headlineLower.includes(word)).length;
    const moderateMatches = moderateWords.filter(word => headlineLower.includes(word)).length;

    if (strongMatches > 0) return { strength: 'strong', score: 90 };
    if (moderateMatches > 0) return { strength: 'moderate', score: 70 };
    return { strength: 'weak', score: 50 };
}

/**
 * Calculate comprehensive news impact score (0-100)
 */
function calculateNewsImpact(article) {
    const eventType = detectEventType(article.headline, article.summary || '');
    const freshness = calculateFreshnessScore(article.datetime);
    const credibility = calculateSourceCredibility(article.source);
    const headlineStrength = analyzeHeadlineStrength(article.headline);

    // Weighted components
    let impactScore = 0;

    // Event type impact (40%)
    if (eventType) {
        impactScore += eventType.baseImpact * 0.4;
    } else {
        impactScore += 40; // Default for non-categorized news
    }

    // Freshness (25%)
    impactScore += freshness * 0.25;

    // Source credibility (20%)
    impactScore += credibility * 0.20;

    // Headline strength (15%)
    impactScore += headlineStrength.score * 0.15;

    return {
        impactScore: Math.round(impactScore),
        eventType: eventType ? eventType.description : 'General News',
        freshness: Math.round(freshness),
        credibility: Math.round(credibility),
        headlineStrength: headlineStrength.strength,
        isHighImpact: impactScore >= 75,
        isMediumImpact: impactScore >= 50 && impactScore < 75,
        isLowImpact: impactScore < 50
    };
}

/**
 * Analyze news sentiment trend over time
 */
function analyzeNewsTrend(articles, symbol) {
    if (!articles || articles.length === 0) {
        return {
            trend: 'neutral',
            score: 0,
            recentSentiment: 'neutral',
            historicalSentiment: 'neutral'
        };
    }

    // Sort by date
    const sortedArticles = [...articles].sort((a, b) => b.datetime - a.datetime);

    // Split into recent (last 7 days) and historical (7-30 days)
    const now = Date.now() / 1000;
    const sevenDaysAgo = now - (7 * 24 * 60 * 60);

    const recentArticles = sortedArticles.filter(a => a.datetime >= sevenDaysAgo);
    const historicalArticles = sortedArticles.filter(a => a.datetime < sevenDaysAgo);

    // Calculate sentiment scores
    const calculateSentimentScore = (articles) => {
        if (articles.length === 0) return 0;
        return articles.reduce((sum, article) => {
            if (article.sentiment === 'positive') return sum + 1;
            if (article.sentiment === 'negative') return sum - 1;
            return sum;
        }, 0) / articles.length;
    };

    const recentScore = calculateSentimentScore(recentArticles);
    const historicalScore = calculateSentimentScore(historicalArticles);

    // Determine trend
    let trend;
    const diff = recentScore - historicalScore;
    if (diff > 0.3) trend = 'improving';
    else if (diff < -0.3) trend = 'deteriorating';
    else trend = 'stable';

    const getSentimentLabel = (score) => {
        if (score > 0.3) return 'positive';
        if (score < -0.3) return 'negative';
        return 'neutral';
    };

    return {
        trend,
        trendScore: diff.toFixed(2),
        recentSentiment: getSentimentLabel(recentScore),
        historicalSentiment: getSentimentLabel(historicalScore),
        recentArticleCount: recentArticles.length,
        historicalArticleCount: historicalArticles.length,
        totalArticles: articles.length
    };
}

/**
 * Calculate news velocity (how fast is news coming out?)
 */
function calculateNewsVelocity(articles) {
    if (!articles || articles.length < 2) {
        return { velocity: 0, interpretation: 'low' };
    }

    // Count articles in different time windows
    const now = Date.now() / 1000;
    const last24h = articles.filter(a => (now - a.datetime) < 24 * 60 * 60).length;
    const last7d = articles.filter(a => (now - a.datetime) < 7 * 24 * 60 * 60).length;
    const last30d = articles.length;

    // Calculate velocity (articles per day)
    const velocity24h = last24h;
    const velocity7d = last7d / 7;
    const velocity30d = last30d / 30;

    // Determine interpretation
    let interpretation, velocityScore;
    if (velocity24h > 5) {
        interpretation = 'very high';
        velocityScore = 100;
    } else if (velocity24h > 3) {
        interpretation = 'high';
        velocityScore = 80;
    } else if (velocity7d > 2) {
        interpretation = 'moderate';
        velocityScore = 60;
    } else if (velocity30d > 1) {
        interpretation = 'normal';
        velocityScore = 40;
    } else {
        interpretation = 'low';
        velocityScore = 20;
    }

    return {
        velocity: velocity24h.toFixed(1),
        velocityScore,
        interpretation,
        last24h,
        last7d,
        last30d,
        avgPerDay: velocity30d.toFixed(1)
    };
}

/**
 * Generate comprehensive news analysis
 */
async function analyzeNewsComprehensive(articles, symbol) {
    if (!articles || articles.length === 0) {
        return {
            overallScore: 50,
            sentiment: 'neutral',
            newsCount: 0,
            highImpactCount: 0,
            trend: 'stable',
            velocity: 'low',
            topStories: []
        };
    }

    // Calculate impact scores for all articles
    const articlesWithImpact = articles.map(article => ({
        ...article,
        impact: calculateNewsImpact(article)
    }));

    // Sort by impact score
    const topStories = articlesWithImpact
        .sort((a, b) => b.impact.impactScore - a.impact.impactScore)
        .slice(0, 10);

    // Count high impact news
    const highImpactCount = articlesWithImpact.filter(a => a.impact.isHighImpact).length;
    const mediumImpactCount = articlesWithImpact.filter(a => a.impact.isMediumImpact).length;

    // Analyze trend
    const trend = analyzeNewsTrend(articles, symbol);

    // Calculate velocity
    const velocity = calculateNewsVelocity(articles);

    // Calculate weighted sentiment score
    let sentimentScore = 0;
    articlesWithImpact.forEach(article => {
        const weight = article.impact.impactScore / 100;
        if (article.sentiment === 'positive') {
            sentimentScore += weight;
        } else if (article.sentiment === 'negative') {
            sentimentScore -= weight;
        }
    });

    // Normalize sentiment score to 0-100
    const normalizedSentiment = 50 + (sentimentScore / articlesWithImpact.length) * 30;

    // Overall news score (combines sentiment, impact, trend)
    let overallScore = normalizedSentiment * 0.5; // 50% weight on sentiment

    // Trend bonus/penalty
    if (trend.trend === 'improving') overallScore += 10;
    else if (trend.trend === 'deteriorating') overallScore -= 10;

    // High impact news bonus
    overallScore += (highImpactCount / articlesWithImpact.length) * 15;

    // Velocity consideration
    if (velocity.interpretation === 'very high' && trend.recentSentiment === 'positive') {
        overallScore += 10; // Lots of positive news = bullish
    } else if (velocity.interpretation === 'very high' && trend.recentSentiment === 'negative') {
        overallScore -= 10; // Lots of negative news = bearish
    }

    overallScore = Math.max(0, Math.min(100, overallScore));

    return {
        overallScore: Math.round(overallScore),
        sentiment: normalizedSentiment > 60 ? 'positive' : normalizedSentiment < 40 ? 'negative' : 'neutral',
        newsCount: articles.length,
        highImpactCount,
        mediumImpactCount,
        trend: trend.trend,
        trendDetails: trend,
        velocity: velocity.interpretation,
        velocityDetails: velocity,
        topStories: topStories.slice(0, 5),
        recentSentiment: trend.recentSentiment,
        analysis: this.generateNewsAnalysisText(overallScore, trend, velocity, highImpactCount)
    };
}

/**
 * Generate human-readable analysis text
 */
function generateNewsAnalysisText(score, trend, velocity, highImpactCount) {
    let text = '';

    // Overall sentiment
    if (score >= 75) {
        text += '🟢 Very positive news sentiment. ';
    } else if (score >= 60) {
        text += '🟢 Positive news sentiment. ';
    } else if (score >= 40) {
        text += '⚪ Neutral news sentiment. ';
    } else if (score >= 25) {
        text += '🔴 Negative news sentiment. ';
    } else {
        text += '🔴 Very negative news sentiment. ';
    }

    // Trend
    if (trend.trend === 'improving') {
        text += 'News sentiment improving over time. ';
    } else if (trend.trend === 'deteriorating') {
        text += 'News sentiment worsening recently. ';
    } else {
        text += 'News sentiment stable. ';
    }

    // Velocity
    if (velocity.interpretation === 'very high') {
        text += `High news activity (${velocity.last24h} articles in 24h). `;
    } else if (velocity.interpretation === 'high') {
        text += 'Elevated news coverage. ';
    }

    // High impact news
    if (highImpactCount > 0) {
        text += `${highImpactCount} high-impact stories detected.`;
    }

    return text;
}

// Export functions
if (typeof window !== 'undefined') {
    window.newsImpact = {
        calculateNewsImpact,
        analyzeNewsTrend,
        calculateNewsVelocity,
        analyzeNewsComprehensive,
        detectEventType,
        EVENT_CATEGORIES
    };
}
