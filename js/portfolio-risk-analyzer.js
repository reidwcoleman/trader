// Portfolio Risk Analyzer for FinClash
// Professional risk metrics: VaR, Sharpe Ratio, Beta, Alpha, Maximum Drawdown, etc.

/**
 * Portfolio Risk Analyzer
 * Calculates institutional-grade risk metrics
 */
class PortfolioRiskAnalyzer {
    constructor() {
        this.riskFreeRate = 0.045; // 4.5% (current 10-year Treasury yield)
        this.marketBeta = 1.0; // SPY beta (by definition)
    }

    /**
     * Calculate Value at Risk (VaR)
     * 95% confidence - maximum expected loss in worst 5% of scenarios
     */
    calculateVaR(portfolio, confidence = 0.95, timeHorizon = 1) {
        const returns = this.calculateDailyReturns(portfolio);
        if (returns.length < 20) {
            return {
                var95: null,
                var99: null,
                error: 'Insufficient data (need 20+ days of history)'
            };
        }

        // Sort returns from worst to best
        const sortedReturns = [...returns].sort((a, b) => a - b);

        // Find VaR at confidence level
        const index95 = Math.floor((1 - 0.95) * sortedReturns.length);
        const index99 = Math.floor((1 - 0.99) * sortedReturns.length);

        const dailyVaR95 = -sortedReturns[index95]; // Negative because we want loss amount
        const dailyVaR99 = -sortedReturns[index99];

        // Scale to time horizon
        const var95 = dailyVaR95 * Math.sqrt(timeHorizon);
        const var99 = dailyVaR99 * Math.sqrt(timeHorizon);

        // Dollar amount at risk
        const portfolioValue = this.getPortfolioValue(portfolio);
        const dollarVaR95 = portfolioValue * var95;
        const dollarVaR99 = portfolioValue * var99;

        return {
            var95: (var95 * 100).toFixed(2) + '%',
            var99: (var99 * 100).toFixed(2) + '%',
            dollarVaR95: dollarVaR95.toFixed(2),
            dollarVaR99: dollarVaR99.toFixed(2),
            interpretation: `With 95% confidence, you won't lose more than $${dollarVaR95.toFixed(0)} in ${timeHorizon} day(s)`,
            timeHorizon,
            confidence: confidence * 100
        };
    }

    /**
     * Calculate Sharpe Ratio
     * Measures risk-adjusted returns (higher is better)
     */
    calculateSharpeRatio(portfolio) {
        const returns = this.calculateDailyReturns(portfolio);
        if (returns.length < 10) {
            return { sharpe: null, error: 'Insufficient data' };
        }

        // Calculate average return
        const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;

        // Annualize (assume 252 trading days)
        const annualizedReturn = avgReturn * 252;

        // Calculate standard deviation (volatility)
        const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
        const stdDev = Math.sqrt(variance);
        const annualizedVolatility = stdDev * Math.sqrt(252);

        // Sharpe Ratio = (Return - RiskFreeRate) / Volatility
        const sharpeRatio = (annualizedReturn - this.riskFreeRate) / annualizedVolatility;

        return {
            sharpe: sharpeRatio.toFixed(2),
            annualizedReturn: (annualizedReturn * 100).toFixed(2) + '%',
            annualizedVolatility: (annualizedVolatility * 100).toFixed(2) + '%',
            riskFreeRate: (this.riskFreeRate * 100).toFixed(2) + '%',
            interpretation: this.interpretSharpe(sharpeRatio),
            rating: this.getSharpeRating(sharpeRatio)
        };
    }

    interpretSharpe(ratio) {
        if (ratio > 3) return '🌟 Exceptional - Outstanding risk-adjusted returns';
        if (ratio > 2) return '🏆 Excellent - Very strong risk-adjusted returns';
        if (ratio > 1) return '✅ Good - Returns justify the risk taken';
        if (ratio > 0) return '⚪ Acceptable - Beating risk-free rate, but risky';
        return '❌ Poor - Not compensated for risk taken';
    }

    getSharpeRating(ratio) {
        if (ratio > 3) return 'A+';
        if (ratio > 2) return 'A';
        if (ratio > 1.5) return 'B+';
        if (ratio > 1) return 'B';
        if (ratio > 0.5) return 'C';
        if (ratio > 0) return 'D';
        return 'F';
    }

    /**
     * Calculate Beta (market correlation)
     * Beta > 1 = more volatile than market, Beta < 1 = less volatile
     */
    calculateBeta(portfolioReturns, marketReturns) {
        if (portfolioReturns.length !== marketReturns.length || portfolioReturns.length < 20) {
            return { beta: null, error: 'Insufficient or mismatched data' };
        }

        // Calculate covariance and market variance
        const n = portfolioReturns.length;

        const portfolioMean = portfolioReturns.reduce((a, b) => a + b, 0) / n;
        const marketMean = marketReturns.reduce((a, b) => a + b, 0) / n;

        let covariance = 0;
        let marketVariance = 0;

        for (let i = 0; i < n; i++) {
            covariance += (portfolioReturns[i] - portfolioMean) * (marketReturns[i] - marketMean);
            marketVariance += Math.pow(marketReturns[i] - marketMean, 2);
        }

        covariance /= n;
        marketVariance /= n;

        const beta = covariance / marketVariance;

        return {
            beta: beta.toFixed(2),
            interpretation: this.interpretBeta(beta),
            correlation: this.calculateCorrelation(portfolioReturns, marketReturns).toFixed(2),
            volatilityVsMarket: beta > 1 ? 'Higher' : beta < 1 ? 'Lower' : 'Same'
        };
    }

    interpretBeta(beta) {
        if (beta > 1.5) return '🔴 Very High Risk - 50%+ more volatile than market';
        if (beta > 1.2) return '🟠 High Risk - 20%+ more volatile than market';
        if (beta >= 0.8 && beta <= 1.2) return '🟡 Moderate Risk - Tracks market';
        if (beta >= 0.5) return '🟢 Low Risk - Less volatile than market';
        return '🔵 Very Low Risk - Independent of market moves';
    }

    /**
     * Calculate correlation coefficient
     */
    calculateCorrelation(x, y) {
        const n = x.length;
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
        const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

        return denominator === 0 ? 0 : numerator / denominator;
    }

    /**
     * Calculate Alpha (excess return vs market)
     * Positive alpha = outperforming market
     */
    calculateAlpha(portfolioReturns, marketReturns, beta) {
        const portfolioReturn = portfolioReturns.reduce((a, b) => a + b, 0) / portfolioReturns.length;
        const marketReturn = marketReturns.reduce((a, b) => a + b, 0) / marketReturns.length;

        // Annualize
        const annualPortfolioReturn = portfolioReturn * 252;
        const annualMarketReturn = marketReturn * 252;

        // Alpha = PortfolioReturn - (RiskFreeRate + Beta * (MarketReturn - RiskFreeRate))
        const expectedReturn = this.riskFreeRate + beta * (annualMarketReturn - this.riskFreeRate);
        const alpha = annualPortfolioReturn - expectedReturn;

        return {
            alpha: (alpha * 100).toFixed(2) + '%',
            interpretation: this.interpretAlpha(alpha),
            portfolioReturn: (annualPortfolioReturn * 100).toFixed(2) + '%',
            marketReturn: (annualMarketReturn * 100).toFixed(2) + '%',
            expectedReturn: (expectedReturn * 100).toFixed(2) + '%',
            outperformance: alpha > 0
        };
    }

    interpretAlpha(alpha) {
        if (alpha > 0.05) return '🌟 Excellent - Beating market by 5%+';
        if (alpha > 0.02) return '✅ Good - Outperforming market by 2-5%';
        if (alpha > -0.02) return '⚪ Neutral - Tracking market';
        if (alpha > -0.05) return '⚠️ Underperforming by 2-5%';
        return '❌ Poor - Underperforming market by 5%+';
    }

    /**
     * Calculate Maximum Drawdown
     * Worst peak-to-trough decline
     */
    calculateMaxDrawdown(portfolio) {
        const values = this.getPortfolioValueHistory(portfolio);
        if (values.length < 2) {
            return { maxDrawdown: null, error: 'Insufficient data' };
        }

        let maxDrawdown = 0;
        let peak = values[0];
        let peakDate = 0;
        let troughDate = 0;

        for (let i = 0; i < values.length; i++) {
            if (values[i] > peak) {
                peak = values[i];
                peakDate = i;
            }

            const drawdown = (peak - values[i]) / peak;
            if (drawdown > maxDrawdown) {
                maxDrawdown = drawdown;
                troughDate = i;
            }
        }

        // Recovery calculation
        let recovered = false;
        let recoveryDays = null;
        for (let i = troughDate; i < values.length; i++) {
            if (values[i] >= peak) {
                recovered = true;
                recoveryDays = i - peakDate;
                break;
            }
        }

        return {
            maxDrawdown: (maxDrawdown * 100).toFixed(2) + '%',
            peakValue: peak.toFixed(2),
            troughValue: values[troughDate].toFixed(2),
            drawdownDollar: (peak - values[troughDate]).toFixed(2),
            recovered,
            recoveryDays,
            interpretation: this.interpretDrawdown(maxDrawdown),
            severity: this.getDrawdownSeverity(maxDrawdown)
        };
    }

    interpretDrawdown(dd) {
        if (dd > 0.5) return '🔴 Severe - Lost over 50% from peak';
        if (dd > 0.3) return '🟠 High - Lost 30-50% from peak';
        if (dd > 0.2) return '🟡 Moderate - Lost 20-30% from peak';
        if (dd > 0.1) return '🟢 Low - Lost 10-20% from peak';
        return '🔵 Minimal - Less than 10% loss';
    }

    getDrawdownSeverity(dd) {
        if (dd > 0.5) return 'Severe';
        if (dd > 0.3) return 'High';
        if (dd > 0.2) return 'Moderate';
        if (dd > 0.1) return 'Low';
        return 'Minimal';
    }

    /**
     * Calculate Sortino Ratio (like Sharpe, but only penalizes downside volatility)
     */
    calculateSortinoRatio(portfolio) {
        const returns = this.calculateDailyReturns(portfolio);
        if (returns.length < 10) {
            return { sortino: null, error: 'Insufficient data' };
        }

        const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
        const annualizedReturn = avgReturn * 252;

        // Calculate downside deviation (only negative returns)
        const downsideReturns = returns.filter(r => r < 0);
        const downsideVariance = downsideReturns.reduce((sum, r) => sum + r * r, 0) / returns.length;
        const downsideDeviation = Math.sqrt(downsideVariance) * Math.sqrt(252);

        const sortinoRatio = (annualizedReturn - this.riskFreeRate) / downsideDeviation;

        return {
            sortino: sortinoRatio.toFixed(2),
            interpretation: this.interpretSharpe(sortinoRatio), // Same interpretation as Sharpe
            downsideVolatility: (downsideDeviation * 100).toFixed(2) + '%'
        };
    }

    /**
     * Comprehensive risk report
     */
    generateRiskReport(portfolio, marketReturns = null) {
        const portfolioReturns = this.calculateDailyReturns(portfolio);

        const report = {
            portfolioValue: this.getPortfolioValue(portfolio),
            valueAtRisk: this.calculateVaR(portfolio),
            sharpeRatio: this.calculateSharpeRatio(portfolio),
            sortinoRatio: this.calculateSortinoRatio(portfolio),
            maxDrawdown: this.calculateMaxDrawdown(portfolio),
            diversification: this.calculateDiversification(portfolio),
            timestamp: Date.now()
        };

        // Add beta/alpha if market data available
        if (marketReturns && portfolioReturns.length === marketReturns.length) {
            const beta = this.calculateBeta(portfolioReturns, marketReturns);
            report.beta = beta;
            if (beta.beta) {
                report.alpha = this.calculateAlpha(portfolioReturns, marketReturns, parseFloat(beta.beta));
            }
        }

        // Overall risk score
        report.overallRisk = this.calculateOverallRiskScore(report);

        return report;
    }

    /**
     * Calculate portfolio diversification
     */
    calculateDiversification(portfolio) {
        const positions = portfolio.positions || [];
        if (positions.length === 0) {
            return { score: 0, level: 'None' };
        }

        const totalValue = positions.reduce((sum, p) => sum + (p.value || 0), 0);

        // Calculate concentration (Herfindahl index)
        const weights = positions.map(p => (p.value || 0) / totalValue);
        const herfindahl = weights.reduce((sum, w) => sum + w * w, 0);

        // Convert to diversification score (0-100)
        const diversificationScore = (1 - herfindahl) * 100;

        // Check sector diversification
        const sectors = {};
        positions.forEach(p => {
            const sector = p.sector || 'Unknown';
            sectors[sector] = (sectors[sector] || 0) + (p.value || 0);
        });

        const sectorCount = Object.keys(sectors).length;

        return {
            score: Math.round(diversificationScore),
            level: this.getDiversificationLevel(diversificationScore),
            stockCount: positions.length,
            sectorCount,
            largestPosition: (Math.max(...weights) * 100).toFixed(1) + '%',
            topSectors: Object.entries(sectors)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([sector, value]) => ({
                    sector,
                    allocation: ((value / totalValue) * 100).toFixed(1) + '%'
                }))
        };
    }

    getDiversificationLevel(score) {
        if (score > 80) return 'Excellent';
        if (score > 60) return 'Good';
        if (score > 40) return 'Moderate';
        if (score > 20) return 'Poor';
        return 'Concentrated';
    }

    /**
     * Calculate overall risk score (0-100, higher = more risk)
     */
    calculateOverallRiskScore(report) {
        let score = 50; // Start neutral

        // Factor in Sharpe ratio
        const sharpe = parseFloat(report.sharpeRatio.sharpe);
        if (sharpe) {
            if (sharpe < 0) score += 20;
            else if (sharpe < 0.5) score += 10;
            else if (sharpe > 2) score -= 15;
            else if (sharpe > 1) score -= 10;
        }

        // Factor in max drawdown
        const dd = parseFloat(report.maxDrawdown.maxDrawdown) / 100;
        if (dd > 0.5) score += 25;
        else if (dd > 0.3) score += 15;
        else if (dd < 0.1) score -= 10;

        // Factor in diversification
        if (report.diversification.score < 30) score += 15;
        else if (report.diversification.score > 70) score -= 10;

        // Clamp to 0-100
        score = Math.max(0, Math.min(100, score));

        return {
            score: Math.round(score),
            level: this.getRiskLevel(score),
            interpretation: this.interpretOverallRisk(score)
        };
    }

    getRiskLevel(score) {
        if (score > 75) return 'Very High';
        if (score > 60) return 'High';
        if (score > 40) return 'Moderate';
        if (score > 25) return 'Low';
        return 'Very Low';
    }

    interpretOverallRisk(score) {
        if (score > 75) return '🔴 Very risky portfolio. Consider reducing position sizes or adding diversification.';
        if (score > 60) return '🟠 High risk portfolio. Monitor closely and use stop-losses.';
        if (score > 40) return '🟡 Moderate risk. Balanced approach for experienced traders.';
        if (score > 25) return '🟢 Conservative portfolio. Lower risk, more stable returns.';
        return '🔵 Very conservative. Minimal risk, limited upside.';
    }

    /**
     * Helper methods
     */
    calculateDailyReturns(portfolio) {
        const history = portfolio.valueHistory || [];
        const returns = [];

        for (let i = 1; i < history.length; i++) {
            const dailyReturn = (history[i] - history[i - 1]) / history[i - 1];
            returns.push(dailyReturn);
        }

        return returns;
    }

    getPortfolioValue(portfolio) {
        return portfolio.currentValue || portfolio.positions.reduce((sum, p) => sum + (p.value || 0), 0);
    }

    getPortfolioValueHistory(portfolio) {
        return portfolio.valueHistory || [portfolio.currentValue || 0];
    }
}

// Export for use in main app
if (typeof window !== 'undefined') {
    window.PortfolioRiskAnalyzer = PortfolioRiskAnalyzer;
}
