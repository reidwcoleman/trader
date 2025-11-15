// Learn Hub Component
// Gamified trading education: courses, challenges, AI tutor

/**
 * Learn Hub
 * Interactive learning platform with courses, quizzes, and AI tutor
 */
class LearnHub {
    constructor(config = {}) {
        this.activeTab = config.activeTab || 'courses';
        this.userProgress = { level: 1, xp: 0, streak: 0 };
    }

    async render() {
        return `
            <div class="hub-container learn-hub">
                <div class="hub-header">
                    <div class="hub-title-group">
                        <h1 class="hub-title">🎓 Learn</h1>
                        <p class="hub-subtitle">Master trading with interactive lessons</p>
                    </div>
                    <div class="user-progress-summary">
                        ${this.renderProgressSummary()}
                    </div>
                </div>

                <div class="hub-tabs">
                    ${this.renderTab('courses', '📚', 'Courses')}
                    ${this.renderTab('challenges', '🎯', 'Challenges')}
                    ${this.renderTab('simulator', '🎮', 'Simulator')}
                    ${this.renderTab('ai-tutor', '🤖', 'AI Tutor')}
                </div>

                <div class="hub-content">
                    ${await this.renderActiveTab()}
                </div>
            </div>
        `;
    }

    renderTab(id, icon, label) {
        const active = this.activeTab === id ? 'active' : '';
        return `
            <button class="hub-tab ${active}" onclick="learnHub.switchTab('${id}')" data-tab="${id}">
                <span class="tab-icon">${icon}</span>
                <span class="tab-label">${label}</span>
            </button>
        `;
    }

    renderProgressSummary() {
        return `
            <div class="progress-badges">
                <div class="progress-badge">
                    <span class="badge-icon">⭐</span>
                    <span class="badge-value">Level ${this.userProgress.level}</span>
                </div>
                <div class="progress-badge">
                    <span class="badge-icon">🔥</span>
                    <span class="badge-value">${this.userProgress.streak} Day Streak</span>
                </div>
                <div class="progress-badge">
                    <span class="badge-icon">💎</span>
                    <span class="badge-value">${this.userProgress.xp} XP</span>
                </div>
            </div>
        `;
    }

    async renderActiveTab() {
        switch (this.activeTab) {
            case 'courses':
                return await this.renderCourses();
            case 'challenges':
                return await this.renderChallenges();
            case 'simulator':
                return await this.renderSimulator();
            case 'ai-tutor':
                return await this.renderAITutor();
            default:
                return '';
        }
    }

    /**
     * Courses Tab
     */
    async renderCourses() {
        const courses = [
            {
                id: 1,
                title: 'Trading Basics',
                icon: '📖',
                level: 'Beginner',
                progress: 75,
                lessons: 12,
                duration: '2 hours',
                status: 'in-progress'
            },
            {
                id: 2,
                title: 'Technical Analysis',
                icon: '📊',
                level: 'Intermediate',
                progress: 30,
                lessons: 15,
                duration: '3 hours',
                status: 'in-progress'
            },
            {
                id: 3,
                title: 'Options Trading',
                icon: '🎯',
                level: 'Advanced',
                progress: 0,
                lessons: 20,
                duration: '5 hours',
                status: 'locked'
            }
        ];

        return `
            <div class="courses-container">
                <div class="courses-header">
                    <h2>Learning Paths</h2>
                    <div class="filter-tabs">
                        <button class="filter-btn active">All</button>
                        <button class="filter-btn">Beginner</button>
                        <button class="filter-btn">Intermediate</button>
                        <button class="filter-btn">Advanced</button>
                    </div>
                </div>

                <div class="courses-grid">
                    ${courses.map(course => `
                        <div class="course-card ${course.status}">
                            <div class="course-icon">${course.icon}</div>
                            <div class="course-content">
                                <div class="course-header">
                                    <h3 class="course-title">${course.title}</h3>
                                    <span class="course-level ${course.level.toLowerCase()}">${course.level}</span>
                                </div>
                                <div class="course-meta">
                                    <span>📚 ${course.lessons} lessons</span>
                                    <span>⏱️ ${course.duration}</span>
                                </div>
                                ${course.progress > 0 ? `
                                    <div class="course-progress">
                                        ${UI.Loader.progress(course.progress)}
                                        <span class="progress-text">${course.progress}% complete</span>
                                    </div>
                                ` : ''}
                                ${UI.Button.render({
                                    label: course.status === 'locked' ? '🔒 Locked' : course.progress > 0 ? 'Continue' : 'Start Course',
                                    variant: course.status === 'locked' ? 'ghost' : 'primary',
                                    onClick: `learnHub.openCourse(${course.id})`,
                                    fullWidth: true,
                                    disabled: course.status === 'locked'
                                })}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Challenges Tab
     */
    async renderChallenges() {
        return `
            <div class="challenges-container">
                <div class="challenges-header">
                    <h2>Trading Challenges</h2>
                    <p>Test your skills and earn rewards</p>
                </div>

                <div class="challenges-grid">
                    ${UI.Card.render({
                        title: '🎯 Pattern Recognition',
                        subtitle: 'Identify 10 chart patterns',
                        content: `
                            <div class="challenge-reward">Reward: +100 XP, Pattern Master Badge</div>
                            <div class="challenge-stats">
                                <span>Progress: 6/10</span>
                                <span>🔥 Active</span>
                            </div>
                            ${UI.Button.render({ label: 'Continue Challenge', variant: 'primary', onClick: 'learnHub.startChallenge("pattern")', fullWidth: true })}
                        `,
                        className: 'challenge-card active'
                    })}

                    ${UI.Card.render({
                        title: '💰 Paper Trading',
                        subtitle: 'Achieve 10% profit in 30 days',
                        content: `
                            <div class="challenge-reward">Reward: +500 XP, Trader Badge</div>
                            <div class="challenge-stats">
                                <span>Progress: +3.2%</span>
                                <span>⏱️ 18 days left</span>
                            </div>
                            ${UI.Button.render({ label: 'Start Trading', variant: 'success', onClick: 'navSystem.navigate("trading")', fullWidth: true })}
                        `,
                        className: 'challenge-card'
                    })}

                    ${UI.Card.render({
                        title: '📚 Learn Streak',
                        subtitle: 'Complete 7 days of learning',
                        content: `
                            <div class="challenge-reward">Reward: +50 XP, Dedicated Learner Badge</div>
                            <div class="challenge-stats">
                                <span>Current Streak: ${this.userProgress.streak} days</span>
                                <span>🎯 ${7 - this.userProgress.streak} days to go</span>
                            </div>
                            ${UI.Button.render({ label: 'Keep Learning', variant: 'primary', onClick: 'learnHub.switchTab("courses")', fullWidth: true })}
                        `,
                        className: 'challenge-card'
                    })}
                </div>
            </div>
        `;
    }

    /**
     * Simulator Tab (Pattern Recognition Game)
     */
    async renderSimulator() {
        return `
            <div class="simulator-container">
                ${UI.Card.render({
                    title: '🎮 Pattern Recognition Game',
                    subtitle: 'Identify chart patterns to level up',
                    content: `
                        <div id="pattern-game-container">
                            <div class="game-chart" id="game-chart">
                                <div style="height: 400px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.02); border-radius: 12px; color: #888;">
                                    Chart will load here
                                </div>
                            </div>
                            <div class="game-controls">
                                <h4>What pattern do you see?</h4>
                                <div class="pattern-options">
                                    ${['Bull Flag', 'Head & Shoulders', 'Double Bottom', 'Uptrend', 'Triangle'].map(pattern => `
                                        ${UI.Button.render({
                                            label: pattern,
                                            variant: 'secondary',
                                            onClick: \`learnHub.checkPattern('${pattern}')\`
                                        })}
                                    `).join('')}
                                </div>
                            </div>
                            <div class="game-stats">
                                <span>Score: <strong id="game-score">0</strong></span>
                                <span>Streak: <strong id="game-streak">0</strong></span>
                                <span>Best: <strong>15</strong></span>
                            </div>
                        </div>
                    `
                })}
            </div>
        `;
    }

    /**
     * AI Tutor Tab
     */
    async renderAITutor() {
        return `
            <div class="ai-tutor-container">
                ${UI.Card.render({
                    title: '🤖 FinBot - Your AI Trading Tutor',
                    subtitle: 'Ask me anything about trading!',
                    content: `
                        <div class="chat-container">
                            <div id="chat-messages" class="chat-messages">
                                <div class="chat-message bot">
                                    <div class="message-avatar">🤖</div>
                                    <div class="message-content">
                                        <p>Hi! I'm FinBot, your AI trading tutor. Ask me anything about:</p>
                                        <ul>
                                            <li>📊 Technical analysis and indicators</li>
                                            <li>💰 Trading strategies and risk management</li>
                                            <li>📈 Chart patterns and market trends</li>
                                            <li>🎯 Options, margin, and advanced trading</li>
                                        </ul>
                                        <p>What would you like to learn today?</p>
                                    </div>
                                </div>
                            </div>
                            <div class="chat-input-container">
                                <input type="text"
                                       id="chat-input"
                                       class="chat-input"
                                       placeholder="Ask a question..."
                                       onkeypress="if(event.key==='Enter')learnHub.sendMessage()">
                                ${UI.Button.render({ label: 'Send', variant: 'primary', onClick: 'learnHub.sendMessage()' })}
                            </div>
                            <div class="quick-questions">
                                <span class="quick-label">Quick questions:</span>
                                <button class="quick-btn" onclick="learnHub.askQuestion('What is RSI?')">What is RSI?</button>
                                <button class="quick-btn" onclick="learnHub.askQuestion('How do stop losses work?')">Stop losses?</button>
                                <button class="quick-btn" onclick="learnHub.askQuestion('Explain options trading')">Options basics?</button>
                            </div>
                        </div>
                    `
                })}
            </div>
        `;
    }

    async switchTab(tabId) {
        this.activeTab = tabId;
        document.querySelectorAll('.hub-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabId);
        });
        const content = document.querySelector('.hub-content');
        if (content) {
            content.innerHTML = await this.renderActiveTab();
        }
    }

    openCourse(courseId) {
        UIToast.show({ message: `Opening course ${courseId}...`, type: 'info' });
        // Would load course content
    }

    startChallenge(type) {
        UIToast.show({ message: `Starting ${type} challenge...`, type: 'info' });
        // Would start challenge
    }

    checkPattern(pattern) {
        // Would check if pattern is correct
        UIToast.show({ message: `You selected: ${pattern}`, type: 'info' });
    }

    sendMessage() {
        const input = document.getElementById('chat-input');
        if (!input) return;
        const message = input.value.trim();
        if (!message) return;

        this.askQuestion(message);
        input.value = '';
    }

    askQuestion(question) {
        const container = document.getElementById('chat-messages');
        if (!container) return;

        // Add user message
        container.innerHTML += `
            <div class="chat-message user">
                <div class="message-content">${question}</div>
                <div class="message-avatar">👤</div>
            </div>
        `;

        // Simulate AI response
        setTimeout(() => {
            const responses = {
                'What is RSI?': 'RSI (Relative Strength Index) is a momentum indicator that measures the speed and magnitude of price changes on a scale of 0-100. Values above 70 indicate overbought conditions, while values below 30 suggest oversold conditions.',
                'How do stop losses work?': 'A stop loss is an order that automatically sells your position when the price drops to a specified level, limiting your potential loss. For example, if you buy at $100 and set a stop loss at $95, your shares will sell if the price falls to $95.',
                'Explain options trading': 'Options are contracts giving you the right (not obligation) to buy (call) or sell (put) a stock at a specific price before expiration. They can be used for hedging, income generation, or speculation with limited risk.'
            };

            const response = responses[question] || 'That\'s a great question! In real implementation, I would provide detailed explanations based on your trading level and learning history.';

            container.innerHTML += `
                <div class="chat-message bot">
                    <div class="message-avatar">🤖</div>
                    <div class="message-content">${response}</div>
                </div>
            `;

            container.scrollTop = container.scrollHeight;
        }, 500);
    }
}

if (typeof window !== 'undefined') {
    window.LearnHub = LearnHub;
}
