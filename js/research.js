// Research Page JavaScript
// Handles stock screening, analyst ratings, earnings calendar, and stock comparison

// Configuration
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3001'
    : 'https://trader-umh8.onrender.com';

// Global State
let currentUser = null;
let screenerResults = [];
let analystRatings = [];
let earningsCalendar = [];
let comparedStocks = ['AAPL', 'MSFT'];

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

// Load Research Data
async function loadResearchData() {
    try {
        await Promise.all([
            loadScreenerData(),
            loadAnalystRatings(),
            loadEarningsCalendar()
        ]);
    } catch (error) {
        console.error('Error loading research data:', error);
        showToast('Error loading research data', 'error');
    }
}

// Load screener data
async function loadScreenerData() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/research/screener`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            screenerResults = await response.json();
        } else {
            // Generate mock screener data
            screenerResults = generateMockScreenerData();
        }
    } catch (error) {
        console.error('Error loading screener data:', error);
        screenerResults = generateMockScreenerData();
    }
}

// Generate mock screener data
function generateMockScreenerData() {
    const stocks = [
        { symbol: 'AAPL', name: 'Apple Inc', price: 182.52, pe: 28.4, marketCap: 2800000000000 },
        { symbol: 'MSFT', name: 'Microsoft Corp', price: 384.30, pe: 32.1, marketCap: 2900000000000 },
        { symbol: 'GOOGL', name: 'Alphabet Inc', price: 138.21, pe: 25.8, marketCap: 1750000000000 },
        { symbol: 'NVDA', name: 'NVIDIA Corp', price: 485.20, pe: 64.2, marketCap: 1200000000000 },
        { symbol: 'TSLA', name: 'Tesla Inc', price: 242.80, pe: 42.6, marketCap: 770000000000 },
        { symbol: 'META', name: 'Meta Platforms', price: 325.50, pe: 23.1, marketCap: 825000000000 },
        { symbol: 'AMZN', name: 'Amazon.com Inc', price: 145.20, pe: 45.8, marketCap: 1500000000000 }
    ];
    
    return stocks;
}

// Load analyst ratings
async function loadAnalystRatings() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/research/ratings`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            analystRatings = await response.json();
        } else {
            // Generate mock ratings data
            analystRatings = [
                { symbol: 'AAPL', rating: 'buy', priceTarget: 195.00, currentPrice: 182.52 },
                { symbol: 'MSFT', rating: 'buy', priceTarget: 420.00, currentPrice: 384.30 },
                { symbol: 'META', rating: 'hold', priceTarget: 330.00, currentPrice: 325.50 },
                { symbol: 'NFLX', rating: 'sell', priceTarget: 380.00, currentPrice: 414.20 }
            ];
        }
    } catch (error) {
        console.error('Error loading analyst ratings:', error);
        analystRatings = [];
    }
}

// Load earnings calendar
async function loadEarningsCalendar() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/research/earnings`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            earningsCalendar = await response.json();
        } else {
            // Generate mock earnings data
            earningsCalendar = [
                { symbol: 'AAPL', event: 'Q4 2024 Earnings', date: 'Nov 2' },
                { symbol: 'GOOGL', event: 'Q3 2024 Earnings', date: 'Oct 29' },
                { symbol: 'MSFT', event: 'Q1 2025 Earnings', date: 'Jan 25' },
                { symbol: 'AMZN', event: 'Q4 2024 Earnings', date: 'Feb 1' },
                { symbol: 'TSLA', event: 'Q4 2024 Earnings', date: 'Jan 18' }
            ];
        }
    } catch (error) {
        console.error('Error loading earnings calendar:', error);
        earningsCalendar = [];
    }
}

// Stock Screener Functions
function runScreener() {
    const filters = {
        minMarketCap: parseFloat(document.getElementById('minMarketCap').value) || 0,
        maxMarketCap: parseFloat(document.getElementById('maxMarketCap').value) || Infinity,
        minPE: parseFloat(document.getElementById('minPE').value) || 0,
        maxPE: parseFloat(document.getElementById('maxPE').value) || Infinity,
        minPrice: parseFloat(document.getElementById('minPrice').value) || 0,
        maxPrice: parseFloat(document.getElementById('maxPrice').value) || Infinity,
        minVolume: parseFloat(document.getElementById('minVolume').value) || 0,
        maxVolume: parseFloat(document.getElementById('maxVolume').value) || Infinity
    };
    
    const filteredResults = screenerResults.filter(stock => {
        return stock.marketCap >= filters.minMarketCap &&
               stock.marketCap <= filters.maxMarketCap &&
               stock.pe >= filters.minPE &&
               stock.pe <= filters.maxPE &&
               stock.price >= filters.minPrice &&
               stock.price <= filters.maxPrice;
    });
    
    updateScreenerResults(filteredResults);
    showToast(`Found ${filteredResults.length} stocks matching criteria`, 'success');
}

// Update screener results display
function updateScreenerResults(results) {
    const container = document.getElementById('screenerResults');
    
    if (results.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; color: #888; padding: 40px;">
                <p>No stocks match your criteria</p>
                <p style="font-size: 14px;">Try adjusting your filters</p>
            </div>
        `;
        return;
    }
    
    const resultsHTML = results.map(stock => `
        <div class="result-item" onclick="viewStock('${stock.symbol}')">
            <div class="result-info">
                <h4>${stock.symbol}</h4>
                <p>${stock.name}</p>
            </div>
            <div class="result-metrics">
                <div class="result-price">${formatCurrency(stock.price)}</div>
                <div class="result-pe">P/E: ${stock.pe}</div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = resultsHTML;
}

// Stock Comparison Functions
function addComparison() {
    const symbol = prompt('Enter stock symbol to compare:');
    if (symbol && !comparedStocks.includes(symbol.toUpperCase())) {
        comparedStocks.push(symbol.toUpperCase());
        updateComparisonDisplay();
        showToast(`${symbol.toUpperCase()} added to comparison`, 'success');
    } else if (symbol && comparedStocks.includes(symbol.toUpperCase())) {
        showToast('Stock already in comparison', 'error');
    }
}

function removeComparison(symbol) {
    const index = comparedStocks.indexOf(symbol);
    if (index > -1) {
        comparedStocks.splice(index, 1);
        updateComparisonDisplay();
        showToast(`${symbol} removed from comparison`, 'info');
    }
}

function clearComparison() {
    comparedStocks = [];
    updateComparisonDisplay();
    showToast('Comparison cleared', 'info');
}

// Update comparison display
function updateComparisonDisplay() {
    const container = document.getElementById('comparisonGrid');
    
    const comparisonHTML = comparedStocks.map(symbol => {
        const mockData = getMockStockData(symbol);
        return `
            <div class="comparison-stock">
                <button class="comparison-remove" onclick="removeComparison('${symbol}')">×</button>
                <div class="comparison-symbol">${symbol}</div>
                <div class="comparison-metrics">
                    <div class="comparison-metric">
                        <span class="comparison-metric-label">Price</span>
                        <span class="comparison-metric-value">${formatCurrency(mockData.price)}</span>
                    </div>
                    <div class="comparison-metric">
                        <span class="comparison-metric-label">P/E</span>
                        <span class="comparison-metric-value">${mockData.pe}</span>
                    </div>
                    <div class="comparison-metric">
                        <span class="comparison-metric-label">Market Cap</span>
                        <span class="comparison-metric-value">${formatMarketCap(mockData.marketCap)}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    const addButton = `
        <div class="add-comparison" onclick="addComparison()">
            <div class="add-icon">+</div>
            <div class="add-text">Add Stock</div>
        </div>
    `;
    
    container.innerHTML = comparisonHTML + addButton;
}

// Get mock stock data
function getMockStockData(symbol) {
    const mockData = {
        'AAPL': { price: 182.52, pe: 28.4, marketCap: 2800000000000 },
        'MSFT': { price: 384.30, pe: 32.1, marketCap: 2900000000000 },
        'GOOGL': { price: 138.21, pe: 25.8, marketCap: 1750000000000 },
        'NVDA': { price: 485.20, pe: 64.2, marketCap: 1200000000000 },
        'TSLA': { price: 242.80, pe: 42.6, marketCap: 770000000000 }
    };
    
    return mockData[symbol] || {
        price: Math.random() * 300 + 50,
        pe: Math.random() * 40 + 10,
        marketCap: Math.random() * 1000000000000 + 100000000000
    };
}

// Navigation Functions
function switchTab(tab) {
    switch(tab) {
        case 'portfolio':
            window.location.href = 'dashboard.html';
            break;
        case 'markets':
            window.location.href = 'markets.html';
            break;
        case 'research':
            // Already on research page
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

function viewAllRatings() {
    showToast('Loading all analyst ratings...', 'info');
}

function viewFullCalendar() {
    showToast('Loading full earnings calendar...', 'info');
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
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatMarketCap(amount) {
    if (amount >= 1000000000000) {
        return '$' + (amount / 1000000000000).toFixed(1) + 'T';
    } else if (amount >= 1000000000) {
        return '$' + (amount / 1000000000).toFixed(1) + 'B';
    } else if (amount >= 1000000) {
        return '$' + (amount / 1000000).toFixed(1) + 'M';
    }
    return formatCurrency(amount);
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

// Initialize Research Page
async function initResearchPage() {
    const isAuthenticated = await checkAuthentication();
    
    if (isAuthenticated) {
        await loadResearchData();
        updateComparisonDisplay();
    }
}

// Start the page when DOM loads
document.addEventListener('DOMContentLoaded', initResearchPage);