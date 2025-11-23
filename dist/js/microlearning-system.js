// Microlearning System for FinClash - Bite-Sized Trading Lessons
// Instagram Stories-style vertical cards for mobile-first learning

/**
 * Microlessons - 2-3 minute focused learning units
 * Each covers ONE concept with visual + quiz
 */

const MICROLESSONS = {
    // BEGINNER SERIES
    beginner: {
        title: "Trading 101",
        color: "green",
        gradient: "from-green-500 to-emerald-500",
        lessons: [
            {
                id: "micro_stocks_basics",
                title: "What is a Stock?",
                emoji: "📈",
                duration: "2 min",
                content: {
                    headline: "Stocks = Owning a Piece of a Company",
                    visual: "illustration", // Can be 'chart', 'diagram', 'animation', 'video'
                    keyPoints: [
                        "When you buy 1 share of Apple, you own a tiny piece of Apple",
                        "Companies sell stocks to raise money for growth",
                        "Stock prices go up when more people want to buy than sell"
                    ],
                    example: {
                        title: "Real Example",
                        text: "If Apple has 1 billion shares and you own 100 shares, you own 0.00001% of Apple. Not much, but you're still a shareholder!",
                        highlight: "Own shares = own part of business"
                    },
                    actionTip: "Start by learning about companies you already use: Apple, Nike, McDonald's"
                },
                quiz: {
                    question: "If a company has 1,000 shares and you buy 100, what % do you own?",
                    options: ["1%", "10%", "50%", "100%"],
                    correct: 1,
                    explanation: "100 shares ÷ 1,000 total shares = 10% ownership"
                },
                xp: 10
            },
            {
                id: "micro_buying_stocks",
                title: "How to Buy a Stock",
                emoji: "🛒",
                duration: "2 min",
                content: {
                    headline: "Buying Stocks is Like Online Shopping",
                    visual: "diagram",
                    keyPoints: [
                        "Step 1: Open a brokerage account (like Robinhood, Fidelity)",
                        "Step 2: Add money to your account",
                        "Step 3: Search for the stock symbol (AAPL = Apple)",
                        "Step 4: Choose how many shares to buy",
                        "Step 5: Click 'Buy' - done!"
                    ],
                    example: {
                        title: "Quick Math",
                        text: "Want to buy $500 of Tesla? If Tesla is $250/share, you buy 2 shares. That simple!",
                        highlight: "$ Amount ÷ Price per Share = Number of Shares"
                    },
                    actionTip: "Try paper trading first - practice with fake money before using real money"
                },
                quiz: {
                    question: "If a stock is $50/share and you have $200, how many shares can you buy?",
                    options: ["2 shares", "4 shares", "10 shares", "50 shares"],
                    correct: 1,
                    explanation: "$200 ÷ $50/share = 4 shares"
                },
                xp: 10
            },
            {
                id: "micro_market_hours",
                title: "When Can You Trade?",
                emoji: "🕒",
                duration: "1 min",
                content: {
                    headline: "Stock Market Has Opening Hours",
                    visual: "timeline",
                    keyPoints: [
                        "Market is OPEN: 9:30 AM - 4:00 PM ET (Monday-Friday)",
                        "Market is CLOSED: Weekends + holidays",
                        "Pre-market: 4:00 AM - 9:30 AM (volatile!)",
                        "After-hours: 4:00 PM - 8:00 PM (limited)"
                    ],
                    example: {
                        title: "Best Times to Trade",
                        text: "First 30 minutes (9:30-10:00 AM) = most volatile. Last hour (3:00-4:00 PM) = 'power hour' with high volume.",
                        highlight: "Beginners: avoid first 30 minutes"
                    },
                    actionTip: "Set an alarm for 9:20 AM to prepare for market open"
                },
                quiz: {
                    question: "What time does the US stock market open (Eastern Time)?",
                    options: ["8:00 AM", "9:00 AM", "9:30 AM", "10:00 AM"],
                    correct: 2,
                    explanation: "US markets open at 9:30 AM ET sharp, Monday through Friday"
                },
                xp: 10
            },
            {
                id: "micro_stock_symbols",
                title: "Reading Stock Symbols",
                emoji: "🔤",
                duration: "2 min",
                content: {
                    headline: "Every Stock Has a Ticker Symbol",
                    visual: "list",
                    keyPoints: [
                        "Ticker = Short code for company (1-5 letters)",
                        "AAPL = Apple, TSLA = Tesla, GOOGL = Google",
                        "Makes searching faster than typing full name",
                        "Some tickers are clever: CAKE = Cheesecake Factory"
                    ],
                    example: {
                        title: "Popular Tickers",
                        text: "Tech: AAPL, MSFT, GOOGL, META, NVDA\nCars: TSLA, F, GM\nFood: MCD, SBUX, CMG",
                        highlight: "Learn 10 tickers = instant recognition"
                    },
                    actionTip: "Memorize tickers of companies you use daily"
                },
                quiz: {
                    question: "What company does the ticker 'TSLA' represent?",
                    options: ["Toyota", "Tesla", "Tesco", "Toshiba"],
                    correct: 1,
                    explanation: "TSLA is the ticker symbol for Tesla, Inc."
                },
                xp: 10
            },
            {
                id: "micro_price_changes",
                title: "Why Prices Change",
                emoji: "📊",
                duration: "2 min",
                content: {
                    headline: "Supply & Demand Controls Prices",
                    visual: "animation",
                    keyPoints: [
                        "More buyers than sellers = price goes UP ⬆️",
                        "More sellers than buyers = price goes DOWN ⬇️",
                        "Good news = more buyers (earnings beat, new product)",
                        "Bad news = more sellers (lawsuit, CEO resigns)"
                    ],
                    example: {
                        title: "Real Scenario",
                        text: "Apple announces new iPhone → Investors excited → Rush to buy → Price jumps 5% in one day",
                        highlight: "News moves stocks instantly"
                    },
                    actionTip: "Follow financial news to understand why stocks move"
                },
                quiz: {
                    question: "If more people want to buy a stock than sell it, the price will:",
                    options: ["Go down", "Stay the same", "Go up", "Disappear"],
                    correct: 2,
                    explanation: "High demand (more buyers) pushes prices up - basic supply and demand"
                },
                xp: 10
            }
        ]
    },

    // TECHNICAL ANALYSIS SERIES
    technical: {
        title: "Chart Reading",
        color: "blue",
        gradient: "from-blue-500 to-cyan-500",
        lessons: [
            {
                id: "micro_candlesticks",
                title: "Reading Candlesticks",
                emoji: "🕯️",
                duration: "3 min",
                content: {
                    headline: "Candlesticks Show 4 Prices at Once",
                    visual: "candlestick_diagram",
                    keyPoints: [
                        "Each candle = one time period (1 min, 1 hour, 1 day)",
                        "GREEN candle = price went UP (close > open)",
                        "RED candle = price went DOWN (close < open)",
                        "Wicks show highest and lowest prices"
                    ],
                    example: {
                        title: "Anatomy of a Candle",
                        text: "Body = open to close. Upper wick = high. Lower wick = low. Long green body = strong buying.",
                        highlight: "Color = direction. Body size = strength"
                    },
                    actionTip: "Look at AAPL daily chart - notice green candles on good days, red on bad days"
                },
                quiz: {
                    question: "What does a GREEN candlestick mean?",
                    options: [
                        "Price went down",
                        "Price stayed flat",
                        "Closing price was higher than opening",
                        "High volume"
                    ],
                    correct: 2,
                    explanation: "Green candle means bulls won - price closed higher than it opened"
                },
                xp: 15
            },
            {
                id: "micro_support_resistance",
                title: "Support & Resistance",
                emoji: "🛡️",
                duration: "3 min",
                content: {
                    headline: "Prices Bounce at Key Levels",
                    visual: "chart_with_lines",
                    keyPoints: [
                        "SUPPORT = price level where buyers step in (floor)",
                        "RESISTANCE = price level where sellers appear (ceiling)",
                        "Price bounces between support and resistance",
                        "Break above resistance = bullish. Break below support = bearish"
                    ],
                    example: {
                        title: "Real Pattern",
                        text: "Stock touches $100 three times and bounces = $100 is strong support. If it breaks below $100, watch out - could drop to $95 fast.",
                        highlight: "More touches = stronger level"
                    },
                    actionTip: "Draw horizontal lines on charts where price bounced multiple times"
                },
                quiz: {
                    question: "What happens when a stock breaks ABOVE resistance?",
                    options: [
                        "Usually bearish signal",
                        "Usually bullish signal",
                        "Nothing changes",
                        "Market closes"
                    ],
                    correct: 1,
                    explanation: "Breaking resistance means bulls are strong enough to push past the ceiling - bullish!"
                },
                xp: 15
            },
            {
                id: "micro_rsi",
                title: "RSI Indicator",
                emoji: "📉",
                duration: "2 min",
                content: {
                    headline: "RSI Shows Overbought/Oversold",
                    visual: "rsi_chart",
                    keyPoints: [
                        "RSI = scale from 0 to 100",
                        "RSI > 70 = OVERBOUGHT (might drop soon)",
                        "RSI < 30 = OVERSOLD (might bounce soon)",
                        "Most accurate in range-bound markets"
                    ],
                    example: {
                        title: "Trading RSI",
                        text: "Stock at RSI 25 (oversold) + good news = great buy signal. Stock at RSI 80 (overbought) = consider taking profits.",
                        highlight: "RSI extremes = reversal warning"
                    },
                    actionTip: "Add RSI to your charts - it's free on all platforms"
                },
                quiz: {
                    question: "RSI of 15 means the stock is likely:",
                    options: [
                        "Overbought - might drop",
                        "Oversold - might bounce",
                        "Perfectly priced",
                        "About to split"
                    ],
                    correct: 1,
                    explanation: "RSI below 30 (especially below 20) indicates oversold conditions - bounce likely"
                },
                xp: 15
            }
        ]
    },

    // RISK MANAGEMENT SERIES
    risk: {
        title: "Protect Your Money",
        color: "red",
        gradient: "from-red-500 to-orange-500",
        lessons: [
            {
                id: "micro_stop_loss",
                title: "Always Use Stop-Losses",
                emoji: "🛑",
                duration: "2 min",
                content: {
                    headline: "Stop-Loss = Your Safety Net",
                    visual: "diagram",
                    keyPoints: [
                        "Stop-loss = auto-sell if price drops to X",
                        "Set BEFORE entering trade (never after)",
                        "Typical stop: 3-5% below entry",
                        "Prevents small losses from becoming disasters"
                    ],
                    example: {
                        title: "How It Saves You",
                        text: "Buy at $100, set stop at $95. Stock crashes to $80 overnight. You sold at $95, lost $5. Without stop? Lost $20.",
                        highlight: "$5 loss vs $20 loss - stops work!"
                    },
                    actionTip: "NEVER enter a trade without knowing your stop-loss price first"
                },
                quiz: {
                    question: "You buy a stock at $50. Where should you place a 5% stop-loss?",
                    options: ["$45", "$47.50", "$52.50", "$55"],
                    correct: 1,
                    explanation: "$50 × 5% = $2.50 → $50 - $2.50 = $47.50 stop-loss"
                },
                xp: 20
            },
            {
                id: "micro_position_sizing",
                title: "Never Risk Too Much",
                emoji: "⚖️",
                duration: "2 min",
                content: {
                    headline: "1-2% Rule Keeps You Alive",
                    visual: "pie_chart",
                    keyPoints: [
                        "Never risk more than 1-2% of account on one trade",
                        "Have $10,000? Max risk = $100-$200 per trade",
                        "This ensures you survive 50+ losing trades in a row",
                        "Professional traders use even less (0.5%)"
                    ],
                    example: {
                        title: "The Math",
                        text: "Account: $10,000. Risk 2% = $200. Entry: $50, Stop: $48. Risk per share: $2. Shares to buy: $200 ÷ $2 = 100 shares.",
                        highlight: "Position size = Risk ÷ Distance to stop"
                    },
                    actionTip: "Calculate position size BEFORE clicking buy"
                },
                quiz: {
                    question: "With a $5,000 account and 2% risk rule, what's your max loss per trade?",
                    options: ["$50", "$100", "$150", "$250"],
                    correct: 1,
                    explanation: "$5,000 × 2% = $100 maximum loss per trade"
                },
                xp: 20
            }
        ]
    },

    // PSYCHOLOGY SERIES
    psychology: {
        title: "Trading Mindset",
        color: "purple",
        gradient: "from-purple-500 to-pink-500",
        lessons: [
            {
                id: "micro_fomo",
                title: "Avoid FOMO Trades",
                emoji: "😰",
                duration: "2 min",
                content: {
                    headline: "FOMO = Fear of Missing Out",
                    visual: "emotion_chart",
                    keyPoints: [
                        "Stock up 30% in a day → You feel FOMO → Buy at top → Instant regret",
                        "FOMO trades usually end in losses",
                        "Patience is a superpower in trading",
                        "There's ALWAYS another opportunity"
                    ],
                    example: {
                        title: "Classic FOMO Trap",
                        text: "See GameStop up 100% → Rush to buy at $300 → Drops to $50 next week. Emotional trading = expensive lesson.",
                        highlight: "If you feel FOMO, DON'T trade"
                    },
                    actionTip: "Wait 24 hours before buying anything up >15% in one day"
                },
                quiz: {
                    question: "What should you do when you feel strong FOMO?",
                    options: [
                        "Buy immediately before price goes higher",
                        "Wait and look for a better entry",
                        "Use all your money on the trade",
                        "Tell everyone to buy"
                    ],
                    correct: 1,
                    explanation: "FOMO is an emotion, not a strategy. Wait for pullback or skip the trade."
                },
                xp: 15
            }
        ]
    }
};

/**
 * Daily Micro-Challenges - 30-second rapid-fire quizzes
 */
const DAILY_CHALLENGES = [
    {
        id: "challenge_pattern_recognition",
        title: "Pattern Detective",
        emoji: "🔍",
        type: "image_quiz",
        description: "Identify the chart pattern in 30 seconds",
        duration: 30,
        questions: [
            {
                image: "double_bottom.png", // Would be actual chart screenshot
                question: "What pattern is this?",
                options: ["Double Top", "Double Bottom", "Head & Shoulders", "Triangle"],
                correct: 1
            }
        ],
        xp: 25,
        coins: 10
    },
    {
        id: "challenge_rsi_quick",
        title: "RSI Speedrun",
        emoji: "⚡",
        type: "rapid_fire",
        description: "Overbought or Oversold? 10 questions, 60 seconds",
        duration: 60,
        questions: [
            { rsi: 75, correct: "overbought" },
            { rsi: 25, correct: "oversold" },
            { rsi: 82, correct: "overbought" },
            { rsi: 15, correct: "oversold" },
            { rsi: 50, correct: "neutral" }
        ],
        xp: 30,
        coins: 15
    },
    {
        id: "challenge_fibonacci_levels",
        title: "Fib Level Master",
        emoji: "📐",
        type: "drag_drop",
        description: "Place Fibonacci levels on the chart",
        duration: 45,
        xp: 35,
        coins: 20
    }
];

/**
 * Progress Tracking for Microlessons
 */
class MicroLearningProgress {
    constructor() {
        this.completedMicro = this.loadProgress();
        this.dailyStreak = this.loadStreak();
        this.coins = this.loadCoins();
    }

    loadProgress() {
        const saved = localStorage.getItem('microlearning_progress');
        return saved ? JSON.parse(saved) : [];
    }

    loadStreak() {
        const saved = localStorage.getItem('daily_streak');
        return saved ? JSON.parse(saved) : { count: 0, lastDate: null };
    }

    loadCoins() {
        const saved = localStorage.getItem('learning_coins');
        return saved ? parseInt(saved) : 0;
    }

    completeLesson(lessonId) {
        if (!this.completedMicro.includes(lessonId)) {
            this.completedMicro.push(lessonId);
            this.saveProgress();
            this.updateStreak();
            return true; // First completion
        }
        return false; // Already completed
    }

    saveProgress() {
        localStorage.setItem('microlearning_progress', JSON.stringify(this.completedMicro));
    }

    updateStreak() {
        const today = new Date().toDateString();
        if (this.dailyStreak.lastDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (this.dailyStreak.lastDate === yesterday.toDateString()) {
                // Continue streak
                this.dailyStreak.count++;
            } else {
                // Reset streak
                this.dailyStreak.count = 1;
            }
            this.dailyStreak.lastDate = today;
            localStorage.setItem('daily_streak', JSON.stringify(this.dailyStreak));
        }
    }

    earnCoins(amount) {
        this.coins += amount;
        localStorage.setItem('learning_coins', this.coins.toString());
        return this.coins;
    }

    spendCoins(amount) {
        if (this.coins >= amount) {
            this.coins -= amount;
            localStorage.setItem('learning_coins', this.coins.toString());
            return true;
        }
        return false; // Not enough coins
    }

    getProgress() {
        return {
            completed: this.completedMicro.length,
            streak: this.dailyStreak.count,
            coins: this.coins,
            lessons: this.completedMicro
        };
    }
}

// Export for use in main app
if (typeof window !== 'undefined') {
    window.MicroLearning = {
        MICROLESSONS,
        DAILY_CHALLENGES,
        MicroLearningProgress
    };
}
