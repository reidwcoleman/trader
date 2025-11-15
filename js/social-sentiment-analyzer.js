// Social Sentiment Analyzer for FinClash - Reddit & Twitter Integration
// Tracks social media buzz, trending stocks, and retail sentiment

/**
 * Social Sentiment Tracker
 * Monitors Reddit (WSB, stocks, investing) and Twitter for stock mentions
 */
class SocialSentimentAnalyzer {
    constructor() {
        this.redditData = new Map();
        this.twitterData = new Map();
        this.cache = new Map();
        this.CACHE_TTL = 15 * 60 * 1000; // 15 minutes
    }

    /**
     * Analyze Reddit sentiment for a stock
     * Uses Reddit API to fetch mentions from r/wallstreetbets, r/stocks, r/investing
     */
    async analyzeRedditSentiment(symbol) {
        // Check cache first
        const cached = this.getFromCache(`reddit_${symbol}`);
        if (cached) return cached;

        try {
            // In production, this would call Reddit API
            // For now, we'll simulate with realistic data structure
            const sentiment = await this.fetchRedditData(symbol);

            this.setCache(`reddit_${symbol}`, sentiment);
            return sentiment;
        } catch (error) {
            console.error('Reddit API error:', error);
            return this.getDefaultRedditSentiment(symbol);
        }
    }

    /**
     * Simulate Reddit API call (replace with real API in production)
     */
    async fetchRedditData(symbol) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Simulate realistic Reddit data
        const mentions = Math.floor(Math.random() * 500) + 50;
        const sentiment = (Math.random() * 2) - 1; // -1 to 1
        const bullishPosts = Math.floor(mentions * ((sentiment + 1) / 2));
        const bearishPosts = mentions - bullishPosts;

        // Trending calculation (volume spike)
        const avgMentions = 100; // Baseline
        const isTrending = mentions > avgMentions * 2;

        // Key phrases from posts
        const bullishPhrases = [
            "🚀 to the moon",
            "diamond hands 💎🤲",
            "buying the dip",
            "calls printing",
            "shorts getting squeezed",
            "strong fundamentals",
            "earnings beat incoming"
        ];

        const bearishPhrases = [
            "overvalued pump",
            "dump incoming",
            "paper hands selling",
            "puts printing",
            "earnings miss likely",
            "red flags everywhere",
            "rug pull warning"
        ];

        return {
            symbol,
            platform: 'Reddit',
            mentions: mentions,
            sentiment: sentiment.toFixed(3),
            sentimentLabel: this.getSentimentLabel(sentiment),
            bullishPosts,
            bearishPosts,
            neutralPosts: 0,
            trending: isTrending,
            trendingScore: isTrending ? Math.floor(Math.random() * 100) + 50 : Math.floor(Math.random() * 50),
            topPhrases: sentiment > 0 ? bullishPhrases.slice(0, 3) : bearishPhrases.slice(0, 3),
            subreddits: {
                wallstreetbets: Math.floor(mentions * 0.6),
                stocks: Math.floor(mentions * 0.25),
                investing: Math.floor(mentions * 0.15)
            },
            change24h: (Math.random() * 200) - 100, // % change in mentions
            avgSentiment24h: (sentiment * 0.8 + (Math.random() * 0.4 - 0.2)).toFixed(3),
            timestamp: Date.now()
        };
    }

    /**
     * Get sentiment label from score
     */
    getSentimentLabel(score) {
        if (score > 0.5) return 'Very Bullish';
        if (score > 0.2) return 'Bullish';
        if (score > -0.2) return 'Neutral';
        if (score > -0.5) return 'Bearish';
        return 'Very Bearish';
    }

    /**
     * Get Twitter sentiment (simulated - requires Twitter API in production)
     */
    async analyzeTwitterSentiment(symbol) {
        const cached = this.getFromCache(`twitter_${symbol}`);
        if (cached) return cached;

        try {
            const sentiment = await this.fetchTwitterData(symbol);
            this.setCache(`twitter_${symbol}`, sentiment);
            return sentiment;
        } catch (error) {
            console.error('Twitter API error:', error);
            return this.getDefaultTwitterSentiment(symbol);
        }
    }

    /**
     * Simulate Twitter API call
     */
    async fetchTwitterData(symbol) {
        await new Promise(resolve => setTimeout(resolve, 500));

        const tweets = Math.floor(Math.random() * 2000) + 200;
        const sentiment = (Math.random() * 2) - 1;
        const bullishTweets = Math.floor(tweets * ((sentiment + 1) / 2));
        const bearishTweets = tweets - bullishTweets;

        // Influencer activity (verified accounts)
        const influencerMentions = Math.floor(Math.random() * 20);

        return {
            symbol,
            platform: 'Twitter',
            tweets: tweets,
            sentiment: sentiment.toFixed(3),
            sentimentLabel: this.getSentimentLabel(sentiment),
            bullishTweets,
            bearishTweets,
            neutralTweets: 0,
            retweets: Math.floor(tweets * 0.3),
            likes: Math.floor(tweets * 1.5),
            influencerMentions,
            topHashtags: [`#${symbol}`, '#stocks', '#trading', '#investing'].slice(0, 3),
            volume24h: tweets,
            change24h: (Math.random() * 300) - 150,
            timestamp: Date.now()
        };
    }

    /**
     * Combine Reddit + Twitter for overall social sentiment
     */
    async getCombinedSentiment(symbol) {
        const [reddit, twitter] = await Promise.all([
            this.analyzeRedditSentiment(symbol),
            this.analyzeTwitterSentiment(symbol)
        ]);

        // Weighted combination (Reddit 60%, Twitter 40% for stock sentiment)
        const combinedScore = (parseFloat(reddit.sentiment) * 0.6) +
                             (parseFloat(twitter.sentiment) * 0.4);

        const totalMentions = reddit.mentions + twitter.tweets;
        const totalBullish = reddit.bullishPosts + twitter.bullishTweets;
        const totalBearish = reddit.bearishPosts + twitter.bearishTweets;

        // Calculate buzz score (0-100)
        const buzzScore = Math.min(100, Math.floor(
            (reddit.trendingScore * 0.6 + (twitter.volume24h / 20) * 0.4)
        ));

        // Determine if stock is "memeing" (viral on social)
        const isMemeing = buzzScore > 75 || reddit.trending;

        return {
            symbol,
            overall: {
                sentiment: combinedScore.toFixed(3),
                sentimentLabel: this.getSentimentLabel(combinedScore),
                totalMentions,
                bullishMentions: totalBullish,
                bearishMentions: totalBearish,
                bullishPercent: ((totalBullish / totalMentions) * 100).toFixed(1),
                bearishPercent: ((totalBearish / totalMentions) * 100).toFixed(1),
                buzzScore,
                isMemeing,
                trendingRank: this.getTrendingRank(buzzScore)
            },
            reddit,
            twitter,
            insights: this.generateInsights(reddit, twitter, combinedScore, isMemeing),
            recommendation: this.getRecommendation(combinedScore, buzzScore, isMemeing),
            timestamp: Date.now()
        };
    }

    /**
     * Get trending rank category
     */
    getTrendingRank(buzzScore) {
        if (buzzScore >= 90) return '🔥🔥🔥 VIRAL';
        if (buzzScore >= 75) return '🔥🔥 HOT';
        if (buzzScore >= 60) return '🔥 Trending';
        if (buzzScore >= 40) return '📈 Rising';
        return '📊 Normal';
    }

    /**
     * Generate actionable insights
     */
    generateInsights(reddit, twitter, sentiment, isMemeing) {
        const insights = [];

        // Meme stock warning
        if (isMemeing) {
            insights.push({
                type: 'warning',
                emoji: '⚠️',
                title: 'Meme Stock Alert',
                message: `${reddit.symbol} is trending heavily on social media. Extreme volatility expected. Use caution.`,
                severity: 'high'
            });
        }

        // Reddit dominance
        if (reddit.mentions > twitter.tweets * 0.5) {
            insights.push({
                type: 'info',
                emoji: '👥',
                title: 'Retail Investor Interest',
                message: `Strong Reddit activity (${reddit.mentions} mentions). Retail traders are watching this stock closely.`,
                severity: 'medium'
            });
        }

        // Sentiment shift
        const sentimentChange = parseFloat(reddit.sentiment) - parseFloat(reddit.avgSentiment24h);
        if (Math.abs(sentimentChange) > 0.3) {
            insights.push({
                type: sentimentChange > 0 ? 'positive' : 'negative',
                emoji: sentimentChange > 0 ? '📈' : '📉',
                title: 'Sentiment Shift Detected',
                message: `Social sentiment has ${sentimentChange > 0 ? 'improved' : 'declined'} significantly in the last 24 hours.`,
                severity: 'medium'
            });
        }

        // Volume spike
        if (reddit.change24h > 100) {
            insights.push({
                type: 'info',
                emoji: '📢',
                title: 'Mention Spike',
                message: `Social media mentions up ${reddit.change24h.toFixed(0)}% in 24h. Something is happening.`,
                severity: 'high'
            });
        }

        // Influencer attention
        if (twitter.influencerMentions > 10) {
            insights.push({
                type: 'info',
                emoji: '🌟',
                title: 'Influencer Activity',
                message: `${twitter.influencerMentions} verified accounts discussing ${reddit.symbol}. Mainstream attention growing.`,
                severity: 'medium'
            });
        }

        return insights;
    }

    /**
     * Get trading recommendation based on social sentiment
     */
    getRecommendation(sentiment, buzzScore, isMemeing) {
        if (isMemeing) {
            return {
                action: 'EXTREME CAUTION',
                color: 'orange',
                advice: 'This stock is a meme. High risk of pump & dump. Only trade with money you can afford to lose. Set tight stops.',
                confidence: 'Low (Speculative)',
                timeframe: 'Very Short-Term'
            };
        }

        if (sentiment > 0.5 && buzzScore < 60) {
            return {
                action: 'MONITOR - Bullish Social',
                color: 'green',
                advice: 'Positive social sentiment with moderate buzz. Good for swing trades. Confirm with technical analysis.',
                confidence: 'Medium',
                timeframe: 'Short to Medium-Term'
            };
        }

        if (sentiment < -0.5) {
            return {
                action: 'AVOID',
                color: 'red',
                advice: 'Very negative social sentiment. Retail traders are bearish. Wait for sentiment to improve before entering.',
                confidence: 'Medium',
                timeframe: 'N/A'
            };
        }

        return {
            action: 'NEUTRAL',
            color: 'gray',
            advice: 'Mixed or neutral social sentiment. Use technical and fundamental analysis as primary signals.',
            confidence: 'Low',
            timeframe: 'N/A'
        };
    }

    /**
     * Get trending stocks across all social platforms
     */
    async getTrendingStocks(limit = 10) {
        // Simulated trending stocks (in production, aggregate from real APIs)
        const trendingSymbols = [
            { symbol: 'GME', buzzScore: 95, sentiment: 0.6, mentions: 15000 },
            { symbol: 'TSLA', buzzScore: 88, sentiment: 0.4, mentions: 12000 },
            { symbol: 'AAPL', buzzScore: 75, sentiment: 0.3, mentions: 8000 },
            { symbol: 'NVDA', buzzScore: 72, sentiment: 0.5, mentions: 6500 },
            { symbol: 'AMC', buzzScore: 68, sentiment: 0.2, mentions: 5500 },
            { symbol: 'SPY', buzzScore: 55, sentiment: 0.1, mentions: 4000 },
            { symbol: 'PLTR', buzzScore: 52, sentiment: -0.1, mentions: 3500 },
            { symbol: 'AMD', buzzScore: 48, sentiment: 0.3, mentions: 3000 },
            { symbol: 'MSFT', buzzScore: 45, sentiment: 0.2, mentions: 2800 },
            { symbol: 'META', buzzScore: 42, sentiment: -0.2, mentions: 2500 }
        ];

        return trendingSymbols.slice(0, limit).map(stock => ({
            ...stock,
            sentimentLabel: this.getSentimentLabel(stock.sentiment),
            trendingRank: this.getTrendingRank(stock.buzzScore)
        }));
    }

    /**
     * Cache management
     */
    getFromCache(key) {
        const cached = this.cache.get(key);
        if (cached && (Date.now() - cached.timestamp) < this.CACHE_TTL) {
            return cached.data;
        }
        return null;
    }

    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });

        // Clean old cache entries
        if (this.cache.size > 100) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
    }

    /**
     * Default fallback data
     */
    getDefaultRedditSentiment(symbol) {
        return {
            symbol,
            platform: 'Reddit',
            mentions: 0,
            sentiment: '0',
            sentimentLabel: 'Unknown',
            bullishPosts: 0,
            bearishPosts: 0,
            trending: false,
            trendingScore: 0,
            topPhrases: [],
            error: 'No data available'
        };
    }

    getDefaultTwitterSentiment(symbol) {
        return {
            symbol,
            platform: 'Twitter',
            tweets: 0,
            sentiment: '0',
            sentimentLabel: 'Unknown',
            bullishTweets: 0,
            bearishTweets: 0,
            error: 'No data available'
        };
    }
}

/**
 * Social Buzz Detector
 * Detects unusual social media activity (potential pumps/dumps)
 */
class SocialBuzzDetector {
    constructor() {
        this.baseline = new Map(); // Store normal activity levels
    }

    /**
     * Detect if stock has unusual social activity
     */
    detectUnusualActivity(currentMentions, symbol) {
        const baseline = this.getBaseline(symbol);
        const threshold = baseline * 3; // 3x normal = unusual

        const isUnusual = currentMentions > threshold;
        const intensity = isUnusual ? (currentMentions / baseline).toFixed(1) : 1;

        return {
            isUnusual,
            intensity: `${intensity}x normal`,
            currentMentions,
            normalMentions: baseline,
            alert: isUnusual ? `🚨 ${symbol} social activity is ${intensity}x above normal!` : null
        };
    }

    /**
     * Get baseline mentions for a stock (simulated)
     */
    getBaseline(symbol) {
        // Popular stocks have higher baselines
        const popularStocks = {
            'TSLA': 5000,
            'AAPL': 3000,
            'GME': 2000,
            'AMC': 1500,
            'NVDA': 1000,
            'MSFT': 1000
        };

        return popularStocks[symbol] || 500;
    }

    /**
     * Calculate pump & dump risk score
     */
    calculatePumpRisk(socialData) {
        let riskScore = 0;

        // Factor 1: Extreme mentions spike
        if (socialData.reddit.change24h > 200) riskScore += 30;
        else if (socialData.reddit.change24h > 100) riskScore += 15;

        // Factor 2: Very high sentiment (too good to be true)
        const sentiment = parseFloat(socialData.overall.sentiment);
        if (sentiment > 0.8) riskScore += 25;

        // Factor 3: Memeing status
        if (socialData.overall.isMemeing) riskScore += 20;

        // Factor 4: Low quality phrases (rocket emojis, moon talk)
        const pumpPhrases = ['moon', '🚀', 'squeeze', 'diamond'];
        const hasPumpTalk = socialData.reddit.topPhrases.some(phrase =>
            pumpPhrases.some(pump => phrase.toLowerCase().includes(pump))
        );
        if (hasPumpTalk) riskScore += 15;

        // Factor 5: Sudden influencer attention
        if (socialData.twitter.influencerMentions > 15) riskScore += 10;

        return {
            score: Math.min(100, riskScore),
            level: riskScore > 70 ? 'HIGH' : riskScore > 40 ? 'MEDIUM' : 'LOW',
            warning: riskScore > 70 ? '⚠️ HIGH RISK: Potential pump & dump pattern detected!' : null
        };
    }
}

// Export for use in main app
if (typeof window !== 'undefined') {
    window.SocialSentimentAnalyzer = SocialSentimentAnalyzer;
    window.SocialBuzzDetector = SocialBuzzDetector;
}
