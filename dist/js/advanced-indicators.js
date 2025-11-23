// Advanced Technical Indicators for FinClash - Institutional-Grade Analysis
// Implements sophisticated trading indicators used by professional traders

/**
 * Calculate Ichimoku Cloud - Complete Japanese Technical Analysis System
 * Returns: Tenkan-sen, Kijun-sen, Senkou Span A, Senkou Span B, Chikou Span
 */
function calculateIchimokuCloud(historicalData) {
    const { highs, lows, closes } = historicalData;

    if (!highs || !lows || !closes || closes.length < 52) {
        return null;
    }

    const n = closes.length;

    // Helper: Calculate midpoint of highest high and lowest low over period
    const midpoint = (arr, start, length) => {
        const slice = arr.slice(start, start + length);
        return (Math.max(...slice) + Math.min(...slice)) / 2;
    };

    // Tenkan-sen (Conversion Line) - 9 period
    const tenkanSen = midpoint([...highs.slice(-9), ...lows.slice(-9)], 0, 9);

    // Kijun-sen (Base Line) - 26 period
    const kijunSen = midpoint([...highs.slice(-26), ...lows.slice(-26)], 0, 26);

    // Senkou Span A (Leading Span A) - Average of Tenkan and Kijun, plotted 26 periods ahead
    const senkouSpanA = (tenkanSen + kijunSen) / 2;

    // Senkou Span B (Leading Span B) - 52 period midpoint, plotted 26 periods ahead
    const senkouSpanB = midpoint([...highs.slice(-52), ...lows.slice(-52)], 0, 52);

    // Chikou Span (Lagging Span) - Current close plotted 26 periods back
    const chikouSpan = closes[n - 1];

    // Determine cloud color and position
    const cloudColor = senkouSpanA > senkouSpanB ? 'bullish' : 'bearish';
    const priceVsCloud = closes[n - 1] > Math.max(senkouSpanA, senkouSpanB) ? 'above' :
                         closes[n - 1] < Math.min(senkouSpanA, senkouSpanB) ? 'below' : 'inside';

    // Signal interpretation
    let signal, strength;
    if (priceVsCloud === 'above' && cloudColor === 'bullish' && closes[n - 1] > kijunSen) {
        signal = 'strong_buy';
        strength = 90;
    } else if (priceVsCloud === 'above' && cloudColor === 'bullish') {
        signal = 'buy';
        strength = 75;
    } else if (priceVsCloud === 'below' && cloudColor === 'bearish' && closes[n - 1] < kijunSen) {
        signal = 'strong_sell';
        strength = 10;
    } else if (priceVsCloud === 'below' && cloudColor === 'bearish') {
        signal = 'sell';
        strength = 25;
    } else {
        signal = 'neutral';
        strength = 50;
    }

    return {
        tenkanSen: tenkanSen.toFixed(2),
        kijunSen: kijunSen.toFixed(2),
        senkouSpanA: senkouSpanA.toFixed(2),
        senkouSpanB: senkouSpanB.toFixed(2),
        chikouSpan: chikouSpan.toFixed(2),
        cloudColor,
        priceVsCloud,
        signal,
        strength,
        interpretation: getIchimokuInterpretation(signal, priceVsCloud, cloudColor)
    };
}

function getIchimokuInterpretation(signal, position, cloud) {
    const interpretations = {
        strong_buy: `🟢 STRONG BUY - Price above bullish cloud, strong uptrend confirmed`,
        buy: `🟢 BUY - Price above cloud, uptrend in progress`,
        strong_sell: `🔴 STRONG SELL - Price below bearish cloud, strong downtrend`,
        sell: `🔴 SELL - Price below cloud, downtrend in progress`,
        neutral: `⚪ NEUTRAL - Price inside cloud, consolidation phase`
    };
    return interpretations[signal] || 'Unknown signal';
}

/**
 * Calculate Fibonacci Retracement Levels
 * Based on recent swing high and swing low
 */
function calculateFibonacciLevels(historicalData) {
    const { highs, lows, closes } = historicalData;

    if (!highs || !lows || !closes || closes.length < 20) {
        return null;
    }

    // Find swing high and swing low in last 50 periods (or available data)
    const lookback = Math.min(50, highs.length);
    const recentHighs = highs.slice(-lookback);
    const recentLows = lows.slice(-lookback);

    const swingHigh = Math.max(...recentHighs);
    const swingLow = Math.min(...recentLows);
    const range = swingHigh - swingLow;

    // Calculate Fibonacci levels
    const levels = {
        '0%': swingLow,
        '23.6%': swingLow + (range * 0.236),
        '38.2%': swingLow + (range * 0.382),
        '50%': swingLow + (range * 0.50),
        '61.8%': swingLow + (range * 0.618),
        '78.6%': swingLow + (range * 0.786),
        '100%': swingHigh,
        // Extension levels
        '127.2%': swingLow + (range * 1.272),
        '161.8%': swingLow + (range * 1.618)
    };

    // Find closest support/resistance level to current price
    const currentPrice = closes[closes.length - 1];
    const sortedLevels = Object.entries(levels).sort((a, b) =>
        Math.abs(a[1] - currentPrice) - Math.abs(b[1] - currentPrice)
    );

    const nearestLevel = sortedLevels[0];
    const isSupport = currentPrice > nearestLevel[1];

    // Determine if price is at a key Fibonacci level (within 1%)
    const tolerance = currentPrice * 0.01;
    const atKeyLevel = Object.entries(levels).some(([label, price]) =>
        Math.abs(currentPrice - price) <= tolerance &&
        ['38.2%', '50%', '61.8%'].includes(label)
    );

    return {
        swingHigh: swingHigh.toFixed(2),
        swingLow: swingLow.toFixed(2),
        currentPrice: currentPrice.toFixed(2),
        levels: Object.fromEntries(
            Object.entries(levels).map(([k, v]) => [k, v.toFixed(2)])
        ),
        nearestLevel: {
            label: nearestLevel[0],
            price: nearestLevel[1].toFixed(2),
            type: isSupport ? 'support' : 'resistance',
            distance: ((Math.abs(currentPrice - nearestLevel[1]) / currentPrice) * 100).toFixed(2)
        },
        atKeyLevel,
        signal: atKeyLevel ? (isSupport ? 'potential_bounce' : 'potential_rejection') : 'none',
        interpretation: getFibonacciInterpretation(atKeyLevel, isSupport, nearestLevel[0])
    };
}

function getFibonacciInterpretation(atKeyLevel, isSupport, level) {
    if (!atKeyLevel) {
        return '📊 Price between Fibonacci levels - wait for key level test';
    }
    if (isSupport) {
        return `🎯 Price at ${level} support - potential bounce zone`;
    }
    return `⚠️ Price at ${level} resistance - potential rejection zone`;
}

/**
 * Calculate Volume Profile - Price levels with highest trading volume
 * Identifies key support/resistance zones based on volume
 */
function calculateVolumeProfile(historicalData, bins = 20) {
    const { closes, volumes } = historicalData;

    if (!closes || !volumes || closes.length < 20) {
        return null;
    }

    // Find price range
    const priceHigh = Math.max(...closes);
    const priceLow = Math.min(...closes);
    const binSize = (priceHigh - priceLow) / bins;

    // Create volume bins
    const volumeBins = new Array(bins).fill(0);
    const priceLevels = [];

    // Assign volumes to price bins
    for (let i = 0; i < Math.min(closes.length, volumes.length); i++) {
        const price = closes[i];
        const volume = volumes[i];
        const binIndex = Math.min(bins - 1, Math.floor((price - priceLow) / binSize));
        volumeBins[binIndex] += volume;
    }

    // Calculate price levels for each bin
    for (let i = 0; i < bins; i++) {
        priceLevels.push({
            priceStart: (priceLow + (i * binSize)).toFixed(2),
            priceEnd: (priceLow + ((i + 1) * binSize)).toFixed(2),
            volume: volumeBins[i],
            volumePct: 0 // Will calculate below
        });
    }

    // Calculate volume percentages
    const totalVolume = volumeBins.reduce((sum, v) => sum + v, 0);
    priceLevels.forEach(level => {
        level.volumePct = ((level.volume / totalVolume) * 100).toFixed(2);
    });

    // Find Point of Control (POC) - price level with most volume
    const maxVolumeIndex = volumeBins.indexOf(Math.max(...volumeBins));
    const poc = {
        price: ((priceLow + (maxVolumeIndex * binSize) + (priceLow + ((maxVolumeIndex + 1) * binSize))) / 2).toFixed(2),
        volume: volumeBins[maxVolumeIndex],
        volumePct: ((volumeBins[maxVolumeIndex] / totalVolume) * 100).toFixed(2)
    };

    // Find Value Area (70% of volume) - most accepted price range
    const sortedIndices = volumeBins
        .map((vol, idx) => ({ vol, idx }))
        .sort((a, b) => b.vol - a.vol);

    let accumulatedVolume = 0;
    const valueAreaIndices = [];
    const targetVolume = totalVolume * 0.70;

    for (const { vol, idx } of sortedIndices) {
        accumulatedVolume += vol;
        valueAreaIndices.push(idx);
        if (accumulatedVolume >= targetVolume) break;
    }

    const valueAreaLow = priceLow + (Math.min(...valueAreaIndices) * binSize);
    const valueAreaHigh = priceLow + ((Math.max(...valueAreaIndices) + 1) * binSize);

    const currentPrice = closes[closes.length - 1];
    const relativeToVA = currentPrice < valueAreaLow ? 'below' :
                         currentPrice > valueAreaHigh ? 'above' : 'inside';

    return {
        poc,
        valueArea: {
            low: valueAreaLow.toFixed(2),
            high: valueAreaHigh.toFixed(2),
            volumePct: 70
        },
        currentPrice: currentPrice.toFixed(2),
        relativeToVA,
        profile: priceLevels,
        signal: getVolumeProfileSignal(relativeToVA, currentPrice, poc.price),
        interpretation: getVolumeProfileInterpretation(relativeToVA, poc.price)
    };
}

function getVolumeProfileSignal(position, currentPrice, pocPrice) {
    if (position === 'below') return 'undervalued';
    if (position === 'above') return 'overvalued';

    // Inside value area - check if near POC
    if (Math.abs(currentPrice - parseFloat(pocPrice)) / currentPrice < 0.02) {
        return 'at_poc'; // Fair value
    }
    return 'in_range';
}

function getVolumeProfileInterpretation(position, pocPrice) {
    if (position === 'below') {
        return `🟢 Price below value area - potential buying opportunity (POC: $${pocPrice})`;
    }
    if (position === 'above') {
        return `🔴 Price above value area - potential selling opportunity (POC: $${pocPrice})`;
    }
    return `⚪ Price within value area - fair value range (POC: $${pocPrice})`;
}

/**
 * Calculate Average Directional Index (ADX) - Trend Strength Indicator
 * Values > 25 indicate strong trend, < 20 indicate weak/no trend
 */
function calculateADX(historicalData, period = 14) {
    const { highs, lows, closes } = historicalData;

    if (!highs || !lows || !closes || closes.length < period + 1) {
        return null;
    }

    // Calculate True Range (TR), +DM, -DM
    const trArray = [];
    const plusDM = [];
    const minusDM = [];

    for (let i = 1; i < Math.min(highs.length, lows.length, closes.length); i++) {
        const high = highs[i];
        const low = lows[i];
        const prevHigh = highs[i - 1];
        const prevLow = lows[i - 1];
        const prevClose = closes[i - 1];

        // True Range
        const tr = Math.max(
            high - low,
            Math.abs(high - prevClose),
            Math.abs(low - prevClose)
        );
        trArray.push(tr);

        // Directional Movement
        const upMove = high - prevHigh;
        const downMove = prevLow - low;

        plusDM.push(upMove > downMove && upMove > 0 ? upMove : 0);
        minusDM.push(downMove > upMove && downMove > 0 ? downMove : 0);
    }

    // Smooth with Wilder's moving average
    const smooth = (arr) => {
        let sum = arr.slice(0, period).reduce((a, b) => a + b, 0);
        const smoothed = [sum];
        for (let i = period; i < arr.length; i++) {
            sum = sum - (sum / period) + arr[i];
            smoothed.push(sum);
        }
        return smoothed;
    };

    const smoothTR = smooth(trArray);
    const smoothPlusDM = smooth(plusDM);
    const smoothMinusDM = smooth(minusDM);

    // Calculate +DI and -DI
    const plusDI = smoothPlusDM.map((dm, i) => (dm / smoothTR[i]) * 100);
    const minusDI = smoothMinusDM.map((dm, i) => (dm / smoothTR[i]) * 100);

    // Calculate DX and ADX
    const dx = plusDI.map((pdi, i) =>
        Math.abs(pdi - minusDI[i]) / (pdi + minusDI[i]) * 100
    );

    // ADX is smoothed DX
    let adx = dx.slice(0, period).reduce((a, b) => a + b, 0) / period;
    for (let i = period; i < dx.length; i++) {
        adx = ((adx * (period - 1)) + dx[i]) / period;
    }

    // Determine trend strength
    let trendStrength, signal;
    if (adx > 50) {
        trendStrength = 'very_strong';
        signal = 80;
    } else if (adx > 25) {
        trendStrength = 'strong';
        signal = 65;
    } else if (adx > 20) {
        trendStrength = 'developing';
        signal = 55;
    } else {
        trendStrength = 'weak';
        signal = 40;
    }

    // Determine trend direction
    const latestPlusDI = plusDI[plusDI.length - 1];
    const latestMinusDI = minusDI[minusDI.length - 1];
    const trendDirection = latestPlusDI > latestMinusDI ? 'bullish' : 'bearish';

    return {
        adx: adx.toFixed(2),
        plusDI: latestPlusDI.toFixed(2),
        minusDI: latestMinusDI.toFixed(2),
        trendStrength,
        trendDirection,
        signal,
        interpretation: getADXInterpretation(adx, trendStrength, trendDirection)
    };
}

function getADXInterpretation(adx, strength, direction) {
    if (strength === 'very_strong') {
        return `🔥 Very strong ${direction} trend (ADX: ${adx.toFixed(0)}) - Ride the trend`;
    }
    if (strength === 'strong') {
        return `📈 Strong ${direction} trend (ADX: ${adx.toFixed(0)}) - Good trending conditions`;
    }
    if (strength === 'developing') {
        return `📊 Developing trend (ADX: ${adx.toFixed(0)}) - Watch for confirmation`;
    }
    return `⚪ Weak trend (ADX: ${adx.toFixed(0)}) - Range-bound, avoid trend strategies`;
}

/**
 * Calculate Parabolic SAR - Stop and Reverse indicator
 * Provides trailing stop levels and trend direction
 */
function calculateParabolicSAR(historicalData, accelerationFactor = 0.02, maxAF = 0.2) {
    const { highs, lows, closes } = historicalData;

    if (!highs || !lows || !closes || closes.length < 5) {
        return null;
    }

    const sar = [];
    const trends = [];

    let af = accelerationFactor;
    let ep = 0; // Extreme point
    let currentSAR = lows[0];
    let isUptrend = closes[1] > closes[0];

    for (let i = 1; i < Math.min(highs.length, lows.length); i++) {
        // Calculate SAR
        if (isUptrend) {
            currentSAR = currentSAR + af * (ep - currentSAR);
            // SAR cannot be above prior two lows in uptrend
            if (i >= 2) {
                currentSAR = Math.min(currentSAR, lows[i - 1], lows[i - 2]);
            }
        } else {
            currentSAR = currentSAR + af * (ep - currentSAR);
            // SAR cannot be below prior two highs in downtrend
            if (i >= 2) {
                currentSAR = Math.max(currentSAR, highs[i - 1], highs[i - 2]);
            }
        }

        // Check for trend reversal
        if (isUptrend && lows[i] < currentSAR) {
            isUptrend = false;
            currentSAR = ep;
            ep = lows[i];
            af = accelerationFactor;
        } else if (!isUptrend && highs[i] > currentSAR) {
            isUptrend = true;
            currentSAR = ep;
            ep = highs[i];
            af = accelerationFactor;
        } else {
            // Update extreme point and acceleration factor
            if (isUptrend && highs[i] > ep) {
                ep = highs[i];
                af = Math.min(af + accelerationFactor, maxAF);
            } else if (!isUptrend && lows[i] < ep) {
                ep = lows[i];
                af = Math.min(af + accelerationFactor, maxAF);
            }
        }

        sar.push(currentSAR);
        trends.push(isUptrend);
    }

    const currentPrice = closes[closes.length - 1];
    const currentTrend = trends[trends.length - 1];
    const latestSAR = sar[sar.length - 1];

    // Calculate distance to SAR (stop loss level)
    const distanceToSAR = ((Math.abs(currentPrice - latestSAR) / currentPrice) * 100).toFixed(2);

    return {
        sar: latestSAR.toFixed(2),
        trend: currentTrend ? 'bullish' : 'bearish',
        currentPrice: currentPrice.toFixed(2),
        distanceToSAR: `${distanceToSAR}%`,
        stopLoss: latestSAR.toFixed(2),
        signal: currentTrend ? 75 : 25,
        interpretation: getParabolicSARInterpretation(currentTrend, latestSAR, distanceToSAR)
    };
}

function getParabolicSARInterpretation(isUptrend, sar, distance) {
    if (isUptrend) {
        return `🟢 Bullish - SAR stop at $${sar.toFixed(2)} (${distance}% below price)`;
    }
    return `🔴 Bearish - SAR resistance at $${sar.toFixed(2)} (${distance}% above price)`;
}

/**
 * Detect Chart Patterns - Head & Shoulders, Double Top/Bottom, Triangles
 */
function detectChartPatterns(historicalData) {
    const { highs, lows, closes } = historicalData;

    if (!highs || !lows || !closes || closes.length < 20) {
        return { patterns: [], signal: null };
    }

    const patterns = [];

    // Simple pattern detection (can be expanded with more sophisticated algorithms)
    const recentData = closes.slice(-20);

    // Double Bottom Detection
    const lowestPoints = [];
    for (let i = 1; i < recentData.length - 1; i++) {
        if (recentData[i] < recentData[i - 1] && recentData[i] < recentData[i + 1]) {
            lowestPoints.push({ index: i, price: recentData[i] });
        }
    }

    if (lowestPoints.length >= 2) {
        const [first, second] = lowestPoints.slice(-2);
        const priceDiff = Math.abs(first.price - second.price) / first.price;
        if (priceDiff < 0.03) { // Within 3%
            patterns.push({
                type: 'double_bottom',
                confidence: 70,
                signal: 'bullish',
                description: '📊 Double Bottom pattern detected - bullish reversal signal'
            });
        }
    }

    // Ascending Triangle (higher lows, flat resistance)
    const slope = (recentData[recentData.length - 1] - recentData[0]) / recentData.length;
    const volatility = Math.max(...recentData) - Math.min(...recentData);
    if (slope > 0 && volatility / recentData[0] < 0.10) {
        patterns.push({
            type: 'ascending_triangle',
            confidence: 65,
            signal: 'bullish',
            description: '📈 Ascending Triangle - breakout likely soon'
        });
    }

    return {
        patterns,
        signal: patterns.length > 0 ? patterns[0].signal : null,
        count: patterns.length
    };
}

/**
 * Calculate Composite Advanced Score
 * Combines all advanced indicators for ultra-accurate signal
 */
function calculateAdvancedCompositeScore(historicalData) {
    const ichimoku = calculateIchimokuCloud(historicalData);
    const fibonacci = calculateFibonacciLevels(historicalData);
    const volumeProfile = calculateVolumeProfile(historicalData);
    const adx = calculateADX(historicalData);
    const sar = calculateParabolicSAR(historicalData);
    const patterns = detectChartPatterns(historicalData);

    const scores = {
        ichimoku: ichimoku?.strength || 50,
        fibonacci: fibonacci?.atKeyLevel ? (fibonacci.signal === 'potential_bounce' ? 65 : 35) : 50,
        volumeProfile: volumeProfile?.signal === 'undervalued' ? 70 : volumeProfile?.signal === 'overvalued' ? 30 : 50,
        adx: adx?.signal || 50,
        sar: sar?.signal || 50,
        patterns: patterns?.signal === 'bullish' ? 70 : patterns?.signal === 'bearish' ? 30 : 50
    };

    // Weighted composite (prioritize Ichimoku and ADX)
    const composite = (
        scores.ichimoku * 0.30 +
        scores.adx * 0.20 +
        scores.volumeProfile * 0.20 +
        scores.sar * 0.15 +
        scores.fibonacci * 0.10 +
        scores.patterns * 0.05
    );

    return {
        composite: Math.round(composite),
        breakdown: scores,
        indicators: {
            ichimoku,
            fibonacci,
            volumeProfile,
            adx,
            sar,
            patterns
        }
    };
}

// Export all functions
if (typeof window !== 'undefined') {
    window.advancedIndicators = {
        calculateIchimokuCloud,
        calculateFibonacciLevels,
        calculateVolumeProfile,
        calculateADX,
        calculateParabolicSAR,
        detectChartPatterns,
        calculateAdvancedCompositeScore
    };
}
