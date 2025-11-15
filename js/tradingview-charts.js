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

// Data cache for API calls (5-minute cache)
const dataCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch real stock data from Finnhub API with caching
 */
async function fetchRealStockData(symbol, days = 30, resolution = 'D') {
    const cacheKey = `${symbol}_${resolution}_${days}`;
    const now = Date.now();

    // Check cache first
    const cached = dataCache.get(cacheKey);
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
        console.log(`Using cached data for ${symbol}`);
        return cached.data;
    }

    try {
        const toDate = Math.floor(now / 1000);
        const fromDate = toDate - (days * 24 * 60 * 60);

        // Using Finnhub API with key from config
        const apiKey = typeof FINNHUB_API_KEY !== 'undefined' ? FINNHUB_API_KEY : 'd3sop19r01qpdd5kkpsgd3sop19r01qpdd5kkpt0';
        const url = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${fromDate}&to=${toDate}&token=${apiKey}`;

        console.log(`Fetching real data for ${symbol} from Finnhub...`);
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Check for API errors
        if (data.s === 'no_data') {
            console.warn(`No data available for ${symbol}`);
            return null;
        }

        if (data.s !== 'ok') {
            console.error('Finnhub API error:', data);
            return null;
        }

        // Transform data to chart format
        const chartData = data.t.map((time, idx) => ({
            time: time,
            open: data.o[idx],
            high: data.h[idx],
            low: data.l[idx],
            close: data.c[idx],
            volume: data.v[idx]
        }));

        // Cache the result
        dataCache.set(cacheKey, {
            data: chartData,
            timestamp: now
        });

        console.log(`Successfully fetched ${chartData.length} candles for ${symbol}`);
        return chartData;

    } catch (error) {
        console.error(`Error fetching stock data for ${symbol}:`, error);
        return null;
    }
}

/**
 * Clear old cache entries (cleanup function)
 */
function clearOldCache() {
    const now = Date.now();
    for (const [key, value] of dataCache.entries()) {
        if (now - value.timestamp > CACHE_DURATION) {
            dataCache.delete(key);
        }
    }
}

// Run cache cleanup every 10 minutes
setInterval(clearOldCache, 10 * 60 * 1000);

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

/**
 * Smart data fetcher - tries real data, falls back to sample data
 * @param {string} symbol - Stock symbol (e.g., 'AAPL') or pattern for sample data
 * @param {number} days - Number of days of historical data
 * @param {boolean} useRealData - Force real data (true) or sample data (false)
 * @returns {Promise<Array>} Chart data array
 */
async function getChartData(symbol, days = 30, useRealData = true) {
    if (!useRealData) {
        // Use sample data - symbol is treated as pattern name
        console.log(`Generating sample ${symbol} pattern data`);
        return generateSampleChartData(symbol, days);
    }

    // Try to fetch real data
    console.log(`Attempting to fetch real data for ${symbol}...`);
    const realData = await fetchRealStockData(symbol, days);

    if (realData && realData.length > 0) {
        return realData;
    }

    // Fallback to sample uptrend data
    console.warn(`Real data unavailable for ${symbol}, falling back to sample data`);
    return generateSampleChartData('uptrend', days);
}

/**
 * Create chart with loading state
 * @param {string} containerId - DOM container ID
 * @param {string} symbol - Stock symbol or pattern
 * @param {Object} options - Chart options + { useRealData: boolean }
 * @returns {Promise<Object>} Chart instance
 */
async function createChartWithData(containerId, symbol, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container ${containerId} not found`);
        return null;
    }

    // Show loading indicator
    container.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 400px; color: #b0b0b0; font-size: 16px;">📊 Loading chart data...</div>';

    try {
        const useRealData = options.useRealData !== false; // Default to true
        const days = options.days || 30;

        // Fetch data
        const data = await getChartData(symbol, days, useRealData);

        if (!data || data.length === 0) {
            container.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 400px; color: #ef4444; font-size: 16px;">⚠️ No data available</div>';
            return null;
        }

        // Create chart
        const chartInstance = createInteractiveCandlestickChart(containerId, data, options);

        // Add data source label
        const label = useRealData ? '📊 Real Market Data (15-min delayed)' : '🎓 Sample Educational Data';
        const labelDiv = document.createElement('div');
        labelDiv.style.cssText = 'position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.7); color: #10b981; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 600; z-index: 10;';
        labelDiv.textContent = label;
        container.style.position = 'relative';
        container.insertBefore(labelDiv, container.firstChild);

        return chartInstance;

    } catch (error) {
        console.error('Error creating chart:', error);
        container.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 400px; color: #ef4444; font-size: 16px;">⚠️ Error loading chart</div>';
        return null;
    }
}

/**
 * Create a data source toggle UI element
 * @param {Object} config - { containerId, symbol, onToggle: (useRealData) => {} }
 * @returns {HTMLElement} Toggle element
 */
function createDataSourceToggle(config) {
    const { containerId, symbol = 'AAPL', onToggle } = config;

    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display: flex; align-items: center; gap: 12px; margin-bottom: 16px; padding: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px;';

    const label = document.createElement('span');
    label.style.cssText = 'font-size: 14px; color: #b0b0b0; font-weight: 600;';
    label.textContent = 'Data Source:';

    const toggle = document.createElement('div');
    toggle.style.cssText = 'display: flex; background: rgba(255,255,255,0.05); border-radius: 8px; padding: 4px; cursor: pointer;';

    const realBtn = document.createElement('button');
    realBtn.textContent = '📊 Real Data';
    realBtn.style.cssText = 'padding: 8px 16px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;';

    const sampleBtn = document.createElement('button');
    sampleBtn.textContent = '🎓 Sample Data';
    sampleBtn.style.cssText = 'padding: 8px 16px; background: transparent; color: #b0b0b0; border: none; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;';

    let useRealData = true;

    function updateToggle(isRealData) {
        if (isRealData) {
            realBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            realBtn.style.color = 'white';
            sampleBtn.style.background = 'transparent';
            sampleBtn.style.color = '#b0b0b0';
        } else {
            realBtn.style.background = 'transparent';
            realBtn.style.color = '#b0b0b0';
            sampleBtn.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
            sampleBtn.style.color = 'white';
        }
    }

    realBtn.addEventListener('click', async () => {
        if (!useRealData) {
            useRealData = true;
            updateToggle(true);
            if (onToggle) onToggle(true);
        }
    });

    sampleBtn.addEventListener('click', async () => {
        if (useRealData) {
            useRealData = false;
            updateToggle(false);
            if (onToggle) onToggle(false);
        }
    });

    toggle.appendChild(realBtn);
    toggle.appendChild(sampleBtn);

    wrapper.appendChild(label);
    wrapper.appendChild(toggle);

    // Add stock symbol input if real data
    const symbolInput = document.createElement('div');
    symbolInput.style.cssText = 'display: flex; gap: 8px; align-items: center;';

    const symbolLabel = document.createElement('span');
    symbolLabel.style.cssText = 'font-size: 13px; color: #888; margin-left: 12px;';
    symbolLabel.textContent = 'Symbol:';

    const input = document.createElement('input');
    input.type = 'text';
    input.value = symbol;
    input.placeholder = 'AAPL';
    input.style.cssText = 'width: 80px; padding: 6px 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #e8e8e8; font-size: 13px; text-transform: uppercase; font-weight: 600;';

    const loadBtn = document.createElement('button');
    loadBtn.textContent = 'Load';
    loadBtn.style.cssText = 'padding: 6px 12px; background: rgba(16, 185, 129, 0.2); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;';
    loadBtn.addEventListener('mouseover', () => {
        loadBtn.style.background = 'rgba(16, 185, 129, 0.3)';
    });
    loadBtn.addEventListener('mouseout', () => {
        loadBtn.style.background = 'rgba(16, 185, 129, 0.2)';
    });

    loadBtn.addEventListener('click', () => {
        if (onToggle) onToggle(useRealData, input.value.toUpperCase());
    });

    symbolInput.appendChild(symbolLabel);
    symbolInput.appendChild(input);
    symbolInput.appendChild(loadBtn);
    wrapper.appendChild(symbolInput);

    return wrapper;
}

// Export functions
if (typeof window !== 'undefined') {
    window.TradingViewCharts = {
        createInteractiveCandlestickChart,
        addSupportResistanceLine,
        addIndicatorOverlay,
        generateSampleChartData,
        fetchRealStockData,
        getChartData,
        createChartWithData,
        createDataSourceToggle,
        calculateSMA,
        destroyChart,
        clearOldCache
    };
}
