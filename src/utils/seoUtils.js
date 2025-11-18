/**
 * SEO Utilities for FinClash Trading Simulator
 * Comprehensive SEO optimization tools for better search rankings
 */

/**
 * High-value SEO keywords for stock trading simulator
 */
export const SEO_KEYWORDS = {
  primary: [
    'stock trading simulator',
    'paper trading',
    'virtual trading platform',
    'stock market simulator',
    'free trading simulator',
  ],
  secondary: [
    'stock market practice',
    'learn stock trading',
    'trading practice account',
    'stock simulator app',
    'virtual stock market',
    'trading education',
  ],
  longTail: [
    'free stock market simulator for beginners',
    'best paper trading platform 2024',
    'practice stock trading without risk',
    'learn day trading simulator',
    'virtual stock portfolio simulator',
    'options trading simulator free',
    'stock market game for education',
  ],
  features: [
    'real-time stock data',
    'portfolio management',
    'technical analysis tools',
    'options trading',
    'trading strategies',
    'risk management',
  ],
};

/**
 * Generate SEO-optimized page titles
 */
export const generatePageTitle = (pageName, includeKeyword = true) => {
  const baseTitle = 'FinClash';
  const keyword = 'Stock Trading Simulator';

  const titles = {
    home: `${baseTitle} - Free Stock Trading Simulator | Practice Paper Trading Online`,
    learn: `Learn Stock Trading | ${baseTitle} Education Platform`,
    portfolio: `My Portfolio | ${baseTitle} ${keyword}`,
    trade: `Trade Stocks | ${baseTitle} Virtual Trading Platform`,
    account: `My Account | ${baseTitle} Paper Trading`,
    login: `Sign In | ${baseTitle} Stock Market Simulator`,
    signup: `Create Account | Free ${keyword}`,
    about: `About Us | ${baseTitle} Trading Education`,
    contact: `Contact Us | ${baseTitle}`,
    charts: `Real-Time Charts | ${baseTitle} ${keyword}`,
    options: `Options Trading | ${baseTitle} Simulator`,
  };

  return titles[pageName] || `${pageName} | ${baseTitle}`;
};

/**
 * Generate SEO-optimized meta descriptions
 */
export const generateMetaDescription = (page) => {
  const descriptions = {
    home: 'Master stock trading with FinClash\'s free virtual trading simulator. Practice with real-time market data, learn trading strategies, and build your portfolio risk-free. Start paper trading today!',
    learn: 'Learn stock trading with FinClash\'s comprehensive education platform. Interactive tutorials, quizzes, and real-world trading simulations to master the stock market.',
    portfolio: 'Track your virtual stock portfolio with real-time data. Analyze performance, manage risk, and optimize your trading strategy with FinClash\'s powerful portfolio tools.',
    trade: 'Practice stock trading with virtual money using real market data. Buy, sell, and short stocks without financial risk on FinClash\'s advanced trading platform.',
    options: 'Master options trading with our free simulator. Practice calls, puts, and complex strategies risk-free with real-time market data.',
    charts: 'Analyze stocks with professional-grade charts and technical indicators. Real-time data, multiple timeframes, and advanced charting tools for traders.',
  };

  return descriptions[page] || `${page} - FinClash Stock Trading Simulator`;
};

/**
 * Generate JSON-LD structured data for different page types
 */
export const generateStructuredData = (type, data = {}) => {
  const baseUrl = 'https://finclash.us';

  const schemas = {
    WebApplication: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'FinClash',
      url: baseUrl,
      description: 'Free stock trading simulator and paper trading platform',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web Browser, iOS, Android',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency': 'USD',
      },
      ...data,
    },

    Course: {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: data.name || 'Stock Trading Education',
      description: data.description || 'Learn stock trading fundamentals',
      provider: {
        '@type': 'Organization',
        name: 'FinClash',
        url: baseUrl,
      },
      ...data,
    },

    HowTo: {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: data.name || 'How to Trade Stocks',
      description: data.description,
      step: data.steps || [],
      ...data,
    },

    Article: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: data.headline,
      description: data.description,
      author: {
        '@type': 'Organization',
        name: 'FinClash',
      },
      publisher: {
        '@type': 'Organization',
        name: 'FinClash',
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/finclash.png`,
        },
      },
      datePublished: data.datePublished || new Date().toISOString(),
      dateModified: data.dateModified || new Date().toISOString(),
      ...data,
    },

    BreadcrumbList: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: data.breadcrumbs?.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: `${baseUrl}${crumb.path}`,
      })) || [],
    },
  };

  return JSON.stringify(schemas[type] || {});
};

/**
 * Generate Open Graph tags for social sharing
 */
export const generateOGTags = (page, customData = {}) => {
  const baseUrl = 'https://finclash.us';
  const defaultImage = `${baseUrl}/finclash.png`;

  const defaults = {
    type: 'website',
    site_name: 'FinClash',
    locale: 'en_US',
    image: defaultImage,
    image_width: '1200',
    image_height: '630',
  };

  return {
    ...defaults,
    url: `${baseUrl}${page}`,
    title: customData.title || generatePageTitle(page),
    description: customData.description || generateMetaDescription(page),
    ...customData,
  };
};

/**
 * Generate canonical URL
 */
export const generateCanonicalUrl = (path) => {
  const baseUrl = 'https://finclash.us';
  return `${baseUrl}${path.startsWith('/') ? path : '/' + path}`;
};

/**
 * SEO-friendly URL slug generator
 */
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Check if URL is SEO-friendly
 */
export const isSEOFriendlyUrl = (url) => {
  // Check for:
  // - Lowercase
  // - Hyphens instead of underscores
  // - No special characters except hyphens
  // - Not too long (< 100 chars)
  const regex = /^[a-z0-9-/]+$/;
  return regex.test(url) && url.length < 100;
};

/**
 * Generate alt text for images (SEO + accessibility)
 */
export const generateAltText = (context, stockSymbol = null) => {
  const templates = {
    chart: `${stockSymbol} stock price chart - Real-time trading data on FinClash`,
    portfolio: 'Stock portfolio performance dashboard - FinClash trading simulator',
    logo: 'FinClash - Free stock trading simulator and paper trading platform',
    screenshot: 'FinClash trading platform interface - Virtual stock market simulator',
    tutorial: 'Stock trading tutorial - Learn to trade on FinClash',
  };

  return templates[context] || 'FinClash stock trading simulator';
};

/**
 * Track SEO metrics (for analytics)
 */
export const trackSEOEvent = (eventName, data = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      event_category: 'SEO',
      ...data,
    });
  }
};

/**
 * Check page loading performance (Core Web Vitals)
 */
export const measureWebVitals = () => {
  if (typeof window === 'undefined') return;

  // Largest Contentful Paint (LCP)
  const perfObserver = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      console.log('LCP:', entry.renderTime || entry.loadTime);
      trackSEOEvent('web_vitals_lcp', {
        value: entry.renderTime || entry.loadTime,
      });
    }
  });

  try {
    perfObserver.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (e) {
    // LCP not supported
  }

  // First Input Delay (FID)
  if ('PerformanceObserver' in window) {
    const fidObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const fid = entry.processingStart - entry.startTime;
        console.log('FID:', fid);
        trackSEOEvent('web_vitals_fid', { value: fid });
      }
    });

    try {
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      // FID not supported
    }
  }
};

/**
 * Preload critical resources for better performance
 */
export const preloadCriticalResources = (resources) => {
  if (typeof document === 'undefined') return;

  resources.forEach((resource) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = resource.as;
    link.href = resource.href;
    if (resource.type) link.type = resource.type;
    if (resource.crossorigin) link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

/**
 * Generate sitemap entry for dynamic pages
 */
export const generateSitemapEntry = (url, options = {}) => {
  const defaults = {
    changefreq: 'weekly',
    priority: 0.5,
    lastmod: new Date().toISOString().split('T')[0],
  };

  const config = { ...defaults, ...options };

  return `
  <url>
    <loc>https://finclash.us${url}</loc>
    <lastmod>${config.lastmod}</lastmod>
    <changefreq>${config.changefreq}</changefreq>
    <priority>${config.priority}</priority>
  </url>`;
};

/**
 * SEO best practices checker
 */
export const checkSEO = () => {
  const issues = [];

  if (typeof document === 'undefined') return issues;

  // Check title
  const title = document.title;
  if (!title) issues.push('Missing page title');
  if (title.length > 60) issues.push('Title too long (>60 chars)');
  if (title.length < 30) issues.push('Title too short (<30 chars)');

  // Check meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    issues.push('Missing meta description');
  } else {
    const descContent = metaDesc.getAttribute('content') || '';
    if (descContent.length > 160) issues.push('Meta description too long (>160 chars)');
    if (descContent.length < 120) issues.push('Meta description too short (<120 chars)');
  }

  // Check canonical
  const canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) issues.push('Missing canonical URL');

  // Check Open Graph
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDesc = document.querySelector('meta[property="og:description"]');
  const ogImage = document.querySelector('meta[property="og:image"]');
  if (!ogTitle) issues.push('Missing OG title');
  if (!ogDesc) issues.push('Missing OG description');
  if (!ogImage) issues.push('Missing OG image');

  // Check h1
  const h1Tags = document.querySelectorAll('h1');
  if (h1Tags.length === 0) issues.push('Missing H1 tag');
  if (h1Tags.length > 1) issues.push('Multiple H1 tags (should be only one)');

  // Check images without alt
  const images = document.querySelectorAll('img:not([alt])');
  if (images.length > 0) issues.push(`${images.length} images missing alt text`);

  return issues;
};

export default {
  SEO_KEYWORDS,
  generatePageTitle,
  generateMetaDescription,
  generateStructuredData,
  generateOGTags,
  generateCanonicalUrl,
  generateSlug,
  isSEOFriendlyUrl,
  generateAltText,
  trackSEOEvent,
  measureWebVitals,
  preloadCriticalResources,
  generateSitemapEntry,
  checkSEO,
};
