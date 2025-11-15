// Progress Visualization Dashboard for FinClash Learning Tab
// Beautiful charts and metrics showing learning journey

/**
 * Progress Dashboard - Comprehensive learning analytics
 */
class ProgressDashboard {
    constructor() {
        this.data = this.loadProgressData();
    }

    /**
     * Load all progress data from localStorage
     */
    loadProgressData() {
        return {
            totalXP: parseInt(localStorage.getItem('total_xp') || '0'),
            level: parseInt(localStorage.getItem('user_level') || '1'),
            completedLessons: JSON.parse(localStorage.getItem('completed_lessons') || '[]'),
            quizScores: JSON.parse(localStorage.getItem('quiz_scores') || '{}'),
            streakData: JSON.parse(localStorage.getItem('streak_history') || '[]'),
            timeSpent: JSON.parse(localStorage.getItem('time_spent') || '{}'),
            achievements: JSON.parse(localStorage.getItem('achievements') || '[]'),
            coins: parseInt(localStorage.getItem('learning_coins') || '0'),
            dailyActivity: JSON.parse(localStorage.getItem('daily_activity') || '[]')
        };
    }

    /**
     * Generate skill radar chart data
     * Shows proficiency across different trading categories
     */
    generateSkillRadar() {
        const categories = [
            'Stock Basics',
            'Technical Analysis',
            'Risk Management',
            'Trading Psychology',
            'Advanced Strategies',
            'Market Knowledge'
        ];

        // Calculate proficiency for each category (0-100)
        const proficiency = categories.map(category => {
            const lessonsInCategory = this.getLessonsInCategory(category);
            const completedInCategory = this.data.completedLessons.filter(
                lesson => lessonsInCategory.includes(lesson)
            ).length;

            return Math.round((completedInCategory / lessonsInCategory.length) * 100) || 0;
        });

        return {
            categories,
            proficiency,
            avgProficiency: Math.round(proficiency.reduce((a, b) => a + b, 0) / proficiency.length)
        };
    }

    /**
     * Helper to categorize lessons
     */
    getLessonsInCategory(category) {
        const categoryMap = {
            'Stock Basics': ['basics', 'stocks_intro', 'market_hours', 'order_types'],
            'Technical Analysis': ['charts', 'indicators', 'patterns', 'candlesticks'],
            'Risk Management': ['risk', 'position_sizing', 'stop_loss', 'portfolio'],
            'Trading Psychology': ['psychology', 'emotions', 'discipline', 'fomo'],
            'Advanced Strategies': ['strategies', 'day_trading', 'swing_trading', 'options'],
            'Market Knowledge': ['market', 'sectors', 'news', 'economics']
        };
        return categoryMap[category] || [];
    }

    /**
     * Generate XP growth chart (last 30 days)
     */
    generateXPGrowthChart() {
        const days = 30;
        const xpHistory = JSON.parse(localStorage.getItem('xp_history') || '[]');

        const chartData = [];
        const today = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const dayData = xpHistory.find(d => d.date === dateStr);
            chartData.push({
                date: dateStr,
                label: this.formatDate(date, i),
                xp: dayData ? dayData.xp : 0,
                cumulative: dayData ? dayData.cumulative : (chartData[chartData.length - 1]?.cumulative || 0)
            });
        }

        return {
            labels: chartData.map(d => d.label),
            xpPerDay: chartData.map(d => d.xp),
            cumulativeXP: chartData.map(d => d.cumulative),
            totalGained: chartData.reduce((sum, d) => sum + d.xp, 0),
            avgPerDay: Math.round(chartData.reduce((sum, d) => sum + d.xp, 0) / days)
        };
    }

    /**
     * Format date for chart labels
     */
    formatDate(date, daysAgo) {
        if (daysAgo === 0) return 'Today';
        if (daysAgo === 1) return 'Yesterday';
        if (daysAgo < 7) return date.toLocaleDateString('en-US', { weekday: 'short' });
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    /**
     * Generate streak calendar (GitHub-style contribution graph)
     */
    generateStreakCalendar() {
        const weeks = 12; // Show last 12 weeks
        const days = weeks * 7;
        const calendar = [];

        const today = new Date();
        const dailyActivity = this.data.dailyActivity || [];

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const activity = dailyActivity.find(a => a.date === dateStr);
            const lessonsCompleted = activity ? activity.lessonsCompleted : 0;

            calendar.push({
                date: dateStr,
                dayOfWeek: date.getDay(),
                weekOfYear: this.getWeekNumber(date),
                lessonsCompleted,
                level: this.getActivityLevel(lessonsCompleted)
            });
        }

        return {
            days: calendar,
            totalActiveDays: calendar.filter(d => d.lessonsCompleted > 0).length,
            currentStreak: this.calculateCurrentStreak(calendar),
            longestStreak: this.calculateLongestStreak(calendar)
        };
    }

    /**
     * Get week number of year
     */
    getWeekNumber(date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    }

    /**
     * Get activity level for heatmap color
     */
    getActivityLevel(lessonsCompleted) {
        if (lessonsCompleted === 0) return 0;
        if (lessonsCompleted === 1) return 1;
        if (lessonsCompleted <= 3) return 2;
        if (lessonsCompleted <= 5) return 3;
        return 4; // 6+ lessons
    }

    /**
     * Calculate current streak
     */
    calculateCurrentStreak(calendar) {
        let streak = 0;
        for (let i = calendar.length - 1; i >= 0; i--) {
            if (calendar[i].lessonsCompleted > 0) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }

    /**
     * Calculate longest streak
     */
    calculateLongestStreak(calendar) {
        let maxStreak = 0;
        let currentStreak = 0;

        calendar.forEach(day => {
            if (day.lessonsCompleted > 0) {
                currentStreak++;
                maxStreak = Math.max(maxStreak, currentStreak);
            } else {
                currentStreak = 0;
            }
        });

        return maxStreak;
    }

    /**
     * Generate quiz performance stats
     */
    generateQuizStats() {
        const scores = Object.values(this.data.quizScores);
        if (scores.length === 0) {
            return {
                totalQuizzes: 0,
                avgScore: 0,
                perfectScores: 0,
                distribution: [0, 0, 0, 0, 0]
            };
        }

        const distribution = [0, 0, 0, 0, 0]; // 0-20, 20-40, 40-60, 60-80, 80-100
        scores.forEach(score => {
            const bucket = Math.min(Math.floor(score / 20), 4);
            distribution[bucket]++;
        });

        return {
            totalQuizzes: scores.length,
            avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
            perfectScores: scores.filter(s => s === 100).length,
            distribution,
            improvementTrend: this.calculateTrend(scores)
        };
    }

    /**
     * Calculate trend (improving/declining)
     */
    calculateTrend(scores) {
        if (scores.length < 5) return 'stable';

        const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
        const secondHalf = scores.slice(Math.floor(scores.length / 2));

        const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

        if (secondAvg > firstAvg + 5) return 'improving';
        if (secondAvg < firstAvg - 5) return 'declining';
        return 'stable';
    }

    /**
     * Generate time spent breakdown
     */
    generateTimeStats() {
        const timeSpent = this.data.timeSpent;

        const totalMinutes = Object.values(timeSpent).reduce((sum, t) => sum + (t.minutes || 0), 0);
        const totalHours = Math.floor(totalMinutes / 60);
        const remainingMinutes = totalMinutes % 60;

        // Category breakdown
        const categories = {
            'Stock Basics': 0,
            'Technical Analysis': 0,
            'Risk Management': 0,
            'Psychology': 0,
            'Strategies': 0,
            'Other': 0
        };

        Object.entries(timeSpent).forEach(([lesson, data]) => {
            const category = this.getCategoryForLesson(lesson);
            categories[category] += data.minutes || 0;
        });

        return {
            totalHours,
            totalMinutes: remainingMinutes,
            totalFormatted: `${totalHours}h ${remainingMinutes}m`,
            categoryBreakdown: categories,
            avgSessionLength: totalMinutes / (Object.keys(timeSpent).length || 1)
        };
    }

    /**
     * Get category for a lesson
     */
    getCategoryForLesson(lesson) {
        if (lesson.includes('basic') || lesson.includes('intro')) return 'Stock Basics';
        if (lesson.includes('chart') || lesson.includes('indicator')) return 'Technical Analysis';
        if (lesson.includes('risk') || lesson.includes('stop')) return 'Risk Management';
        if (lesson.includes('psych') || lesson.includes('emotion')) return 'Psychology';
        if (lesson.includes('strategy') || lesson.includes('trading')) return 'Strategies';
        return 'Other';
    }

    /**
     * Generate achievement progress
     */
    generateAchievementStats() {
        const totalAchievements = 50; // Total available
        const unlocked = this.data.achievements.length;
        const locked = totalAchievements - unlocked;

        // By rarity
        const common = this.data.achievements.filter(a => a.includes('common')).length;
        const rare = this.data.achievements.filter(a => a.includes('rare')).length;
        const epic = this.data.achievements.filter(a => a.includes('epic')).length;
        const legendary = this.data.achievements.filter(a => a.includes('legendary')).length;

        return {
            total: totalAchievements,
            unlocked,
            locked,
            percentComplete: Math.round((unlocked / totalAchievements) * 100),
            byRarity: { common, rare, epic, legendary },
            recentUnlocks: this.data.achievements.slice(-5)
        };
    }

    /**
     * Generate comprehensive dashboard summary
     */
    generateDashboard() {
        return {
            overview: {
                level: this.data.level,
                totalXP: this.data.totalXP,
                coins: this.data.coins,
                lessonsCompleted: this.data.completedLessons.length
            },
            skillRadar: this.generateSkillRadar(),
            xpGrowth: this.generateXPGrowthChart(),
            streakCalendar: this.generateStreakCalendar(),
            quizStats: this.generateQuizStats(),
            timeStats: this.generateTimeStats(),
            achievements: this.generateAchievementStats()
        };
    }

    /**
     * Get personalized insights
     */
    getInsights() {
        const dashboard = this.generateDashboard();
        const insights = [];

        // Streak insight
        if (dashboard.streakCalendar.currentStreak >= 7) {
            insights.push({
                type: 'positive',
                emoji: '🔥',
                message: `Amazing! ${dashboard.streakCalendar.currentStreak}-day learning streak. Keep it up!`
            });
        } else if (dashboard.streakCalendar.currentStreak === 0) {
            insights.push({
                type: 'tip',
                emoji: '💡',
                message: `Start a streak today! Just complete one lesson to begin.`
            });
        }

        // Quiz performance insight
        if (dashboard.quizStats.improvementTrend === 'improving') {
            insights.push({
                type: 'positive',
                emoji: '📈',
                message: `Your quiz scores are improving! Average: ${dashboard.quizStats.avgScore}%`
            });
        }

        // Skill gap insight
        const skillData = dashboard.skillRadar;
        const weakestSkill = skillData.categories[skillData.proficiency.indexOf(Math.min(...skillData.proficiency))];
        if (Math.min(...skillData.proficiency) < 50) {
            insights.push({
                type: 'tip',
                emoji: '🎯',
                message: `Focus on ${weakestSkill} to round out your skills!`
            });
        }

        // Achievement insight
        if (dashboard.achievements.percentComplete >= 80) {
            insights.push({
                type: 'positive',
                emoji: '🏆',
                message: `${dashboard.achievements.percentComplete}% achievements unlocked! Almost there!`
            });
        }

        // Time spent insight
        if (dashboard.timeStats.totalHours >= 10) {
            insights.push({
                type: 'positive',
                emoji: '⏰',
                message: `You've invested ${dashboard.timeStats.totalFormatted} in learning. Dedication!`
            });
        }

        return insights;
    }
}

/**
 * Visual Chart Generators
 * Create data structures for chart libraries (Chart.js, etc.)
 */
class ChartDataGenerator {
    /**
     * Generate circular progress ring data
     */
    static circularProgress(percentage, label, color) {
        return {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [percentage, 100 - percentage],
                    backgroundColor: [color, '#2a2a3e'],
                    borderWidth: 0
                }]
            },
            options: {
                cutout: '75%',
                plugins: {
                    tooltip: { enabled: false },
                    legend: { display: false }
                }
            },
            centerText: {
                value: `${percentage}%`,
                label
            }
        };
    }

    /**
     * Generate skill radar chart data
     */
    static skillRadar(skillData) {
        return {
            type: 'radar',
            data: {
                labels: skillData.categories,
                datasets: [{
                    label: 'Proficiency',
                    data: skillData.proficiency,
                    backgroundColor: 'rgba(34, 202, 236, 0.2)',
                    borderColor: 'rgba(34, 202, 236, 1)',
                    pointBackgroundColor: 'rgba(34, 202, 236, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(34, 202, 236, 1)'
                }]
            },
            options: {
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { stepSize: 20 }
                    }
                }
            }
        };
    }

    /**
     * Generate XP line chart data
     */
    static xpLineChart(xpData) {
        return {
            type: 'line',
            data: {
                labels: xpData.labels,
                datasets: [{
                    label: 'Daily XP',
                    data: xpData.xpPerDay,
                    borderColor: '#26a69a',
                    backgroundColor: 'rgba(38, 166, 154, 0.1)',
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Cumulative XP',
                    data: xpData.cumulativeXP,
                    borderColor: '#ffd700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        };
    }
}

// Export for use in main app
if (typeof window !== 'undefined') {
    window.ProgressDashboard = ProgressDashboard;
    window.ChartDataGenerator = ChartDataGenerator;
}
