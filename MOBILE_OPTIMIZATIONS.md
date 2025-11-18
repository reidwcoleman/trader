# Mobile Optimizations - FinClash Trading Simulator

## Overview

This document outlines the comprehensive mobile optimizations implemented for the FinClash trading simulator. The application is now fully optimized for mobile devices with touch-friendly interfaces, responsive layouts, and performance enhancements.

## Table of Contents

1. [Responsive Breakpoints](#responsive-breakpoints)
2. [CSS Optimizations](#css-optimizations)
3. [React Hooks & Utilities](#react-hooks--utilities)
4. [Touch Gestures](#touch-gestures)
5. [Performance Optimizations](#performance-optimizations)
6. [Accessibility](#accessibility)
7. [Usage Examples](#usage-examples)

---

## Responsive Breakpoints

### Tailwind Custom Breakpoints

```javascript
{
  'xs': '320px',      // Small phones
  'sm': '640px',      // Large phones
  'md': '768px',      // Tablets
  'lg': '1024px',     // Laptops
  'xl': '1280px',     // Desktops
  '2xl': '1536px',    // Large screens
  'mobile': {'max': '767px'},
  'tablet': {'min': '768px', 'max': '1023px'},
  'desktop': {'min': '1024px'}
}
```

### Usage in JSX

```jsx
<div className="mobile:flex-col desktop:flex-row">
  {/* Mobile: stacked, Desktop: side-by-side */}
</div>
```

---

## CSS Optimizations

### Touch-Friendly Elements

All interactive elements now have minimum touch targets of 44x44px (Apple standard) or 48x48px (Android standard):

```css
/* Automatic on mobile */
button, a.btn {
  min-height: 48px;
  min-width: 48px;
}
```

### iOS Safe Area Support

Automatic padding for devices with notches (iPhone X and later):

```css
@supports (padding: env(safe-area-inset-top)) {
  body {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
  }
}
```

### Mobile Navigation

#### Hamburger Menu
- Animated hamburger icon
- Slide-in drawer menu
- Backdrop overlay

#### Bottom Navigation Bar
- Fixed position at bottom
- Touch-optimized spacing
- Active state indicators

### Modal Behavior

On mobile (<768px):
- Full-screen modals
- Sticky header with close button
- Scrollable body content
- Fixed footer for actions

---

## React Hooks & Utilities

### 1. useMobile Hook

Detect device type and screen size:

```jsx
import { useMobile } from './hooks/useMobile';

function MyComponent() {
  const {
    isMobile,
    isTablet,
    isDesktop,
    screenWidth,
    orientation,
    isTouchDevice
  } = useMobile();

  return (
    <div>
      {isMobile ? (
        <MobileLayout />
      ) : (
        <DesktopLayout />
      )}
    </div>
  );
}
```

### 2. useTouchGestures Hook

Handle swipe and long-press gestures:

```jsx
import { useTouchGestures } from './hooks/useTouchGestures';

function SwipeableCard() {
  const { ref } = useTouchGestures({
    onSwipeLeft: () => console.log('Swiped left'),
    onSwipeRight: () => console.log('Swiped right'),
    onLongPress: () => console.log('Long pressed'),
    swipeThreshold: 50,
    longPressDelay: 500
  });

  return <div ref={ref}>Swipeable content</div>;
}
```

### 3. usePinchZoom Hook

Handle pinch-to-zoom on charts:

```jsx
import { usePinchZoom } from './hooks/useTouchGestures';

function ZoomableChart() {
  const { ref } = usePinchZoom({
    onZoomIn: () => console.log('Zoomed in'),
    onZoomOut: () => console.log('Zoomed out'),
    zoomThreshold: 1.1
  });

  return <div ref={ref}><Chart /></div>;
}
```

### 4. Mobile Utility Functions

```jsx
import {
  formatNumberMobile,
  formatCurrencyMobile,
  truncateText,
  vibrate,
  shareContent,
  showToast,
  getChartOptionsForMobile
} from './utils/mobileOptimizations';

// Format large numbers
formatNumberMobile(1500000) // "1.50M"
formatCurrencyMobile(2500000) // "$2.50M"

// Truncate text
truncateText("Very long text here", 20) // "Very long text he..."

// Haptic feedback
vibrate(10); // Short vibration

// Native share
await shareContent({
  title: 'My Portfolio',
  text: 'Check out my gains!',
  url: window.location.href
});

// Toast notification
showToast('Trade executed successfully!', 'success', 3000);

// Chart options for mobile
const chartOptions = {
  ...baseOptions,
  ...getChartOptionsForMobile(isMobile)
};
```

---

## Touch Gestures

### Supported Gestures

1. **Swipe Left/Right/Up/Down**
   - Navigation between screens
   - Dismiss modals/cards
   - Reveal actions

2. **Long Press**
   - Show context menus
   - Quick actions
   - Additional info

3. **Pinch to Zoom**
   - Chart zooming
   - Image viewing
   - Detail inspection

4. **Pull to Refresh**
   - Reload stock data
   - Refresh portfolio
   - Update news feed

### Implementation Example

```jsx
function StockList() {
  const { ref } = useTouchGestures({
    onSwipeLeft: deleteStock,
    onLongPress: showStockOptions,
    onPullToRefresh: refreshStocks
  });

  return (
    <div ref={ref} className="swipeable">
      {stocks.map(stock => <StockCard key={stock.symbol} {...stock} />)}
    </div>
  );
}
```

---

## Performance Optimizations

### 1. GPU Acceleration

All animated elements use hardware acceleration:

```css
.animated, .modal, .drawer {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}
```

### 2. Debouncing & Throttling

Use provided utilities for performance:

```jsx
import { debounce, throttle } from './utils/mobileOptimizations';

// Debounce search input
const handleSearch = debounce((query) => {
  fetchSearchResults(query);
}, 300);

// Throttle scroll handler
const handleScroll = throttle(() => {
  updateScrollPosition();
}, 100);
```

### 3. Lazy Loading

Images and heavy components should be lazy loaded:

```jsx
import { lazyLoadImage } from './utils/mobileOptimizations';

// Lazy load images
useEffect(() => {
  lazyLoadImage(stockLogo)
    .then(url => setImageSrc(url))
    .catch(() => setImageSrc(fallbackLogo));
}, [stockLogo]);
```

### 4. Network Detection

Optimize based on connection speed:

```jsx
import { useNetworkSpeed } from './hooks/useMobile';

function AdaptiveChart() {
  const { isSlowConnection } = useNetworkSpeed();

  return (
    <Chart
      quality={isSlowConnection ? 'low' : 'high'}
      refreshInterval={isSlowConnection ? 10000 : 3000}
    />
  );
}
```

### 5. Reduced Motion Support

Automatically respects user preferences:

```jsx
import { usePrefersReducedMotion } from './hooks/useMobile';

function AnimatedComponent() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      animate={prefersReducedMotion ? {} : { scale: [1, 1.1, 1] }}
    >
      Content
    </motion.div>
  );
}
```

---

## Accessibility

### WCAG AAA Compliance

- ✓ Minimum touch target size: 44x44px
- ✓ Text size: 16px minimum (prevents iOS zoom)
- ✓ Focus indicators: 3px visible outline
- ✓ Color contrast: Neon colors with proper contrast ratios
- ✓ Keyboard navigation support
- ✓ Screen reader compatibility

### Focus Management

```css
/* Enhanced focus for mobile */
*:focus-visible {
  outline: 3px solid #00bfff;
  outline-offset: 3px;
  box-shadow: 0 0 15px rgba(0, 191, 255, 0.6);
}
```

### High Contrast Mode

```css
@media (prefers-contrast: high) {
  * {
    border-width: 2px !important;
  }
}
```

---

## Usage Examples

### Complete Mobile-Optimized Component

```jsx
import React from 'react';
import { useMobile } from './hooks/useMobile';
import { useTouchGestures } from './hooks/useTouchGestures';
import { showToast, vibrate, formatCurrencyMobile } from './utils/mobileOptimizations';

function TradingCard({ stock, onBuy, onSell }) {
  const { isMobile, isTouchDevice } = useMobile();

  const { ref } = useTouchGestures({
    onSwipeLeft: () => {
      if (isTouchDevice) {
        vibrate(10);
        onSell(stock);
        showToast(`Sold ${stock.symbol}`, 'success');
      }
    },
    onSwipeRight: () => {
      if (isTouchDevice) {
        vibrate(10);
        onBuy(stock);
        showToast(`Bought ${stock.symbol}`, 'success');
      }
    },
    onLongPress: () => {
      vibrate([10, 50, 10]);
      showStockDetails(stock);
    }
  });

  return (
    <div
      ref={ref}
      className={`
        stock-card
        ${isMobile ? 'mobile:flex-col' : 'desktop:flex-row'}
        swipeable
        hover-lift
      `}
    >
      <div className="stock-info">
        <h3 className="mobile:text-lg desktop:text-xl">{stock.symbol}</h3>
        <p className="mobile:text-sm">{stock.name}</p>
      </div>

      <div className="stock-price">
        <span className="mobile:text-2xl desktop:text-3xl">
          {formatCurrencyMobile(stock.price)}
        </span>
      </div>

      {!isMobile && (
        <div className="stock-actions">
          <button onClick={() => onBuy(stock)}>Buy</button>
          <button onClick={() => onSell(stock)}>Sell</button>
        </div>
      )}
    </div>
  );
}

export default TradingCard;
```

### Mobile Navigation Implementation

```jsx
import React, { useState } from 'react';
import { useMobile } from './hooks/useMobile';

function Navigation() {
  const { isMobile } = useMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  if (isMobile) {
    return (
      <>
        {/* Hamburger Button */}
        <button
          className={`hamburger ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Mobile Drawer */}
        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          <nav>
            <a href="/portfolio">Portfolio</a>
            <a href="/trade">Trade</a>
            <a href="/learn">Learn</a>
            <a href="/settings">Settings</a>
          </nav>
        </div>

        {/* Overlay */}
        <div
          className={`mobile-menu-overlay ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(false)}
        />

        {/* Bottom Navigation */}
        <div className="mobile-nav-bottom">
          <button className="active">
            <span>📊</span>
            <span>Portfolio</span>
          </button>
          <button>
            <span>💹</span>
            <span>Trade</span>
          </button>
          <button>
            <span>📚</span>
            <span>Learn</span>
          </button>
          <button>
            <span>⚙️</span>
            <span>Settings</span>
          </button>
        </div>
      </>
    );
  }

  return <DesktopNavigation />;
}
```

---

## Testing Checklist

### Mobile Devices to Test

- [ ] iPhone SE (small screen)
- [ ] iPhone 14 Pro (notch)
- [ ] iPhone 14 Pro Max (large screen)
- [ ] Samsung Galaxy S21 (Android)
- [ ] iPad Mini (small tablet)
- [ ] iPad Pro (large tablet)

### Features to Test

- [ ] Touch targets (all buttons easily tappable)
- [ ] Swipe gestures work smoothly
- [ ] Pull to refresh functions
- [ ] Charts are readable and zoomable
- [ ] Forms don't trigger auto-zoom
- [ ] Modals fill screen on mobile
- [ ] Bottom navigation doesn't obstruct content
- [ ] Safe areas respected on notched devices
- [ ] Network detection works
- [ ] Share functionality works
- [ ] Haptic feedback works (on supported devices)
- [ ] Reduced motion preference respected

---

## Future Enhancements

1. **PWA Features**
   - Add to home screen
   - Offline support
   - Push notifications

2. **Advanced Gestures**
   - 3D Touch support (iOS)
   - Haptic patterns for different events
   - Custom gesture combinations

3. **Performance**
   - Virtual scrolling for long lists
   - Image optimization with WebP
   - Service worker caching

4. **Accessibility**
   - Voice control integration
   - Better screen reader support
   - Larger text option

---

## Resources

- [Web.dev Mobile Performance](https://web.dev/mobile/)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design Touch Targets](https://material.io/design/usability/accessibility.html#layout-and-typography)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## Support

For issues or questions about mobile optimizations, please refer to:
- GitHub Issues: [trader/issues](https://github.com/reidwcoleman/trader/issues)
- Documentation: This file

Last updated: November 2024
