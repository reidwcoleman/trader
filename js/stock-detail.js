// Stock Detail Page JavaScript
// Handles individual stock information, charts, trading, and news

// Configuration
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3001'
    : 'https://trader-umh8.onrender.com';

// Global State
let currentUser = null;
let currentStock = null;
let currentOrderType = 'market';
let stockChart = null;
let chartPeriod = '1M';
let stockData = {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 150.00,
    change: 2.50,
    changePercent: 1.69,
    marketCap: '2.4T',
    peRatio: 24.5,
    weekHigh: 182.94,
    weekLow: 124.17,
    volume: '45.2M',
    avgVolume: '52.1M'
};

// Get stock symbol from URL parameters
function getStockSymbolFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('symbol') || 'AAPL';
}

// Authentication Check
async function checkAuthentication() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/status`, {
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (!data.authenticated) {
            window.location.href = 'signin.html';
            return false;
        }
        
        currentUser = data.user;
        updateUserInfo();
        return true;
    } catch (error) {
        console.error('Authentication check failed:', error);
        window.location.href = 'signin.html';
        return false;
    }
}

// Update user info in header
function updateUserInfo() {
    if (currentUser) {
        const userMenu = document.getElementById('userMenu');
        userMenu.textContent = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U';
        
        // Load buying power
        loadBuyingPower();
    }
}

// Load buying power
async function loadBuyingPower() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/portfolio/${currentUser.id}`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            const portfolio = await response.json();
            document.getElementById('buyingPower').textContent = formatCurrency(portfolio.cash || 100000);
        }
    } catch (error) {
        console.error('Error loading buying power:', error);
    }
}

// Load Stock Data
async function loadStockData(symbol) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/stocks/quote?symbol=${symbol}`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            stockData = {
                symbol: data.symbol || symbol,
                name: data.name || `${symbol} Inc.`,
                price: data.price || (Math.random() * 200 + 50),
                change: data.change || (Math.random() * 10 - 5),
                changePercent: data.changePercent || ((data.change || 0) / (data.price || 100) * 100),
                marketCap: data.marketCap || '1.2T',
                peRatio: data.peRatio || (Math.random() * 40 + 10).toFixed(1),
                weekHigh: data.weekHigh || ((data.price || 100) * 1.3),
                weekLow: data.weekLow || ((data.price || 100) * 0.7),
                volume: data.volume || '25.3M',
                avgVolume: data.avgVolume || '30.1M'
            };
        } else {
            // Use mock data
            generateMockStockData(symbol);
        }
        
        updateStockDisplay();
        await loadStockChart();
        updateOrderBook();
    } catch (error) {
        console.error('Error loading stock data:', error);
        generateMockStockData(symbol);
        updateStockDisplay();
        await loadStockChart();
        updateOrderBook();
    }
}

// Generate mock stock data
function generateMockStockData(symbol) {
    const basePrice = Math.random() * 200 + 50;
    const change = Math.random() * 20 - 10;
    
    stockData = {
        symbol: symbol.toUpperCase(),
        name: `${symbol.toUpperCase()} Corporation`,
        price: basePrice,
        change: change,
        changePercent: (change / basePrice * 100),
        marketCap: `${(Math.random() * 3 + 0.5).toFixed(1)}T`,
        peRatio: (Math.random() * 40 + 10).toFixed(1),
        weekHigh: basePrice * (1.2 + Math.random() * 0.3),
        weekLow: basePrice * (0.6 + Math.random() * 0.2),
        volume: `${(Math.random() * 80 + 20).toFixed(1)}M`,
        avgVolume: `${(Math.random() * 60 + 30).toFixed(1)}M`
    };
}

// Update Stock Display
function updateStockDisplay() {
    document.getElementById('stockSymbol').textContent = stockData.symbol;
    document.getElementById('stockName').textContent = stockData.name;
    document.getElementById('currentPrice').textContent = formatCurrency(stockData.price);
    
    // Price change
    const priceChangeElement = document.getElementById('priceChange');
    const changeText = `${stockData.change >= 0 ? '+' : ''}${formatCurrency(stockData.change)} (${stockData.changePercent.toFixed(2)}%)`;
    priceChangeElement.textContent = changeText;
    priceChangeElement.className = `price-change ${stockData.change >= 0 ? 'positive' : 'negative'}`;
    
    // Metrics
    document.getElementById('marketCap').textContent = stockData.marketCap;
    document.getElementById('peRatio').textContent = stockData.peRatio;
    document.getElementById('weekHigh').textContent = formatCurrency(stockData.weekHigh);
    document.getElementById('weekLow').textContent = formatCurrency(stockData.weekLow);
    document.getElementById('volume').textContent = stockData.volume;
    document.getElementById('avgVolume').textContent = stockData.avgVolume;
    
    // Update page title
    document.title = `${stockData.symbol} - ${formatCurrency(stockData.price)} | FinClash`;
    
    // Update estimated cost
    updateEstimatedCost();
}

// Load Stock Chart
async function loadStockChart() {
    const ctx = document.getElementById('stockChart');
    if (!ctx) return;
    
    // Destroy existing chart
    if (stockChart) {
        stockChart.destroy();
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/stocks/chart?symbol=${stockData.symbol}&period=${chartPeriod}`, {
            credentials: 'include'
        });
        
        let chartData;
        if (response.ok) {
            chartData = await response.json();
        } else {
            chartData = generateMockChartData();
        }
        
        createStockChart(ctx, chartData);
    } catch (error) {
        console.error('Error loading chart:', error);
        const chartData = generateMockChartData();
        createStockChart(ctx, chartData);
    }
}

// Generate mock chart data
function generateMockChartData() {
    const days = getPeriodDays(chartPeriod);
    const data = [];
    const labels = [];
    let basePrice = stockData.price;
    
    for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString());
        
        basePrice += (Math.random() - 0.5) * (stockData.price * 0.02);
        data.push(basePrice);
    }
    
    // Ensure current price is the last value
    data[data.length - 1] = stockData.price;
    
    return { labels, data };
}

// Get number of days for chart period
function getPeriodDays(period) {
    const periodMap = {
        '1D': 1,
        '5D': 5,
        '1M': 30,
        '3M': 90,
        '6M': 180,
        '1Y': 365,
        '5Y': 1825
    };
    return periodMap[period] || 30;
}

// Create stock chart
function createStockChart(ctx, chartData) {
    const isPositive = stockData.change >= 0;
    
    stockChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: stockData.symbol,
                data: chartData.data,
                borderColor: isPositive ? '#00e676' : '#ff1744',
                backgroundColor: isPositive ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255, 23, 68, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 8,
                pointBackgroundColor: isPositive ? '#00e676' : '#ff1744',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: isPositive ? '#00e676' : '#ff1744',
                    borderWidth: 1,
                    displayColors: false,
                    callbacks: {
                        title: function(context) {
                            return context[0].label;
                        },
                        label: function(context) {
                            return `${stockData.symbol}: ${formatCurrency(context.parsed.y)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#888',
                        maxTicksLimit: 8
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#888',
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Set chart period
function setChartPeriod(period) {
    chartPeriod = period;
    
    // Update button states
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    loadStockChart();
}

// Update Order Book
function updateOrderBook() {
    const currentPrice = stockData.price;
    const spread = currentPrice * 0.001; // 0.1% spread
    
    // Update current price
    document.getElementById('orderBookPrice').textContent = formatCurrency(currentPrice);
    
    // Generate asks (sell orders above current price)
    const asksContainer = document.getElementById('orderBookAsks');
    asksContainer.innerHTML = '';
    
    for (let i = 3; i >= 1; i--) {
        const price = currentPrice + (spread * i);
        const size = Math.floor(Math.random() * 2000) + 500;
        const total = price * size;
        
        const row = document.createElement('div');
        row.className = 'order-row';
        row.innerHTML = `
            <span class="ask-price">${formatCurrency(price)}</span>
            <span>${size.toLocaleString()}</span>
            <span>${formatCurrency(total)}</span>
        `;
        asksContainer.appendChild(row);
    }
    
    // Generate bids (buy orders below current price)
    const bidsContainer = document.getElementById('orderBookBids');
    bidsContainer.innerHTML = '';
    
    for (let i = 1; i <= 3; i++) {
        const price = currentPrice - (spread * i);
        const size = Math.floor(Math.random() * 2000) + 500;
        const total = price * size;
        
        const row = document.createElement('div');
        row.className = 'order-row';
        row.innerHTML = `
            <span class="bid-price">${formatCurrency(price)}</span>
            <span>${size.toLocaleString()}</span>
            <span>${formatCurrency(total)}</span>
        `;
        bidsContainer.appendChild(row);
    }
}

// Load Stock News
async function loadStockNews() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/news/stock?symbol=${stockData.symbol}`, {
            credentials: 'include'
        });
        
        let news;
        if (response.ok) {
            news = await response.json();
        } else {
            news = generateMockNews();
        }
        
        displayNews(news);
    } catch (error) {
        console.error('Error loading news:', error);
        displayNews(generateMockNews());
    }
}

// Generate mock news
function generateMockNews() {
    const newsTemplates = [
        {
            title: `${stockData.symbol} Reports Strong Q3 Earnings`,
            summary: `${stockData.symbol} exceeded analyst expectations with strong revenue growth and improved margins.`,
            source: 'Financial Times',
            time: '2 hours ago'
        },
        {
            title: `Analysts Upgrade ${stockData.symbol} Price Target`,
            summary: 'Multiple analysts have raised their price targets following recent positive developments.',
            source: 'Bloomberg',
            time: '4 hours ago'
        },
        {
            title: `${stockData.symbol} Announces New Product Launch`,
            summary: 'Company unveils innovative new product line expected to drive future growth.',
            source: 'Reuters',
            time: '6 hours ago'
        },
        {
            title: `Market Volatility Affects ${stockData.symbol} Trading`,
            summary: 'Recent market conditions have led to increased volatility in stock price.',
            source: 'MarketWatch',
            time: '8 hours ago'
        },
        {
            title: `${stockData.symbol} CEO Discusses Company Strategy`,
            summary: 'Leadership outlines vision for the next fiscal year in recent investor call.',
            source: 'CNBC',
            time: '1 day ago'
        }
    ];
    
    return newsTemplates;
}

// Display news
function displayNews(news) {
    const newsSection = document.getElementById('newsSection');
    
    if (news.length === 0) {
        newsSection.innerHTML = `
            <div style="text-align: center; color: #888; padding: 40px;">
                <p>No news available</p>
            </div>
        `;
        return;
    }
    
    const newsHTML = news.map(item => `
        <div class="news-item" onclick="openNews('${item.url || '#'}')">
            <div class="news-title">${item.title}</div>
            <div class="news-summary">${item.summary}</div>
            <div class="news-meta">
                <span>${item.source}</span>
                <span>${item.time}</span>
            </div>
        </div>
    `).join('');
    
    newsSection.innerHTML = newsHTML;
}

// Trading Functions
function setOrderType(type) {
    currentOrderType = type;
    
    // Update button styles
    document.querySelectorAll('.order-type-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Show/hide limit price input
    const limitPriceGroup = document.getElementById('limitPriceGroup');
    if (type === 'limit') {
        limitPriceGroup.style.display = 'block';
        document.getElementById('limitPrice').required = true;
        document.getElementById('limitPrice').value = stockData.price.toFixed(2);
    } else {
        limitPriceGroup.style.display = 'none';
        document.getElementById('limitPrice').required = false;
    }
    
    updateEstimatedCost();
}

// Update estimated cost
function updateEstimatedCost() {
    const shares = parseInt(document.getElementById('tradeShares').value) || 1;
    const price = currentOrderType === 'limit' 
        ? parseFloat(document.getElementById('limitPrice').value) || stockData.price
        : stockData.price;
    
    const cost = shares * price;
    document.getElementById('estimatedCost').textContent = formatCurrency(cost);
}

// Handle stock trade
async function handleStockTrade(event) {
    event.preventDefault();
    
    const shares = parseInt(document.getElementById('tradeShares').value);
    const action = event.submitter.dataset.action;
    const limitPrice = document.getElementById('limitPrice').value;
    
    if (!shares || shares < 1) {
        showToast('Please enter valid number of shares', 'error');
        return;
    }
    
    try {
        const tradeData = {
            userId: currentUser.id,
            symbol: stockData.symbol,
            shares,
            action,
            orderType: currentOrderType,
            limitPrice: currentOrderType === 'limit' ? parseFloat(limitPrice) : null,
            currentPrice: stockData.price
        };
        
        const response = await fetch(`${API_BASE_URL}/api/trades`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(tradeData)
        });
        
        if (response.ok) {
            const result = await response.json();
            showToast(`${action.toUpperCase()} order placed for ${shares} shares of ${stockData.symbol}`, 'success');
            
            // Reset form
            document.getElementById('tradeShares').value = '';
            updateEstimatedCost();
            
            // Update buying power
            loadBuyingPower();
        } else {
            const error = await response.json();
            showToast(error.message || 'Trade failed', 'error');
        }
    } catch (error) {
        console.error('Trade error:', error);
        showToast('Error placing trade', 'error');
    }
}

// Event Listeners
document.getElementById('tradeShares').addEventListener('input', updateEstimatedCost);
document.getElementById('limitPrice').addEventListener('input', updateEstimatedCost);

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#00e676' : type === 'error' ? '#ff1744' : '#00bfff'};
        color: ${type === 'success' ? '#000' : '#fff'};
        padding: 16px 24px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

function toggleUserMenu() {
    if (confirm('Sign out?')) {
        logout();
    }
}

async function logout() {
    try {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout error:', error);
        window.location.href = 'index.html';
    }
}

function openNews(url) {
    if (url && url !== '#') {
        window.open(url, '_blank');
    }
}

function loadMoreNews() {
    showToast('Loading more news...', 'info');
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize Stock Detail Page
async function initStockDetail() {
    const isAuthenticated = await checkAuthentication();
    
    if (isAuthenticated) {
        const symbol = getStockSymbolFromURL();
        await loadStockData(symbol);
        await loadStockNews();
        
        // Start real-time updates
        setInterval(() => {
            updateOrderBook();
        }, 10000); // Update order book every 10 seconds
        
        setInterval(() => {
            // Simulate price updates
            if (Math.random() < 0.3) { // 30% chance of price change
                const changePercent = (Math.random() - 0.5) * 0.02; // ±1% change
                stockData.price += stockData.price * changePercent;
                stockData.change += stockData.price * changePercent;
                stockData.changePercent = (stockData.change / (stockData.price - stockData.change)) * 100;
                
                updateStockDisplay();
                updateOrderBook();
            }
        }, 5000); // Check for updates every 5 seconds
    }
}

// Start the page when DOM loads
document.addEventListener('DOMContentLoaded', initStockDetail);