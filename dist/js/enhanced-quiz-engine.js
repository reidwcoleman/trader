// Enhanced Quiz Engine for FinClash Learning Tab
// Supports multiple question types: Multiple Choice, True/False, Fill-in-blank, Image-based

/**
 * Question Types
 */
const QuestionType = {
    MULTIPLE_CHOICE: 'multiple_choice',
    TRUE_FALSE: 'true_false',
    FILL_BLANK: 'fill_blank',
    IMAGE_BASED: 'image_based',
    MATCHING: 'matching',
    ORDERING: 'ordering'
};

/**
 * Enhanced Quiz Questions Database
 */
const ENHANCED_QUIZ_QUESTIONS = {
    basics: [
        // Multiple Choice
        {
            type: QuestionType.MULTIPLE_CHOICE,
            question: "What does owning a stock mean?",
            options: [
                "You own a loan to the company",
                "You own a fractional share of the company",
                "You are lending money to investors",
                "You have no ownership rights"
            ],
            correct: 1,
            explanation: "Stock represents partial ownership in a company. You become a shareholder with ownership rights.",
            difficulty: 1,
            xp: 25
        },
        // True/False
        {
            type: QuestionType.TRUE_FALSE,
            question: "The bid price is what you pay when buying a stock.",
            correct: false,
            explanation: "FALSE. You pay the ASK price when buying. The BID price is what you receive when selling.",
            difficulty: 1,
            xp: 20
        },
        {
            type: QuestionType.TRUE_FALSE,
            question: "Higher trading volume confirms the strength of a price movement.",
            correct: true,
            explanation: "TRUE. High volume indicates strong conviction behind the move, making it more reliable.",
            difficulty: 2,
            xp: 20
        },
        // Fill in the Blank
        {
            type: QuestionType.FILL_BLANK,
            question: "Market Cap = Share Price × _____ Shares",
            answer: "outstanding",
            acceptableAnswers: ["outstanding", "total", "issued"],
            explanation: "Market Cap = Share Price × Outstanding Shares. This measures the total value of a company.",
            difficulty: 2,
            xp: 30
        },
        {
            type: QuestionType.FILL_BLANK,
            question: "A green candlestick means the price _____ higher than it opened.",
            answer: "closed",
            acceptableAnswers: ["closed", "finished", "ended"],
            explanation: "Green candlesticks show the closing price was higher than the opening price (bullish).",
            difficulty: 1,
            xp: 25
        },
        // Image-based (pattern recognition)
        {
            type: QuestionType.IMAGE_BASED,
            question: "What pattern is shown in this chart?",
            chartPattern: "bullFlag", // Will generate chart
            options: ["Bull Flag", "Head and Shoulders", "Double Bottom", "Triangle"],
            correct: 0,
            explanation: "Bull Flag: Sharp rise (flagpole) followed by consolidation (flag), then breakout upward.",
            difficulty: 3,
            xp: 40
        }
    ],

    technical: [
        // Multiple Choice
        {
            type: QuestionType.MULTIPLE_CHOICE,
            question: "What does RSI above 70 indicate?",
            options: [
                "Oversold - buy signal",
                "Overbought - potential sell signal",
                "Neutral market",
                "Strong support level"
            ],
            correct: 1,
            explanation: "RSI > 70 suggests overbought conditions, meaning the stock may be due for a pullback.",
            difficulty: 2,
            xp: 25
        },
        // True/False
        {
            type: QuestionType.TRUE_FALSE,
            question: "MACD bullish crossover occurs when MACD line crosses above the signal line.",
            correct: true,
            explanation: "TRUE. When MACD crosses above signal line, it's a bullish signal indicating upward momentum.",
            difficulty: 2,
            xp: 20
        },
        {
            type: QuestionType.TRUE_FALSE,
            question: "Moving averages are lagging indicators.",
            correct: true,
            explanation: "TRUE. Moving averages are based on past prices, so they lag behind current price action.",
            difficulty: 2,
            xp: 20
        },
        // Fill in Blank
        {
            type: QuestionType.FILL_BLANK,
            question: "When a support level breaks, it often becomes _____.",
            answer: "resistance",
            acceptableAnswers: ["resistance"],
            explanation: "Broken support becomes resistance. Price often struggles to break back above former support.",
            difficulty: 2,
            xp: 30
        },
        // Image-based
        {
            type: QuestionType.IMAGE_BASED,
            question: "Identify the trend shown in this chart:",
            chartPattern: "uptrend",
            options: ["Uptrend", "Downtrend", "Sideways", "Reversal"],
            correct: 0,
            explanation: "Uptrend: Series of higher highs and higher lows, indicating bullish momentum.",
            difficulty: 2,
            xp: 35
        },
        {
            type: QuestionType.IMAGE_BASED,
            question: "What pattern is forming?",
            chartPattern: "headShoulders",
            options: ["Bull Flag", "Head and Shoulders", "Cup and Handle", "Wedge"],
            correct: 1,
            explanation: "Head and Shoulders: Bearish reversal pattern with three peaks - left shoulder, head, right shoulder.",
            difficulty: 3,
            xp: 40
        }
    ],

    risk: [
        // Multiple Choice
        {
            type: QuestionType.MULTIPLE_CHOICE,
            question: "What is the recommended maximum risk per trade?",
            options: ["10% of account", "5% of account", "1-2% of account", "25% of account"],
            correct: 2,
            explanation: "Risk 1-2% max per trade. This ensures you survive losing streaks and live to trade another day.",
            difficulty: 1,
            xp: 25
        },
        // True/False
        {
            type: QuestionType.TRUE_FALSE,
            question: "A stop-loss order limits your potential losses on a trade.",
            correct: true,
            explanation: "TRUE. Stop-loss automatically exits your position when price hits your limit, protecting capital.",
            difficulty: 1,
            xp: 20
        },
        {
            type: QuestionType.TRUE_FALSE,
            question: "Diversification eliminates all investment risk.",
            correct: false,
            explanation: "FALSE. Diversification reduces risk but cannot eliminate it. Market-wide events still affect all stocks.",
            difficulty: 2,
            xp: 20
        },
        // Fill in Blank
        {
            type: QuestionType.FILL_BLANK,
            question: "Risk/Reward ratio of 3:1 means you risk $100 to make $_____.",
            answer: "300",
            acceptableAnswers: ["300", "$300", "300 dollars"],
            explanation: "3:1 ratio means potential profit is 3× potential loss. Risk $100 to make $300.",
            difficulty: 2,
            xp: 30
        },
        // Ordering (sequence)
        {
            type: QuestionType.ORDERING,
            question: "Put these steps in correct order for entering a trade:",
            items: [
                "Analyze stock and identify entry point",
                "Calculate position size (1-2% risk)",
                "Set stop-loss below support",
                "Enter trade",
                "Set profit target (2:1 or better R/R)"
            ],
            correctOrder: [0, 1, 2, 3, 4],
            explanation: "Proper sequence: Analyze → Calculate size → Set stop-loss → Enter → Set target. Plan before executing!",
            difficulty: 3,
            xp: 40
        }
    ],

    patterns: [
        // Image-based (primary for patterns)
        {
            type: QuestionType.IMAGE_BASED,
            question: "What chart pattern is this?",
            chartPattern: "doubleBottom",
            options: ["Double Top", "Double Bottom", "Head and Shoulders", "Triangle"],
            correct: 1,
            explanation: "Double Bottom: Two troughs at similar levels forming a 'W'. Bullish reversal pattern.",
            difficulty: 2,
            xp: 35
        },
        {
            type: QuestionType.IMAGE_BASED,
            question: "Identify this pattern:",
            chartPattern: "bullFlag",
            options: ["Bull Flag", "Bear Flag", "Pennant", "Wedge"],
            correct: 0,
            explanation: "Bull Flag: Sharp rise (pole) + downward consolidation (flag) + upward breakout. Continuation pattern.",
            difficulty: 3,
            xp: 40
        },
        // True/False
        {
            type: QuestionType.TRUE_FALSE,
            question: "A bull flag is a continuation pattern, not a reversal pattern.",
            correct: true,
            explanation: "TRUE. Bull flags signal continuation of uptrend after brief consolidation, not trend reversal.",
            difficulty: 2,
            xp: 20
        },
        // Multiple Choice
        {
            type: QuestionType.MULTIPLE_CHOICE,
            question: "What confirms a double bottom breakout?",
            options: [
                "Price drops to a third bottom",
                "Price breaks above the middle peak with volume",
                "Price stays flat",
                "RSI goes below 30"
            ],
            correct: 1,
            explanation: "Breakout above middle peak (neckline) on high volume confirms the double bottom pattern.",
            difficulty: 3,
            xp: 30
        }
    ],

    options: [
        // Multiple Choice
        {
            type: QuestionType.MULTIPLE_CHOICE,
            question: "What is the maximum loss when buying a call option?",
            options: ["Unlimited", "Strike price", "Premium paid", "Stock price"],
            correct: 2,
            explanation: "Max loss when BUYING options is always the premium paid. You can't lose more than that.",
            difficulty: 2,
            xp: 25
        },
        // True/False
        {
            type: QuestionType.TRUE_FALSE,
            question: "Theta (time decay) hurts option buyers and helps option sellers.",
            correct: true,
            explanation: "TRUE. Options lose value over time (theta decay). Buyers lose, sellers profit from time decay.",
            difficulty: 3,
            xp: 25
        },
        // Fill in Blank
        {
            type: QuestionType.FILL_BLANK,
            question: "A call option gives you the right to _____ stock at the strike price.",
            answer: "buy",
            acceptableAnswers: ["buy", "purchase"],
            explanation: "Call options give you the RIGHT (not obligation) to BUY stock at strike price before expiration.",
            difficulty: 2,
            xp: 25
        },
        // Matching
        {
            type: QuestionType.MATCHING,
            question: "Match the Greek to its meaning:",
            pairs: [
                { left: "Delta", right: "Price sensitivity" },
                { left: "Theta", right: "Time decay" },
                { left: "Vega", right: "Volatility sensitivity" },
                { left: "Gamma", right: "Delta sensitivity" }
            ],
            explanation: "Delta=price, Theta=time, Vega=volatility, Gamma=delta rate of change.",
            difficulty: 3,
            xp: 40
        }
    ]
};

/**
 * Quiz Engine Class
 */
class EnhancedQuizEngine {
    constructor(topic) {
        this.topic = topic;
        this.questions = ENHANCED_QUIZ_QUESTIONS[topic] || [];
        this.currentIndex = 0;
        this.answers = {};
        this.score = 0;
        this.totalXP = 0;
        this.startTime = Date.now();
    }

    getQuestion(index) {
        return this.questions[index];
    }

    getCurrentQuestion() {
        return this.questions[this.currentIndex];
    }

    getTotalQuestions() {
        return this.questions.length;
    }

    submitAnswer(questionIndex, answer) {
        const question = this.questions[questionIndex];
        let isCorrect = false;

        switch (question.type) {
            case QuestionType.MULTIPLE_CHOICE:
                isCorrect = answer === question.correct;
                break;

            case QuestionType.TRUE_FALSE:
                isCorrect = answer === question.correct;
                break;

            case QuestionType.FILL_BLANK:
                const normalized = answer.toLowerCase().trim();
                isCorrect = question.acceptableAnswers.some(
                    acceptable => acceptable.toLowerCase() === normalized
                );
                break;

            case QuestionType.IMAGE_BASED:
                isCorrect = answer === question.correct;
                break;

            case QuestionType.ORDERING:
                isCorrect = JSON.stringify(answer) === JSON.stringify(question.correctOrder);
                break;

            case QuestionType.MATCHING:
                // Check if all pairs matched correctly
                isCorrect = question.pairs.every((pair, idx) => {
                    return answer[idx] && answer[idx].left === pair.left && answer[idx].right === pair.right;
                });
                break;
        }

        this.answers[questionIndex] = {
            answer,
            correct: isCorrect,
            xpEarned: isCorrect ? question.xp : 0
        };

        if (isCorrect) {
            this.score++;
            this.totalXP += question.xp;
        }

        return {
            correct: isCorrect,
            explanation: question.explanation,
            xpEarned: isCorrect ? question.xp : 0
        };
    }

    getResults() {
        const timeSpent = (Date.now() - this.startTime) / 1000; // seconds
        const percentage = (this.score / this.questions.length) * 100;

        let grade = 'F';
        if (percentage >= 90) grade = 'A';
        else if (percentage >= 80) grade = 'B';
        else if (percentage >= 70) grade = 'C';
        else if (percentage >= 60) grade = 'D';

        return {
            score: this.score,
            total: this.questions.length,
            percentage: percentage.toFixed(1),
            grade,
            totalXP: this.totalXP,
            timeSpent: Math.round(timeSpent),
            answers: this.answers,
            passed: percentage >= 70
        };
    }

    reset() {
        this.currentIndex = 0;
        this.answers = {};
        this.score = 0;
        this.totalXP = 0;
        this.startTime = Date.now();
    }

    // Shuffle questions for randomization
    shuffle() {
        for (let i = this.questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
        }
    }
}

/**
 * Generate chart for image-based questions
 */
function generateQuestionChart(containerId, pattern) {
    if (typeof window.TradingViewCharts === 'undefined') {
        console.error('TradingView Charts not loaded');
        return null;
    }

    const data = window.TradingViewCharts.generateSampleChartData(pattern, 30);
    const chart = window.TradingViewCharts.createInteractiveCandlestickChart(
        containerId,
        data,
        { height: 300 }
    );

    return chart;
}

// Export
if (typeof window !== 'undefined') {
    window.EnhancedQuizEngine = {
        QuestionType,
        ENHANCED_QUIZ_QUESTIONS,
        EnhancedQuizEngine,
        generateQuestionChart
    };
}
