// Trading Hub Component
// Professional trading terminal: order entry, live charts, order management

/**
 * Trading Hub
 * Full-featured trading terminal like ThinkorSwim/Webull
 */
class TradingHub {
    constructor(config = {}) {
        this.engine = config.engine || null;
        this.selectedSymbol = config.selectedSymbol || 'AAPL';
        this.orderType = 'market';
        this.side = 'buy';
        this.chartInstance = null;
        this.liveUpdater = null;
    }

    /**
     * Render complete Trading Hub
     */
    async render() {
        return `
            <div class="hub-container trading-hub">
                <!-- Hub Header -->
                <div class="hub-header">
                    <div class="hub-title-group">
                        <h1 class="hub-title">💹 Trading Terminal</h1>
                        <p class="hub-subtitle">Place orders and manage positions</p>
                    </div>
                </div>

                <!-- Main Trading Layout (3 columns) -->
                <div class="trading-layout">
                    <!-- Left Column: Watchlist & Order Book -->
                    <aside class="trading-sidebar left">
                        ${this.renderWatchlistPanel()}
                        ${this.renderOrderBookPanel()}
                    </aside>

                    <!-- Center Column: Chart & Order Entry -->
                    <main class="trading-main">
                        ${this.renderChartPanel()}
                        ${this.renderOrderEntryPanel()}
                    </main>

                    <!-- Right Column: Open Orders & Recent Trades -->
                    <aside class="trading-sidebar right">
                        ${this.renderOpenOrdersPanel()}
                        ${this.renderRecentTradesPanel()}
                    </aside>
                </div>
            </div>
        `;
    }

    /**
     * Watchlist Panel (Left Sidebar)
     */
    renderWatchlistPanel() {
        return `
            <div class="trading-panel watchlist-panel">
                <div class="panel-header">
                    <h3 class="panel-title">📋 Watchlist</h3>
                    <button class="btn-icon" onclick="tradingHub.addToWatchlist()" title="Add Symbol">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                </div>
                <div class="panel-content">
                    <div id="watchlist-items" class="watchlist-items">
                        ${UI.Loader.skeleton({ height: '50px', count: 5 })}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Order Book Panel (Left Sidebar)
     */
    renderOrderBookPanel() {
        return `
            <div class="trading-panel orderbook-panel">
                <div class="panel-header">
                    <h3 class="panel-title">📖 Order Book</h3>
                </div>
                <div class="panel-content">
                    <div id="order-book" class="order-book">
                        <div class="orderbook-header">
                            <span>Price</span>
                            <span>Size</span>
                            <span>Total</span>
                        </div>
                        <!-- Asks (Sell Orders) -->
                        <div class="orderbook-asks">
                            ${this.renderOrderBookRows('ask', 5)}
                        </div>
                        <!-- Current Price -->
                        <div class="orderbook-current">
                            <span class="current-price">$178.50</span>
                            <span class="current-change positive">+2.15%</span>
                        </div>
                        <!-- Bids (Buy Orders) -->
                        <div class="orderbook-bids">
                            ${this.renderOrderBookRows('bid', 5)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Chart Panel (Center)
     */
    renderChartPanel() {
        return `
            <div class="trading-panel chart-panel">
                <div class="panel-header">
                    <div class="symbol-search">
                        <input type="text"
                               id="symbol-search-input"
                               class="symbol-input"
                               placeholder="Search symbol..."
                               value="${this.selectedSymbol}"
                               onkeyup="tradingHub.searchSymbol(event)">
                        <div id="symbol-suggestions" class="symbol-suggestions hidden"></div>
                    </div>
                    <div class="chart-controls">
                        <button class="chart-control-btn" onclick="tradingHub.addIndicator('RSI')">
                            RSI
                        </button>
                        <button class="chart-control-btn" onclick="tradingHub.addIndicator('MACD')">
                            MACD
                        </button>
                        <button class="chart-control-btn" onclick="tradingHub.addIndicator('BB')">
                            Bollinger
                        </button>
                        <button class="chart-control-btn" onclick="tradingHub.toggleLiveData()">
                            📡 Live
                        </button>
                    </div>
                </div>
                <div class="panel-content">
                    <div id="trading-chart" class="trading-chart">
                        <div class="chart-loading">
                            ${UI.Loader.spinner('lg')}
                            <p>Loading chart...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Order Entry Panel (Center Bottom)
     */
    renderOrderEntryPanel() {
        return `
            <div class="trading-panel order-entry-panel">
                <div class="panel-header">
                    <h3 class="panel-title">📝 Place Order</h3>
                    <div class="order-type-selector">
                        <button class="type-btn active" onclick="tradingHub.setOrderType('market')" data-type="market">
                            Market
                        </button>
                        <button class="type-btn" onclick="tradingHub.setOrderType('limit')" data-type="limit">
                            Limit
                        </button>
                        <button class="type-btn" onclick="tradingHub.setOrderType('stop')" data-type="stop">
                            Stop
                        </button>
                        <button class="type-btn" onclick="tradingHub.setOrderType('advanced')" data-type="advanced">
                            Advanced
                        </button>
                    </div>
                </div>
                <div class="panel-content">
                    <div class="order-entry-form">
                        <!-- Buy/Sell Tabs -->
                        <div class="side-selector">
                            <button class="side-btn buy active" onclick="tradingHub.setSide('buy')" data-side="buy">
                                📈 Buy
                            </button>
                            <button class="side-btn sell" onclick="tradingHub.setSide('sell')" data-side="sell">
                                📉 Sell
                            </button>
                        </div>

                        <!-- Order Form -->
                        <div id="order-form-container">
                            ${this.renderOrderForm()}
                        </div>

                        <!-- Order Summary -->
                        <div class="order-summary">
                            <div class="summary-row">
                                <span>Estimated Cost:</span>
                                <span id="estimated-cost">$0.00</span>
                            </div>
                            <div class="summary-row">
                                <span>Commission:</span>
                                <span id="commission-cost">$0.00</span>
                            </div>
                            <div class="summary-row total">
                                <span>Total:</span>
                                <span id="total-cost">$0.00</span>
                            </div>
                        </div>

                        <!-- Submit Button -->
                        ${UI.Button.render({
                            label: `Place ${this.side.toUpperCase()} Order`,
                            variant: this.side === 'buy' ? 'success' : 'danger',
                            size: 'lg',
                            fullWidth: true,
                            onClick: 'tradingHub.submitOrder()'
                        })}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Open Orders Panel (Right Sidebar)
     */
    renderOpenOrdersPanel() {
        return `
            <div class="trading-panel open-orders-panel">
                <div class="panel-header">
                    <h3 class="panel-title">📋 Open Orders</h3>
                    <button class="btn-link" onclick="tradingHub.cancelAllOrders()">Cancel All</button>
                </div>
                <div class="panel-content">
                    <div id="open-orders-list" class="orders-list">
                        <div class="empty-state">No open orders</div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Recent Trades Panel (Right Sidebar)
     */
    renderRecentTradesPanel() {
        return `
            <div class="trading-panel recent-trades-panel">
                <div class="panel-header">
                    <h3 class="panel-title">🕐 Recent Trades</h3>
                </div>
                <div class="panel-content">
                    <div id="recent-trades-list" class="trades-list">
                        <div class="empty-state">No recent trades</div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render order form based on type
     */
    renderOrderForm() {
        switch (this.orderType) {
            case 'market':
                return this.renderMarketOrderForm();
            case 'limit':
                return this.renderLimitOrderForm();
            case 'stop':
                return this.renderStopOrderForm();
            case 'advanced':
                return this.renderAdvancedOrderForm();
            default:
                return '';
        }
    }

    /**
     * Market Order Form
     */
    renderMarketOrderForm() {
        return `
            <div class="form-row">
                ${UI.Form.input({
                    type: 'number',
                    name: 'quantity',
                    label: 'Quantity (shares)',
                    placeholder: '10',
                    value: '',
                    icon: '#️⃣',
                    required: true
                })}
            </div>
            <div class="form-info">
                <p>💡 Market orders execute immediately at the current market price</p>
            </div>
        `;
    }

    /**
     * Limit Order Form
     */
    renderLimitOrderForm() {
        return `
            <div class="form-row">
                ${UI.Form.input({
                    type: 'number',
                    name: 'quantity',
                    label: 'Quantity (shares)',
                    placeholder: '10',
                    icon: '#️⃣',
                    required: true
                })}
            </div>
            <div class="form-row">
                ${UI.Form.input({
                    type: 'number',
                    name: 'limitPrice',
                    label: 'Limit Price',
                    placeholder: '175.00',
                    icon: '💰',
                    required: true
                })}
            </div>
            <div class="form-row">
                ${UI.Form.select({
                    name: 'duration',
                    label: 'Duration',
                    options: [
                        { value: 'day', label: 'Day Order' },
                        { value: 'gtc', label: 'Good Til Canceled' },
                        { value: 'ioc', label: 'Immediate or Cancel' }
                    ]
                })}
            </div>
            <div class="form-info">
                <p>💡 Limit orders execute only at your specified price or better</p>
            </div>
        `;
    }

    /**
     * Stop Order Form
     */
    renderStopOrderForm() {
        return `
            <div class="form-row">
                ${UI.Form.input({
                    type: 'number',
                    name: 'quantity',
                    label: 'Quantity (shares)',
                    placeholder: '10',
                    icon: '#️⃣',
                    required: true
                })}
            </div>
            <div class="form-row">
                ${UI.Form.input({
                    type: 'number',
                    name: 'stopPrice',
                    label: 'Stop Price',
                    placeholder: '170.00',
                    icon: '🛑',
                    required: true
                })}
            </div>
            <div class="form-row">
                ${UI.Form.input({
                    type: 'number',
                    name: 'limitPrice',
                    label: 'Limit Price (Optional)',
                    placeholder: '168.00',
                    icon: '💰'
                })}
            </div>
            <div class="form-info">
                <p>💡 Stop orders trigger when price reaches your stop price</p>
            </div>
        `;
    }

    /**
     * Advanced Order Form (OCO, Trailing Stop, etc.)
     */
    renderAdvancedOrderForm() {
        return `
            <div class="form-row">
                ${UI.Form.select({
                    name: 'advancedType',
                    label: 'Advanced Order Type',
                    options: [
                        { value: 'oco', label: 'OCO (One-Cancels-Other)' },
                        { value: 'trailing', label: 'Trailing Stop' },
                        { value: 'bracket', label: 'Bracket Order' },
                        { value: 'margin', label: 'Margin Trade' },
                        { value: 'short', label: 'Short Sell' }
                    ]
                })}
            </div>
            <div id="advanced-form-fields">
                <p class="empty-state">Select an order type above</p>
            </div>
        `;
    }

    /**
     * Render order book rows
     */
    renderOrderBookRows(type, count) {
        const rows = [];
        const basePrice = 178.50;

        for (let i = 0; i < count; i++) {
            const price = type === 'ask'
                ? basePrice + ((i + 1) * 0.05)
                : basePrice - ((i + 1) * 0.05);
            const size = Math.floor(Math.random() * 500) + 100;
            const total = size * price;

            rows.push(`
                <div class="orderbook-row ${type}">
                    <span class="ob-price">$${price.toFixed(2)}</span>
                    <span class="ob-size">${size}</span>
                    <span class="ob-total">${total.toFixed(0)}</span>
                </div>
            `);
        }

        return rows.join('');
    }

    /**
     * Load chart for selected symbol
     */
    async loadChart() {
        if (!this.selectedSymbol) return;

        const container = document.getElementById('trading-chart');
        if (!container) return;

        try {
            // Use createChartWithData from Phase 2
            if (this.chartInstance) {
                window.TradingViewCharts.destroyChart(this.chartInstance);
            }

            this.chartInstance = await window.TradingViewCharts.createChartWithData(
                'trading-chart',
                this.selectedSymbol,
                {
                    useRealData: true,
                    days: 90,
                    height: 500,
                    autoRefresh: true
                }
            );
        } catch (error) {
            console.error('Failed to load chart:', error);
            container.innerHTML = '<div class="error-state">Failed to load chart</div>';
        }
    }

    /**
     * Switch order type
     */
    setOrderType(type) {
        this.orderType = type;

        // Update active button
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === type);
        });

        // Update form
        const formContainer = document.getElementById('order-form-container');
        if (formContainer) {
            formContainer.innerHTML = this.renderOrderForm();
        }
    }

    /**
     * Switch buy/sell side
     */
    setSide(side) {
        this.side = side;

        // Update active button
        document.querySelectorAll('.side-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.side === side);
        });
    }

    /**
     * Submit order
     */
    async submitOrder() {
        if (!this.engine) {
            UIToast.show({ message: 'Trading engine not initialized', type: 'error' });
            return;
        }

        // Collect form data
        const quantity = parseInt(document.querySelector('[name="quantity"]')?.value || 0);
        const limitPrice = parseFloat(document.querySelector('[name="limitPrice"]')?.value || 0);
        const stopPrice = parseFloat(document.querySelector('[name="stopPrice"]')?.value || 0);

        if (quantity <= 0) {
            UIToast.show({ message: 'Invalid quantity', type: 'error' });
            return;
        }

        try {
            // Execute based on order type
            let result;

            switch (this.orderType) {
                case 'market':
                    result = await this.engine.executeMarketOrder({
                        symbol: this.selectedSymbol,
                        quantity,
                        side: this.side,
                        price: 178.50 // Get from live data
                    });
                    break;

                case 'limit':
                    result = await this.engine.executeLimitOrder({
                        symbol: this.selectedSymbol,
                        quantity,
                        side: this.side,
                        limitPrice
                    });
                    break;

                case 'stop':
                    result = await this.engine.executeStopLossOrder({
                        symbol: this.selectedSymbol,
                        quantity,
                        side: this.side,
                        stopPrice,
                        limitPrice: limitPrice || null
                    });
                    break;
            }

            // Refresh open orders
            await this.loadOpenOrders();
        } catch (error) {
            console.error('Order failed:', error);
        }
    }

    /**
     * Load open orders
     */
    async loadOpenOrders() {
        if (!this.engine) return;

        const orders = await this.engine.getOpenOrders();
        const container = document.getElementById('open-orders-list');

        if (!container) return;

        if (orders.length === 0) {
            container.innerHTML = '<div class="empty-state">No open orders</div>';
            return;
        }

        container.innerHTML = orders.map(order => `
            <div class="order-item">
                <div class="order-header">
                    <strong>${order.symbol}</strong>
                    <span class="order-side ${order.side}">${order.side.toUpperCase()}</span>
                </div>
                <div class="order-details">
                    <span>${order.quantity} @ $${order.price || order.limitPrice}</span>
                    <span class="order-type">${order.orderType}</span>
                </div>
                <button class="btn-cancel" onclick="tradingHub.cancelOrder(${order.id})">Cancel</button>
            </div>
        `).join('');
    }

    /**
     * Quick trade (from markets hub or elsewhere)
     */
    async quickTrade(symbol) {
        this.selectedSymbol = symbol;

        // Update symbol input
        const input = document.getElementById('symbol-search-input');
        if (input) {
            input.value = symbol;
        }

        // Load chart
        await this.loadChart();

        // Show toast
        UIToast.show({
            message: `Loaded ${symbol} for trading`,
            type: 'info'
        });
    }
}

// Export
if (typeof window !== 'undefined') {
    window.TradingHub = TradingHub;
}
