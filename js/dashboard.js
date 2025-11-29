// Trading Dashboard Main JavaScript
// Handles authentication, real-time data, portfolio management, and trading

// Configuration
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3001'
    : 'https://trader-umh8.onrender.com';

// Global State
let currentUser = null;
let portfolioData = null;
let watchlistData = [];
let holdingsData = [];
let activityData = [];
let currentOrderType = 'market';
let portfolioChart = null;

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
        
        // Update market status
        updateMarketStatus();
    }
}

// Update market status
function updateMarketStatus() {
    const now = new Date();
    const hours = now.getHours();
    const day = now.getDay();
    
    // Market is open Monday-Friday 9:30 AM - 4:00 PM ET
    // This is simplified - real implementation would handle holidays and exact timezone
    const isWeekday = day >= 1 && day <= 5;
    const isMarketHours = hours >= 9 && hours < 16;
    const isOpen = isWeekday && isMarketHours;
    
    const statusElement = document.getElementById('marketStatus');
    const indicator = statusElement.querySelector('.status-indicator');
    const text = statusElement.querySelector('.status-text');
    
    if (isOpen) {
        indicator.classList.remove('closed');
        text.textContent = 'Market Open';
    } else {
        indicator.classList.add('closed');
        text.textContent = 'Market Closed';
    }
}

// Load Portfolio Data
async function loadPortfolioData() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/portfolio/${currentUser.id}`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            portfolioData = await response.json();
            updatePortfolioDisplay();
        } else {
            // Initialize empty portfolio
            portfolioData = {
                totalValue: 100000, // Starting cash
                cash: 100000,
                holdings: [],
                todayReturn: 0,
                totalReturn: 0,
                todayReturnPercent: 0,
                totalReturnPercent: 0
            };
            updatePortfolioDisplay();
        }
    } catch (error) {
        console.error('Error loading portfolio:', error);
        showToast('Error loading portfolio data', 'error');
    }
}

// Update Portfolio Display
function updatePortfolioDisplay() {
    if (!portfolioData) return;
    
    // Update stats
    document.getElementById('totalValue').textContent = formatCurrency(portfolioData.totalValue);
    document.getElementById('buyingPower').textContent = formatCurrency(portfolioData.cash);
    
    // Today's return
    const todayReturn = document.getElementById('todayReturn');
    const todayPercent = document.getElementById('todayPercent');
    todayReturn.textContent = formatCurrency(portfolioData.todayReturn);
    todayPercent.textContent = `(${portfolioData.todayReturnPercent.toFixed(2)}%)`;
    todayReturn.className = `stat-value ${portfolioData.todayReturn >= 0 ? 'positive' : 'negative'}`;
    todayPercent.className = `stat-change ${portfolioData.todayReturn >= 0 ? 'positive' : 'negative'}`;
    
    // Total return
    const totalReturn = document.getElementById('totalReturn');
    const totalPercent = document.getElementById('totalPercent');
    totalReturn.textContent = formatCurrency(portfolioData.totalReturn);
    totalPercent.textContent = `(${portfolioData.totalReturnPercent.toFixed(2)}%)`;
    totalReturn.className = `stat-value ${portfolioData.totalReturn >= 0 ? 'positive' : 'negative'}`;
    totalPercent.className = `stat-change ${portfolioData.totalReturn >= 0 ? 'positive' : 'negative'}`;
    
    // Total change
    const totalChange = document.getElementById('totalChange');
    const totalChangeValue = portfolioData.todayReturn;
    totalChange.textContent = `${formatCurrency(totalChangeValue)} (${portfolioData.todayReturnPercent.toFixed(2)}%)`;
    totalChange.className = `stat-change ${totalChangeValue >= 0 ? 'positive' : 'negative'}`;
    
    // Update holdings
    updateHoldingsDisplay();
    
    // Update chart
    updatePortfolioChart();
}

// Update Holdings Display
function updateHoldingsDisplay() {
    const holdingsList = document.getElementById('holdings-list');
    
    if (!portfolioData.holdings || portfolioData.holdings.length === 0) {
        holdingsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📈</div>
                <h3>No holdings yet</h3>
                <p>Start trading to build your portfolio</p>
                <button class="btn-primary empty-action" onclick="document.getElementById('tradeSymbol').focus()">
                    Start Trading
                </button>
            </div>
        `;
        return;
    }
    
    const holdingsHTML = portfolioData.holdings.map(holding => {
        const totalValue = holding.shares * holding.currentPrice;
        const gainLoss = totalValue - (holding.shares * holding.avgCost);
        const gainLossPercent = ((holding.currentPrice - holding.avgCost) / holding.avgCost * 100);
        
        return `
            <div class="watchlist-item" onclick="viewStock('${holding.symbol}')">
                <div class="stock-info">
                    <div class="stock-symbol">${holding.symbol}</div>
                    <div class="stock-name">${holding.shares} shares</div>
                </div>
                <div class="stock-price-info">
                    <div class="stock-price">${formatCurrency(totalValue)}</div>
                    <div class="stock-change ${gainLoss >= 0 ? 'positive' : 'negative'}">
                        ${formatCurrency(gainLoss)} (${gainLossPercent.toFixed(2)}%)
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    holdingsList.innerHTML = holdingsHTML;
}

// Load Watchlist
async function loadWatchlist() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/watchlist/${currentUser.id}`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            watchlistData = await response.json();
        } else {
            // Default watchlist
            watchlistData = [
                { symbol: 'AAPL', name: 'Apple Inc.' },
                { symbol: 'NVDA', name: 'NVIDIA Corporation' },
                { symbol: 'MSFT', name: 'Microsoft Corporation' },
                { symbol: 'GOOGL', name: 'Alphabet Inc.' },
                { symbol: 'TSLA', name: 'Tesla, Inc.' }
            ];
        }
        
        await updateWatchlistPrices();
    } catch (error) {
        console.error('Error loading watchlist:', error);
        showToast('Error loading watchlist', 'error');
    }
}

// Update Watchlist Prices
async function updateWatchlistPrices() {
    const watchlistContainer = document.getElementById('watchlist');
    
    if (watchlistData.length === 0) {
        watchlistContainer.innerHTML = `
            <div style="text-align: center; color: #888; padding: 40px;">
                <p>Your watchlist is empty</p>
                <button onclick="addToWatchlist()" class="panel-action" style="margin-top: 16px;">Add Stocks</button>
            </div>
        `;
        return;
    }
    
    // Show loading state
    watchlistContainer.innerHTML = watchlistData.map(stock => `
        <div class="watchlist-item">
            <div class="stock-info">
                <div class="stock-symbol">${stock.symbol}</div>
                <div class="stock-name">${stock.name}</div>
            </div>
            <div class="stock-price-info">
                <div class="stock-price">Loading...</div>
                <div class="stock-change">--</div>
            </div>
        </div>
    `).join('');
    
    // Fetch real prices
    try {
        const symbols = watchlistData.map(stock => stock.symbol).join(',');
        const response = await fetch(`${API_BASE_URL}/api/stocks/quotes?symbols=${symbols}`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            const quotes = await response.json();
            displayWatchlistWithPrices(quotes);
        } else {
            displayWatchlistWithMockPrices();
        }
    } catch (error) {
        console.error('Error fetching prices:', error);
        displayWatchlistWithMockPrices();
    }
}

// Display Watchlist with Prices
function displayWatchlistWithPrices(quotes) {
    const watchlistContainer = document.getElementById('watchlist');
    
    const watchlistHTML = watchlistData.map(stock => {
        const quote = quotes[stock.symbol] || {};
        const price = quote.price || (Math.random() * 200 + 50);
        const change = quote.change || (Math.random() * 10 - 5);
        const changePercent = quote.changePercent || (change / price * 100);
        
        return `
            <div class="watchlist-item" onclick="selectStockForTrade('${stock.symbol}', ${price})">
                <div class="stock-info">
                    <div class="stock-symbol">${stock.symbol}</div>
                    <div class="stock-name">${stock.name}</div>
                </div>
                <div class="stock-price-info">
                    <div class="stock-price">${formatCurrency(price)}</div>
                    <div class="stock-change ${change >= 0 ? 'positive' : 'negative'}">
                        ${change >= 0 ? '+' : ''}${formatCurrency(change)} (${changePercent.toFixed(2)}%)
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    watchlistContainer.innerHTML = watchlistHTML;
}

// Display Watchlist with Mock Prices
function displayWatchlistWithMockPrices() {
    const watchlistContainer = document.getElementById('watchlist');
    
    const watchlistHTML = watchlistData.map(stock => {
        const price = Math.random() * 200 + 50;
        const change = Math.random() * 10 - 5;
        const changePercent = change / price * 100;
        
        return `
            <div class="watchlist-item" onclick="selectStockForTrade('${stock.symbol}', ${price})">
                <div class="stock-info">
                    <div class="stock-symbol">${stock.symbol}</div>
                    <div class="stock-name">${stock.name}</div>
                </div>
                <div class="stock-price-info">
                    <div class="stock-price">${formatCurrency(price)}</div>
                    <div class="stock-change ${change >= 0 ? 'positive' : 'negative'}">
                        ${change >= 0 ? '+' : ''}${formatCurrency(change)} (${changePercent.toFixed(2)}%)
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    watchlistContainer.innerHTML = watchlistHTML;
}

// Load Recent Activity
async function loadRecentActivity() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/activity/${currentUser.id}`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            activityData = await response.json();
        } else {
            activityData = [];
        }
        
        updateActivityDisplay();
    } catch (error) {
        console.error('Error loading activity:', error);
        updateActivityDisplay();
    }
}

// Update Activity Display
function updateActivityDisplay() {
    const activityContainer = document.getElementById('recent-activity');
    
    if (activityData.length === 0) {
        activityContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📋</div>
                <h3>No activity yet</h3>
                <p>Your trades will appear here</p>
            </div>
        `;
        return;
    }
    
    const activityHTML = activityData.slice(0, 5).map(activity => {
        const isPositive = activity.type === 'buy' ? false : true;
        return `
            <div class="activity-item">
                <div class="activity-info">
                    <div class="activity-action">
                        ${activity.type.toUpperCase()} ${activity.shares} ${activity.symbol}
                    </div>
                    <div class="activity-time">
                        ${new Date(activity.timestamp).toLocaleDateString()}
                    </div>
                </div>
                <div class="activity-amount ${isPositive ? 'positive' : 'negative'}">
                    ${activity.type === 'buy' ? '-' : '+'}${formatCurrency(Math.abs(activity.amount))}
                </div>
            </div>
        `;
    }).join('');
    
    activityContainer.innerHTML = activityHTML;
}

// Portfolio Chart
function updatePortfolioChart() {
    const ctx = document.getElementById('portfolioChart');
    if (!ctx) return;
    
    // Destroy existing chart
    if (portfolioChart) {
        portfolioChart.destroy();
    }
    
    // Generate sample data for the chart
    const days = 30;
    const data = [];
    const labels = [];
    let baseValue = 95000;
    
    for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString());
        
        baseValue += (Math.random() - 0.5) * 2000;
        data.push(baseValue);
    }
    
    // Set final value to current portfolio value
    data[data.length - 1] = portfolioData.totalValue;
    
    portfolioChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Portfolio Value',
                data: data,
                borderColor: '#00e676',
                backgroundColor: 'rgba(0, 230, 118, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    display: false,
                    grid: {
                        display: false
                    }
                },
                y: {
                    display: false,
                    grid: {
                        display: false
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
    } else {
        limitPriceGroup.style.display = 'none';
        document.getElementById('limitPrice').required = false;
    }
}

function selectStockForTrade(symbol, price) {
    document.getElementById('tradeSymbol').value = symbol;
    if (currentOrderType === 'limit') {
        document.getElementById('limitPrice').value = price.toFixed(2);
    }
}

async function handleQuickTrade(event) {
    event.preventDefault();
    
    const symbol = document.getElementById('tradeSymbol').value.toUpperCase();
    const shares = parseInt(document.getElementById('tradeShares').value);
    const action = event.submitter.dataset.action;
    const limitPrice = document.getElementById('limitPrice').value;
    
    if (!symbol || !shares || shares < 1) {
        showToast('Please enter valid trade details', 'error');
        return;
    }
    
    try {
        const tradeData = {
            userId: currentUser.id,
            symbol,
            shares,
            action,
            orderType: currentOrderType,
            limitPrice: currentOrderType === 'limit' ? parseFloat(limitPrice) : null
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
            showToast(`${action.toUpperCase()} order placed for ${shares} shares of ${symbol}`, 'success');
            
            // Reset form
            event.target.reset();
            
            // Reload data
            await loadPortfolioData();
            await loadRecentActivity();
        } else {
            const error = await response.json();
            showToast(error.message || 'Trade failed', 'error');
        }
    } catch (error) {
        console.error('Trade error:', error);
        showToast('Error placing trade', 'error');
    }
}

// Navigation Functions
function switchTab(tab) {
    // Update active tab
    document.querySelectorAll('.nav-tab').forEach(tabEl => {
        tabEl.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Switch views based on tab
    switch(tab) {
        case 'portfolio':
            // Already showing portfolio view
            break;
        case 'markets':
            window.location.href = 'markets.html';
            break;
        case 'research':
            window.location.href = 'research.html';
            break;
        case 'learn':
            window.location.href = 'learning.html';
            break;
    }
}

function toggleUserMenu() {
    // TODO: Implement user menu dropdown
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

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function showToast(message, type = 'info') {
    // Create toast element
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
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Action Functions
function addToWatchlist() {
    const symbol = prompt('Enter stock symbol to add to watchlist:');
    if (symbol) {
        const upperSymbol = symbol.toUpperCase();
        if (!watchlistData.some(stock => stock.symbol === upperSymbol)) {
            watchlistData.push({
                symbol: upperSymbol,
                name: `${upperSymbol} Inc.`
            });
            updateWatchlistPrices();
            showToast(`${upperSymbol} added to watchlist`, 'success');
        } else {
            showToast('Stock already in watchlist', 'error');
        }
    }
}

function viewStock(symbol) {
    window.location.href = `stock-detail.html?symbol=${symbol}`;
}

function viewFullPortfolio() {
    // TODO: Navigate to full portfolio view
    showToast('Opening full portfolio...', 'info');
}

function manageHoldings() {
    // TODO: Open holdings management
    showToast('Opening holdings management...', 'info');
}

function viewAllActivity() {
    // TODO: Navigate to activity history
    showToast('Opening activity history...', 'info');
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

// Initialize Dashboard
async function initDashboard() {
    const isAuthenticated = await checkAuthentication();
    
    if (isAuthenticated) {
        // Load all data in parallel
        await Promise.all([
            loadPortfolioData(),
            loadWatchlist(),
            loadRecentActivity()
        ]);
        
        // Start real-time updates
        setInterval(() => {
            updateWatchlistPrices();
        }, 30000); // Update every 30 seconds
    }
}

// Start the dashboard when page loads
document.addEventListener('DOMContentLoaded', initDashboard);