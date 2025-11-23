// Markets Hub Component
// Central market data dashboard: movers, news, AI analysis, sector heatmap

/**
 * Markets Hub
 * Combines: Top Movers, Market News, AI Analysis, Sector Performance
 */
class MarketsHub {
    constructor(config = {}) {
        this.apiBase = config.apiBase || API_BASE_URL;
        this.activeTab = config.activeTab || 'overview';
        this.refreshInterval = null;
        this.autoRefresh = config.autoRefresh !== false;
    }

    /**
     * Render complete Markets Hub
     */
    async render() {
        const marketStatus = window.TradingViewCharts?.getMarketStatus?.() || { isOpen: false, message: 'Market Closed' };

        return `
            <div class="hub-container markets-hub">
                <!-- Hub Header -->
                <div class="hub-header">
                    <div class="hub-title-group">
                        <h1 class="hub-title">📊 Markets</h1>
                        <p class="hub-subtitle">Live market data, top movers, and analysis</p>
                    </div>
                    <div class="hub-actions">
                        <div class="market-status-badge ${marketStatus.isOpen ? 'open' : 'closed'}">
                            <span class="status-dot"></span>
                            <span>${marketStatus.message}</span>
                            ${marketStatus.nextOpen ? `<span class="next-open">${marketStatus.nextOpen}</span>` : ''}
                        </div>
                        <button class="btn-icon" onclick="marketsHub.refresh()" title="Refresh">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Market Indices -->
                <div class="market-indices">
                    <div id="indices-container" class="indices-grid">
                        ${this.renderIndicesLoading()}
                    </div>
                </div>

                <!-- Hub Tabs -->
                <div class="hub-tabs">
                    ${this.renderTab('overview', '🌐', 'Overview')}
                    ${this.renderTab('movers', '🚀', 'Top Movers')}
                    ${this.renderTab('news', '📰', 'News')}
                    ${this.renderTab('sectors', '📊', 'Sectors')}
                    ${this.renderTab('ai-analysis', '🤖', 'AI Analysis')}
                </div>

                <!-- Tab Content -->
                <div class="hub-content">
                    ${await this.renderActiveTab()}
                </div>
            </div>
        `;
    }

    /**
     * Render tab button
     */
    renderTab(id, icon, label) {
        const active = this.activeTab === id ? 'active' : '';
        return `
            <button class="hub-tab ${active}" onclick="marketsHub.switchTab('${id}')" data-tab="${id}">
                <span class="tab-icon">${icon}</span>
                <span class="tab-label">${label}</span>
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
            case 'movers':
                return await this.renderMovers();
            case 'news':
                return await this.renderNews();
            case 'sectors':
                return await this.renderSectors();
            case 'ai-analysis':
                return await this.renderAIAnalysis();
            default:
                return '<div class="empty-state">Select a tab</div>';
        }
    }

    /**
     * Overview Tab - Dashboard view
     */
    async renderOverview() {
        return `
            <div class="overview-grid">
                <!-- Quick Stats -->
                <div class="stats-section">
                    <h3 class="section-title">Market Summary</h3>
                    <div class="stats-grid">
                        ${UI.Card.statsCard({ label: 'Advancing', value: '1,234', change: 5.2, icon: '📈' })}
                        ${UI.Card.statsCard({ label: 'Declining', value: '856', change: -3.1, icon: '📉' })}
                        ${UI.Card.statsCard({ label: 'Volume', value: '12.5B', icon: '📊' })}
                        ${UI.Card.statsCard({ label: 'New Highs', value: '156', change: 12.3, icon: '🎯' })}
                    </div>
                </div>

                <!-- Top Gainers Preview -->
                <div class="preview-section">
                    <div class="section-header">
                        <h3 class="section-title">🚀 Top Gainers</h3>
                        <button class="btn-link" onclick="marketsHub.switchTab('movers')">View All →</button>
                    </div>
                    <div id="gainers-preview">
                        ${UI.Loader.skeleton({ height: '60px', count: 3 })}
                    </div>
                </div>

                <!-- Market News Preview -->
                <div class="preview-section">
                    <div class="section-header">
                        <h3 class="section-title">📰 Latest News</h3>
                        <button class="btn-link" onclick="marketsHub.switchTab('news')">View All →</button>
                    </div>
                    <div id="news-preview">
                        ${UI.Loader.skeleton({ height: '80px', count: 3 })}
                    </div>
                </div>

                <!-- Sector Performance -->
                <div class="preview-section">
                    <div class="section-header">
                        <h3 class="section-title">📊 Sector Performance</h3>
                        <button class="btn-link" onclick="marketsHub.switchTab('sectors')">View All →</button>
                    </div>
                    <div id="sectors-preview">
                        ${this.renderSectorBars([
                            { name: 'Technology', change: 2.3 },
                            { name: 'Healthcare', change: 1.1 },
                            { name: 'Financials', change: -0.5 },
                            { name: 'Energy', change: -1.2 }
                        ])}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Top Movers Tab
     */
    async renderMovers() {
        return `
            <div class="movers-container">
                <div class="movers-tabs">
                    <button class="mover-tab active" onclick="marketsHub.showMoverType('gainers')">
                        📈 Top Gainers
                    </button>
                    <button class="mover-tab" onclick="marketsHub.showMoverType('losers')">
                        📉 Top Losers
                    </button>
                    <button class="mover-tab" onclick="marketsHub.showMoverType('active')">
                        🔥 Most Active
                    </button>
                </div>

                <div id="movers-table-container">
                    ${UI.Table.render({
                        headers: ['Symbol', 'Name', 'Price', 'Change', 'Change %', 'Volume', 'Action'],
                        rows: [],
                        sortable: true,
                        emptyMessage: 'Loading top movers...'
                    })}
                </div>
            </div>
        `;
    }

    /**
     * Market News Tab
     */
    async renderNews() {
        return `
            <div class="news-container">
                <div class="news-filters">
                    <input type="text"
                           class="search-input"
                           placeholder="Search news..."
                           onkeyup="marketsHub.filterNews(this.value)">
                    <select class="filter-select" onchange="marketsHub.filterNewsBySentiment(this.value)">
                        <option value="all">All Sentiment</option>
                        <option value="positive">Positive</option>
                        <option value="negative">Negative</option>
                        <option value="neutral">Neutral</option>
                    </select>
                </div>

                <div id="news-feed-container" class="news-feed">
                    ${UI.Loader.skeleton({ height: '120px', count: 5 })}
                </div>
            </div>
        `;
    }

    /**
     * Sectors Tab
     */
    async renderSectors() {
        return `
            <div class="sectors-container">
                <div class="sectors-header">
                    <h3>Sector Performance - Today</h3>
                    <div class="timeframe-selector">
                        <button class="timeframe-btn active" onclick="marketsHub.setSectorTimeframe('1D')">1D</button>
                        <button class="timeframe-btn" onclick="marketsHub.setSectorTimeframe('1W')">1W</button>
                        <button class="timeframe-btn" onclick="marketsHub.setSectorTimeframe('1M')">1M</button>
                        <button class="timeframe-btn" onclick="marketsHub.setSectorTimeframe('YTD')">YTD</button>
                    </div>
                </div>

                <!-- Sector Heatmap -->
                <div id="sector-heatmap" class="sector-heatmap">
                    ${this.renderSectorHeatmap()}
                </div>

                <!-- Sector Details Table -->
                <div id="sector-details" class="sector-details">
                    ${this.renderSectorDetailsTable()}
                </div>
            </div>
        `;
    }

    /**
     * AI Analysis Tab
     */
    async renderAIAnalysis() {
        return `
            <div class="ai-analysis-container">
                ${UI.Card.render({
                    title: '🤖 AI Market Analysis',
                    subtitle: 'Powered by advanced analytics',
                    content: `
                        <div class="ai-insights">
                            <div class="insight-card">
                                <h4>📈 Market Sentiment</h4>
                                <div class="sentiment-meter">
                                    <div class="sentiment-bar" style="width: 65%">Bullish 65%</div>
                                </div>
                                <p class="insight-text">
                                    Overall market sentiment is bullish with strong buying pressure in tech and healthcare sectors.
                                </p>
                            </div>

                            <div class="insight-card">
                                <h4>🎯 Trading Opportunities</h4>
                                <ul class="opportunity-list">
                                    <li><strong>AAPL:</strong> Breaking resistance at $180 - potential upside to $185</li>
                                    <li><strong>TSLA:</strong> Oversold on RSI - possible bounce near $235</li>
                                    <li><strong>NVDA:</strong> Strong momentum - watch for pullback to $490</li>
                                </ul>
                            </div>

                            <div class="insight-card">
                                <h4>⚠️ Risk Alerts</h4>
                                <ul class="alert-list">
                                    <li class="alert-warning">High volatility expected in tech sector</li>
                                    <li class="alert-info">Earnings season approaching - increased uncertainty</li>
                                    <li class="alert-success">Market breadth improving - healthy advance</li>
                                </ul>
                            </div>

                            <div class="insight-card">
                                <h4>📊 Pattern Recognition</h4>
                                <div class="patterns-detected">
                                    <span class="pattern-badge bullish">Bull Flag: AAPL, MSFT</span>
                                    <span class="pattern-badge bearish">Head & Shoulders: META</span>
                                    <span class="pattern-badge neutral">Triangle: GOOGL</span>
                                </div>
                            </div>
                        </div>
                    `
                })}
            </div>
        `;
    }

    /**
     * Render market indices (S&P, Nasdaq, Dow)
     */
    renderIndicesLoading() {
        return UI.Loader.skeleton({ height: '80px', width: '32%', count: 3 });
    }

    async loadIndices() {
        const indices = [
            { symbol: '^GSPC', name: 'S&P 500', value: '4,783.45', change: '+1.2%', changeValue: 56.89 },
            { symbol: '^IXIC', name: 'NASDAQ', value: '15,095.14', change: '+1.8%', changeValue: 267.31 },
            { symbol: '^DJI', name: 'DOW JONES', value: '37,863.80', change: '+0.9%', changeValue: 337.03 }
        ];

        const container = document.getElementById('indices-container');
        if (!container) return;

        container.innerHTML = indices.map(index => `
            <div class="index-card ${parseFloat(index.changeValue) >= 0 ? 'positive' : 'negative'}">
                <div class="index-header">
                    <span class="index-name">${index.name}</span>
                    <span class="index-change">${index.change}</span>
                </div>
                <div class="index-value">${index.value}</div>
                <div class="index-change-value">${index.changeValue >= 0 ? '+' : ''}${index.changeValue}</div>
            </div>
        `).join('');
    }

    /**
     * Render sector performance bars
     */
    renderSectorBars(sectors) {
        return sectors.map(sector => {
            const isPositive = sector.change >= 0;
            const width = Math.min(Math.abs(sector.change) * 20, 100);
            return `
                <div class="sector-bar-item">
                    <span class="sector-name">${sector.name}</span>
                    <div class="sector-bar-container">
                        <div class="sector-bar ${isPositive ? 'positive' : 'negative'}"
                             style="width: ${width}%">
                        </div>
                    </div>
                    <span class="sector-change ${isPositive ? 'positive' : 'negative'}">
                        ${isPositive ? '+' : ''}${sector.change.toFixed(2)}%
                    </span>
                </div>
            `;
        }).join('');
    }

    /**
     * Render sector heatmap
     */
    renderSectorHeatmap() {
        const sectors = [
            { name: 'Technology', change: 2.3, size: 'large' },
            { name: 'Healthcare', change: 1.1, size: 'medium' },
            { name: 'Financials', change: -0.5, size: 'large' },
            { name: 'Consumer', change: 0.8, size: 'medium' },
            { name: 'Energy', change: -1.2, size: 'small' },
            { name: 'Industrials', change: 0.3, size: 'medium' },
            { name: 'Materials', change: -0.7, size: 'small' },
            { name: 'Utilities', change: 0.2, size: 'small' },
            { name: 'Real Estate', change: -0.3, size: 'small' },
            { name: 'Telecom', change: 0.5, size: 'small' }
        ];

        return `
            <div class="heatmap-grid">
                ${sectors.map(sector => {
                    const intensity = Math.min(Math.abs(sector.change) * 40, 100);
                    const bgColor = sector.change >= 0
                        ? `rgba(16, 185, 129, ${intensity / 100})`
                        : `rgba(239, 68, 68, ${intensity / 100})`;

                    return `
                        <div class="heatmap-cell ${sector.size}"
                             style="background: ${bgColor}"
                             title="${sector.name}: ${sector.change >= 0 ? '+' : ''}${sector.change}%">
                            <div class="cell-name">${sector.name}</div>
                            <div class="cell-change">${sector.change >= 0 ? '+' : ''}${sector.change}%</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    /**
     * Render sector details table
     */
    renderSectorDetailsTable() {
        return UI.Table.render({
            headers: ['Sector', 'Change %', 'Market Cap', 'Volume', 'Top Stock', 'Trend'],
            rows: [
                ['Technology', '<span class="positive">+2.3%</span>', '$15.2T', '45.2B', 'AAPL', '📈'],
                ['Healthcare', '<span class="positive">+1.1%</span>', '$8.7T', '28.1B', 'UNH', '📈'],
                ['Financials', '<span class="negative">-0.5%</span>', '$11.3T', '32.4B', 'JPM', '📉'],
                ['Energy', '<span class="negative">-1.2%</span>', '$4.9T', '18.7B', 'XOM', '📉']
            ],
            sortable: true
        });
    }

    /**
     * Tab switching
     */
    async switchTab(tabId) {
        this.activeTab = tabId;

        // Update tab buttons
        document.querySelectorAll('.hub-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabId);
        });

        // Update content
        const content = document.querySelector('.hub-content');
        if (content) {
            content.innerHTML = UI.Loader.spinner('lg');
            content.innerHTML = await this.renderActiveTab();

            // Load data based on tab
            await this.loadTabData(tabId);
        }
    }

    /**
     * Load data for specific tab
     */
    async loadTabData(tabId) {
        switch (tabId) {
            case 'overview':
                await this.loadOverviewData();
                break;
            case 'movers':
                await this.loadMoversData();
                break;
            case 'news':
                await this.loadNewsData();
                break;
            case 'sectors':
                await this.loadSectorsData();
                break;
            case 'ai-analysis':
                await this.loadAIAnalysisData();
                break;
        }
    }

    /**
     * Load overview data
     */
    async loadOverviewData() {
        await this.loadIndices();
        // Load gainers preview, news preview, etc.
    }

    /**
     * Load movers data
     */
    async loadMoversData() {
        // Fetch from API or use sample data
        const movers = [
            { symbol: 'NVDA', name: 'NVIDIA', price: 495.20, change: 15.30, changePercent: 3.2, volume: '45.2M' },
            { symbol: 'TSLA', name: 'Tesla', price: 242.80, change: -8.20, changePercent: -3.3, volume: '125.8M' },
            { symbol: 'AAPL', name: 'Apple', price: 178.50, change: 3.50, changePercent: 2.0, volume: '52.1M' }
        ];

        const rows = movers.map(stock => [
            `<strong>${stock.symbol}</strong>`,
            stock.name,
            `$${stock.price.toFixed(2)}`,
            `<span class="${stock.change >= 0 ? 'positive' : 'negative'}">${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)}</span>`,
            `<span class="${stock.changePercent >= 0 ? 'positive' : 'negative'}">${stock.changePercent >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%</span>`,
            stock.volume,
            `<button class="btn-sm" onclick="tradingHub.quickTrade('${stock.symbol}')">Trade</button>`
        ]);

        const container = document.getElementById('movers-table-container');
        if (container) {
            container.innerHTML = UI.Table.render({
                headers: ['Symbol', 'Name', 'Price', 'Change', 'Change %', 'Volume', 'Action'],
                rows: rows,
                sortable: true
            });
        }
    }

    /**
     * Load news data
     */
    async loadNewsData() {
        if (typeof window.newsFeed === 'undefined') return;

        try {
            const news = await window.newsFeed.fetchMarketNews(FINNHUB_API_KEY);
            const container = document.getElementById('news-feed-container');

            if (container && news.length > 0) {
                container.innerHTML = news.slice(0, 20).map(article => `
                    <div class="news-item" onclick="window.open('${article.url}', '_blank')">
                        ${article.image ? `<img src="${article.image}" class="news-image" onerror="this.style.display='none'">` : ''}
                        <div class="news-content">
                            <h4 class="news-title">${article.headline}</h4>
                            <p class="news-summary">${(article.summary || '').substring(0, 150)}...</p>
                            <div class="news-meta">
                                <span class="news-source">${article.source}</span>
                                <span class="news-time">${window.newsFeed.formatNewsDate(article.datetime)}</span>
                                <span class="news-sentiment ${article.sentiment}">${article.sentiment}</span>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error('Failed to load news:', error);
        }
    }

    /**
     * Load sectors data
     */
    async loadSectorsData() {
        // Already rendered in the tab
    }

    /**
     * Load AI analysis data
     */
    async loadAIAnalysisData() {
        // Already rendered in the tab
    }

    /**
     * Refresh all data
     */
    async refresh() {
        UIToast.show({ message: 'Refreshing market data...', type: 'info', duration: 1000 });
        await this.loadTabData(this.activeTab);
        await this.loadIndices();
    }

    /**
     * Start auto-refresh
     */
    startAutoRefresh() {
        if (this.refreshInterval) return;

        this.refreshInterval = setInterval(async () => {
            if (window.TradingViewCharts?.isMarketOpen?.()) {
                await this.refresh();
            }
        }, 60000); // Refresh every minute during market hours
    }

    /**
     * Stop auto-refresh
     */
    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }
}

// Export
if (typeof window !== 'undefined') {
    window.MarketsHub = MarketsHub;
}
