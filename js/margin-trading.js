// Margin Trading System for FinClash
// Implements realistic margin trading with leverage, interest, and margin calls

/**
 * MARGIN TRADING EXPLAINED:
 *
 * Margin = Borrowing money from broker to buy more stock
 * Leverage = Using borrowed money to amplify returns (and losses)
 *
 * Standard Margin Rules (US):
 * - Initial Margin: 50% (Reg T) - You must put up 50% of purchase
 * - Maintenance Margin: 25% - Minimum equity required
 * - Interest: Charged on borrowed amount (typically 5-10% APR)
 */

const INITIAL_MARGIN_REQUIREMENT = 0.50;  // 50% (Reg T)
const MAINTENANCE_MARGIN = 0.25;          // 25% minimum
const DEFAULT_MARGIN_INTEREST_RATE = 0.08; // 8% annual

/**
 * Calculate buying power with margin
 */
function calculateBuyingPower(cash, marginMultiplier = 2) {
    // With 2:1 margin (50% initial margin), buying power is 2x cash
    // With 4:1 margin (25% initial margin - day trading), buying power is 4x cash
    return cash * marginMultiplier;
}

/**
 * Get margin account details
 */
function getMarginAccountStatus(portfolio, stocks, marginSettings = {}) {
    const interestRate = marginSettings.interestRate || DEFAULT_MARGIN_INTEREST_RATE;
    const marginMultiplier = marginSettings.multiplier || 2; // 2:1 leverage

    // Calculate total stock value
    let stockValue = 0;
    for (const [symbol, quantity] of Object.entries(portfolio.positions || {})) {
        const stock = stocks.find(s => s.symbol === symbol);
        if (stock && quantity > 0) {
            stockValue += stock.price * quantity;
        }
    }

    // Calculate short position liability
    let shortValue = 0;
    if (portfolio.shortPositions) {
        for (const [symbol, position] of Object.entries(portfolio.shortPositions)) {
            const stock = stocks.find(s => s.symbol === symbol);
            if (stock) {
                shortValue += stock.price * position.quantity;
            }
        }
    }

    // Account equity = cash + stock value - short liability - margin loan - interest owed
    const marginLoan = portfolio.marginLoan || 0;
    const interestOwed = portfolio.marginInterestOwed || 0;
    const equity = portfolio.cash + stockValue - shortValue - marginLoan - interestOwed;

    // Total account value for margin calculation
    const accountValue = stockValue + shortValue;

    // Margin used = Borrowed amount
    const marginUsed = marginLoan;

    // Buying power = Cash × leverage + unused margin
    const buyingPower = calculateBuyingPower(portfolio.cash, marginMultiplier);
    const availableBuyingPower = Math.max(0, buyingPower - accountValue);

    // Calculate margin percentage
    // Margin % = Equity / Total Account Value
    const marginPercentage = accountValue > 0 ? (equity / accountValue) : 1;

    // Determine status
    let status = 'healthy';
    let marginCallAmount = 0;

    if (marginPercentage < MAINTENANCE_MARGIN) {
        status = 'margin_call';
        // Calculate how much needed to restore to maintenance margin
        const requiredEquity = accountValue * MAINTENANCE_MARGIN;
        marginCallAmount = requiredEquity - equity;
    } else if (marginPercentage < 0.35) {
        status = 'warning'; // Approaching margin call
    }

    return {
        cash: portfolio.cash,
        stockValue,
        shortValue,
        marginLoan,
        interestOwed,
        equity,
        accountValue,
        marginUsed,
        buyingPower,
        availableBuyingPower,
        marginPercentage,
        status,
        marginCallAmount,
        maintenanceRequirement: MAINTENANCE_MARGIN,
        interestRate
    };
}

/**
 * Execute margin purchase (buying on margin)
 */
function executeMarginBuy(portfolio, symbol, quantity, price, stocks) {
    const totalCost = price * quantity;
    const marginRequired = totalCost * INITIAL_MARGIN_REQUIREMENT; // 50% down payment
    const borrowAmount = totalCost - marginRequired; // 50% borrowed

    // Check if enough cash for margin requirement
    if (portfolio.cash < marginRequired) {
        throw new Error(
            `Insufficient cash for margin requirement. Need $${marginRequired.toFixed(2)}, have $${portfolio.cash.toFixed(2)}`
        );
    }

    // Check buying power
    const marginStatus = getMarginAccountStatus(portfolio, stocks);
    if (totalCost > marginStatus.buyingPower) {
        throw new Error(
            `Exceeds buying power. Max: $${marginStatus.buyingPower.toFixed(2)}`
        );
    }

    // Execute purchase
    portfolio.cash -= marginRequired;
    portfolio.marginLoan = (portfolio.marginLoan || 0) + borrowAmount;
    portfolio.positions[symbol] = (portfolio.positions[symbol] || 0) + quantity;

    // Update cost basis
    if (!portfolio.costBasis) portfolio.costBasis = {};
    const currentShares = portfolio.positions[symbol] - quantity;
    const currentCost = (portfolio.costBasis[symbol] || 0) * currentShares;
    const newTotalCost = currentCost + totalCost;
    portfolio.costBasis[symbol] = newTotalCost / portfolio.positions[symbol];

    // Record transaction
    if (!portfolio.history) portfolio.history = [];
    portfolio.history.push({
        type: 'buy',
        marginTrade: true,
        symbol,
        quantity,
        price,
        total: totalCost,
        marginUsed: borrowAmount,
        timestamp: new Date().toISOString()
    });

    // Initialize margin tracking if not exists
    if (!portfolio.marginInterestOwed) {
        portfolio.marginInterestOwed = 0;
    }
    if (!portfolio.lastInterestCalculation) {
        portfolio.lastInterestCalculation = new Date().toISOString();
    }

    return {
        portfolio,
        totalCost,
        marginRequired,
        borrowed: borrowAmount,
        message: `Bought ${quantity} ${symbol} on margin. Down: $${marginRequired.toFixed(2)}, Borrowed: $${borrowAmount.toFixed(2)}`
    };
}

/**
 * Calculate and add margin interest
 * Should be called periodically (e.g., daily)
 */
function calculateMarginInterest(portfolio, interestRate = DEFAULT_MARGIN_INTEREST_RATE) {
    if (!portfolio.marginLoan || portfolio.marginLoan <= 0) {
        return {
            portfolio,
            interestCharged: 0,
            message: 'No margin loan - no interest charged'
        };
    }

    const lastCalc = portfolio.lastInterestCalculation
        ? new Date(portfolio.lastInterestCalculation)
        : new Date();
    const now = new Date();
    const daysPassed = (now - lastCalc) / (1000 * 60 * 60 * 24);

    // Calculate daily interest
    const dailyRate = interestRate / 365;
    const interestCharged = portfolio.marginLoan * dailyRate * daysPassed;

    portfolio.marginInterestOwed = (portfolio.marginInterestOwed || 0) + interestCharged;
    portfolio.lastInterestCalculation = now.toISOString();

    // Record in history
    if (!portfolio.marginInterestHistory) {
        portfolio.marginInterestHistory = [];
    }
    portfolio.marginInterestHistory.push({
        date: now.toISOString(),
        principal: portfolio.marginLoan,
        rate: interestRate,
        days: daysPassed,
        interest: interestCharged,
        totalOwed: portfolio.marginInterestOwed
    });

    return {
        portfolio,
        interestCharged,
        totalOwed: portfolio.marginInterestOwed,
        message: `Interest charged: $${interestCharged.toFixed(2)} (${daysPassed.toFixed(1)} days @ ${(interestRate * 100).toFixed(1)}% APR)`
    };
}

/**
 * Repay margin loan
 */
function repayMarginLoan(portfolio, amount) {
    if (!portfolio.marginLoan || portfolio.marginLoan <= 0) {
        throw new Error('No margin loan to repay');
    }

    if (amount <= 0) {
        throw new Error('Repayment amount must be positive');
    }

    // Can't repay more than owed
    const totalOwed = portfolio.marginLoan + (portfolio.marginInterestOwed || 0);
    const actualRepayment = Math.min(amount, totalOwed);

    if (actualRepayment > portfolio.cash) {
        throw new Error(
            `Insufficient cash. Need $${actualRepayment.toFixed(2)}, have $${portfolio.cash.toFixed(2)}`
        );
    }

    // Pay interest first, then principal
    let remaining = actualRepayment;
    let interestPaid = 0;
    let principalPaid = 0;

    if (portfolio.marginInterestOwed > 0) {
        interestPaid = Math.min(remaining, portfolio.marginInterestOwed);
        portfolio.marginInterestOwed -= interestPaid;
        remaining -= interestPaid;
    }

    if (remaining > 0) {
        principalPaid = Math.min(remaining, portfolio.marginLoan);
        portfolio.marginLoan -= principalPaid;
    }

    portfolio.cash -= actualRepayment;

    // Record transaction
    if (!portfolio.history) portfolio.history = [];
    portfolio.history.push({
        type: 'margin_repayment',
        amount: actualRepayment,
        principal: principalPaid,
        interest: interestPaid,
        remainingLoan: portfolio.marginLoan,
        timestamp: new Date().toISOString()
    });

    return {
        portfolio,
        totalPaid: actualRepayment,
        interestPaid,
        principalPaid,
        remainingLoan: portfolio.marginLoan,
        remainingInterest: portfolio.marginInterestOwed || 0,
        message: `Repaid $${actualRepayment.toFixed(2)} (Principal: $${principalPaid.toFixed(2)}, Interest: $${interestPaid.toFixed(2)})`
    };
}

/**
 * Check for margin call and force liquidation if necessary
 */
function checkMarginCall(portfolio, stocks) {
    const status = getMarginAccountStatus(portfolio, stocks);

    if (status.status !== 'margin_call') {
        return {
            hasMarginCall: false,
            marginStatus: status
        };
    }

    // Margin call - need to liquidate positions
    const liquidations = [];
    let cashRaised = 0;

    // Sort positions by loss (sell losers first to minimize impact)
    const positionsToSell = Object.entries(portfolio.positions || {})
        .filter(([symbol, qty]) => qty > 0)
        .map(([symbol, qty]) => {
            const stock = stocks.find(s => s.symbol === symbol);
            const costBasis = portfolio.costBasis?.[symbol] || stock?.price || 0;
            const currentValue = stock ? stock.price * qty : 0;
            const pnl = currentValue - (costBasis * qty);
            return { symbol, qty, stock, costBasis, currentValue, pnl };
        })
        .sort((a, b) => a.pnl - b.pnl); // Sort by P/L ascending (sell losers first)

    // Liquidate positions until margin call is satisfied
    for (const position of positionsToSell) {
        if (status.marginPercentage >= MAINTENANCE_MARGIN && cashRaised >= status.marginCallAmount) {
            break;
        }

        if (!position.stock) continue;

        // Sell entire position
        const saleProceeds = position.currentValue;
        portfolio.cash += saleProceeds;
        delete portfolio.positions[position.symbol];
        if (portfolio.costBasis) {
            delete portfolio.costBasis[position.symbol];
        }

        cashRaised += saleProceeds;
        liquidations.push({
            symbol: position.symbol,
            quantity: position.qty,
            price: position.stock.price,
            proceeds: saleProceeds,
            pnl: position.pnl
        });

        // Record forced sale
        if (!portfolio.history) portfolio.history = [];
        portfolio.history.push({
            type: 'sell',
            marginCall: true,
            forcedLiquidation: true,
            symbol: position.symbol,
            quantity: position.qty,
            price: position.stock.price,
            total: saleProceeds,
            timestamp: new Date().toISOString()
        });

        // Recalculate margin status
        status = getMarginAccountStatus(portfolio, stocks);
    }

    return {
        hasMarginCall: true,
        marginStatus: status,
        liquidations,
        cashRaised,
        message: `⚠️ MARGIN CALL! Liquidated ${liquidations.length} position(s) to raise $${cashRaised.toFixed(2)}`
    };
}

/**
 * Get margin trading education/warnings
 */
function getMarginEducation() {
    return {
        risks: [
            '⚠️ Amplified Losses: You can lose more than your initial investment',
            '⚠️ Margin Calls: Forced liquidation at unfavorable prices',
            '⚠️ Interest Costs: Daily interest charges on borrowed amount',
            '⚠️ Market Volatility: Rapid price drops can trigger margin calls',
            '⚠️ Concentration Risk: Over-leveraging a single position'
        ],
        rules: [
            'Initial Margin: 50% cash required (Reg T)',
            'Maintenance Margin: 25% minimum equity',
            'Interest Rate: Varies by broker (typically 5-12% APR)',
            'Margin Call: Occurs when equity falls below 25%',
            'Forced Liquidation: Broker can sell your positions without warning'
        ],
        bestPractices: [
            '✅ Start small - Use 10-25% of buying power, not 100%',
            '✅ Monitor daily - Check margin levels regularly',
            '✅ Set stop-losses - Protect against catastrophic losses',
            '✅ Pay interest promptly - Don\'t let it compound',
            '✅ Keep cash reserves - Buffer against margin calls',
            '❌ Don\'t over-leverage - Leave margin cushion',
            '❌ Don\'t margin volatile stocks - Too risky',
            '❌ Don\'t hold long-term - Interest adds up'
        ],
        calculations: {
            buyingPower: 'Cash × Leverage Multiplier (e.g., $10,000 × 2 = $20,000)',
            equity: 'Cash + Stock Value - Margin Loan - Interest',
            marginPercentage: 'Equity / Total Account Value',
            marginCall: 'Triggered when Margin % < 25%',
            dailyInterest: 'Margin Loan × (Annual Rate / 365)'
        }
    };
}

/**
 * Simulate margin scenarios (educational tool)
 */
function simulateMarginScenario(initialCash, purchaseAmount, leverage, priceChange) {
    const marginRequired = purchaseAmount * INITIAL_MARGIN_REQUIREMENT;
    const borrowed = purchaseAmount - marginRequired;

    // Starting position
    const startingEquity = initialCash - marginRequired;
    const sharesOwned = purchaseAmount / 100; // Assume $100/share

    // After price change
    const newPrice = 100 * (1 + priceChange / 100);
    const newValue = sharesOwned * newPrice;
    const newEquity = newValue - borrowed;
    const profitLoss = newEquity - startingEquity;
    const returnPercent = (profitLoss / marginRequired) * 100;

    // Margin percentage
    const marginPercentage = (newEquity / newValue) * 100;
    const hasMarginCall = marginPercentage < (MAINTENANCE_MARGIN * 100);

    return {
        initial: {
            cash: initialCash,
            purchaseAmount,
            marginRequired,
            borrowed,
            shares: sharesOwned,
            pricePerShare: 100
        },
        after: {
            priceChange: priceChange + '%',
            newPrice,
            positionValue: newValue,
            equity: newEquity,
            profitLoss,
            returnPercent: returnPercent.toFixed(2) + '%',
            marginPercentage: marginPercentage.toFixed(2) + '%',
            hasMarginCall,
            status: hasMarginCall ? '⚠️ MARGIN CALL' : '✅ Healthy'
        }
    };
}

// Export functions
if (typeof window !== 'undefined') {
    window.marginTrading = {
        calculateBuyingPower,
        getMarginAccountStatus,
        executeMarginBuy,
        calculateMarginInterest,
        repayMarginLoan,
        checkMarginCall,
        getMarginEducation,
        simulateMarginScenario,
        INITIAL_MARGIN_REQUIREMENT,
        MAINTENANCE_MARGIN,
        DEFAULT_MARGIN_INTEREST_RATE
    };
}
