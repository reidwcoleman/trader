// Short Selling Functions for FinClash

// Execute short sell
function executeShort(portfolio, symbol, price, quantity) {
    // Initialize shortPositions if not exists
    if (!portfolio.shortPositions) {
        portfolio.shortPositions = {};
    }

    // Receive cash for short sale (you get the money upfront)
    const proceeds = price * quantity;
    portfolio.cash += proceeds;

    // Record short position
    if (portfolio.shortPositions[symbol]) {
        // Average down the entry price if adding to existing short
        const existingQty = portfolio.shortPositions[symbol].quantity;
        const existingEntry = portfolio.shortPositions[symbol].entryPrice;
        const totalQty = existingQty + quantity;
        const avgEntry = ((existingEntry * existingQty) + (price * quantity)) / totalQty;

        portfolio.shortPositions[symbol] = {
            quantity: totalQty,
            entryPrice: avgEntry
        };
    } else {
        portfolio.shortPositions[symbol] = {
            quantity: quantity,
            entryPrice: price
        };
    }

    // Record in history
    portfolio.history.push({
        type: 'short',
        symbol: symbol,
        price: price,
        quantity: quantity,
        timestamp: Date.now(),
        total: proceeds
    });

    return portfolio;
}

// Execute cover (buy back short position)
function executeCover(portfolio, symbol, price, quantity, stocks) {
    if (!portfolio.shortPositions || !portfolio.shortPositions[symbol]) {
        throw new Error(`No short position in ${symbol} to cover`);
    }

    const shortPosition = portfolio.shortPositions[symbol];

    if (quantity > shortPosition.quantity) {
        throw new Error(`Cannot cover ${quantity} shares. You only have ${shortPosition.quantity} shares shorted.`);
    }

    // Calculate cost to buy back
    const coverCost = price * quantity;

    if (portfolio.cash < coverCost) {
        throw new Error(`Insufficient funds to cover short position. Need $${coverCost.toFixed(2)}`);
    }

    // Pay to buy back shares
    portfolio.cash -= coverCost;

    // Calculate profit/loss
    const profitLoss = (shortPosition.entryPrice - price) * quantity;

    // Update short position
    if (quantity === shortPosition.quantity) {
        // Fully covered
        delete portfolio.shortPositions[symbol];
    } else {
        // Partially covered
        portfolio.shortPositions[symbol].quantity -= quantity;
    }

    // Record in history
    portfolio.history.push({
        type: 'cover',
        symbol: symbol,
        price: price,
        quantity: quantity,
        timestamp: Date.now(),
        total: coverCost,
        profitLoss: profitLoss
    });

    return { portfolio, profitLoss };
}

// Get current short position
function getShortPosition(portfolio, symbol) {
    if (!portfolio.shortPositions || !portfolio.shortPositions[symbol]) {
        return { quantity: 0, entryPrice: 0 };
    }
    return portfolio.shortPositions[symbol];
}

// Calculate unrealized P/L for short position
function calculateShortPnL(portfolio, symbol, currentPrice) {
    const position = getShortPosition(portfolio, symbol);
    if (position.quantity === 0) return 0;

    // Short P/L = (entry price - current price) * quantity
    return (position.entryPrice - currentPrice) * position.quantity;
}

// Get max shares you can short (based on available margin)
// For simplicity, allow shorting up to cash value / 2 (50% margin requirement)
function getMaxShortQuantity(portfolio, price) {
    const availableMargin = portfolio.cash * 2; // 2:1 leverage
    return Math.floor(availableMargin / price);
}

// Validate short sell
function validateShort(portfolio, symbol, price, quantity) {
    const errors = [];

    if (quantity <= 0) {
        errors.push('Quantity must be positive');
    }

    const maxShort = getMaxShortQuantity(portfolio, price);
    if (quantity > maxShort) {
        errors.push(`Insufficient margin. Max short: ${maxShort} shares`);
    }

    // Check if already have long position (can't have both)
    if (portfolio.positions && portfolio.positions[symbol] > 0) {
        errors.push(`Cannot short ${symbol} while holding long position. Sell your shares first.`);
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Validate cover
function validateCover(portfolio, symbol, price, quantity) {
    const errors = [];

    if (quantity <= 0) {
        errors.push('Quantity must be positive');
    }

    const shortPosition = getShortPosition(portfolio, symbol);
    if (shortPosition.quantity === 0) {
        errors.push(`No short position in ${symbol} to cover`);
    }

    if (quantity > shortPosition.quantity) {
        errors.push(`Cannot cover ${quantity} shares. You only have ${shortPosition.quantity} shares shorted.`);
    }

    const coverCost = price * quantity;
    if (portfolio.cash < coverCost) {
        errors.push(`Insufficient funds. Need $${coverCost.toFixed(2)}, have $${portfolio.cash.toFixed(2)}`);
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Make functions available globally
if (typeof window !== 'undefined') {
    window.shortSelling = {
        executeShort,
        executeCover,
        getShortPosition,
        calculateShortPnL,
        getMaxShortQuantity,
        validateShort,
        validateCover
    };
}
