// Technical Indicators for FinClash Trading Charts
// Includes: RSI, MACD, Bollinger Bands, EMA, SMA, ATR, Stochastic

/**
 * Technical Indicators Calculator
 */
class TechnicalIndicators {
    /**
     * Calculate Simple Moving Average (SMA)
     */
    static SMA(data, period) {
        const result = [];

        for (let i = period - 1; i < data.length; i++) {
            let sum = 0;
            for (let j = 0; j < period; j++) {
                sum += data[i - j].close;
            }
            result.push({
                time: data[i].time,
                value: sum / period
            });
        }

        return result;
    }

    /**
     * Calculate Exponential Moving Average (EMA)
     */
    static EMA(data, period) {
        const result = [];
        const multiplier = 2 / (period + 1);

        // Start with SMA for first value
        let sum = 0;
        for (let i = 0; i < period; i++) {
            sum += data[i].close;
        }
        let ema = sum / period;

        result.push({
            time: data[period - 1].time,
            value: ema
        });

        // Calculate EMA for remaining values
        for (let i = period; i < data.length; i++) {
            ema = (data[i].close - ema) * multiplier + ema;
            result.push({
                time: data[i].time,
                value: ema
            });
        }

        return result;
    }

    /**
     * Calculate Relative Strength Index (RSI)
     */
    static RSI(data, period = 14) {
        const result = [];
        const gains = [];
        const losses = [];

        // Calculate price changes
        for (let i = 1; i < data.length; i++) {
            const change = data[i].close - data[i - 1].close;
            gains.push(change > 0 ? change : 0);
            losses.push(change < 0 ? Math.abs(change) : 0);
        }

        // Calculate initial average gain and loss
        let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
        let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

        // Calculate RSI for first period
        let rs = avgGain / avgLoss;
        let rsi = 100 - (100 / (1 + rs));

        result.push({
            time: data[period].time,
            value: rsi
        });

        // Calculate RSI for remaining periods (smoothed)
        for (let i = period; i < gains.length; i++) {
            avgGain = ((avgGain * (period - 1)) + gains[i]) / period;
            avgLoss = ((avgLoss * (period - 1)) + losses[i]) / period;
            rs = avgGain / avgLoss;
            rsi = 100 - (100 / (1 + rs));

            result.push({
                time: data[i + 1].time,
                value: rsi
            });
        }

        return result;
    }

    /**
     * Calculate MACD (Moving Average Convergence Divergence)
     */
    static MACD(data, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
        const fastEMA = this.EMA(data, fastPeriod);
        const slowEMA = this.EMA(data, slowPeriod);

        // Calculate MACD line
        const macdLine = [];
        const startIndex = slowPeriod - fastPeriod;

        for (let i = 0; i < slowEMA.length; i++) {
            macdLine.push({
                time: slowEMA[i].time,
                value: fastEMA[i + startIndex].value - slowEMA[i].value
            });
        }

        // Calculate signal line (EMA of MACD)
        const signalLine = this.EMA(macdLine.map(m => ({ close: m.value, time: m.time })), signalPeriod);

        // Calculate histogram
        const histogram = [];
        for (let i = 0; i < signalLine.length; i++) {
            histogram.push({
                time: signalLine[i].time,
                value: macdLine[i + (macdLine.length - signalLine.length)].value - signalLine[i].value,
                color: macdLine[i + (macdLine.length - signalLine.length)].value - signalLine[i].value >= 0 ? '#26a69a' : '#ef5350'
            });
        }

        return {
            macd: macdLine,
            signal: signalLine,
            histogram: histogram
        };
    }

    /**
     * Calculate Bollinger Bands
     */
    static BollingerBands(data, period = 20, stdDev = 2) {
        const sma = this.SMA(data, period);
        const upper = [];
        const middle = [];
        const lower = [];

        for (let i = 0; i < sma.length; i++) {
            const dataIndex = i + period - 1;

            // Calculate standard deviation
            let sumSquares = 0;
            for (let j = 0; j < period; j++) {
                const diff = data[dataIndex - j].close - sma[i].value;
                sumSquares += diff * diff;
            }
            const standardDeviation = Math.sqrt(sumSquares / period);

            middle.push(sma[i]);
            upper.push({
                time: sma[i].time,
                value: sma[i].value + (stdDev * standardDeviation)
            });
            lower.push({
                time: sma[i].time,
                value: sma[i].value - (stdDev * standardDeviation)
            });
        }

        return { upper, middle, lower };
    }

    /**
     * Calculate Average True Range (ATR) - Volatility indicator
     */
    static ATR(data, period = 14) {
        const trueRanges = [];

        for (let i = 1; i < data.length; i++) {
            const high = data[i].high;
            const low = data[i].low;
            const prevClose = data[i - 1].close;

            const tr = Math.max(
                high - low,
                Math.abs(high - prevClose),
                Math.abs(low - prevClose)
            );

            trueRanges.push({ time: data[i].time, value: tr });
        }

        // Calculate ATR as EMA of true ranges
        return this.EMA(trueRanges.map(tr => ({ close: tr.value, time: tr.time })), period);
    }

    /**
     * Calculate Stochastic Oscillator
     */
    static Stochastic(data, kPeriod = 14, dPeriod = 3) {
        const kLine = [];
        const dLine = [];

        for (let i = kPeriod - 1; i < data.length; i++) {
            // Find highest high and lowest low in period
            let highestHigh = -Infinity;
            let lowestLow = Infinity;

            for (let j = 0; j < kPeriod; j++) {
                highestHigh = Math.max(highestHigh, data[i - j].high);
                lowestLow = Math.min(lowestLow, data[i - j].low);
            }

            // Calculate %K
            const k = ((data[i].close - lowestLow) / (highestHigh - lowestLow)) * 100;

            kLine.push({
                time: data[i].time,
                value: k
            });
        }

        // Calculate %D (SMA of %K)
        for (let i = dPeriod - 1; i < kLine.length; i++) {
            let sum = 0;
            for (let j = 0; j < dPeriod; j++) {
                sum += kLine[i - j].value;
            }

            dLine.push({
                time: kLine[i].time,
                value: sum / dPeriod
            });
        }

        return { k: kLine, d: dLine };
    }

    /**
     * Calculate On-Balance Volume (OBV)
     */
    static OBV(data) {
        const result = [];
        let obv = 0;

        result.push({ time: data[0].time, value: 0 });

        for (let i = 1; i < data.length; i++) {
            if (data[i].close > data[i - 1].close) {
                obv += data[i].volume;
            } else if (data[i].close < data[i - 1].close) {
                obv -= data[i].volume;
            }

            result.push({
                time: data[i].time,
                value: obv
            });
        }

        return result;
    }

    /**
     * Detect support and resistance levels
     */
    static findSupportResistance(data, sensitivity = 0.02) {
        const levels = [];
        const prices = data.map(d => d.close);

        for (let i = 2; i < prices.length - 2; i++) {
            const price = prices[i];

            // Check if it's a local maximum (resistance)
            if (price > prices[i - 1] && price > prices[i - 2] &&
                price > prices[i + 1] && price > prices[i + 2]) {
                levels.push({
                    price: price,
                    type: 'resistance',
                    time: data[i].time,
                    strength: this.calculateLevelStrength(data, price, sensitivity)
                });
            }

            // Check if it's a local minimum (support)
            if (price < prices[i - 1] && price < prices[i - 2] &&
                price < prices[i + 1] && price < prices[i + 2]) {
                levels.push({
                    price: price,
                    type: 'support',
                    time: data[i].time,
                    strength: this.calculateLevelStrength(data, price, sensitivity)
                });
            }
        }

        // Merge nearby levels
        return this.mergeLevels(levels, sensitivity);
    }

    /**
     * Calculate strength of support/resistance level
     */
    static calculateLevelStrength(data, level, sensitivity) {
        let touches = 0;
        const threshold = level * sensitivity;

        data.forEach(candle => {
            if (Math.abs(candle.high - level) <= threshold ||
                Math.abs(candle.low - level) <= threshold) {
                touches++;
            }
        });

        return touches;
    }

    /**
     * Merge nearby support/resistance levels
     */
    static mergeLevels(levels, sensitivity) {
        const merged = [];

        levels.forEach(level => {
            const existing = merged.find(m =>
                Math.abs(m.price - level.price) / level.price <= sensitivity &&
                m.type === level.type
            );

            if (existing) {
                existing.strength += level.strength;
                existing.price = (existing.price + level.price) / 2;
            } else {
                merged.push({ ...level });
            }
        });

        return merged.sort((a, b) => b.strength - a.strength);
    }

    /**
     * Identify chart patterns
     */
    static identifyPattern(data, lookback = 50) {
        if (data.length < lookback) return null;

        const recentData = data.slice(-lookback);
        const prices = recentData.map(d => d.close);

        // Check for head and shoulders
        if (this.isHeadAndShoulders(prices)) {
            return { pattern: 'Head and Shoulders', signal: 'bearish' };
        }

        // Check for double top
        if (this.isDoubleTop(prices)) {
            return { pattern: 'Double Top', signal: 'bearish' };
        }

        // Check for double bottom
        if (this.isDoubleBottom(prices)) {
            return { pattern: 'Double Bottom', signal: 'bullish' };
        }

        // Check for trend
        const trend = this.identifyTrend(prices);
        if (trend !== 'sideways') {
            return { pattern: trend === 'up' ? 'Uptrend' : 'Downtrend', signal: trend === 'up' ? 'bullish' : 'bearish' };
        }

        return null;
    }

    static isHeadAndShoulders(prices) {
        // Simplified pattern detection
        const mid = Math.floor(prices.length / 2);
        const leftShoulder = Math.max(...prices.slice(0, mid / 2));
        const head = Math.max(...prices.slice(mid / 2, mid + mid / 2));
        const rightShoulder = Math.max(...prices.slice(mid + mid / 2));

        return head > leftShoulder && head > rightShoulder &&
               Math.abs(leftShoulder - rightShoulder) / leftShoulder < 0.05;
    }

    static isDoubleTop(prices) {
        const peaks = [];
        for (let i = 1; i < prices.length - 1; i++) {
            if (prices[i] > prices[i - 1] && prices[i] > prices[i + 1]) {
                peaks.push(prices[i]);
            }
        }

        if (peaks.length >= 2) {
            const lastTwo = peaks.slice(-2);
            return Math.abs(lastTwo[0] - lastTwo[1]) / lastTwo[0] < 0.03;
        }
        return false;
    }

    static isDoubleBottom(prices) {
        const troughs = [];
        for (let i = 1; i < prices.length - 1; i++) {
            if (prices[i] < prices[i - 1] && prices[i] < prices[i + 1]) {
                troughs.push(prices[i]);
            }
        }

        if (troughs.length >= 2) {
            const lastTwo = troughs.slice(-2);
            return Math.abs(lastTwo[0] - lastTwo[1]) / lastTwo[0] < 0.03;
        }
        return false;
    }

    static identifyTrend(prices, period = 20) {
        if (prices.length < period) return 'sideways';

        const recentPrices = prices.slice(-period);
        const firstHalf = recentPrices.slice(0, period / 2);
        const secondHalf = recentPrices.slice(period / 2);

        const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

        const changePercent = ((secondAvg - firstAvg) / firstAvg) * 100;

        if (changePercent > 2) return 'up';
        if (changePercent < -2) return 'down';
        return 'sideways';
    }
}

// Export
if (typeof window !== 'undefined') {
    window.TechnicalIndicators = TechnicalIndicators;
}
