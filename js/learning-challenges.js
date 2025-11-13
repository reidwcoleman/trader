// Daily and Weekly Challenges for FinClash Learning
// Keeps users engaged with fresh goals

/**
 * Challenge types and templates
 */
const ChallengeTemplates = {
    // Quiz challenges
    QUIZ_PERFECT: {
        id: 'quiz_perfect',
        title: '💯 Perfect Score',
        description: 'Score 100% on any quiz',
        xp: 100,
        category: 'quiz',
        check: (progress) => {
            const today = new Date().toDateString();
            return progress.lastQuizDate === today &&
                   Object.values(progress.dailyQuizScores || {}).some(s => s === 100);
        }
    },
    QUIZ_STREAK: {
        id: 'quiz_streak',
        title: '📝 Quiz Master',
        description: 'Complete 3 quizzes in one day',
        xp: 75,
        category: 'quiz',
        check: (progress) => (progress.todayQuizzesCompleted || 0) >= 3
    },
    QUIZ_HIGH_SCORE: {
        id: 'quiz_high_score',
        title: '⭐ High Achiever',
        description: 'Score 90%+ on any quiz',
        xp: 50,
        category: 'quiz',
        check: (progress) => {
            return Object.values(progress.dailyQuizScores || {}).some(s => s >= 90);
        }
    },

    // Lesson challenges
    LESSON_COMPLETE: {
        id: 'lesson_complete',
        title: '📚 Knowledge Seeker',
        description: 'Complete any full lesson',
        xp: 60,
        category: 'lesson',
        check: (progress) => {
            const today = new Date().toDateString();
            return progress.lastLessonDate === today;
        }
    },
    LESSON_SPEED: {
        id: 'lesson_speed',
        title: '⚡ Speed Reader',
        description: 'Complete a lesson in under 10 minutes',
        xp: 80,
        category: 'lesson',
        check: (progress) => (progress.todaySpeedLessons || 0) >= 1
    },
    LESSON_MARATHON: {
        id: 'lesson_marathon',
        title: '🏃 Learning Marathon',
        description: 'Read 5 lesson sections',
        xp: 70,
        category: 'lesson',
        check: (progress) => (progress.todayLessonsRead || 0) >= 5
    },

    // Flashcard challenges
    FLASHCARD_REVIEW: {
        id: 'flashcard_review',
        title: '🎴 Flashcard Warrior',
        description: 'Review 20 flashcards',
        xp: 50,
        category: 'flashcard',
        check: (progress) => (progress.todayFlashcardsReviewed || 0) >= 20
    },
    FLASHCARD_ACCURACY: {
        id: 'flashcard_accuracy',
        title: '🎯 Memory Master',
        description: 'Get 90%+ accuracy on 10 flashcards',
        xp: 75,
        category: 'flashcard',
        check: (progress) => {
            const correct = progress.todayFlashcardsCorrect || 0;
            const total = progress.todayFlashcardsReviewed || 0;
            return total >= 10 && (correct / total) >= 0.9;
        }
    },
    FLASHCARD_STREAK: {
        id: 'flashcard_streak',
        title: '🔥 Perfect Recall',
        description: 'Get 5 flashcards correct in a row',
        xp: 60,
        category: 'flashcard',
        check: (progress) => (progress.todayFlashcardStreak || 0) >= 5
    },

    // Calculator challenges
    CALCULATOR_USE: {
        id: 'calculator_use',
        title: '🔢 Number Cruncher',
        description: 'Use 3 different calculators',
        xp: 40,
        category: 'calculator',
        check: (progress) => (progress.todayCalculatorsUsed || 0) >= 3
    },
    CALCULATOR_EXPERT: {
        id: 'calculator_expert',
        title: '💡 Analysis Pro',
        description: 'Use 5 different calculators',
        xp: 70,
        category: 'calculator',
        check: (progress) => (progress.todayCalculatorsUsed || 0) >= 5
    },

    // Pattern challenges
    PATTERN_SPOTTER: {
        id: 'pattern_spotter',
        title: '👁️ Pattern Detective',
        description: 'Correctly identify 5 chart patterns',
        xp: 80,
        category: 'pattern',
        check: (progress) => (progress.todayPatternsCorrect || 0) >= 5
    },
    PATTERN_ACCURACY: {
        id: 'pattern_accuracy',
        title: '🎯 Eagle Eye',
        description: '100% accuracy on 3 pattern identifications',
        xp: 90,
        category: 'pattern',
        check: (progress) => {
            const correct = progress.todayPatternsCorrect || 0;
            const total = progress.todayPatternsAttempted || 0;
            return total >= 3 && correct === total;
        }
    },

    // Mixed challenges
    DAILY_TRIPLE: {
        id: 'daily_triple',
        title: '🏆 Triple Threat',
        description: 'Complete a quiz, lesson, and flashcard session',
        xp: 100,
        category: 'mixed',
        check: (progress) => {
            return (progress.todayQuizzesCompleted || 0) >= 1 &&
                   (progress.todayLessonsRead || 0) >= 1 &&
                   (progress.todayFlashcardsReviewed || 0) >= 10;
        }
    },
    XP_MILESTONE: {
        id: 'xp_milestone',
        title: '💎 XP Hunter',
        description: 'Earn 200 XP in one day',
        xp: 50,
        category: 'mixed',
        check: (progress) => (progress.todayXPEarned || 0) >= 200
    },

    // Time-based
    EARLY_BIRD: {
        id: 'early_bird',
        title: '🐦 Early Bird',
        description: 'Complete a lesson before 8 AM',
        xp: 75,
        category: 'time',
        check: (progress) => progress.todayEarlyBird === true
    },
    NIGHT_OWL: {
        id: 'night_owl',
        title: '🦉 Night Owl',
        description: 'Complete a lesson after 10 PM',
        xp: 75,
        category: 'time',
        check: (progress) => progress.todayNightOwl === true
    }
};

/**
 * Weekly Challenge Templates
 */
const WeeklyChallengeTemplates = {
    WEEK_LESSONS: {
        id: 'week_lessons',
        title: '📚 Weekly Scholar',
        description: 'Complete 5 lessons this week',
        xp: 200,
        check: (progress) => (progress.weekLessonsCompleted || 0) >= 5
    },
    WEEK_QUIZZES: {
        id: 'week_quizzes',
        title: '📝 Quiz Champion',
        description: 'Complete 10 quizzes this week',
        xp: 250,
        check: (progress) => (progress.weekQuizzesCompleted || 0) >= 10
    },
    WEEK_PERFECT: {
        id: 'week_perfect',
        title: '💯 Perfectionist',
        description: 'Score 100% on 3 quizzes this week',
        xp: 300,
        check: (progress) => (progress.weekPerfectQuizzes || 0) >= 3
    },
    WEEK_STREAK: {
        id: 'week_streak',
        title: '🔥 Seven Day Warrior',
        description: 'Complete at least one activity every day this week',
        xp: 350,
        check: (progress) => (progress.weekActiveDays || 0) >= 7
    },
    WEEK_FLASHCARDS: {
        id: 'week_flashcards',
        title: '🎴 Flashcard Master',
        description: 'Review 100 flashcards this week',
        xp: 200,
        check: (progress) => (progress.weekFlashcardsReviewed || 0) >= 100
    },
    WEEK_XP: {
        id: 'week_xp',
        title: '💎 XP Legend',
        description: 'Earn 1,000 XP this week',
        xp: 300,
        check: (progress) => (progress.weekXPEarned || 0) >= 1000
    },
    WEEK_PATTERNS: {
        id: 'week_patterns',
        title: '👁️ Pattern Expert',
        description: 'Identify 20 chart patterns this week',
        xp: 250,
        check: (progress) => (progress.weekPatternsIdentified || 0) >= 20
    }
};

/**
 * Challenge Manager Class
 */
class ChallengeManager {
    constructor(userProgress) {
        this.progress = userProgress;
        this.initializeDailyTracking();
        this.initializeWeeklyTracking();
    }

    /**
     * Initialize daily tracking (reset at midnight)
     */
    initializeDailyTracking() {
        const today = new Date().toDateString();

        if (this.progress.lastChallengeDate !== today) {
            // Reset daily counters
            this.progress.lastChallengeDate = today;
            this.progress.todayQuizzesCompleted = 0;
            this.progress.todayLessonsRead = 0;
            this.progress.todayFlashcardsReviewed = 0;
            this.progress.todayFlashcardsCorrect = 0;
            this.progress.todayFlashcardStreak = 0;
            this.progress.todayCalculatorsUsed = 0;
            this.progress.todayPatternsCorrect = 0;
            this.progress.todayPatternsAttempted = 0;
            this.progress.todayXPEarned = 0;
            this.progress.todaySpeedLessons = 0;
            this.progress.todayEarlyBird = false;
            this.progress.todayNightOwl = false;
            this.progress.dailyQuizScores = {};
            this.progress.dailyChallengesCompleted = this.progress.dailyChallengesCompleted || [];
        }
    }

    /**
     * Initialize weekly tracking (reset on Monday)
     */
    initializeWeeklyTracking() {
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
        const weekKey = weekStart.toISOString().split('T')[0];

        if (this.progress.currentWeek !== weekKey) {
            // Reset weekly counters
            this.progress.currentWeek = weekKey;
            this.progress.weekLessonsCompleted = 0;
            this.progress.weekQuizzesCompleted = 0;
            this.progress.weekPerfectQuizzes = 0;
            this.progress.weekActiveDays = 0;
            this.progress.weekFlashcardsReviewed = 0;
            this.progress.weekXPEarned = 0;
            this.progress.weekPatternsIdentified = 0;
            this.progress.weekChallengesCompleted = this.progress.weekChallengesCompleted || [];
            this.progress.weekDaysActive = {};
        }

        // Mark today as active
        const dayKey = new Date().toDateString();
        if (!this.progress.weekDaysActive[dayKey]) {
            this.progress.weekDaysActive[dayKey] = true;
            this.progress.weekActiveDays = Object.keys(this.progress.weekDaysActive).length;
        }
    }

    /**
     * Get today's challenges (3 random daily challenges)
     */
    getDailyChallenges() {
        const allChallenges = Object.values(ChallengeTemplates);

        // Deterministic daily selection based on day of year
        const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const seed = dayOfYear;

        // Select 3 challenges
        const selected = [];
        const indices = [seed % allChallenges.length,
                        (seed + 7) % allChallenges.length,
                        (seed + 13) % allChallenges.length];

        for (const idx of indices) {
            const challenge = { ...allChallenges[idx] };
            challenge.completed = this.isChallengeCompleted(challenge.id, 'daily');
            challenge.progress = this.getChallengeProgress(challenge);
            selected.push(challenge);
        }

        return selected;
    }

    /**
     * Get this week's challenges
     */
    getWeeklyChallenges() {
        const allChallenges = Object.values(WeeklyChallengeTemplates);

        // Week-based selection
        const weekNum = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7));
        const seed = weekNum;

        // Select 3 weekly challenges
        const selected = [];
        const indices = [seed % allChallenges.length,
                        (seed + 3) % allChallenges.length,
                        (seed + 5) % allChallenges.length];

        for (const idx of indices) {
            const challenge = { ...allChallenges[idx] };
            challenge.completed = this.isChallengeCompleted(challenge.id, 'weekly');
            challenge.progress = this.getWeeklyChallengeProgress(challenge);
            selected.push(challenge);
        }

        return selected;
    }

    /**
     * Check if challenge is completed
     */
    isChallengeCompleted(challengeId, type = 'daily') {
        const completedList = type === 'daily'
            ? this.progress.dailyChallengesCompleted || []
            : this.progress.weekChallengesCompleted || [];

        return completedList.includes(challengeId);
    }

    /**
     * Get challenge progress (percentage)
     */
    getChallengeProgress(challenge) {
        switch (challenge.id) {
            case 'quiz_streak':
                return Math.min(100, ((this.progress.todayQuizzesCompleted || 0) / 3) * 100);
            case 'flashcard_review':
                return Math.min(100, ((this.progress.todayFlashcardsReviewed || 0) / 20) * 100);
            case 'pattern_spotter':
                return Math.min(100, ((this.progress.todayPatternsCorrect || 0) / 5) * 100);
            case 'calculator_use':
                return Math.min(100, ((this.progress.todayCalculatorsUsed || 0) / 3) * 100);
            case 'lesson_marathon':
                return Math.min(100, ((this.progress.todayLessonsRead || 0) / 5) * 100);
            default:
                return challenge.check(this.progress) ? 100 : 0;
        }
    }

    /**
     * Get weekly challenge progress
     */
    getWeeklyChallengeProgress(challenge) {
        switch (challenge.id) {
            case 'week_lessons':
                return Math.min(100, ((this.progress.weekLessonsCompleted || 0) / 5) * 100);
            case 'week_quizzes':
                return Math.min(100, ((this.progress.weekQuizzesCompleted || 0) / 10) * 100);
            case 'week_perfect':
                return Math.min(100, ((this.progress.weekPerfectQuizzes || 0) / 3) * 100);
            case 'week_flashcards':
                return Math.min(100, ((this.progress.weekFlashcardsReviewed || 0) / 100) * 100);
            case 'week_patterns':
                return Math.min(100, ((this.progress.weekPatternsIdentified || 0) / 20) * 100);
            case 'week_xp':
                return Math.min(100, ((this.progress.weekXPEarned || 0) / 1000) * 100);
            case 'week_streak':
                return Math.min(100, ((this.progress.weekActiveDays || 0) / 7) * 100);
            default:
                return challenge.check(this.progress) ? 100 : 0;
        }
    }

    /**
     * Check and complete challenges
     */
    checkChallenges() {
        const completed = [];

        // Check daily challenges
        const dailyChallenges = this.getDailyChallenges();
        for (const challenge of dailyChallenges) {
            if (!challenge.completed && challenge.check(this.progress)) {
                this.completeChallenge(challenge.id, 'daily', challenge.xp);
                completed.push({ ...challenge, type: 'daily' });
            }
        }

        // Check weekly challenges
        const weeklyChallenges = this.getWeeklyChallenges();
        for (const challenge of weeklyChallenges) {
            if (!challenge.completed && challenge.check(this.progress)) {
                this.completeChallenge(challenge.id, 'weekly', challenge.xp);
                completed.push({ ...challenge, type: 'weekly' });
            }
        }

        return completed;
    }

    /**
     * Mark challenge as completed
     */
    completeChallenge(challengeId, type, xp) {
        const completedList = type === 'daily'
            ? 'dailyChallengesCompleted'
            : 'weekChallengesCompleted';

        if (!this.progress[completedList]) {
            this.progress[completedList] = [];
        }

        if (!this.progress[completedList].includes(challengeId)) {
            this.progress[completedList].push(challengeId);

            // Award XP
            this.progress.totalXP = (this.progress.totalXP || 0) + xp;
            this.progress.todayXPEarned = (this.progress.todayXPEarned || 0) + xp;
            this.progress.weekXPEarned = (this.progress.weekXPEarned || 0) + xp;

            // Track challenge completion achievement
            const totalChallenges = (this.progress.dailyChallengesCompleted || []).length +
                                  (this.progress.weekChallengesCompleted || []).length;
            this.progress.totalChallengesCompleted = totalChallenges;
        }
    }
}

// Export
if (typeof window !== 'undefined') {
    window.LearningChallenges = {
        ChallengeTemplates,
        WeeklyChallengeTemplates,
        ChallengeManager
    };
}
