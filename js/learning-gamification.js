// Learning Gamification System for FinClash
// XP, Achievements, Badges, Streaks, and Leveling

/**
 * Achievement definitions with unlock conditions
 */
const ACHIEVEMENTS = {
    // Beginner Achievements
    first_lesson: {
        id: 'first_lesson',
        name: '🌱 First Steps',
        description: 'Complete your first lesson',
        icon: '🌱',
        rarity: 'common',
        xp: 50,
        condition: (progress) => progress.completedLessons.length >= 1
    },
    first_quiz: {
        id: 'first_quiz',
        name: '📝 Quiz Taker',
        description: 'Complete your first quiz',
        icon: '📝',
        rarity: 'common',
        xp: 50,
        condition: (progress) => Object.keys(progress.quizScores).length >= 1
    },
    perfect_score: {
        id: 'perfect_score',
        name: '💯 Perfectionist',
        description: 'Score 100% on any quiz',
        icon: '💯',
        rarity: 'rare',
        xp: 100,
        condition: (progress) => Object.values(progress.quizScores).some(score => score === 100)
    },

    // Streak Achievements
    streak_3: {
        id: 'streak_3',
        name: '🔥 Getting Warm',
        description: '3-day learning streak',
        icon: '🔥',
        rarity: 'common',
        xp: 75,
        condition: (progress) => progress.streak >= 3
    },
    streak_7: {
        id: 'streak_7',
        name: '🔥 On Fire',
        description: '7-day learning streak',
        icon: '🔥',
        rarity: 'rare',
        xp: 150,
        condition: (progress) => progress.streak >= 7
    },
    streak_30: {
        id: 'streak_30',
        name: '🔥 Unstoppable',
        description: '30-day learning streak',
        icon: '🔥',
        rarity: 'epic',
        xp: 500,
        condition: (progress) => progress.streak >= 30
    },

    // Completion Achievements
    basics_master: {
        id: 'basics_master',
        name: '📚 Basics Master',
        description: 'Complete Trading Basics topic',
        icon: '📚',
        rarity: 'common',
        xp: 100,
        condition: (progress) => progress.completedLessons.includes('basics')
    },
    strategy_expert: {
        id: 'strategy_expert',
        name: '🎯 Strategy Expert',
        description: 'Complete Trading Strategies topic',
        icon: '🎯',
        rarity: 'common',
        xp: 100,
        condition: (progress) => progress.completedLessons.includes('strategies')
    },
    risk_manager: {
        id: 'risk_manager',
        name: '🛡️ Risk Manager',
        description: 'Complete Risk Management topic',
        icon: '🛡️',
        rarity: 'common',
        xp: 100,
        condition: (progress) => progress.completedLessons.includes('risk')
    },
    calculator_pro: {
        id: 'calculator_pro',
        name: '🧮 Calculator Pro',
        description: 'Use all calculators',
        icon: '🧮',
        rarity: 'rare',
        xp: 150,
        condition: (progress) => progress.completedLessons.includes('calculators')
    },
    pattern_master: {
        id: 'pattern_master',
        name: '📊 Pattern Master',
        description: 'Master chart patterns',
        icon: '📊',
        rarity: 'rare',
        xp: 150,
        condition: (progress) => progress.completedLessons.includes('patterns')
    },
    all_complete: {
        id: 'all_complete',
        name: '🎓 Scholar',
        description: 'Complete all 6 main topics',
        icon: '🎓',
        rarity: 'epic',
        xp: 300,
        condition: (progress) => progress.completedLessons.length >= 6
    },

    // Quiz Performance Achievements
    quiz_ace: {
        id: 'quiz_ace',
        name: '🌟 Quiz Ace',
        description: 'Score 90%+ average on all quizzes',
        icon: '🌟',
        rarity: 'rare',
        xp: 200,
        condition: (progress) => {
            const scores = Object.values(progress.quizScores);
            if (scores.length === 0) return false;
            const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
            return avg >= 90;
        }
    },
    quiz_genius: {
        id: 'quiz_genius',
        name: '🧠 Genius',
        description: 'Score 100% on all quizzes',
        icon: '🧠',
        rarity: 'legendary',
        xp: 500,
        condition: (progress) => {
            const scores = Object.values(progress.quizScores);
            return scores.length >= 6 && scores.every(score => score === 100);
        }
    },

    // Speed Achievements
    speed_learner: {
        id: 'speed_learner',
        name: '⚡ Speed Learner',
        description: 'Complete a lesson in under 10 minutes',
        icon: '⚡',
        rarity: 'rare',
        xp: 100,
        condition: (progress) => progress.speedLearns >= 1
    },

    // XP Milestones
    xp_100: {
        id: 'xp_100',
        name: '💎 Apprentice',
        description: 'Earn 100 total XP',
        icon: '💎',
        rarity: 'common',
        xp: 0,
        condition: (progress) => progress.totalXP >= 100
    },
    xp_500: {
        id: 'xp_500',
        name: '💎 Skilled Trader',
        description: 'Earn 500 total XP',
        icon: '💎',
        rarity: 'rare',
        xp: 0,
        condition: (progress) => progress.totalXP >= 500
    },
    xp_1000: {
        id: 'xp_1000',
        name: '💎 Master Trader',
        description: 'Earn 1,000 total XP',
        icon: '💎',
        rarity: 'epic',
        xp: 0,
        condition: (progress) => progress.totalXP >= 1000
    },
    xp_2000: {
        id: 'xp_2000',
        name: '💎 Elite Trader',
        description: 'Earn 2,000 total XP',
        icon: '💎',
        rarity: 'legendary',
        xp: 0,
        condition: (progress) => progress.totalXP >= 2000
    },

    // Calculator Usage
    calculator_novice: {
        id: 'calculator_novice',
        name: '🔢 Calculator Novice',
        description: 'Use a calculator 10 times',
        icon: '🔢',
        rarity: 'common',
        xp: 50,
        condition: (progress) => (progress.calculatorUses || 0) >= 10
    },
    calculator_expert: {
        id: 'calculator_expert',
        name: '🔢 Calculator Expert',
        description: 'Use calculators 50 times',
        icon: '🔢',
        rarity: 'rare',
        xp: 150,
        condition: (progress) => (progress.calculatorUses || 0) >= 50
    },

    // Pattern Recognition
    pattern_spotter: {
        id: 'pattern_spotter',
        name: '👁️ Pattern Spotter',
        description: 'Correctly identify 10 chart patterns',
        icon: '👁️',
        rarity: 'rare',
        xp: 150,
        condition: (progress) => (progress.patternsIdentified || 0) >= 10
    },
    pattern_expert: {
        id: 'pattern_expert',
        name: '👁️ Pattern Expert',
        description: 'Correctly identify 50 chart patterns',
        icon: '👁️',
        rarity: 'epic',
        xp: 300,
        condition: (progress) => (progress.patternsIdentified || 0) >= 50
    },

    // Daily Challenges
    daily_warrior: {
        id: 'daily_warrior',
        name: '⚔️ Daily Warrior',
        description: 'Complete 10 daily challenges',
        icon: '⚔️',
        rarity: 'rare',
        xp: 150,
        condition: (progress) => (progress.dailyChallengesCompleted || 0) >= 10
    },
    challenge_champion: {
        id: 'challenge_champion',
        name: '⚔️ Challenge Champion',
        description: 'Complete 50 daily challenges',
        icon: '⚔️',
        rarity: 'epic',
        xp: 400,
        condition: (progress) => (progress.dailyChallengesCompleted || 0) >= 50
    },

    // Knowledge Sharing
    flashcard_rookie: {
        id: 'flashcard_rookie',
        name: '🎴 Flashcard Rookie',
        description: 'Review 50 flashcards',
        icon: '🎴',
        rarity: 'common',
        xp: 50,
        condition: (progress) => (progress.flashcardsReviewed || 0) >= 50
    },
    flashcard_master: {
        id: 'flashcard_master',
        name: '🎴 Flashcard Master',
        description: 'Review 500 flashcards',
        icon: '🎴',
        rarity: 'rare',
        xp: 200,
        condition: (progress) => (progress.flashcardsReviewed || 0) >= 500
    },

    // Special Achievements
    night_owl: {
        id: 'night_owl',
        name: '🦉 Night Owl',
        description: 'Complete a lesson after midnight',
        icon: '🦉',
        rarity: 'rare',
        xp: 100,
        condition: (progress) => progress.nightOwlLearns >= 1
    },
    early_bird: {
        id: 'early_bird',
        name: '🐦 Early Bird',
        description: 'Complete a lesson before 6 AM',
        icon: '🐦',
        rarity: 'rare',
        xp: 100,
        condition: (progress) => progress.earlyBirdLearns >= 1
    },
    comeback_kid: {
        id: 'comeback_kid',
        name: '💪 Comeback Kid',
        description: 'Score 100% after failing a quiz',
        icon: '💪',
        rarity: 'rare',
        xp: 150,
        condition: (progress) => progress.comebackWins >= 1
    }
};

/**
 * Level system with titles
 */
const LEVEL_SYSTEM = {
    1: { title: 'Beginner', xpRequired: 0, color: 'gray' },
    2: { title: 'Learner', xpRequired: 100, color: 'green' },
    3: { title: 'Student', xpRequired: 200, color: 'blue' },
    4: { title: 'Trader', xpRequired: 400, color: 'purple' },
    5: { title: 'Skilled', xpRequired: 700, color: 'pink' },
    6: { title: 'Advanced', xpRequired: 1000, color: 'orange' },
    7: { title: 'Expert', xpRequired: 1500, color: 'yellow' },
    8: { title: 'Master', xpRequired: 2000, color: 'cyan' },
    9: { title: 'Elite', xpRequired: 3000, color: 'purple' },
    10: { title: 'Legend', xpRequired: 5000, color: 'gold' }
};

/**
 * Calculate current level from XP
 */
function calculateLevel(totalXP) {
    let level = 1;
    for (let lvl = 10; lvl >= 1; lvl--) {
        if (totalXP >= LEVEL_SYSTEM[lvl].xpRequired) {
            level = lvl;
            break;
        }
    }
    return level;
}

/**
 * Get XP needed for next level
 */
function getXPForNextLevel(currentLevel) {
    if (currentLevel >= 10) return 0;
    return LEVEL_SYSTEM[currentLevel + 1].xpRequired;
}

/**
 * Check for newly unlocked achievements
 */
function checkAchievements(progress) {
    const newlyUnlocked = [];

    for (const [id, achievement] of Object.entries(ACHIEVEMENTS)) {
        // Skip if already unlocked
        if (progress.achievements.includes(id)) continue;

        // Check condition
        if (achievement.condition(progress)) {
            newlyUnlocked.push(achievement);
        }
    }

    return newlyUnlocked;
}

/**
 * Award XP and check for level ups
 */
function awardXP(progress, amount, reason = '') {
    const oldLevel = calculateLevel(progress.totalXP);
    progress.totalXP += amount;
    const newLevel = calculateLevel(progress.totalXP);

    const result = {
        xpAwarded: amount,
        totalXP: progress.totalXP,
        oldLevel,
        newLevel,
        leveledUp: newLevel > oldLevel,
        reason
    };

    return result;
}

/**
 * Update learning streak
 */
function updateStreak(progress) {
    const today = new Date().toDateString();
    const lastActivity = progress.lastActivityDate;

    if (!lastActivity) {
        // First activity
        progress.streak = 1;
        progress.lastActivityDate = today;
        progress.longestStreak = 1;
        return { streakContinued: true, streakBroken: false };
    }

    const lastDate = new Date(lastActivity);
    const todayDate = new Date(today);
    const daysDiff = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

    if (daysDiff === 0) {
        // Same day - no change
        return { streakContinued: false, streakBroken: false };
    } else if (daysDiff === 1) {
        // Next day - continue streak
        progress.streak += 1;
        progress.lastActivityDate = today;
        if (progress.streak > progress.longestStreak) {
            progress.longestStreak = progress.streak;
        }
        return { streakContinued: true, streakBroken: false };
    } else {
        // Streak broken
        progress.streak = 1;
        progress.lastActivityDate = today;
        return { streakContinued: false, streakBroken: true };
    }
}

/**
 * Daily Challenge System
 */
function generateDailyChallenge() {
    const challenges = [
        {
            type: 'quiz',
            title: 'Quiz Master',
            description: 'Complete any quiz with 80%+ score',
            xp: 50,
            icon: '📝',
            check: (progress) => {
                const today = new Date().toDateString();
                return progress.lastQuizDate === today &&
                       Object.values(progress.quizScores).some(s => s >= 80);
            }
        },
        {
            type: 'lesson',
            title: 'Knowledge Seeker',
            description: 'Read 3 lesson sections',
            xp: 30,
            icon: '📚',
            check: (progress) => (progress.todayLessonsRead || 0) >= 3
        },
        {
            type: 'calculator',
            title: 'Number Cruncher',
            description: 'Use 3 different calculators',
            xp: 40,
            icon: '🔢',
            check: (progress) => (progress.todayCalculatorUses || 0) >= 3
        },
        {
            type: 'flashcard',
            title: 'Memory Master',
            description: 'Review 20 flashcards',
            xp: 35,
            icon: '🎴',
            check: (progress) => (progress.todayFlashcardsReviewed || 0) >= 20
        },
        {
            type: 'pattern',
            title: 'Pattern Detective',
            description: 'Identify 5 chart patterns correctly',
            xp: 60,
            icon: '🔍',
            check: (progress) => (progress.todayPatternsIdentified || 0) >= 5
        }
    ];

    // Deterministic daily challenge based on day of year
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    return challenges[dayOfYear % challenges.length];
}

/**
 * Get achievement rarity color
 */
function getAchievementRarityColor(rarity) {
    const colors = {
        common: 'from-gray-500 to-gray-600',
        rare: 'from-blue-500 to-blue-600',
        epic: 'from-purple-500 to-pink-600',
        legendary: 'from-yellow-400 to-orange-500'
    };
    return colors[rarity] || colors.common;
}

/**
 * Create confetti effect for achievements
 */
function createConfetti(container, count = 50) {
    const colors = ['#FFD700', '#FFA500', '#FF69B4', '#00CED1', '#32CD32', '#FF4500'];

    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.cssText = `
            --color: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 0.5}s;
            animation-duration: ${2 + Math.random()}s;
        `;
        container.appendChild(confetti);

        setTimeout(() => confetti.remove(), 3000);
    }
}

/**
 * Show achievement notification
 */
function showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 z-[99999] max-w-sm';
    notification.innerHTML = `
        <div class="bg-gradient-to-r ${getAchievementRarityColor(achievement.rarity)} rounded-xl p-6 border-2 border-yellow-400 shadow-2xl transform animate-bounce-in">
            <div class="flex items-center gap-4">
                <div class="text-5xl">${achievement.icon}</div>
                <div class="flex-1">
                    <div class="text-sm font-bold text-yellow-200 mb-1">🎉 Achievement Unlocked!</div>
                    <div class="text-xl font-black text-white mb-1">${achievement.name}</div>
                    <div class="text-sm text-white/90">${achievement.description}</div>
                    ${achievement.xp > 0 ? `<div class="text-sm font-bold text-yellow-300 mt-2">+${achievement.xp} XP</div>` : ''}
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(notification);
    createConfetti(document.body);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('animate-fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

// Export functions
if (typeof window !== 'undefined') {
    window.LearningGamification = {
        ACHIEVEMENTS,
        LEVEL_SYSTEM,
        calculateLevel,
        getXPForNextLevel,
        checkAchievements,
        awardXP,
        updateStreak,
        generateDailyChallenge,
        getAchievementRarityColor,
        createConfetti,
        showAchievementNotification
    };
}
