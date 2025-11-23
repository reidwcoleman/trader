// Unified Trading Engine
// Consolidates: options, advanced orders, margin, short selling, basic trading

/**
 * Main Trading Engine
 * Handles all types of trades and order management
 */
class TradingEngine {
    constructor(config = {}) {
        this.apiBase = config.apiBase || API_BASE_URL;
        this.userId = config.userId || null;
        this.commission = config.commission || 0.03; // 3% commission
        this.callbacks = {
            onTradeExecuted: config.onTradeExecuted || null,
            onError: config.onError || null,
            onBalanceUpdate: config.onBalanceUpdate || null
        };
    }

    /**
     * Execute Market Order (Buy/Sell at current price)
     */
    async executeMarketOrder(params) {
        const { symbol, quantity, side, price } = params;

        try {
            const totalCost = side === 'buy'
                ? quantity * price * (1 + this.commission)
                : quantity * price * (1 - this.commission);

            const trade = {
                userId: this.userId,
                symbol,
                quantity,
                price,
                side,
                orderType: 'market',
                totalCost: side === 'buy' ? totalCost : -totalCost,
                commission: Math.abs(totalCost * this.commission),
                timestamp: Date.now(),
                status: 'filled'
            };

            const response = await this.sendTradeToBackend(trade);

            if (this.callbacks.onTradeExecuted) {
                this.callbacks.onTradeExecuted(trade);
            }

            UIToast.show({
                message: `${side.toUpperCase()} ${quantity} ${symbol} @ $${price.toFixed(2)}`,
                type: 'success'
            });

            return response;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    /**
     * Execute Limit Order (Buy/Sell at specified price or better)
     */
    async executeLimitOrder(params) {
        const { symbol, quantity, side, limitPrice, duration = 'day' } = params;

        const order = {
            userId: this.userId,
            symbol,
            quantity,
            side,
            orderType: 'limit',
            limitPrice,
            duration, // 'day', 'gtc' (good til canceled), 'ioc' (immediate or cancel)
            status: 'pending',
            timestamp: Date.now()
        };

        try {
            const response = await this.sendOrderToBackend(order);

            UIToast.show({
                message: `Limit order placed: ${side.toUpperCase()} ${quantity} ${symbol} @ $${limitPrice}`,
                type: 'info'
            });

            // Monitor order for execution
            this.monitorOrder(order.id);

            return response;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    /**
     * Execute Stop Loss Order
     */
    async executeStopLossOrder(params) {
        const { symbol, quantity, side, stopPrice, limitPrice = null } = params;

        const orderType = limitPrice ? 'stop-limit' : 'stop-market';

        const order = {
            userId: this.userId,
            symbol,
            quantity,
            side,
            orderType,
            stopPrice,
            limitPrice,
            status: 'pending',
            timestamp: Date.now()
        };

        try {
            const response = await this.sendOrderToBackend(order);

            UIToast.show({
                message: `Stop loss order placed for ${symbol} @ $${stopPrice}`,
                type: 'info'
            });

            return response;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    /**
     * Execute Trailing Stop Order
     */
    async executeTrailingStop(params) {
        const { symbol, quantity, trailAmount, trailPercent } = params;

        const order = {
            userId: this.userId,
            symbol,
            quantity,
            side: 'sell',
            orderType: 'trailing-stop',
            trailAmount: trailAmount || null,
            trailPercent: trailPercent || null,
            status: 'active',
            timestamp: Date.now()
        };

        try {
            const response = await this.sendOrderToBackend(order);

            UIToast.show({
                message: `Trailing stop set for ${symbol} (${trailPercent ? trailPercent + '%' : '$' + trailAmount})`,
                type: 'info'
            });

            return response;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    /**
     * Execute OCO (One-Cancels-Other) Order
     */
    async executeOCOOrder(params) {
        const { symbol, quantity, limitPrice, stopPrice } = params;

        const order = {
            userId: this.userId,
            symbol,
            quantity,
            orderType: 'oco',
            orders: [
                {
                    type: 'limit',
                    side: 'sell',
                    price: limitPrice
                },
                {
                    type: 'stop',
                    side: 'sell',
                    price: stopPrice
                }
            ],
            status: 'pending',
            timestamp: Date.now()
        };

        try {
            const response = await this.sendOrderToBackend(order);

            UIToast.show({
                message: `OCO order placed for ${symbol} (Limit: $${limitPrice}, Stop: $${stopPrice})`,
                type: 'info'
            });

            return response;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    /**
     * Execute Options Trade (Calls/Puts)
     */
    async executeOptionsTrade(params) {
        const {
            symbol,
            optionType, // 'call' or 'put'
            strike,
            expiration,
            contracts,
            side, // 'buy' or 'sell'
            price
        } = params;

        const totalCost = contracts * price * 100; // Each contract = 100 shares
        const commission = totalCost * 0.005; // 0.5% for options

        const trade = {
            userId: this.userId,
            symbol,
            assetType: 'option',
            optionType,
            strike,
            expiration,
            contracts,
            side,
            price,
            totalCost: side === 'buy' ? totalCost + commission : totalCost - commission,
            commission,
            timestamp: Date.now(),
            status: 'filled'
        };

        try {
            const response = await this.sendTradeToBackend(trade);

            if (this.callbacks.onTradeExecuted) {
                this.callbacks.onTradeExecuted(trade);
            }

            UIToast.show({
                message: `${side.toUpperCase()} ${contracts} ${symbol} ${optionType.toUpperCase()} $${strike} contracts`,
                type: 'success'
            });

            return response;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    /**
     * Execute Short Sale
     */
    async executeShortSale(params) {
        const { symbol, quantity, price } = params;

        const borrowFee = quantity * price * 0.001; // 0.1% borrow fee
        const commission = quantity * price * this.commission;

        const trade = {
            userId: this.userId,
            symbol,
            quantity: -quantity, // Negative for short position
            price,
            side: 'short',
            orderType: 'market',
            totalCost: (quantity * price) - commission - borrowFee,
            commission,
            borrowFee,
            timestamp: Date.now(),
            status: 'filled'
        };

        try {
            const response = await this.sendTradeToBackend(trade);

            if (this.callbacks.onTradeExecuted) {
                this.callbacks.onTradeExecuted(trade);
            }

            UIToast.show({
                message: `SHORT ${quantity} ${symbol} @ $${price.toFixed(2)}`,
                type: 'warning'
            });

            return response;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    /**
     * Cover Short Position (Buy to cover)
     */
    async coverShortPosition(params) {
        const { symbol, quantity, price } = params;

        const commission = quantity * price * this.commission;

        const trade = {
            userId: this.userId,
            symbol,
            quantity,
            price,
            side: 'cover',
            orderType: 'market',
            totalCost: -(quantity * price + commission),
            commission,
            timestamp: Date.now(),
            status: 'filled'
        };

        try {
            const response = await this.sendTradeToBackend(trade);

            if (this.callbacks.onTradeExecuted) {
                this.callbacks.onTradeExecuted(trade);
            }

            UIToast.show({
                message: `COVERED ${quantity} ${symbol} @ $${price.toFixed(2)}`,
                type: 'success'
            });

            return response;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    /**
     * Execute Margin Trade (with leverage)
     */
    async executeMarginTrade(params) {
        const { symbol, quantity, price, leverage = 2 } = params;

        const totalValue = quantity * price;
        const marginRequired = totalValue / leverage;
        const borrowedAmount = totalValue - marginRequired;
        const marginInterest = borrowedAmount * 0.0001; // Daily interest

        const trade = {
            userId: this.userId,
            symbol,
            quantity,
            price,
            side: 'buy',
            orderType: 'margin',
            leverage,
            marginRequired,
            borrowedAmount,
            marginInterest,
            totalCost: marginRequired + (totalValue * this.commission),
            commission: totalValue * this.commission,
            timestamp: Date.now(),
            status: 'filled'
        };

        try {
            const response = await this.sendTradeToBackend(trade);

            if (this.callbacks.onTradeExecuted) {
                this.callbacks.onTradeExecuted(trade);
            }

            UIToast.show({
                message: `MARGIN BUY ${quantity} ${symbol} @ $${price.toFixed(2)} (${leverage}x leverage)`,
                type: 'warning'
            });

            return response;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    /**
     * Cancel pending order
     */
    async cancelOrder(orderId) {
        try {
            const response = await fetch(`${this.apiBase}/orders/${orderId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error('Failed to cancel order');
            }

            UIToast.show({
                message: 'Order cancelled successfully',
                type: 'info'
            });

            return await response.json();
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    /**
     * Get open orders
     */
    async getOpenOrders() {
        try {
            const response = await fetch(`${this.apiBase}/orders?userId=${this.userId}&status=pending`);
            return await response.json();
        } catch (error) {
            this.handleError(error);
            return [];
        }
    }

    /**
     * Get trade history
     */
    async getTradeHistory(limit = 50) {
        try {
            const response = await fetch(`${this.apiBase}/trades?userId=${this.userId}&limit=${limit}`);
            return await response.json();
        } catch (error) {
            this.handleError(error);
            return [];
        }
    }

    /**
     * Calculate margin requirement
     */
    calculateMarginRequirement(params) {
        const { quantity, price, leverage = 2 } = params;
        const totalValue = quantity * price;
        const marginRequired = totalValue / leverage;
        const buyingPower = marginRequired * leverage;

        return {
            totalValue,
            marginRequired,
            buyingPower,
            leverage,
            maintenanceMargin: marginRequired * 0.25 // 25% maintenance
        };
    }

    /**
     * Calculate option Greeks (simplified)
     */
    calculateOptionGreeks(params) {
        const { stockPrice, strike, timeToExpiry, volatility, optionType } = params;

        // Simplified Black-Scholes approximation
        const moneyness = stockPrice / strike;
        const delta = optionType === 'call' ?
            (moneyness > 1 ? 0.7 : 0.3) :
            (moneyness > 1 ? -0.3 : -0.7);

        const gamma = 0.05; // Simplified
        const theta = -0.02 * (stockPrice * 0.01); // Simplified time decay
        const vega = stockPrice * Math.sqrt(timeToExpiry) * 0.01; // Sensitivity to volatility

        return { delta, gamma, theta, vega };
    }

    /**
     * Validate trade before execution
     */
    async validateTrade(params) {
        const { symbol, quantity, price, side, orderType } = params;

        const errors = [];

        // Validate quantity
        if (quantity <= 0) {
            errors.push('Quantity must be greater than 0');
        }

        // Validate price
        if (price <= 0) {
            errors.push('Price must be greater than 0');
        }

        // Check buying power
        const totalCost = quantity * price * (1 + this.commission);
        const balance = await this.getUserBalance();

        if (side === 'buy' && totalCost > balance) {
            errors.push('Insufficient funds');
        }

        // Check if user owns enough shares for sell
        if (side === 'sell') {
            const position = await this.getPosition(symbol);
            if (!position || position.quantity < quantity) {
                errors.push('Insufficient shares to sell');
            }
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Get current position for symbol
     */
    async getPosition(symbol) {
        try {
            const response = await fetch(`${this.apiBase}/positions?userId=${this.userId}&symbol=${symbol}`);
            const positions = await response.json();
            return positions.find(p => p.symbol === symbol);
        } catch (error) {
            return null;
        }
    }

    /**
     * Get user balance
     */
    async getUserBalance() {
        try {
            const response = await fetch(`${this.apiBase}/users/${this.userId}/balance`);
            const data = await response.json();
            return data.balance || 0;
        } catch (error) {
            return 0;
        }
    }

    /**
     * Send trade to backend
     */
    async sendTradeToBackend(trade) {
        const response = await fetch(`${this.apiBase}/trades`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(trade)
        });

        if (!response.ok) {
            throw new Error(`Trade failed: ${response.statusText}`);
        }

        return await response.json();
    }

    /**
     * Send order to backend
     */
    async sendOrderToBackend(order) {
        const response = await fetch(`${this.apiBase}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        });

        if (!response.ok) {
            throw new Error(`Order failed: ${response.statusText}`);
        }

        return await response.json();
    }

    /**
     * Monitor order for execution (polling)
     */
    monitorOrder(orderId) {
        const checkInterval = setInterval(async () => {
            try {
                const response = await fetch(`${this.apiBase}/orders/${orderId}`);
                const order = await response.json();

                if (order.status === 'filled') {
                    clearInterval(checkInterval);

                    UIToast.show({
                        message: `Order filled: ${order.symbol} @ $${order.filledPrice}`,
                        type: 'success'
                    });

                    if (this.callbacks.onTradeExecuted) {
                        this.callbacks.onTradeExecuted(order);
                    }
                } else if (order.status === 'cancelled' || order.status === 'expired') {
                    clearInterval(checkInterval);

                    UIToast.show({
                        message: `Order ${order.status}: ${order.symbol}`,
                        type: 'warning'
                    });
                }
            } catch (error) {
                clearInterval(checkInterval);
            }
        }, 5000); // Check every 5 seconds
    }

    /**
     * Error handling
     */
    handleError(error) {
        console.error('Trading Engine Error:', error);

        UIToast.show({
            message: error.message || 'Trade execution failed',
            type: 'error'
        });

        if (this.callbacks.onError) {
            this.callbacks.onError(error);
        }
    }
}

/**
 * Order Builder - Fluent API for creating complex orders
 */
class OrderBuilder {
    constructor(tradingEngine) {
        this.engine = tradingEngine;
        this.order = {};
    }

    symbol(sym) {
        this.order.symbol = sym;
        return this;
    }

    quantity(qty) {
        this.order.quantity = qty;
        return this;
    }

    price(prc) {
        this.order.price = prc;
        return this;
    }

    buy() {
        this.order.side = 'buy';
        return this;
    }

    sell() {
        this.order.side = 'sell';
        return this;
    }

    short() {
        this.order.side = 'short';
        return this;
    }

    market() {
        this.order.orderType = 'market';
        return this;
    }

    limit(limitPrice) {
        this.order.orderType = 'limit';
        this.order.limitPrice = limitPrice;
        return this;
    }

    stop(stopPrice) {
        this.order.orderType = 'stop';
        this.order.stopPrice = stopPrice;
        return this;
    }

    withLeverage(leverage) {
        this.order.leverage = leverage;
        return this;
    }

    async execute() {
        if (!this.order.symbol || !this.order.quantity) {
            throw new Error('Symbol and quantity are required');
        }

        if (this.order.orderType === 'market') {
            return await this.engine.executeMarketOrder(this.order);
        } else if (this.order.orderType === 'limit') {
            return await this.engine.executeLimitOrder(this.order);
        } else if (this.order.orderType === 'stop') {
            return await this.engine.executeStopLossOrder(this.order);
        } else if (this.order.side === 'short') {
            return await this.engine.executeShortSale(this.order);
        }

        throw new Error('Invalid order configuration');
    }
}

// Export
if (typeof window !== 'undefined') {
    window.TradingEngine = TradingEngine;
    window.OrderBuilder = OrderBuilder;
}
