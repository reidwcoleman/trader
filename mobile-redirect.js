/**
 * Mobile Detection and Redirect Script for FinClash Trader
 * Automatically redirects mobile devices to mobile-optimized pages
 * UltraThink Mobile Optimization System
 */

(function() {
    'use strict';

    // Check if user is already on a mobile page
    if (window.location.pathname.includes('/mobile/')) {
        return; // Already on mobile version, don't redirect
    }

    // Comprehensive mobile device detection
    function isMobileDevice() {
        // Check 1: User agent string
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;

        // Check 2: Screen width (mobile devices typically < 768px)
        const isMobileWidth = window.innerWidth <= 768;

        // Check 3: Touch support (most mobile devices support touch)
        const isTouchDevice = ('ontouchstart' in window) ||
                             (navigator.maxTouchPoints > 0) ||
                             (navigator.msMaxTouchPoints > 0);

        // Return true if user agent matches OR (small screen AND touch support)
        return mobileRegex.test(userAgent) || (isMobileWidth && isTouchDevice);
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
            // Don't redirect dist, js, css, api folders
            if (pageName.startsWith('dist/') || pageName.startsWith('js/') ||
                pageName.startsWith('css/') || pageName.startsWith('api/') ||
                pageName.startsWith('assets/') || pageName.startsWith('node_modules/')) {
                return null; // Don't redirect static resources
            }
            mobilePath = '/trader/mobile/' + pageName;
        }
        else {
            return null; // Not a trader page
        }

        return mobilePath + currentSearch + currentHash;
    }

    // Check for manual override (allow users to force desktop version)
    function hasDesktopOverride() {
        // Check localStorage
        if (localStorage.getItem('forceDesktopView') === 'true') {
            return true;
        }

        // Check URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('desktop') === 'true') {
            localStorage.setItem('forceDesktopView', 'true');
            return true;
        }

        return false;
    }

    // Perform redirect if on mobile device
    function redirectToMobile() {
        if (hasDesktopOverride()) {
            console.log('[FinClash Mobile] Desktop view forced by user');
            return;
        }

        if (isMobileDevice()) {
            const mobileURL = getMobileURL();
            if (mobileURL) {
                console.log('[FinClash Mobile] Mobile device detected, redirecting to:', mobileURL);

                // Set flag to prevent redirect loops
                sessionStorage.setItem('mobileRedirected', 'true');

                // Redirect to mobile version
                window.location.replace(mobileURL);
            }
        } else {
            console.log('[FinClash Mobile] Desktop device detected, staying on desktop version');
        }
    }

    // Run redirect check immediately
    redirectToMobile();

})();
