// Sector & Market Correlation Analysis for FinClash
// Analyzes stock performance relative to its sector and market

/**
 * Stock sector classifications
 */
const STOCK_SECTORS = {
    // Technology
    'AAPL': { sector: 'Technology', subsector: 'Consumer Electronics' },
    'GOOGL': { sector: 'Technology', subsector: 'Internet Services' },
    'GOOG': { sector: 'Technology', subsector: 'Internet Services' },
    'MSFT': { sector: 'Technology', subsector: 'Software' },
    'NVDA': { sector: 'Technology', subsector: 'Semiconductors' },
    'AMD': { sector: 'Technology', subsector: 'Semiconductors' },
    'INTC': { sector: 'Technology', subsector: 'Semiconductors' },
    'QCOM': { sector: 'Technology', subsector: 'Semiconductors' },
    'AVGO': { sector: 'Technology', subsector: 'Semiconductors' },
    'MU': { sector: 'Technology', subsector: 'Semiconductors' },
    'ARM': { sector: 'Technology', subsector: 'Semiconductors' },
    'ADBE': { sector: 'Technology', subsector: 'Software' },
    'CRM': { sector: 'Technology', subsector: 'Software' },
    'ORCL': { sector: 'Technology', subsector: 'Software' },
    'NOW': { sector: 'Technology', subsector: 'Software' },
    'SNOW': { sector: 'Technology', subsector: 'Software' },
    'PLTR': { sector: 'Technology', subsector: 'Software' },
    'DDOG': { sector: 'Technology', subsector: 'Software' },
    'NET': { sector: 'Technology', subsector: 'Software' },
    'CRWD': { sector: 'Technology', subsector: 'Cybersecurity' },
    'PANW': { sector: 'Technology', subsector: 'Cybersecurity' },
    'ZS': { sector: 'Technology', subsector: 'Cybersecurity' },
    'OKTA': { sector: 'Technology', subsector: 'Cybersecurity' },

    // Communication Services
    'META': { sector: 'Communication Services', subsector: 'Social Media' },
    'NFLX': { sector: 'Communication Services', subsector: 'Streaming' },
    'DIS': { sector: 'Communication Services', subsector: 'Entertainment' },
    'SNAP': { sector: 'Communication Services', subsector: 'Social Media' },
    'PINS': { sector: 'Communication Services', subsector: 'Social Media' },
    'RDDT': { sector: 'Communication Services', subsector: 'Social Media' },
    'SPOT': { sector: 'Communication Services', subsector: 'Streaming' },
    'ROKU': { sector: 'Communication Services', subsector: 'Streaming' },

    // Consumer Cyclical
    'AMZN': { sector: 'Consumer Cyclical', subsector: 'E-commerce' },
    'TSLA': { sector: 'Consumer Cyclical', subsector: 'Automotive' },
    'SHOP': { sector: 'Consumer Cyclical', subsector: 'E-commerce' },
    'EBAY': { sector: 'Consumer Cyclical', subsector: 'E-commerce' },
    'ETSY': { sector: 'Consumer Cyclical', subsector: 'E-commerce' },
    'UBER': { sector: 'Consumer Cyclical', subsector: 'Transportation' },
    'LYFT': { sector: 'Consumer Cyclical', subsector: 'Transportation' },
    'ABNB': { sector: 'Consumer Cyclical', subsector: 'Hospitality' },
    'NKE': { sector: 'Consumer Cyclical', subsector: 'Apparel' },

    // Consumer Defensive
    'WMT': { sector: 'Consumer Defensive', subsector: 'Retail' },
    'COST': { sector: 'Consumer Defensive', subsector: 'Retail' },
    'TGT': { sector: 'Consumer Defensive', subsector: 'Retail' },
    'KO': { sector: 'Consumer Defensive', subsector: 'Beverages' },
    'PEP': { sector: 'Consumer Defensive', subsector: 'Beverages' },
    'PG': { sector: 'Consumer Defensive', subsector: 'Consumer Goods' },
    'MCD': { sector: 'Consumer Defensive', subsector: 'Restaurants' },
    'SBUX': { sector: 'Consumer Defensive', subsector: 'Restaurants' },
    'CMG': { sector: 'Consumer Defensive', subsector: 'Restaurants' },

    // Financial Services
    'JPM': { sector: 'Financial Services', subsector: 'Banks' },
    'BAC': { sector: 'Financial Services', subsector: 'Banks' },
    'WFC': { sector: 'Financial Services', subsector: 'Banks' },
    'C': { sector: 'Financial Services', subsector: 'Banks' },
    'GS': { sector: 'Financial Services', subsector: 'Investment Banking' },
    'MS': { sector: 'Financial Services', subsector: 'Investment Banking' },
    'V': { sector: 'Financial Services', subsector: 'Payment Processing' },
    'MA': { sector: 'Financial Services', subsector: 'Payment Processing' },
    'PYPL': { sector: 'Financial Services', subsector: 'Fintech' },
    'SQ': { sector: 'Financial Services', subsector: 'Fintech' },
    'COIN': { sector: 'Financial Services', subsector: 'Crypto' },
    'SOFI': { sector: 'Financial Services', subsector: 'Fintech' },

    // Healthcare
    'JNJ': { sector: 'Healthcare', subsector: 'Pharmaceuticals' },
    'UNH': { sector: 'Healthcare', subsector: 'Insurance' },
    'PFE': { sector: 'Healthcare', subsector: 'Pharmaceuticals' },
    'ABBV': { sector: 'Healthcare', subsector: 'Pharmaceuticals' },
    'MRK': { sector: 'Healthcare', subsector: 'Pharmaceuticals' },
    'LLY': { sector: 'Healthcare', subsector: 'Pharmaceuticals' },
    'MRNA': { sector: 'Healthcare', subsector: 'Biotechnology' },
    'BNTX': { sector: 'Healthcare', subsector: 'Biotechnology' },

    // Energy
    'XOM': { sector: 'Energy', subsector: 'Oil & Gas' },
    'CVX': { sector: 'Energy', subsector: 'Oil & Gas' },
    'COP': { sector: 'Energy', subsector: 'Oil & Gas' },

    // Industrials
    'BA': { sector: 'Industrials', subsector: 'Aerospace' },
    'CAT': { sector: 'Industrials', subsector: 'Machinery' },
    'DE': { sector: 'Industrials', subsector: 'Machinery' },
    'UPS': { sector: 'Industrials', subsector: 'Logistics' },
};

/**
 * Calculate correlation coefficient between two arrays
 */
function calculateCorrelation(x, y) {
    if (!x || !y || x.length !== y.length || x.length < 2) {
        return 0;
    }

    const n = x.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;

    for (let i = 0; i < n; i++) {
        sumX += x[i];
        sumY += y[i];
        sumXY += x[i] * y[i];
        sumX2 += x[i] * x[i];
        sumY2 += y[i] * y[i];
    }

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    if (denominator === 0) return 0;
    return numerator / denominator;
}

/**
 * Analyze stock relative to its sector
 */
async function analyzeSectorPerformance(symbol, stockData, stocks) {
    const stockInfo = STOCK_SECTORS[symbol];

    if (!stockInfo) {
        return {
            sector: 'Unknown',
            subsector: 'Unknown',
            relativeStrength: 0,
            sectorLeader: false,
            note: 'Sector data not available for this stock'
        };
    }

    // Find stocks in same sector
    const sectorStocks = stocks.filter(s => {
        const info = STOCK_SECTORS[s.symbol];
        return info && info.sector === stockInfo.sector && s.symbol !== symbol;
    });

    if (sectorStocks.length === 0) {
        return {
            sector: stockInfo.sector,
            subsector: stockInfo.subsector,
            relativeStrength: 0,
            sectorLeader: false,
            note: 'Not enough sector peers for comparison'
        };
    }

    // Calculate sector average performance
    const sectorAvgChange = sectorStocks.reduce((sum, s) => sum + s.change, 0) / sectorStocks.length;
    const relativeStrength = stockData.change - sectorAvgChange;

    // Determine if sector leader
    const sectorChanges = sectorStocks.map(s => s.change);
    const stockRank = sectorChanges.filter(change => change > stockData.change).length + 1;
    const sectorLeader = stockRank <= 3;

    // Sector momentum
    const positivePeers = sectorStocks.filter(s => s.change > 0).length;
    const sectorMomentum = (positivePeers / sectorStocks.length) * 100;

    return {
        sector: stockInfo.sector,
        subsector: stockInfo.subsector,
        sectorAvgChange: sectorAvgChange.toFixed(2),
        relativeStrength: relativeStrength.toFixed(2),
        sectorLeader,
        stockRank,
        totalInSector: sectorStocks.length + 1,
        sectorMomentum: sectorMomentum.toFixed(1),
        sectorStatus: sectorMomentum > 60 ? 'strong' : sectorMomentum > 40 ? 'neutral' : 'weak',
        topPeers: sectorStocks
            .sort((a, b) => b.change - a.change)
            .slice(0, 5)
            .map(s => ({ symbol: s.symbol, change: s.change }))
    };
}

/**
 * Calculate market correlation
 * Compares stock movement with overall market
 */
function calculateMarketCorrelation(stockHistorical, marketHistorical) {
    if (!stockHistorical || !marketHistorical ||
        !stockHistorical.closes || !marketHistorical.closes ||
        stockHistorical.closes.length < 20) {
        return { correlation: 0, beta: 1, interpretation: 'unknown' };
    }

    // Calculate daily returns
    const stockReturns = [];
    const marketReturns = [];

    const minLength = Math.min(stockHistorical.closes.length, marketHistorical.closes.length);

    for (let i = 1; i < minLength; i++) {
        stockReturns.push((stockHistorical.closes[i] - stockHistorical.closes[i-1]) / stockHistorical.closes[i-1]);
        marketReturns.push((marketHistorical.closes[i] - marketHistorical.closes[i-1]) / marketHistorical.closes[i-1]);
    }

    const correlation = calculateCorrelation(stockReturns, marketReturns);

    // Calculate beta
    const marketVariance = marketReturns.reduce((sum, r, i, arr) => {
        const mean = arr.reduce((s, v) => s + v, 0) / arr.length;
        return sum + Math.pow(r - mean, 2);
    }, 0) / marketReturns.length;

    const covariance = stockReturns.reduce((sum, r, i) => {
        const stockMean = stockReturns.reduce((s, v) => s + v, 0) / stockReturns.length;
        const marketMean = marketReturns.reduce((s, v) => s + v, 0) / marketReturns.length;
        return sum + (r - stockMean) * (marketReturns[i] - marketMean);
    }, 0) / stockReturns.length;

    const beta = marketVariance !== 0 ? covariance / marketVariance : 1;

    let interpretation;
    if (beta > 1.5) interpretation = 'Very High Risk - Amplified market moves';
    else if (beta > 1.2) interpretation = 'High Risk - Moves more than market';
    else if (beta > 0.8) interpretation = 'Moderate Risk - Tracks market';
    else if (beta > 0.5) interpretation = 'Low Risk - Less volatile than market';
    else interpretation = 'Very Low Risk - Independent of market';

    return {
        correlation: correlation.toFixed(3),
        beta: beta.toFixed(2),
        interpretation,
        volatility: beta > 1 ? 'higher' : 'lower'
    };
}

/**
 * Identify sector rotation trends
 */
function detectSectorRotation(stocks) {
    const sectorPerformance = {};

    // Aggregate by sector
    stocks.forEach(stock => {
        const info = STOCK_SECTORS[stock.symbol];
        if (!info) return;

        if (!sectorPerformance[info.sector]) {
            sectorPerformance[info.sector] = {
                totalChange: 0,
                count: 0,
                stocks: []
            };
        }

        sectorPerformance[info.sector].totalChange += stock.change;
        sectorPerformance[info.sector].count++;
        sectorPerformance[info.sector].stocks.push({
            symbol: stock.symbol,
            change: stock.change
        });
    });

    // Calculate averages and rank sectors
    const sectorStats = Object.entries(sectorPerformance).map(([sector, data]) => ({
        sector,
        avgChange: data.totalChange / data.count,
        stockCount: data.count,
        topStocks: data.stocks.sort((a, b) => b.change - a.change).slice(0, 3)
    })).sort((a, b) => b.avgChange - a.avgChange);

    return {
        leadingSectors: sectorStats.slice(0, 3),
        laggingSectors: sectorStats.slice(-3).reverse(),
        allSectors: sectorStats
    };
}

/**
 * Calculate relative strength index vs market
 * Different from RSI technical indicator - this is relative performance
 */
function calculateRelativeStrengthRatio(stockChange, marketAvgChange) {
    if (marketAvgChange === 0) return 100;
    return ((stockChange / marketAvgChange) * 100);
}

/**
 * Comprehensive sector and market analysis
 */
async function performComprehensiveAnalysis(symbol, stockData, allStocks) {
    const sectorAnalysis = await analyzeSectorPerformance(symbol, stockData, allStocks);

    // Calculate market average
    const marketAvgChange = allStocks.reduce((sum, s) => sum + s.change, 0) / allStocks.length;
    const relativeToMarket = stockData.change - marketAvgChange;

    // Sector rotation
    const rotation = detectSectorRotation(allStocks);

    // Determine overall market sentiment
    const posStocks = allStocks.filter(s => s.change > 0).length;
    const marketSentiment = (posStocks / allStocks.length) * 100;

    let marketMood;
    if (marketSentiment > 70) marketMood = '🟢 Very Bullish';
    else if (marketSentiment > 55) marketMood = '🟢 Bullish';
    else if (marketSentiment > 45) marketMood = '⚪ Neutral';
    else if (marketSentiment > 30) marketMood = '🔴 Bearish';
    else marketMood = '🔴 Very Bearish';

    return {
        sector: sectorAnalysis,
        market: {
            avgChange: marketAvgChange.toFixed(2),
            relativePerformance: relativeToMarket.toFixed(2),
            sentiment: marketSentiment.toFixed(1),
            mood: marketMood,
            positivePct: ((posStocks / allStocks.length) * 100).toFixed(1)
        },
        rotation,
        analysis: {
            isOutperforming: relativeToMarket > 0,
            isSectorLeader: sectorAnalysis.sectorLeader,
            sectorStrength: sectorAnalysis.sectorStatus,
            marketAlignment: stockData.change * marketAvgChange > 0 ? 'aligned' : 'diverging'
        }
    };
}

// Export functions
if (typeof window !== 'undefined') {
    window.sectorAnalysis = {
        analyzeSectorPerformance,
        calculateMarketCorrelation,
        detectSectorRotation,
        performComprehensiveAnalysis,
        calculateCorrelation,
        STOCK_SECTORS
    };
}
