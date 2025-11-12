// Options Trading System for FinClash
// Supports Call and Put options with realistic pricing using Black-Scholes model

/**
 * BLACK-SCHOLES OPTION PRICING MODEL
 * Industry-standard model for European-style options pricing
 */

// Standard normal cumulative distribution function
function normalCDF(x) {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2);
    const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - prob : prob;
}

// Standard normal probability density function
function normalPDF(x) {
    return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

/**
 * Calculate option price using Black-Scholes model
 * @param {string} type - 'call' or 'put'
 * @param {number} stockPrice - Current stock price
 * @param {number} strikePrice - Option strike price
 * @param {number} timeToExpiry - Time to expiration in years
 * @param {number} volatility - Annual volatility (e.g., 0.3 for 30%)
 * @param {number} riskFreeRate - Risk-free interest rate (e.g., 0.05 for 5%)
 * @returns {number} Option price
 */
function blackScholesPrice(type, stockPrice, strikePrice, timeToExpiry, volatility, riskFreeRate = 0.05) {
    if (timeToExpiry <= 0) {
        // Option expired - intrinsic value only
        if (type === 'call') {
            return Math.max(0, stockPrice - strikePrice);
        } else {
            return Math.max(0, strikePrice - stockPrice);
        }
    }

    const d1 = (Math.log(stockPrice / strikePrice) + (riskFreeRate + volatility * volatility / 2) * timeToExpiry) /
               (volatility * Math.sqrt(timeToExpiry));
    const d2 = d1 - volatility * Math.sqrt(timeToExpiry);

    if (type === 'call') {
        return stockPrice * normalCDF(d1) - strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(d2);
    } else {
        return strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(-d2) - stockPrice * normalCDF(-d1);
    }
}

/**
 * Calculate Option Greeks
 * Greeks measure sensitivity of option price to various factors
 */
function calculateGreeks(type, stockPrice, strikePrice, timeToExpiry, volatility, riskFreeRate = 0.05) {
    if (timeToExpiry <= 0) {
        return { delta: 0, gamma: 0, theta: 0, vega: 0, rho: 0 };
    }

    const d1 = (Math.log(stockPrice / strikePrice) + (riskFreeRate + volatility * volatility / 2) * timeToExpiry) /
               (volatility * Math.sqrt(timeToExpiry));
    const d2 = d1 - volatility * Math.sqrt(timeToExpiry);

    const greeks = {};

    // Delta: Rate of change of option price with respect to stock price
    // Call delta: 0 to 1, Put delta: -1 to 0
    if (type === 'call') {
        greeks.delta = normalCDF(d1);
    } else {
        greeks.delta = normalCDF(d1) - 1;
    }

    // Gamma: Rate of change of delta with respect to stock price
    // Measures convexity - same for calls and puts
    greeks.gamma = normalPDF(d1) / (stockPrice * volatility * Math.sqrt(timeToExpiry));

    // Theta: Rate of change of option price with respect to time (time decay)
    // Usually negative - options lose value as time passes
    const theta1 = -(stockPrice * normalPDF(d1) * volatility) / (2 * Math.sqrt(timeToExpiry));
    if (type === 'call') {
        greeks.theta = (theta1 - riskFreeRate * strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(d2)) / 365;
    } else {
        greeks.theta = (theta1 + riskFreeRate * strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(-d2)) / 365;
    }

    // Vega: Rate of change of option price with respect to volatility
    // Same for calls and puts
    greeks.vega = stockPrice * normalPDF(d1) * Math.sqrt(timeToExpiry) / 100;

    // Rho: Rate of change of option price with respect to interest rate
    if (type === 'call') {
        greeks.rho = strikePrice * timeToExpiry * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(d2) / 100;
    } else {
        greeks.rho = -strikePrice * timeToExpiry * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(-d2) / 100;
    }

    return greeks;
}

/**
 * Estimate implied volatility from stock data
 * Based on historical price movements
 */
function estimateImpliedVolatility(stockData) {
    // If stock has volatility metric, use it
    if (stockData.volatility) {
        return stockData.volatility / 100;
    }

    // Otherwise, estimate from recent price changes
    // Default to 30% annual volatility for most stocks
    const baseVolatility = 0.30;

    // Adjust based on stock sector/type
    if (stockData.symbol.includes('BTC') || stockData.symbol.includes('COIN')) {
        return 0.80; // Crypto-related stocks are highly volatile
    } else if (stockData.symbol === 'SPY' || stockData.symbol === 'QQQ') {
        return 0.15; // ETFs are less volatile
    } else if (stockData.change && Math.abs(stockData.change) > 5) {
        return 0.50; // High recent volatility
    }

    return baseVolatility;
}

/**
 * Generate option chain (available strikes and expirations)
 */
function generateOptionChain(stockPrice) {
    const strikes = [];
    const baseStrike = Math.round(stockPrice / 5) * 5; // Round to nearest $5

    // Generate strikes from -20% to +20% of current price
    for (let i = -4; i <= 4; i++) {
        const strike = baseStrike + (i * 5);
        if (strike > 0) {
            strikes.push(strike);
        }
    }

    // Available expiration dates (weekly and monthly)
    const expirations = [];
    const today = new Date();

    // Weekly options (next 4 weeks)
    for (let weeks = 1; weeks <= 4; weeks++) {
        const expDate = new Date(today);
        expDate.setDate(expDate.getDate() + (weeks * 7));
        // Set to Friday
        expDate.setDate(expDate.getDate() + (5 - expDate.getDay()));
        expirations.push({
            date: expDate,
            label: `${weeks}w`,
            daysToExpiry: weeks * 7,
            type: 'weekly'
        });
    }

    // Monthly options (next 3 months)
    for (let months = 1; months <= 3; months++) {
        const expDate = new Date(today);
        expDate.setMonth(expDate.getMonth() + months);
        // Third Friday of the month
        expDate.setDate(1);
        expDate.setDate(15 + (5 - new Date(expDate.getFullYear(), expDate.getMonth(), 15).getDay()));

        const daysToExpiry = Math.floor((expDate - today) / (1000 * 60 * 60 * 24));
        expirations.push({
            date: expDate,
            label: `${months}m`,
            daysToExpiry: daysToExpiry,
            type: 'monthly'
        });
    }

    return { strikes, expirations };
}

/**
 * Execute option purchase
 */
function buyOption(portfolio, stock, optionType, strikePrice, expiration, contracts) {
    const stockPrice = stock.price;
    const volatility = estimateImpliedVolatility(stock);
    const daysToExpiry = expiration.daysToExpiry;
    const timeToExpiry = daysToExpiry / 365;

    // Calculate option price per share
    const pricePerShare = blackScholesPrice(optionType, stockPrice, strikePrice, timeToExpiry, volatility);

    // Total cost (1 contract = 100 shares)
    const totalCost = pricePerShare * contracts * 100;

    if (totalCost > portfolio.cash) {
        throw new Error(`Insufficient funds. Need $${totalCost.toFixed(2)}, have $${portfolio.cash.toFixed(2)}`);
    }

    // Initialize options array if not exists
    if (!portfolio.options) {
        portfolio.options = [];
    }

    const greeks = calculateGreeks(optionType, stockPrice, strikePrice, timeToExpiry, volatility);

    // Create option position
    const option = {
        id: Date.now() + Math.random(),
        symbol: stock.symbol,
        type: optionType, // 'call' or 'put'
        strikePrice: strikePrice,
        contracts: contracts,
        purchasePrice: pricePerShare,
        purchaseDate: new Date().toISOString(),
        expirationDate: expiration.date.toISOString(),
        daysToExpiry: daysToExpiry,
        volatility: volatility,
        greeks: greeks,
        status: 'open' // 'open', 'closed', 'expired'
    };

    portfolio.options.push(option);
    portfolio.cash -= totalCost;

    // Record in history
    portfolio.history.push({
        type: 'buy_option',
        symbol: stock.symbol,
        optionType: optionType,
        strikePrice: strikePrice,
        contracts: contracts,
        price: pricePerShare,
        total: totalCost,
        timestamp: new Date().toISOString()
    });

    return {
        portfolio,
        option,
        totalCost,
        message: `Bought ${contracts} ${optionType.toUpperCase()} contract(s) @ $${pricePerShare.toFixed(2)}/share`
    };
}

/**
 * Sell/Close option position
 */
function sellOption(portfolio, optionId, stock) {
    const optionIndex = portfolio.options.findIndex(opt => opt.id === optionId);
    if (optionIndex === -1) {
        throw new Error('Option position not found');
    }

    const option = portfolio.options[optionIndex];
    if (option.status !== 'open') {
        throw new Error('Option position is already closed');
    }

    const stockPrice = stock.price;
    const expDate = new Date(option.expirationDate);
    const now = new Date();
    const daysToExpiry = Math.max(0, Math.floor((expDate - now) / (1000 * 60 * 60 * 24)));
    const timeToExpiry = daysToExpiry / 365;

    // Calculate current option price
    const currentPrice = blackScholesPrice(
        option.type,
        stockPrice,
        option.strikePrice,
        timeToExpiry,
        option.volatility
    );

    const totalValue = currentPrice * option.contracts * 100;
    const totalCost = option.purchasePrice * option.contracts * 100;
    const profitLoss = totalValue - totalCost;

    portfolio.cash += totalValue;
    option.status = 'closed';
    option.closePrice = currentPrice;
    option.closeDate = new Date().toISOString();
    option.profitLoss = profitLoss;

    // Record in history
    portfolio.history.push({
        type: 'sell_option',
        symbol: option.symbol,
        optionType: option.type,
        strikePrice: option.strikePrice,
        contracts: option.contracts,
        price: currentPrice,
        total: totalValue,
        profitLoss: profitLoss,
        timestamp: new Date().toISOString()
    });

    return {
        portfolio,
        totalValue,
        profitLoss,
        message: `Sold ${option.contracts} ${option.type.toUpperCase()} contract(s) @ $${currentPrice.toFixed(2)}/share. P/L: ${profitLoss >= 0 ? '+' : ''}$${profitLoss.toFixed(2)}`
    };
}

/**
 * Exercise option (only if in-the-money)
 */
function exerciseOption(portfolio, optionId, stock) {
    const optionIndex = portfolio.options.findIndex(opt => opt.id === optionId);
    if (optionIndex === -1) {
        throw new Error('Option position not found');
    }

    const option = portfolio.options[optionIndex];
    if (option.status !== 'open') {
        throw new Error('Option position is already closed');
    }

    const stockPrice = stock.price;
    const intrinsicValue = option.type === 'call'
        ? Math.max(0, stockPrice - option.strikePrice)
        : Math.max(0, option.strikePrice - stockPrice);

    if (intrinsicValue <= 0) {
        throw new Error('Option is out-of-the-money. Cannot exercise profitably.');
    }

    const sharesAcquired = option.contracts * 100;

    if (option.type === 'call') {
        // Exercise call: Buy shares at strike price
        const totalCost = option.strikePrice * sharesAcquired;
        if (totalCost > portfolio.cash) {
            throw new Error(`Insufficient cash to exercise. Need $${totalCost.toFixed(2)}`);
        }

        portfolio.cash -= totalCost;
        portfolio.positions[option.symbol] = (portfolio.positions[option.symbol] || 0) + sharesAcquired;
    } else {
        // Exercise put: Sell shares at strike price
        const currentShares = portfolio.positions[option.symbol] || 0;
        if (currentShares < sharesAcquired) {
            throw new Error(`Insufficient shares to exercise put. Need ${sharesAcquired} shares.`);
        }

        const totalProceeds = option.strikePrice * sharesAcquired;
        portfolio.cash += totalProceeds;
        portfolio.positions[option.symbol] -= sharesAcquired;
    }

    option.status = 'exercised';
    option.exerciseDate = new Date().toISOString();

    // Record in history
    portfolio.history.push({
        type: 'exercise_option',
        symbol: option.symbol,
        optionType: option.type,
        strikePrice: option.strikePrice,
        contracts: option.contracts,
        shares: sharesAcquired,
        timestamp: new Date().toISOString()
    });

    return {
        portfolio,
        sharesAcquired,
        message: `Exercised ${option.contracts} ${option.type.toUpperCase()} contract(s). ${option.type === 'call' ? 'Acquired' : 'Sold'} ${sharesAcquired} shares @ $${option.strikePrice.toFixed(2)}`
    };
}

/**
 * Update all option values (for portfolio display)
 */
function updateOptionsValues(portfolio, stocks) {
    if (!portfolio.options || portfolio.options.length === 0) {
        return { totalValue: 0, totalPnL: 0, options: [] };
    }

    let totalValue = 0;
    let totalCost = 0;
    const updatedOptions = [];

    for (const option of portfolio.options) {
        if (option.status !== 'open') continue;

        const stock = stocks.find(s => s.symbol === option.symbol);
        if (!stock) continue;

        const expDate = new Date(option.expirationDate);
        const now = new Date();
        const daysToExpiry = Math.max(0, Math.floor((expDate - now) / (1000 * 60 * 60 * 24)));
        const timeToExpiry = daysToExpiry / 365;

        // Check if expired
        if (daysToExpiry <= 0) {
            option.status = 'expired';
            option.expiryValue = 0;
            continue;
        }

        const currentPrice = blackScholesPrice(
            option.type,
            stock.price,
            option.strikePrice,
            timeToExpiry,
            option.volatility
        );

        const greeks = calculateGreeks(
            option.type,
            stock.price,
            option.strikePrice,
            timeToExpiry,
            option.volatility
        );

        const optionValue = currentPrice * option.contracts * 100;
        const optionCost = option.purchasePrice * option.contracts * 100;
        const pnl = optionValue - optionCost;

        totalValue += optionValue;
        totalCost += optionCost;

        updatedOptions.push({
            ...option,
            currentPrice,
            currentValue: optionValue,
            pnl,
            pnlPercent: (pnl / optionCost) * 100,
            daysToExpiry,
            greeks,
            inTheMoney: option.type === 'call'
                ? stock.price > option.strikePrice
                : stock.price < option.strikePrice
        });
    }

    return {
        totalValue,
        totalCost,
        totalPnL: totalValue - totalCost,
        options: updatedOptions
    };
}

/**
 * Get option strategy recommendations
 */
function getOptionStrategies() {
    return [
        {
            name: 'Long Call',
            description: 'Buy a call option - Bullish strategy with limited risk',
            maxRisk: 'Premium paid',
            maxProfit: 'Unlimited',
            bestWhen: 'Expecting strong upward movement',
            complexity: 'Beginner'
        },
        {
            name: 'Long Put',
            description: 'Buy a put option - Bearish strategy with limited risk',
            maxRisk: 'Premium paid',
            maxProfit: 'Strike price - premium',
            bestWhen: 'Expecting strong downward movement',
            complexity: 'Beginner'
        },
        {
            name: 'Covered Call',
            description: 'Own stock + Sell call option - Generate income on holdings',
            maxRisk: 'Stock could fall (partially offset by premium)',
            maxProfit: 'Strike - stock price + premium',
            bestWhen: 'Neutral to slightly bullish, want income',
            complexity: 'Intermediate'
        },
        {
            name: 'Protective Put',
            description: 'Own stock + Buy put option - Insurance against downside',
            maxRisk: 'Premium paid',
            maxProfit: 'Unlimited (from stock gains)',
            bestWhen: 'Want to protect gains in your stock',
            complexity: 'Intermediate'
        },
        {
            name: 'Bull Call Spread',
            description: 'Buy low strike call + Sell high strike call - Limited risk/reward',
            maxRisk: 'Net premium paid',
            maxProfit: 'Difference in strikes - net premium',
            bestWhen: 'Moderately bullish',
            complexity: 'Advanced'
        },
        {
            name: 'Bear Put Spread',
            description: 'Buy high strike put + Sell low strike put - Limited risk/reward',
            maxRisk: 'Net premium paid',
            maxProfit: 'Difference in strikes - net premium',
            bestWhen: 'Moderately bearish',
            complexity: 'Advanced'
        },
        {
            name: 'Straddle',
            description: 'Buy call + Buy put at same strike - Bet on volatility',
            maxRisk: 'Total premiums paid',
            maxProfit: 'Unlimited',
            bestWhen: 'Expecting big move (either direction)',
            complexity: 'Advanced'
        },
        {
            name: 'Iron Condor',
            description: '4-leg strategy - Profit from low volatility',
            maxRisk: 'Difference in strikes - net credit',
            maxProfit: 'Net premium received',
            bestWhen: 'Expecting low volatility',
            complexity: 'Expert'
        }
    ];
}

// Export functions for use in main app
if (typeof window !== 'undefined') {
    window.optionsTrading = {
        blackScholesPrice,
        calculateGreeks,
        estimateImpliedVolatility,
        generateOptionChain,
        buyOption,
        sellOption,
        exerciseOption,
        updateOptionsValues,
        getOptionStrategies
    };
}
