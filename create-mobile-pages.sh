#!/bin/bash

# Create Mobile Pages for FinClash Trader
# Converts all static HTML pages to mobile-optimized versions
# UltraThink Mobile Optimization System

echo "📱 Creating mobile versions of FinClash trader pages..."

count=0

# List of static HTML pages to convert
pages=(
    "homepage.html"
    "signin.html"
    "create-account.html"
    "learning.html"
    "about.html"
    "about-us.html"
    "about-cameron.html"
    "contact.html"
    "privacy.html"
    "privacy-policy.html"
    "terms.html"
    "terms-of-service.html"
    "trust-safety.html"
    "invest.html"
    "account.html"
)

# Copy each page to mobile directory
for page in "${pages[@]}"; do
    if [ -f "$page" ]; then
        echo "  Processing: $page"

        # Copy file
        cp "$page" "mobile/$page"

        # Add desktop redirect script after <head> tag
        sed -i '/<head>/a\    <!-- Desktop Redirect Script -->\n    <script src="/trader/desktop-redirect.js"></script>' "mobile/$page"

        # Update viewport for mobile optimization
        sed -i 's|<meta name="viewport" content="width=device-width, initial-scale=1.0">|<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">|g' "mobile/$page"

        # Add mobile-optimized meta tag
        if ! grep -q 'name="mobile-optimized"' "mobile/$page"; then
            sed -i '/<meta name="viewport"/a\    <meta name="mobile-optimized" content="true">\n    <meta name="mobile-web-app-capable" content="yes">\n    <meta name="apple-mobile-web-app-capable" content="yes">' "mobile/$page"
        fi

        # Update title to indicate mobile version
        sed -i 's|</title>| (Mobile)</title>|g' "mobile/$page"

        # Add mobile-optimized CSS
        sed -i '/<\/head>/i\    <!-- Mobile-Optimized CSS -->\n    <link rel="stylesheet" href="/trader/mobile/css/mobile-optimized.css">' "mobile/$page"

        # Update links to point to mobile versions
        sed -i 's|href="/trader/|href="/trader/mobile/|g' "mobile/$page"
        sed -i 's|href="index.html"|href="/trader/mobile/index.html"|g' "mobile/$page"
        sed -i 's|href="signin.html"|href="/trader/mobile/signin.html"|g' "mobile/$page"
        sed -i 's|href="homepage.html"|href="/trader/mobile/homepage.html"|g' "mobile/$page"
        sed -i 's|href="learning.html"|href="/trader/mobile/learning.html"|g' "mobile/$page"

        # Keep absolute links to trader resources (js, css, dist)
        sed -i 's|href="/trader/mobile/js/|href="/trader/js/|g' "mobile/$page"
        sed -i 's|href="/trader/mobile/css/|href="/trader/css/|g' "mobile/$page"
        sed -i 's|href="/trader/mobile/dist/|href="/trader/dist/|g' "mobile/$page"
        sed -i 's|src="/trader/mobile/js/|src="/trader/js/|g' "mobile/$page"
        sed -i 's|src="/trader/mobile/css/|src="/trader/css/|g' "mobile/$page"
        sed -i 's|src="/trader/mobile/dist/|src="/trader/dist/|g' "mobile/$page"

        ((count++))
        echo "  ✅ Created: mobile/$page"
    fi
done

echo "✨ Created $count mobile HTML pages!"
echo ""
echo "📝 Summary:"
echo "  - Mobile directory: trader/mobile/"
echo "  - Mobile CSS: trader/mobile/css/mobile-optimized.css"
echo "  - Desktop redirect script: Added to all pages"
echo "  - Touch targets: Optimized (44px minimum)"
echo "  - Viewport: Mobile-optimized"
