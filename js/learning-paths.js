// Learning Paths System for FinClash Learning Tab
// Structured progression: Beginner → Intermediate → Advanced

/**
 * Learning Path Structure
 * Each path contains ordered modules with lessons, quizzes, and activities
 */

const LearningPaths = {
    BEGINNER: {
        id: 'beginner',
        title: '🌱 Beginner Path',
        description: 'Start your trading journey. Learn the fundamentals of stocks, markets, and basic strategies.',
        estimatedTime: '8-12 hours',
        targetLevel: '1-3',
        color: '#4CAF50',
        modules: [
            {
                id: 'stocks-101',
                title: 'Stock Market Basics',
                description: 'What are stocks? How does the market work?',
                lessons: [
                    { id: 'what-is-stock', title: 'What is a Stock?', duration: 10, xp: 50 },
                    { id: 'how-markets-work', title: 'How Stock Markets Work', duration: 15, xp: 75 },
                    { id: 'buying-selling', title: 'Buying and Selling Stocks', duration: 12, xp: 60 }
                ],
                quiz: { topic: 'basics', requiredScore: 70, xp: 100 },
                activities: [
                    { type: 'flashcard', count: 10, category: 'basics', xp: 50 },
                    { type: 'calculator', tool: 'market-cap', xp: 30 }
                ],
                unlockRequirement: null // Available from start
            },
            {
                id: 'reading-charts',
                title: 'Reading Stock Charts',
                description: 'Understand candlesticks, volume, and basic chart patterns.',
                lessons: [
                    { id: 'candlesticks', title: 'Candlestick Basics', duration: 15, xp: 75 },
                    { id: 'volume', title: 'Understanding Volume', duration: 10, xp: 50 },
                    { id: 'trends', title: 'Identifying Trends', duration: 12, xp: 60 }
                ],
                quiz: { topic: 'technical', requiredScore: 70, xp: 100 },
                activities: [
                    { type: 'pattern', mode: 'identify', count: 5, xp: 80 },
                    { type: 'flashcard', count: 10, category: 'technical', xp: 50 }
                ],
                unlockRequirement: { module: 'stocks-101', completion: 100 }
            },
            {
                id: 'basic-risk',
                title: 'Risk Management 101',
                description: 'Protect your capital with stop-losses and position sizing.',
                lessons: [
                    { id: 'position-sizing', title: 'Position Sizing', duration: 15, xp: 75 },
                    { id: 'stop-loss', title: 'Using Stop-Losses', duration: 12, xp: 60 },
                    { id: 'risk-reward', title: 'Risk/Reward Ratios', duration: 10, xp: 50 }
                ],
                quiz: { topic: 'risk', requiredScore: 80, xp: 120 },
                activities: [
                    { type: 'calculator', tool: 'position-size', xp: 40 },
                    { type: 'flashcard', count: 8, category: 'risk', xp: 40 }
                ],
                unlockRequirement: { module: 'reading-charts', completion: 100 }
            },
            {
                id: 'first-trades',
                title: 'Making Your First Trades',
                description: 'Execute virtual trades and apply what you\'ve learned.',
                lessons: [
                    { id: 'order-types', title: 'Order Types Explained', duration: 12, xp: 60 },
                    { id: 'trade-execution', title: 'Executing Trades', duration: 10, xp: 50 },
                    { id: 'tracking-performance', title: 'Tracking Performance', duration: 8, xp: 40 }
                ],
                quiz: { topic: 'basics', requiredScore: 75, xp: 100 },
                activities: [
                    { type: 'simulator', action: 'place-5-trades', xp: 100 },
                    { type: 'challenge', challenge: 'first-profit', xp: 80 }
                ],
                unlockRequirement: { module: 'basic-risk', completion: 100 }
            }
        ]
    },

    INTERMEDIATE: {
        id: 'intermediate',
        title: '📈 Intermediate Path',
        description: 'Master technical analysis, advanced patterns, and sophisticated strategies.',
        estimatedTime: '15-20 hours',
        targetLevel: '4-6',
        color: '#2196F3',
        modules: [
            {
                id: 'technical-indicators',
                title: 'Technical Indicators',
                description: 'RSI, MACD, Bollinger Bands, and moving averages.',
                lessons: [
                    { id: 'rsi', title: 'RSI (Relative Strength Index)', duration: 15, xp: 100 },
                    { id: 'macd', title: 'MACD Indicator', duration: 15, xp: 100 },
                    { id: 'bollinger', title: 'Bollinger Bands', duration: 12, xp: 80 },
                    { id: 'moving-averages', title: 'Moving Averages Strategy', duration: 15, xp: 100 }
                ],
                quiz: { topic: 'technical', requiredScore: 75, xp: 150 },
                activities: [
                    { type: 'pattern', mode: 'identify', count: 10, xp: 120 },
                    { type: 'flashcard', count: 15, category: 'technical', xp: 75 },
                    { type: 'simulator', action: 'indicator-trades', xp: 150 }
                ],
                unlockRequirement: { path: 'beginner', completion: 100 }
            },
            {
                id: 'chart-patterns',
                title: 'Advanced Chart Patterns',
                description: 'Bull flags, head & shoulders, double tops/bottoms.',
                lessons: [
                    { id: 'continuation', title: 'Continuation Patterns', duration: 18, xp: 120 },
                    { id: 'reversal', title: 'Reversal Patterns', duration: 18, xp: 120 },
                    { id: 'pattern-trading', title: 'Trading Patterns Profitably', duration: 15, xp: 100 }
                ],
                quiz: { topic: 'patterns', requiredScore: 80, xp: 150 },
                activities: [
                    { type: 'pattern', mode: 'identify', count: 15, xp: 150 },
                    { type: 'pattern', mode: 'draw', count: 5, xp: 100 },
                    { type: 'pattern', mode: 'predict', count: 10, xp: 120 }
                ],
                unlockRequirement: { module: 'technical-indicators', completion: 100 }
            },
            {
                id: 'support-resistance',
                title: 'Support & Resistance Mastery',
                description: 'Identify key levels and trade breakouts/breakdowns.',
                lessons: [
                    { id: 'finding-levels', title: 'Finding Key Levels', duration: 15, xp: 100 },
                    { id: 'fibonacci', title: 'Fibonacci Retracements', duration: 18, xp: 120 },
                    { id: 'breakout-strategy', title: 'Breakout Trading', duration: 15, xp: 100 }
                ],
                quiz: { topic: 'technical', requiredScore: 80, xp: 150 },
                activities: [
                    { type: 'calculator', tool: 'fibonacci', xp: 60 },
                    { type: 'pattern', mode: 'draw', count: 8, xp: 120 },
                    { type: 'simulator', action: 'breakout-trades', xp: 150 }
                ],
                unlockRequirement: { module: 'chart-patterns', completion: 100 }
            },
            {
                id: 'advanced-risk',
                title: 'Advanced Risk Management',
                description: 'Portfolio diversification, correlation, and hedging.',
                lessons: [
                    { id: 'diversification', title: 'Portfolio Diversification', duration: 15, xp: 100 },
                    { id: 'correlation', title: 'Stock Correlation', duration: 12, xp: 80 },
                    { id: 'kelly-criterion', title: 'Kelly Criterion', duration: 18, xp: 120 }
                ],
                quiz: { topic: 'risk', requiredScore: 85, xp: 180 },
                activities: [
                    { type: 'calculator', tool: 'diversification', xp: 80 },
                    { type: 'flashcard', count: 12, category: 'risk', xp: 60 },
                    { type: 'simulator', action: 'diversified-portfolio', xp: 150 }
                ],
                unlockRequirement: { module: 'support-resistance', completion: 100 }
            }
        ]
    },

    ADVANCED: {
        id: 'advanced',
        title: '🚀 Advanced Path',
        description: 'Options trading, margin, shorting, and professional-level strategies.',
        estimatedTime: '20-30 hours',
        targetLevel: '7-10',
        color: '#9C27B0',
        modules: [
            {
                id: 'options-basics',
                title: 'Options Trading Fundamentals',
                description: 'Calls, puts, and basic options strategies.',
                lessons: [
                    { id: 'options-intro', title: 'Introduction to Options', duration: 20, xp: 150 },
                    { id: 'calls-puts', title: 'Calls vs Puts', duration: 18, xp: 120 },
                    { id: 'strike-expiration', title: 'Strike Price & Expiration', duration: 15, xp: 100 },
                    { id: 'intrinsic-extrinsic', title: 'Intrinsic vs Extrinsic Value', duration: 18, xp: 120 }
                ],
                quiz: { topic: 'options', requiredScore: 80, xp: 200 },
                activities: [
                    { type: 'calculator', tool: 'options-profit-loss', xp: 100 },
                    { type: 'flashcard', count: 20, category: 'options', xp: 100 },
                    { type: 'simulator', action: 'options-trades', xp: 200 }
                ],
                unlockRequirement: { path: 'intermediate', completion: 100 }
            },
            {
                id: 'options-greeks',
                title: 'Options Greeks',
                description: 'Delta, gamma, theta, vega - master options pricing.',
                lessons: [
                    { id: 'delta', title: 'Delta (Price Sensitivity)', duration: 20, xp: 150 },
                    { id: 'gamma', title: 'Gamma (Delta Acceleration)', duration: 18, xp: 120 },
                    { id: 'theta', title: 'Theta (Time Decay)', duration: 18, xp: 120 },
                    { id: 'vega', title: 'Vega (Volatility Sensitivity)', duration: 18, xp: 120 }
                ],
                quiz: { topic: 'options', requiredScore: 85, xp: 250 },
                activities: [
                    { type: 'calculator', tool: 'options-greeks', xp: 120 },
                    { type: 'flashcard', count: 15, category: 'greeks', xp: 80 },
                    { type: 'simulator', action: 'greeks-analysis', xp: 200 }
                ],
                unlockRequirement: { module: 'options-basics', completion: 100 }
            },
            {
                id: 'shorting',
                title: 'Short Selling & Margin',
                description: 'Profit from falling stocks and use leverage wisely.',
                lessons: [
                    { id: 'short-intro', title: 'Introduction to Shorting', duration: 18, xp: 120 },
                    { id: 'short-mechanics', title: 'How Shorting Works', duration: 20, xp: 150 },
                    { id: 'margin-trading', title: 'Trading on Margin', duration: 20, xp: 150 },
                    { id: 'margin-calls', title: 'Avoiding Margin Calls', duration: 15, xp: 100 }
                ],
                quiz: { topic: 'shorting', requiredScore: 85, xp: 250 },
                activities: [
                    { type: 'calculator', tool: 'margin', xp: 100 },
                    { type: 'flashcard', count: 15, category: 'shorting', xp: 80 },
                    { type: 'simulator', action: 'short-trades', xp: 200 }
                ],
                unlockRequirement: { module: 'options-greeks', completion: 100 }
            },
            {
                id: 'advanced-strategies',
                title: 'Professional Strategies',
                description: 'Spreads, straddles, iron condors, and more.',
                lessons: [
                    { id: 'spreads', title: 'Vertical Spreads', duration: 22, xp: 180 },
                    { id: 'straddles', title: 'Straddles & Strangles', duration: 20, xp: 150 },
                    { id: 'iron-condor', title: 'Iron Condor Strategy', duration: 22, xp: 180 },
                    { id: 'covered-calls', title: 'Covered Calls', duration: 18, xp: 120 }
                ],
                quiz: { topic: 'options', requiredScore: 90, xp: 300 },
                activities: [
                    { type: 'calculator', tool: 'strategy-builder', xp: 150 },
                    { type: 'simulator', action: 'advanced-strategies', xp: 250 },
                    { type: 'challenge', challenge: 'strategy-master', xp: 200 }
                ],
                unlockRequirement: { module: 'shorting', completion: 100 }
            },
            {
                id: 'psychology',
                title: 'Trading Psychology',
                description: 'Master emotions, discipline, and the mental game.',
                lessons: [
                    { id: 'emotional-control', title: 'Emotional Control', duration: 15, xp: 100 },
                    { id: 'discipline', title: 'Trading Discipline', duration: 15, xp: 100 },
                    { id: 'bias', title: 'Cognitive Biases', duration: 18, xp: 120 },
                    { id: 'journaling', title: 'Trade Journaling', duration: 12, xp: 80 }
                ],
                quiz: { topic: 'psychology', requiredScore: 85, xp: 200 },
                activities: [
                    { type: 'flashcard', count: 20, category: 'psychology', xp: 100 },
                    { type: 'simulator', action: 'psychology-test', xp: 150 },
                    { type: 'challenge', challenge: 'disciplined-trader', xp: 200 }
                ],
                unlockRequirement: { module: 'advanced-strategies', completion: 100 }
            }
        ]
    }
};

/**
 * Learning Path Manager
 * Tracks user progress through learning paths
 */
class LearningPathManager {
    constructor(userProgress) {
        this.userProgress = userProgress || {};
        this.currentPath = this.userProgress.currentPath || null;
        this.pathProgress = this.userProgress.pathProgress || {};
    }

    /**
     * Get all available paths
     */
    getAllPaths() {
        return Object.values(LearningPaths);
    }

    /**
     * Get specific path
     */
    getPath(pathId) {
        return LearningPaths[pathId.toUpperCase()];
    }

    /**
     * Check if path is unlocked
     */
    isPathUnlocked(pathId) {
        const path = this.getPath(pathId);
        if (!path) return false;

        // Beginner always unlocked
        if (pathId === 'beginner') return true;

        // Check unlock requirements
        const firstModule = path.modules[0];
        if (!firstModule.unlockRequirement) return true;

        const { path: requiredPath, completion } = firstModule.unlockRequirement;
        return this.getPathCompletion(requiredPath) >= completion;
    }

    /**
     * Check if module is unlocked
     */
    isModuleUnlocked(pathId, moduleId) {
        const path = this.getPath(pathId);
        if (!path) return false;

        const module = path.modules.find(m => m.id === moduleId);
        if (!module) return false;

        // No requirement = unlocked
        if (!module.unlockRequirement) return true;

        const { module: requiredModule, completion } = module.unlockRequirement;
        return this.getModuleCompletion(pathId, requiredModule) >= completion;
    }

    /**
     * Get path completion percentage
     */
    getPathCompletion(pathId) {
        const path = this.getPath(pathId);
        if (!path) return 0;

        const totalModules = path.modules.length;
        let completedWeight = 0;

        path.modules.forEach(module => {
            const completion = this.getModuleCompletion(pathId, module.id);
            completedWeight += completion / 100;
        });

        return Math.round((completedWeight / totalModules) * 100);
    }

    /**
     * Get module completion percentage
     */
    getModuleCompletion(pathId, moduleId) {
        const key = `${pathId}_${moduleId}`;
        if (!this.pathProgress[key]) return 0;

        const progress = this.pathProgress[key];
        const totalItems = this.getModuleTotalItems(pathId, moduleId);
        const completedItems = progress.completedItems || [];

        return Math.round((completedItems.length / totalItems) * 100);
    }

    /**
     * Get total items in module
     */
    getModuleTotalItems(pathId, moduleId) {
        const path = this.getPath(pathId);
        const module = path.modules.find(m => m.id === moduleId);
        if (!module) return 0;

        let total = 0;
        total += module.lessons.length;
        total += 1; // Quiz
        total += module.activities.length;

        return total;
    }

    /**
     * Mark item as completed
     */
    completeItem(pathId, moduleId, itemType, itemId) {
        const key = `${pathId}_${moduleId}`;
        if (!this.pathProgress[key]) {
            this.pathProgress[key] = { completedItems: [] };
        }

        const itemKey = `${itemType}_${itemId}`;
        if (!this.pathProgress[key].completedItems.includes(itemKey)) {
            this.pathProgress[key].completedItems.push(itemKey);
        }

        // Check if module is now complete
        const completion = this.getModuleCompletion(pathId, moduleId);
        if (completion === 100) {
            this.onModuleComplete(pathId, moduleId);
        }

        return {
            moduleCompletion: completion,
            pathCompletion: this.getPathCompletion(pathId)
        };
    }

    /**
     * Handle module completion
     */
    onModuleComplete(pathId, moduleId) {
        // Award completion XP
        const completionXP = 200;

        // Check if next module unlocked
        const path = this.getPath(pathId);
        const moduleIndex = path.modules.findIndex(m => m.id === moduleId);
        const nextModule = path.modules[moduleIndex + 1];

        const result = {
            completed: true,
            xp: completionXP,
            nextModule: nextModule ? nextModule.id : null,
            pathComplete: this.getPathCompletion(pathId) === 100
        };

        if (result.pathComplete) {
            this.onPathComplete(pathId);
        }

        return result;
    }

    /**
     * Handle path completion
     */
    onPathComplete(pathId) {
        const path = this.getPath(pathId);
        const bonusXP = 500;

        return {
            completed: true,
            path: pathId,
            title: path.title,
            xp: bonusXP,
            nextPath: this.getNextPath(pathId)
        };
    }

    /**
     * Get next recommended path
     */
    getNextPath(currentPathId) {
        const order = ['beginner', 'intermediate', 'advanced'];
        const currentIndex = order.indexOf(currentPathId);

        if (currentIndex === -1 || currentIndex === order.length - 1) {
            return null;
        }

        return order[currentIndex + 1];
    }

    /**
     * Get current active module
     */
    getCurrentModule(pathId) {
        const path = this.getPath(pathId);
        if (!path) return null;

        // Find first incomplete module
        for (const module of path.modules) {
            if (this.getModuleCompletion(pathId, module.id) < 100) {
                return module;
            }
        }

        // All complete
        return null;
    }

    /**
     * Get recommended next activity
     */
    getNextActivity(pathId, moduleId) {
        const key = `${pathId}_${moduleId}`;
        const progress = this.pathProgress[key] || { completedItems: [] };
        const path = this.getPath(pathId);
        const module = path.modules.find(m => m.id === moduleId);

        if (!module) return null;

        // Check lessons first
        for (const lesson of module.lessons) {
            if (!progress.completedItems.includes(`lesson_${lesson.id}`)) {
                return { type: 'lesson', data: lesson };
            }
        }

        // Then quiz
        if (!progress.completedItems.includes(`quiz_${module.quiz.topic}`)) {
            return { type: 'quiz', data: module.quiz };
        }

        // Then activities
        for (let i = 0; i < module.activities.length; i++) {
            const activity = module.activities[i];
            if (!progress.completedItems.includes(`activity_${i}`)) {
                return { type: 'activity', data: activity };
            }
        }

        return null;
    }

    /**
     * Get path statistics
     */
    getPathStats(pathId) {
        const path = this.getPath(pathId);
        if (!path) return null;

        const totalXP = this.calculateTotalXP(path);
        const earnedXP = this.calculateEarnedXP(pathId);
        const completion = this.getPathCompletion(pathId);

        return {
            pathId,
            title: path.title,
            completion,
            totalXP,
            earnedXP,
            modulesCompleted: path.modules.filter(m => this.getModuleCompletion(pathId, m.id) === 100).length,
            totalModules: path.modules.length,
            estimatedTime: path.estimatedTime,
            unlocked: this.isPathUnlocked(pathId)
        };
    }

    /**
     * Calculate total XP available in path
     */
    calculateTotalXP(path) {
        let total = 0;

        path.modules.forEach(module => {
            // Lessons
            module.lessons.forEach(lesson => total += lesson.xp);
            // Quiz
            total += module.quiz.xp;
            // Activities
            module.activities.forEach(activity => total += activity.xp);
            // Module completion bonus
            total += 200;
        });

        // Path completion bonus
        total += 500;

        return total;
    }

    /**
     * Calculate earned XP in path
     */
    calculateEarnedXP(pathId) {
        const path = this.getPath(pathId);
        let earned = 0;

        path.modules.forEach(module => {
            const key = `${pathId}_${module.id}`;
            const progress = this.pathProgress[key];
            if (!progress) return;

            // Count completed items
            progress.completedItems.forEach(itemKey => {
                const [type, id] = itemKey.split('_');

                if (type === 'lesson') {
                    const lesson = module.lessons.find(l => l.id === id);
                    if (lesson) earned += lesson.xp;
                } else if (type === 'quiz') {
                    earned += module.quiz.xp;
                } else if (type === 'activity') {
                    const activity = module.activities[parseInt(id)];
                    if (activity) earned += activity.xp;
                }
            });

            // Module completion bonus
            if (this.getModuleCompletion(pathId, module.id) === 100) {
                earned += 200;
            }
        });

        // Path completion bonus
        if (this.getPathCompletion(pathId) === 100) {
            earned += 500;
        }

        return earned;
    }

    /**
     * Get user's overall learning stats
     */
    getOverallStats() {
        const paths = ['beginner', 'intermediate', 'advanced'];
        const stats = {
            totalXP: 0,
            earnedXP: 0,
            pathsCompleted: 0,
            modulesCompleted: 0,
            totalModules: 0,
            currentPath: this.currentPath,
            pathStats: {}
        };

        paths.forEach(pathId => {
            const pathStats = this.getPathStats(pathId);
            stats.pathStats[pathId] = pathStats;

            stats.totalXP += pathStats.totalXP;
            stats.earnedXP += pathStats.earnedXP;
            stats.totalModules += pathStats.totalModules;
            stats.modulesCompleted += pathStats.modulesCompleted;

            if (pathStats.completion === 100) {
                stats.pathsCompleted++;
            }
        });

        stats.overallCompletion = stats.totalModules > 0
            ? Math.round((stats.modulesCompleted / stats.totalModules) * 100)
            : 0;

        return stats;
    }

    /**
     * Set active path
     */
    setCurrentPath(pathId) {
        this.currentPath = pathId;
        this.userProgress.currentPath = pathId;
    }

    /**
     * Save progress
     */
    saveProgress() {
        this.userProgress.pathProgress = this.pathProgress;
        return this.userProgress;
    }
}

// Export
if (typeof window !== 'undefined') {
    window.LearningPaths = {
        LearningPaths,
        LearningPathManager
    };
}
