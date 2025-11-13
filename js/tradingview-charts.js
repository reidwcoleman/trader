// TradingView Lightweight Charts Integration for FinClash Learning Tab
// Professional-grade interactive charts for educational purposes

/**
 * Create an interactive candlestick chart with TradingView Lightweight Charts
 * @param {string} containerId - DOM element ID for chart
 * @param {Array} data - Array of {time, open, high, low, close, volume}
 * @param {Object} options - Chart configuration options
 */
function createInteractiveCandlestickChart(containerId, data, options = {}) {
    const container = document.getElementById(containerId);
    if (!container || typeof LightweightCharts === 'undefined') {
        console.error('TradingView Charts not loaded or container not found');
        return null;
    }

    // Clear existing content
    container.innerHTML = '';

    // Default options
    const defaultOptions = {
        width: container.clientWidth,
        height: options.height || 400,
        layout: {
            background: { color: '#1a1a2e' },
            textColor: '#d1d4dc',
        },
        grid: {
            vertLines: { color: '#2a2e39' },
            horzLines: { color: '#2a2e39' },
        },
        crosshair: {
            mode: LightweightCharts.CrosshairMode.Normal,
        },
        rightPriceScale: {
            borderColor: '#485c7b',
        },
        timeScale: {
            borderColor: '#485c7b',
            timeVisible: true,
            secondsVisible: false,
        },
    };

    const chart = LightweightCharts.createChart(container, {
        ...defaultOptions,
        ...options
    });

    // Add candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
    });

    candlestickSeries.setData(data);

    // Add volume series if volume data exists
    if (data[0]?.volume !== undefined) {
        const volumeSeries = chart.addHistogramSeries({
            color: '#26a69a',
            priceFormat: {
                type: 'volume',
            },
            priceScaleId: 'volume',
            scaleMargins: {
                top: 0.8,
                bottom: 0,
            },
        });

        const volumeData = data.map(d => ({
            time: d.time,
            value: d.volume,
            color: d.close > d.open ? '#26a69a' : '#ef5350'
        }));

        volumeSeries.setData(volumeData);
    }

    // Fit content
    chart.timeScale().fitContent();

    // Handle resize
    const resizeObserver = new ResizeObserver(entries => {
        if (entries.length === 0) return;
        const newRect = entries[0].contentRect;
        chart.applyOptions({ width: newRect.width });
    });
    resizeObserver.observe(container);

    return { chart, candlestickSeries, container, resizeObserver };
}

/**
 * Add support and resistance lines to chart
 */
function addSupportResistanceLine(chartInstance, price, color, label) {
    if (!chartInstance || !chartInstance.candlestickSeries) return;

    const priceLine = chartInstance.candlestickSeries.createPriceLine({
        price: price,
        color: color,
        lineWidth: 2,
        lineStyle: LightweightCharts.LineStyle.Dashed,
        axisLabelVisible: true,
        title: label,
    });

    return priceLine;
}

/**
 * Add technical indicators overlay
 */
function addIndicatorOverlay(chartInstance, indicatorType, data, params = {}) {
    if (!chartInstance || !chartInstance.chart) return;

    let series;

    switch (indicatorType) {
        case 'SMA':
            series = chartInstance.chart.addLineSeries({
                color: params.color || '#2196F3',
                lineWidth: 2,
                title: `SMA(${params.period || 20})`,
            });
            series.setData(data);
            break;

        case 'EMA':
            series = chartInstance.chart.addLineSeries({
                color: params.color || '#FF6D00',
                lineWidth: 2,
                title: `EMA(${params.period || 20})`,
            });
            series.setData(data);
            break;

        case 'BB':
            // Bollinger Bands - 3 lines
            const upperSeries = chartInstance.chart.addLineSeries({
                color: 'rgba(33, 150, 243, 0.5)',
                lineWidth: 1,
                title: 'BB Upper',
            });
            const middleSeries = chartInstance.chart.addLineSeries({
                color: '#2196F3',
                lineWidth: 2,
                title: 'BB Middle',
            });
            const lowerSeries = chartInstance.chart.addLineSeries({
                color: 'rgba(33, 150, 243, 0.5)',
                lineWidth: 1,
                title: 'BB Lower',
            });

            upperSeries.setData(data.upper);
            middleSeries.setData(data.middle);
            lowerSeries.setData(data.lower);

            return { upperSeries, middleSeries, lowerSeries };

        default:
            console.warn('Unknown indicator type:', indicatorType);
    }

    return series;
}

/**
 * Generate sample chart data for learning examples
 */
function generateSampleChartData(pattern = 'uptrend', days = 30) {
    const data = [];
    const now = Math.floor(Date.now() / 1000);
    const dayInSeconds = 24 * 60 * 60;

    let basePrice = 100;

    for (let i = days; i >= 0; i--) {
        const time = now - (i * dayInSeconds);
        let open, high, low, close;

        switch (pattern) {
            case 'uptrend':
                // Steady uptrend
                open = basePrice + Math.random() * 2 - 1;
                close = open + Math.random() * 3 + 0.5;
                high = Math.max(open, close) + Math.random() * 1;
                low = Math.min(open, close) - Math.random() * 1;
                basePrice += 0.5;
                break;

            case 'downtrend':
                // Steady downtrend
                open = basePrice + Math.random() * 2 - 1;
                close = open - Math.random() * 3 - 0.5;
                high = Math.max(open, close) + Math.random() * 1;
                low = Math.min(open, close) - Math.random() * 1;
                basePrice -= 0.5;
                break;

            case 'bullFlag':
                // Bull flag pattern
                if (i > days * 0.7) {
                    // Flagpole (sharp rise)
                    open = basePrice;
                    close = open + Math.random() * 5 + 3;
                    high = close + Math.random() * 2;
                    low = open - Math.random() * 1;
                    basePrice += 4;
                } else if (i > days * 0.3) {
                    // Flag (consolidation)
                    open = basePrice + Math.random() * 2 - 1;
                    close = open - Math.random() * 1.5;
                    high = Math.max(open, close) + Math.random() * 1;
                    low = Math.min(open, close) - Math.random() * 1;
                    basePrice -= 0.3;
                } else {
                    // Breakout
                    open = basePrice;
                    close = open + Math.random() * 4 + 2;
                    high = close + Math.random() * 2;
                    low = open - Math.random() * 0.5;
                    basePrice += 3;
                }
                break;

            case 'headShoulders':
                // Head and shoulders pattern
                const phase = i / days;
                if (phase > 0.8) {
                    // Left shoulder
                    open = basePrice;
                    close = open + Math.random() * 3 + 2;
                    high = close + Math.random();
                    low = open - Math.random();
                    basePrice += 2;
                } else if (phase > 0.6) {
                    // Dip
                    open = basePrice;
                    close = open - Math.random() * 2;
                    high = open + Math.random();
                    low = close - Math.random();
                    basePrice -= 1;
                } else if (phase > 0.4) {
                    // Head
                    open = basePrice;
                    close = open + Math.random() * 4 + 3;
                    high = close + Math.random() * 2;
                    low = open - Math.random();
                    basePrice += 3;
                } else if (phase > 0.2) {
                    // Dip
                    open = basePrice;
                    close = open - Math.random() * 3;
                    high = open + Math.random();
                    low = close - Math.random();
                    basePrice -= 2;
                } else {
                    // Right shoulder and breakdown
                    open = basePrice;
                    close = open - Math.random() * 4 - 2;
                    high = open + Math.random();
                    low = close - Math.random() * 2;
                    basePrice -= 3;
                }
                break;

            case 'doubleBottom':
                // Double bottom pattern
                if (i > days * 0.7) {
                    // Downtrend to first bottom
                    open = basePrice;
                    close = open - Math.random() * 2;
                    high = open + Math.random();
                    low = close - Math.random();
                    basePrice -= 1.5;
                } else if (i > days * 0.5) {
                    // Bounce from first bottom
                    open = basePrice;
                    close = open + Math.random() * 2 + 1;
                    high = close + Math.random();
                    low = open - Math.random();
                    basePrice += 1;
                } else if (i > days * 0.3) {
                    // Down to second bottom
                    open = basePrice;
                    close = open - Math.random() * 2;
                    high = open + Math.random();
                    low = close - Math.random();
                    basePrice -= 1.5;
                } else {
                    // Breakout upward
                    open = basePrice;
                    close = open + Math.random() * 3 + 2;
                    high = close + Math.random() * 2;
                    low = open - Math.random();
                    basePrice += 2.5;
                }
                break;

            default:
                // Sideways/ranging
                open = basePrice + Math.random() * 4 - 2;
                close = basePrice + Math.random() * 4 - 2;
                high = Math.max(open, close) + Math.random() * 2;
                low = Math.min(open, close) - Math.random() * 2;
        }

        data.push({
            time: time,
            open: Math.max(0.01, open),
            high: Math.max(0.01, high),
            low: Math.max(0.01, low),
            close: Math.max(0.01, close),
            volume: Math.floor(Math.random() * 10000000) + 1000000
        });
    }

    return data;
}

/**
 * Fetch real stock data from API
 */
async function fetchRealStockData(symbol, days = 30) {
    try {
        const toDate = Math.floor(Date.now() / 1000);
        const fromDate = toDate - (days * 24 * 60 * 60);

        // Using Finnhub API
        const apiKey = 'ctYOURAPIKEY'; // Replace with actual key from config
        const response = await fetch(
            `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${fromDate}&to=${toDate}&token=${apiKey}`
        );

        const data = await response.json();

        if (data.s === 'ok') {
            return data.t.map((time, idx) => ({
                time: time,
                open: data.o[idx],
                high: data.h[idx],
                low: data.l[idx],
                close: data.c[idx],
                volume: data.v[idx]
            }));
        }
    } catch (error) {
        console.error('Error fetching stock data:', error);
    }

    return null;
}

/**
 * Calculate Simple Moving Average
 */
function calculateSMA(data, period) {
    const smaData = [];

    for (let i = period - 1; i < data.length; i++) {
        let sum = 0;
        for (let j = 0; j < period; j++) {
            sum += data[i - j].close;
        }
        smaData.push({
            time: data[i].time,
            value: sum / period
        });
    }

    return smaData;
}

/**
 * Cleanup chart instance
 */
function destroyChart(chartInstance) {
    if (chartInstance) {
        if (chartInstance.resizeObserver) {
            chartInstance.resizeObserver.disconnect();
        }
        if (chartInstance.chart) {
            chartInstance.chart.remove();
        }
    }
}

// Export functions
if (typeof window !== 'undefined') {
    window.TradingViewCharts = {
        createInteractiveCandlestickChart,
        addSupportResistanceLine,
        addIndicatorOverlay,
        generateSampleChartData,
        fetchRealStockData,
        calculateSMA,
        destroyChart
    };
}
