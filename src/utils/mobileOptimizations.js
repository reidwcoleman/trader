/**
 * Mobile-specific optimization utilities for the trading simulator
 */

/**
 * Debounce function for performance optimization
 * Useful for scroll, resize, and input events on mobile
 */
export const debounce = (func, wait = 150) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for limiting function calls
 * Better for events that fire very frequently
 */
export const throttle = (func, limit = 100) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Lazy load images on mobile to save bandwidth
 */
export const lazyLoadImage = (imageUrl, placeholder = null) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => resolve(imageUrl);
    img.onerror = reject;
  });
};

/**
 * Format large numbers for mobile displays (shorter format)
 */
export const formatNumberMobile = (num, decimals = 2) => {
  if (num === null || num === undefined) return '--';

  const absNum = Math.abs(num);

  if (absNum >= 1e9) {
    return `${(num / 1e9).toFixed(decimals)}B`;
  } else if (absNum >= 1e6) {
    return `${(num / 1e6).toFixed(decimals)}M`;
  } else if (absNum >= 1e3) {
    return `${(num / 1e3).toFixed(decimals)}K`;
  }

  return num.toFixed(decimals);
};

/**
 * Format currency for mobile (shorter)
 */
export const formatCurrencyMobile = (value, currency = 'USD') => {
  if (value === null || value === undefined) return '--';

  const formatted = formatNumberMobile(value);
  return `$${formatted}`;
};

/**
 * Truncate text for mobile displays
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Check if device is in standalone mode (PWA)
 */
export const isStandalone = () => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
};

/**
 * Vibration API for haptic feedback (mobile-only)
 */
export const vibrate = (pattern = 10) => {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};

/**
 * Share API for mobile sharing
 */
export const shareContent = async (data) => {
  if (navigator.share) {
    try {
      await navigator.share(data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  return { success: false, error: 'Share API not supported' };
};

/**
 * Copy to clipboard with mobile fallback
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return { success: true };
    } else {
      // Fallback for older mobile browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return { success };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Prevent zoom on double-tap (iOS fix)
 */
export const preventDoubleTapZoom = (element) => {
  let lastTouchEnd = 0;
  element.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive: false });
};

/**
 * Get safe area insets for notched devices
 */
export const getSafeAreaInsets = () => {
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);

  return {
    top: parseInt(computedStyle.getPropertyValue('--safe-area-inset-top') || '0'),
    right: parseInt(computedStyle.getPropertyValue('--safe-area-inset-right') || '0'),
    bottom: parseInt(computedStyle.getPropertyValue('--safe-area-inset-bottom') || '0'),
    left: parseInt(computedStyle.getPropertyValue('--safe-area-inset-left') || '0'),
  };
};

/**
 * Request notification permission (mobile-friendly)
 */
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    return { granted: false, error: 'Notifications not supported' };
  }

  try {
    const permission = await Notification.requestPermission();
    return { granted: permission === 'granted', permission };
  } catch (error) {
    return { granted: false, error: error.message };
  }
};

/**
 * Show a mobile-optimized toast notification
 */
export const showToast = (message, type = 'info', duration = 3000) => {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-icon">${getToastIcon(type)}</span>
      <span class="toast-message">${message}</span>
    </div>
    <div class="toast-progress" style="animation-duration: ${duration}ms"></div>
  `;

  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  container.appendChild(toast);

  // Trigger entrance animation
  setTimeout(() => toast.classList.add('show'), 10);

  // Remove after duration
  setTimeout(() => {
    toast.classList.add('closing');
    setTimeout(() => {
      container.removeChild(toast);
      if (container.children.length === 0) {
        document.body.removeChild(container);
      }
    }, 300);
  }, duration);
};

const getToastIcon = (type) => {
  const icons = {
    success: '✓',
    error: '✗',
    warning: '⚠',
    info: 'ℹ',
  };
  return icons[type] || icons.info;
};

/**
 * Detect if user is on a slow connection
 */
export const isSlowConnection = () => {
  if ('connection' in navigator) {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      return connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
    }
  }
  return false;
};

/**
 * Optimize chart rendering for mobile
 */
export const getChartOptionsForMobile = (isMobile) => {
  if (!isMobile) return {};

  return {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      point: {
        radius: 2, // Smaller points on mobile
        hoverRadius: 4,
      },
      line: {
        borderWidth: 1.5, // Thinner lines
      },
    },
    plugins: {
      legend: {
        display: false, // Hide legend on small screens
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        displayColors: false, // Simpler tooltips
      },
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 5, // Fewer ticks on mobile
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        ticks: {
          maxTicksLimit: 6,
        },
      },
    },
  };
};

export default {
  debounce,
  throttle,
  lazyLoadImage,
  formatNumberMobile,
  formatCurrencyMobile,
  truncateText,
  isStandalone,
  vibrate,
  shareContent,
  copyToClipboard,
  preventDoubleTapZoom,
  getSafeAreaInsets,
  requestNotificationPermission,
  showToast,
  isSlowConnection,
  getChartOptionsForMobile,
};
