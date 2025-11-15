// API Caching Layer for FinClash
// Reduces API calls, improves performance, handles rate limits

/**
 * Smart API Cache System
 * Multi-tier caching with TTL, priority, and automatic refresh
 */
class APICache {
    constructor() {
        this.cache = new Map();
        this.config = {
            // Cache TTL (Time To Live) by data type
            ttl: {
                'quote': 60 * 1000, // 1 minute
                'candles': 5 * 60 * 1000, // 5 minutes
                'news': 15 * 60 * 1000, // 15 minutes
                'fundamentals': 24 * 60 * 60 * 1000, // 24 hours
                'company': 7 * 24 * 60 * 60 * 1000, // 7 days
                'search': 30 * 60 * 1000, // 30 minutes
                'social': 15 * 60 * 1000 // 15 minutes
            },
            maxSize: 500, // Max cache entries
            persistentTypes: ['fundamentals', 'company'] // Save to localStorage
        };

        // Load persistent cache from localStorage
        this.loadPersistentCache();

        // Cleanup old entries every 5 minutes
        setInterval(() => this.cleanup(), 5 * 60 * 1000);
    }

    /**
     * Get data from cache
     */
    get(key, type = 'quote') {
        const entry = this.cache.get(key);

        if (!entry) return null;

        // Check if expired
        const ttl = this.config.ttl[type] || this.config.ttl.quote;
        const isExpired = (Date.now() - entry.timestamp) > ttl;

        if (isExpired) {
            this.cache.delete(key);
            return null;
        }

        // Update access time for LRU
        entry.lastAccess = Date.now();
        entry.hits++;

        return entry.data;
    }

    /**
     * Set data in cache
     */
    set(key, data, type = 'quote') {
        // Enforce max size (LRU eviction)
        if (this.cache.size >= this.config.maxSize) {
            this.evictLRU();
        }

        const entry = {
            data,
            type,
            timestamp: Date.now(),
            lastAccess: Date.now(),
            hits: 0
        };

        this.cache.set(key, entry);

        // Persist if needed
        if (this.config.persistentTypes.includes(type)) {
            this.persistEntry(key, entry);
        }
    }

    /**
     * Check if key exists and is valid
     */
    has(key, type = 'quote') {
        return this.get(key, type) !== null;
    }

    /**
     * Invalidate specific cache entry
     */
    invalidate(key) {
        this.cache.delete(key);
        this.removePersistent(key);
    }

    /**
     * Invalidate all entries of a type
     */
    invalidateType(type) {
        for (const [key, entry] of this.cache.entries()) {
            if (entry.type === type) {
                this.cache.delete(key);
            }
        }
    }

    /**
     * Clear all cache
     */
    clear() {
        this.cache.clear();
        localStorage.removeItem('api_cache_persistent');
    }

    /**
     * LRU eviction (remove least recently used)
     */
    evictLRU() {
        let lruKey = null;
        let lruTime = Date.now();

        for (const [key, entry] of this.cache.entries()) {
            if (entry.lastAccess < lruTime) {
                lruTime = entry.lastAccess;
                lruKey = key;
            }
        }

        if (lruKey) {
            this.cache.delete(lruKey);
        }
    }

    /**
     * Cleanup expired entries
     */
    cleanup() {
        let cleaned = 0;

        for (const [key, entry] of this.cache.entries()) {
            const ttl = this.config.ttl[entry.type] || this.config.ttl.quote;
            const isExpired = (Date.now() - entry.timestamp) > ttl;

            if (isExpired) {
                this.cache.delete(key);
                cleaned++;
            }
        }

        if (cleaned > 0) {
            console.log(`Cache cleanup: removed ${cleaned} expired entries`);
        }
    }

    /**
     * Get cache statistics
     */
    getStats() {
        const stats = {
            totalEntries: this.cache.size,
            byType: {},
            hitRate: 0,
            oldestEntry: Date.now(),
            newestEntry: 0
        };

        let totalHits = 0;
        let totalAccesses = 0;

        for (const [key, entry] of this.cache.entries()) {
            // Count by type
            stats.byType[entry.type] = (stats.byType[entry.type] || 0) + 1;

            // Hit statistics
            totalHits += entry.hits;
            totalAccesses += entry.hits + 1; // +1 for initial set

            // Age statistics
            if (entry.timestamp < stats.oldestEntry) {
                stats.oldestEntry = entry.timestamp;
            }
            if (entry.timestamp > stats.newestEntry) {
                stats.newestEntry = entry.timestamp;
            }
        }

        stats.hitRate = totalAccesses > 0 ? (totalHits / totalAccesses * 100).toFixed(1) + '%' : '0%';
        stats.avgAge = Math.floor((Date.now() - stats.oldestEntry) / 1000 / 60); // minutes

        return stats;
    }

    /**
     * Persistent cache (localStorage)
     */
    persistEntry(key, entry) {
        try {
            const persistent = this.loadPersistentData();
            persistent[key] = entry;
            localStorage.setItem('api_cache_persistent', JSON.stringify(persistent));
        } catch (e) {
            console.warn('Failed to persist cache entry:', e);
        }
    }

    loadPersistentCache() {
        try {
            const persistent = this.loadPersistentData();
            for (const [key, entry] of Object.entries(persistent)) {
                this.cache.set(key, entry);
            }
        } catch (e) {
            console.warn('Failed to load persistent cache:', e);
        }
    }

    loadPersistentData() {
        const saved = localStorage.getItem('api_cache_persistent');
        return saved ? JSON.parse(saved) : {};
    }

    removePersistent(key) {
        try {
            const persistent = this.loadPersistentData();
            delete persistent[key];
            localStorage.setItem('api_cache_persistent', JSON.stringify(persistent));
        } catch (e) {
            console.warn('Failed to remove persistent entry:', e);
        }
    }
}

/**
 * Rate Limiter
 * Prevents exceeding API rate limits
 */
class RateLimiter {
    constructor(maxRequests, timeWindow) {
        this.maxRequests = maxRequests; // e.g., 60
        this.timeWindow = timeWindow; // e.g., 60000 (1 minute)
        this.requests = [];
    }

    /**
     * Check if request is allowed
     */
    canMakeRequest() {
        this.cleanOldRequests();
        return this.requests.length < this.maxRequests;
    }

    /**
     * Record a request
     */
    recordRequest() {
        this.requests.push(Date.now());
    }

    /**
     * Wait until request is allowed
     */
    async waitForSlot() {
        while (!this.canMakeRequest()) {
            const oldestRequest = this.requests[0];
            const waitTime = (oldestRequest + this.timeWindow) - Date.now();
            await new Promise(resolve => setTimeout(resolve, Math.max(100, waitTime)));
            this.cleanOldRequests();
        }
    }

    /**
     * Remove old requests outside time window
     */
    cleanOldRequests() {
        const cutoff = Date.now() - this.timeWindow;
        this.requests = this.requests.filter(time => time > cutoff);
    }

    /**
     * Get remaining requests
     */
    getRemainingRequests() {
        this.cleanOldRequests();
        return this.maxRequests - this.requests.length;
    }

    /**
     * Get time until next slot
     */
    getTimeUntilNextSlot() {
        if (this.canMakeRequest()) return 0;

        const oldestRequest = this.requests[0];
        return (oldestRequest + this.timeWindow) - Date.now();
    }
}

/**
 * Cached API Client
 * Wrapper around Finnhub/Alpha Vantage with automatic caching
 */
class CachedAPIClient {
    constructor(apiKey, provider = 'finnhub') {
        this.apiKey = apiKey;
        this.provider = provider;
        this.cache = new APICache();

        // Rate limiters by provider
        this.rateLimiters = {
            finnhub: new RateLimiter(60, 60000), // 60 calls per minute
            alphavantage: new RateLimiter(5, 60000) // 5 calls per minute (free tier)
        };
    }

    /**
     * Fetch quote with caching
     */
    async getQuote(symbol) {
        const cacheKey = `quote_${symbol}`;

        // Try cache first
        const cached = this.cache.get(cacheKey, 'quote');
        if (cached) return cached;

        // Wait for rate limit if needed
        await this.rateLimiters[this.provider].waitForSlot();

        // Fetch from API
        const data = await this.fetchFromAPI(`/quote?symbol=${symbol}`);

        // Cache result
        this.cache.set(cacheKey, data, 'quote');
        this.rateLimiters[this.provider].recordRequest();

        return data;
    }

    /**
     * Fetch candles with caching
     */
    async getCandles(symbol, resolution, from, to) {
        const cacheKey = `candles_${symbol}_${resolution}_${from}_${to}`;

        const cached = this.cache.get(cacheKey, 'candles');
        if (cached) return cached;

        await this.rateLimiters[this.provider].waitForSlot();

        const data = await this.fetchFromAPI(`/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}`);

        this.cache.set(cacheKey, data, 'candles');
        this.rateLimiters[this.provider].recordRequest();

        return data;
    }

    /**
     * Fetch news with caching
     */
    async getNews(symbol) {
        const cacheKey = `news_${symbol}`;

        const cached = this.cache.get(cacheKey, 'news');
        if (cached) return cached;

        await this.rateLimiters[this.provider].waitForSlot();

        const data = await this.fetchFromAPI(`/company-news?symbol=${symbol}`);

        this.cache.set(cacheKey, data, 'news');
        this.rateLimiters[this.provider].recordRequest();

        return data;
    }

    /**
     * Fetch company profile with caching
     */
    async getCompanyProfile(symbol) {
        const cacheKey = `company_${symbol}`;

        const cached = this.cache.get(cacheKey, 'company');
        if (cached) return cached;

        await this.rateLimiters[this.provider].waitForSlot();

        const data = await this.fetchFromAPI(`/stock/profile2?symbol=${symbol}`);

        this.cache.set(cacheKey, data, 'company');
        this.rateLimiters[this.provider].recordRequest();

        return data;
    }

    /**
     * Fetch from API (implement based on provider)
     */
    async fetchFromAPI(endpoint) {
        const baseURLs = {
            finnhub: 'https://finnhub.io/api/v1',
            alphavantage: 'https://www.alphavantage.co/query'
        };

        const url = `${baseURLs[this.provider]}${endpoint}&token=${this.apiKey}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        return response.json();
    }

    /**
     * Get rate limiter stats
     */
    getRateLimitStats() {
        const limiter = this.rateLimiters[this.provider];
        return {
            remaining: limiter.getRemainingRequests(),
            total: limiter.maxRequests,
            timeUntilReset: limiter.getTimeUntilNextSlot(),
            provider: this.provider
        };
    }

    /**
     * Get cache stats
     */
    getCacheStats() {
        return this.cache.getStats();
    }
}

// Export for use in main app
if (typeof window !== 'undefined') {
    window.APICache = APICache;
    window.RateLimiter = RateLimiter;
    window.CachedAPIClient = CachedAPIClient;
}
