# Vite React Setup for FinClash Trading Simulator

This document explains the new Vite-based build system for faster development and production builds.

## What Changed

The 15,000-line React app has been extracted from `index.html` into a proper React project structure:

- **`/src/App.jsx`** - Main TradingSimulator component (14,992 lines)
- **`/src/main.jsx`** - React app entry point
- **`/index-vite.html`** - New HTML template for Vite
- **`/vite.config.js`** - Vite configuration

## Benefits

1. **Faster Loading**: Pre-compiled React code loads much faster than in-browser Babel compilation
2. **Better Performance**: Optimized production builds with code splitting
3. **Modern Development**: Hot Module Replacement (HMR) for instant updates during development
4. **Smaller Bundle**: Vendor libraries (React, ReactDOM) separated into their own chunk

## Development

### Start Vite Dev Server
```bash
npm run dev:vite
```

This starts the development server at `http://localhost:5173` with Hot Module Replacement.

### Start Backend Server (in separate terminal)
```bash
npm run dev
```

This starts the Node.js backend server at `http://localhost:3001`.

## Production Build

### Build for Production
```bash
npm run build
```

This creates an optimized production build in the `/dist` folder.

### Preview Production Build
```bash
npm run preview
```

This serves the production build locally for testing.

## File Structure

```
/trader
├── src/
│   ├── App.jsx           # Main React component (extracted from index.html lines 270-15261)
│   └── main.jsx          # React entry point
├── index-vite.html       # Vite HTML template
├── vite.config.js        # Vite configuration
├── package.json          # Updated with Vite scripts
└── js/                   # External JS modules (config.js, analytics.js, etc.)
    └── css/              # Stylesheets
```

## Important Notes

1. **Original `index.html` is unchanged** - The old version still works for compatibility
2. **External dependencies** - All `/js/*.js` files are still loaded as external scripts
3. **Config.js must load first** - `js/config.js` defines global variables used by the app
4. **Tailwind CSS** - Still loaded from CDN (can be migrated to PostCSS later)

## Migration Details

The React component was extracted without changes:
- Line 256 (`const { useState, useEffect, useRef } = React;`) was REMOVED
- Line 270-15261 (TradingSimulator component) was COPIED
- Lines 15263-15264 (ReactDOM.render) were REPLACED with proper module export

New imports added to `App.jsx`:
```javascript
import React, { useState, useEffect, useRef } from 'react';
```

New export added to `App.jsx`:
```javascript
export default TradingSimulator;
```

## Next Steps (Optional Optimizations)

1. **Migrate Tailwind** - Switch from CDN to PostCSS for faster builds
2. **Module Conversion** - Convert `/js/*.js` files to ES modules
3. **Code Splitting** - Split large component into smaller modules
4. **TypeScript** - Add type safety (optional)
5. **Bundle Analysis** - Analyze and optimize bundle size

## Troubleshooting

### Issue: "Cannot find module 'react'"
**Solution**: Run `npm install` to ensure all dependencies are installed.

### Issue: "js/config.js not found"
**Solution**: Ensure `vite.config.js` has `publicDir: false` and serves files from root.

### Issue: App doesn't load
**Solution**: Check browser console for errors. Ensure backend server is running if using API features.
