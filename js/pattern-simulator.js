// Interactive Chart Pattern Simulator for FinClash Learning
// Users can draw patterns and get AI feedback

/**
 * Pattern Simulator Class
 * Allows users to identify and draw chart patterns
 */
class PatternSimulator {
    constructor(containerId, mode = 'identify') {
        this.containerId = containerId;
        this.mode = mode; // 'identify', 'draw', 'predict'
        this.chartInstance = null;
        this.userDrawings = [];
        this.currentPattern = null;
        this.score = 0;
        this.attempts = 0;
    }

    /**
     * Initialize simulator with random pattern
     */
    async init() {
        const patterns = ['bullFlag', 'headShoulders', 'doubleBottom', 'uptrend', 'downtrend'];
        this.currentPattern = patterns[Math.floor(Math.random() * patterns.length)];

        // Generate chart data
        const data = window.TradingViewCharts.generateSampleChartData(this.currentPattern, 40);

        // Create chart
        this.chartInstance = window.TradingViewCharts.createInteractiveCandlestickChart(
            this.containerId,
            data,
            { height: 400 }
        );

        return this.currentPattern;
    }

    /**
     * Check user's pattern identification
     */
    checkIdentification(userAnswer) {
        this.attempts++;
        const correct = this.normalizePatternName(userAnswer) === this.normalizePatternName(this.currentPattern);

        if (correct) {
            this.score++;
        }

        return {
            correct,
            actualPattern: this.getPatternName(this.currentPattern),
            explanation: this.getPatternExplanation(this.currentPattern),
            accuracy: this.attempts > 0 ? ((this.score / this.attempts) * 100).toFixed(1) : 0
        };
    }

    /**
     * Drawing mode - user draws support/resistance
     */
    enableDrawingMode() {
        // Add click handler for drawing lines
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.style.cursor = 'crosshair';

        let drawingLine = null;
        let startPoint = null;

        container.addEventListener('click', (e) => {
            if (!startPoint) {
                // First click - start line
                const rect = container.getBoundingClientRect();
                startPoint = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };
            } else {
                // Second click - finish line
                const rect = container.getBoundingClientRect();
                const endPoint = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };

                this.userDrawings.push({
                    start: startPoint,
                    end: endPoint,
                    type: 'line'
                });

                startPoint = null;
                this.renderDrawings();
            }
        });
    }

    /**
     * Predict mode - user predicts breakout direction
     */
    predictBreakout(direction) {
        // Determine actual breakout based on pattern
        let actualDirection;

        switch (this.currentPattern) {
            case 'bullFlag':
            case 'doubleBottom':
            case 'uptrend':
                actualDirection = 'up';
                break;
            case 'headShoulders':
            case 'downtrend':
                actualDirection = 'down';
                break;
            default:
                actualDirection = 'sideways';
        }

        const correct = direction === actualDirection;

        if (correct) {
            this.score++;
        }
        this.attempts++;

        return {
            correct,
            actualDirection,
            userPrediction: direction,
            confidence: this.getBreakoutConfidence(this.currentPattern),
            explanation: this.getBreakoutExplanation(this.currentPattern, actualDirection)
        };
    }

    /**
     * Generate new random pattern
     */
    nextPattern() {
        if (this.chartInstance) {
            window.TradingViewCharts.destroyChart(this.chartInstance);
        }
        this.userDrawings = [];
        return this.init();
    }

    /**
     * Helper: Normalize pattern names
     */
    normalizePatternName(name) {
        const normalized = name.toLowerCase().replace(/[^a-z]/g, '');
        const mapping = {
            'bullflag': 'bullflag',
            'bearflag': 'bearflag',
            'headandshoulders': 'headshoulders',
            'headshoulders': 'headshoulders',
            'doublebottom': 'doublebottom',
            'doubletop': 'doubletop',
            'uptrend': 'uptrend',
            'downtrend': 'downtrend',
            'triangle': 'triangle',
            'wedge': 'wedge',
            'cupandhandle': 'cuphandle'
        };
        return mapping[normalized] || normalized;
    }

    /**
     * Get readable pattern name
     */
    getPatternName(pattern) {
        const names = {
            'bullFlag': 'Bull Flag',
            'bearFlag': 'Bear Flag',
            'headShoulders': 'Head and Shoulders',
            'doubleBottom': 'Double Bottom',
            'doubleTop': 'Double Top',
            'uptrend': 'Uptrend',
            'downtrend': 'Downtrend',
            'triangle': 'Triangle',
            'wedge': 'Wedge'
        };
        return names[pattern] || pattern;
    }

    /**
     * Get pattern explanation
     */
    getPatternExplanation(pattern) {
        const explanations = {
            'bullFlag': 'Bull Flag: Sharp upward move (flagpole) followed by downward consolidation (flag), then breakout upward. Continuation pattern.',
            'bearFlag': 'Bear Flag: Sharp downward move followed by upward consolidation, then breakdown. Bearish continuation.',
            'headShoulders': 'Head and Shoulders: Three peaks with middle peak (head) higher than sides (shoulders). Bearish reversal when neckline breaks.',
            'doubleBottom': 'Double Bottom: Two troughs at similar levels forming a "W". Bullish reversal when price breaks above middle peak.',
            'doubleTop': 'Double Top: Two peaks at similar levels forming an "M". Bearish reversal when price breaks below middle trough.',
            'uptrend': 'Uptrend: Series of higher highs and higher lows. Indicates bullish momentum and buying pressure.',
            'downtrend': 'Downtrend: Series of lower highs and lower lows. Indicates bearish momentum and selling pressure.',
            'triangle': 'Triangle: Converging trendlines creating a triangle. Breakout direction determines trend (up or down).',
            'wedge': 'Wedge: Converging trendlines with both sloping in same direction. Often reversal patterns.'
        };
        return explanations[pattern] || 'Common chart pattern in technical analysis.';
    }

    /**
     * Get breakout confidence
     */
    getBreakoutConfidence(pattern) {
        const confidence = {
            'bullFlag': 85,
            'bearFlag': 85,
            'headShoulders': 80,
            'doubleBottom': 75,
            'doubleTop': 75,
            'uptrend': 70,
            'downtrend': 70,
            'triangle': 60,
            'wedge': 65
        };
        return confidence[pattern] || 50;
    }

    /**
     * Get breakout explanation
     */
    getBreakoutExplanation(pattern, direction) {
        const explanations = {
            'bullFlag': 'Bull flags typically break upward (85% success rate). Price consolidates after strong rise, then continues higher.',
            'headShoulders': 'Head and Shoulders breaks downward (80% success rate). Right shoulder fails to exceed head, sellers take control.',
            'doubleBottom': 'Double Bottom breaks upward (75% success rate). Price finds support twice at same level, then rallies.',
            'uptrend': 'Uptrends continue upward (70% of the time). Higher highs and higher lows indicate persistent buying pressure.',
            'downtrend': 'Downtrends continue downward (70% of the time). Lower lows and lower highs show persistent selling pressure.'
        };
        return explanations[pattern] || `Pattern breaks ${direction}ward based on structure and momentum.`;
    }

    /**
     * Get performance stats
     */
    getStats() {
        return {
            score: this.score,
            attempts: this.attempts,
            accuracy: this.attempts > 0 ? ((this.score / this.attempts) * 100).toFixed(1) : 0,
            level: this.score < 5 ? 'Beginner' :
                   this.score < 15 ? 'Intermediate' :
                   this.score < 30 ? 'Advanced' : 'Expert'
        };
    }

    /**
     * Render user drawings on chart
     */
    renderDrawings() {
        // This would integrate with TradingView chart to draw lines
        // For now, just track the drawings
        console.log('User drawings:', this.userDrawings);
    }

    /**
     * Reset simulator
     */
    reset() {
        this.score = 0;
        this.attempts = 0;
        this.userDrawings = [];
        if (this.chartInstance) {
            window.TradingViewCharts.destroyChart(this.chartInstance);
            this.chartInstance = null;
        }
    }
}

/**
 * Pattern Recognition Training Game
 * Flash patterns quickly, user must identify
 */
class PatternFlashCards {
    constructor() {
        this.patterns = ['bullFlag', 'headShoulders', 'doubleBottom', 'uptrend', 'downtrend'];
        this.currentPattern = null;
        this.score = 0;
        this.round = 0;
        this.timeLimit = 10; // seconds
        this.timer = null;
    }

    /**
     * Start new round
     */
    startRound(containerId) {
        this.round++;
        this.currentPattern = this.patterns[Math.floor(Math.random() * this.patterns.length)];

        // Generate and display chart
        const data = window.TradingViewCharts.generateSampleChartData(this.currentPattern, 30);
        const chart = window.TradingViewCharts.createInteractiveCandlestickChart(
            containerId,
            data,
            { height: 300 }
        );

        // Start timer
        let timeLeft = this.timeLimit;
        this.timer = setInterval(() => {
            timeLeft--;
            if (timeLeft <= 0) {
                clearInterval(this.timer);
                // Time's up
            }
        }, 1000);

        return {
            round: this.round,
            timeLimit: this.timeLimit
        };
    }

    /**
     * Check answer
     */
    checkAnswer(userAnswer, timeSpent) {
        clearInterval(this.timer);

        const correct = this.normalizePattern(userAnswer) === this.normalizePattern(this.currentPattern);

        if (correct) {
            // Bonus points for speed
            const speedBonus = Math.max(0, this.timeLimit - timeSpent);
            this.score += 10 + speedBonus;
        }

        return {
            correct,
            actualPattern: this.currentPattern,
            score: this.score,
            speedBonus: correct ? Math.max(0, this.timeLimit - timeSpent) : 0
        };
    }

    normalizePattern(name) {
        return name.toLowerCase().replace(/[^a-z]/g, '');
    }

    getStats() {
        return {
            round: this.round,
            score: this.score,
            avgScore: this.round > 0 ? (this.score / this.round).toFixed(1) : 0
        };
    }

    reset() {
        this.score = 0;
        this.round = 0;
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
}

// Export
if (typeof window !== 'undefined') {
    window.PatternSimulator = {
        PatternSimulator,
        PatternFlashCards
    };
}
