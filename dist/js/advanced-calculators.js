// Advanced Calculators for FinClash Learning Tab
// 7 new professional calculators for trading education

/**
 * 1. Options Profit Calculator
 * Calculate profit/loss for options trades
 */
function calculateOptionsProfitLoss(params) {
    const { type, strikePrice, premium, stockPrice, contracts = 1 } = params;
    const contractSize = 100; // 1 contract = 100 shares

    const totalCost = premium * contracts * contractSize;
    let intrinsicValue = 0;

    if (type === 'call') {
        intrinsicValue = Math.max(0, stockPrice - strikePrice);
    } else if (type === 'put') {
        intrinsicValue = Math.max(0, strikePrice - stockPrice);
    }

    const totalValue = intrinsicValue * contracts * contractSize;
    const profitLoss = totalValue - totalCost;
    const profitLossPercent = (profitLoss / totalCost) * 100;

    // Break-even calculation
    let breakEven;
    if (type === 'call') {
        breakEven = strikePrice + premium;
    } else {
        breakEven = strikePrice - premium;
    }

    // Max profit/loss
    const maxLoss = totalCost;
    const maxProfit = type === 'call' ? Infinity : (strikePrice - premium) * contracts * contractSize;

    return {
        totalCost,
        currentValue: totalValue,
        profitLoss,
        profitLossPercent: profitLossPercent.toFixed(2),
        breakEven: breakEven.toFixed(2),
        maxLoss,
        maxProfit: maxProfit === Infinity ? 'Unlimited' : maxProfit.toFixed(2),
        roi: ((profitLoss / totalCost) * 100).toFixed(2)
    };
}

/**
 * 2. Compound Interest Calculator
 * Show power of reinvesting returns
 */
function calculateCompoundInterest(params) {
    const { principal, annualReturn, years, monthlyContribution = 0, compoundFrequency = 12 } = params;

    const results = [];
    let totalValue = principal;
    let totalContributed = principal;

    for (let year = 1; year <= years; year++) {
        // Add monthly contributions
        const yearlyContribution = monthlyContribution * 12;
        totalContributed += yearlyContribution;

        // Calculate compound interest
        const periodsPerYear = compoundFrequency;
        const ratePerPeriod = annualReturn / 100 / periodsPerYear;
        const periods = periodsPerYear;

        // Compound the existing value
        for (let period = 0; period < periods; period++) {
            totalValue = totalValue * (1 + ratePerPeriod);
            // Add monthly contribution
            if (monthlyContribution > 0 && period < 12) {
                totalValue += monthlyContribution;
            }
        }

        results.push({
            year,
            totalValue: totalValue.toFixed(2),
            totalContributed: totalContributed.toFixed(2),
            totalGains: (totalValue - totalContributed).toFixed(2),
            gainsPercent: ((totalValue - totalContributed) / totalContributed * 100).toFixed(2)
        });
    }

    return {
        final: results[results.length - 1],
        yearly: results
    };
}

/**
 * 3. Margin Calculator
 * Calculate buying power and margin requirements
 */
function calculateMargin(params) {
    const { cash, leverage = 2, stockPrice, shares } = params;

    const buyingPower = cash * leverage;
    const positionValue = stockPrice * shares;
    const marginRequired = positionValue / leverage;
    const marginUsed = Math.min(marginRequired, cash);
    const borrowed = positionValue - marginUsed;

    // Calculate margin percentage
    const equity = cash;
    const marginPercent = positionValue > 0 ? (equity / positionValue) * 100 : 100;

    // Maintenance margin warning
    const maintenanceMargin = 25;
    const isHealthy = marginPercent >= maintenanceMargin;
    const marginCallPrice = positionValue > 0
        ? (borrowed / shares) / (1 - maintenanceMargin / 100)
        : 0;

    return {
        buyingPower: buyingPower.toFixed(2),
        positionValue: positionValue.toFixed(2),
        marginRequired: marginRequired.toFixed(2),
        borrowed: borrowed.toFixed(2),
        marginPercent: marginPercent.toFixed(2),
        status: isHealthy ? 'Healthy' : 'Margin Call Risk',
        marginCallPrice: marginCallPrice.toFixed(2),
        availableBuyingPower: (buyingPower - positionValue).toFixed(2)
    };
}

/**
 * 4. Diversification Analyzer
 * Analyze portfolio concentration and suggest improvements
 */
function analyzeDiversification(holdings) {
    // holdings = [{symbol, shares, price, sector}]
    const totalValue = holdings.reduce((sum, h) => sum + (h.shares * h.price), 0);

    // Calculate position percentages
    const positions = holdings.map(h => {
        const value = h.shares * h.price;
        const percent = (value / totalValue) * 100;
        return {
            ...h,
            value,
            percent: percent.toFixed(2)
        };
    });

    // Sort by size
    positions.sort((a, b) => b.value - a.value);

    // Calculate concentration metrics
    const top3Concentration = positions.slice(0, 3).reduce((sum, p) => sum + parseFloat(p.percent), 0);
    const herfindahlIndex = positions.reduce((sum, p) => sum + Math.pow(parseFloat(p.percent), 2), 0);

    // Sector analysis
    const sectorMap = {};
    positions.forEach(p => {
        const sector = p.sector || 'Unknown';
        if (!sectorMap[sector]) {
            sectorMap[sector] = { value: 0, count: 0 };
        }
        sectorMap[sector].value += p.value;
        sectorMap[sector].count += 1;
    });

    const sectors = Object.entries(sectorMap).map(([sector, data]) => ({
        sector,
        value: data.value.toFixed(2),
        percent: ((data.value / totalValue) * 100).toFixed(2),
        stocks: data.count
    })).sort((a, b) => b.value - a.value);

    // Risk assessment
    let riskLevel = 'Low';
    let warnings = [];

    if (positions.length < 5) {
        riskLevel = 'High';
        warnings.push('Too few positions - aim for 8-15 stocks');
    } else if (positions.length < 8) {
        riskLevel = 'Moderate';
        warnings.push('Consider adding more positions for better diversification');
    }

    if (positions[0]?.percent > 20) {
        riskLevel = 'High';
        warnings.push(`Largest position (${positions[0].symbol}) is ${positions[0].percent}% - reduce to <20%`);
    }

    if (top3Concentration > 50) {
        if (riskLevel === 'Low') riskLevel = 'Moderate';
        warnings.push(`Top 3 positions are ${top3Concentration.toFixed(1)}% - reduce to <50%`);
    }

    if (sectors.length < 3) {
        if (riskLevel === 'Low') riskLevel = 'Moderate';
        warnings.push('Diversify across more sectors (aim for 4-6 sectors)');
    }

    if (sectors[0]?.percent > 40) {
        riskLevel = 'High';
        warnings.push(`${sectors[0].sector} sector is ${sectors[0].percent}% - reduce to <35%`);
    }

    return {
        totalValue: totalValue.toFixed(2),
        positions,
        sectors,
        metrics: {
            stockCount: positions.length,
            sectorCount: sectors.length,
            top3Concentration: top3Concentration.toFixed(2),
            herfindahlIndex: herfindahlIndex.toFixed(2),
            diversificationScore: Math.max(0, 100 - herfindahlIndex).toFixed(0)
        },
        riskLevel,
        warnings,
        recommendations: warnings.length === 0
            ? ['Portfolio is well-diversified!', 'Continue monitoring position sizes', 'Rebalance quarterly']
            : warnings
    };
}

/**
 * 5. Tax Impact Calculator
 * Calculate capital gains taxes
 */
function calculateTaxImpact(params) {
    const { costBasis, salePrice, shares, holdingPeriod, taxBracket } = params;

    const totalCost = costBasis * shares;
    const totalSale = salePrice * shares;
    const capitalGain = totalSale - totalCost;
    const gainPercent = (capitalGain / totalCost) * 100;

    // Determine tax type
    const isLongTerm = holdingPeriod > 365;

    // Tax rates (simplified US rates)
    let taxRate;
    if (isLongTerm) {
        // Long-term capital gains
        if (taxBracket <= 15) taxRate = 0;
        else if (taxBracket <= 37) taxRate = 15;
        else taxRate = 20;
    } else {
        // Short-term = ordinary income
        taxRate = taxBracket;
    }

    const taxOwed = capitalGain * (taxRate / 100);
    const afterTaxProfit = capitalGain - taxOwed;
    const afterTaxReturn = (afterTaxProfit / totalCost) * 100;

    return {
        capitalGain: capitalGain.toFixed(2),
        gainPercent: gainPercent.toFixed(2),
        holdingType: isLongTerm ? 'Long-term (>1 year)' : 'Short-term (<1 year)',
        taxRate: taxRate.toFixed(1),
        taxOwed: taxOwed.toFixed(2),
        afterTaxProfit: afterTaxProfit.toFixed(2),
        afterTaxReturn: afterTaxReturn.toFixed(2),
        savings: isLongTerm
            ? (capitalGain * (taxBracket - taxRate) / 100).toFixed(2)
            : 0,
        recommendation: isLongTerm
            ? 'Great! Long-term gains have lower tax rates.'
            : holdingPeriod > 300
                ? `Consider holding ${365 - holdingPeriod} more days for long-term status`
                : 'Short-term trade - higher taxes apply'
    };
}

/**
 * 6. Fibonacci Retracement Calculator
 * Calculate support/resistance levels
 */
function calculateFibonacciLevels(params) {
    const { high, low, direction = 'uptrend' } = params;

    const diff = high - low;

    // Standard Fibonacci ratios
    const ratios = {
        '0%': 0,
        '23.6%': 0.236,
        '38.2%': 0.382,
        '50%': 0.5,
        '61.8%': 0.618,
        '78.6%': 0.786,
        '100%': 1.0
    };

    // Extension levels
    const extensions = {
        '127.2%': 1.272,
        '161.8%': 1.618,
        '200%': 2.0,
        '261.8%': 2.618
    };

    let levels = [];

    if (direction === 'uptrend') {
        // For uptrends, retracements go down from high
        for (const [label, ratio] of Object.entries(ratios)) {
            const price = high - (diff * ratio);
            levels.push({
                label,
                price: price.toFixed(2),
                type: 'retracement',
                significance: ratio === 0.382 || ratio === 0.5 || ratio === 0.618 ? 'high' : 'medium'
            });
        }

        // Extensions go up from high
        for (const [label, ratio] of Object.entries(extensions)) {
            const price = high + (diff * (ratio - 1));
            levels.push({
                label,
                price: price.toFixed(2),
                type: 'extension',
                significance: ratio === 1.618 ? 'high' : 'medium'
            });
        }
    } else {
        // For downtrends, retracements go up from low
        for (const [label, ratio] of Object.entries(ratios)) {
            const price = low + (diff * ratio);
            levels.push({
                label,
                price: price.toFixed(2),
                type: 'retracement',
                significance: ratio === 0.382 || ratio === 0.5 || ratio === 0.618 ? 'high' : 'medium'
            });
        }

        // Extensions go down from low
        for (const [label, ratio] of Object.entries(extensions)) {
            const price = low - (diff * (ratio - 1));
            levels.push({
                label,
                price: price.toFixed(2),
                type: 'extension',
                significance: ratio === 1.618 ? 'high' : 'medium'
            });
        }
    }

    return {
        high,
        low,
        range: diff.toFixed(2),
        direction,
        levels,
        keyLevels: levels.filter(l => l.significance === 'high'),
        usage: direction === 'uptrend'
            ? 'In uptrends, buy at retracement levels (38.2%, 50%, 61.8%). Target extensions for profit.'
            : 'In downtrends, sell at retracement levels. Target extensions for shorts.'
    };
}

/**
 * 7. Break-Even Calculator
 * Calculate true break-even including fees
 */
function calculateBreakEven(params) {
    const { entryPrice, shares, commission = 0, spreadPercent = 0.1 } = params;

    const purchaseValue = entryPrice * shares;
    const buyCommission = commission;
    const sellCommission = commission;
    const totalCommissions = buyCommission + sellCommission;

    // Bid-ask spread cost (paid on entry)
    const spreadCost = purchaseValue * (spreadPercent / 100);

    // Total cost basis
    const totalCost = purchaseValue + totalCommissions + spreadCost;

    // Break-even price (including all costs)
    const breakEvenPrice = (totalCost + sellCommission) / shares;

    // Show cost breakdown
    const costs = {
        stockCost: purchaseValue.toFixed(2),
        buyCommission: buyCommission.toFixed(2),
        sellCommission: sellCommission.toFixed(2),
        spreadCost: spreadCost.toFixed(2),
        totalCosts: (totalCommissions + spreadCost).toFixed(2)
    };

    // Calculate required gain
    const requiredGain = breakEvenPrice - entryPrice;
    const requiredGainPercent = (requiredGain / entryPrice) * 100;

    return {
        entryPrice: entryPrice.toFixed(2),
        breakEvenPrice: breakEvenPrice.toFixed(2),
        requiredGain: requiredGain.toFixed(2),
        requiredGainPercent: requiredGainPercent.toFixed(2),
        costs,
        advice: requiredGainPercent > 2
            ? 'High fees/spread - consider reducing trade frequency'
            : requiredGainPercent > 1
                ? 'Moderate costs - factor into profit targets'
                : 'Low costs - good for active trading'
    };
}

// Export all calculators
if (typeof window !== 'undefined') {
    window.AdvancedCalculators = {
        calculateOptionsProfitLoss,
        calculateCompoundInterest,
        calculateMargin,
        analyzeDiversification,
        calculateTaxImpact,
        calculateFibonacciLevels,
        calculateBreakEven
    };
}
