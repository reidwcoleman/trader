// WebSocket Live Data Integration for FinClash Trading Charts
// Supports: Alpaca (FREE real-time), Binance (crypto), Finnhub WebSocket

/**
 * Live Chart Updater - Manages WebSocket connections for real-time updates
 */
class LiveChartUpdater {
    constructor(chartInstance, symbol, provider = 'alpaca') {
        this.chart = chartInstance;
        this.symbol = symbol.toUpperCase();
        this.provider = provider;
        this.ws = null;
        this.isConnected = false;
        this.lastUpdate = null;
        this.updateCount = 0;
        this.callbacks = {
            onTrade: null,
            onQuote: null,
            onBar: null,
            onError: null,
            onConnect: null,
            onDisconnect: null
        };

        // Current candle aggregation for bar updates
        this.currentBar = null;
        this.barInterval = 60; // 1 minute bars by default
    }

    /**
     * Connect to WebSocket based on provider
     */
    async connect(credentials = {}) {
        console.log(`🔌 Connecting to ${this.provider} WebSocket for ${this.symbol}...`);

        switch (this.provider) {
            case 'alpaca':
                return this.connectAlpaca(credentials);
            case 'binance':
                return this.connectBinance();
            case 'finnhub':
                return this.connectFinnhub(credentials);
            default:
                throw new Error(`Unknown provider: ${this.provider}`);
        }
    }

    /**
     * Alpaca WebSocket (FREE real-time with paper trading account)
     * Docs: https://alpaca.markets/docs/api-references/market-data-api/stock-pricing-data/realtime/
     */
    connectAlpaca(credentials) {
        const { apiKey, apiSecret } = credentials;

        if (!apiKey || !apiSecret) {
            console.error('❌ Alpaca requires API key and secret. Sign up free at https://alpaca.markets');
            return;
        }

        // Alpaca real-time WebSocket (IEX data)
        this.ws = new WebSocket('wss://stream.data.alpaca.markets/v2/iex');

        this.ws.onopen = () => {
            console.log('✓ Alpaca WebSocket connected');

            // Authenticate
            this.ws.send(JSON.stringify({
                action: 'auth',
                key: apiKey,
                secret: apiSecret
            }));
        };

        this.ws.onmessage = (event) => {
            const messages = JSON.parse(event.data);

            messages.forEach(msg => {
                if (msg.T === 'success' && msg.msg === 'authenticated') {
                    console.log('✓ Alpaca authenticated');
                    this.isConnected = true;

                    // Subscribe to trades, quotes, and bars
                    this.ws.send(JSON.stringify({
                        action: 'subscribe',
                        trades: [this.symbol],
                        quotes: [this.symbol],
                        bars: [this.symbol]
                    }));

                    if (this.callbacks.onConnect) this.callbacks.onConnect();
                }

                // Trade update
                if (msg.T === 't') {
                    this.handleTrade({
                        symbol: msg.S,
                        price: msg.p,
                        size: msg.s,
                        timestamp: new Date(msg.t)
                    });
                }

                // Quote update (bid/ask)
                if (msg.T === 'q') {
                    this.handleQuote({
                        symbol: msg.S,
                        bid: msg.bp,
                        ask: msg.ap,
                        bidSize: msg.bs,
                        askSize: msg.as,
                        timestamp: new Date(msg.t)
                    });
                }

                // Bar update (1-min candle)
                if (msg.T === 'b') {
                    this.handleBar({
                        symbol: msg.S,
                        open: msg.o,
                        high: msg.h,
                        low: msg.l,
                        close: msg.c,
                        volume: msg.v,
                        timestamp: new Date(msg.t)
                    });
                }
            });
        };

        this.ws.onerror = (error) => {
            console.error('❌ Alpaca WebSocket error:', error);
            if (this.callbacks.onError) this.callbacks.onError(error);
        };

        this.ws.onclose = () => {
            console.log('🔌 Alpaca WebSocket disconnected');
            this.isConnected = false;
            if (this.callbacks.onDisconnect) this.callbacks.onDisconnect();
        };
    }

    /**
     * Binance WebSocket (FREE unlimited crypto real-time)
     * Docs: https://github.com/binance/binance-spot-api-docs/blob/master/web-socket-streams.md
     */
    connectBinance() {
        // Convert symbol to Binance format (e.g., BTCUSDT)
        const binanceSymbol = this.symbol.toLowerCase();

        // Binance WebSocket for 1-minute klines (candlesticks)
        this.ws = new WebSocket(`wss://stream.binance.com:9443/ws/${binanceSymbol}@kline_1m`);

        this.ws.onopen = () => {
            console.log('✓ Binance WebSocket connected');
            this.isConnected = true;
            if (this.callbacks.onConnect) this.callbacks.onConnect();
        };

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const kline = data.k;

            if (kline) {
                const bar = {
                    symbol: kline.s,
                    open: parseFloat(kline.o),
                    high: parseFloat(kline.h),
                    low: parseFloat(kline.l),
                    close: parseFloat(kline.c),
                    volume: parseFloat(kline.v),
                    timestamp: new Date(kline.t),
                    isFinal: kline.x // Is candle closed?
                };

                this.handleBar(bar);
            }
        };

        this.ws.onerror = (error) => {
            console.error('❌ Binance WebSocket error:', error);
            if (this.callbacks.onError) this.callbacks.onError(error);
        };

        this.ws.onclose = () => {
            console.log('🔌 Binance WebSocket disconnected');
            this.isConnected = false;
            if (this.callbacks.onDisconnect) this.callbacks.onDisconnect();
        };
    }

    /**
     * Finnhub WebSocket (requires Pro subscription $59/mo)
     * Docs: https://finnhub.io/docs/api/websocket-trades
     */
    connectFinnhub(credentials) {
        const apiKey = credentials.apiKey || (typeof FINNHUB_API_KEY !== 'undefined' ? FINNHUB_API_KEY : null);

        if (!apiKey) {
            console.error('❌ Finnhub WebSocket requires API key');
            return;
        }

        this.ws = new WebSocket(`wss://ws.finnhub.io?token=${apiKey}`);

        this.ws.onopen = () => {
            console.log('✓ Finnhub WebSocket connected');
            this.isConnected = true;

            // Subscribe to trades
            this.ws.send(JSON.stringify({
                type: 'subscribe',
                symbol: this.symbol
            }));

            if (this.callbacks.onConnect) this.callbacks.onConnect();
        };

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === 'trade' && data.data) {
                data.data.forEach(trade => {
                    this.handleTrade({
                        symbol: trade.s,
                        price: trade.p,
                        size: trade.v,
                        timestamp: new Date(trade.t)
                    });
                });
            }
        };

        this.ws.onerror = (error) => {
            console.error('❌ Finnhub WebSocket error:', error);
            if (this.callbacks.onError) this.callbacks.onError(error);
        };

        this.ws.onclose = () => {
            console.log('🔌 Finnhub WebSocket disconnected');
            this.isConnected = false;
            if (this.callbacks.onDisconnect) this.callbacks.onDisconnect();
        };
    }

    /**
     * Handle trade update
     */
    handleTrade(trade) {
        this.lastUpdate = trade.timestamp;
        this.updateCount++;

        console.log(`💹 Trade: ${trade.symbol} @ $${trade.price} (${trade.size} shares)`);

        // Update current bar
        this.updateCurrentBar(trade.price, trade.size, trade.timestamp);

        if (this.callbacks.onTrade) {
            this.callbacks.onTrade(trade);
        }
    }

    /**
     * Handle quote update (bid/ask)
     */
    handleQuote(quote) {
        if (this.callbacks.onQuote) {
            this.callbacks.onQuote(quote);
        }
    }

    /**
     * Handle bar update (completed candle)
     */
    handleBar(bar) {
        this.lastUpdate = bar.timestamp;
        this.updateCount++;

        console.log(`📊 Bar: ${bar.symbol} O:${bar.open} H:${bar.high} L:${bar.low} C:${bar.close} V:${bar.volume}`);

        // Update chart with new candle
        if (this.chart && this.chart.candlestickSeries) {
            const candleData = {
                time: Math.floor(bar.timestamp.getTime() / 1000),
                open: bar.open,
                high: bar.high,
                low: bar.low,
                close: bar.close
            };

            this.chart.candlestickSeries.update(candleData);
        }

        if (this.callbacks.onBar) {
            this.callbacks.onBar(bar);
        }
    }

    /**
     * Update current bar with trade data
     */
    updateCurrentBar(price, volume, timestamp) {
        const barTime = Math.floor(timestamp.getTime() / (this.barInterval * 1000)) * this.barInterval;

        if (!this.currentBar || this.currentBar.time !== barTime) {
            // Start new bar
            this.currentBar = {
                time: barTime,
                open: price,
                high: price,
                low: price,
                close: price,
                volume: volume
            };
        } else {
            // Update existing bar
            this.currentBar.high = Math.max(this.currentBar.high, price);
            this.currentBar.low = Math.min(this.currentBar.low, price);
            this.currentBar.close = price;
            this.currentBar.volume += volume;
        }

        // Update chart
        if (this.chart && this.chart.candlestickSeries) {
            this.chart.candlestickSeries.update({
                time: this.currentBar.time,
                open: this.currentBar.open,
                high: this.currentBar.high,
                low: this.currentBar.low,
                close: this.currentBar.close
            });
        }
    }

    /**
     * Set event callbacks
     */
    on(event, callback) {
        if (this.callbacks.hasOwnProperty(`on${event.charAt(0).toUpperCase() + event.slice(1)}`)) {
            this.callbacks[`on${event.charAt(0).toUpperCase() + event.slice(1)}`] = callback;
        }
    }

    /**
     * Get connection stats
     */
    getStats() {
        return {
            provider: this.provider,
            symbol: this.symbol,
            isConnected: this.isConnected,
            updateCount: this.updateCount,
            lastUpdate: this.lastUpdate,
            uptime: this.lastUpdate ? (Date.now() - this.lastUpdate.getTime()) / 1000 : 0
        };
    }

    /**
     * Disconnect WebSocket
     */
    disconnect() {
        if (this.ws) {
            if (this.provider === 'alpaca') {
                // Unsubscribe first
                this.ws.send(JSON.stringify({
                    action: 'unsubscribe',
                    trades: [this.symbol],
                    quotes: [this.symbol],
                    bars: [this.symbol]
                }));
            } else if (this.provider === 'finnhub') {
                this.ws.send(JSON.stringify({
                    type: 'unsubscribe',
                    symbol: this.symbol
                }));
            }

            this.ws.close();
            this.isConnected = false;
            console.log(`🔌 Disconnected from ${this.provider} for ${this.symbol}`);
        }
    }
}

// Export
if (typeof window !== 'undefined') {
    window.LiveChartUpdater = LiveChartUpdater;
}
