// Professional Unified Navigation System
// Like Robinhood × ThinkorSwim × Webull

/**
 * Navigation Component
 * Handles top bar, sidebar, and mobile bottom nav
 */
class NavigationSystem {
    constructor(config = {}) {
        this.currentView = config.initialView || 'markets';
        this.user = config.user || null;
        this.balance = config.balance || 0;
        this.sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        this.callbacks = {
            onNavigate: config.onNavigate || null,
            onLogout: config.onLogout || null
        };
    }

    /**
     * Render complete navigation system
     */
    render() {
        return `
            ${this.renderTopBar()}
            ${this.renderSidebar()}
            ${this.renderMobileBottomNav()}
            ${this.renderStyles()}
        `;
    }

    /**
     * Top Navigation Bar (Desktop/Tablet/Mobile)
     */
    renderTopBar() {
        const marketStatus = window.TradingViewCharts?.getMarketStatus?.() || { isOpen: false, message: 'Market Closed' };

        return `
            <nav id="top-nav" class="nav-top-bar">
                <!-- Logo & Brand -->
                <div class="nav-brand">
                    <button class="nav-menu-toggle" onclick="navSystem.toggleSidebar()">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>
                    <div class="nav-logo">
                        <span class="nav-logo-text">FinClash</span>
                        <span class="nav-logo-subtitle">TRADING SIMULATOR</span>
                    </div>
                </div>

                <!-- Desktop Navigation Links -->
                <div class="nav-links-desktop">
                    ${this.renderNavLink('markets', '📊', 'Markets')}
                    ${this.renderNavLink('trading', '💹', 'Trading')}
                    ${this.renderNavLink('portfolio', '💼', 'Portfolio')}
                    ${this.renderNavLink('research', '🔍', 'Research')}
                    ${this.renderNavLink('learn', '🎓', 'Learn')}
                </div>

                <!-- Market Status + Balance + Profile -->
                <div class="nav-right">
                    <!-- Market Status Indicator -->
                    <div class="nav-market-status ${marketStatus.isOpen ? 'market-open' : 'market-closed'}" title="${marketStatus.etTime || ''}">
                        <span class="status-dot"></span>
                        <span class="status-text">${marketStatus.message}</span>
                    </div>

                    <!-- Real-Time Balance -->
                    ${this.user ? `
                        <div class="nav-balance" onclick="navSystem.navigate('portfolio')">
                            <span class="balance-label">Portfolio</span>
                            <span class="balance-value">$${this.formatNumber(this.balance)}</span>
                        </div>
                    ` : ''}

                    <!-- User Profile Dropdown -->
                    ${this.user ? this.renderUserDropdown() : this.renderAuthButtons()}
                </div>
            </nav>
        `;
    }

    /**
     * Collapsible Sidebar Navigation (ThinkorSwim style)
     */
    renderSidebar() {
        return `
            <aside id="sidebar-nav" class="nav-sidebar ${this.sidebarCollapsed ? 'collapsed' : ''}">
                <!-- Quick Actions -->
                <div class="sidebar-section">
                    <div class="sidebar-section-title">Quick Actions</div>
                    <button class="sidebar-action-btn btn-buy" onclick="navSystem.quickAction('buy')">
                        <span class="btn-icon">📈</span>
                        <span class="btn-label">Buy Stock</span>
                    </button>
                    <button class="sidebar-action-btn btn-sell" onclick="navSystem.quickAction('sell')">
                        <span class="btn-icon">📉</span>
                        <span class="btn-label">Sell Stock</span>
                    </button>
                </div>

                <!-- Watchlist Summary -->
                <div class="sidebar-section">
                    <div class="sidebar-section-title">Watchlist</div>
                    <div id="sidebar-watchlist" class="sidebar-watchlist">
                        ${this.renderWatchlistPreview()}
                    </div>
                </div>

                <!-- Recent Trades -->
                <div class="sidebar-section">
                    <div class="sidebar-section-title">Recent Trades</div>
                    <div id="sidebar-recent-trades" class="sidebar-recent-trades">
                        ${this.renderRecentTradesPreview()}
                    </div>
                </div>

                <!-- News Ticker -->
                <div class="sidebar-section">
                    <div class="sidebar-section-title">Market News</div>
                    <div id="sidebar-news-ticker" class="sidebar-news-ticker">
                        Loading news...
                    </div>
                </div>

                <!-- Collapse Toggle -->
                <button class="sidebar-collapse-btn" onclick="navSystem.toggleSidebar()">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
            </aside>
        `;
    }

    /**
     * Mobile Bottom Navigation
     */
    renderMobileBottomNav() {
        return `
            <nav class="nav-mobile-bottom">
                ${this.renderMobileNavItem('markets', '📊', 'Markets')}
                ${this.renderMobileNavItem('trading', '💹', 'Trade')}
                ${this.renderMobileNavItem('portfolio', '💼', 'Portfolio')}
                ${this.renderMobileNavItem('research', '🔍', 'Research')}
                ${this.renderMobileNavItem('learn', '🎓', 'Learn')}
            </nav>
        `;
    }

    /**
     * Render navigation link (desktop)
     */
    renderNavLink(view, icon, label) {
        const active = this.currentView === view ? 'active' : '';
        return `
            <button class="nav-link ${active}" onclick="navSystem.navigate('${view}')" data-view="${view}">
                <span class="nav-link-icon">${icon}</span>
                <span class="nav-link-label">${label}</span>
            </button>
        `;
    }

    /**
     * Render mobile nav item (bottom bar)
     */
    renderMobileNavItem(view, icon, label) {
        const active = this.currentView === view ? 'active' : '';
        return `
            <button class="mobile-nav-item ${active}" onclick="navSystem.navigate('${view}')" data-view="${view}">
                <span class="mobile-nav-icon">${icon}</span>
                <span class="mobile-nav-label">${label}</span>
            </button>
        `;
    }

    /**
     * User dropdown menu
     */
    renderUserDropdown() {
        return `
            <div class="nav-user-menu">
                <button class="nav-user-btn" onclick="navSystem.toggleUserMenu()">
                    <div class="user-avatar">${this.getInitials(this.user.name)}</div>
                    <span class="user-name">${this.user.name}</span>
                    <svg class="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>

                <div id="user-dropdown" class="user-dropdown hidden">
                    <div class="dropdown-item" onclick="navSystem.navigate('account')">
                        <span class="item-icon">⚙️</span>
                        <span class="item-label">Account Settings</span>
                    </div>
                    <div class="dropdown-item" onclick="navSystem.navigate('portfolio')">
                        <span class="item-icon">📊</span>
                        <span class="item-label">Performance</span>
                    </div>
                    <div class="dropdown-item" onclick="navSystem.navigate('learn')">
                        <span class="item-icon">🎓</span>
                        <span class="item-label">Learning Progress</span>
                    </div>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-item danger" onclick="navSystem.logout()">
                        <span class="item-icon">🚪</span>
                        <span class="item-label">Sign Out</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Auth buttons (for logged out state)
     */
    renderAuthButtons() {
        return `
            <div class="nav-auth-buttons">
                <button class="btn-secondary" onclick="navSystem.navigate('login')">Sign In</button>
                <button class="btn-primary" onclick="navSystem.navigate('signup')">Get Started</button>
            </div>
        `;
    }

    /**
     * Watchlist preview (sidebar)
     */
    renderWatchlistPreview() {
        // Will be populated dynamically
        return `<div class="empty-state">Add stocks to watchlist</div>`;
    }

    /**
     * Recent trades preview (sidebar)
     */
    renderRecentTradesPreview() {
        // Will be populated dynamically
        return `<div class="empty-state">No recent trades</div>`;
    }

    /**
     * Navigation Styles (CSS-in-JS for modularity)
     */
    renderStyles() {
        return `
            <style>
                /* ===== TOP NAVIGATION BAR ===== */
                .nav-top-bar {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 64px;
                    background: rgba(10, 10, 10, 0.95);
                    backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(16, 185, 129, 0.2);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 24px;
                    z-index: 1000;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
                }

                .nav-brand {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .nav-menu-toggle {
                    background: none;
                    border: none;
                    color: #e8e8e8;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                }

                .nav-menu-toggle:hover {
                    background: rgba(16, 185, 129, 0.1);
                    color: #10b981;
                }

                .nav-logo {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .nav-logo-text {
                    font-size: 20px;
                    font-weight: 800;
                    color: #fff;
                    letter-spacing: -0.5px;
                }

                .nav-logo-subtitle {
                    font-size: 9px;
                    font-weight: 700;
                    color: #10b981;
                    letter-spacing: 2px;
                }

                /* Desktop Navigation Links */
                .nav-links-desktop {
                    display: none;
                    gap: 4px;
                }

                @media (min-width: 1024px) {
                    .nav-links-desktop {
                        display: flex;
                    }
                }

                .nav-link {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 20px;
                    background: none;
                    border: none;
                    border-radius: 10px;
                    color: #b0b0b0;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .nav-link:hover {
                    background: rgba(16, 185, 129, 0.1);
                    color: #10b981;
                }

                .nav-link.active {
                    background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%);
                    color: #10b981;
                    border: 1px solid rgba(16, 185, 129, 0.3);
                }

                .nav-link-icon {
                    font-size: 18px;
                }

                /* Right Side */
                .nav-right {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .nav-market-status {
                    display: none;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                }

                @media (min-width: 768px) {
                    .nav-market-status {
                        display: flex;
                    }
                }

                .status-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    animation: pulse 2s ease-in-out infinite;
                }

                .market-open .status-dot {
                    background: #10b981;
                    box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
                }

                .market-closed .status-dot {
                    background: #ef4444;
                }

                .market-open .status-text {
                    color: #10b981;
                }

                .market-closed .status-text {
                    color: #888;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.1); }
                }

                .nav-balance {
                    display: none;
                    flex-direction: column;
                    align-items: flex-end;
                    padding: 8px 16px;
                    background: rgba(16, 185, 129, 0.1);
                    border: 1px solid rgba(16, 185, 129, 0.3);
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                @media (min-width: 640px) {
                    .nav-balance {
                        display: flex;
                    }
                }

                .nav-balance:hover {
                    background: rgba(16, 185, 129, 0.2);
                    transform: translateY(-2px);
                }

                .balance-label {
                    font-size: 10px;
                    color: #888;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .balance-value {
                    font-size: 16px;
                    font-weight: 700;
                    color: #10b981;
                    font-family: 'JetBrains Mono', monospace;
                }

                /* User Dropdown */
                .nav-user-menu {
                    position: relative;
                }

                .nav-user-btn {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 6px 12px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    color: #e8e8e8;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .nav-user-btn:hover {
                    background: rgba(255, 255, 255, 0.08);
                    border-color: rgba(16, 185, 129, 0.3);
                }

                .user-avatar {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    color: white;
                    font-size: 14px;
                }

                .user-name {
                    display: none;
                    font-size: 14px;
                    font-weight: 600;
                }

                @media (min-width: 768px) {
                    .user-name {
                        display: inline;
                    }
                }

                .user-dropdown {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    margin-top: 8px;
                    min-width: 220px;
                    background: rgba(20, 20, 20, 0.98);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(16, 185, 129, 0.2);
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.7);
                    overflow: hidden;
                    animation: dropdownSlide 0.2s ease;
                }

                .user-dropdown.hidden {
                    display: none;
                }

                @keyframes dropdownSlide {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .dropdown-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    color: #e8e8e8;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .dropdown-item:hover {
                    background: rgba(16, 185, 129, 0.1);
                    color: #10b981;
                }

                .dropdown-item.danger:hover {
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                }

                .dropdown-divider {
                    height: 1px;
                    background: rgba(255, 255, 255, 0.1);
                    margin: 8px 0;
                }

                /* Auth Buttons */
                .nav-auth-buttons {
                    display: flex;
                    gap: 8px;
                }

                .btn-primary, .btn-secondary {
                    padding: 10px 20px;
                    border-radius: 10px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .btn-primary {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                    border: none;
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
                }

                .btn-secondary {
                    background: none;
                    color: #10b981;
                    border: 1px solid rgba(16, 185, 129, 0.5);
                }

                .btn-secondary:hover {
                    background: rgba(16, 185, 129, 0.1);
                    border-color: #10b981;
                }

                /* ===== SIDEBAR ===== */
                .nav-sidebar {
                    position: fixed;
                    top: 64px;
                    left: 0;
                    bottom: 0;
                    width: 280px;
                    background: rgba(15, 15, 15, 0.95);
                    backdrop-filter: blur(20px);
                    border-right: 1px solid rgba(255, 255, 255, 0.08);
                    padding: 20px;
                    overflow-y: auto;
                    z-index: 900;
                    transition: all 0.3s ease;
                    display: none;
                }

                @media (min-width: 1024px) {
                    .nav-sidebar {
                        display: block;
                    }
                }

                .nav-sidebar.collapsed {
                    width: 80px;
                }

                .nav-sidebar.collapsed .sidebar-section-title,
                .nav-sidebar.collapsed .btn-label,
                .nav-sidebar.collapsed .sidebar-watchlist,
                .nav-sidebar.collapsed .sidebar-recent-trades,
                .nav-sidebar.collapsed .sidebar-news-ticker {
                    display: none;
                }

                .sidebar-section {
                    margin-bottom: 32px;
                }

                .sidebar-section-title {
                    font-size: 11px;
                    font-weight: 700;
                    color: #888;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    margin-bottom: 12px;
                }

                .sidebar-action-btn {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 14px;
                    margin-bottom: 8px;
                    border-radius: 10px;
                    border: none;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .btn-buy {
                    background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%);
                    color: #10b981;
                    border: 1px solid rgba(16, 185, 129, 0.3);
                }

                .btn-buy:hover {
                    background: linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0.2) 100%);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(16, 185, 129, 0.2);
                }

                .btn-sell {
                    background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.1) 100%);
                    color: #ef4444;
                    border: 1px solid rgba(239, 68, 68, 0.3);
                }

                .btn-sell:hover {
                    background: linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(239, 68, 68, 0.2) 100%);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(239, 68, 68, 0.2);
                }

                .sidebar-collapse-btn {
                    position: absolute;
                    bottom: 20px;
                    right: 20px;
                    width: 40px;
                    height: 40px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    color: #888;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .sidebar-collapse-btn:hover {
                    background: rgba(16, 185, 129, 0.1);
                    color: #10b981;
                    border-color: rgba(16, 185, 129, 0.3);
                }

                .nav-sidebar.collapsed .sidebar-collapse-btn svg {
                    transform: rotate(180deg);
                }

                .empty-state {
                    padding: 16px;
                    text-align: center;
                    color: #666;
                    font-size: 12px;
                }

                /* ===== MOBILE BOTTOM NAV ===== */
                .nav-mobile-bottom {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 64px;
                    background: rgba(10, 10, 10, 0.98);
                    backdrop-filter: blur(20px);
                    border-top: 1px solid rgba(16, 185, 129, 0.2);
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    padding: 8px 8px 12px;
                    z-index: 1000;
                    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5);
                }

                @media (min-width: 1024px) {
                    .nav-mobile-bottom {
                        display: none;
                    }
                }

                .mobile-nav-item {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    padding: 8px;
                    background: none;
                    border: none;
                    color: #888;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .mobile-nav-item.active {
                    color: #10b981;
                }

                .mobile-nav-item.active .mobile-nav-icon {
                    transform: scale(1.2);
                }

                .mobile-nav-icon {
                    font-size: 22px;
                    transition: all 0.3s ease;
                }

                .mobile-nav-label {
                    font-size: 11px;
                    font-weight: 600;
                }

                /* ===== MAIN CONTENT AREA ===== */
                .main-content {
                    margin-top: 64px;
                    margin-bottom: 64px;
                    padding: 24px;
                    min-height: calc(100vh - 128px);
                }

                @media (min-width: 1024px) {
                    .main-content {
                        margin-left: 280px;
                        margin-bottom: 0;
                    }

                    .main-content.sidebar-collapsed {
                        margin-left: 80px;
                    }
                }
            </style>
        `;
    }

    /**
     * Navigation Methods
     */
    navigate(view) {
        this.currentView = view;

        // Update active states
        document.querySelectorAll('.nav-link, .mobile-nav-item').forEach(link => {
            link.classList.toggle('active', link.dataset.view === view);
        });

        // Call callback
        if (this.callbacks.onNavigate) {
            this.callbacks.onNavigate(view);
        }

        // Hide user dropdown
        this.hideUserMenu();
    }

    toggleSidebar() {
        this.sidebarCollapsed = !this.sidebarCollapsed;
        localStorage.setItem('sidebarCollapsed', this.sidebarCollapsed);

        const sidebar = document.getElementById('sidebar-nav');
        const mainContent = document.querySelector('.main-content');

        if (sidebar) {
            sidebar.classList.toggle('collapsed', this.sidebarCollapsed);
        }

        if (mainContent) {
            mainContent.classList.toggle('sidebar-collapsed', this.sidebarCollapsed);
        }
    }

    toggleUserMenu() {
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown) {
            dropdown.classList.toggle('hidden');
        }
    }

    hideUserMenu() {
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown) {
            dropdown.classList.add('hidden');
        }
    }

    quickAction(type) {
        if (type === 'buy' || type === 'sell') {
            this.navigate('trading');
            // Trigger buy/sell modal if callback provided
        }
    }

    logout() {
        if (this.callbacks.onLogout) {
            this.callbacks.onLogout();
        }
    }

    /**
     * Update Methods (for real-time data)
     */
    updateBalance(newBalance) {
        this.balance = newBalance;
        const balanceEl = document.querySelector('.balance-value');
        if (balanceEl) {
            balanceEl.textContent = '$' + this.formatNumber(newBalance);
            balanceEl.classList.add('pulse-update');
            setTimeout(() => balanceEl.classList.remove('pulse-update'), 1000);
        }
    }

    updateMarketStatus() {
        const status = window.TradingViewCharts?.getMarketStatus?.();
        if (!status) return;

        const statusEl = document.querySelector('.nav-market-status');
        if (statusEl) {
            statusEl.className = `nav-market-status ${status.isOpen ? 'market-open' : 'market-closed'}`;
            statusEl.querySelector('.status-text').textContent = status.message;
        }
    }

    /**
     * Utility Methods
     */
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(2) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toFixed(2);
    }

    getInitials(name) {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }
}

// Export
if (typeof window !== 'undefined') {
    window.NavigationSystem = NavigationSystem;
}
