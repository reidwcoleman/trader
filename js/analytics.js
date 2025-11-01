// Portfolio Analytics Functions for FinClash

// Calculate portfolio metrics
function calculatePortfolioMetrics(portfolio, stocks, performanceHistory = []) {
    const currentValue = calculateTotalValue(portfolio, stocks);
    const initialValue = 100000;
    const totalReturn = currentValue - initialValue;
    const totalReturnPercent = ((currentValue - initialValue) / initialValue) * 100;

    // Calculate daily returns for volatility
    const dailyReturns = [];
    for (let i = 1; i < performanceHistory.length; i++) {
        const dailyReturn = (performanceHistory[i] - performanceHistory[i-1]) / performanceHistory[i-1];
        dailyReturns.push(dailyReturn);
    }

    // Calculate volatility (standard deviation of returns)
    const volatility = calculateStandardDeviation(dailyReturns);

    // Calculate Sharpe Ratio (assuming 2% risk-free rate)
    const riskFreeRate = 0.02 / 252; // Daily risk-free rate
    const avgDailyReturn = dailyReturns.reduce((a, b) => a + b, 0) / (dailyReturns.length || 1);
    const sharpeRatio = volatility > 0 ? (avgDailyReturn - riskFreeRate) / volatility : 0;

    // Calculate max drawdown
    let maxDrawdown = 0;
    let peak = performanceHistory[0] || initialValue;
    for (const value of performanceHistory) {
        if (value > peak) peak = value;
        const drawdown = (peak - value) / peak;
        if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    }

    return {
        currentValue,
        totalReturn,
        totalReturnPercent,
        volatility: volatility * 100, // As percentage
        sharpeRatio: sharpeRatio * Math.sqrt(252), // Annualized
        maxDrawdown: maxDrawdown * 100, // As percentage
        numberOfTrades: (portfolio.history || []).length,
        winRate: calculateWinRate(portfolio.history || [])
    };
}

// Calculate total portfolio value including shorts
function calculateTotalValue(portfolio, stocks) {
    let total = portfolio.cash || 100000;

    // Long positions
    Object.entries(portfolio.positions || {}).forEach(([symbol, qty]) => {
        const stock = stocks.find(s => s.symbol === symbol);
        if (stock && qty > 0) {
            total += stock.price * qty;
        }
    });

    // Short positions (P/L = entry price - current price)
    Object.entries(portfolio.shortPositions || {}).forEach(([symbol, data]) => {
        if (data && data.quantity > 0) {
            const stock = stocks.find(s => s.symbol === symbol);
            if (stock) {
                const profitLoss = (data.entryPrice - stock.price) * data.quantity;
                total += profitLoss;
            }
        }
    });

    return total;
}

// Calculate standard deviation
function calculateStandardDeviation(values) {
    if (values.length === 0) return 0;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
    return Math.sqrt(variance);
}

// Calculate win rate from trade history
function calculateWinRate(history) {
    const trades = history.filter(t => t.type === 'sell' || t.type === 'cover');
    if (trades.length === 0) return 0;

    let wins = 0;
    trades.forEach(trade => {
        // Find corresponding buy/short trade
        const symbol = trade.symbol;
        const buyTrades = history.filter(t =>
            t.symbol === symbol &&
            (t.type === 'buy' || t.type === 'short') &&
            t.timestamp < trade.timestamp
        );

        if (buyTrades.length > 0) {
            const avgBuyPrice = buyTrades.reduce((sum, t) => sum + t.price, 0) / buyTrades.length;
            if (trade.type === 'sell' && trade.price > avgBuyPrice) wins++;
            if (trade.type === 'cover' && trade.price < avgBuyPrice) wins++;
        }
    });

    return (wins / trades.length) * 100;
}

// Get sector allocation
function getSectorAllocation(portfolio, stocks) {
    const sectors = {
        'Technology': 0,
        'Healthcare': 0,
        'Finance': 0,
        'Consumer': 0,
        'Energy': 0,
        'Other': 0
    };

    // Simple sector mapping (expand as needed)
    const sectorMap = {
        'AAPL': 'Technology', 'GOOGL': 'Technology', 'MSFT': 'Technology', 'NVDA': 'Technology', 'META': 'Technology', 'AMD': 'Technology',
        'AMZN': 'Consumer', 'TSLA': 'Consumer', 'DIS': 'Consumer', 'NKE': 'Consumer',
        'JPM': 'Finance', 'V': 'Finance', 'COIN': 'Finance',
        'NFLX': 'Other'
    };

    Object.entries(portfolio.positions || {}).forEach(([symbol, qty]) => {
        const stock = stocks.find(s => s.symbol === symbol);
        if (stock && qty > 0) {
            const value = stock.price * qty;
            const sector = sectorMap[symbol] || 'Other';
            sectors[sector] += value;
        }
    });

    return sectors;
}

// Make functions available globally
if (typeof window !== 'undefined') {
    window.analytics = {
        calculatePortfolioMetrics,
        calculateTotalValue,
        getSectorAllocation,
        calculateStandardDeviation,
        calculateWinRate
    };
}
