#!/bin/bash

# Update all HTML pages to use enhanced mobile redirect
# UltraThink Mobile Optimization System v2.0

echo "🚀 Updating to Enhanced Mobile Redirect System v2.0..."
echo "================================================="
echo ""

# First, let's check which files have the old redirect
echo "📋 Checking current redirect status..."
echo ""

count_updated=0
count_added=0
count_skipped=0

# List all HTML files to check
html_files=(
    "index.html"
    "homepage.html"
    "signin.html"
    "create-account.html"
    "learning.html"
    "about.html"
    "about-us.html"
    "aboutus.html"
    "about-cameron.html"
    "contact.html"
    "privacy.html"
    "privacy-policy.html"
    "terms.html"
    "terms-of-service.html"
    "trust-safety.html"
    "invest.html"
    "account.html"
    "index-new.html"
    "index-vite.html"
    "chart-demo.html"
    "chart-demo-enhanced.html"
    "chart-demo-phase3.html"
    "app-backup2.html"
)

echo "🔍 Processing ${#html_files[@]} HTML files..."
echo ""

for file in "${html_files[@]}"; do
    if [ -f "$file" ]; then
        # Check if file has old mobile redirect
        if grep -q "mobile-redirect.js" "$file"; then
            echo "  📝 Updating: $file (has old redirect)"

            # Replace old redirect with enhanced version
            sed -i 's|src="/trader/mobile-redirect.js"|src="/trader/mobile-redirect-enhanced.js"|g' "$file"

            ((count_updated++))
            echo "     ✅ Updated to enhanced redirect"

        # Check if file has no redirect at all
        elif ! grep -q "mobile-redirect" "$file"; then
            echo "  ➕ Adding redirect to: $file"

            # Add enhanced mobile redirect script after <head> tag
            sed -i '/<head>/a\    <!-- Enhanced Mobile Redirect Script v2.0 -->\n    <script src="/trader/mobile-redirect-enhanced.js"></script>' "$file"

            ((count_added++))
            echo "     ✅ Added enhanced redirect"

        else
            echo "  ⏭️  Skipping: $file (already has enhanced redirect)"
            ((count_skipped++))
        fi
    else
        echo "  ❌ File not found: $file"
    fi
done

echo ""
echo "================================================="
echo "📊 Summary:"
echo "  ✅ Updated to enhanced: $count_updated files"
echo "  ➕ Added new redirect: $count_added files"
echo "  ⏭️  Already enhanced: $count_skipped files"
echo ""

# Create a test page to verify mobile detection
echo "🧪 Creating mobile detection test page..."

cat > mobile-detection-test.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mobile Detection Test - FinClash</title>

    <!-- Enhanced Mobile Redirect -->
    <script src="/trader/mobile-redirect-enhanced.js"></script>

    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            padding: 20px;
            background: #0a0a0a;
            color: #e0e0e0;
            line-height: 1.6;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        h1 {
            color: #3b82f6;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 10px;
        }
        .info-box {
            background: rgba(59, 130, 246, 0.1);
            border: 1px solid #3b82f6;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .detection-result {
            font-size: 24px;
            font-weight: bold;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
        }
        .mobile-detected {
            background: #10b981;
            color: white;
        }
        .desktop-detected {
            background: #3b82f6;
            color: white;
        }
        .stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 20px 0;
        }
        .stat {
            background: rgba(255,255,255,0.05);
            padding: 10px;
            border-radius: 4px;
        }
        .stat-label {
            font-weight: bold;
            color: #9ca3af;
        }
        .stat-value {
            color: #e0e0e0;
            font-family: monospace;
        }
        button {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            margin: 5px;
            font-size: 16px;
        }
        button:hover {
            background: #2563eb;
        }
        .debug-output {
            background: #1a1a1a;
            border: 1px solid #333;
            padding: 15px;
            border-radius: 6px;
            font-family: monospace;
            white-space: pre-wrap;
            max-height: 400px;
            overflow-y: auto;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 Mobile Detection Test</h1>

        <div class="detection-result" id="result">
            Detecting device type...
        </div>

        <div class="info-box">
            <h2>📱 Device Information</h2>
            <div class="stats">
                <div class="stat">
                    <div class="stat-label">User Agent:</div>
                    <div class="stat-value" id="userAgent"></div>
                </div>
                <div class="stat">
                    <div class="stat-label">Screen Size:</div>
                    <div class="stat-value" id="screenSize"></div>
                </div>
                <div class="stat">
                    <div class="stat-label">Touch Support:</div>
                    <div class="stat-value" id="touchSupport"></div>
                </div>
                <div class="stat">
                    <div class="stat-label">Device Pixel Ratio:</div>
                    <div class="stat-value" id="pixelRatio"></div>
                </div>
                <div class="stat">
                    <div class="stat-label">Platform:</div>
                    <div class="stat-value" id="platform"></div>
                </div>
                <div class="stat">
                    <div class="stat-label">Orientation:</div>
                    <div class="stat-value" id="orientation"></div>
                </div>
            </div>
        </div>

        <div class="info-box">
            <h2>🎯 Actions</h2>
            <button onclick="checkDevice()">Re-Check Device</button>
            <button onclick="forceDesktop()">Force Desktop View</button>
            <button onclick="forceMobile()">Force Mobile View</button>
            <button onclick="clearOverrides()">Clear All Overrides</button>
            <button onclick="enableDebug()">Enable Debug Mode</button>
            <button onclick="testRedirect()">Test Redirect</button>
        </div>

        <div class="info-box">
            <h2>🐛 Debug Output</h2>
            <div class="debug-output" id="debugOutput">
                Click "Re-Check Device" to see detailed detection info...
            </div>
        </div>
    </div>

    <script>
        // Display device info
        function updateDeviceInfo() {
            document.getElementById('userAgent').textContent = navigator.userAgent;
            document.getElementById('screenSize').textContent = window.innerWidth + ' × ' + window.innerHeight;
            document.getElementById('touchSupport').textContent = 'ontouchstart' in window ? 'Yes' : 'No';
            document.getElementById('pixelRatio').textContent = window.devicePixelRatio;
            document.getElementById('platform').textContent = navigator.platform || 'Unknown';
            document.getElementById('orientation').textContent =
                window.innerHeight > window.innerWidth ? 'Portrait' : 'Landscape';
        }

        // Check device type
        function checkDevice() {
            const debugOutput = document.getElementById('debugOutput');
            const resultDiv = document.getElementById('result');

            // Enable debug temporarily
            localStorage.setItem('debugMobileRedirect', 'true');

            // Capture console output
            const originalLog = console.log;
            let logs = [];
            console.log = function() {
                logs.push(Array.from(arguments).join(' '));
                originalLog.apply(console, arguments);
            };

            // Check device using the global function
            const isMobile = window.FinClashMobileDebug ? window.FinClashMobileDebug.checkDevice() : null;

            // Restore console
            console.log = originalLog;

            // Update UI
            if (isMobile) {
                resultDiv.className = 'detection-result mobile-detected';
                resultDiv.textContent = '📱 Mobile Device Detected!';
            } else {
                resultDiv.className = 'detection-result desktop-detected';
                resultDiv.textContent = '🖥️ Desktop Device Detected!';
            }

            // Show debug info
            debugOutput.textContent = logs.join('\n') ||
                'Debug info not available. Make sure mobile-redirect-enhanced.js is loaded.';

            // Disable debug
            localStorage.removeItem('debugMobileRedirect');

            updateDeviceInfo();
        }

        function forceDesktop() {
            localStorage.setItem('forceDesktopView', 'true');
            alert('Desktop view forced! Refresh to apply.');
        }

        function forceMobile() {
            window.location.href = '/trader/mobile/index.html?mobile=true';
        }

        function clearOverrides() {
            if (window.FinClashMobileDebug) {
                window.FinClashMobileDebug.clearOverride();
            }
            localStorage.removeItem('forceDesktopView');
            localStorage.removeItem('forceMobileView');
            alert('All overrides cleared! Refresh to apply.');
        }

        function enableDebug() {
            if (window.FinClashMobileDebug) {
                window.FinClashMobileDebug.enableDebug();
            }
            alert('Debug mode enabled! Refresh and check console.');
        }

        function testRedirect() {
            // Remove override temporarily
            const hadOverride = localStorage.getItem('forceDesktopView');
            localStorage.removeItem('forceDesktopView');

            alert('Testing redirect... The page will reload.');
            window.location.reload();

            // Restore override after a delay
            if (hadOverride) {
                setTimeout(() => {
                    localStorage.setItem('forceDesktopView', 'true');
                }, 100);
            }
        }

        // Initialize on load
        window.addEventListener('load', () => {
            updateDeviceInfo();
            setTimeout(checkDevice, 500); // Wait for redirect script to load
        });

        // Update on resize
        window.addEventListener('resize', updateDeviceInfo);
    </script>
</body>
</html>
EOF

echo "  ✅ Created: mobile-detection-test.html"
echo ""
echo "🎯 Enhanced Mobile Detection Features:"
echo "  • 8 detection strategies (user agent, screen, touch, DPI, etc.)"
echo "  • Scoring system for accuracy (3+ points = mobile)"
echo "  • Debug capabilities (window.FinClashMobileDebug)"
echo "  • Visual console feedback"
echo "  • Connection type detection"
echo "  • Media query validation"
echo "  • Platform detection"
echo ""
echo "🧪 To test mobile detection:"
echo "  1. Open: /trader/mobile-detection-test.html"
echo "  2. Check device detection result"
echo "  3. View detailed debug information"
echo "  4. Test force desktop/mobile modes"
echo ""
echo "✨ Enhanced mobile redirect system ready!"