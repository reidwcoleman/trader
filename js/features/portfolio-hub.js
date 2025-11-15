// Portfolio Hub Component
// Comprehensive portfolio analytics: positions, P&L, performance metrics

/**
 * Portfolio Hub
 * Track holdings, analyze performance, view trade history
 */
class PortfolioHub {
    constructor(config = {}) {
        this.apiBase = config.apiBase || API_BASE_URL;
        this.userId = config.userId || null;
        this.activeTab = config.activeTab || 'overview';
        this.timeframe = '1M';
        this.chartInstance = null;
    }

    /**
     * Render complete Portfolio Hub
     */
    async render() {
        return `
            <div class="hub-container portfolio-hub">
                <!-- Hub Header with Portfolio Summary -->
                <div class="hub-header">
                    <div class="hub-title-group">
                        <h1 class="hub-title">💼 Portfolio</h1>
                        <p class="hub-subtitle">Track your holdings and performance</p>
                    </div>
                    <div class="portfolio-summary-cards">
                        ${await this.renderPortfolioSummary()}
                    </div>
                </div>

                <!-- Portfolio Value Chart -->
                <div class="portfolio-chart-section">
                    <div class="chart-header">
                        <h3>Portfolio Value</h3>
                        <div class="timeframe-selector">
                            ${this.renderTimeframeButton('1D')}
                            ${this.renderTimeframeButton('1W')}
                            ${this.renderTimeframeButton('1M', true)}
                            ${this.renderTimeframeButton('3M')}
                            ${this.renderTimeframeButton('1Y')}
                            ${this.renderTimeframeButton('ALL')}
                        </div>
                    </div>
                    <div id="portfolio-value-chart" class="portfolio-chart">
                        ${UI.Loader.skeleton({ height: '300px' })}
                    </div>
                </div>

                <!-- Hub Tabs -->
                <div class="hub-tabs">
                    ${this.renderTab('overview', '📊', 'Overview')}
                    ${this.renderTab('holdings', '📈', 'Holdings')}
                    ${this.renderTab('history', '🕐', 'History')}
                    ${this.renderTab('analytics', '📉', 'Analytics')}
                </div>

                <!-- Tab Content -->
                <div class="hub-content">
                    ${await this.renderActiveTab()}
                </div>
            </div>
        `;
    }

    /**
     * Render portfolio summary cards
     */
    async renderPortfolioSummary() {
        // This would fetch from API in production
        const summary = {
            totalValue: 52450.00,
            cash: 10000.00,
            todayPL: 1250.50,
            todayPLPercent: 2.45,
            totalPL: 2450.00,
            totalPLPercent: 4.9
        };

        return `
            ${UI.Card.statsCard({
                label: 'Total Value',
                value: '$' + summary.totalValue.toLocaleString(),
                icon: '💰'
            })}
            ${UI.Card.statsCard({
                label: "Today's P&L",
                value: '$' + summary.todayPL.toLocaleString(),
                change: summary.todayPLPercent,
                icon: '📊'
            })}
            ${UI.Card.statsCard({
                label: 'Total P&L',
                value: '$' + summary.totalPL.toLocaleString(),
                change: summary.totalPLPercent,
                icon: '📈'
            })}
        `;
    }

    /**
     * Render tab button
     */
    renderTab(id, icon, label) {
        const active = this.activeTab === id ? 'active' : '';
        return `
            <button class="hub-tab ${active}" onclick="portfolioHub.switchTab('${id}')" data-tab="${id}">
                <span class="tab-icon">${icon}</span>
                <span class="tab-label">${label}</span>
            </button>
        `;
    }

    /**
     * Render timeframe button
     */
    renderTimeframeButton(tf, active = false) {
        return `
            <button class="timeframe-btn ${active ? 'active' : ''}"
                    onclick="portfolioHub.setTimeframe('${tf}')"
                    data-timeframe="${tf}">
                ${tf}
            </button>
        `;
    }

    /**
     * Render active tab content
     */
    async renderActiveTab() {
        switch (this.activeTab) {
            case 'overview':
                return await this.renderOverview();
            case 'holdings':
                return await this.renderHoldings();
            case 'history':
                return await this.renderHistory();
            case 'analytics':
                return await this.renderAnalytics();
            default:
                return '<div class="empty-state">Select a tab</div>';
        }
    }

    /**
     * Overview Tab
     */
    async renderOverview() {
        return `
            <div class="overview-grid">
                <!-- Asset Allocation Pie Chart -->
                <div class="allocation-section">
                    ${UI.Card.render({
                        title: '🥧 Asset Allocation',
                        content: `
                            <div id="allocation-chart" class="allocation-chart">
                                ${this.renderAllocationChart()}
                            </div>
                        `
                    })}
                </div>

                <!-- Top Holdings -->
                <div class="top-holdings-section">
                    ${UI.Card.render({
                        title: '⭐ Top Holdings',
                        content: `
                            <div class="top-holdings-list">
                                ${this.renderTopHoldings()}
                            </div>
                        `
                    })}
                </div>

                <!-- Performance Metrics -->
                <div class="metrics-section">
                    ${UI.Card.render({
                        title: '📊 Performance Metrics',
                        content: `
                            <div class="metrics-grid">
                                <div class="metric-item">
                                    <span class="metric-label">Win Rate</span>
                                    <span class="metric-value">65.2%</span>
                                </div>
                                <div class="metric-item">
                                    <span class="metric-label">Avg Gain</span>
                                    <span class="metric-value positive">+$245</span>
                                </div>
                                <div class="metric-item">
                                    <span class="metric-label">Avg Loss</span>
                                    <span class="metric-value negative">-$128</span>
                                </div>
                                <div class="metric-item">
                                    <span class="metric-label">Sharpe Ratio</span>
                                    <span class="metric-value">1.85</span>
                                </div>
                                <div class="metric-item">
                                    <span class="metric-label">Total Trades</span>
                                    <span class="metric-value">127</span>
                                </div>
                                <div class="metric-item">
                                    <span class="metric-label">Best Trade</span>
                                    <span class="metric-value positive">+$1,245</span>
                                </div>
                            </div>
                        `
                    })}
                </div>

                <!-- Recent Activity -->
                <div class="activity-section">
                    ${UI.Card.render({
                        title: '🕐 Recent Activity',
                        content: `
                            <div id="recent-activity" class="activity-list">
                                ${this.renderRecentActivity()}
                            </div>
                        `
                    })}
                </div>
            </div>
        `;
    }

    /**
     * Holdings Tab
     */
    async renderHoldings() {
        const holdings = await this.fetchHoldings();

        return `
            <div class="holdings-container">
                <div class="holdings-actions">
                    <input type="text"
                           class="search-input"
                           placeholder="Search holdings..."
                           onkeyup="portfolioHub.filterHoldings(this.value)">
                    <button class="btn-secondary" onclick="portfolioHub.exportHoldings()">
                        📥 Export CSV
                    </button>
                </div>

                <div id="holdings-table">
                    ${UI.Table.render({
                        headers: [
                            'Symbol',
                            'Shares',
                            'Avg Cost',
                            'Current Price',
                            'Market Value',
                            'P&L',
                            'P&L %',
                            'Weight',
                            'Actions'
                        ],
                        rows: holdings.map(h => [
                            `<strong>${h.symbol}</strong>`,
                            h.quantity,
                            `$${h.avgCost.toFixed(2)}`,
                            `$${h.currentPrice.toFixed(2)}`,
                            `$${h.marketValue.toLocaleString()}`,
                            `<span class="${h.pl >= 0 ? 'positive' : 'negative'}">$${h.pl.toFixed(2)}</span>`,
                            `<span class="${h.plPercent >= 0 ? 'positive' : 'negative'}">${h.plPercent >= 0 ? '+' : ''}${h.plPercent.toFixed(2)}%</span>`,
                            `${h.weight.toFixed(1)}%`,
                            `<button class="btn-sm" onclick="tradingHub.quickTrade('${h.symbol}')">Trade</button>`
                        ]),
                        sortable: true
                    })}
                </div>
            </div>
        `;
    }

    /**
     * History Tab
     */
    async renderHistory() {
        const trades = await this.fetchTradeHistory();

        return `
            <div class="history-container">
                <div class="history-filters">
                    <select class="filter-select" onchange="portfolioHub.filterByType(this.value)">
                        <option value="all">All Trades</option>
                        <option value="buy">Buys Only</option>
                        <option value="sell">Sells Only</option>
                        <option value="options">Options</option>
                    </select>
                    <input type="date" class="date-input" onchange="portfolioHub.filterByDate(this.value)">
                    <button class="btn-secondary" onclick="portfolioHub.exportHistory()">
                        📥 Export CSV
                    </button>
                </div>

                <div id="history-table">
                    ${UI.Table.render({
                        headers: [
                            'Date',
                            'Symbol',
                            'Type',
                            'Side',
                            'Quantity',
                            'Price',
                            'Total',
                            'P&L',
                            'Status'
                        ],
                        rows: trades.map(t => [
                            new Date(t.timestamp).toLocaleDateString(),
                            `<strong>${t.symbol}</strong>`,
                            t.orderType,
                            `<span class="side-badge ${t.side}">${t.side.toUpperCase()}</span>`,
                            t.quantity,
                            `$${t.price.toFixed(2)}`,
                            `$${Math.abs(t.totalCost).toLocaleString()}`,
                            t.pl ? `<span class="${t.pl >= 0 ? 'positive' : 'negative'}">$${t.pl.toFixed(2)}</span>` : '-',
                            `<span class="status-badge ${t.status}">${t.status}</span>`
                        ]),
                        sortable: true
                    })}
                </div>
            </div>
        `;
    }

    /**
     * Analytics Tab
     */
    async renderAnalytics() {
        return `
            <div class="analytics-container">
                <!-- P&L Over Time Chart -->
                <div class="analytics-section">
                    ${UI.Card.render({
                        title: '📈 P&L Over Time',
                        content: `
                            <div id="pl-chart" style="height: 300px;">
                                ${UI.Loader.skeleton({ height: '300px' })}
                            </div>
                        `
                    })}
                </div>

                <!-- Win/Loss Distribution -->
                <div class="analytics-grid">
                    <div class="analytics-section">
                        ${UI.Card.render({
                            title: '🎯 Win/Loss Distribution',
                            content: `
                                <div class="distribution-chart">
                                    <div class="bar-chart">
                                        <div class="bar-item">
                                            <span class="bar-label">Wins</span>
                                            <div class="bar positive" style="width: 65%">65%</div>
                                        </div>
                                        <div class="bar-item">
                                            <span class="bar-label">Losses</span>
                                            <div class="bar negative" style="width: 35%">35%</div>
                                        </div>
                                    </div>
                                </div>
                            `
                        })}
                    </div>

                    <!-- Trade Analysis -->
                    <div class="analytics-section">
                        ${UI.Card.render({
                            title: '📊 Trade Analysis',
                            content: `
                                <div class="analysis-stats">
                                    <div class="stat-row">
                                        <span>Total Trades:</span>
                                        <strong>127</strong>
                                    </div>
                                    <div class="stat-row">
                                        <span>Winning Trades:</span>
                                        <strong class="positive">83</strong>
                                    </div>
                                    <div class="stat-row">
                                        <span>Losing Trades:</span>
                                        <strong class="negative">44</strong>
                                    </div>
                                    <div class="stat-row">
                                        <span>Avg Hold Time:</span>
                                        <strong>4.2 days</strong>
                                    </div>
                                    <div class="stat-row">
                                        <span>Largest Win:</span>
                                        <strong class="positive">$1,245</strong>
                                    </div>
                                    <div class="stat-row">
                                        <span>Largest Loss:</span>
                                        <strong class="negative">-$456</strong>
                                    </div>
                                </div>
                            `
                        })}
                    </div>
                </div>

                <!-- Risk Metrics -->
                <div class="analytics-section">
                    ${UI.Card.render({
                        title: '⚠️ Risk Metrics',
                        content: `
                            <div class="risk-metrics">
                                <div class="risk-item">
                                    <span class="risk-label">Portfolio Beta</span>
                                    <span class="risk-value">1.15</span>
                                    <span class="risk-desc">Slightly more volatile than market</span>
                                </div>
                                <div class="risk-item">
                                    <span class="risk-label">Max Drawdown</span>
                                    <span class="risk-value negative">-8.5%</span>
                                    <span class="risk-desc">Largest peak-to-trough decline</span>
                                </div>
                                <div class="risk-item">
                                    <span class="risk-label">Volatility (30d)</span>
                                    <span class="risk-value">12.3%</span>
                                    <span class="risk-desc">Portfolio standard deviation</span>
                                </div>
                            </div>
                        `
                    })}
                </div>
            </div>
        `;
    }

    /**
     * Render allocation chart (pie chart)
     */
    renderAllocationChart() {
        const allocations = [
            { name: 'Technology', value: 45, color: '#10b981' },
            { name: 'Healthcare', value: 25, color: '#3b82f6' },
            { name: 'Financials', value: 20, color: '#8b5cf6' },
            { name: 'Cash', value: 10, color: '#888' }
        ];

        return `
            <div class="pie-chart">
                ${allocations.map(a => `
                    <div class="allocation-item">
                        <span class="allocation-dot" style="background: ${a.color}"></span>
                        <span class="allocation-name">${a.name}</span>
                        <span class="allocation-value">${a.value}%</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Render top holdings list
     */
    renderTopHoldings() {
        const holdings = [
            { symbol: 'AAPL', value: 17850, pl: 850, plPercent: 5.0 },
            { symbol: 'TSLA', value: 12140, pl: -360, plPercent: -2.9 },
            { symbol: 'NVDA', value: 9904, pl: 1204, plPercent: 13.8 }
        ];

        return holdings.map(h => `
            <div class="holding-item">
                <div class="holding-info">
                    <strong>${h.symbol}</strong>
                    <span class="holding-value">$${h.value.toLocaleString()}</span>
                </div>
                <div class="holding-pl ${h.pl >= 0 ? 'positive' : 'negative'}">
                    ${h.pl >= 0 ? '+' : ''}$${h.pl} (${h.plPercent >= 0 ? '+' : ''}${h.plPercent}%)
                </div>
            </div>
        `).join('');
    }

    /**
     * Render recent activity
     */
    renderRecentActivity() {
        const activities = [
            { action: 'BUY', symbol: 'AAPL', quantity: 10, price: 178.50, time: '2 hours ago' },
            { action: 'SELL', symbol: 'TSLA', quantity: 5, price: 242.80, time: '1 day ago' },
            { action: 'BUY', symbol: 'NVDA', quantity: 20, price: 495.20, time: '2 days ago' }
        ];

        return activities.map(a => `
            <div class="activity-item">
                <span class="activity-action ${a.action.toLowerCase()}">${a.action}</span>
                <strong>${a.symbol}</strong>
                <span>${a.quantity} @ $${a.price}</span>
                <span class="activity-time">${a.time}</span>
            </div>
        `).join('');
    }

    /**
     * Fetch holdings from API
     */
    async fetchHoldings() {
        // Mock data - replace with API call
        return [
            {
                symbol: 'AAPL',
                quantity: 100,
                avgCost: 170.00,
                currentPrice: 178.50,
                marketValue: 17850,
                pl: 850,
                plPercent: 5.0,
                weight: 34.0
            },
            {
                symbol: 'TSLA',
                quantity: 50,
                avgCost: 250.00,
                currentPrice: 242.80,
                marketValue: 12140,
                pl: -360,
                plPercent: -2.9,
                weight: 23.1
            },
            {
                symbol: 'NVDA',
                quantity: 20,
                avgCost: 435.00,
                currentPrice: 495.20,
                marketValue: 9904,
                pl: 1204,
                plPercent: 13.8,
                weight: 18.9
            }
        ];
    }

    /**
     * Fetch trade history from API
     */
    async fetchTradeHistory() {
        // Mock data - replace with API call
        return [
            {
                timestamp: Date.now() - 86400000 * 2,
                symbol: 'AAPL',
                orderType: 'market',
                side: 'buy',
                quantity: 100,
                price: 170.00,
                totalCost: 17000,
                pl: 850,
                status: 'filled'
            },
            {
                timestamp: Date.now() - 86400000 * 5,
                symbol: 'TSLA',
                orderType: 'limit',
                side: 'buy',
                quantity: 50,
                price: 250.00,
                totalCost: 12500,
                pl: -360,
                status: 'filled'
            }
        ];
    }

    /**
     * Switch tabs
     */
    async switchTab(tabId) {
        this.activeTab = tabId;

        document.querySelectorAll('.hub-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabId);
        });

        const content = document.querySelector('.hub-content');
        if (content) {
            content.innerHTML = UI.Loader.spinner('lg');
            content.innerHTML = await this.renderActiveTab();
        }
    }

    /**
     * Set timeframe for portfolio chart
     */
    setTimeframe(tf) {
        this.timeframe = tf;

        document.querySelectorAll('.timeframe-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.timeframe === tf);
        });

        // Reload chart with new timeframe
        this.loadPortfolioChart();
    }

    /**
     * Load portfolio value chart
     */
    async loadPortfolioChart() {
        const container = document.getElementById('portfolio-value-chart');
        if (!container) return;

        // Generate sample portfolio growth data
        const data = window.TradingViewCharts.generateSampleChartData('uptrend', 30);

        // Create line chart instead of candlestick
        container.innerHTML = '<div style="height: 300px; display: flex; align-items: center; justify-content: center; color: #10b981; font-size: 32px; font-weight: 700;">Portfolio chart placeholder</div>';
    }

    /**
     * Export holdings to CSV
     */
    async exportHoldings() {
        const holdings = await this.fetchHoldings();
        const csv = this.convertToCSV(holdings);
        this.downloadCSV(csv, 'holdings.csv');

        UIToast.show({
            message: 'Holdings exported successfully',
            type: 'success'
        });
    }

    /**
     * Export history to CSV
     */
    async exportHistory() {
        const history = await this.fetchTradeHistory();
        const csv = this.convertToCSV(history);
        this.downloadCSV(csv, 'trade-history.csv');

        UIToast.show({
            message: 'Trade history exported successfully',
            type: 'success'
        });
    }

    /**
     * Convert array to CSV
     */
    convertToCSV(data) {
        if (data.length === 0) return '';

        const headers = Object.keys(data[0]);
        const rows = data.map(obj => headers.map(h => obj[h]));

        return [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');
    }

    /**
     * Download CSV file
     */
    downloadCSV(csv, filename) {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Export
if (typeof window !== 'undefined') {
    window.PortfolioHub = PortfolioHub;
}
