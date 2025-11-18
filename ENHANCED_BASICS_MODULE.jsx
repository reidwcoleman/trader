// ENHANCED TRADING BASICS MODULE FOR APP.JSX
// This is a complete replacement for the basics learning section starting at line 11304
// Copy this into App.jsx, replacing the existing basics module

// PART 1: ADD THESE NEW STATE VARIABLES AT THE TOP OF YOUR COMPONENT (around line 120-140)
// Add these alongside your existing learning state variables:

const [currentLessonSection, setCurrentLessonSection] = useState(0); // Track current section within lesson
const [expandedSections, setExpandedSections] = useState({}); // Track expanded "Learn More" sections
const [knowledgeChecks, setKnowledgeChecks] = useState({}); // Track inline knowledge check answers
const [showHints, setShowHints] = useState({}); // Track which quiz questions show hints
const [quizAnswerFeedback, setQuizAnswerFeedback] = useState({}); // Track instant feedback for quiz answers
const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0); // Show one question at a time
const [practiceValues, setPracticeValues] = useState({ // For interactive practice sections
    accountSize: 10000,
    riskPercent: 2,
    entryPrice: 150,
    stopLoss: 145
});

// PART 2: ADD THIS ENHANCED QUIZ DATA (replaces existing quizData.basics)
// Add this to your quizData object around line 1131:

const quizDataEnhanced = {
    basics: {
        questions: [
            {
                question: "What does owning a stock represent?",
                options: [
                    "Lending money to a company",
                    "Partial ownership in a company",
                    "A guaranteed profit",
                    "A fixed income payment"
                ],
                correct: 1,
                explanation: "When you buy a stock, you become a partial owner of that company. You own a small piece of the business and can benefit from its growth.",
                hint: "Think about what 'stock' or 'share' means - you're sharing ownership!",
                wrongExplanations: [
                    "That's incorrect. Lending money would be a bond, not a stock.",
                    null, // This is the correct answer
                    "Wrong. Stocks carry risk and have no guaranteed profit.",
                    "Incorrect. Fixed income payments come from bonds, not stocks."
                ]
            },
            {
                question: "Which order type guarantees execution but NOT price?",
                options: [
                    "Limit Order",
                    "Market Order",
                    "Stop-Loss Order",
                    "Good-Till-Cancelled Order"
                ],
                correct: 1,
                explanation: "A Market Order executes immediately at the best available price. It guarantees your order will fill, but you won't know the exact price until after execution.",
                hint: "The word 'market' suggests you're taking whatever the market offers!",
                wrongExplanations: [
                    "No. Limit orders guarantee price but NOT execution.",
                    null, // Correct answer
                    "No. Stop-loss orders trigger at a specific price but execution isn't guaranteed.",
                    "This describes when an order expires, not its execution type."
                ]
            },
            {
                question: "What does a green candlestick indicate?",
                options: [
                    "Price closed lower than it opened",
                    "Price closed higher than it opened",
                    "High trading volume",
                    "The stock is undervalued"
                ],
                correct: 1,
                explanation: "A green (or white) candlestick means the price closed higher than it opened during that time period - a bullish sign.",
                hint: "Green typically means 'go' or positive. Think about the direction!",
                wrongExplanations: [
                    "Wrong. That would be a red candlestick.",
                    null, // Correct
                    "No. Volume is shown separately, not by candle color.",
                    "Incorrect. Candle color shows price movement, not valuation."
                ]
            },
            {
                question: "What happens when a support level breaks?",
                options: [
                    "It disappears completely",
                    "It often becomes a new resistance level",
                    "Price always bounces back immediately",
                    "Volume decreases"
                ],
                correct: 1,
                explanation: "When support breaks, it often becomes resistance through 'role reversal' - previous buyers now become sellers at that level.",
                hint: "Think about psychology: where support failed becomes where sellers wait!",
                wrongExplanations: [
                    "No. The level remains significant, just with a different role.",
                    null, // Correct
                    "Wrong. Broken support often leads to further decline.",
                    "Incorrect. Breakdowns usually occur with increased volume."
                ]
            }
        ]
    }
};

// PART 3: THE COMPLETE ENHANCED BASICS MODULE
// Replace the entire section from line 11304 to approximately line 11960 with this:

{learningTopic === 'basics' && (
    <div className="bg-gradient-to-br from-green-900/60 via-emerald-900/60 to-teal-900/60 rounded-2xl p-8 border-2 border-green-500/50 shadow-2xl">

        {/* Breadcrumb Navigation */}
        <div className="mb-6 flex items-center gap-2 text-sm">
            <button
                onClick={() => setLearningTopic(null)}
                className="text-green-300 hover:text-green-100 transition-colors"
            >
                Learning
            </button>
            <span className="text-green-500">→</span>
            <span className="text-white font-bold">Trading Basics</span>
            <span className="text-green-500">→</span>
            <span className="text-green-200">
                Section {currentLessonSection + 1} of 5
            </span>
        </div>

        {/* Sticky Progress Bar */}
        <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl rounded-xl p-4 mb-6 border-2 border-green-500/30">
            <div className="flex justify-between items-center mb-2">
                <span className="text-white font-bold text-sm">Lesson Progress</span>
                <span className="text-green-300 font-mono text-sm">
                    {Math.round((currentLessonSection / 4) * 100)}%
                </span>
            </div>
            <div className="relative w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500 ease-out"
                    style={{width: `${(currentLessonSection / 4) * 100}%`}}
                />
            </div>
            <div className="mt-3 flex justify-between text-xs text-green-200">
                <span>⏱️ Estimated time: 15 minutes</span>
                <span>📊 Difficulty: Beginner</span>
            </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mb-4 shadow-2xl animate-pulse">
                <span className="text-4xl">📚</span>
            </div>
            <h2 className="text-4xl font-black text-white mb-2">Trading Basics</h2>
            <p className="text-lg text-green-200">Master the fundamentals of stock trading</p>
        </div>

        <style>{`
            @keyframes slideIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes expandIn {
                from { opacity: 0; max-height: 0; }
                to { opacity: 1; max-height: 500px; }
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            @keyframes confetti {
                0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; }
            }
            .animate-slide-in { animation: slideIn 0.5s ease-out; }
            .animate-expand { animation: expandIn 0.3s ease-out; overflow: hidden; }
            .tooltip-term {
                position: relative;
                cursor: help;
                border-bottom: 2px dotted #10b981;
                transition: all 0.2s;
            }
            .tooltip-term:hover {
                color: #10b981;
            }
            .tooltip-content {
                visibility: hidden;
                position: absolute;
                bottom: 125%;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, #065f46 0%, #047857 100%);
                color: white;
                padding: 12px 16px;
                border-radius: 12px;
                font-size: 0.875rem;
                white-space: nowrap;
                z-index: 100;
                border: 2px solid #10b981;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                opacity: 0;
                transition: opacity 0.3s, visibility 0.3s;
            }
            .tooltip-term:hover .tooltip-content {
                visibility: visible;
                opacity: 1;
            }
            .tooltip-content::after {
                content: "";
                position: absolute;
                top: 100%;
                left: 50%;
                margin-left: -8px;
                border-width: 8px;
                border-style: solid;
                border-color: #10b981 transparent transparent transparent;
            }
        `}</style>

        <div className="space-y-6">
            {/* Section 0: What Are Stocks? */}
            <div className={`bg-black/60 backdrop-blur-xl rounded-xl p-6 border-2 ${currentLessonSection === 0 ? 'border-green-400 shadow-2xl' : 'border-green-500/30'}`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-black text-green-400 flex items-center gap-2">
                        <span className={currentLessonSection === 0 ? 'animate-pulse' : ''}>📈</span>
                        Section 1: What Are Stocks?
                    </h3>
                    {currentLessonSection > 0 && (
                        <button
                            onClick={() => setCurrentLessonSection(0)}
                            className="text-green-300 hover:text-green-100 text-sm transition-colors"
                        >
                            ↑ Jump to section
                        </button>
                    )}
                </div>

                <div className={currentLessonSection === 0 ? 'animate-slide-in' : ''}>
                    <div className="space-y-4 text-green-100">
                        <p>
                            A <span className="tooltip-term font-bold text-green-300">
                                stock
                                <span className="tooltip-content">Also called a "share" or "equity" - represents ownership in a company</span>
                            </span> (also called a "share" or "equity") represents fractional ownership in a company. When you buy a stock, you become a partial owner of that business.
                        </p>

                        {/* Expandable "Learn More" Section */}
                        <button
                            onClick={() => setExpandedSections({...expandedSections, stockTypes: !expandedSections.stockTypes})}
                            className="w-full bg-green-900/30 hover:bg-green-900/50 p-4 rounded-lg border-2 border-green-500/30 hover:border-green-400 transition-all text-left flex items-center justify-between group"
                        >
                            <span className="font-bold text-green-300 flex items-center gap-2">
                                <span className="text-xl">💡</span>
                                Learn More: Types of Stocks
                            </span>
                            <span className="text-2xl group-hover:scale-110 transition-transform">
                                {expandedSections.stockTypes ? '▼' : '▶'}
                            </span>
                        </button>

                        {expandedSections.stockTypes && (
                            <div className="animate-expand bg-green-900/20 p-5 rounded-lg border-l-4 border-green-400">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-blue-900/30 p-4 rounded-lg">
                                        <h4 className="font-bold text-blue-300 mb-2">📊 Common Stock</h4>
                                        <p className="text-sm">Most typical type. Gives voting rights and potential dividends.</p>
                                    </div>
                                    <div className="bg-purple-900/30 p-4 rounded-lg">
                                        <h4 className="font-bold text-purple-300 mb-2">👑 Preferred Stock</h4>
                                        <p className="text-sm">Priority for dividends, but usually no voting rights.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-green-900/20 p-4 rounded-lg border-l-4 border-green-400">
                            <p className="font-bold text-green-300 mb-2">Why Do Companies Issue Stocks?</p>
                            <p>Companies sell stocks to raise <span className="tooltip-term">
                                capital
                                <span className="tooltip-content">Money used for business operations, growth, and expansion</span>
                            </span> for growth, expansion, or operations instead of taking out loans.</p>
                        </div>

                        <p className="font-bold text-green-300">Why Do Stock Prices Change?</p>
                        <ul className="space-y-2 ml-4">
                            <li>• <strong>Supply & Demand:</strong> More buyers = price goes up, more sellers = price goes down</li>
                            <li>• <strong>Company Performance:</strong> Strong earnings reports drive prices higher</li>
                            <li>• <strong>Market Sentiment:</strong> News, economic data, and investor psychology</li>
                            <li>• <strong>External Factors:</strong> Interest rates, inflation, geopolitical events</li>
                        </ul>

                        {/* Knowledge Check Mini-Quiz */}
                        <div className="mt-6 bg-yellow-900/30 border-2 border-yellow-500/50 rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-2xl">🤔</span>
                                <h4 className="font-bold text-yellow-300 text-lg">Knowledge Check</h4>
                            </div>
                            <p className="text-white mb-3">When stock price goes up, what usually caused it?</p>
                            <div className="space-y-2">
                                {['More sellers than buyers', 'More buyers than sellers', 'Company is losing money'].map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setKnowledgeChecks({...knowledgeChecks, s1q1: idx})}
                                        className={`w-full text-left p-3 rounded-lg transition-all ${
                                            knowledgeChecks.s1q1 === idx
                                                ? idx === 1
                                                    ? 'bg-green-500/50 border-2 border-green-400 text-white'
                                                    : 'bg-red-500/50 border-2 border-red-400 text-white'
                                                : 'bg-black/40 border-2 border-yellow-600/30 hover:border-yellow-400'
                                        }`}
                                    >
                                        {option}
                                        {knowledgeChecks.s1q1 === idx && (
                                            <span className="ml-2">
                                                {idx === 1 ? '✅ Correct!' : '❌ Try again!'}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                            {knowledgeChecks.s1q1 === 1 && (
                                <div className="mt-3 bg-green-900/30 p-3 rounded-lg border-l-4 border-green-400 animate-slide-in">
                                    <p className="text-green-200 text-sm">
                                        💡 Exactly! More demand (buyers) than supply (sellers) drives prices up. This is basic economics!
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="bg-emerald-900/20 p-4 rounded-lg border-l-4 border-emerald-400 mt-4">
                            <p className="font-bold text-emerald-300">💡 Key Concept</p>
                            <p>The goal of trading is to <strong>buy low and sell high</strong>. However, timing the market perfectly is extremely difficult, which is why risk management is crucial.</p>
                        </div>
                    </div>

                    {currentLessonSection === 0 && (
                        <button
                            onClick={() => setCurrentLessonSection(1)}
                            className="mt-6 w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
                        >
                            Continue to Next Section
                            <span className="text-xl">→</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Section 1: Market Hours & Order Types */}
            <div className={`bg-black/60 backdrop-blur-xl rounded-xl p-6 border-2 ${currentLessonSection === 1 ? 'border-green-400 shadow-2xl' : 'border-green-500/30'}`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-black text-green-400 flex items-center gap-2">
                        <span className={currentLessonSection === 1 ? 'animate-pulse' : ''}>⏰</span>
                        Section 2: Market Hours & Order Types
                    </h3>
                    {currentLessonSection !== 1 && (
                        <button
                            onClick={() => setCurrentLessonSection(1)}
                            className="text-green-300 hover:text-green-100 text-sm transition-colors"
                        >
                            ↑ Jump to section
                        </button>
                    )}
                </div>

                {currentLessonSection >= 1 && (
                    <div className="animate-slide-in space-y-4 text-green-100">
                        <p className="font-bold text-green-300">Regular Market Hours (EST):</p>
                        <ul className="space-y-2 ml-4">
                            <li>• <strong>Pre-Market:</strong> 4:00 AM - 9:30 AM</li>
                            <li>• <strong>Regular Hours:</strong> 9:30 AM - 4:00 PM</li>
                            <li>• <strong>After-Hours:</strong> 4:00 PM - 8:00 PM</li>
                        </ul>

                        <div className="bg-orange-900/30 border-2 border-orange-500/50 rounded-lg p-4">
                            <p className="font-bold text-orange-300 mb-2">⚠️ Pro Tip</p>
                            <p className="text-sm">Most <span className="tooltip-term">
                                volatility
                                <span className="tooltip-content">How much and how quickly prices change</span>
                            </span> happens in the first hour (9:30-10:30 AM) and last hour (3:00-4:00 PM). Beginners should avoid these times!</p>
                        </div>

                        <p className="font-bold text-green-300 mt-6">Order Types:</p>
                        <div className="space-y-3">
                            <div className="bg-cyan-900/20 p-4 rounded-lg border-l-4 border-cyan-400">
                                <p className="font-bold text-cyan-300 mb-2">Market Order</p>
                                <p className="mb-2">Executes immediately at the best available price. Guarantees execution but not price.</p>
                                <button
                                    onClick={() => setExpandedSections({...expandedSections, marketOrder: !expandedSections.marketOrder})}
                                    className="text-cyan-300 hover:text-cyan-100 text-sm font-bold transition-colors"
                                >
                                    {expandedSections.marketOrder ? '▼ Hide Example' : '▶ Show Example'}
                                </button>
                                {expandedSections.marketOrder && (
                                    <div className="animate-expand mt-3 bg-cyan-900/30 p-3 rounded-lg text-sm">
                                        <p className="text-cyan-200">
                                            Example: Stock is trading at $100.00. You place a market order to buy.
                                            By the time it executes (milliseconds later), price might be $100.05 or $99.95.
                                            You accept whatever price the market offers.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-400">
                                <p className="font-bold text-blue-300 mb-2">Limit Order</p>
                                <p className="mb-2">Executes only at your specified price or better. Guarantees price but not execution.</p>
                                <button
                                    onClick={() => setExpandedSections({...expandedSections, limitOrder: !expandedSections.limitOrder})}
                                    className="text-blue-300 hover:text-blue-100 text-sm font-bold transition-colors"
                                >
                                    {expandedSections.limitOrder ? '▼ Hide Example' : '▶ Show Example'}
                                </button>
                                {expandedSections.limitOrder && (
                                    <div className="animate-expand mt-3 bg-blue-900/30 p-3 rounded-lg text-sm">
                                        <p className="text-blue-200">
                                            Example: Stock is $100. You set a limit buy at $98. Your order only fills if price drops to $98 or lower.
                                            If price stays above $98, your order never executes.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-purple-900/20 p-4 rounded-lg border-l-4 border-purple-400">
                                <p className="font-bold text-purple-300 mb-2">Stop-Loss Order</p>
                                <p>Automatically sells when price drops to a specified level, limiting your loss.</p>
                            </div>
                        </div>

                        {/* Interactive Practice: Order Type Selection */}
                        <div className="mt-6 bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-2 border-purple-500/50 rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-2xl">🎯</span>
                                <h4 className="font-bold text-purple-300 text-lg">Try It Yourself: Choose the Right Order</h4>
                            </div>
                            <p className="text-white mb-4">Scenario: AAPL is at $150. You want to buy, but only if it drops to $145 or lower. Which order do you use?</p>
                            <div className="space-y-2">
                                {[
                                    {name: 'Market Order', correct: false, explanation: 'No - this would buy immediately at $150'},
                                    {name: 'Limit Order at $145', correct: true, explanation: 'Correct! This only executes at $145 or better'},
                                    {name: 'Stop-Loss at $145', correct: false, explanation: 'No - stop-loss is for selling, not buying'}
                                ].map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setKnowledgeChecks({...knowledgeChecks, s2practice: idx})}
                                        className={`w-full text-left p-3 rounded-lg transition-all ${
                                            knowledgeChecks.s2practice === idx
                                                ? option.correct
                                                    ? 'bg-green-500/50 border-2 border-green-400'
                                                    : 'bg-red-500/50 border-2 border-red-400'
                                                : 'bg-black/40 border-2 border-purple-600/30 hover:border-purple-400'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-white">{option.name}</span>
                                            {knowledgeChecks.s2practice === idx && (
                                                <span>{option.correct ? '✅' : '❌'}</span>
                                            )}
                                        </div>
                                        {knowledgeChecks.s2practice === idx && (
                                            <p className="text-sm mt-2 text-white/90">{option.explanation}</p>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {currentLessonSection === 1 && (
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setCurrentLessonSection(0)}
                                    className="flex-1 bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-500 hover:to-gray-400 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                                >
                                    <span className="text-xl">←</span>
                                    Previous Section
                                </button>
                                <button
                                    onClick={() => setCurrentLessonSection(2)}
                                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                                >
                                    Continue to Charts
                                    <span className="text-xl">→</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Section 2: Reading Charts */}
            <div className={`bg-black/60 backdrop-blur-xl rounded-xl p-6 border-2 ${currentLessonSection === 2 ? 'border-green-400 shadow-2xl' : 'border-green-500/30'}`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-black text-green-400 flex items-center gap-2">
                        <span className={currentLessonSection === 2 ? 'animate-pulse' : ''}>📊</span>
                        Section 3: Reading Stock Charts
                    </h3>
                    {currentLessonSection !== 2 && (
                        <button
                            onClick={() => setCurrentLessonSection(2)}
                            className="text-green-300 hover:text-green-100 text-sm transition-colors"
                        >
                            ↑ Jump to section
                        </button>
                    )}
                </div>

                {currentLessonSection >= 2 && (
                    <div className="animate-slide-in space-y-4 text-green-100">
                        <p><strong className="text-green-300">Candlestick charts</strong> are the most popular way to visualize stock prices. Each <span className="tooltip-term">
                            candle
                            <span className="tooltip-content">One candlestick represents price action during a specific time period</span>
                        </span> shows:</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-green-900/20 p-4 rounded-lg border-2 border-green-400">
                                <p className="font-bold text-green-300 mb-2">🟢 Green Candle (Bullish)</p>
                                <ul className="space-y-1 text-sm">
                                    <li>• Opened low, closed high</li>
                                    <li>• Price went UP during period</li>
                                    <li>• Buyers won the battle</li>
                                </ul>
                            </div>
                            <div className="bg-red-900/20 p-4 rounded-lg border-2 border-red-400">
                                <p className="font-bold text-red-300 mb-2">🔴 Red Candle (Bearish)</p>
                                <ul className="space-y-1 text-sm">
                                    <li>• Opened high, closed low</li>
                                    <li>• Price went DOWN during period</li>
                                    <li>• Sellers won the battle</li>
                                </ul>
                            </div>
                        </div>

                        {/* Interactive Candlestick Builder */}
                        <div className="mt-6 bg-gradient-to-br from-orange-900/40 to-yellow-900/40 border-2 border-orange-500/50 rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-2xl">🎨</span>
                                <h4 className="font-bold text-orange-300 text-lg">Interactive Practice: Build a Candlestick</h4>
                            </div>
                            <p className="text-white mb-4">A stock opened at $100 and closed at $110. What color is the candle?</p>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setKnowledgeChecks({...knowledgeChecks, candleColor: 'green'})}
                                    className={`p-6 rounded-xl transition-all border-2 ${
                                        knowledgeChecks.candleColor === 'green'
                                            ? 'bg-green-500/50 border-green-400 scale-105'
                                            : 'bg-green-900/20 border-green-600/30 hover:border-green-400'
                                    }`}
                                >
                                    <div className="text-4xl mb-2">🟢</div>
                                    <div className="font-bold text-white">Green</div>
                                </button>
                                <button
                                    onClick={() => setKnowledgeChecks({...knowledgeChecks, candleColor: 'red'})}
                                    className={`p-6 rounded-xl transition-all border-2 ${
                                        knowledgeChecks.candleColor === 'red'
                                            ? 'bg-red-500/50 border-red-400 scale-105'
                                            : 'bg-red-900/20 border-red-600/30 hover:border-red-400'
                                    }`}
                                >
                                    <div className="text-4xl mb-2">🔴</div>
                                    <div className="font-bold text-white">Red</div>
                                </button>
                            </div>
                            {knowledgeChecks.candleColor === 'green' && (
                                <div className="mt-4 bg-green-900/30 p-4 rounded-lg border-l-4 border-green-400 animate-slide-in">
                                    <p className="text-green-200">
                                        ✅ Perfect! The stock closed HIGHER ($110) than it opened ($100), so it's a green/bullish candle.
                                        The price went UP during that period!
                                    </p>
                                </div>
                            )}
                            {knowledgeChecks.candleColor === 'red' && (
                                <div className="mt-4 bg-red-900/30 p-4 rounded-lg border-l-4 border-red-400 animate-slide-in">
                                    <p className="text-red-200">
                                        ❌ Not quite! The stock opened at $100 and closed at $110. That's an INCREASE, so it's a green candle, not red.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-400 mt-4">
                            <p className="font-bold text-blue-300">Volume Matters!</p>
                            <p>High <span className="tooltip-term">
                                volume
                                <span className="tooltip-content">Number of shares traded - higher volume = more conviction</span>
                            </span> confirms strong moves. Low volume suggests weak moves that may reverse.</p>
                        </div>

                        {currentLessonSection === 2 && (
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setCurrentLessonSection(1)}
                                    className="flex-1 bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-500 hover:to-gray-400 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                                >
                                    <span className="text-xl">←</span>
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentLessonSection(3)}
                                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                                >
                                    Support & Resistance
                                    <span className="text-xl">→</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Section 3: Support & Resistance */}
            <div className={`bg-black/60 backdrop-blur-xl rounded-xl p-6 border-2 ${currentLessonSection === 3 ? 'border-green-400 shadow-2xl' : 'border-green-500/30'}`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-black text-green-400 flex items-center gap-2">
                        <span className={currentLessonSection === 3 ? 'animate-pulse' : ''}>🎯</span>
                        Section 4: Support & Resistance Levels
                    </h3>
                    {currentLessonSection !== 3 && (
                        <button
                            onClick={() => setCurrentLessonSection(3)}
                            className="text-green-300 hover:text-green-100 text-sm transition-colors"
                        >
                            ↑ Jump to section
                        </button>
                    )}
                </div>

                {currentLessonSection >= 3 && (
                    <div className="animate-slide-in space-y-4 text-green-100">
                        <p><strong className="text-green-300">Support</strong> and <strong className="text-green-300">Resistance</strong> are key price levels where stock prices tend to bounce or reverse.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-green-900/20 p-4 rounded-lg border-2 border-green-400">
                                <p className="font-bold text-green-300 mb-2">📊 Support Level</p>
                                <p className="text-sm mb-2">Price level where buying pressure prevents further downward movement.</p>
                                <p className="text-sm text-green-200">Think of it as a "floor" - price bounces up from support.</p>
                                <p className="text-xs text-green-300 mt-2">Example: Stock repeatedly bounces at $50 → $50 is support</p>
                            </div>
                            <div className="bg-red-900/20 p-4 rounded-lg border-2 border-red-400">
                                <p className="font-bold text-red-300 mb-2">📊 Resistance Level</p>
                                <p className="text-sm mb-2">Price level where selling pressure prevents further upward movement.</p>
                                <p className="text-sm text-red-200">Think of it as a "ceiling" - price gets rejected at resistance.</p>
                                <p className="text-xs text-red-300 mt-2">Example: Stock repeatedly fails at $60 → $60 is resistance</p>
                            </div>
                        </div>

                        {/* Interactive Practice: Identify Support/Resistance */}
                        <div className="mt-6 bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border-2 border-cyan-500/50 rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-2xl">🎯</span>
                                <h4 className="font-bold text-cyan-300 text-lg">Practice: Identify the Level</h4>
                            </div>
                            <p className="text-white mb-4">
                                A stock keeps falling to $45, bouncing back up each time. What is $45?
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setKnowledgeChecks({...knowledgeChecks, srLevel: 'support'})}
                                    className={`p-5 rounded-xl transition-all border-2 ${
                                        knowledgeChecks.srLevel === 'support'
                                            ? 'bg-green-500/50 border-green-400 scale-105'
                                            : 'bg-green-900/20 border-green-600/30 hover:border-green-400'
                                    }`}
                                >
                                    <div className="font-bold text-white mb-2">Support</div>
                                    <div className="text-sm text-green-200">Price floor / bounces up</div>
                                </button>
                                <button
                                    onClick={() => setKnowledgeChecks({...knowledgeChecks, srLevel: 'resistance'})}
                                    className={`p-5 rounded-xl transition-all border-2 ${
                                        knowledgeChecks.srLevel === 'resistance'
                                            ? 'bg-red-500/50 border-red-400 scale-105'
                                            : 'bg-red-900/20 border-red-600/30 hover:border-red-400'
                                    }`}
                                >
                                    <div className="font-bold text-white mb-2">Resistance</div>
                                    <div className="text-sm text-red-200">Price ceiling / gets rejected</div>
                                </button>
                            </div>
                            {knowledgeChecks.srLevel === 'support' && (
                                <div className="mt-4 bg-green-900/30 p-4 rounded-lg border-l-4 border-green-400 animate-slide-in">
                                    <p className="text-green-200">
                                        ✅ Exactly! When price repeatedly bounces UP from a level, that's support. It acts as a floor preventing further decline.
                                        Buyers step in at $45 every time!
                                    </p>
                                </div>
                            )}
                            {knowledgeChecks.srLevel === 'resistance' && (
                                <div className="mt-4 bg-red-900/30 p-4 rounded-lg border-l-4 border-red-400 animate-slide-in">
                                    <p className="text-red-200">
                                        ❌ Not quite! The stock is BOUNCING UP from $45, making it support (a floor).
                                        Resistance would be if the stock kept FAILING to break above a level.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="bg-purple-900/20 p-4 rounded-lg border-l-4 border-purple-400 mt-4">
                            <p className="font-bold text-purple-300 mb-2">🔄 Role Reversal</p>
                            <p className="text-sm">When <span className="tooltip-term">
                                support breaks
                                <span className="tooltip-content">Price falls below a support level with conviction (usually high volume)</span>
                            </span>, it becomes resistance. When resistance breaks, it becomes support!</p>
                        </div>

                        <button
                            onClick={() => setExpandedSections({...expandedSections, roleReversal: !expandedSections.roleReversal})}
                            className="w-full bg-purple-900/30 hover:bg-purple-900/50 p-4 rounded-lg border-2 border-purple-500/30 hover:border-purple-400 transition-all text-left flex items-center justify-between group"
                        >
                            <span className="font-bold text-purple-300 flex items-center gap-2">
                                <span className="text-xl">💡</span>
                                Learn More: Why Role Reversal Happens
                            </span>
                            <span className="text-2xl group-hover:scale-110 transition-transform">
                                {expandedSections.roleReversal ? '▼' : '▶'}
                            </span>
                        </button>

                        {expandedSections.roleReversal && (
                            <div className="animate-expand bg-purple-900/20 p-5 rounded-lg border-l-4 border-purple-400">
                                <p className="mb-3">
                                    Role reversal happens due to <strong>trader psychology</strong>:
                                </p>
                                <ul className="space-y-2 text-sm">
                                    <li>
                                        <strong className="text-purple-300">When support breaks:</strong> Traders who bought at support are now underwater and want to "break even."
                                        If price returns to that level, they sell (creating resistance).
                                    </li>
                                    <li>
                                        <strong className="text-purple-300">When resistance breaks:</strong> Price breaking through shows strong demand.
                                        That level now attracts buyers who missed the breakout (creating support).
                                    </li>
                                </ul>
                            </div>
                        )}

                        {currentLessonSection === 3 && (
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setCurrentLessonSection(2)}
                                    className="flex-1 bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-500 hover:to-gray-400 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                                >
                                    <span className="text-xl">←</span>
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentLessonSection(4)}
                                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                                >
                                    Take the Quiz
                                    <span className="text-xl">🎓</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Section 4: ENHANCED QUIZ */}
            {currentLessonSection >= 4 && (
                <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 backdrop-blur-xl rounded-xl p-8 border-2 border-purple-500/50 mt-8 animate-slide-in">
                    <div className="text-center mb-6">
                        <div className="text-5xl mb-4 animate-pulse">🎓</div>
                        <h3 className="text-3xl font-black text-white mb-2">Test Your Knowledge</h3>
                        <p className="text-purple-200">Complete this quiz to check your understanding of Trading Basics</p>
                    </div>

                    {!quizSubmitted.basics && (
                        <>
                            {/* Progress Indicator */}
                            <div className="mb-8 bg-black/40 rounded-xl p-6 border-2 border-purple-400/30">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-white font-bold text-lg">Quiz Progress</span>
                                    <span className="text-purple-300 font-mono">
                                        Question {currentQuizQuestion + 1} of 4
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                <div className="relative w-full h-4 bg-gray-800 rounded-full overflow-hidden mb-4">
                                    <div
                                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500 ease-out"
                                        style={{width: `${((currentQuizQuestion + 1) / 4) * 100}%`}}
                                    />
                                </div>

                                {/* Question Dots */}
                                <div className="flex gap-3 justify-center">
                                    {[0, 1, 2, 3].map(num => (
                                        <div
                                            key={num}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 cursor-pointer ${
                                                quizAnswers.basics?.[`q${num + 1}`] !== undefined
                                                    ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white scale-110 shadow-lg'
                                                    : num === currentQuizQuestion
                                                    ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white scale-110 shadow-lg animate-pulse'
                                                    : 'bg-gray-700 text-gray-400'
                                            }`}
                                            onClick={() => setCurrentQuizQuestion(num)}
                                        >
                                            {quizAnswers.basics?.[`q${num + 1}`] !== undefined ? '✓' : num + 1}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Current Question */}
                            <div className="bg-black/40 rounded-xl p-6 border-2 border-purple-400/50 animate-slide-in">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-black text-white text-xl">
                                        {currentQuizQuestion + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-2xl font-bold text-white mb-4">
                                            {quizDataEnhanced.basics.questions[currentQuizQuestion].question}
                                        </p>

                                        {/* Hint Button */}
                                        <button
                                            onClick={() => setShowHints({...showHints, [`q${currentQuizQuestion + 1}`]: !showHints[`q${currentQuizQuestion + 1}`]})}
                                            className="bg-yellow-900/40 hover:bg-yellow-900/60 border-2 border-yellow-500/50 text-yellow-200 px-4 py-2 rounded-lg text-sm font-bold transition-all mb-4 flex items-center gap-2"
                                        >
                                            <span>💡</span>
                                            {showHints[`q${currentQuizQuestion + 1}`] ? 'Hide Hint' : 'Show Hint'}
                                        </button>

                                        {showHints[`q${currentQuizQuestion + 1}`] && (
                                            <div className="bg-yellow-900/30 border-2 border-yellow-500/50 rounded-lg p-4 mb-4 animate-slide-in">
                                                <p className="text-yellow-200 text-sm">
                                                    💡 {quizDataEnhanced.basics.questions[currentQuizQuestion].hint}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Answer Options with Instant Feedback */}
                                <div className="space-y-3">
                                    {quizDataEnhanced.basics.questions[currentQuizQuestion].options.map((option, idx) => {
                                        const questionKey = `q${currentQuizQuestion + 1}`;
                                        const isSelected = quizAnswers.basics?.[questionKey] === idx;
                                        const isCorrect = idx === quizDataEnhanced.basics.questions[currentQuizQuestion].correct;
                                        const showFeedback = quizAnswerFeedback[questionKey] === idx;

                                        return (
                                            <div key={idx}>
                                                <button
                                                    onClick={() => {
                                                        setQuizAnswers({
                                                            ...quizAnswers,
                                                            basics: {...(quizAnswers.basics || {}), [questionKey]: idx}
                                                        });
                                                        setQuizAnswerFeedback({
                                                            ...quizAnswerFeedback,
                                                            [questionKey]: idx
                                                        });
                                                    }}
                                                    className={`w-full text-left p-4 rounded-lg transition-all ${
                                                        isSelected
                                                            ? isCorrect
                                                                ? 'bg-green-900/60 border-2 border-green-400 text-white'
                                                                : 'bg-red-900/60 border-2 border-red-400 text-white'
                                                            : 'bg-gray-800/40 border-2 border-gray-600 hover:border-purple-400 text-gray-200 hover:translate-x-2'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                                            isSelected
                                                                ? isCorrect
                                                                    ? 'border-green-400 bg-green-500'
                                                                    : 'border-red-400 bg-red-500'
                                                                : 'border-gray-500'
                                                        }`}>
                                                            {isSelected && (
                                                                <span className="text-white text-sm">
                                                                    {isCorrect ? '✓' : '✗'}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="flex-1">{option}</span>
                                                        {isSelected && (
                                                            <span className="text-2xl">
                                                                {isCorrect ? '✅' : '❌'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </button>

                                                {/* Instant Feedback */}
                                                {showFeedback && (
                                                    <div className={`mt-2 p-4 rounded-lg border-l-4 animate-slide-in ${
                                                        isCorrect
                                                            ? 'bg-green-900/30 border-green-400'
                                                            : 'bg-red-900/30 border-red-400'
                                                    }`}>
                                                        <p className={`font-bold mb-2 ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                                                            {isCorrect ? '✅ Correct!' : '❌ Not quite!'}
                                                        </p>
                                                        <p className={`text-sm ${isCorrect ? 'text-green-200' : 'text-red-200'}`}>
                                                            {isCorrect
                                                                ? quizDataEnhanced.basics.questions[currentQuizQuestion].explanation
                                                                : quizDataEnhanced.basics.questions[currentQuizQuestion].wrongExplanations[idx]
                                                            }
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Navigation Buttons */}
                                <div className="flex gap-3 mt-6">
                                    {currentQuizQuestion > 0 && (
                                        <button
                                            onClick={() => setCurrentQuizQuestion(currentQuizQuestion - 1)}
                                            className="flex-1 bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-500 hover:to-gray-400 text-white px-6 py-3 rounded-xl font-bold transition-all"
                                        >
                                            ← Previous Question
                                        </button>
                                    )}
                                    {currentQuizQuestion < 3 && (
                                        <button
                                            onClick={() => setCurrentQuizQuestion(currentQuizQuestion + 1)}
                                            disabled={quizAnswers.basics?.[`q${currentQuizQuestion + 1}`] === undefined}
                                            className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${
                                                quizAnswers.basics?.[`q${currentQuizQuestion + 1}`] !== undefined
                                                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 text-white cursor-pointer'
                                                    : 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-50'
                                            }`}
                                        >
                                            Next Question →
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="mt-8">
                                {(() => {
                                    const allAnswered = [1, 2, 3, 4].every(num =>
                                        quizAnswers.basics?.[`q${num}`] !== undefined
                                    );

                                    return (
                                        <button
                                            onClick={() => {
                                                if (allAnswered) {
                                                    // Confetti animation
                                                    const colors = ['#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
                                                    for (let i = 0; i < 100; i++) {
                                                        setTimeout(() => {
                                                            const confetti = document.createElement('div');
                                                            confetti.className = 'confetti-piece';
                                                            confetti.style.cssText = `
                                                                position: fixed;
                                                                width: 10px;
                                                                height: 10px;
                                                                background: ${colors[Math.floor(Math.random() * colors.length)]};
                                                                left: ${Math.random() * 100}vw;
                                                                top: -20px;
                                                                z-index: 9999;
                                                                animation: confetti 3s ease-out forwards;
                                                            `;
                                                            document.body.appendChild(confetti);
                                                            setTimeout(() => confetti.remove(), 3000);
                                                        }, i * 30);
                                                    }

                                                    setQuizSubmitted({...quizSubmitted, basics: true});
                                                    const score = [1, 2, 3, 4].filter(num =>
                                                        quizAnswers.basics?.[`q${num}`] === quizDataEnhanced.basics.questions[num - 1].correct
                                                    ).length;
                                                    const percentage = Math.round((score / 4) * 100);

                                                    // Use your existing completeLesson function
                                                    if (typeof completeLesson === 'function') {
                                                        completeLesson('basics', percentage);
                                                    }
                                                } else {
                                                    alert('Please answer all 4 questions before submitting!');
                                                }
                                            }}
                                            disabled={!allAnswered}
                                            className={`w-full px-8 py-6 rounded-xl font-bold transition-all shadow-lg text-xl ${
                                                allAnswered
                                                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 text-white cursor-pointer transform hover:scale-105 hover:shadow-2xl'
                                                    : 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-50'
                                            }`}
                                        >
                                            {allAnswered ? '🎯 Submit Quiz & See Results' : `⏳ Answer all questions (${[1,2,3,4].filter(n => quizAnswers.basics?.[`q${n}`] !== undefined).length}/4)`}
                                        </button>
                                    );
                                })()}
                            </div>
                        </>
                    )}

                    {/* ENHANCED Results with Celebration */}
                    {quizSubmitted.basics && (() => {
                        const score = [1, 2, 3, 4].filter(num =>
                            quizAnswers.basics?.[`q${num}`] === quizDataEnhanced.basics.questions[num - 1].correct
                        ).length;
                        const percentage = (score / 4) * 100;

                        let grade = 'F';
                        let gradeColor = 'from-red-500 to-red-600';
                        let celebration = '💪';

                        if (percentage === 100) {
                            grade = 'A+';
                            gradeColor = 'from-yellow-400 to-yellow-500';
                            celebration = '🎉🏆🎉';
                        }
                        else if (percentage >= 90) {
                            grade = 'A';
                            gradeColor = 'from-green-400 to-green-500';
                            celebration = '🌟🎊';
                        }
                        else if (percentage >= 80) {
                            grade = 'B';
                            gradeColor = 'from-blue-400 to-blue-500';
                            celebration = '👏';
                        }
                        else if (percentage >= 70) {
                            grade = 'C';
                            gradeColor = 'from-purple-400 to-purple-500';
                            celebration = '📚';
                        }
                        else if (percentage >= 60) {
                            grade = 'D';
                            gradeColor = 'from-orange-400 to-orange-500';
                            celebration = '💪';
                        }

                        return (
                            <div className="space-y-6">
                                {/* Celebration Header */}
                                <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-2 border-green-400 rounded-xl p-8 text-center">
                                    <div className="text-8xl mb-6" style={{animation: 'bounce-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)'}}>
                                        {celebration}
                                    </div>

                                    <h4 className="text-4xl font-black text-white mb-4" style={{animation: 'bounce-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.1s backwards'}}>
                                        Quiz Complete!
                                    </h4>

                                    {/* Grade Badge */}
                                    <div
                                        className={`inline-block px-8 py-4 rounded-full text-white text-5xl font-black mb-6 shadow-2xl bg-gradient-to-r ${gradeColor}`}
                                        style={{animation: 'bounce-in 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.3s backwards'}}
                                    >
                                        {grade}
                                    </div>

                                    {/* Score */}
                                    <div className="mb-6" style={{animation: 'bounce-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.4s backwards'}}>
                                        <div className="text-7xl font-black text-white mb-2">
                                            {score} / 4
                                        </div>
                                        <div className="text-3xl font-bold text-green-300">
                                            {percentage}% Correct
                                        </div>
                                    </div>

                                    {/* Performance Visual */}
                                    <div className="mb-6 bg-black/40 rounded-xl p-6">
                                        <div className="grid grid-cols-4 gap-3">
                                            {[1, 2, 3, 4].map(num => {
                                                const isCorrect = quizAnswers.basics?.[`q${num}`] === quizDataEnhanced.basics.questions[num - 1].correct;
                                                return (
                                                    <div key={num} className="text-center">
                                                        <div
                                                            className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl mb-2 ${
                                                                isCorrect ? 'bg-green-500' : 'bg-red-500'
                                                            }`}
                                                            style={{animation: `bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${0.5 + num * 0.1}s backwards`}}
                                                        >
                                                            {isCorrect ? '✓' : '✗'}
                                                        </div>
                                                        <div className="text-xs text-gray-400">Q{num}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Motivational Message */}
                                    <div className="bg-purple-900/40 border-2 border-purple-400/50 rounded-xl p-6">
                                        <p className="text-2xl font-bold text-white mb-2">
                                            {score === 4 && '🏆 Perfect Score! You\'re a Trading Master!'}
                                            {score === 3 && '🌟 Excellent Work! You\'ve got this!'}
                                            {score === 2 && '📚 Good Progress! Keep studying!'}
                                            {score < 2 && '💪 Keep Learning! Practice makes perfect!'}
                                        </p>
                                        <p className="text-purple-200 text-lg">
                                            {score === 4 && 'You have mastered the basics of trading. Ready for advanced topics!'}
                                            {score === 3 && 'You understand the fundamentals well. Review the missed question and you\'ll be perfect!'}
                                            {score === 2 && 'You\'re on the right track. Review the lessons and try again for a higher score.'}
                                            {score < 2 && 'Trading takes time to master. Review the material carefully and retake the quiz.'}
                                        </p>
                                    </div>
                                </div>

                                {/* Detailed Explanations */}
                                <div className="bg-black/40 rounded-xl p-6 border-2 border-cyan-400/50">
                                    <div className="text-2xl font-bold text-cyan-300 mb-4 flex items-center gap-2">
                                        <span>📖</span>
                                        Answer Explanations
                                    </div>

                                    <div className="space-y-4">
                                        {quizDataEnhanced.basics.questions.map((q, idx) => {
                                            const userAnswer = quizAnswers.basics?.[`q${idx + 1}`];
                                            const isCorrect = userAnswer === q.correct;
                                            return (
                                                <div
                                                    key={idx}
                                                    className={`p-5 rounded-lg border-2 ${
                                                        isCorrect
                                                            ? 'bg-green-900/20 border-green-400/50'
                                                            : 'bg-red-900/20 border-red-400/50'
                                                    }`}
                                                    style={{animation: `slideIn 0.5s ease-out ${idx * 0.1}s backwards`}}
                                                >
                                                    <div className="flex items-start gap-3 mb-3">
                                                        <span className="text-3xl">{isCorrect ? '✅' : '❌'}</span>
                                                        <div className="flex-1">
                                                            <div className="font-bold text-white mb-1 text-lg">
                                                                Question {idx + 1}: {q.question}
                                                            </div>
                                                            <div className={`text-sm mb-2 ${isCorrect ? 'text-green-200' : 'text-red-200'}`}>
                                                                Your answer: <strong>{q.options[userAnswer]}</strong>
                                                                {!isCorrect && (
                                                                    <span className="block mt-1">
                                                                        Correct answer: <strong className="text-green-300">{q.options[q.correct]}</strong>
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className={`p-3 rounded-lg ${isCorrect ? 'bg-green-900/30' : 'bg-blue-900/30'}`}>
                                                                <p className={`text-sm ${isCorrect ? 'text-green-100' : 'text-blue-100'}`}>
                                                                    <strong>Explanation:</strong> {q.explanation}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button
                                        onClick={() => {
                                            setQuizSubmitted({...quizSubmitted, basics: false});
                                            setQuizAnswers({...quizAnswers, basics: {}});
                                            setQuizAnswerFeedback({});
                                            setCurrentQuizQuestion(0);
                                            setShowHints({});
                                            setCurrentLessonSection(0);
                                        }}
                                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:scale-105"
                                    >
                                        🔄 Retake Quiz
                                    </button>
                                    <button
                                        onClick={() => setLearningTopic(null)}
                                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:scale-105"
                                    >
                                        ✅ Back to Learning Hub
                                    </button>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}
        </div>
    </div>
)}
