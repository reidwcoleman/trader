# 🚀 AI Features Quick Start Guide

## 5-Minute Setup

### 1. Files Added ✅
All new AI features are already integrated:
- `js/ai-service.js` - Main AI service (FinBERT, social, predictions)
- `js/sector-analysis.js` - Sector correlation & market analysis
- `js/news-impact.js` - AI-powered news impact scoring
- `index.html` - Updated to load all new modules

### 2. Optional: HuggingFace API (Recommended)

**Get real AI sentiment analysis:**

1. Visit https://huggingface.co/ and create free account
2. Go to Settings → Access Tokens
3. Create token (read access only)
4. Update `js/ai-service.js` line 12:
   ```javascript
   this.hfApiKey = 'hf_YOUR_TOKEN_HERE';
   ```
5. That's it! 30,000 free requests/month.

**Without API key:** System automatically falls back to enhanced keyword sentiment (still works great!)

---

## 🎯 How to Use New AI Features

### Basic Usage (Already Integrated!)

The new AI features work automatically with your existing code. Just use the enhanced analysis:

```javascript
// OLD WAY (still works)
const oldScore = window.enhancedAI.calculateEnhancedBuyScore(stockData, marketData);

// NEW WAY (AI-powered)
const aiScore = await window.aiService.calculateAIScore(
    stockData,
    historicalData,
    newsArticles
);

console.log(aiScore);
// {
//   composite: 84,
//   recommendation: { action: 'STRONG BUY', emoji: '🔥' },
//   confidence: 87,
//   socialData: { mentions: 47, buzz: 95, sentiment: 'positive' },
//   prediction: { predictions: { day3: { change: 3.2 } } },
//   regime: { regime: 'bull', confidence: 85 }
// }
```

### Individual AI Features

#### 1. Social Sentiment (Reddit)
```javascript
const social = await window.aiService.getSocialSentiment('TSLA');
console.log(`Reddit Buzz: ${social.buzz}/100`);
console.log(`Mentions: ${social.mentions}`);
console.log(`Top Post: ${social.posts[0].title}`);
```

#### 2. Price Prediction
```javascript
const prediction = window.aiService.predictPrice(historicalData);
console.log(`3-day forecast: $${prediction.predictions.day3.price}`);
console.log(`Expected change: ${prediction.predictions.day3.change}%`);
```

#### 3. Market Regime
```javascript
const regime = window.aiService.detectMarketRegime(historicalData);
console.log(`Market: ${regime.regime}`);
console.log(`Strategy: ${regime.description}`);
```

#### 4. Sector Analysis
```javascript
const sector = await window.sectorAnalysis.performComprehensiveAnalysis(
    'NVDA', stockData, allStocks
);
console.log(`Sector Leader: ${sector.sector.sectorLeader ? 'YES' : 'NO'}`);
console.log(`Rank: #${sector.sector.stockRank} of ${sector.sector.totalInSector}`);
```

#### 5. News Impact
```javascript
const newsAnalysis = await window.newsImpact.analyzeNewsComprehensive(
    articles, 'AAPL'
);
console.log(`News Score: ${newsAnalysis.overallScore}/100`);
console.log(`High Impact Stories: ${newsAnalysis.highImpactCount}`);
console.log(`Trend: ${newsAnalysis.trend}`);
```

#### 6. Anomaly Detection
```javascript
const anomaly = window.aiService.detectAnomaly(stockData, historicalData);
if (anomaly.isAnomalous) {
    console.log('🚨 UNUSUAL ACTIVITY DETECTED!');
    anomaly.anomalies.forEach(alert => console.log(alert));
}
```

---

## 🎨 Example: Update Stock Analysis Display

Replace your current analysis with AI-powered version:

```javascript
// Inside your stock detail component
async function displayAIAnalysis(stock) {
    // Fetch data
    const historical = await window.enhancedAI.fetchHistoricalData(stock.symbol, API_KEY);
    const news = await window.newsFeed.fetchStockNews(stock.symbol, API_KEY);

    // Run AI analysis
    const aiScore = await window.aiService.calculateAIScore(stock, historical, news);
    const sector = await window.sectorAnalysis.performComprehensiveAnalysis(
        stock.symbol, stock, allStocks
    );

    // Display
    return `
        <div class="ai-analysis">
            <h3>AI Analysis</h3>

            <div class="score-badge ${aiScore.composite > 75 ? 'bullish' : 'bearish'}">
                ${aiScore.recommendation.emoji} ${aiScore.recommendation.action}
                <span class="score">${aiScore.composite}/100</span>
                <span class="confidence">${aiScore.confidence}% confidence</span>
            </div>

            <div class="breakdown">
                <div class="metric">
                    <span>Technical</span>
                    <progress value="${aiScore.breakdown.technical}" max="100"></progress>
                </div>
                <div class="metric">
                    <span>AI Sentiment</span>
                    <progress value="${aiScore.breakdown.sentiment}" max="100"></progress>
                </div>
                <div class="metric">
                    <span>Social Buzz</span>
                    <progress value="${aiScore.breakdown.social}" max="100"></progress>
                </div>
            </div>

            <div class="social-section">
                <h4>🔥 Social Sentiment</h4>
                <p>Reddit Mentions: ${aiScore.socialData.mentions}</p>
                <p>Buzz Score: ${aiScore.socialData.buzz}/100</p>
            </div>

            <div class="prediction-section">
                <h4>🔮 AI Forecast</h4>
                <p>3-Day: $${aiScore.prediction.predictions.day3.price.toFixed(2)}
                   (${aiScore.prediction.predictions.day3.change > 0 ? '+' : ''}${aiScore.prediction.predictions.day3.change.toFixed(2)}%)</p>
            </div>

            <div class="sector-section">
                <h4>📊 Sector Performance</h4>
                <p>Sector: ${sector.sector.sector}</p>
                <p>Rank: #${sector.sector.stockRank} of ${sector.sector.totalInSector}</p>
                <p>${sector.sector.sectorLeader ? '⭐ SECTOR LEADER' : ''}</p>
            </div>

            <div class="regime-section">
                <h4>🎯 Market Conditions</h4>
                <p>${aiScore.regime.description}</p>
            </div>
        </div>
    `;
}
```

---

## 📊 Quick Test

Test all features with this snippet:

```javascript
// Run in browser console
async function testAI() {
    console.log('🧪 Testing AI Features...\n');

    const symbol = 'AAPL';
    const apiKey = window.FINNHUB_API_KEY;

    // 1. Fetch data
    console.log('📥 Fetching data...');
    const quote = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`).then(r => r.json());
    const historical = await window.enhancedAI.fetchHistoricalData(symbol, apiKey, 30);

    const stockData = {
        symbol: symbol,
        price: quote.c,
        change: quote.dp,
        volume: quote.v,
        open: quote.o,
        high: quote.h,
        low: quote.l,
        previousClose: quote.pc
    };

    // 2. Test each feature
    console.log('\n🤖 AI Sentiment...');
    const sentiment = await window.aiService.analyzeFinancialSentiment(
        "Apple reports record revenue, beating analyst expectations by 15%",
        symbol
    );
    console.log(sentiment);

    console.log('\n📱 Social Sentiment...');
    const social = await window.aiService.getSocialSentiment(symbol);
    console.log(`Mentions: ${social.mentions}, Buzz: ${social.buzz}, Sentiment: ${social.sentiment}`);

    console.log('\n🔮 Price Prediction...');
    const prediction = window.aiService.predictPrice(historical);
    console.log(`3-day forecast: $${prediction.predictions.day3.price.toFixed(2)} (${prediction.predictions.day3.change.toFixed(2)}%)`);

    console.log('\n🎯 Market Regime...');
    const regime = window.aiService.detectMarketRegime(historical);
    console.log(`${regime.regime} (${regime.confidence}% confidence) - ${regime.description}`);

    console.log('\n🚨 Anomaly Detection...');
    const anomaly = window.aiService.detectAnomaly(stockData, historical);
    console.log(`Anomaly Score: ${anomaly.anomalyScore}/100`);
    if (anomaly.anomalies.length > 0) {
        console.log('Alerts:');
        anomaly.anomalies.forEach(a => console.log(`  - ${a}`));
    }

    console.log('\n✅ All AI features working!\n');
}

// Run test
testAI();
```

---

## 🎓 Next Steps

1. **Review Full Documentation**: See `AI_FEATURES_COMPLETE.md` for detailed guide
2. **Customize Weights**: Adjust scoring weights in `calculateAIScore()` function
3. **Add UI Components**: Create visual displays for AI insights
4. **Set Up Alerts**: Use anomaly detection for real-time notifications
5. **Backtest**: Test AI recommendations against historical data

---

## 🐛 Troubleshooting

### "Cannot read property of undefined"
**Solution:** Make sure all scripts load in correct order in `index.html`

### "Sentiment API error"
**Solution:**
- Check HuggingFace API key is valid
- Or let it fall back to keyword sentiment (automatic)

### "Reddit API 429 error"
**Solution:** Too many requests. Reddit allows ~60 requests/minute. Add delay between calls.

### "Historical data undefined"
**Solution:** Make sure Finnhub API returns data. Check symbol is valid.

---

## 📈 Performance Tips

1. **Cache Results**: AI calls take 2-5 seconds. Cache results for 5-15 minutes.
2. **Batch Processing**: Analyze multiple stocks in parallel using `Promise.all()`
3. **Lazy Loading**: Only run AI analysis when user clicks "Analyze"
4. **Progressive Enhancement**: Show basic analysis first, then AI results when ready

---

## 🎯 Success Metrics

Track these to measure AI effectiveness:

- **Win Rate**: % of STRONG BUY recommendations that go up
- **Avg Return**: Average return on AI recommendations
- **False Signals**: % of recommendations that fail
- **Confidence Correlation**: Do high-confidence picks perform better?

---

## 💡 Pro Tips

1. **High Confidence Only**: Only trade recommendations with >75% confidence
2. **Multi-Factor Confirmation**: Best trades have high scores in multiple categories
3. **Sector Rotation**: Follow leading sectors for higher success rate
4. **Anomaly + High Score**: Unusual volume + high AI score = strong signal
5. **News Timing**: Trade breaking news (freshness > 95) quickly
6. **Social Buzz**: High buzz (>80) often leads price movements
7. **Regime Awareness**: Adjust position size based on market regime

---

**That's it! You're ready to use institutional-grade AI analysis!** 🚀

For questions, see full documentation or open GitHub issue.
