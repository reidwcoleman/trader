// Alert System for FinClash - Real-time Trading Alerts
// Breakouts, technical signals, news events, unusual activity

/**
 * Trading Alert System
 * Monitors stocks and sends notifications when important events occur
 */
class TradingAlertSystem {
    constructor() {
        this.alerts = [];
        this.watchlist = this.loadWatchlist();
        this.alertHistory = this.loadAlertHistory();
        this.isMonitoring = false;
    }

    /**
     * Create a new alert
     */
    createAlert(config) {
        const alert = {
            id: this.generateAlertId(),
            symbol: config.symbol,
            type: config.type, // 'price', 'breakout', 'rsi', 'volume', 'news', 'social'
            condition: config.condition,
            value: config.value,
            active: true,
            triggered: false,
            createdAt: Date.now(),
            lastChecked: null
        };

        this.alerts.push(alert);
        this.saveAlerts();
        return alert;
    }

    /**
     * Price alert (crosses above/below a price)
     */
    addPriceAlert(symbol, condition, price) {
        return this.createAlert({
            symbol,
            type: 'price',
            condition, // 'above' or 'below'
            value: price
        });
    }

    /**
     * Breakout alert (price breaks resistance/support)
     */
    addBreakoutAlert(symbol, level, direction) {
        return this.createAlert({
            symbol,
            type: 'breakout',
            condition: direction, // 'resistance' or 'support'
            value: level
        });
    }

    /**
     * RSI alert (overbought/oversold)
     */
    addRSIAlert(symbol, condition, value = 70) {
        return this.createAlert({
            symbol,
            type: 'rsi',
            condition, // 'overbought' or 'oversold'
            value
        });
    }

    /**
     * Volume spike alert
     */
    addVolumeAlert(symbol, multiplier = 2.0) {
        return this.createAlert({
            symbol,
            type: 'volume',
            condition: 'spike',
            value: multiplier
        });
    }

    /**
     * Check all active alerts
     */
    async checkAlerts(stockData) {
        const triggeredAlerts = [];

        for (const alert of this.alerts) {
            if (!alert.active || alert.triggered) continue;

            const triggered = await this.evaluateAlert(alert, stockData);

            if (triggered) {
                alert.triggered = true;
                alert.triggeredAt = Date.now();
                triggeredAlerts.push(alert);

                // Send notification
                this.sendNotification(alert, stockData);

                // Add to history
                this.addToHistory(alert, stockData);
            }

            alert.lastChecked = Date.now();
        }

        if (triggeredAlerts.length > 0) {
            this.saveAlerts();
        }

        return triggeredAlerts;
    }

    /**
     * Evaluate if an alert should trigger
     */
    async evaluateAlert(alert, stockData) {
        const stock = stockData[alert.symbol];
        if (!stock) return false;

        switch (alert.type) {
            case 'price':
                return this.checkPriceAlert(alert, stock);

            case 'breakout':
                return this.checkBreakoutAlert(alert, stock);

            case 'rsi':
                return this.checkRSIAlert(alert, stock);

            case 'volume':
                return this.checkVolumeAlert(alert, stock);

            case 'social':
                return this.checkSocialAlert(alert, stock);

            default:
                return false;
        }
    }

    /**
     * Check price alert
     */
    checkPriceAlert(alert, stock) {
        const currentPrice = stock.price;

        if (alert.condition === 'above') {
            return currentPrice >= alert.value;
        } else if (alert.condition === 'below') {
            return currentPrice <= alert.value;
        }

        return false;
    }

    /**
     * Check breakout alert
     */
    checkBreakoutAlert(alert, stock) {
        const currentPrice = stock.price;
        const previousPrice = stock.previousClose;

        if (alert.condition === 'resistance') {
            // Breaking above resistance
            return previousPrice < alert.value && currentPrice > alert.value;
        } else if (alert.condition === 'support') {
            // Breaking below support
            return previousPrice > alert.value && currentPrice < alert.value;
        }

        return false;
    }

    /**
     * Check RSI alert
     */
    checkRSIAlert(alert, stock) {
        const rsi = stock.rsi || 50;

        if (alert.condition === 'overbought') {
            return rsi >= alert.value;
        } else if (alert.condition === 'oversold') {
            return rsi <= alert.value;
        }

        return false;
    }

    /**
     * Check volume alert
     */
    checkVolumeAlert(alert, stock) {
        const currentVolume = stock.volume || 0;
        const avgVolume = stock.avgVolume || currentVolume;

        return currentVolume >= (avgVolume * alert.value);
    }

    /**
     * Check social media alert
     */
    checkSocialAlert(alert, stock) {
        const socialMentions = stock.socialMentions || 0;
        const avgMentions = stock.avgSocialMentions || socialMentions;

        return socialMentions >= (avgMentions * alert.value);
    }

    /**
     * Send notification
     */
    sendNotification(alert, stockData) {
        const stock = stockData[alert.symbol];

        const notification = {
            title: this.getNotificationTitle(alert),
            body: this.getNotificationBody(alert, stock),
            icon: this.getNotificationIcon(alert.type),
            timestamp: Date.now(),
            priority: this.getNotificationPriority(alert.type)
        };

        // Browser notification (if permission granted)
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(notification.title, {
                body: notification.body,
                icon: '/favicon.ico',
                tag: alert.id
            });
        }

        // In-app notification
        this.showInAppNotification(notification);

        // Play sound
        this.playNotificationSound(notification.priority);
    }

    /**
     * Get notification title
     */
    getNotificationTitle(alert) {
        const titles = {
            price: `🎯 ${alert.symbol} Price Alert`,
            breakout: `🚀 ${alert.symbol} Breakout!`,
            rsi: `📊 ${alert.symbol} RSI Alert`,
            volume: `📈 ${alert.symbol} Volume Spike`,
            social: `🔥 ${alert.symbol} Trending`,
            news: `📰 ${alert.symbol} News Alert`
        };

        return titles[alert.type] || `Alert: ${alert.symbol}`;
    }

    /**
     * Get notification body
     */
    getNotificationBody(alert, stock) {
        switch (alert.type) {
            case 'price':
                return `${alert.symbol} is now ${alert.condition} $${alert.value}. Current price: $${stock.price.toFixed(2)}`;

            case 'breakout':
                return `${alert.symbol} broke ${alert.condition} at $${alert.value}! Price: $${stock.price.toFixed(2)} (${stock.change > 0 ? '+' : ''}${stock.change.toFixed(2)}%)`;

            case 'rsi':
                return `${alert.symbol} RSI is ${stock.rsi.toFixed(1)} (${alert.condition}). Consider ${alert.condition === 'overbought' ? 'selling' : 'buying'}.`;

            case 'volume':
                return `${alert.symbol} volume is ${alert.value}x above average! Current: ${this.formatVolume(stock.volume)}`;

            case 'social':
                return `${alert.symbol} is trending on social media with ${stock.socialMentions} mentions!`;

            default:
                return `Alert triggered for ${alert.symbol}`;
        }
    }

    /**
     * Get notification icon
     */
    getNotificationIcon(type) {
        const icons = {
            price: '🎯',
            breakout: '🚀',
            rsi: '📊',
            volume: '📈',
            social: '🔥',
            news: '📰'
        };

        return icons[type] || '🔔';
    }

    /**
     * Get notification priority
     */
    getNotificationPriority(type) {
        const priorities = {
            breakout: 'high',
            price: 'high',
            volume: 'medium',
            rsi: 'medium',
            social: 'low',
            news: 'medium'
        };

        return priorities[type] || 'low';
    }

    /**
     * Show in-app notification
     */
    showInAppNotification(notification) {
        // Dispatch custom event that UI can listen to
        const event = new CustomEvent('tradingAlert', {
            detail: notification
        });
        window.dispatchEvent(event);
    }

    /**
     * Play notification sound
     */
    playNotificationSound(priority) {
        // Different sounds for different priorities
        try {
            const audio = new Audio();
            const sounds = {
                high: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10...', // Bell sound
                medium: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10...', // Chime
                low: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10...' // Soft beep
            };

            // In production, load actual sound files
            // audio.src = sounds[priority] || sounds.medium;
            // audio.play();
        } catch (e) {
            // Silently fail if audio not supported
        }
    }

    /**
     * Request notification permission
     */
    async requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }
        return Notification.permission === 'granted';
    }

    /**
     * Smart alerts - Auto-generate based on technical analysis
     */
    generateSmartAlerts(symbol, technicalData) {
        const smartAlerts = [];

        // RSI extreme alerts
        if (technicalData.rsi) {
            if (technicalData.rsi < 30) {
                smartAlerts.push({
                    type: 'suggestion',
                    message: `${symbol} RSI is ${technicalData.rsi.toFixed(1)} (oversold). Set alert for bounce?`,
                    config: { symbol, type: 'rsi', condition: 'above', value: 40 }
                });
            } else if (technicalData.rsi > 70) {
                smartAlerts.push({
                    type: 'suggestion',
                    message: `${symbol} RSI is ${technicalData.rsi.toFixed(1)} (overbought). Set alert for reversal?`,
                    config: { symbol, type: 'rsi', condition: 'below', value: 60 }
                });
            }
        }

        // Support/Resistance alerts
        if (technicalData.support) {
            smartAlerts.push({
                type: 'suggestion',
                message: `Set alert if ${symbol} breaks support at $${technicalData.support}?`,
                config: { symbol, type: 'breakout', condition: 'support', value: technicalData.support }
            });
        }

        if (technicalData.resistance) {
            smartAlerts.push({
                type: 'suggestion',
                message: `Set alert if ${symbol} breaks resistance at $${technicalData.resistance}?`,
                config: { symbol, type: 'breakout', condition: 'resistance', value: technicalData.resistance }
            });
        }

        return smartAlerts;
    }

    /**
     * Manage alerts
     */
    deleteAlert(alertId) {
        this.alerts = this.alerts.filter(a => a.id !== alertId);
        this.saveAlerts();
    }

    deactivateAlert(alertId) {
        const alert = this.alerts.find(a => a.id === alertId);
        if (alert) {
            alert.active = false;
            this.saveAlerts();
        }
    }

    activateAlert(alertId) {
        const alert = this.alerts.find(a => a.id === alertId);
        if (alert) {
            alert.active = true;
            alert.triggered = false;
            this.saveAlerts();
        }
    }

    getActiveAlerts() {
        return this.alerts.filter(a => a.active && !a.triggered);
    }

    getTriggeredAlerts() {
        return this.alerts.filter(a => a.triggered);
    }

    /**
     * Alert history
     */
    addToHistory(alert, stockData) {
        this.alertHistory.unshift({
            ...alert,
            stockPrice: stockData[alert.symbol]?.price,
            triggeredAt: Date.now()
        });

        // Keep last 100
        if (this.alertHistory.length > 100) {
            this.alertHistory = this.alertHistory.slice(0, 100);
        }

        this.saveAlertHistory();
    }

    getAlertHistory(limit = 20) {
        return this.alertHistory.slice(0, limit);
    }

    /**
     * Persistence
     */
    saveAlerts() {
        localStorage.setItem('trading_alerts', JSON.stringify(this.alerts));
    }

    loadWatchlist() {
        const saved = localStorage.getItem('trading_alerts');
        return saved ? JSON.parse(saved) : [];
    }

    saveAlertHistory() {
        localStorage.setItem('alert_history', JSON.stringify(this.alertHistory));
    }

    loadAlertHistory() {
        const saved = localStorage.getItem('alert_history');
        return saved ? JSON.parse(saved) : [];
    }

    /**
     * Utilities
     */
    generateAlertId() {
        return 'alert_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    formatVolume(volume) {
        if (volume >= 1000000) return (volume / 1000000).toFixed(1) + 'M';
        if (volume >= 1000) return (volume / 1000).toFixed(1) + 'K';
        return volume.toString();
    }
}

// Export for use in main app
if (typeof window !== 'undefined') {
    window.TradingAlertSystem = TradingAlertSystem;
}
