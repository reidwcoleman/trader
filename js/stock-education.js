// Stock Market Education Module for FinClash
// Comprehensive educational content about stocks, trading, and market mechanics

/**
 * Complete stock market education curriculum
 */

const stockEducation = {
    // FUNDAMENTALS
    fundamentals: {
        title: "Stock Market Fundamentals",
        icon: "📚",
        topics: {
            whatIsStock: {
                title: "What is a Stock?",
                content: `
A stock represents ownership in a company. When you buy a stock, you become a shareholder - a partial owner of that business.

**Key Concepts:**

• **Share**: A single unit of ownership
• **Equity**: Another word for stock ownership
• **Shareholder**: Someone who owns shares
• **Outstanding Shares**: Total shares in existence

**Why Companies Issue Stock:**
1. Raise capital for growth
2. Provide liquidity for early investors
3. Create employee incentives (stock options)
4. Increase company visibility

**Types of Stock:**
• **Common Stock**: Voting rights, dividend participation
• **Preferred Stock**: Fixed dividends, priority in bankruptcy
• **Growth Stocks**: Companies reinvesting profits for expansion
• **Value Stocks**: Undervalued companies trading below intrinsic value
• **Dividend Stocks**: Regular income distributions to shareholders
                `,
                quiz: [
                    {
                        question: "What does owning stock represent?",
                        options: [
                            "A loan to the company",
                            "Partial ownership of the company",
                            "A guarantee of profits",
                            "A fixed interest payment"
                        ],
                        correct: 1,
                        explanation: "Stock represents equity ownership in a company, not debt or guaranteed returns."
                    }
                ]
            },

            howStocksWork: {
                title: "How Stock Prices Work",
                content: `
Stock prices are determined by **supply and demand** in the market. The price you see is the last transaction price between a buyer and seller.

**Bid-Ask Spread:**

• **Bid Price**: Highest price buyers are willing to pay
• **Ask Price**: Lowest price sellers are willing to accept
• **Spread**: Difference between bid and ask
• **Market Order**: Executes at current bid/ask
• **Mid Price**: Average of bid and ask (often displayed as "current price")

**Example:**
- Bid: $149.50 (buyers want to pay)
- Ask: $150.00 (sellers want to receive)
- Spread: $0.50
- If you BUY: You pay $150.00 (ask)
- If you SELL: You receive $149.50 (bid)

**What Moves Prices:**

1. **Company Performance**: Earnings, revenue, growth
2. **Market Sentiment**: Investor emotions and expectations
3. **Economic Data**: Interest rates, inflation, GDP
4. **News Events**: Product launches, scandals, mergers
5. **Supply & Demand**: More buyers = price up, more sellers = price down

**Market Cap = Share Price × Outstanding Shares**
Example: 1 billion shares × $150/share = $150B market cap
                `,
                quiz: [
                    {
                        question: "When you place a market BUY order, which price do you pay?",
                        options: [
                            "Bid price",
                            "Ask price",
                            "Mid price",
                            "Yesterday's close"
                        ],
                        correct: 1,
                        explanation: "Market buy orders execute at the ask price - what sellers are asking for."
                    }
                ]
            },

            readingCharts: {
                title: "Reading Stock Charts",
                content: `
Stock charts visualize price movements over time. Understanding charts helps you make informed trading decisions.

**Chart Types:**

1. **Line Chart**: Connects closing prices - simplest view
2. **Candlestick Chart**: Shows open, high, low, close (OHLC)
3. **Bar Chart**: Similar to candlestick, different visual

**Candlestick Anatomy:**
• **Body**: Space between open and close
• **Wick/Shadow**: High and low extremes
• **Green Candle**: Close > Open (bullish)
• **Red Candle**: Close < Open (bearish)

**Key Indicators:**

• **Volume**: Number of shares traded
  - High volume = strong conviction
  - Low volume = weak/uncertain move

• **Moving Averages**: Average price over period
  - 50-day MA: Short-term trend
  - 200-day MA: Long-term trend
  - Golden Cross: 50-day crosses above 200-day (bullish)
  - Death Cross: 50-day crosses below 200-day (bearish)

• **Support**: Price level where buying interest emerges
• **Resistance**: Price level where selling pressure appears

• **Trends**:
  - Uptrend: Higher highs, higher lows
  - Downtrend: Lower highs, lower lows
  - Sideways: Trading in range
                `,
                quiz: [
                    {
                        question: "What does a green candlestick indicate?",
                        options: [
                            "Price went down that period",
                            "Price closed higher than it opened",
                            "High trading volume",
                            "A buy signal"
                        ],
                        correct: 1,
                        explanation: "Green candles show the closing price was higher than the opening price for that period."
                    }
                ]
            }
        }
    },

    // TRADING MECHANICS
    tradingMechanics: {
        title: "Trading Mechanics",
        icon: "⚙️",
        topics: {
            buyingStocks: {
                title: "How to Buy Stocks",
                content: `
**The Buy Process:**

1. **Research**: Analyze the company
2. **Decide Quantity**: How many shares?
3. **Choose Order Type**: Market, limit, etc.
4. **Execute**: Place your order
5. **Monitor**: Track your investment

**Important Concepts:**

**Position Sizing:**
- Never invest more than you can afford to lose
- Diversify across multiple stocks
- Common rule: Max 5-10% per position

**Cost Basis:**
Your average purchase price per share. Critical for tracking profit/loss.

Example:
- Buy 100 shares @ $50 = $5,000
- Buy 50 shares @ $60 = $3,000
- Total: 150 shares, $8,000 cost
- Cost Basis: $8,000 / 150 = $53.33/share

**Dollar-Cost Averaging (DCA):**
Invest fixed amount regularly regardless of price
- Reduces timing risk
- Averages out volatility
- Good for long-term investing

**When to Buy:**
✅ After thorough research
✅ When you believe price will rise
✅ When fundamentals support growth
✅ During market dips (if confident)

❌ On pure hype
❌ Chasing rapid price increases
❌ Based on tips without research
❌ With money you can't afford to lose
                `
            },

            sellingStocks: {
                title: "When and How to Sell",
                content: `
Selling is harder than buying. You need a clear strategy.

**Reasons to Sell:**

1. **Hit Price Target**: Reached your profit goal
2. **Fundamentals Changed**: Company deteriorating
3. **Better Opportunity**: Capital needed elsewhere
4. **Stop-Loss Triggered**: Cut losses
5. **Rebalancing**: Maintain portfolio allocation

**Selling Strategies:**

**1. Profit Taking:**
- Sell 25-50% when up 20%+
- Let rest run with trailing stop
- Lock in gains, reduce risk

**2. Cut Losses:**
- Exit if down 7-10% (common rule)
- Don't hope for recovery
- Preserve capital for better trades

**3. Trailing Stop:**
- Follows price up
- Sells on reversal
- Protects profits

**Tax Considerations:**

**Short-term** (< 1 year held):
- Taxed as ordinary income
- Higher tax rate
- 0-37% depending on bracket

**Long-term** (> 1 year held):
- Preferential tax treatment
- 0%, 15%, or 20% rate
- Tax-efficient

**Psychology of Selling:**
- Don't fall in love with stocks
- Don't let emotions drive decisions
- Have exit plan before buying
- Review positions regularly
                `
            },

            shortSelling: {
                title: "Short Selling Explained",
                content: `
Short selling = Betting a stock will go DOWN

**How It Works:**

1. **Borrow** shares from broker
2. **Sell** borrowed shares immediately
3. **Wait** for price to drop
4. **Buy back** shares at lower price
5. **Return** shares to broker
6. **Keep** the difference as profit

**Example:**

1. Short 100 shares of XYZ @ $100
   - You receive: $10,000
   - You owe: 100 shares

2. Price drops to $80
   - Buy back 100 shares for $8,000
   - Return shares to broker
   - Profit: $10,000 - $8,000 = $2,000

**If Wrong:**

1. Short 100 shares @ $100
2. Price RISES to $120
3. Must buy back at $120 = $12,000
4. Loss: $10,000 - $12,000 = -$2,000

**Key Risks:**

⚠️ **Unlimited Loss Potential**
- Stock can rise infinitely
- Losses have no cap
- Much riskier than buying

⚠️ **Margin Requirements**
- Need margin account
- Must maintain minimum balance
- Can face margin calls

⚠️ **Short Squeeze**
- Many shorts + price rise = panic buying
- Shorts forced to cover = price spikes
- Can cause massive losses

**When to Short:**
✅ Company fundamentals deteriorating
✅ Overvalued on metrics
✅ Industry in decline
✅ Accounting irregularities

❌ Don't short on hype alone
❌ Avoid heavily shorted stocks
❌ Don't short strong uptrends
                `,
                quiz: [
                    {
                        question: "What is the maximum profit when shorting a stock?",
                        options: [
                            "Unlimited",
                            "100% (stock goes to $0)",
                            "The initial margin",
                            "Depends on the broker"
                        ],
                        correct: 1,
                        explanation: "Maximum profit from shorting is 100% - when the stock goes to $0. But losses can be unlimited if price rises."
                    },
                    {
                        question: "What is a short squeeze?",
                        options: [
                            "When short sellers make huge profits",
                            "When shorts are forced to buy back, driving price higher",
                            "A type of margin call",
                            "When a company announces bad news"
                        ],
                        correct: 1,
                        explanation: "A short squeeze happens when rising prices force short sellers to buy back shares to limit losses, creating more upward pressure."
                    }
                ]
            },

            marginTrading: {
                title: "Margin Trading & Leverage",
                content: `
Margin = Borrowing money from your broker to buy more stocks

**How Margin Works:**

Without Margin:
- Your cash: $10,000
- Can buy: $10,000 of stock

With 2:1 Margin:
- Your cash: $10,000
- Broker lends: $10,000
- Can buy: $20,000 of stock

**Example - Profit Amplified:**

Stock rises 20%:
- Without margin: $10,000 → $12,000 = $2,000 profit (20%)
- With margin: $20,000 → $24,000 = $4,000 profit (40% on your money!)

**Example - Losses Amplified:**

Stock falls 20%:
- Without margin: $10,000 → $8,000 = -$2,000 loss (-20%)
- With margin: $20,000 → $16,000 = -$4,000 loss (-40% on your money!)

**Key Terms:**

**Margin Requirement**: Amount you must deposit
- Initial Margin: 50% (Reg T in US)
- Maintenance Margin: 25-30%

**Buying Power**: Total you can purchase
- If 2:1 margin: Buying power = Cash × 2

**Margin Call**: When equity falls below minimum
- Must deposit more cash OR
- Sell positions to meet requirement

**Interest**: Charged on borrowed amount
- Usually 5-10% annual rate
- Eats into profits

**Risks of Margin:**

⚠️ **Amplified Losses**
- Can lose MORE than you invested
- Debt remains even if stock goes to $0

⚠️ **Margin Calls**
- Forced liquidation at bad prices
- Can happen during market crashes

⚠️ **Interest Costs**
- Compounds over time
- Reduces returns

**When to Use Margin:**
✅ Short-term trades with high conviction
✅ Hedging strategies
✅ Experienced traders only

❌ Long-term holds (interest adds up)
❌ Volatile stocks
❌ Beginners
❌ Can't afford to lose
                `,
                quiz: [
                    {
                        question: "With 2:1 margin and $5,000 cash, what's your buying power?",
                        options: [
                            "$2,500",
                            "$5,000",
                            "$10,000",
                            "$15,000"
                        ],
                        correct: 2,
                        explanation: "With 2:1 margin, you can buy double your cash: $5,000 × 2 = $10,000 buying power."
                    }
                ]
            }
        }
    },

    // OPTIONS TRADING
    options: {
        title: "Options Trading",
        icon: "🎯",
        topics: {
            optionsBasics: {
                title: "Options Fundamentals",
                content: `
An option is a CONTRACT giving you the RIGHT (not obligation) to buy or sell stock at a specific price by a specific date.

**Two Types:**

**CALL Option** = Right to BUY
- You're bullish (expect price to rise)
- Profit when stock goes UP
- Example: Right to buy AAPL at $150

**PUT Option** = Right to SELL
- You're bearish (expect price to fall)
- Profit when stock goes DOWN
- Example: Right to sell AAPL at $150

**Key Terms:**

• **Strike Price**: Price you can buy/sell at
• **Expiration**: Date option expires (worthless after)
• **Premium**: Price you pay for the option
• **Contract**: 1 contract = 100 shares
• **In-the-Money (ITM)**: Option has intrinsic value
• **Out-of-the-Money (OTM)**: No intrinsic value
• **At-the-Money (ATM)**: Strike ≈ stock price

**Call Option Example:**

Buy 1 AAPL Call:
- Strike: $150
- Expiration: 30 days
- Premium: $5/share
- Cost: $5 × 100 = $500

Scenario 1 - Stock rises to $160:
- Exercise: Buy at $150, sell at $160
- Profit: ($160-$150) × 100 - $500 = $500

Scenario 2 - Stock stays at $145:
- Don't exercise (lose less)
- Loss: $500 premium

**Put Option Example:**

Buy 1 TSLA Put:
- Strike: $200
- Premium: $8/share
- Cost: $800

Scenario 1 - Stock drops to $180:
- Exercise: Sell at $200 (bought at $180)
- Profit: ($200-$180) × 100 - $800 = $1,200

Scenario 2 - Stock rises to $220:
- Don't exercise
- Loss: $800 premium

**Max Risk for Buyers:**
Always limited to premium paid!
                `,
                quiz: [
                    {
                        question: "What is the maximum loss when BUYING a call option?",
                        options: [
                            "Unlimited",
                            "The strike price",
                            "The premium paid",
                            "The stock price"
                        ],
                        correct: 2,
                        explanation: "When buying options, your maximum loss is always the premium you paid. You can't lose more than that."
                    }
                ]
            },

            optionsGreeks: {
                title: "Understanding Options Greeks",
                content: `
Greeks measure how option prices change with different factors.

**DELTA (Δ)** - Stock Price Sensitivity
• How much option price changes per $1 stock move
• Call delta: 0 to 1
• Put delta: -1 to 0
• Example: Delta 0.50 = option moves $0.50 per $1 stock move

**GAMMA (Γ)** - Delta Sensitivity
• How much delta changes per $1 stock move
• Highest for at-the-money options
• Measures acceleration of price change
• High gamma = delta changes rapidly

**THETA (Θ)** - Time Decay
• How much option loses per day
• Always negative for buyers
• Accelerates as expiration approaches
• Example: Theta -0.05 = lose $5/day per contract

**VEGA (V)** - Volatility Sensitivity
• How much option price changes per 1% volatility change
• Higher for longer-dated options
• Same sign for calls and puts
• Example: Vega 0.10 = +$10 per 1% volatility increase

**RHO (ρ)** - Interest Rate Sensitivity
• How much option price changes per 1% rate change
• Usually smallest impact
• Matters more for long-dated options

**Practical Examples:**

**Buying Call Before Earnings:**
- High vega (benefits from volatility)
- Positive delta (benefits from price rise)
- Negative theta (loses value daily)
- Strategy: Expecting big move, willing to pay premium

**Selling Put in Stable Market:**
- Positive theta (collect decay daily)
- Negative vega (want low volatility)
- Negative delta (hurts if stock drops)
- Strategy: Generate income, willing to own stock
                `
            },

            optionsStrategies: {
                title: "Common Options Strategies",
                content: `
**BEGINNER STRATEGIES:**

**1. Long Call (Bullish)**
- Buy call option
- Max risk: Premium
- Max profit: Unlimited
- When: Expect strong rise

**2. Long Put (Bearish)**
- Buy put option
- Max risk: Premium
- Max profit: Strike - premium
- When: Expect strong fall

**3. Covered Call (Income)**
- Own stock + Sell call
- Max risk: Stock drops (offset by premium)
- Max profit: Strike - stock price + premium
- When: Neutral/slightly bullish, want income

**4. Protective Put (Insurance)**
- Own stock + Buy put
- Max risk: Premium paid
- Max profit: Unlimited (from stock)
- When: Protect downside while keeping upside

**INTERMEDIATE STRATEGIES:**

**5. Bull Call Spread**
- Buy low strike call + Sell high strike call
- Max risk: Net premium
- Max profit: Spread width - premium
- When: Moderately bullish, reduce cost

**6. Bear Put Spread**
- Buy high strike put + Sell low strike put
- Max risk: Net premium
- Max profit: Spread width - premium
- When: Moderately bearish, reduce cost

**7. Iron Condor**
- Sell OTM call + Buy farther OTM call
- Sell OTM put + Buy farther OTM put
- Max risk: Wing width - credit
- Max profit: Net premium collected
- When: Expect low volatility

**8. Straddle**
- Buy call + put at same strike
- Max risk: Total premiums
- Max profit: Unlimited
- When: Expect big move, unsure direction

**Strategy Selection Guide:**

Market Outlook → Strategy
- Strong Bull → Long Call
- Strong Bear → Long Put
- Moderate Bull → Bull Spread
- Moderate Bear → Bear Spread
- Volatile → Straddle
- Stable → Iron Condor / Covered Call
                `
            }
        }
    },

    // RISK MANAGEMENT
    riskManagement: {
        title: "Risk Management",
        icon: "🛡️",
        topics: {
            positionSizing: {
                title: "Position Sizing & Diversification",
                content: `
**The #1 Rule: Never risk money you can't afford to lose**

**Position Sizing Guidelines:**

**Conservative Approach:**
- Max 2-3% of portfolio per position
- 10-15+ different stocks
- Focus on blue chips

**Moderate Approach:**
- Max 5% per position
- 8-12 different stocks
- Mix of growth and value

**Aggressive Approach:**
- Max 10% per position
- 5-8 stocks
- Higher risk tolerance required

**Example Portfolio ($100,000):**

Conservative:
- 15 positions
- $6,667 each (6.67%)
- Low correlation sectors

**Diversification Strategies:**

**By Sector:**
- Tech: 25%
- Healthcare: 20%
- Finance: 15%
- Consumer: 15%
- Energy: 10%
- Other: 15%

**By Market Cap:**
- Large Cap (>$200B): 50%
- Mid Cap ($10-200B): 30%
- Small Cap (<$10B): 20%

**By Strategy:**
- Growth: 40%
- Value: 30%
- Dividend: 20%
- Speculative: 10%

**Correlation Matters:**
Don't put 100% in tech stocks
- If sector crashes, you're wiped out
- Diversify across industries
- Include defensive stocks

**Rebalancing:**
- Review quarterly
- Trim winners, add to losers
- Maintain target allocations
                `
            },

            stopLosses: {
                title: "Stop-Losses & Take-Profits",
                content: `
**Stop-Loss = Your Insurance Policy**

Automatically exit when price hits your limit, preventing catastrophic losses.

**Common Stop-Loss Rules:**

**1. Percentage-Based**
- Set 5-10% below purchase
- Example: Buy @ $100, stop @ $90-95
- Adjusts to position size

**2. Technical-Based**
- Below support level
- Below moving average
- Below recent low

**3. ATR-Based (Advanced)**
- Average True Range
- Accounts for volatility
- 2× ATR below entry

**4. Trailing Stop**
- Follows price up
- Locks in profits
- Example: 10% trail
  - Buy @ $100
  - Stock → $120
  - Stop → $108 (10% below $120)

**Take-Profit Strategies:**

**1. Fixed Target**
- Exit at predetermined price
- Example: +20% gain
- Emotion-free

**2. Risk-Reward Ratio**
- Set target based on risk
- Example: Risk $5 to make $15 (3:1)
- Stop: $95, Entry: $100, Target: $115

**3. Fibonacci Levels**
- Use technical levels
- 161.8%, 261.8% extensions
- Common in trend trades

**4. Partial Profit Taking**
- Sell 25% at +20%
- Sell 25% at +40%
- Sell 25% at +60%
- Let 25% run
- Balances profits and potential

**Real Example:**

Entry: $50
Stop-Loss: $45 (10% risk)
Target: $65 (30% profit)
Risk-Reward: 3:1

Outcome if hit stop: -$5/share
Outcome if hit target: +$15/share

If 33% win rate @ 3:1 RR → Profitable!
                `
            }
        }
    }
};

/**
 * Get all education topics organized by category
 */
function getAllEducationTopics() {
    return stockEducation;
}

/**
 * Get specific topic content
 */
function getTopicContent(category, topicKey) {
    return stockEducation[category]?.topics[topicKey] || null;
}

/**
 * Get interactive quiz for topic
 */
function getTopicQuiz(category, topicKey) {
    const topic = getTopicContent(category, topicKey);
    return topic?.quiz || [];
}

/**
 * Calculate quiz score
 */
function gradeQuiz(category, topicKey, answers) {
    const quiz = getTopicQuiz(category, topicKey);
    if (!quiz || quiz.length === 0) return null;

    let correct = 0;
    const results = quiz.map((question, index) => {
        const isCorrect = answers[index] === question.correct;
        if (isCorrect) correct++;
        return {
            question: question.question,
            userAnswer: answers[index],
            correctAnswer: question.correct,
            isCorrect,
            explanation: question.explanation
        };
    });

    return {
        score: correct,
        total: quiz.length,
        percentage: (correct / quiz.length) * 100,
        results
    };
}

// Export for use in main app
if (typeof window !== 'undefined') {
    window.stockEducation = {
        getAllEducationTopics,
        getTopicContent,
        getTopicQuiz,
        gradeQuiz
    };
}
