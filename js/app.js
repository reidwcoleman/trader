/**
 * Main Application
 * Integrates all 5 hubs with the navigation system
 * Handles routing, state management, and initialization
 */

class TradingApp {
    constructor(config = {}) {
        // App state
        this.currentHub = config.initialHub || 'markets';
        this.user = config.user || this.loadUserData();
        this.portfolio = config.portfolio || this.loadPortfolio();

        // Initialize components
        this.navSystem = null;
        this.hubs = {};

        // Configuration
        this.config = {
            autoSave: config.autoSave !== false,
            theme: config.theme || 'dark',
            notifications: config.notifications !== false
        };
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            // Load user preferences
            this.loadPreferences();

            // Initialize navigation system
            this.navSystem = new NavigationSystem({
                initialView: this.currentHub,
                user: this.user,
                balance: this.portfolio.totalValue,
                onNavigate: (hub) => this.navigateToHub(hub)
            });

            // Initialize all 5 hubs
            this.hubs = {
                markets: new MarketsHub({
                    onSymbolSelect: (symbol) => this.handleSymbolSelect(symbol)
                }),
                trading: new TradingHub({
                    initialSymbol: 'AAPL',
                    onOrderExecuted: (order) => this.handleOrderExecuted(order),
                    engine: this.getTradingEngine()
                }),
                portfolio: new PortfolioHub({
                    portfolio: this.portfolio,
                    onExport: () => this.exportPortfolio()
                }),
                research: new ResearchHub({
                    watchlists: this.loadWatchlists(),
                    onAddToWatchlist: (symbol) => this.addToWatchlist(symbol)
                }),
                learn: new LearnHub({
                    userProgress: this.user.learningProgress || { level: 1, xp: 0, streak: 0 },
                    onXPEarned: (xp) => this.handleXPEarned(xp)
                })
            };

            // Render the app
            await this.render();

            // Start background tasks
            this.startBackgroundTasks();

            // Setup event listeners
            this.setupEventListeners();

            console.log('✅ Trading App initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize app:', error);
            this.handleError(error);
        }
    }

    /**
     * Render the complete application
     */
    async render() {
        const appContainer = document.getElementById('app');
        if (!appContainer) {
            throw new Error('App container not found. Add <div id="app"></div> to your HTML.');
        }

        // Build the app structure
        appContainer.innerHTML = `
            ${await this.navSystem.render()}
            <div id="main-content" class="main-content ${this.navSystem.sidebarCollapsed ? 'sidebar-collapsed' : ''}">
                <div id="hub-container" class="hub-container-wrapper">
                    ${await this.renderCurrentHub()}
                </div>
            </div>
        `;

        // Apply theme
        document.body.className = `theme-${this.config.theme}`;
    }

    /**
     * Render the currently active hub
     */
    async renderCurrentHub() {
        const hub = this.hubs[this.currentHub];
        if (!hub) {
            return '<div class="error-state">Hub not found</div>';
        }

        return await hub.render();
    }

    /**
     * Navigate to a different hub
     */
    async navigateToHub(hubName) {
        if (!this.hubs[hubName]) {
            console.error(`Hub "${hubName}" not found`);
            return;
        }

        // Update state
        const previousHub = this.currentHub;
        this.currentHub = hubName;

        // Save preference
        localStorage.setItem('lastHub', hubName);

        // Update UI
        const hubContainer = document.getElementById('hub-container');
        if (hubContainer) {
            // Add transition
            hubContainer.style.opacity = '0';

            setTimeout(async () => {
                hubContainer.innerHTML = await this.renderCurrentHub();
                hubContainer.style.opacity = '1';

                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });

                // Trigger hub-specific initialization
                await this.onHubActivated(hubName);
            }, 200);
        }

        console.log(`📍 Navigated from ${previousHub} → ${hubName}`);
    }

    /**
     * Called when a hub is activated
     */
    async onHubActivated(hubName) {
        const hub = this.hubs[hubName];

        // Hub-specific activation logic
        switch (hubName) {
            case 'markets':
                // Refresh market data
                await hub.refreshData?.();
                break;
            case 'trading':
                // Load chart for current symbol
                await hub.loadChart?.();
                break;
            case 'portfolio':
                // Recalculate portfolio metrics
                await hub.calculateMetrics?.();
                break;
            case 'research':
                // Load watchlist data
                await hub.loadWatchlists?.();
                break;
            case 'learn':
                // Check daily streak
                hub.checkStreak?.();
                break;
        }
    }

    /**
     * Handle symbol selection from any hub
     */
    async handleSymbolSelect(symbol) {
        // Update trading hub with selected symbol
        if (this.hubs.trading) {
            this.hubs.trading.selectedSymbol = symbol;

            // If not already on trading hub, navigate there
            if (this.currentHub !== 'trading') {
                await this.navigateToHub('trading');
            } else {
                // Reload chart with new symbol
                await this.hubs.trading.loadChart();
            }
        }

        UIToast.show({
            message: `Selected ${symbol}`,
            type: 'info'
        });
    }

    /**
     * Handle order execution
     */
    async handleOrderExecuted(order) {
        // Update portfolio
        await this.updatePortfolio(order);

        // Refresh portfolio hub if open
        if (this.currentHub === 'portfolio' && this.hubs.portfolio) {
            const hubContainer = document.getElementById('hub-container');
            if (hubContainer) {
                hubContainer.innerHTML = await this.hubs.portfolio.render();
            }
        }

        // Show notification
        UIToast.show({
            message: `${order.side.toUpperCase()} ${order.quantity} ${order.symbol} @ $${order.price}`,
            type: 'success'
        });

        // Save to history
        this.saveOrderHistory(order);
    }

    /**
     * Handle XP earned in Learn Hub
     */
    handleXPEarned(xp) {
        this.user.learningProgress.xp += xp;

        // Check for level up
        const newLevel = Math.floor(this.user.learningProgress.xp / 1000) + 1;
        if (newLevel > this.user.learningProgress.level) {
            this.user.learningProgress.level = newLevel;
            UIToast.show({
                message: `🎉 Level Up! You're now Level ${newLevel}`,
                type: 'success'
            });
        }

        this.saveUserData();
    }

    /**
     * Get or create trading engine instance
     */
    getTradingEngine() {
        if (!this._tradingEngine) {
            this._tradingEngine = new TradingEngine({
                onOrderExecuted: (order) => this.handleOrderExecuted(order),
                validateFunds: (amount) => this.validateFunds(amount)
            });
        }
        return this._tradingEngine;
    }

    /**
     * Validate if user has sufficient funds
     */
    validateFunds(amount) {
        return this.portfolio.cash >= amount;
    }

    /**
     * Update portfolio after order execution
     */
    async updatePortfolio(order) {
        const { symbol, side, quantity, price } = order;
        const totalCost = quantity * price;

        if (side === 'buy') {
            // Add to positions
            if (!this.portfolio.positions[symbol]) {
                this.portfolio.positions[symbol] = {
                    symbol,
                    quantity: 0,
                    avgCost: 0,
                    totalCost: 0
                };
            }

            const position = this.portfolio.positions[symbol];
            const newTotalCost = position.totalCost + totalCost;
            const newQuantity = position.quantity + quantity;

            position.avgCost = newTotalCost / newQuantity;
            position.quantity = newQuantity;
            position.totalCost = newTotalCost;

            // Deduct from cash
            this.portfolio.cash -= totalCost;
        } else if (side === 'sell') {
            // Remove from positions
            const position = this.portfolio.positions[symbol];
            if (position) {
                position.quantity -= quantity;

                if (position.quantity <= 0) {
                    delete this.portfolio.positions[symbol];
                }
            }

            // Add to cash
            this.portfolio.cash += totalCost;
        }

        // Recalculate total value
        await this.calculatePortfolioValue();

        // Save portfolio
        this.savePortfolio();

        // Update navigation balance display
        if (this.navSystem) {
            this.navSystem.balance = this.portfolio.totalValue;
            const balanceEl = document.querySelector('.nav-balance-value');
            if (balanceEl) {
                balanceEl.textContent = `$${this.portfolio.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }
        }
    }

    /**
     * Calculate total portfolio value
     */
    async calculatePortfolioValue() {
        let totalValue = this.portfolio.cash;

        // Add value of all positions
        for (const symbol in this.portfolio.positions) {
            const position = this.portfolio.positions[symbol];

            // Get current price (in real app, would fetch from API)
            // For now, use average cost as placeholder
            const currentPrice = position.avgCost * 1.05; // Simulate 5% gain
            totalValue += position.quantity * currentPrice;
        }

        this.portfolio.totalValue = totalValue;
    }

    /**
     * Add symbol to watchlist
     */
    addToWatchlist(symbol) {
        const watchlists = this.loadWatchlists();
        const defaultList = watchlists.find(w => w.name === 'My Watchlist') || watchlists[0];

        if (defaultList && !defaultList.symbols.includes(symbol)) {
            defaultList.symbols.push(symbol);
            this.saveWatchlists(watchlists);

            UIToast.show({
                message: `${symbol} added to watchlist`,
                type: 'success'
            });
        }
    }

    /**
     * Export portfolio data
     */
    exportPortfolio() {
        const data = {
            portfolio: this.portfolio,
            exportDate: new Date().toISOString(),
            user: this.user.username
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `portfolio-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        UIToast.show({
            message: 'Portfolio exported successfully',
            type: 'success'
        });
    }

    /**
     * Start background tasks (auto-refresh, notifications, etc.)
     */
    startBackgroundTasks() {
        // Auto-refresh market data every 60 seconds
        this.refreshInterval = setInterval(() => {
            if (this.currentHub === 'markets' && this.hubs.markets) {
                this.hubs.markets.refreshData?.();
            }
        }, 60000);

        // Check for price alerts every 30 seconds
        this.alertInterval = setInterval(() => {
            this.checkPriceAlerts();
        }, 30000);

        // Auto-save every 5 minutes
        if (this.config.autoSave) {
            this.saveInterval = setInterval(() => {
                this.saveAll();
            }, 300000);
        }
    }

    /**
     * Check for price alerts
     */
    async checkPriceAlerts() {
        // Would implement actual price alert checking
        // For now, placeholder
    }

    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K = Quick search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.openQuickSearch();
            }

            // Ctrl/Cmd + 1-5 = Navigate to hubs
            if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '5') {
                e.preventDefault();
                const hubs = ['markets', 'trading', 'portfolio', 'research', 'learn'];
                this.navigateToHub(hubs[parseInt(e.key) - 1]);
            }
        });

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.hub) {
                this.navigateToHub(e.state.hub);
            }
        });

        // Save on page unload
        window.addEventListener('beforeunload', () => {
            this.saveAll();
        });
    }

    /**
     * Open quick search modal
     */
    openQuickSearch() {
        UIToast.show({
            message: 'Quick search coming soon!',
            type: 'info'
        });
    }

    /**
     * Save all data
     */
    saveAll() {
        this.saveUserData();
        this.savePortfolio();
        this.savePreferences();
        console.log('💾 Auto-saved all data');
    }

    /**
     * Data persistence methods
     */
    loadUserData() {
        const data = localStorage.getItem('user');
        return data ? JSON.parse(data) : {
            username: 'Trader',
            email: 'trader@example.com',
            learningProgress: { level: 1, xp: 0, streak: 0 }
        };
    }

    saveUserData() {
        localStorage.setItem('user', JSON.stringify(this.user));
    }

    loadPortfolio() {
        const data = localStorage.getItem('portfolio');
        return data ? JSON.parse(data) : {
            cash: 100000,
            positions: {},
            totalValue: 100000,
            history: []
        };
    }

    savePortfolio() {
        localStorage.setItem('portfolio', JSON.stringify(this.portfolio));
    }

    loadWatchlists() {
        const data = localStorage.getItem('watchlists');
        return data ? JSON.parse(data) : [
            { name: 'My Watchlist', symbols: ['AAPL', 'TSLA', 'NVDA'] }
        ];
    }

    saveWatchlists(watchlists) {
        localStorage.setItem('watchlists', JSON.stringify(watchlists));
    }

    loadPreferences() {
        const data = localStorage.getItem('preferences');
        if (data) {
            const prefs = JSON.parse(data);
            this.config = { ...this.config, ...prefs };
        }
    }

    savePreferences() {
        localStorage.setItem('preferences', JSON.stringify(this.config));
    }

    saveOrderHistory(order) {
        this.portfolio.history = this.portfolio.history || [];
        this.portfolio.history.unshift({
            ...order,
            timestamp: new Date().toISOString()
        });

        // Keep only last 100 orders
        if (this.portfolio.history.length > 100) {
            this.portfolio.history = this.portfolio.history.slice(0, 100);
        }

        this.savePortfolio();
    }

    /**
     * Error handling
     */
    handleError(error) {
        console.error('App Error:', error);
        UIToast.show({
            message: `Error: ${error.message}`,
            type: 'error'
        });
    }

    /**
     * Cleanup
     */
    destroy() {
        // Clear intervals
        if (this.refreshInterval) clearInterval(this.refreshInterval);
        if (this.alertInterval) clearInterval(this.alertInterval);
        if (this.saveInterval) clearInterval(this.saveInterval);

        // Save final state
        this.saveAll();

        console.log('🛑 Trading App destroyed');
    }
}

// Global instance
let tradingApp;

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
    window.TradingApp = TradingApp;

    document.addEventListener('DOMContentLoaded', async () => {
        tradingApp = new TradingApp({
            initialHub: localStorage.getItem('lastHub') || 'markets'
        });

        await tradingApp.init();

        // Make globally accessible
        window.tradingApp = tradingApp;

        // Expose hubs globally for onclick handlers
        window.marketsHub = tradingApp.hubs.markets;
        window.tradingHub = tradingApp.hubs.trading;
        window.portfolioHub = tradingApp.hubs.portfolio;
        window.researchHub = tradingApp.hubs.research;
        window.learnHub = tradingApp.hubs.learn;
        window.navSystem = tradingApp.navSystem;
    });
}
