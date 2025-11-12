// Advanced Order Types for FinClash
// Implements: Market, Limit, Stop-Loss, Stop-Limit, Trailing Stop, GTC, Day Orders

/**
 * ORDER TYPES EXPLAINED:
 *
 * Market Order: Execute immediately at current market price
 * Limit Order: Execute only at specified price or better
 * Stop-Loss Order: Trigger market order when price hits stop price (protect against losses)
 * Stop-Limit Order: Trigger limit order when price hits stop price (more control)
 * Trailing Stop: Stop price adjusts with favorable price movements (lock in gains)
 *
 * TIME IN FORCE:
 * Day Order: Expires at market close if not filled
 * GTC (Good-Till-Canceled): Stays active until filled or manually canceled
 */

/**
 * Order status types
 */
const OrderStatus = {
    PENDING: 'pending',        // Order placed but not yet filled
    FILLED: 'filled',          // Order executed
    PARTIAL: 'partial',        // Partially filled (for large orders)
    CANCELED: 'canceled',      // Order canceled by user
    EXPIRED: 'expired',        // Day order expired
    REJECTED: 'rejected'       // Order rejected (insufficient funds, etc.)
};

/**
 * Create a market order (executes immediately)
 */
function createMarketOrder(portfolio, symbol, quantity, side, currentPrice) {
    // Market order executes immediately at bid/ask
    const executionPrice = side === 'buy'
        ? currentPrice // Use ask price for buys
        : currentPrice; // Use bid price for sells

    const totalCost = executionPrice * quantity;

    // Validate
    if (side === 'buy' && totalCost > portfolio.cash) {
        throw new Error(`Insufficient funds. Need $${totalCost.toFixed(2)}, have $${portfolio.cash.toFixed(2)}`);
    }

    if (side === 'sell' && (portfolio.positions[symbol] || 0) < quantity) {
        throw new Error(`Insufficient shares. Need ${quantity}, have ${portfolio.positions[symbol] || 0}`);
    }

    // Execute immediately
    return executeOrder(portfolio, {
        type: 'market',
        symbol,
        quantity,
        side,
        price: executionPrice,
        status: OrderStatus.FILLED,
        timestamp: new Date().toISOString()
    });
}

/**
 * Create a limit order (executes only at specified price or better)
 */
function createLimitOrder(portfolio, symbol, quantity, side, limitPrice, timeInForce = 'day') {
    const order = {
        id: Date.now() + Math.random(),
        type: 'limit',
        symbol,
        quantity,
        side,
        limitPrice,
        timeInForce,
        status: OrderStatus.PENDING,
        createdAt: new Date().toISOString(),
        expiresAt: timeInForce === 'day' ? getMarketCloseTime() : null
    };

    // Add to pending orders
    if (!portfolio.pendingOrders) {
        portfolio.pendingOrders = [];
    }
    portfolio.pendingOrders.push(order);

    return {
        portfolio,
        order,
        message: `Limit order placed: ${side.toUpperCase()} ${quantity} ${symbol} @ $${limitPrice.toFixed(2)}`
    };
}

/**
 * Create a stop-loss order (triggers market order when price hits stop price)
 */
function createStopLossOrder(portfolio, symbol, quantity, side, stopPrice, timeInForce = 'gtc') {
    const order = {
        id: Date.now() + Math.random(),
        type: 'stop-loss',
        symbol,
        quantity,
        side,
        stopPrice,
        timeInForce,
        status: OrderStatus.PENDING,
        createdAt: new Date().toISOString(),
        expiresAt: timeInForce === 'day' ? getMarketCloseTime() : null
    };

    if (!portfolio.pendingOrders) {
        portfolio.pendingOrders = [];
    }
    portfolio.pendingOrders.push(order);

    return {
        portfolio,
        order,
        message: `Stop-loss order placed: ${side.toUpperCase()} ${quantity} ${symbol} when price hits $${stopPrice.toFixed(2)}`
    };
}

/**
 * Create a stop-limit order (triggers limit order when price hits stop price)
 */
function createStopLimitOrder(portfolio, symbol, quantity, side, stopPrice, limitPrice, timeInForce = 'gtc') {
    const order = {
        id: Date.now() + Math.random(),
        type: 'stop-limit',
        symbol,
        quantity,
        side,
        stopPrice,
        limitPrice,
        timeInForce,
        status: OrderStatus.PENDING,
        createdAt: new Date().toISOString(),
        expiresAt: timeInForce === 'day' ? getMarketCloseTime() : null,
        triggered: false
    };

    if (!portfolio.pendingOrders) {
        portfolio.pendingOrders = [];
    }
    portfolio.pendingOrders.push(order);

    return {
        portfolio,
        order,
        message: `Stop-limit order placed: ${side.toUpperCase()} ${quantity} ${symbol} @ $${limitPrice.toFixed(2)} when price hits $${stopPrice.toFixed(2)}`
    };
}

/**
 * Create a trailing stop order (stop price adjusts with favorable moves)
 */
function createTrailingStopOrder(portfolio, symbol, quantity, side, trailAmount, trailPercent, currentPrice, timeInForce = 'gtc') {
    // Calculate initial stop price
    let stopPrice;
    if (side === 'sell') {
        // For sell orders (protecting long position), trail below current price
        stopPrice = trailPercent
            ? currentPrice * (1 - trailPercent / 100)
            : currentPrice - trailAmount;
    } else {
        // For buy orders (covering short position), trail above current price
        stopPrice = trailPercent
            ? currentPrice * (1 + trailPercent / 100)
            : currentPrice + trailAmount;
    }

    const order = {
        id: Date.now() + Math.random(),
        type: 'trailing-stop',
        symbol,
        quantity,
        side,
        stopPrice,
        trailAmount,
        trailPercent,
        highWaterMark: currentPrice, // Tracks highest price for sell orders
        lowWaterMark: currentPrice,  // Tracks lowest price for buy orders
        timeInForce,
        status: OrderStatus.PENDING,
        createdAt: new Date().toISOString(),
        expiresAt: timeInForce === 'day' ? getMarketCloseTime() : null
    };

    if (!portfolio.pendingOrders) {
        portfolio.pendingOrders = [];
    }
    portfolio.pendingOrders.push(order);

    const trailDescription = trailPercent
        ? `${trailPercent}%`
        : `$${trailAmount.toFixed(2)}`;

    return {
        portfolio,
        order,
        message: `Trailing stop order placed: ${side.toUpperCase()} ${quantity} ${symbol} with ${trailDescription} trail`
    };
}

/**
 * Process pending orders (check if conditions are met)
 * Should be called whenever stock prices update
 */
function processPendingOrders(portfolio, stocks) {
    if (!portfolio.pendingOrders || portfolio.pendingOrders.length === 0) {
        return { portfolio, executedOrders: [], expiredOrders: [] };
    }

    const now = new Date();
    const executedOrders = [];
    const expiredOrders = [];

    portfolio.pendingOrders = portfolio.pendingOrders.filter(order => {
        // Check if expired
        if (order.expiresAt && new Date(order.expiresAt) < now) {
            order.status = OrderStatus.EXPIRED;
            expiredOrders.push(order);
            return false; // Remove from pending
        }

        // Find current stock price
        const stock = stocks.find(s => s.symbol === order.symbol);
        if (!stock) return true; // Keep order if stock data not available

        const currentPrice = stock.price;
        const bid = stock.bid || currentPrice;
        const ask = stock.ask || currentPrice;

        // Check order type conditions
        switch (order.type) {
            case 'limit':
                if (shouldExecuteLimitOrder(order, currentPrice, bid, ask)) {
                    const result = executeOrder(portfolio, order, currentPrice);
                    executedOrders.push(result.order);
                    return false; // Remove from pending
                }
                break;

            case 'stop-loss':
                if (shouldTriggerStopLoss(order, currentPrice)) {
                    // Stop-loss triggers a market order
                    const executionPrice = order.side === 'buy' ? ask : bid;
                    const result = executeOrder(portfolio, order, executionPrice);
                    executedOrders.push(result.order);
                    return false;
                }
                break;

            case 'stop-limit':
                if (!order.triggered && shouldTriggerStopLoss(order, currentPrice)) {
                    // Stop price hit - now becomes a limit order
                    order.triggered = true;
                    order.type = 'limit'; // Convert to limit order
                }
                if (order.triggered && shouldExecuteLimitOrder(order, currentPrice, bid, ask)) {
                    const result = executeOrder(portfolio, order, currentPrice);
                    executedOrders.push(result.order);
                    return false;
                }
                break;

            case 'trailing-stop':
                // Update trailing stop price
                updateTrailingStop(order, currentPrice);
                if (shouldTriggerStopLoss(order, currentPrice)) {
                    const executionPrice = order.side === 'buy' ? ask : bid;
                    const result = executeOrder(portfolio, order, executionPrice);
                    executedOrders.push(result.order);
                    return false;
                }
                break;
        }

        return true; // Keep order in pending
    });

    return { portfolio, executedOrders, expiredOrders };
}

/**
 * Check if limit order should execute
 */
function shouldExecuteLimitOrder(order, currentPrice, bid, ask) {
    if (order.side === 'buy') {
        // Buy limit: execute if ask price <= limit price
        return ask <= order.limitPrice;
    } else {
        // Sell limit: execute if bid price >= limit price
        return bid >= order.limitPrice;
    }
}

/**
 * Check if stop order should trigger
 */
function shouldTriggerStopLoss(order, currentPrice) {
    if (order.side === 'sell') {
        // Sell stop: trigger if price falls to or below stop price
        return currentPrice <= order.stopPrice;
    } else {
        // Buy stop: trigger if price rises to or above stop price
        return currentPrice >= order.stopPrice;
    }
}

/**
 * Update trailing stop order
 */
function updateTrailingStop(order, currentPrice) {
    if (order.side === 'sell') {
        // For sell orders, trail below the highest price
        if (currentPrice > order.highWaterMark) {
            order.highWaterMark = currentPrice;
            // Update stop price
            order.stopPrice = order.trailPercent
                ? currentPrice * (1 - order.trailPercent / 100)
                : currentPrice - order.trailAmount;
        }
    } else {
        // For buy orders, trail above the lowest price
        if (currentPrice < order.lowWaterMark) {
            order.lowWaterMark = currentPrice;
            // Update stop price
            order.stopPrice = order.trailPercent
                ? currentPrice * (1 + order.trailPercent / 100)
                : currentPrice + order.trailAmount;
        }
    }
}

/**
 * Execute an order (modify portfolio)
 */
function executeOrder(portfolio, order, executionPrice) {
    const totalCost = executionPrice * order.quantity;

    if (order.side === 'buy') {
        // Buy shares
        portfolio.cash -= totalCost;
        portfolio.positions[order.symbol] = (portfolio.positions[order.symbol] || 0) + order.quantity;

        // Update cost basis
        if (!portfolio.costBasis) portfolio.costBasis = {};
        const currentShares = portfolio.positions[order.symbol] - order.quantity;
        const currentCost = (portfolio.costBasis[order.symbol] || 0) * currentShares;
        const newTotalCost = currentCost + totalCost;
        portfolio.costBasis[order.symbol] = newTotalCost / portfolio.positions[order.symbol];
    } else {
        // Sell shares
        portfolio.cash += totalCost;
        portfolio.positions[order.symbol] -= order.quantity;

        // Remove cost basis if position fully closed
        if (portfolio.positions[order.symbol] <= 0) {
            delete portfolio.positions[order.symbol];
            if (portfolio.costBasis) {
                delete portfolio.costBasis[order.symbol];
            }
        }
    }

    // Update order status
    order.status = OrderStatus.FILLED;
    order.executionPrice = executionPrice;
    order.executedAt = new Date().toISOString();

    // Record in history
    if (!portfolio.history) portfolio.history = [];
    portfolio.history.push({
        type: order.side,
        orderType: order.type,
        symbol: order.symbol,
        quantity: order.quantity,
        price: executionPrice,
        total: totalCost,
        timestamp: order.executedAt
    });

    return { portfolio, order };
}

/**
 * Cancel a pending order
 */
function cancelOrder(portfolio, orderId) {
    if (!portfolio.pendingOrders) {
        throw new Error('No pending orders');
    }

    const orderIndex = portfolio.pendingOrders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) {
        throw new Error('Order not found');
    }

    const order = portfolio.pendingOrders[orderIndex];
    order.status = OrderStatus.CANCELED;
    order.canceledAt = new Date().toISOString();

    // Remove from pending
    portfolio.pendingOrders.splice(orderIndex, 1);

    return {
        portfolio,
        order,
        message: `Order canceled: ${order.side.toUpperCase()} ${order.quantity} ${order.symbol}`
    };
}

/**
 * Get market close time for day orders
 */
function getMarketCloseTime() {
    const now = new Date();
    const closeTime = new Date(now);
    closeTime.setHours(16, 0, 0, 0); // 4 PM ET

    // If already past close, use tomorrow's close
    if (now >= closeTime) {
        closeTime.setDate(closeTime.getDate() + 1);
    }

    return closeTime.toISOString();
}

/**
 * Calculate order statistics
 */
function getOrderStatistics(portfolio) {
    if (!portfolio.history) {
        return {
            totalOrders: 0,
            buyOrders: 0,
            sellOrders: 0,
            marketOrders: 0,
            limitOrders: 0,
            stopOrders: 0,
            averageOrderSize: 0
        };
    }

    const stats = {
        totalOrders: portfolio.history.length,
        buyOrders: 0,
        sellOrders: 0,
        marketOrders: 0,
        limitOrders: 0,
        stopOrders: 0,
        totalVolume: 0
    };

    portfolio.history.forEach(trade => {
        if (trade.type === 'buy') stats.buyOrders++;
        if (trade.type === 'sell') stats.sellOrders++;

        if (trade.orderType === 'market') stats.marketOrders++;
        if (trade.orderType === 'limit') stats.limitOrders++;
        if (trade.orderType === 'stop-loss' || trade.orderType === 'trailing-stop') stats.stopOrders++;

        stats.totalVolume += trade.total || 0;
    });

    stats.averageOrderSize = stats.totalOrders > 0
        ? stats.totalVolume / stats.totalOrders
        : 0;

    return stats;
}

/**
 * Educational content about order types
 */
function getOrderTypeEducation() {
    return {
        'market': {
            name: 'Market Order',
            description: 'Executes immediately at the current market price',
            pros: [
                'Guaranteed execution',
                'Fast and simple',
                'Best for liquid stocks'
            ],
            cons: [
                'No price control',
                'Subject to slippage',
                'Can be expensive during volatility'
            ],
            whenToUse: 'When you want immediate execution and are less concerned about the exact price',
            example: 'Buying 100 shares of AAPL at current market price (~$180)'
        },
        'limit': {
            name: 'Limit Order',
            description: 'Executes only at your specified price or better',
            pros: [
                'Price control',
                'Prevents overpaying',
                'Good for illiquid stocks'
            ],
            cons: [
                'May not execute',
                'Can miss opportunities',
                'Requires monitoring'
            ],
            whenToUse: 'When you want to control your entry/exit price and can wait for execution',
            example: 'Buy 100 TSLA only if price drops to $200 or below'
        },
        'stop-loss': {
            name: 'Stop-Loss Order',
            description: 'Automatically sells when price hits your stop price, limiting losses',
            pros: [
                'Risk management',
                'Emotion-free exits',
                'Protects profits'
            ],
            cons: [
                'Can trigger on temporary dips',
                'Executes as market order',
                'No price guarantee'
            ],
            whenToUse: 'To protect against large losses or lock in profits on winning positions',
            example: 'Sell 100 NVDA if price drops to $400 (bought at $450)'
        },
        'stop-limit': {
            name: 'Stop-Limit Order',
            description: 'Triggers a limit order when stop price is hit, giving more control',
            pros: [
                'Price control after trigger',
                'Prevents panic selling',
                'Better than stop-loss in fast markets'
            ],
            cons: [
                'May not execute',
                'More complex',
                'Can miss exit in fast drops'
            ],
            whenToUse: 'When you want stop-loss protection but also want control over execution price',
            example: 'If MSFT drops to $350, try to sell at $345 or better'
        },
        'trailing-stop': {
            name: 'Trailing Stop Order',
            description: 'Stop price automatically adjusts as stock price moves in your favor',
            pros: [
                'Locks in profits',
                'Lets winners run',
                'Automatic adjustment'
            ],
            cons: [
                'Can exit too early in volatility',
                'Requires careful trail setting',
                'May miss reversals'
            ],
            whenToUse: 'To protect profits while letting winners run, especially in trending markets',
            example: 'Sell AAPL if it drops 5% from its highest price since purchase'
        }
    };
}

// Export for use in main app
if (typeof window !== 'undefined') {
    window.advancedOrders = {
        createMarketOrder,
        createLimitOrder,
        createStopLossOrder,
        createStopLimitOrder,
        createTrailingStopOrder,
        processPendingOrders,
        cancelOrder,
        getOrderStatistics,
        getOrderTypeEducation,
        OrderStatus
    };
}
