// Enhanced Gamification System for FinClash Learning
// Coins, Leaderboards, Achievements, Badges, Rewards

/**
 * Learning Coins System - Virtual currency for engagement
 */
class LearningCoinsSystem {
    constructor() {
        this.coins = this.loadCoins();
        this.transactions = this.loadTransactions();
    }

    loadCoins() {
        return parseInt(localStorage.getItem('learning_coins') || '0');
    }

    loadTransactions() {
        const saved = localStorage.getItem('coin_transactions');
        return saved ? JSON.parse(saved) : [];
    }

    earnCoins(amount, reason) {
        this.coins += amount;
        this.addTransaction({
            type: 'earn',
            amount,
            reason,
            timestamp: Date.now(),
            balance: this.coins
        });
        this.save();
        return { coins: this.coins, earned: amount };
    }

    spendCoins(amount, item) {
        if (this.coins >= amount) {
            this.coins -= amount;
            this.addTransaction({
                type: 'spend',
                amount,
                item,
                timestamp: Date.now(),
                balance: this.coins
            });
            this.save();
            return { success: true, remaining: this.coins };
        }
        return { success: false, needed: amount - this.coins };
    }

    addTransaction(transaction) {
        this.transactions.unshift(transaction);
        // Keep last 100 transactions
        if (this.transactions.length > 100) {
            this.transactions = this.transactions.slice(0, 100);
        }
        localStorage.setItem('coin_transactions', JSON.stringify(this.transactions));
    }

    save() {
        localStorage.setItem('learning_coins', this.coins.toString());
    }

    getBalance() {
        return this.coins;
    }

    getHistory(limit = 10) {
        return this.transactions.slice(0, limit);
    }
}

/**
 * Coin Earning Opportunities
 */
const COIN_REWARDS = {
    // Lessons
    complete_microlesson: 10,
    complete_full_lesson: 50,
    perfect_quiz_score: 25,
    first_lesson_of_day: 20,

    // Streaks
    daily_login: 5,
    streak_3_days: 50,
    streak_7_days: 150,
    streak_30_days: 500,

    // Challenges
    daily_challenge_complete: 25,
    weekly_challenge_complete: 100,
    perfect_daily_challenge: 40,

    // Achievements
    unlock_achievement_common: 25,
    unlock_achievement_rare: 75,
    unlock_achievement_epic: 200,
    unlock_achievement_legendary: 500,

    // Social
    refer_friend: 100,
    help_other_student: 30,
    share_progress: 15,

    // Milestones
    reach_level_5: 100,
    reach_level_10: 300,
    complete_learning_path: 250,

    // Special Events
    weekend_bonus: 10,
    double_xp_event: 0 // Multiplier, not fixed amount
};

/**
 * Coin Shop Items
 */
const COIN_SHOP = {
    cosmetics: [
        {
            id: 'badge_gold_star',
            name: '⭐ Gold Star Badge',
            description: 'Show off your dedication with a shiny gold star',
            price: 100,
            category: 'badge',
            rarity: 'rare'
        },
        {
            id: 'badge_rocket',
            name: '🚀 Rocket Badge',
            description: 'For traders shooting for the moon',
            price: 150,
            category: 'badge',
            rarity: 'epic'
        },
        {
            id: 'avatar_bull',
            name: '🐂 Bull Avatar',
            description: 'Bullish on learning',
            price: 200,
            category: 'avatar',
            rarity: 'rare'
        },
        {
            id: 'avatar_bear',
            name: '🐻 Bear Avatar',
            description: 'For the contrarians',
            price: 200,
            category: 'avatar',
            rarity: 'rare'
        },
        {
            id: 'avatar_wolf',
            name: '🐺 Wolf Avatar',
            description: 'Lone wolf trader',
            price: 300,
            category: 'avatar',
            rarity: 'epic'
        },
        {
            id: 'avatar_eagle',
            name: '🦅 Eagle Avatar',
            description: 'High-flying investor',
            price: 300,
            category: 'avatar',
            rarity: 'epic'
        },
        {
            id: 'theme_matrix',
            name: '🟢 Matrix Theme',
            description: 'Green terminal aesthetic',
            price: 250,
            category: 'theme',
            rarity: 'epic'
        },
        {
            id: 'theme_cyberpunk',
            name: '🟣 Cyberpunk Theme',
            description: 'Neon purple/pink vibes',
            price: 350,
            category: 'theme',
            rarity: 'legendary'
        }
    ],
    boosts: [
        {
            id: 'boost_2x_xp_1hr',
            name: '2X XP (1 Hour)',
            description: 'Double XP for 1 hour',
            price: 100,
            category: 'boost',
            duration: 3600000, // 1 hour in ms
            multiplier: 2
        },
        {
            id: 'boost_2x_xp_24hr',
            name: '2X XP (24 Hours)',
            description: 'Double XP for a full day',
            price: 500,
            category: 'boost',
            duration: 86400000, // 24 hours
            multiplier: 2
        },
        {
            id: 'boost_3x_coins_1hr',
            name: '3X Coins (1 Hour)',
            description: 'Triple coin earnings for 1 hour',
            price: 150,
            category: 'boost',
            duration: 3600000,
            multiplier: 3,
            applies_to: 'coins'
        },
        {
            id: 'boost_streak_freeze',
            name: '❄️ Streak Freeze',
            description: 'Protects your streak for 1 missed day',
            price: 200,
            category: 'boost',
            uses: 1
        }
    ],
    unlocks: [
        {
            id: 'unlock_advanced_lessons',
            name: '🔓 Advanced Lessons Early Access',
            description: 'Unlock advanced content before reaching required level',
            price: 500,
            category: 'unlock',
            permanent: true
        },
        {
            id: 'unlock_custom_certificate',
            name: '📜 Custom Certificate Design',
            description: 'Customize your completion certificate',
            price: 300,
            category: 'unlock',
            permanent: true
        },
        {
            id: 'unlock_pro_tips',
            name: '💎 Pro Trader Tips',
            description: 'Access exclusive professional trading insights',
            price: 400,
            category: 'unlock',
            permanent: true
        }
    ]
};

/**
 * Global Leaderboard System
 */
class LeaderboardSystem {
    constructor() {
        this.playerData = this.loadPlayerData();
    }

    loadPlayerData() {
        const saved = localStorage.getItem('player_profile');
        if (saved) {
            return JSON.parse(saved);
        }
        // Create new player
        return {
            username: 'Trader' + Math.floor(Math.random() * 10000),
            totalXP: 0,
            level: 1,
            completedLessons: 0,
            streak: 0,
            coins: 0,
            achievements: [],
            joinDate: Date.now()
        };
    }

    updateStats(updates) {
        this.playerData = { ...this.playerData, ...updates };
        localStorage.setItem('player_profile', JSON.stringify(this.playerData));
        // In real app, would also POST to backend API
        this.syncToServer();
    }

    async syncToServer() {
        // In production, this would POST to a backend API
        // For now, we'll use localStorage simulation
        try {
            const globalData = this.getGlobalLeaderboard();
            const playerIndex = globalData.findIndex(p => p.username === this.playerData.username);

            if (playerIndex >= 0) {
                globalData[playerIndex] = this.playerData;
            } else {
                globalData.push(this.playerData);
            }

            // Sort by XP
            globalData.sort((a, b) => b.totalXP - a.totalXP);

            // Keep top 1000
            const top1000 = globalData.slice(0, 1000);
            localStorage.setItem('global_leaderboard', JSON.stringify(top1000));

            return this.getRank();
        } catch (error) {
            console.error('Leaderboard sync failed:', error);
            return null;
        }
    }

    getGlobalLeaderboard() {
        const saved = localStorage.getItem('global_leaderboard');
        return saved ? JSON.parse(saved) : [];
    }

    getRank() {
        const board = this.getGlobalLeaderboard();
        const rank = board.findIndex(p => p.username === this.playerData.username) + 1;
        return rank || null; // null if not ranked yet
    }

    getTopPlayers(limit = 10, category = 'xp') {
        const board = this.getGlobalLeaderboard();

        // Sort by different categories
        switch (category) {
            case 'streak':
                board.sort((a, b) => b.streak - a.streak);
                break;
            case 'lessons':
                board.sort((a, b) => b.completedLessons - a.completedLessons);
                break;
            case 'coins':
                board.sort((a, b) => b.coins - a.coins);
                break;
            case 'xp':
            default:
                // Already sorted by XP
                break;
        }

        return board.slice(0, limit);
    }

    getPlayerStats() {
        return {
            ...this.playerData,
            rank: this.getRank(),
            percentile: this.getPercentile()
        };
    }

    getPercentile() {
        const board = this.getGlobalLeaderboard();
        const rank = this.getRank();
        if (!rank || board.length === 0) return null;
        return Math.round((1 - (rank / board.length)) * 100);
    }
}

/**
 * Enhanced Achievement System with Tiers
 */
const TIERED_ACHIEVEMENTS = {
    // Learning Achievements
    lesson_master: {
        common: {
            id: 'lesson_master_bronze',
            name: '📚 Bronze Scholar',
            description: 'Complete 10 lessons',
            icon: '📚',
            tier: 'common',
            requirement: 10,
            xp: 100,
            coins: 50,
            color: '#CD7F32'
        },
        rare: {
            id: 'lesson_master_silver',
            name: '📚 Silver Scholar',
            description: 'Complete 25 lessons',
            icon: '📚',
            tier: 'rare',
            requirement: 25,
            xp: 250,
            coins: 150,
            color: '#C0C0C0'
        },
        epic: {
            id: 'lesson_master_gold',
            name: '📚 Gold Scholar',
            description: 'Complete 50 lessons',
            icon: '📚',
            tier: 'epic',
            requirement: 50,
            xp: 500,
            coins: 300,
            color: '#FFD700'
        },
        legendary: {
            id: 'lesson_master_platinum',
            name: '📚 Platinum Scholar',
            description: 'Complete 100 lessons',
            icon: '📚',
            tier: 'legendary',
            requirement: 100,
            xp: 1000,
            coins: 500,
            color: '#E5E4E2'
        }
    },

    // Streak Achievements
    dedication: {
        common: {
            id: 'dedication_bronze',
            name: '🔥 Warming Up',
            description: '7-day streak',
            tier: 'common',
            requirement: 7,
            xp: 100,
            coins: 75
        },
        rare: {
            id: 'dedication_silver',
            name: '🔥 On Fire',
            description: '30-day streak',
            tier: 'rare',
            requirement: 30,
            xp: 300,
            coins: 200
        },
        epic: {
            id: 'dedication_gold',
            name: '🔥 Burning Bright',
            description: '90-day streak',
            tier: 'epic',
            requirement: 90,
            xp: 750,
            coins: 500
        },
        legendary: {
            id: 'dedication_platinum',
            name: '🔥 Eternal Flame',
            description: '365-day streak',
            tier: 'legendary',
            requirement: 365,
            xp: 2000,
            coins: 1000
        }
    },

    // Quiz Mastery
    quiz_master: {
        common: {
            id: 'quiz_master_bronze',
            name: '💯 Quiz Rookie',
            description: '10 perfect quiz scores',
            tier: 'common',
            requirement: 10,
            xp: 150,
            coins: 100
        },
        rare: {
            id: 'quiz_master_silver',
            name: '💯 Quiz Pro',
            description: '25 perfect quiz scores',
            tier: 'rare',
            requirement: 25,
            xp: 350,
            coins: 250
        },
        epic: {
            id: 'quiz_master_gold',
            name: '💯 Quiz Legend',
            description: '50 perfect quiz scores',
            tier: 'epic',
            requirement: 50,
            xp: 700,
            coins: 500
        },
        legendary: {
            id: 'quiz_master_platinum',
            name: '💯 Quiz God',
            description: '100 perfect quiz scores',
            tier: 'legendary',
            requirement: 100,
            xp: 1500,
            coins: 1000
        }
    },

    // Special Achievements
    speed_demon: {
        name: '⚡ Speed Demon',
        description: 'Complete a lesson in under 3 minutes',
        tier: 'rare',
        xp: 200,
        coins: 100,
        secret: true
    },
    night_owl: {
        name: '🌙 Night Owl',
        description: 'Complete 10 lessons after 10 PM',
        tier: 'rare',
        xp: 150,
        coins: 75,
        secret: true
    },
    early_bird: {
        name: '🌅 Early Bird',
        description: 'Complete 10 lessons before 8 AM',
        tier: 'rare',
        xp: 150,
        coins: 75,
        secret: true
    },
    weekend_warrior: {
        name: '⚔️ Weekend Warrior',
        description: 'Learn for 4 weekends in a row',
        tier: 'epic',
        xp: 300,
        coins: 200,
        secret: true
    }
};

/**
 * Daily Login Rewards
 */
const DAILY_REWARDS = [
    { day: 1, coins: 10, xp: 10, item: null },
    { day: 2, coins: 15, xp: 15, item: null },
    { day: 3, coins: 20, xp: 20, item: '🎁 Mystery Box' },
    { day: 4, coins: 25, xp: 25, item: null },
    { day: 5, coins: 30, xp: 30, item: null },
    { day: 6, coins: 40, xp: 40, item: null },
    { day: 7, coins: 100, xp: 100, item: '🏆 Weekly Champion Badge' }
];

/**
 * Level-Up Rewards
 */
function getLevelUpReward(level) {
    const baseCoins = 50;
    const baseXP = 0; // XP to next level

    return {
        coins: baseCoins * level,
        title: getLevelTitle(level),
        unlocks: getLevelUnlocks(level)
    };
}

function getLevelTitle(level) {
    const titles = {
        1: 'Beginner Trader',
        2: 'Apprentice',
        3: 'Student',
        4: 'Practitioner',
        5: 'Skilled Trader',
        6: 'Advanced Trader',
        7: 'Expert',
        8: 'Master Trader',
        9: 'Elite',
        10: 'Trading Legend',
        15: 'Market Wizard',
        20: 'Wall Street Wolf'
    };
    return titles[level] || `Level ${level} Trader`;
}

function getLevelUnlocks(level) {
    const unlocks = {
        3: ['Advanced Lessons'],
        5: ['Calculator Simulator', 'Custom Themes'],
        7: ['Expert Lessons', 'Leaderboard Access'],
        10: ['Certificate Generator', 'All Achievements Visible'],
        15: ['Pro Tips', 'Advanced Strategies'],
        20: ['Master Trader Badge', 'Priority Support']
    };
    return unlocks[level] || [];
}

// Export for use in main app
if (typeof window !== 'undefined') {
    window.EnhancedGamification = {
        LearningCoinsSystem,
        LeaderboardSystem,
        COIN_REWARDS,
        COIN_SHOP,
        TIERED_ACHIEVEMENTS,
        DAILY_REWARDS,
        getLevelUpReward,
        getLevelTitle
    };
}
