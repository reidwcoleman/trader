// Research Hub Component
// Tools for stock research: watchlist, screener, calculators

/**
 * Research Hub
 * Advanced research tools and watchlist management
 */
class ResearchHub {
    constructor(config = {}) {
        this.activeTab = config.activeTab || 'watchlist';
        this.watchlists = [];
        this.screenerFilters = {};
    }

    /**
     * Render complete Research Hub
     */
    async render() {
        return `
            <div class="hub-container research-hub">
                <div class="hub-header">
                    <div class="hub-title-group">
                        <h1 class="hub-title">🔍 Research</h1>
                        <p class="hub-subtitle">Tools and data for informed decisions</p>
                    </div>
                </div>

                <div class="hub-tabs">
                    ${this.renderTab('watchlist', '👁️', 'Watchlist')}
                    ${this.renderTab('screener', '🔎', 'Screener')}
                    ${this.renderTab('calculators', '🧮', 'Calculators')}
                    ${this.renderTab('analysis', '📊', 'Analysis')}
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
            <button class="hub-tab ${active}" onclick="researchHub.switchTab('${id}')" data-tab="${id}">
                <span class="tab-icon">${icon}</span>
                <span class="tab-label">${label}</span>
            </button>
        `;
    }

    async renderActiveTab() {
        switch (this.activeTab) {
            case 'watchlist':
                return await this.renderWatchlist();
            case 'screener':
                return await this.renderScreener();
            case 'calculators':
                return await this.renderCalculators();
            case 'analysis':
                return await this.renderAnalysis();
            default:
                return '';
        }
    }

    /**
     * Watchlist Tab
     */
    async renderWatchlist() {
        return `
            <div class="watchlist-container">
                <div class="watchlist-header">
                    <div class="watchlist-selector">
                        <select class="watchlist-dropdown" onchange="researchHub.switchWatchlist(this.value)">
                            <option value="default">My Watchlist</option>
                            <option value="crypto">Crypto Watchlist</option>
                            <option value="tech">Tech Stocks</option>
                        </select>
                        ${UI.Button.render({
                            label: '+ New List',
                            variant: 'secondary',
                            size: 'sm',
                            onClick: 'researchHub.createWatchlist()'
                        })}
                    </div>
                    <div class="watchlist-actions">
                        <input type="text" class="search-input" placeholder="Add symbol..." onkeypress="if(event.key==='Enter')researchHub.addSymbol(this.value)">
                    </div>
                </div>

                <div class="watchlist-table">
                    ${UI.Table.render({
                        headers: ['Symbol', 'Price', 'Change', 'Change %', 'Volume', 'Market Cap', 'Alert', 'Actions'],
                        rows: [
                            ['<strong>AAPL</strong>', '$178.50', '<span class="positive">+$2.15</span>', '<span class="positive">+1.22%</span>', '52.1M', '$2.8T', '🔔', '<button class="btn-sm" onclick="tradingHub.quickTrade(\'AAPL\')">Trade</button>'],
                            ['<strong>TSLA</strong>', '$242.80', '<span class="negative">-$8.20</span>', '<span class="negative">-3.27%</span>', '125.8M', '$771B', '🔕', '<button class="btn-sm" onclick="tradingHub.quickTrade(\'TSLA\')">Trade</button>'],
                            ['<strong>NVDA</strong>', '$495.20', '<span class="positive">+$15.30</span>', '<span class="positive">+3.19%</span>', '45.2M', '$1.2T', '🔔', '<button class="btn-sm" onclick="tradingHub.quickTrade(\'NVDA\')">Trade</button>']
                        ],
                        sortable: true
                    })}
                </div>
            </div>
        `;
    }

    /**
     * Stock Screener Tab
     */
    async renderScreener() {
        return `
            <div class="screener-container">
                <div class="screener-filters">
                    <h3>Filter Criteria</h3>
                    <div class="filters-grid">
                        <div class="filter-group">
                            <label>Market Cap</label>
                            ${UI.Form.select({
                                name: 'marketCap',
                                options: [
                                    { value: 'all', label: 'All' },
                                    { value: 'mega', label: 'Mega (>$200B)' },
                                    { value: 'large', label: 'Large ($10B-$200B)' },
                                    { value: 'mid', label: 'Mid ($2B-$10B)' },
                                    { value: 'small', label: 'Small (<$2B)' }
                                ]
                            })}
                        </div>
                        <div class="filter-group">
                            <label>Sector</label>
                            ${UI.Form.select({
                                name: 'sector',
                                options: [
                                    { value: 'all', label: 'All Sectors' },
                                    { value: 'tech', label: 'Technology' },
                                    { value: 'health', label: 'Healthcare' },
                                    { value: 'finance', label: 'Financials' },
                                    { value: 'energy', label: 'Energy' }
                                ]
                            })}
                        </div>
                        <div class="filter-group">
                            <label>Price Change %</label>
                            ${UI.Form.input({ type: 'number', name: 'priceChange', placeholder: 'Min %' })}
                        </div>
                        <div class="filter-group">
                            <label>Volume</label>
                            ${UI.Form.input({ type: 'number', name: 'volume', placeholder: 'Min volume' })}
                        </div>
                    </div>
                    ${UI.Button.render({ label: '🔍 Run Screen', variant: 'primary', onClick: 'researchHub.runScreener()' })}
                </div>

                <div id="screener-results" class="screener-results">
                    <div class="empty-state">Set filters and click "Run Screen"</div>
                </div>
            </div>
        `;
    }

    /**
     * Calculators Tab
     */
    async renderCalculators() {
        return `
            <div class="calculators-container">
                <div class="calculators-grid">
                    ${UI.Card.render({
                        title: '💰 P&L Calculator',
                        icon: '💰',
                        content: `
                            <div class="calculator-form">
                                ${UI.Form.input({ label: 'Entry Price', name: 'entryPrice', type: 'number', placeholder: '100.00' })}
                                ${UI.Form.input({ label: 'Exit Price', name: 'exitPrice', type: 'number', placeholder: '110.00' })}
                                ${UI.Form.input({ label: 'Quantity', name: 'quantity', type: 'number', placeholder: '10' })}
                                ${UI.Button.render({ label: 'Calculate P&L', variant: 'primary', onClick: 'researchHub.calculatePL()', fullWidth: true })}
                                <div id="pl-result" class="calc-result"></div>
                            </div>
                        `
                    })}

                    ${UI.Card.render({
                        title: '📊 Position Size Calculator',
                        content: `
                            <div class="calculator-form">
                                ${UI.Form.input({ label: 'Account Size', name: 'accountSize', type: 'number', placeholder: '50000' })}
                                ${UI.Form.input({ label: 'Risk %', name: 'riskPercent', type: 'number', placeholder: '2' })}
                                ${UI.Form.input({ label: 'Entry Price', name: 'entry', type: 'number', placeholder: '100' })}
                                ${UI.Form.input({ label: 'Stop Loss', name: 'stopLoss', type: 'number', placeholder: '95' })}
                                ${UI.Button.render({ label: 'Calculate Position', variant: 'primary', onClick: 'researchHub.calculatePosition()', fullWidth: true })}
                                <div id="position-result" class="calc-result"></div>
                            </div>
                        `
                    })}

                    ${UI.Card.render({
                        title: '📈 Options Calculator',
                        content: `
                            <div class="calculator-form">
                                ${UI.Form.select({
                                    label: 'Option Type',
                                    name: 'optionType',
                                    options: [{ value: 'call', label: 'Call' }, { value: 'put', label: 'Put' }]
                                })}
                                ${UI.Form.input({ label: 'Stock Price', name: 'stockPrice', type: 'number', placeholder: '100' })}
                                ${UI.Form.input({ label: 'Strike Price', name: 'strikePrice', type: 'number', placeholder: '105' })}
                                ${UI.Form.input({ label: 'Days to Expiry', name: 'daysToExpiry', type: 'number', placeholder: '30' })}
                                ${UI.Button.render({ label: 'Calculate Value', variant: 'primary', onClick: 'researchHub.calculateOption()', fullWidth: true })}
                                <div id="option-result" class="calc-result"></div>
                            </div>
                        `
                    })}

                    ${UI.Card.render({
                        title: '💸 Margin Calculator',
                        content: `
                            <div class="calculator-form">
                                ${UI.Form.input({ label: 'Stock Price', name: 'marginPrice', type: 'number', placeholder: '100' })}
                                ${UI.Form.input({ label: 'Quantity', name: 'marginQty', type: 'number', placeholder: '100' })}
                                ${UI.Form.input({ label: 'Leverage', name: 'leverage', type: 'number', placeholder: '2' })}
                                ${UI.Button.render({ label: 'Calculate Margin', variant: 'primary', onClick: 'researchHub.calculateMargin()', fullWidth: true })}
                                <div id="margin-result" class="calc-result"></div>
                            </div>
                        `
                    })}
                </div>
            </div>
        `;
    }

    /**
     * Analysis Tab
     */
    async renderAnalysis() {
        return `
            <div class="analysis-container">
                ${UI.Card.render({
                    title: '🔍 Stock Analysis',
                    content: `
                        <div class="analysis-search">
                            <input type="text" class="symbol-input-large" placeholder="Enter stock symbol (e.g., AAPL)" id="analysis-symbol">
                            ${UI.Button.render({ label: 'Analyze', variant: 'primary', onClick: 'researchHub.analyzeStock()' })}
                        </div>
                        <div id="analysis-results" class="analysis-results">
                            <div class="empty-state">Enter a symbol to analyze</div>
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

    calculatePL() {
        const entry = parseFloat(document.querySelector('[name="entryPrice"]').value);
        const exit = parseFloat(document.querySelector('[name="exitPrice"]').value);
        const qty = parseInt(document.querySelector('[name="quantity"]').value);

        const pl = (exit - entry) * qty;
        const plPercent = ((exit - entry) / entry) * 100;

        document.getElementById('pl-result').innerHTML = `
            <div class="result-box ${pl >= 0 ? 'positive' : 'negative'}">
                <h4>P&L Result</h4>
                <div class="result-value">$${pl.toFixed(2)}</div>
                <div class="result-percent">${plPercent >= 0 ? '+' : ''}${plPercent.toFixed(2)}%</div>
            </div>
        `;
    }
}

if (typeof window !== 'undefined') {
    window.ResearchHub = ResearchHub;
}
