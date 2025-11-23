// Interactive Chart Playground for FinClash Learning Tab
// Practice drawing trend lines, identifying patterns, and testing strategies

/**
 * Chart Playground - Interactive learning environment
 * Students can draw on charts, identify patterns, and get instant feedback
 */

class ChartPlayground {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = options.width || 800;
        this.height = options.height || 400;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // Drawing state
        this.isDrawing = false;
        this.drawMode = 'trendline'; // 'trendline', 'horizontal', 'fibonacci', 'rectangle'
        this.drawings = [];
        this.currentDrawing = null;

        // Chart data
        this.priceData = [];
        this.labels = [];
        this.candlesticks = [];

        // Chart bounds
        this.padding = { top: 20, right: 60, bottom: 40, left: 10 };
        this.chartArea = {
            x: this.padding.left,
            y: this.padding.top,
            width: this.width - this.padding.left - this.padding.right,
            height: this.height - this.padding.top - this.padding.bottom
        };

        // Price scale
        this.minPrice = 0;
        this.maxPrice = 0;

        // Event listeners
        this.setupEventListeners();
    }

    /**
     * Setup mouse/touch event listeners
     */
    setupEventListeners() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('mouseleave', this.handleMouseUp.bind(this));

        // Touch events for mobile
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }

    /**
     * Load historical price data
     */
    loadPriceData(data) {
        this.priceData = data.closes || [];
        this.labels = data.labels || [];
        this.candlesticks = data.candlesticks || [];

        // Calculate price range
        this.minPrice = Math.min(...this.priceData);
        this.maxPrice = Math.max(...this.priceData);

        // Add 5% padding
        const range = this.maxPrice - this.minPrice;
        this.minPrice -= range * 0.05;
        this.maxPrice += range * 0.05;

        this.render();
    }

    /**
     * Convert price to Y coordinate
     */
    priceToY(price) {
        const ratio = (price - this.minPrice) / (this.maxPrice - this.minPrice);
        return this.chartArea.y + this.chartArea.height - (ratio * this.chartArea.height);
    }

    /**
     * Convert Y coordinate to price
     */
    yToPrice(y) {
        const ratio = (this.chartArea.y + this.chartArea.height - y) / this.chartArea.height;
        return this.minPrice + (ratio * (this.maxPrice - this.minPrice));
    }

    /**
     * Convert index to X coordinate
     */
    indexToX(index) {
        const candleWidth = this.chartArea.width / this.priceData.length;
        return this.chartArea.x + (index * candleWidth) + (candleWidth / 2);
    }

    /**
     * Convert X coordinate to index
     */
    xToIndex(x) {
        const candleWidth = this.chartArea.width / this.priceData.length;
        return Math.floor((x - this.chartArea.x) / candleWidth);
    }

    /**
     * Render the entire chart
     */
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Draw background
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw grid
        this.drawGrid();

        // Draw candlesticks
        this.drawCandlesticks();

        // Draw price labels
        this.drawPriceLabels();

        // Draw all saved drawings
        this.drawings.forEach(drawing => this.drawShape(drawing));

        // Draw current drawing (in progress)
        if (this.currentDrawing) {
            this.drawShape(this.currentDrawing, true);
        }
    }

    /**
     * Draw grid lines
     */
    drawGrid() {
        this.ctx.strokeStyle = '#2a2a3e';
        this.ctx.lineWidth = 1;

        // Horizontal grid lines (price levels)
        const priceSteps = 5;
        const priceStep = (this.maxPrice - this.minPrice) / priceSteps;

        for (let i = 0; i <= priceSteps; i++) {
            const price = this.minPrice + (i * priceStep);
            const y = this.priceToY(price);

            this.ctx.beginPath();
            this.ctx.moveTo(this.chartArea.x, y);
            this.ctx.lineTo(this.chartArea.x + this.chartArea.width, y);
            this.ctx.stroke();
        }

        // Vertical grid lines (time)
        const timeSteps = 10;
        const timeStep = this.priceData.length / timeSteps;

        for (let i = 0; i <= timeSteps; i++) {
            const index = Math.floor(i * timeStep);
            const x = this.indexToX(index);

            this.ctx.beginPath();
            this.ctx.moveTo(x, this.chartArea.y);
            this.ctx.lineTo(x, this.chartArea.y + this.chartArea.height);
            this.ctx.stroke();
        }
    }

    /**
     * Draw candlesticks
     */
    drawCandlesticks() {
        const candleWidth = this.chartArea.width / this.priceData.length;
        const bodyWidth = candleWidth * 0.6;

        this.priceData.forEach((close, index) => {
            const x = this.indexToX(index);

            // Use candlestick data if available, otherwise estimate
            const candle = this.candlesticks[index] || {
                open: close * (0.98 + Math.random() * 0.04),
                high: close * (1 + Math.random() * 0.02),
                low: close * (0.98 - Math.random() * 0.02),
                close: close
            };

            const openY = this.priceToY(candle.open);
            const closeY = this.priceToY(candle.close);
            const highY = this.priceToY(candle.high);
            const lowY = this.priceToY(candle.low);

            const isGreen = candle.close >= candle.open;
            this.ctx.fillStyle = isGreen ? '#26a69a' : '#ef5350';
            this.ctx.strokeStyle = isGreen ? '#26a69a' : '#ef5350';

            // Draw wick
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(x, highY);
            this.ctx.lineTo(x, lowY);
            this.ctx.stroke();

            // Draw body
            const bodyHeight = Math.abs(closeY - openY);
            const bodyY = Math.min(openY, closeY);
            this.ctx.fillRect(x - bodyWidth / 2, bodyY, bodyWidth, bodyHeight || 1);
        });
    }

    /**
     * Draw price labels on right side
     */
    drawPriceLabels() {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '12px monospace';
        this.ctx.textAlign = 'left';

        const priceSteps = 5;
        const priceStep = (this.maxPrice - this.minPrice) / priceSteps;

        for (let i = 0; i <= priceSteps; i++) {
            const price = this.minPrice + (i * priceStep);
            const y = this.priceToY(price);

            this.ctx.fillText(
                `$${price.toFixed(2)}`,
                this.chartArea.x + this.chartArea.width + 5,
                y + 4
            );
        }
    }

    /**
     * Draw a shape (trendline, horizontal line, etc.)
     */
    drawShape(shape, isPreview = false) {
        this.ctx.strokeStyle = isPreview ? 'rgba(255, 255, 0, 0.7)' : shape.color || '#00ff00';
        this.ctx.lineWidth = isPreview ? 2 : 3;
        this.ctx.setLineDash(shape.dashed ? [5, 5] : []);

        switch (shape.type) {
            case 'trendline':
                this.ctx.beginPath();
                this.ctx.moveTo(shape.x1, shape.y1);
                this.ctx.lineTo(shape.x2, shape.y2);
                this.ctx.stroke();
                break;

            case 'horizontal':
                this.ctx.beginPath();
                this.ctx.moveTo(this.chartArea.x, shape.y1);
                this.ctx.lineTo(this.chartArea.x + this.chartArea.width, shape.y1);
                this.ctx.stroke();

                // Draw price label
                if (!isPreview) {
                    const price = this.yToPrice(shape.y1);
                    this.ctx.fillStyle = shape.color || '#00ff00';
                    this.ctx.font = 'bold 12px monospace';
                    this.ctx.fillText(
                        `$${price.toFixed(2)}`,
                        this.chartArea.x + this.chartArea.width + 5,
                        shape.y1 + 4
                    );
                }
                break;

            case 'fibonacci':
                // Draw Fibonacci retracement levels
                const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1.0];
                const range = shape.y2 - shape.y1;

                levels.forEach(level => {
                    const y = shape.y1 + (range * level);
                    this.ctx.strokeStyle = `rgba(255, 215, 0, ${isPreview ? 0.5 : 0.8})`;
                    this.ctx.beginPath();
                    this.ctx.moveTo(shape.x1, y);
                    this.ctx.lineTo(shape.x2, y);
                    this.ctx.stroke();

                    // Label
                    if (!isPreview) {
                        this.ctx.fillStyle = '#ffd700';
                        this.ctx.font = 'bold 10px monospace';
                        this.ctx.fillText(
                            `${(level * 100).toFixed(1)}%`,
                            shape.x2 + 5,
                            y + 4
                        );
                    }
                });
                break;

            case 'rectangle':
                this.ctx.strokeRect(
                    Math.min(shape.x1, shape.x2),
                    Math.min(shape.y1, shape.y2),
                    Math.abs(shape.x2 - shape.x1),
                    Math.abs(shape.y2 - shape.y1)
                );
                break;
        }

        this.ctx.setLineDash([]);
    }

    /**
     * Mouse event handlers
     */
    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.isDrawing = true;
        this.currentDrawing = {
            type: this.drawMode,
            x1: x,
            y1: y,
            x2: x,
            y2: y,
            color: this.getDrawColor()
        };
    }

    handleMouseMove(e) {
        if (!this.isDrawing) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.currentDrawing.x2 = x;
        this.currentDrawing.y2 = y;

        this.render();
    }

    handleMouseUp(e) {
        if (this.isDrawing && this.currentDrawing) {
            // Save the drawing
            this.drawings.push({ ...this.currentDrawing });
            this.currentDrawing = null;
            this.isDrawing = false;
            this.render();
        }
    }

    /**
     * Touch event handlers (mobile support)
     */
    handleTouchStart(e) {
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const touch = e.touches[0];
        this.handleMouseDown({
            clientX: touch.clientX,
            clientY: touch.clientY
        });
    }

    handleTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        this.handleMouseMove({
            clientX: touch.clientX,
            clientY: touch.clientY
        });
    }

    handleTouchEnd(e) {
        e.preventDefault();
        this.handleMouseUp(e);
    }

    /**
     * Get color based on draw mode
     */
    getDrawColor() {
        const colors = {
            trendline: '#00ff00',
            horizontal: '#ff00ff',
            fibonacci: '#ffd700',
            rectangle: '#00ffff'
        };
        return colors[this.drawMode] || '#ffffff';
    }

    /**
     * Change draw mode
     */
    setDrawMode(mode) {
        this.drawMode = mode;
    }

    /**
     * Clear all drawings
     */
    clearDrawings() {
        this.drawings = [];
        this.render();
    }

    /**
     * Undo last drawing
     */
    undoLast() {
        this.drawings.pop();
        this.render();
    }

    /**
     * Export drawings as JSON
     */
    exportDrawings() {
        return JSON.stringify(this.drawings);
    }

    /**
     * Import drawings from JSON
     */
    importDrawings(json) {
        try {
            this.drawings = JSON.parse(json);
            this.render();
            return true;
        } catch (e) {
            console.error('Failed to import drawings:', e);
            return false;
        }
    }
}

/**
 * Pattern Recognition Game
 * Students identify chart patterns and get instant feedback
 */
class PatternRecognitionGame {
    constructor() {
        this.patterns = [
            {
                name: 'Double Bottom',
                description: 'Bullish reversal pattern with two lows at similar price',
                emoji: '📊',
                difficulty: 'intermediate',
                points: 30
            },
            {
                name: 'Head and Shoulders',
                description: 'Bearish reversal with left shoulder, head, right shoulder',
                emoji: '👤',
                difficulty: 'advanced',
                points: 50
            },
            {
                name: 'Ascending Triangle',
                description: 'Bullish pattern with higher lows and flat resistance',
                emoji: '📈',
                difficulty: 'intermediate',
                points: 30
            },
            {
                name: 'Cup and Handle',
                description: 'Bullish continuation with U-shape and small pullback',
                emoji: '☕',
                difficulty: 'intermediate',
                points: 30
            },
            {
                name: 'Bull Flag',
                description: 'Bullish continuation with strong move then consolidation',
                emoji: '🚩',
                difficulty: 'beginner',
                points: 20
            },
            {
                name: 'Falling Wedge',
                description: 'Bullish reversal with converging trendlines sloping down',
                emoji: '📉',
                difficulty: 'advanced',
                points: 50
            }
        ];

        this.score = 0;
        this.streak = 0;
        this.bestStreak = this.loadBestStreak();
    }

    /**
     * Generate a random pattern challenge
     */
    generateChallenge() {
        const pattern = this.patterns[Math.floor(Math.random() * this.patterns.length)];
        const wrongAnswers = this.patterns
            .filter(p => p.name !== pattern.name)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

        const options = [pattern, ...wrongAnswers]
            .sort(() => Math.random() - 0.5)
            .map(p => p.name);

        return {
            correctPattern: pattern,
            options,
            chartData: this.generatePatternChart(pattern.name)
        };
    }

    /**
     * Generate synthetic chart data for pattern
     */
    generatePatternChart(patternName) {
        // Simplified - in production, use real historical charts
        const basePrice = 100 + Math.random() * 100;
        const points = 50;
        const data = [];

        for (let i = 0; i < points; i++) {
            data.push(basePrice + (Math.random() - 0.5) * 10);
        }

        return {
            closes: data,
            labels: Array(points).fill('').map((_, i) => `T${i}`)
        };
    }

    /**
     * Check answer and update score
     */
    checkAnswer(userAnswer, correctAnswer) {
        const isCorrect = userAnswer === correctAnswer;

        if (isCorrect) {
            const points = this.patterns.find(p => p.name === correctAnswer).points;
            this.score += points;
            this.streak++;
            if (this.streak > this.bestStreak) {
                this.bestStreak = this.streak;
                this.saveBestStreak();
            }
        } else {
            this.streak = 0;
        }

        return {
            correct: isCorrect,
            points: isCorrect ? this.patterns.find(p => p.name === correctAnswer).points : 0,
            streak: this.streak,
            totalScore: this.score
        };
    }

    /**
     * Save/load best streak
     */
    saveBestStreak() {
        localStorage.setItem('pattern_game_best_streak', this.bestStreak.toString());
    }

    loadBestStreak() {
        return parseInt(localStorage.getItem('pattern_game_best_streak') || '0');
    }

    /**
     * Reset game
     */
    reset() {
        this.score = 0;
        this.streak = 0;
    }

    /**
     * Get leaderboard stats
     */
    getStats() {
        return {
            currentScore: this.score,
            currentStreak: this.streak,
            bestStreak: this.bestStreak
        };
    }
}

// Export for use in main app
if (typeof window !== 'undefined') {
    window.ChartPlayground = ChartPlayground;
    window.PatternRecognitionGame = PatternRecognitionGame;
}
