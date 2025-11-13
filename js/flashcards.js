// Flashcard System with Spaced Repetition for FinClash Learning
// Helps users memorize key trading concepts efficiently

/**
 * Flashcard Database - Trading Terms and Concepts
 */
const FLASHCARDS = [
    // Basics
    { id: 'stock', category: 'basics', front: 'What is a Stock?', back: 'A share representing partial ownership in a company. When you buy stock, you become a shareholder.', difficulty: 1 },
    { id: 'bid', category: 'basics', front: 'What is the Bid Price?', back: 'The highest price a buyer is willing to pay for a stock at a given moment.', difficulty: 1 },
    { id: 'ask', category: 'basics', front: 'What is the Ask Price?', back: 'The lowest price a seller is willing to accept for a stock at a given moment.', difficulty: 1 },
    { id: 'spread', category: 'basics', front: 'What is the Bid-Ask Spread?', back: 'The difference between the bid and ask price. Smaller spreads indicate higher liquidity.', difficulty: 1 },
    { id: 'volume', category: 'basics', front: 'What is Trading Volume?', back: 'The total number of shares traded during a specific period. High volume confirms price movements.', difficulty: 1 },
    { id: 'marketcap', category: 'basics', front: 'What is Market Cap?', back: 'Total value of a company = Share Price × Outstanding Shares. Used to measure company size.', difficulty: 1 },

    // Technical Analysis
    { id: 'support', category: 'technical', front: 'What is a Support Level?', back: 'A price level where buying pressure prevents further decline. Price tends to "bounce" from support.', difficulty: 2 },
    { id: 'resistance', category: 'technical', front: 'What is a Resistance Level?', back: 'A price level where selling pressure prevents further rise. Price gets "rejected" at resistance.', difficulty: 2 },
    { id: 'candlestick', category: 'technical', front: 'What does a Green Candlestick mean?', back: 'Price closed higher than it opened (bullish). Body shows open-to-close range, wicks show high-low.', difficulty: 1 },
    { id: 'rsi', category: 'technical', front: 'What is RSI?', back: 'Relative Strength Index (0-100). RSI >70 = overbought, RSI <30 = oversold. Measures momentum.', difficulty: 2 },
    { id: 'macd', category: 'technical', front: 'What is MACD?', back: 'Moving Average Convergence Divergence. Shows momentum by comparing two EMAs. Bullish when MACD crosses above signal line.', difficulty: 3 },
    { id: 'sma', category: 'technical', front: 'What is a Simple Moving Average (SMA)?', back: 'Average price over N periods. Smooths out price data to identify trends. Common: 50-day, 200-day SMA.', difficulty: 2 },
    { id: 'ema', category: 'technical', front: 'What is an Exponential Moving Average (EMA)?', back: 'Like SMA but gives more weight to recent prices. Reacts faster to price changes than SMA.', difficulty: 2 },
    { id: 'bollinger', category: 'technical', front: 'What are Bollinger Bands?', back: '3 lines: SMA (middle), Upper band (+2 std dev), Lower band (-2 std dev). Price at upper = overbought, at lower = oversold.', difficulty: 3 },

    // Chart Patterns
    { id: 'bullflag', category: 'patterns', front: 'What is a Bull Flag pattern?', back: 'Sharp rise (flagpole) + consolidation (flag) + breakout up. Continuation pattern signaling more upside.', difficulty: 2 },
    { id: 'headshoulders', category: 'patterns', front: 'What is Head and Shoulders?', back: 'Reversal pattern: Left shoulder → Head (higher peak) → Right shoulder. Breaks neckline = bearish.', difficulty: 2 },
    { id: 'doublebottom', category: 'patterns', front: 'What is a Double Bottom?', back: 'Two troughs at similar level forming a "W". Bullish reversal pattern. Breakout above resistance = buy signal.', difficulty: 2 },
    { id: 'triangle', category: 'patterns', front: 'What is an Ascending Triangle?', back: 'Flat resistance + rising support. Bullish pattern. Breakout above resistance confirms uptrend.', difficulty: 2 },

    // Risk Management
    { id: 'stoploss', category: 'risk', front: 'What is a Stop-Loss?', back: 'Order that automatically sells when price hits specified level. Limits losses by exiting losing positions.', difficulty: 1 },
    { id: 'position sizing', category: 'risk', front: 'What is Position Sizing?', back: 'Determining how many shares to buy based on account size and risk tolerance. Common rule: risk max 1-2% per trade.', difficulty: 2 },
    { id: 'riskreward', category: 'risk', front: 'What is Risk/Reward Ratio?', back: 'Potential profit ÷ potential loss. Example: Risk $100 to make $300 = 3:1 ratio. Target 2:1 or better.', difficulty: 2 },
    { id: 'diversification', category: 'risk', front: 'What is Diversification?', back: 'Spreading investments across different stocks/sectors to reduce risk. Don\'t put all eggs in one basket.', difficulty: 1 },

    // Order Types
    { id: 'marketorder', category: 'orders', front: 'What is a Market Order?', back: 'Executes immediately at best available price. Guarantees execution but not price.', difficulty: 1 },
    { id: 'limitorder', category: 'orders', front: 'What is a Limit Order?', back: 'Executes only at specified price or better. Guarantees price but not execution.', difficulty: 1 },
    { id: 'trailingstop', category: 'orders', front: 'What is a Trailing Stop?', back: 'Stop-loss that moves with price in favorable direction. Locks in profits while letting winners run.', difficulty: 2 },

    // Options (Advanced)
    { id: 'calloption', category: 'options', front: 'What is a Call Option?', back: 'Right (not obligation) to BUY stock at strike price. Profit if stock rises. Max loss = premium paid.', difficulty: 3 },
    { id: 'putoption', category: 'options', front: 'What is a Put Option?', back: 'Right (not obligation) to SELL stock at strike price. Profit if stock falls. Max loss = premium paid.', difficulty: 3 },
    { id: 'delta', category: 'options', front: 'What is Delta (Options)?', back: 'How much option price changes per $1 stock move. Call delta: 0-1, Put delta: -1 to 0.', difficulty: 3 },
    { id: 'theta', category: 'options', front: 'What is Theta (Options)?', back: 'Time decay - how much option loses value per day. Always negative for buyers. Accelerates near expiration.', difficulty: 3 },

    // Shorting
    { id: 'shortselling', category: 'shorting', front: 'What is Short Selling?', back: 'Borrow shares, sell immediately, buy back later (hopefully cheaper), return shares. Profit from price decline.', difficulty: 2 },
    { id: 'shortsqueeze', category: 'shorting', front: 'What is a Short Squeeze?', back: 'When heavily shorted stock rises, shorts forced to buy back, driving price higher. Can cause massive losses.', difficulty: 2 },

    // Margin
    { id: 'margin', category: 'margin', front: 'What is Margin Trading?', back: 'Borrowing money from broker to buy more stock. Amplifies gains AND losses. Charged interest on loan.', difficulty: 2 },
    { id: 'margincall', category: 'margin', front: 'What is a Margin Call?', back: 'When equity falls below maintenance requirement (25%). Must deposit cash or broker force-sells your positions.', difficulty: 2 },

    // Psychology
    { id: 'fomo', category: 'psychology', front: 'What is FOMO in Trading?', back: 'Fear Of Missing Out - emotional impulse to chase rapidly rising stocks. Often leads to buying tops and losses.', difficulty: 1 },
    { id: 'revenge', category: 'psychology', front: 'What is Revenge Trading?', back: 'Making impulsive trades to recover losses. Usually driven by emotion, not logic. Often worsens losses.', difficulty: 2 },
    { id: 'confirmation', category: 'psychology', front: 'What is Confirmation Bias?', back: 'Seeking only information that confirms your existing belief. Ignoring contrary evidence. Very dangerous in trading.', difficulty: 2 }
];

/**
 * Spaced Repetition Algorithm (Leitner System)
 * Cards move between boxes based on correctness
 * Box 1: Review daily
 * Box 2: Review every 3 days
 * Box 3: Review weekly
 * Box 4: Review monthly
 * Box 5: Mastered
 */
class FlashcardManager {
    constructor(userProgress) {
        this.userProgress = userProgress;
        this.cards = FLASHCARDS.map(card => ({
            ...card,
            box: 1, // Start in box 1
            lastReviewed: null,
            timesReviewed: 0,
            timesCorrect: 0,
            timesIncorrect: 0,
            easeFactor: 2.5 // SM-2 algorithm ease factor
        }));

        // Load saved progress if exists
        if (userProgress.flashcardProgress) {
            this.loadProgress(userProgress.flashcardProgress);
        }
    }

    loadProgress(savedProgress) {
        savedProgress.forEach(saved => {
            const card = this.cards.find(c => c.id === saved.id);
            if (card) {
                Object.assign(card, saved);
            }
        });
    }

    saveProgress() {
        this.userProgress.flashcardProgress = this.cards.map(card => ({
            id: card.id,
            box: card.box,
            lastReviewed: card.lastReviewed,
            timesReviewed: card.timesReviewed,
            timesCorrect: card.timesCorrect,
            timesIncorrect: card.timesIncorrect,
            easeFactor: card.easeFactor
        }));
    }

    getDueCards() {
        const now = Date.now();
        const oneDayMs = 24 * 60 * 60 * 1000;

        return this.cards.filter(card => {
            if (!card.lastReviewed) return true; // Never reviewed

            const daysSinceReview = (now - card.lastReviewed) / oneDayMs;

            switch (card.box) {
                case 1: return daysSinceReview >= 1; // Daily
                case 2: return daysSinceReview >= 3; // Every 3 days
                case 3: return daysSinceReview >= 7; // Weekly
                case 4: return daysSinceReview >= 30; // Monthly
                case 5: return false; // Mastered - no review needed
                default: return true;
            }
        });
    }

    getCardsByCategory(category) {
        return this.cards.filter(card => card.category === category);
    }

    reviewCard(cardId, correct) {
        const card = this.cards.find(c => c.id === cardId);
        if (!card) return;

        card.timesReviewed++;
        card.lastReviewed = Date.now();

        if (correct) {
            card.timesCorrect++;
            // Move up a box (max box 5)
            card.box = Math.min(5, card.box + 1);
            // Increase ease factor (SM-2 algorithm)
            card.easeFactor = Math.max(1.3, card.easeFactor + 0.1);
        } else {
            card.timesIncorrect++;
            // Move back to box 1
            card.box = 1;
            // Decrease ease factor
            card.easeFactor = Math.max(1.3, card.easeFactor - 0.2);
        }

        this.saveProgress();

        return {
            card,
            newBox: card.box,
            masteryLevel: this.getMasteryLevel(card)
        };
    }

    getMasteryLevel(card) {
        if (card.timesReviewed === 0) return 'new';
        const accuracy = card.timesCorrect / card.timesReviewed;

        if (card.box === 5 && accuracy >= 0.9) return 'mastered';
        if (card.box >= 4 || accuracy >= 0.8) return 'proficient';
        if (card.box >= 3 || accuracy >= 0.7) return 'learning';
        return 'struggling';
    }

    getStats() {
        const total = this.cards.length;
        const mastered = this.cards.filter(c => c.box === 5).length;
        const proficient = this.cards.filter(c => c.box === 4).length;
        const learning = this.cards.filter(c => c.box >= 2 && c.box <= 3).length;
        const new_cards = this.cards.filter(c => c.timesReviewed === 0).length;
        const struggling = this.cards.filter(c => c.box === 1 && c.timesReviewed > 0).length;

        const totalReviews = this.cards.reduce((sum, c) => sum + c.timesReviewed, 0);
        const totalCorrect = this.cards.reduce((sum, c) => sum + c.timesCorrect, 0);
        const accuracy = totalReviews > 0 ? (totalCorrect / totalReviews) * 100 : 0;

        return {
            total,
            mastered,
            proficient,
            learning,
            new: new_cards,
            struggling,
            dueToday: this.getDueCards().length,
            totalReviews,
            accuracy: accuracy.toFixed(1)
        };
    }

    getRandomCard(category = null) {
        const dueCards = this.getDueCards();
        const pool = category
            ? dueCards.filter(c => c.category === category)
            : dueCards;

        if (pool.length === 0) return null;

        // Prioritize cards in lower boxes (need more review)
        const weights = pool.map(c => 6 - c.box); // Box 1 = weight 5, Box 5 = weight 1
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;

        for (let i = 0; i < pool.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return pool[i];
            }
        }

        return pool[0]; // Fallback
    }

    resetCard(cardId) {
        const card = this.cards.find(c => c.id === cardId);
        if (!card) return;

        card.box = 1;
        card.lastReviewed = null;
        card.timesReviewed = 0;
        card.timesCorrect = 0;
        card.timesIncorrect = 0;
        card.easeFactor = 2.5;

        this.saveProgress();
    }
}

// Export
if (typeof window !== 'undefined') {
    window.FlashcardSystem = {
        FLASHCARDS,
        FlashcardManager
    };
}
