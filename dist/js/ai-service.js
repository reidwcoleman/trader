// Advanced AI Service for FinClash - Real AI-Powered Analysis
// Integrates multiple AI/ML services for comprehensive stock analysis

/**
 * AI-Powered Financial Sentiment Analysis using HuggingFace FinBERT
 * FinBERT is a BERT model fine-tuned on financial text for sentiment analysis
 */
class AIService {
    constructor() {
        // HuggingFace Inference API (Free tier available)
        this.hfApiKey = 'hf_your_key_here'; // User should replace with their key
        this.hfModel = 'ProsusAI/finbert'; // FinBERT model for financial sentiment

        // Cache for API calls to reduce costs
        this.sentimentCache = new Map();
        this.trendsCache = new Map();
        this.socialCache = new Map();

        // Cache expiry times (in milliseconds)
        this.SENTIMENT_CACHE_TTL = 15 * 60 * 1000; // 15 minutes
        this.TRENDS_CACHE_TTL = 60 * 60 * 1000; // 1 hour
        this.SOCIAL_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * Analyze financial text sentiment using HuggingFace FinBERT
     * Returns: { sentiment: 'positive'|'negative'|'neutral', score: 0-1, confidence: 0-100 }
     */
    async analyzeFinancialSentiment(text, symbol = '') {
        if (!text || text.trim().length === 0) {
            return { sentiment: 'neutral', score: 0, confidence: 0 };
        }

        // Check cache first
        const cacheKey = `${symbol}:${text.substring(0, 50)}`;
        const cached = this.getCached(this.sentimentCache, cacheKey, this.SENTIMENT_CACHE_TTL);
        if (cached) return cached;

        try {
            // Fallback to enhanced keyword-based if no API key
            if (!this.hfApiKey || this.hfApiKey === 'hf_your_key_here') {
                return this.enhancedKeywordSentiment(text);
            }

            const response = await fetch(
                `https://api-inference.huggingface.co/models/${this.hfModel}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.hfApiKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        inputs: text.substring(0, 512), // FinBERT max length
                        options: { wait_for_model: true }
                    })
                }
            );

            if (!response.ok) {
                console.warn('FinBERT API failed, using fallback sentiment');
                return this.enhancedKeywordSentiment(text);
            }

            const result = await response.json();

            // FinBERT returns array of label scores
            // Format: [{ label: 'positive', score: 0.9 }, { label: 'negative', score: 0.05 }, ...]
            const scores = Array.isArray(result[0]) ? result[0] : result;
            const topScore = scores.reduce((max, curr) =>
                curr.score > max.score ? curr : max
            );

            const sentiment = topScore.label.toLowerCase();
            const confidence = Math.round(topScore.score * 100);

            const analysis = {
                sentiment,
                score: topScore.score,
                confidence,
                method: 'finbert',
                allScores: scores
            };

            // Cache result
            this.setCache(this.sentimentCache, cacheKey, analysis);

            return analysis;
        } catch (error) {
            console.error('Error in FinBERT sentiment analysis:', error);
            return this.enhancedKeywordSentiment(text);
        }
    }

    /**
     * Enhanced keyword-based sentiment as fallback
     * More sophisticated than basic keyword matching
     */
    enhancedKeywordSentiment(text) {
        const lowerText = text.toLowerCase();

        // Advanced sentiment patterns with weights
        const patterns = {
            strongPositive: {
                words: ['soar', 'surge', 'skyrocket', 'explode', 'breakthrough', 'record high',
                       'massive gain', 'strong buy', 'outperform', 'beat expectations', 'exceptional',
                       'all-time high', 'stellar', 'impressive', 'outstanding'],
                weight: 3
            },
            positive: {
                words: ['rally', 'gain', 'profit', 'growth', 'rise', 'jump', 'climb', 'advance',
                       'beat', 'exceed', 'strong', 'bullish', 'upgrade', 'positive', 'win',
                       'boom', 'boost', 'improve', 'better', 'recovery', 'momentum', 'opportunity'],
                weight: 1
            },
            strongNegative: {
                words: ['crash', 'plunge', 'collapse', 'tank', 'catastrophic', 'disaster',
                       'plummet', 'massive loss', 'strong sell', 'devastating', 'bankruptcy'],
                weight: -3
            },
            negative: {
                words: ['drop', 'fall', 'loss', 'decline', 'tumble', 'sink', 'slide', 'miss',
                       'weak', 'bearish', 'fail', 'downgrade', 'negative', 'concern', 'risk',
                       'warning', 'cut', 'slash', 'disappoint', 'struggle', 'hurt'],
                weight: -1
            }
        };

        let score = 0;
        let matchCount = 0;

        // Count pattern matches
        Object.entries(patterns).forEach(([category, { words, weight }]) => {
            words.forEach(word => {
                const regex = new RegExp(`\\b${word}\\b`, 'gi');
                const matches = (lowerText.match(regex) || []).length;
                if (matches > 0) {
                    score += weight * matches;
                    matchCount += matches;
                }
            });
        });

        // Determine sentiment
        let sentiment, confidence;
        if (score >= 3) {
            sentiment = 'positive';
            confidence = Math.min(95, 60 + (score * 5));
        } else if (score > 0) {
            sentiment = 'positive';
            confidence = Math.min(75, 50 + (score * 10));
        } else if (score <= -3) {
            sentiment = 'negative';
            confidence = Math.min(95, 60 + (Math.abs(score) * 5));
        } else if (score < 0) {
            sentiment = 'negative';
            confidence = Math.min(75, 50 + (Math.abs(score) * 10));
        } else {
            sentiment = 'neutral';
            confidence = 40;
        }

        return {
            sentiment,
            score: (score + 10) / 20, // Normalize to 0-1
            confidence,
            method: 'keyword',
            matchCount
        };
    }

    /**
     * Get social sentiment from Reddit (wallstreetbets, stocks, investing)
     * Returns: { mentions: number, sentiment: 'positive'|'negative'|'neutral', buzz: 0-100 }
     */
    async getSocialSentiment(symbol) {
        // Check cache
        const cached = this.getCached(this.socialCache, symbol, this.SOCIAL_CACHE_TTL);
        if (cached) return cached;

        try {
            // Use Reddit's JSON API (no auth needed for reading public posts)
            const subreddits = ['wallstreetbets', 'stocks', 'investing'];
            let totalMentions = 0;
            let sentimentScore = 0;
            const posts = [];

            for (const subreddit of subreddits) {
                try {
                    const response = await fetch(
                        `https://www.reddit.com/r/${subreddit}/hot.json?limit=100`,
                        {
                            headers: {
                                'User-Agent': 'FinClash Trading Simulator/1.0'
                            }
                        }
                    );

                    if (response.ok) {
                        const data = await response.json();
                        const relevantPosts = data.data.children
                            .filter(post => {
                                const text = (post.data.title + ' ' + (post.data.selftext || '')).toUpperCase();
                                return text.includes(symbol.toUpperCase()) ||
                                       text.includes(`$${symbol.toUpperCase()}`);
                            });

                        relevantPosts.forEach(post => {
                            totalMentions++;
                            const text = post.data.title + ' ' + (post.data.selftext || '');
                            const sentiment = this.enhancedKeywordSentiment(text);

                            // Weight by upvotes (more upvotes = more important)
                            const weight = Math.log10(post.data.ups + 1);
                            sentimentScore += (sentiment.score - 0.5) * weight;

                            posts.push({
                                title: post.data.title,
                                subreddit: post.data.subreddit,
                                upvotes: post.data.ups,
                                comments: post.data.num_comments,
                                url: `https://reddit.com${post.data.permalink}`,
                                sentiment: sentiment.sentiment
                            });
                        });
                    }
                } catch (error) {
                    console.warn(`Failed to fetch from r/${subreddit}:`, error);
                }
            }

            // Calculate aggregate sentiment
            let overallSentiment = 'neutral';
            if (sentimentScore > 0.5) overallSentiment = 'positive';
            else if (sentimentScore < -0.5) overallSentiment = 'negative';

            // Buzz score (0-100) based on mentions
            const buzz = Math.min(100, totalMentions * 5);

            const result = {
                mentions: totalMentions,
                sentiment: overallSentiment,
                sentimentScore,
                buzz,
                posts: posts.slice(0, 10), // Top 10 posts
                timestamp: Date.now()
            };

            this.setCache(this.socialCache, symbol, result);
            return result;

        } catch (error) {
            console.error('Error fetching social sentiment:', error);
            return {
                mentions: 0,
                sentiment: 'neutral',
                buzz: 0,
                posts: [],
                error: error.message
            };
        }
    }

    /**
     * Get Google Trends interest over time
     * Note: Direct Google Trends API requires serpapi.com or similar service
     * This uses a simplified approach
     */
    async getSearchTrends(symbol, companyName) {
        const cacheKey = `${symbol}:${companyName}`;
        const cached = this.getCached(this.trendsCache, cacheKey, this.TRENDS_CACHE_TTL);
        if (cached) return cached;

        // Simplified trends calculation based on news volume as proxy
        // In production, use serpapi.com or similar for real Google Trends data
        try {
            const news = await window.newsFeed.fetchStockNews(symbol, window.FINNHUB_API_KEY);
            const recentNews = news.filter(article => {
                const daysSince = (Date.now() - article.datetime * 1000) / (1000 * 60 * 60 * 24);
                return daysSince <= 7;
            });

            // Trend score based on recent news volume
            const trendScore = Math.min(100, recentNews.length * 4);
            const trend = trendScore > 70 ? 'rising' : trendScore > 30 ? 'stable' : 'falling';

            const result = {
                symbol,
                trendScore,
                trend,
                recentNewsCount: recentNews.length,
                note: 'Based on news volume proxy. Integrate serpapi.com for real Google Trends data.',
                timestamp: Date.now()
            };

            this.setCache(this.trendsCache, cacheKey, result);
            return result;
        } catch (error) {
            console.error('Error calculating search trends:', error);
            return { trendScore: 50, trend: 'stable', error: error.message };
        }
    }

    /**
     * Detect market regime (bull, bear, sideways, volatile)
     * Uses price action and volatility
     */
    detectMarketRegime(historicalData) {
        if (!historicalData || !historicalData.closes || historicalData.closes.length < 50) {
            return { regime: 'unknown', confidence: 0 };
        }

        const closes = historicalData.closes;
        const recent20 = closes.slice(-20);
        const recent50 = closes.slice(-50);

        // Calculate trends
        const sma20 = recent20.reduce((sum, val) => sum + val, 0) / 20;
        const sma50 = recent50.reduce((sum, val) => sum + val, 0) / 50;
        const currentPrice = closes[closes.length - 1];

        // Calculate volatility (standard deviation)
        const mean = sma20;
        const squaredDiffs = recent20.map(price => Math.pow(price - mean, 2));
        const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / 20;
        const stdDev = Math.sqrt(variance);
        const volatilityPct = (stdDev / mean) * 100;

        // Trend analysis
        const trend20 = ((sma20 - recent20[0]) / recent20[0]) * 100;
        const trend50 = ((sma50 - recent50[0]) / recent50[0]) * 100;

        let regime, confidence;

        // Determine regime
        if (volatilityPct > 3.5) {
            regime = 'volatile';
            confidence = Math.min(95, volatilityPct * 20);
        } else if (trend20 > 3 && trend50 > 2 && currentPrice > sma20 && currentPrice > sma50) {
            regime = 'bull';
            confidence = Math.min(95, 60 + Math.abs(trend20) * 5);
        } else if (trend20 < -3 && trend50 < -2 && currentPrice < sma20 && currentPrice < sma50) {
            regime = 'bear';
            confidence = Math.min(95, 60 + Math.abs(trend20) * 5);
        } else if (Math.abs(trend20) < 2 && volatilityPct < 2) {
            regime = 'sideways';
            confidence = Math.min(85, 50 + (2 - volatilityPct) * 15);
        } else {
            regime = 'transitioning';
            confidence = 40;
        }

        return {
            regime,
            confidence: Math.round(confidence),
            volatility: volatilityPct.toFixed(2),
            trend20Day: trend20.toFixed(2),
            trend50Day: trend50.toFixed(2),
            sma20,
            sma50,
            description: this.getRegimeDescription(regime)
        };
    }

    getRegimeDescription(regime) {
        const descriptions = {
            bull: '🐂 Bull Market - Strong upward trend, favorable for long positions',
            bear: '🐻 Bear Market - Downward trend, consider defensive positions or shorts',
            sideways: '↔️ Sideways Market - Range-bound, good for mean reversion strategies',
            volatile: '⚡ High Volatility - Unpredictable movements, reduce position sizes',
            transitioning: '🔄 Transitioning - Market changing direction, wait for clarity',
            unknown: '❓ Unknown - Insufficient data for classification'
        };
        return descriptions[regime] || descriptions.unknown;
    }

    /**
     * Simple price prediction using linear regression
     * Returns predicted price for 1, 3, 5 days ahead
     */
    predictPrice(historicalData) {
        if (!historicalData || !historicalData.closes || historicalData.closes.length < 30) {
            return null;
        }

        const closes = historicalData.closes.slice(-30); // Use last 30 days
        const n = closes.length;

        // Simple linear regression
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
        closes.forEach((price, i) => {
            sumX += i;
            sumY += price;
            sumXY += i * price;
            sumXX += i * i;
        });

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        // Predict future prices
        const currentPrice = closes[n - 1];
        const predict1Day = slope * n + intercept;
        const predict3Day = slope * (n + 2) + intercept;
        const predict5Day = slope * (n + 4) + intercept;

        // Calculate R-squared (goodness of fit)
        const meanY = sumY / n;
        let ssRes = 0, ssTot = 0;
        closes.forEach((price, i) => {
            const predicted = slope * i + intercept;
            ssRes += Math.pow(price - predicted, 2);
            ssTot += Math.pow(price - meanY, 2);
        });
        const rSquared = 1 - (ssRes / ssTot);
        const confidence = Math.round(Math.max(0, Math.min(100, rSquared * 100)));

        return {
            current: currentPrice,
            predictions: {
                day1: { price: predict1Day, change: ((predict1Day - currentPrice) / currentPrice * 100) },
                day3: { price: predict3Day, change: ((predict3Day - currentPrice) / currentPrice * 100) },
                day5: { price: predict5Day, change: ((predict5Day - currentPrice) / currentPrice * 100) }
            },
            trend: slope > 0 ? 'upward' : 'downward',
            confidence,
            method: 'linear_regression',
            note: 'Simple linear regression - for demonstration only. Not financial advice.'
        };
    }

    /**
     * Calculate anomaly score (0-100)
     * Higher score = more unusual activity
     */
    detectAnomaly(stockData, historicalData) {
        if (!historicalData || !historicalData.volumes || historicalData.volumes.length < 20) {
            return { anomalyScore: 0, anomalies: [] };
        }

        const anomalies = [];
        let anomalyScore = 0;

        // Volume anomaly
        const avgVolume = historicalData.volumes.reduce((sum, v) => sum + v, 0) / historicalData.volumes.length;
        const volumeRatio = stockData.volume / avgVolume;
        if (volumeRatio > 3) {
            anomalyScore += 30;
            anomalies.push(`🌊 Extreme volume: ${volumeRatio.toFixed(1)}x average`);
        } else if (volumeRatio > 2) {
            anomalyScore += 20;
            anomalies.push(`📊 High volume: ${volumeRatio.toFixed(1)}x average`);
        }

        // Price movement anomaly
        const avgChange = historicalData.closes.slice(-20).reduce((sum, close, i, arr) => {
            if (i === 0) return sum;
            return sum + Math.abs(((close - arr[i-1]) / arr[i-1]) * 100);
        }, 0) / 19;

        const currentChange = Math.abs(stockData.change);
        if (currentChange > avgChange * 2) {
            anomalyScore += 25;
            anomalies.push(`⚡ Unusual price movement: ${currentChange.toFixed(2)}% (avg: ${avgChange.toFixed(2)}%)`);
        }

        // Gap anomaly
        const gapPercent = Math.abs(((stockData.open - stockData.previousClose) / stockData.previousClose) * 100);
        if (gapPercent > 3) {
            anomalyScore += 20;
            anomalies.push(`📈 Large gap: ${gapPercent.toFixed(2)}%`);
        }

        return {
            anomalyScore: Math.min(100, anomalyScore),
            anomalies,
            isAnomalous: anomalyScore > 40
        };
    }

    /**
     * Calculate comprehensive AI score with all data sources
     */
    async calculateAIScore(stockData, historicalData, news = []) {
        const scores = {
            technical: 0,
            sentiment: 0,
            social: 0,
            trends: 0,
            prediction: 0,
            regime: 0
        };

        // Technical analysis (30%)
        if (historicalData && historicalData.closes) {
            const rsi = window.enhancedAI.calculateRealRSI(historicalData.closes);
            if (rsi) {
                if (rsi < 30) scores.technical = 90;
                else if (rsi < 40) scores.technical = 75;
                else if (rsi > 70) scores.technical = 30;
                else if (rsi > 60) scores.technical = 60;
                else scores.technical = 50;
            }
        }

        // AI Sentiment from news (25%)
        if (news && news.length > 0) {
            const recentNews = news.slice(0, 10);
            let totalSentiment = 0;
            for (const article of recentNews) {
                const sentiment = await this.analyzeFinancialSentiment(
                    article.headline + ' ' + article.summary,
                    stockData.symbol
                );
                const weight = sentiment.confidence / 100;
                if (sentiment.sentiment === 'positive') {
                    totalSentiment += weight;
                } else if (sentiment.sentiment === 'negative') {
                    totalSentiment -= weight;
                }
            }
            scores.sentiment = Math.max(0, Math.min(100, 50 + (totalSentiment / recentNews.length) * 50));
        }

        // Social sentiment (15%)
        const social = await this.getSocialSentiment(stockData.symbol);
        if (social.mentions > 0) {
            if (social.sentiment === 'positive') scores.social = 70 + (social.buzz * 0.3);
            else if (social.sentiment === 'negative') scores.social = 30 - (social.buzz * 0.3);
            else scores.social = 50;
        } else {
            scores.social = 50; // Neutral if no mentions
        }

        // Search trends (10%)
        const trends = await this.getSearchTrends(stockData.symbol, stockData.name);
        scores.trends = trends.trendScore || 50;

        // Price prediction (15%)
        const prediction = this.predictPrice(historicalData);
        if (prediction && prediction.predictions.day3) {
            const predictedChange = prediction.predictions.day3.change;
            scores.prediction = 50 + (predictedChange * 5);
        }

        // Market regime (5%)
        const regime = this.detectMarketRegime(historicalData);
        if (regime.regime === 'bull') scores.regime = 80;
        else if (regime.regime === 'bear') scores.regime = 30;
        else if (regime.regime === 'volatile') scores.regime = 40;
        else scores.regime = 50;

        // Calculate weighted composite score
        const composite = (
            scores.technical * 0.30 +
            scores.sentiment * 0.25 +
            scores.social * 0.15 +
            scores.trends * 0.10 +
            scores.prediction * 0.15 +
            scores.regime * 0.05
        );

        return {
            composite: Math.round(composite),
            breakdown: scores,
            recommendation: this.getRecommendation(composite),
            confidence: this.calculateConfidence(scores, historicalData),
            socialData: social,
            trendsData: trends,
            prediction,
            regime
        };
    }

    getRecommendation(score) {
        if (score >= 85) return { action: 'STRONG BUY', emoji: '🔥' };
        if (score >= 75) return { action: 'BUY', emoji: '✅' };
        if (score >= 65) return { action: 'MODERATE BUY', emoji: '👍' };
        if (score >= 55) return { action: 'HOLD', emoji: '⏸️' };
        if (score >= 45) return { action: 'WEAK HOLD', emoji: '⚠️' };
        return { action: 'AVOID', emoji: '❌' };
    }

    calculateConfidence(scores, historicalData) {
        let confidence = 0;
        let factors = 0;

        // More data sources = higher confidence
        Object.values(scores).forEach(score => {
            if (score !== 0 && score !== 50) {
                confidence += Math.abs(score - 50);
                factors++;
            }
        });

        // Historical data quality
        if (historicalData && historicalData.closes && historicalData.closes.length >= 50) {
            confidence += 10;
            factors++;
        }

        return Math.min(95, Math.round(confidence / Math.max(1, factors)));
    }

    // Cache helpers
    getCached(cache, key, ttl) {
        const entry = cache.get(key);
        if (entry && (Date.now() - entry.timestamp) < ttl) {
            return entry.data;
        }
        return null;
    }

    setCache(cache, key, data) {
        cache.set(key, { data, timestamp: Date.now() });
    }

    clearCache() {
        this.sentimentCache.clear();
        this.trendsCache.clear();
        this.socialCache.clear();
    }
}

// Initialize and export
if (typeof window !== 'undefined') {
    window.aiService = new AIService();
}
