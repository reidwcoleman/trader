// Fundamental Analysis Module for FinClash
// Analyzes company financials: P/E, EPS, Revenue, Margins, Growth
// Uses Alpha Vantage API (fallback to calculations when API unavailable)

/**
 * FundamentalAnalyzer - Comprehensive company financial analysis
 */
class FundamentalAnalyzer {
    constructor() {
        // Alpha Vantage API (free tier: 5 calls/min, 500 calls/day)
        // Users should replace with their own key from: https://www.alphavantage.co/support/#api-key
        this.alphaVantageKey = 'demo'; // Replace with real key

        // Cache for API responses
        this.fundamentalsCache = new Map();
        this.CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours (fundamentals don't change often)
    }

    /**
     * Fetch company fundamentals from Alpha Vantage
     * Returns: P/E, EPS, Revenue, Margins, Growth rates
     */
    async fetchCompanyFundamentals(symbol) {
        // Check cache first
        const cached = this.getCached(symbol);
        if (cached) return cached;

        try {
            // Alpha Vantage Company Overview endpoint
            const response = await fetch(
                `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${this.alphaVantageKey}`
            );

            if (!response.ok) {
                console.warn('Alpha Vantage API failed, using estimates');
                return this.generateEstimatedFundamentals(symbol);
            }

            const data = await response.json();

            // Check for API limit error
            if (data.Note || data['Error Message']) {
                console.warn('Alpha Vantage API limit reached, using estimates');
                return this.generateEstimatedFundamentals(symbol);
            }

            // Parse fundamentals
            const fundamentals = {
                symbol: data.Symbol,
                name: data.Name,
                sector: data.Sector,
                industry: data.Industry,
                marketCap: this.parseNumber(data.MarketCapitalization),

                // Valuation metrics
                peRatio: this.parseNumber(data.PERatio),
                pegRatio: this.parseNumber(data.PEGRatio),
                priceToBook: this.parseNumber(data.PriceToBookRatio),
                priceToSales: this.parseNumber(data.PriceToSalesRatioTTM),
                evToRevenue: this.parseNumber(data.EVToRevenue),
                evToEBITDA: this.parseNumber(data.EVToEBITDA),

                // Profitability
                eps: this.parseNumber(data.EPS),
                profitMargin: this.parseNumber(data.ProfitMargin) * 100,
                operatingMargin: this.parseNumber(data.OperatingMarginTTM) * 100,
                returnOnAssets: this.parseNumber(data.ReturnOnAssetsTTM) * 100,
                returnOnEquity: this.parseNumber(data.ReturnOnEquityTTM) * 100,

                // Growth
                revenueGrowth: this.parseNumber(data.QuarterlyRevenueGrowthYOY) * 100,
                earningsGrowth: this.parseNumber(data.QuarterlyEarningsGrowthYOY) * 100,

                // Dividend
                dividendYield: this.parseNumber(data.DividendYield) * 100,
                dividendPerShare: this.parseNumber(data.DividendPerShare),

                // Financial health
                beta: this.parseNumber(data.Beta),
                _52WeekHigh: this.parseNumber(data['52WeekHigh']),
                _52WeekLow: this.parseNumber(data['52WeekLow']),

                // Additional
                sharesOutstanding: this.parseNumber(data.SharesOutstanding),
                bookValue: this.parseNumber(data.BookValue),

                dataSource: 'alpha_vantage',
                timestamp: Date.now()
            };

            // Cache result
            this.setCache(symbol, fundamentals);
            return fundamentals;

        } catch (error) {
            console.error('Error fetching fundamentals:', error);
            return this.generateEstimatedFundamentals(symbol);
        }
    }

    /**
     * Generate estimated fundamentals when API unavailable
     * Uses typical sector averages and historical patterns
     */
    generateEstimatedFundamentals(symbol) {
        // Sector-based estimates (typical ranges)
        const sectorAverages = {
            'Technology': { peRatio: 28, profitMargin: 20, revenueGrowth: 15, beta: 1.3 },
            'Healthcare': { peRatio: 22, profitMargin: 18, revenueGrowth: 10, beta: 0.9 },
            'Finance': { peRatio: 12, profitMargin: 22, revenueGrowth: 8, beta: 1.1 },
            'Energy': { peRatio: 15, profitMargin: 10, revenueGrowth: 5, beta: 1.2 },
            'Consumer': { peRatio: 20, profitMargin: 8, revenueGrowth: 7, beta: 0.8 },
            'Default': { peRatio: 18, profitMargin: 12, revenueGrowth: 8, beta: 1.0 }
        };

        // Use sector classification from sector-analysis.js if available
        const sector = window.sectorAnalysis?.STOCK_SECTORS[symbol]?.sector || 'Unknown';
        const estimates = sectorAverages[sector] || sectorAverages['Default'];

        return {
            symbol,
            sector,
            peRatio: estimates.peRatio,
            profitMargin: estimates.profitMargin,
            revenueGrowth: estimates.revenueGrowth,
            beta: estimates.beta,
            dataSource: 'estimated',
            note: 'Estimated fundamentals based on sector averages. For real data, add Alpha Vantage API key.',
            timestamp: Date.now()
        };
    }

    /**
     * Analyze fundamentals and generate quality score
     */
    analyzeFundamentals(fundamentals) {
        if (!fundamentals) return null;

        let qualityScore = 50; // Start at neutral
        const signals = [];

        // 1. Valuation Analysis (P/E Ratio)
        if (fundamentals.peRatio) {
            if (fundamentals.peRatio < 15) {
                qualityScore += 15;
                signals.push(`💎 Undervalued - P/E: ${fundamentals.peRatio.toFixed(1)}`);
            } else if (fundamentals.peRatio < 25) {
                qualityScore += 8;
                signals.push(`✓ Fair value - P/E: ${fundamentals.peRatio.toFixed(1)}`);
            } else if (fundamentals.peRatio > 40) {
                qualityScore -= 10;
                signals.push(`⚠️ Overvalued - P/E: ${fundamentals.peRatio.toFixed(1)}`);
            } else {
                qualityScore -= 5;
                signals.push(`📊 Moderate P/E: ${fundamentals.peRatio.toFixed(1)}`);
            }
        }

        // 2. Profitability (Profit Margin)
        if (fundamentals.profitMargin) {
            if (fundamentals.profitMargin > 20) {
                qualityScore += 15;
                signals.push(`🏆 Excellent margins: ${fundamentals.profitMargin.toFixed(1)}%`);
            } else if (fundamentals.profitMargin > 10) {
                qualityScore += 8;
                signals.push(`✓ Healthy margins: ${fundamentals.profitMargin.toFixed(1)}%`);
            } else if (fundamentals.profitMargin < 5) {
                qualityScore -= 10;
                signals.push(`⚠️ Low margins: ${fundamentals.profitMargin.toFixed(1)}%`);
            }
        }

        // 3. Growth (Revenue Growth)
        if (fundamentals.revenueGrowth) {
            if (fundamentals.revenueGrowth > 20) {
                qualityScore += 15;
                signals.push(`🚀 High growth: ${fundamentals.revenueGrowth.toFixed(1)}% YoY`);
            } else if (fundamentals.revenueGrowth > 10) {
                qualityScore += 10;
                signals.push(`📈 Good growth: ${fundamentals.revenueGrowth.toFixed(1)}% YoY`);
            } else if (fundamentals.revenueGrowth < 0) {
                qualityScore -= 15;
                signals.push(`📉 Negative growth: ${fundamentals.revenueGrowth.toFixed(1)}% YoY`);
            }
        }

        // 4. Return on Equity (ROE)
        if (fundamentals.returnOnEquity) {
            if (fundamentals.returnOnEquity > 20) {
                qualityScore += 10;
                signals.push(`💪 Strong ROE: ${fundamentals.returnOnEquity.toFixed(1)}%`);
            } else if (fundamentals.returnOnEquity > 15) {
                qualityScore += 5;
                signals.push(`✓ Good ROE: ${fundamentals.returnOnEquity.toFixed(1)}%`);
            }
        }

        // 5. PEG Ratio (P/E to Growth)
        if (fundamentals.pegRatio) {
            if (fundamentals.pegRatio < 1) {
                qualityScore += 12;
                signals.push(`🎯 Undervalued growth - PEG: ${fundamentals.pegRatio.toFixed(2)}`);
            } else if (fundamentals.pegRatio < 1.5) {
                qualityScore += 6;
                signals.push(`✓ Fair growth value - PEG: ${fundamentals.pegRatio.toFixed(2)}`);
            } else if (fundamentals.pegRatio > 2) {
                qualityScore -= 8;
                signals.push(`⚠️ Expensive growth - PEG: ${fundamentals.pegRatio.toFixed(2)}`);
            }
        }

        // 6. Dividend Yield (for income investors)
        if (fundamentals.dividendYield && fundamentals.dividendYield > 2) {
            qualityScore += 5;
            signals.push(`💰 Dividend yield: ${fundamentals.dividendYield.toFixed(2)}%`);
        }

        // Normalize score
        qualityScore = Math.max(0, Math.min(100, qualityScore));

        // Determine rating
        let rating, color;
        if (qualityScore >= 80) {
            rating = 'EXCELLENT';
            color = 'green';
        } else if (qualityScore >= 70) {
            rating = 'GOOD';
            color = 'lime';
        } else if (qualityScore >= 60) {
            rating = 'FAIR';
            color = 'yellow';
        } else if (qualityScore >= 50) {
            rating = 'AVERAGE';
            color = 'orange';
        } else {
            rating = 'POOR';
            color = 'red';
        }

        return {
            qualityScore: Math.round(qualityScore),
            rating,
            color,
            signals,
            fundamentals,
            interpretation: this.getQualityInterpretation(qualityScore, rating)
        };
    }

    getQualityInterpretation(score, rating) {
        const interpretations = {
            EXCELLENT: `🌟 ${score}/100 - High-quality company with strong fundamentals`,
            GOOD: `✅ ${score}/100 - Solid fundamentals, attractive investment`,
            FAIR: `👍 ${score}/100 - Decent fundamentals, moderate opportunity`,
            AVERAGE: `⚪ ${score}/100 - Average fundamentals, proceed with caution`,
            POOR: `⚠️ ${score}/100 - Weak fundamentals, high-risk investment`
        };
        return interpretations[rating] || 'Unknown quality';
    }

    /**
     * Calculate intrinsic value using DCF (Discounted Cash Flow) - simplified
     * This is a basic estimate - real DCF requires detailed financial modeling
     */
    calculateIntrinsicValue(fundamentals, currentPrice) {
        if (!fundamentals.eps || !fundamentals.earningsGrowth || !currentPrice) {
            return null;
        }

        // Simplified DCF assumptions
        const growthRate = fundamentals.earningsGrowth / 100;
        const discountRate = 0.10; // 10% required return
        const terminalMultiple = 15; // Terminal P/E multiple
        const years = 5; // 5-year projection

        let futureValue = fundamentals.eps;
        let presentValue = 0;

        // Project earnings for 5 years
        for (let i = 1; i <= years; i++) {
            futureValue = futureValue * (1 + growthRate);
            const discountedValue = futureValue / Math.pow(1 + discountRate, i);
            presentValue += discountedValue;
        }

        // Add terminal value
        const terminalValue = (futureValue * terminalMultiple) / Math.pow(1 + discountRate, years);
        const intrinsicValue = presentValue + terminalValue;

        // Margin of safety
        const marginOfSafety = ((intrinsicValue - currentPrice) / currentPrice) * 100;

        return {
            intrinsicValue: intrinsicValue.toFixed(2),
            currentPrice: currentPrice.toFixed(2),
            marginOfSafety: marginOfSafety.toFixed(2),
            recommendation: marginOfSafety > 20 ? 'BUY' : marginOfSafety > 0 ? 'HOLD' : 'OVERVALUED',
            interpretation: this.getDCFInterpretation(marginOfSafety, intrinsicValue)
        };
    }

    getDCFInterpretation(margin, intrinsic) {
        if (margin > 30) {
            return `🔥 Significantly undervalued - Intrinsic value: $${intrinsic} (+${margin.toFixed(0)}% margin of safety)`;
        }
        if (margin > 20) {
            return `💎 Undervalued - Intrinsic value: $${intrinsic} (+${margin.toFixed(0)}% margin of safety)`;
        }
        if (margin > 0) {
            return `✓ Fairly valued - Intrinsic value: $${intrinsic} (+${margin.toFixed(0)}% margin of safety)`;
        }
        if (margin > -20) {
            return `⚠️ Slightly overvalued - Intrinsic value: $${intrinsic} (${margin.toFixed(0)}% below price)`;
        }
        return `🔴 Significantly overvalued - Intrinsic value: $${intrinsic} (${margin.toFixed(0)}% below price)`;
    }

    /**
     * Compare stock to sector peers
     */
    compareToPeers(fundamentals, peerFundamentals) {
        if (!fundamentals || !peerFundamentals || peerFundamentals.length === 0) {
            return null;
        }

        // Calculate peer averages
        const avgPE = peerFundamentals.reduce((sum, p) => sum + (p.peRatio || 0), 0) / peerFundamentals.length;
        const avgMargin = peerFundamentals.reduce((sum, p) => sum + (p.profitMargin || 0), 0) / peerFundamentals.length;
        const avgGrowth = peerFundamentals.reduce((sum, p) => sum + (p.revenueGrowth || 0), 0) / peerFundamentals.length;

        // Compare
        const peComparison = fundamentals.peRatio < avgPE ? 'cheaper' : 'pricier';
        const marginComparison = fundamentals.profitMargin > avgMargin ? 'higher' : 'lower';
        const growthComparison = fundamentals.revenueGrowth > avgGrowth ? 'faster' : 'slower';

        return {
            peerAvgPE: avgPE.toFixed(1),
            peerAvgMargin: avgMargin.toFixed(1),
            peerAvgGrowth: avgGrowth.toFixed(1),
            stockPE: fundamentals.peRatio.toFixed(1),
            stockMargin: fundamentals.profitMargin.toFixed(1),
            stockGrowth: fundamentals.revenueGrowth.toFixed(1),
            comparison: {
                valuation: peComparison,
                profitability: marginComparison,
                growth: growthComparison
            },
            interpretation: `Stock is ${peComparison} than peers (P/E), has ${marginComparison} margins, and ${growthComparison} growth`
        };
    }

    // Helper methods
    parseNumber(value) {
        if (value === null || value === undefined || value === 'None') return null;
        const num = parseFloat(value);
        return isNaN(num) ? null : num;
    }

    getCached(symbol) {
        const entry = this.fundamentalsCache.get(symbol);
        if (entry && (Date.now() - entry.timestamp) < this.CACHE_TTL) {
            return entry.data;
        }
        return null;
    }

    setCache(symbol, data) {
        this.fundamentalsCache.set(symbol, { data, timestamp: Date.now() });
    }

    clearCache() {
        this.fundamentalsCache.clear();
    }
}

// Initialize and export
if (typeof window !== 'undefined') {
    window.fundamentalAnalyzer = new FundamentalAnalyzer();
}
