// Markets Page JavaScript
// Handles market data, indices, movers, and sector performance

// Configuration
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3001'
    : 'https://trader-umh8.onrender.com';

// Global State
let currentUser = null;
let marketData = {
    indices: {},
    movers: [],
    sectors: {},
    news: []
};

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
        
        // Load buying power
        loadBuyingPower();
    }
}

// Update market status
function updateMarketStatus() {
    const now = new Date();
    const hours = now.getHours();
    const day = now.getDay();
    
    // Market is open Monday-Friday 9:30 AM - 4:00 PM ET
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

// Load Market Data
async function loadMarketData() {
    try {
        // Load indices data
        await loadIndicesData();
        
        // Load market movers
        await loadMoversData();
        
        // Update displays
        updateIndicesDisplay();
        updateMoversDisplay();
        
        // Start real-time updates
        setInterval(updateMarketPrices, 30000); // Update every 30 seconds
        
    } catch (error) {
        console.error('Error loading market data:', error);
        showToast('Error loading market data', 'error');
    }
}

// Load indices data
async function loadIndicesData() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/market/indices`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            marketData.indices = await response.json();
        } else {
            // Generate mock data
            marketData.indices = {
                'SPY': {
                    value: 4150.00 + (Math.random() - 0.5) * 100,
                    change: (Math.random() - 0.5) * 50,
                    name: 'S&P 500'
                },
                'DIA': {
                    value: 34200.00 + (Math.random() - 0.5) * 500,
                    change: (Math.random() - 0.5) * 200,
                    name: 'Dow Jones'
                },
                'QQQ': {
                    value: 12800.00 + (Math.random() - 0.5) * 300,
                    change: (Math.random() - 0.5) * 100,
                    name: 'Nasdaq'
                }
            };
        }
    } catch (error) {
        console.error('Error loading indices:', error);
        // Use mock data as fallback
        marketData.indices = {
            'SPY': { value: 4150.00, change: 18.50, name: 'S&P 500' },
            'DIA': { value: 34200.00, change: -85.20, name: 'Dow Jones' },
            'QQQ': { value: 12800.00, change: 45.30, name: 'Nasdaq' }
        };
    }
}

// Load movers data
async function loadMoversData() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/market/movers`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            marketData.movers = await response.json();
        } else {
            // Generate mock movers data
            const stocks = ['NVDA', 'TSLA', 'META', 'AMZN', 'GOOGL', 'AAPL', 'MSFT', 'AMD', 'NFLX', 'CRM'];
            marketData.movers = stocks.map(symbol => ({
                symbol,
                name: getCompanyName(symbol),
                price: Math.random() * 500 + 50,
                change: (Math.random() - 0.3) * 20, // Bias towards positive
                changePercent: (Math.random() - 0.3) * 15
            })).sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
        }
    } catch (error) {
        console.error('Error loading movers:', error);
        // Use mock data as fallback
        marketData.movers = [
            { symbol: 'NVDA', name: 'NVIDIA Corp', price: 485.20, changePercent: 8.4 },
            { symbol: 'TSLA', name: 'Tesla Inc', price: 242.80, changePercent: 6.2 },
            { symbol: 'META', name: 'Meta Platforms', price: 325.50, changePercent: 4.7 },
            { symbol: 'AMZN', name: 'Amazon.com Inc', price: 145.20, changePercent: -2.3 },
            { symbol: 'GOOGL', name: 'Alphabet Inc', price: 138.70, changePercent: -1.8 }
        ];
    }
}

// Update indices display
function updateIndicesDisplay() {
    Object.keys(marketData.indices).forEach(symbol => {
        const data = marketData.indices[symbol];
        const changePercent = (data.change / (data.value - data.change)) * 100;
        
        // Update value
        const valueElement = document.getElementById(`${symbol.toLowerCase()}-value`);
        if (valueElement) {
            valueElement.textContent = formatNumber(data.value);
        }
        
        // Update change
        const changeElement = document.getElementById(`${symbol.toLowerCase()}-change`);
        if (changeElement) {
            const changeText = `${data.change >= 0 ? '+' : ''}${formatCurrency(data.change)} (${changePercent.toFixed(2)}%)`;
            changeElement.textContent = changeText;
            changeElement.className = `index-change ${data.change >= 0 ? 'positive' : 'negative'}`;
        }
    });
}

// Update movers display
function updateMoversDisplay() {
    const moversContainer = document.getElementById('topMovers');
    if (!moversContainer) return;
    
    const moversHTML = marketData.movers.slice(0, 5).map(mover => {
        const changePercent = mover.changePercent || ((mover.change || 0) / mover.price * 100);
        
        return `
            <div class="mover-item" onclick="viewStock('${mover.symbol}')">
                <div class="mover-info">
                    <h4>${mover.symbol}</h4>
                    <p>${mover.name}</p>
                </div>
                <div class="mover-price">
                    <div class="mover-value">${formatCurrency(mover.price)}</div>
                    <div class="mover-change ${changePercent >= 0 ? 'positive' : 'negative'}">
                        ${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(1)}%
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    moversContainer.innerHTML = moversHTML;
}

// Update market prices (real-time)
async function updateMarketPrices() {
    try {
        await loadIndicesData();
        updateIndicesDisplay();
        
        // Simulate small price movements for movers
        marketData.movers = marketData.movers.map(mover => {
            const priceChange = (Math.random() - 0.5) * mover.price * 0.01; // ±1% max change
            mover.price += priceChange;
            mover.changePercent += priceChange / mover.price * 100;
            return mover;
        });
        
        updateMoversDisplay();
    } catch (error) {
        console.error('Error updating prices:', error);
    }
}

// Navigation Functions
function switchTab(tab) {
    switch(tab) {
        case 'portfolio':
            window.location.href = 'dashboard.html';
            break;
        case 'markets':
            // Already on markets page
            break;
        case 'research':
            window.location.href = 'research.html';
            break;
        case 'learn':
            window.location.href = 'learning.html';
            break;
    }
}

// View functions
function viewStock(symbol) {
    window.location.href = `stock-detail.html?symbol=${symbol}`;
}

function viewIndex(symbol) {
    window.location.href = `stock-detail.html?symbol=${symbol}`;
}

function viewSector(sector) {
    showToast(`Opening ${sector} sector...`, 'info');
}

function viewAllMovers() {
    showToast('Loading all market movers...', 'info');
}

function viewAllNews() {
    showToast('Loading all market news...', 'info');
}

function viewAllSectors() {
    showToast('Loading all sectors...', 'info');
}

function openNews(url) {
    if (url && url !== '#') {
        window.open(url, '_blank');
    } else {
        showToast('News article loading...', 'info');
    }
}

// User functions
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

// Utility Functions
function formatCurrency(amount) {
    if (amount >= 1000000000) {
        return '$' + (amount / 1000000000).toFixed(1) + 'B';
    } else if (amount >= 1000000) {
        return '$' + (amount / 1000000).toFixed(1) + 'M';
    } else if (amount >= 1000) {
        return '$' + (amount / 1000).toFixed(1) + 'K';
    }
    
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatNumber(value) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

function getCompanyName(symbol) {
    const names = {
        'NVDA': 'NVIDIA Corp',
        'TSLA': 'Tesla Inc',
        'META': 'Meta Platforms',
        'AMZN': 'Amazon.com Inc',
        'GOOGL': 'Alphabet Inc',
        'AAPL': 'Apple Inc',
        'MSFT': 'Microsoft Corp',
        'AMD': 'Advanced Micro Devices',
        'NFLX': 'Netflix Inc',
        'CRM': 'Salesforce Inc'
    };
    return names[symbol] || `${symbol} Corp`;
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

// Initialize Markets Page
async function initMarketsPage() {
    const isAuthenticated = await checkAuthentication();
    
    if (isAuthenticated) {
        await loadMarketData();
    }
}

// Start the page when DOM loads
document.addEventListener('DOMContentLoaded', initMarketsPage);