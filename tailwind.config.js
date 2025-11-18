/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./index-vite.html",
    "./homepage.html",
    "./app.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      // Mobile-first breakpoints optimized for trading app
      screens: {
        'xs': '320px',   // Small phones
        'sm': '640px',   // Large phones (default)
        'md': '768px',   // Tablets (default)
        'lg': '1024px',  // Small laptops (default)
        'xl': '1280px',  // Desktops (default)
        '2xl': '1536px', // Large screens (default)
        // Custom breakpoints for specific use cases
        'mobile': {'max': '767px'},      // Mobile-only styles
        'tablet': {'min': '768px', 'max': '1023px'},  // Tablet-only
        'desktop': {'min': '1024px'},    // Desktop and above
      },
      // Mobile-optimized spacing
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      // Touch-friendly sizing
      minHeight: {
        'touch': '44px',   // Apple's minimum touch target
        'touch-lg': '48px', // Android's recommended minimum
      },
      minWidth: {
        'touch': '44px',
        'touch-lg': '48px',
      },
      // Optimized font sizes for mobile readability
      fontSize: {
        'xs-mobile': ['0.75rem', { lineHeight: '1.25rem' }],
        'sm-mobile': ['0.875rem', { lineHeight: '1.5rem' }],
        'base-mobile': ['1rem', { lineHeight: '1.75rem' }],
        'lg-mobile': ['1.125rem', { lineHeight: '2rem' }],
      },
      // Neon colors for the ultra-modern theme
      colors: {
        'neon-blue': '#00bfff',
        'neon-green': '#00e676',
        'neon-pink': '#ff0064',
        'neon-amber': '#ffd700',
      },
      // Mobile-optimized z-index scale
      zIndex: {
        'modal': '9999',
        'overlay': '9998',
        'dropdown': '9997',
        'sticky': '100',
        'nav': '50',
      },
      // Mobile-specific animation durations
      transitionDuration: {
        'fast': '150ms',
        'normal': '300ms',
        'slow': '500ms',
      },
    },
  },
  plugins: [],
}
