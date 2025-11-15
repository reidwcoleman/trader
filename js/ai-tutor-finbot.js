// FinBot - AI Trading Tutor for FinClash Learning Tab
// Intelligent chatbot that explains trading concepts, answers questions, and provides guidance

/**
 * FinBot Knowledge Base - Pre-defined responses for common questions
 * In production, this would integrate with OpenAI API or similar
 */

const FINBOT_KNOWLEDGE = {
    // Stock Basics
    "what is a stock": {
        answer: `A stock is like owning a tiny piece of a company! 🏢\n\nWhen you buy 1 share of Apple, you literally own a small part of Apple Inc. If Apple does well, your shares become more valuable. If Apple struggles, your shares lose value.\n\n**Think of it this way:**\nImagine a pizza cut into 1,000 slices. If you buy 10 slices, you own 1% of the pizza. That's how stocks work - you're buying slices of a company!`,
        relatedTopics: ["How to buy stocks", "Stock symbols", "Market cap"],
        difficulty: "beginner"
    },

    "how to buy stocks": {
        answer: `Buying stocks is easier than you think! Here's the process:\n\n**Step 1:** Open a brokerage account\n- Robinhood, Fidelity, E*TRADE, etc.\n- Free to open, takes 5-10 minutes\n- Need ID and bank account\n\n**Step 2:** Add money\n- Link your bank account\n- Transfer funds (instant with some brokers)\n\n**Step 3:** Search & Buy\n- Search for stock symbol (AAPL = Apple)\n- Enter how many shares\n- Click "Buy" - done!\n\n💡 **Pro Tip:** Start with "paper trading" (fake money) to practice first!`,
        relatedTopics: ["Market orders vs limit orders", "When markets are open", "Brokerage accounts"],
        difficulty: "beginner"
    },

    "what is rsi": {
        answer: `RSI (Relative Strength Index) is like a thermometer for stocks! 🌡️\n\n**What it measures:**\n- Scale from 0 to 100\n- Shows if a stock is "overbought" or "oversold"\n\n**The Rules:**\n- RSI > 70 = OVERBOUGHT ⚠️\n  → Stock might drop soon (too many buyers)\n- RSI < 30 = OVERSOLD 💎\n  → Stock might bounce soon (too many sellers)\n- RSI 40-60 = NEUTRAL 📊\n  → Balanced, no extreme\n\n**Example:**\nApple at RSI 85 = Probably expensive, wait for pullback\nApple at RSI 25 = Probably cheap, good buy opportunity\n\n💡 Remember: RSI is ONE tool, not the whole answer!`,
        relatedTopics: ["MACD indicator", "Bollinger Bands", "Technical analysis"],
        difficulty: "intermediate"
    },

    "what is a stop loss": {
        answer: `A stop-loss is your SAFETY NET! 🛑\n\n**What it does:**\nAutomatically sells your stock if price drops to a certain level.\n\n**Example:**\n- You buy a stock at $100\n- Set stop-loss at $95\n- Stock crashes to $80 overnight\n- Your stop-loss triggers at $95\n- You lose $5 instead of $20!\n\n**How to set it:**\n1. Decide max loss you're ok with (usually 3-5%)\n2. Calculate: $100 - 5% = $95\n3. Enter $95 as your stop-loss price\n4. Set it BEFORE buying, not after!\n\n**Golden Rule:**\nNEVER enter a trade without knowing your stop-loss first. It's like driving without a seatbelt - dangerous!`,
        relatedTopics: ["Position sizing", "Risk management", "Take profit orders"],
        difficulty: "beginner"
    },

    "how much to invest": {
        answer: `Great question! Here's the smart way to think about it: 💰\n\n**For Total Portfolio:**\n- Only invest money you won't need for 5+ years\n- Never invest rent money, emergency fund, or short-term savings\n- Start small: $100, $500, $1000 - whatever you can afford to lose\n\n**For Each Trade:**\n- **The 2% Rule**: Never risk more than 2% per trade\n- Have $10,000? Max risk per trade = $200\n- Have $1,000? Max risk per trade = $20\n\n**Why 2%?**\nYou can lose 50 trades in a row and still have half your money! This keeps you in the game.\n\n**Example Calculation:**\n- Account: $5,000\n- Risk 2% = $100 max loss\n- Entry: $50, Stop: $48 → Risk $2/share\n- Shares to buy: $100 ÷ $2 = 50 shares\n\n🎯 Position size = $ Risk ÷ Distance to stop-loss`,
        relatedTopics: ["Risk management", "Stop-loss", "Portfolio allocation"],
        difficulty: "intermediate"
    },

    "fibonacci retracement": {
        answer: `Fibonacci levels are like a treasure map for support/resistance! 📐\n\n**What they are:**\nMagic numbers (23.6%, 38.2%, 50%, 61.8%, 78.6%) where stocks often bounce.\n\n**How to use them:**\n1. Find a big move (example: $100 → $150)\n2. Draw Fib lines between low and high\n3. If price pulls back, watch for bounces at:\n   - 23.6% = $138.20\n   - 38.2% = $130.90\n   - 50% = $125.00 ⭐ (most common)\n   - 61.8% = $119.10 (golden ratio)\n\n**Real Example:**\nTesla runs from $200 to $300. Pulls back to $250 (50% Fib). Bounces back up - that's the magic!\n\n**Why it works:**\nMillions of traders watch Fib levels → Self-fulfilling prophecy.\n\n💡 The 50% and 61.8% levels are the most reliable!`,
        relatedTopics: ["Support and resistance", "Technical analysis", "Chart patterns"],
        difficulty: "advanced"
    },

    "day trading vs swing trading": {
        answer: `Let me break down the difference! ⚡\n\n**Day Trading:**\n- ⏰ Hold: Minutes to hours (close by end of day)\n- 💰 Capital: Need $25k+ (PDT rule)\n- 📊 Charts: 1-min, 5-min, 15-min\n- ⚡ Stress: HIGH (constant watching)\n- 🎯 Goal: Small profits, many trades\n- ⏳ Time: Full-time job (9:30 AM - 4 PM)\n\n**Swing Trading:**\n- ⏰ Hold: Days to weeks\n- 💰 Capital: Any amount (no PDT rule)\n- 📊 Charts: 1-hour, daily, weekly\n- ⚡ Stress: MEDIUM (check 1-2x per day)\n- 🎯 Goal: Larger moves, fewer trades\n- ⏳ Time: Part-time friendly\n\n**Which is better?**\n- Beginners → Swing trading (less stressful)\n- Full-time → Day trading (if you have capital)\n- Part-time job → Swing trading\n\n🎓 Master swing trading first, then try day trading if you want.`,
        relatedTopics: ["Position trading", "Scalping", "Trading styles"],
        difficulty: "intermediate"
    },

    "options trading": {
        answer: `Options are like insurance contracts for stocks! 🎯\n\n**Two Types:**\n\n**1. Call Option (Right to BUY)**\n- You think stock goes UP\n- Pay $5 premium for right to buy at $100\n- Stock hits $120 → Exercise & profit $15/share!\n- Stock stays at $95 → Let it expire, lose $5\n\n**2. Put Option (Right to SELL)**\n- You think stock goes DOWN\n- Pay $5 premium for right to sell at $100\n- Stock drops to $80 → Exercise & profit $15/share!\n- Stock goes to $110 → Let it expire, lose $5\n\n**Key Concepts:**\n- Premium = What you pay for the option\n- Strike = The price you can buy/sell at\n- Expiration = When option expires (worthless if not used)\n\n**Risk:**\n- Max loss = Premium you paid\n- Can make 100%+ returns... or lose 100% fast\n\n⚠️ **Warning:** Options are ADVANCED. Master stocks first!`,
        relatedTopics: ["Call options", "Put options", "Options Greeks"],
        difficulty: "advanced"
    }
};

/**
 * Common Trading Terms Dictionary
 */
const TRADING_GLOSSARY = {
    "bull": "Someone who thinks the market will go UP 📈. Bullish = optimistic",
    "bear": "Someone who thinks the market will go DOWN 📉. Bearish = pessimistic",
    "dividend": "Cash payment companies give to shareholders (usually quarterly)",
    "market cap": "Total value of company = Share price × Total shares outstanding",
    "p/e ratio": "Price to Earnings ratio. Shows how expensive a stock is vs its profits",
    "ipo": "Initial Public Offering - when a private company first sells stock to public",
    "volume": "Number of shares traded. High volume = strong conviction in price move",
    "short selling": "Betting a stock will go DOWN by borrowing & selling shares",
    "margin": "Borrowing money from broker to buy more stock (risky!)",
    "volatility": "How much price swings up and down. High volatility = wild moves",
    "blue chip": "Large, stable, well-established companies (Apple, Microsoft, etc.)",
    "penny stock": "Stocks under $5/share. Usually very risky and volatile",
    "etf": "Exchange Traded Fund - basket of stocks in one trade (like SPY = S&P 500)",
    "bid": "Highest price buyers willing to pay right now",
    "ask": "Lowest price sellers willing to accept right now",
    "spread": "Difference between bid and ask. Narrow spread = liquid stock"
};

/**
 * FinBot Class - Main chatbot logic
 */
class FinBot {
    constructor() {
        this.conversationHistory = [];
        this.userName = "Trader";
    }

    /**
     * Main query method - processes user questions
     */
    async ask(userQuestion) {
        const question = userQuestion.toLowerCase().trim();

        // Store user message
        this.addToHistory('user', userQuestion);

        // Check for greeting
        if (this.isGreeting(question)) {
            const response = this.getGreeting();
            this.addToHistory('bot', response);
            return this.formatResponse(response);
        }

        // Check for simple term lookup
        const termDefinition = this.lookupTerm(question);
        if (termDefinition) {
            this.addToHistory('bot', termDefinition);
            return this.formatResponse(termDefinition, null, 'definition');
        }

        // Check knowledge base for detailed answer
        const knowledgeAnswer = this.searchKnowledge(question);
        if (knowledgeAnswer) {
            this.addToHistory('bot', knowledgeAnswer.answer);
            return this.formatResponse(
                knowledgeAnswer.answer,
                knowledgeAnswer.relatedTopics,
                'detailed'
            );
        }

        // Fallback to helpful suggestions
        const fallbackResponse = this.getFallbackResponse(question);
        this.addToHistory('bot', fallbackResponse);
        return this.formatResponse(fallbackResponse, this.getSuggestedTopics(), 'fallback');
    }

    /**
     * Check if message is a greeting
     */
    isGreeting(text) {
        const greetings = ['hi', 'hello', 'hey', 'sup', 'yo', 'howdy', 'greetings'];
        return greetings.some(g => text.includes(g));
    }

    /**
     * Generate personalized greeting
     */
    getGreeting() {
        const greetings = [
            `Hey there! 👋 I'm FinBot, your AI trading tutor. Ask me anything about stocks, trading, or investing!`,
            `Hello! 🤖 Ready to learn about trading? I'm here to explain any concept, no matter how complex!`,
            `Hi! I'm FinBot 💡 Your personal trading assistant. What would you like to learn today?`
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }

    /**
     * Look up term in glossary
     */
    lookupTerm(question) {
        for (const [term, definition] of Object.entries(TRADING_GLOSSARY)) {
            if (question.includes(term)) {
                return `**${term.toUpperCase()}**:\n${definition}`;
            }
        }
        return null;
    }

    /**
     * Search knowledge base
     */
    searchKnowledge(question) {
        for (const [key, value] of Object.entries(FINBOT_KNOWLEDGE)) {
            if (question.includes(key) || this.similarityMatch(question, key)) {
                return value;
            }
        }
        return null;
    }

    /**
     * Simple similarity matching
     */
    similarityMatch(q1, q2) {
        const words1 = q1.split(' ');
        const words2 = q2.split(' ');
        const commonWords = words1.filter(w => words2.includes(w));
        return commonWords.length >= Math.min(words1.length, words2.length) * 0.6;
    }

    /**
     * Fallback response when no match found
     */
    getFallbackResponse(question) {
        return `Hmm, I'm not sure about that specific question yet! 🤔\n\nBut I'm learning every day! Here are some topics I can definitely help with:\n\n• Stock basics & how to buy\n• Technical indicators (RSI, MACD, Fibonacci)\n• Risk management & stop-losses\n• Trading styles (day trading vs swing trading)\n• Chart patterns & candlesticks\n• Options trading fundamentals\n\nTry rephrasing your question, or pick a topic from above!`;
    }

    /**
     * Get suggested topics
     */
    getSuggestedTopics() {
        return [
            "What is a stock?",
            "How do I buy stocks?",
            "What is RSI?",
            "Explain stop-loss",
            "Fibonacci retracement",
            "Day trading vs swing trading"
        ];
    }

    /**
     * Add message to conversation history
     */
    addToHistory(role, message) {
        this.conversationHistory.push({
            role,
            message,
            timestamp: Date.now()
        });

        // Keep last 50 messages
        if (this.conversationHistory.length > 50) {
            this.conversationHistory = this.conversationHistory.slice(-50);
        }

        // Save to localStorage
        this.saveHistory();
    }

    /**
     * Save conversation to localStorage
     */
    saveHistory() {
        localStorage.setItem('finbot_history', JSON.stringify(this.conversationHistory));
    }

    /**
     * Load conversation from localStorage
     */
    loadHistory() {
        const saved = localStorage.getItem('finbot_history');
        if (saved) {
            this.conversationHistory = JSON.parse(saved);
        }
    }

    /**
     * Clear conversation history
     */
    clearHistory() {
        this.conversationHistory = [];
        localStorage.removeItem('finbot_history');
    }

    /**
     * Format response for UI display
     */
    formatResponse(answer, relatedTopics = null, type = 'detailed') {
        return {
            text: answer,
            relatedTopics: relatedTopics || [],
            type,
            timestamp: Date.now()
        };
    }

    /**
     * Get conversation history
     */
    getHistory() {
        return this.conversationHistory;
    }
}

/**
 * Quick Answer Mode - For rapid-fire questions
 */
function getQuickAnswer(term) {
    const quickAnswers = {
        "bull market": "📈 Market going UP. Prices rising. Investors optimistic.",
        "bear market": "📉 Market going DOWN. Prices falling. Investors pessimistic.",
        "buy the dip": "💎 Buying stocks when price drops. 'Buy low, sell high' strategy.",
        "hodl": "🤚 Hold On for Dear Life. Don't sell despite volatility. (Crypto slang)",
        "fomo": "😰 Fear Of Missing Out. Emotional trading due to price surges.",
        "diamond hands": "💎🤲 Holding through volatility. Opposite of paper hands.",
        "paper hands": "📄🤲 Selling at first sign of loss. Weak conviction.",
        "bag holder": "💼 Someone stuck holding a losing stock long-term.",
        "pump and dump": "⚠️ Artificially inflate price, then sell. ILLEGAL for stocks.",
        "dead cat bounce": "🐱 Temporary recovery in downtrend. Then continues falling."
    };

    return quickAnswers[term.toLowerCase()] || null;
}

// Initialize and export
if (typeof window !== 'undefined') {
    window.FinBot = FinBot;
    window.getQuickAnswer = getQuickAnswer;
    window.TRADING_GLOSSARY = TRADING_GLOSSARY;
}
