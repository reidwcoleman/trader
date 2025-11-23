/**
 * Enhanced Mobile Detection and Redirect Script for FinClash Trader
 * UltraThink Mobile Optimization System v2.0
 * Advanced detection with fallbacks and debugging
 */

(function() {
    'use strict';

    // Debug mode - set to true to see console logs
    const DEBUG_MODE = false;

    // Log function for debugging
    function log(message, data) {
        if (DEBUG_MODE || localStorage.getItem('debugMobileRedirect') === 'true') {
            console.log(`[FinClash Mobile v2.0] ${message}`, data || '');
        }
    }

    // Check if user is already on a mobile page
    if (window.location.pathname.includes('/mobile/')) {
        log('Already on mobile page, skipping redirect');
        return;
    }

    // Enhanced mobile device detection with multiple strategies
    function isMobileDevice() {
        // Strategy 1: Enhanced User Agent Detection
        const userAgent = (navigator.userAgent || navigator.vendor || window.opera || '').toLowerCase();

        // Comprehensive mobile patterns
        const mobilePatterns = [
            // Common mobile browsers
            /android/i,
            /webos/i,
            /iphone/i,
            /ipad/i,
            /ipod/i,
            /blackberry/i,
            /windows phone/i,
            /iemobile/i,
            /opera mini/i,
            /mobile/i,
            /tablet/i,

            // Specific mobile browsers
            /crios/i,        // Chrome iOS
            /fxios/i,        // Firefox iOS
            /edgios/i,       // Edge iOS
            /samsungbrowser/i,
            /ucbrowser/i,

            // Mobile devices
            /kindle/i,
            /silk/i,         // Amazon Silk
            /nokia/i,
            /symbian/i,
            /palm/i,

            // Mobile frameworks/webviews
            /instagram/i,
            /facebook/i,
            /twitter/i,
            /linkedin/i,
            /wechat/i,
            /whatsapp/i
        ];

        const isUserAgentMobile = mobilePatterns.some(pattern => pattern.test(userAgent));
        log('User Agent Check:', { userAgent, isMobile: isUserAgentMobile });

        // Strategy 2: Screen Size Detection
        const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        const screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        const isMobileWidth = screenWidth <= 768;
        const isPortrait = screenHeight > screenWidth;

        log('Screen Check:', {
            width: screenWidth,
            height: screenHeight,
            isMobileWidth,
            isPortrait
        });

        // Strategy 3: Touch Capability Detection
        const hasTouchScreen = (
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            navigator.msMaxTouchPoints > 0 ||
            (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) ||
            ('TouchEvent' in window)
        );
        log('Touch Check:', { hasTouchScreen });

        // Strategy 4: Device Pixel Ratio (high DPI screens common on mobile)
        const hasHighDPI = window.devicePixelRatio > 1.5;
        log('DPI Check:', { devicePixelRatio: window.devicePixelRatio, hasHighDPI });

        // Strategy 5: Orientation API (mobile devices support orientation)
        const hasOrientationAPI = 'orientation' in window || 'orientation' in screen;
        log('Orientation API:', { hasOrientationAPI });

        // Strategy 6: Media Query Check
        const mobileMediaQuery = window.matchMedia(
            '(max-width: 768px) and (orientation: portrait), ' +
            '(max-width: 1024px) and (orientation: landscape) and (pointer: coarse)'
        ).matches;
        log('Media Query Check:', { mobileMediaQuery });

        // Strategy 7: Platform Detection
        const platform = navigator.platform || '';
        const isMobilePlatform = /iphone|ipad|ipod|android|blackberry|opera mini|iemobile/i.test(platform.toLowerCase());
        log('Platform Check:', { platform, isMobilePlatform });

        // Strategy 8: Connection API (if available)
        let isMobileConnection = false;
        if ('connection' in navigator && navigator.connection) {
            const connection = navigator.connection;
            isMobileConnection =
                connection.type === 'cellular' ||
                connection.type === 'wifi' ||
                connection.effectiveType === '3g' ||
                connection.effectiveType === '2g';
            log('Connection Check:', {
                type: connection.type,
                effectiveType: connection.effectiveType,
                isMobileConnection
            });
        }

        // Scoring System - More accurate detection
        let mobileScore = 0;
        const maxScore = 8;

        if (isUserAgentMobile) mobileScore += 2;  // Strong indicator
        if (isMobileWidth) mobileScore += 1.5;
        if (hasTouchScreen) mobileScore += 1.5;
        if (hasHighDPI && isMobileWidth) mobileScore += 0.5;
        if (hasOrientationAPI) mobileScore += 0.5;
        if (mobileMediaQuery) mobileScore += 1;
        if (isMobilePlatform) mobileScore += 1;
        if (isMobileConnection) mobileScore += 0.5;
        if (isPortrait && hasTouchScreen) mobileScore += 0.5;  // Bonus for portrait + touch

        const mobileThreshold = 3; // Need at least 3 points to be considered mobile
        const isMobile = mobileScore >= mobileThreshold;

        log('Mobile Detection Score:', {
            score: mobileScore,
            threshold: mobileThreshold,
            isMobile,
            details: {
                userAgent: isUserAgentMobile,
                screenWidth: isMobileWidth,
                touch: hasTouchScreen,
                dpi: hasHighDPI,
                orientation: hasOrientationAPI,
                mediaQuery: mobileMediaQuery,
                platform: isMobilePlatform,
                connection: isMobileConnection
            }
        });

        // Store detection result for debugging
        if (DEBUG_MODE) {
            sessionStorage.setItem('mobileDetectionScore', mobileScore.toString());
            sessionStorage.setItem('mobileDetectionResult', isMobile.toString());
        }

        return isMobile;
    }

    // Get mobile version of current URL
    function getMobileURL() {
        const currentPath = window.location.pathname;
        const currentSearch = window.location.search;
        const currentHash = window.location.hash;

        // Handle different page types
        let mobilePath;

        // Root index or trader root
        if (currentPath === '/trader' || currentPath === '/trader/' || currentPath === '/trader/index.html') {
            mobilePath = '/trader/mobile/index.html';
        }
        // Other trader pages
        else if (currentPath.startsWith('/trader/')) {
            const pageName = currentPath.replace('/trader/', '');

            // Don't redirect static resources
            const staticPaths = ['dist/', 'js/', 'css/', 'api/', 'assets/', 'node_modules/', 'public/'];
            if (staticPaths.some(path => pageName.startsWith(path))) {
                log('Static resource detected, no redirect needed:', pageName);
                return null;
            }

            // Don't redirect non-HTML files
            if (pageName.includes('.') && !pageName.endsWith('.html')) {
                log('Non-HTML file detected, no redirect needed:', pageName);
                return null;
            }

            mobilePath = '/trader/mobile/' + pageName;
        }
        else {
            log('Not a trader page, no redirect needed:', currentPath);
            return null;
        }

        return mobilePath + currentSearch + currentHash;
    }

    // Check for manual override
    function hasDesktopOverride() {
        // Check localStorage
        if (localStorage.getItem('forceDesktopView') === 'true') {
            log('Desktop view forced via localStorage');
            return true;
        }

        // Check URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('desktop') === 'true') {
            localStorage.setItem('forceDesktopView', 'true');
            log('Desktop view forced via URL parameter');
            return true;
        }

        // Check cookie (backup method)
        if (document.cookie.includes('forceDesktopView=true')) {
            log('Desktop view forced via cookie');
            return true;
        }

        return false;
    }

    // Perform redirect if on mobile device
    function redirectToMobile() {
        // Check for override first
        if (hasDesktopOverride()) {
            log('Desktop override active, staying on desktop version');

            // Add a visual indicator that desktop mode is forced
            if (isMobileDevice()) {
                console.log('%c📱 Mobile device detected but desktop view forced',
                    'background: #fbbf24; color: #000; padding: 4px 8px; border-radius: 4px;');
            }
            return;
        }

        // Check if mobile device
        if (isMobileDevice()) {
            const mobileURL = getMobileURL();

            if (mobileURL) {
                // Add visual feedback before redirect
                console.log('%c📱 Mobile device detected! Redirecting to mobile version...',
                    'background: #10b981; color: #fff; padding: 4px 8px; border-radius: 4px;');

                log('Redirecting to mobile version:', mobileURL);

                // Set flag to prevent redirect loops
                sessionStorage.setItem('mobileRedirected', 'true');
                sessionStorage.setItem('redirectTime', new Date().toISOString());

                // Small delay to allow console messages to appear
                setTimeout(() => {
                    window.location.replace(mobileURL);
                }, 100);
            }
        } else {
            log('Desktop device detected, staying on desktop version');

            // Add visual confirmation for desktop
            if (DEBUG_MODE) {
                console.log('%c🖥️ Desktop device confirmed',
                    'background: #3b82f6; color: #fff; padding: 4px 8px; border-radius: 4px;');
            }
        }
    }

    // Initialize when DOM is ready
    function init() {
        log('Initializing mobile detection...');

        // Add device info to body for CSS targeting
        if (isMobileDevice()) {
            document.body.classList.add('mobile-device-detected');
            document.body.setAttribute('data-device', 'mobile');
        } else {
            document.body.classList.add('desktop-device-detected');
            document.body.setAttribute('data-device', 'desktop');
        }

        // Perform redirect
        redirectToMobile();
    }

    // Run detection immediately (before DOM ready for faster redirect)
    redirectToMobile();

    // Also run after DOM is ready (backup)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose debugging function globally
    window.FinClashMobileDebug = {
        checkDevice: function() {
            const result = isMobileDevice();
            console.table({
                'Is Mobile': result,
                'User Agent': navigator.userAgent,
                'Screen Width': window.innerWidth,
                'Touch Support': 'ontouchstart' in window,
                'Device Pixel Ratio': window.devicePixelRatio,
                'Detection Score': sessionStorage.getItem('mobileDetectionScore') || 'N/A'
            });
            return result;
        },
        enableDebug: function() {
            localStorage.setItem('debugMobileRedirect', 'true');
            console.log('Debug mode enabled. Refresh page to see logs.');
        },
        disableDebug: function() {
            localStorage.removeItem('debugMobileRedirect');
            console.log('Debug mode disabled.');
        },
        clearOverride: function() {
            localStorage.removeItem('forceDesktopView');
            localStorage.removeItem('forceMobileView');
            document.cookie = 'forceDesktopView=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            console.log('All overrides cleared. Refresh page to apply.');
        }
    };

})();