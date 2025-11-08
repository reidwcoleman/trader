import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
    const [showAccountTypeModal, setShowAccountTypeModal] = useState(false);
    const navigate = useNavigate();

    // Navigate to app.html function
    const navigateToApp = () => {
        navigate('/app');
    };

    return (
        <div className="min-h-screen bg-black">
                        {/* Navigation Header */}
                        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 border-b border-cyan-500/30">
                            <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
                                <div className="flex items-center justify-between gap-4">
                                    {/* Logo Section */}
                                    <div className="flex items-center gap-3">
                                        <img
                                            src="8c5470b9-7f6a-49f6-b4d9-d9128261158f.jpg"
                                            alt="FinClash"
                                            className="w-10 h-10 object-contain"
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                        <div>
                                            <span className="text-xl md:text-2xl font-black text-white">
                                                FinClash
                                            </span>
                                            <div className="text-xs text-cyan-500 font-bold tracking-widest hidden md:block">TRADING SIMULATOR</div>
                                        </div>
                                    </div>

                                    {/* Navigation Links */}
                                    <div className="hidden lg:flex items-center gap-3">
                                        <button
                                            onClick={navigateToApp}
                                            className="px-6 py-2 text-cyan-400 font-bold border border-cyan-500/50 hover:border-cyan-400 rounded-lg transition-all"
                                        >
                                            Sign In
                                        </button>
                                        <button
                                            onClick={navigateToApp}
                                            className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-white font-bold rounded-lg transition-all"
                                        >
                                            Create Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </nav>

                        {/* Account Type Selection Modal */}
                        {showAccountTypeModal && (
                            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[99999]">
                                <div className="relative bg-gradient-to-br from-blue-900/95 to-indigo-950/95 backdrop-blur-xl rounded-3xl p-8 max-w-4xl w-full border-2 border-cyan-500/50 shadow-2xl">
                                    {/* Close Button */}
                                    <button
                                        onClick={navigateToApp}
                                        className="group relative w-full sm:w-auto px-16 py-6 bg-gradient-to-r from-cyan-500 via-blue-600 to-blue-700 hover:from-cyan-400 hover:via-blue-500 hover:to-blue-600 text-white rounded-2xl font-black text-2xl shadow-2xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 border-2 border-cyan-400/40 hover:border-cyan-300 overflow-hidden"
                                        style={{boxShadow: '0 0 40px rgba(6, 182, 212, 0.4), 0 0 80px rgba(6, 182, 212, 0.2)'}}
                                    >
                                        <span className="relative z-10 flex items-center gap-3">
                                            <span>Create Account</span>
                                            <svg className="w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </span>
                                        {/* Animated shine effect */}
                                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                                        {/* Pulse ring */}
                                        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{boxShadow: '0 0 0 0 rgba(6, 182, 212, 0.7)', animation: 'pulse-ring 1.5s infinite'}}></div>
                                    </button>

                                    <button
                                        onClick={navigateToApp}
                                        className="group relative w-full sm:w-auto px-16 py-6 bg-black/80 backdrop-blur-xl hover:bg-black/60 text-cyan-400 hover:text-cyan-300 rounded-2xl font-black text-2xl shadow-2xl border-2 border-cyan-500/70 hover:border-cyan-400 transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 overflow-hidden"
                                        style={{boxShadow: '0 0 30px rgba(6, 182, 212, 0.3), inset 0 0 20px rgba(6, 182, 212, 0.1)'}}
                                    >
                                        <span className="relative z-10 flex items-center gap-3">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                            </svg>
                                            <span>Sign In</span>
                                        </span>
                                        {/* Animated border glow */}
                                        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            <div className="absolute inset-0 rounded-2xl animate-pulse" style={{boxShadow: '0 0 20px rgba(6, 182, 212, 0.6), inset 0 0 20px rgba(6, 182, 212, 0.2)'}}></div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Spacer */}
                        <div className="pt-24"></div>

                        {/* Account Types Section Header */}
                        <div className="text-center mb-16 px-4">
                            <h2 className="text-5xl md:text-6xl font-black mb-6 text-cyan-400">
                                Choose Your Path
                            </h2>
                            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                Explore our account types and select the perfect plan for your trading journey
                            </p>
                        </div>

                            {/* Pricing Section */}
                            <div id="pricing-section" className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 pb-16">
                                {/* Personal Plan - FREE */}
                                <div className="bg-gray-900 rounded-2xl p-8 border-2 border-cyan-500/30 hover:border-cyan-400 transition-all">
                                    <div className="text-center mb-6">
                                        <span className="text-5xl">👤</span>
                                    </div>

                                    <h3 className="text-3xl font-black text-center mb-2 text-cyan-400">
                                        Individual
                                    </h3>
                                    <p className="text-center text-gray-400 text-sm mb-6">Perfect for solo traders</p>

                                    <div className="text-center mb-8 py-4 bg-black/40 rounded-xl border border-green-500/30">
                                        <span className="text-5xl font-black text-green-400">FREE</span>
                                        <div className="text-xs text-green-400 font-bold mt-2">ZERO TRADING FEES FOREVER</div>
                                    </div>

                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3">
                                            <span className="text-green-400 font-bold">✓</span>
                                            <span className="text-gray-300">$100K virtual capital</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="text-green-400 font-bold">✓</span>
                                            <span className="text-gray-300">Trade any stock globally</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="text-green-400 font-bold">✓</span>
                                            <span className="text-gray-300">UltraThink AI analysis</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="text-green-400 font-bold">✓</span>
                                            <span className="text-gray-300">Live market news</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="text-green-400 font-bold">✓</span>
                                            <span className="text-gray-300">Risk-free practice</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Public Plan - 1% Fee - Ultra-Modern */}
                                <div className="group relative bg-black/80 backdrop-blur-2xl rounded-3xl p-8 border-2 border-green-500/40 hover:border-green-400 transition-all duration-500 hover:-translate-y-3 hover:scale-105 overflow-hidden" style={{boxShadow: '0 0 40px rgba(34, 197, 94, 0.25)'}}>
                                    {/* Animated Background Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-600/15 to-transparent opacity-0 group-hover:opacity-100 transition duration-700"></div>

                                    {/* Shine Effect */}
                                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-green-400/15 to-transparent"></div>

                                    {/* COMING SOON Badge */}
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-orange-500/40 blur-xl rounded-full animate-pulse"></div>
                                            <span className="relative bg-gradient-to-r from-orange-500 to-amber-600 text-white text-xs font-black px-5 py-2 rounded-full shadow-2xl" style={{boxShadow: '0 0 30px rgba(249, 115, 22, 0.6)'}}>
                                                🚀 COMING SOON
                                            </span>
                                        </div>
                                    </div>

                                    <div className="relative z-10">
                                        {/* Icon with Glow */}
                                        <div className="flex items-center justify-center mb-6 mt-2">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-green-500/30 blur-2xl rounded-full group-hover:bg-green-500/50 transition-all duration-500"></div>
                                                <div className="relative bg-gradient-to-br from-green-400 via-emerald-500 to-green-600 p-5 rounded-2xl shadow-xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                                    <span className="text-5xl">👥</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-4xl font-black text-center mb-3">
                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-400 to-green-300 group-hover:from-green-200 group-hover:via-emerald-300 group-hover:to-green-200 transition-all duration-500">
                                                Public
                                            </span>
                                        </h3>
                                        <p className="text-center text-orange-400 text-xl mb-6 font-black">Coming Soon Late December 2025</p>

                                        {/* Features - Enhanced */}
                                        <ul className="space-y-4">
                                            <li className="flex items-start gap-4 group/item">
                                                <div className="relative flex-shrink-0">
                                                    <div className="absolute inset-0 bg-green-400/20 blur-lg rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                                                    <span className="relative text-2xl text-green-400 font-bold">✓</span>
                                                </div>
                                                <span className="text-base text-gray-300 group-hover/item:text-white transition-colors duration-300">
                                                    <span className="font-black text-green-400">Private</span> competitions
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-4 group/item">
                                                <div className="relative flex-shrink-0">
                                                    <div className="absolute inset-0 bg-green-400/20 blur-lg rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                                                    <span className="relative text-2xl text-green-400 font-bold">✓</span>
                                                </div>
                                                <span className="text-base text-gray-300 group-hover/item:text-white transition-colors duration-300">
                                                    <span className="font-black text-green-400">Real money</span> prizes
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-4 group/item">
                                                <div className="relative flex-shrink-0">
                                                    <div className="absolute inset-0 bg-green-400/20 blur-lg rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                                                    <span className="relative text-2xl text-green-400 font-bold">✓</span>
                                                </div>
                                                <span className="text-base text-gray-300 group-hover/item:text-white transition-colors duration-300">
                                                    <span className="font-black text-cyan-400">Live</span> leaderboards
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-4 group/item">
                                                <div className="relative flex-shrink-0">
                                                    <div className="absolute inset-0 bg-green-400/20 blur-lg rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                                                    <span className="relative text-2xl text-green-400 font-bold">✓</span>
                                                </div>
                                                <span className="text-base text-gray-300 group-hover/item:text-white transition-colors duration-300">
                                                    <span className="font-black text-green-400">Winner</span> takes all
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-4 group/item">
                                                <div className="relative flex-shrink-0">
                                                    <div className="absolute inset-0 bg-green-400/20 blur-lg rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                                                    <span className="relative text-2xl text-green-400 font-bold">✓</span>
                                                </div>
                                                <span className="text-base text-gray-300 group-hover/item:text-white transition-colors duration-300">
                                                    <span className="font-black text-yellow-400">1%</span> trading expense
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Private Plan - $0.05 Fee - Ultra-Modern */}
                                <div className="group relative bg-black/80 backdrop-blur-2xl rounded-3xl p-8 border-2 border-purple-500/40 hover:border-purple-400 transition-all duration-500 hover:-translate-y-3 hover:scale-105 overflow-hidden" style={{boxShadow: '0 0 40px rgba(168, 85, 247, 0.25)'}}>
                                    {/* Animated Background Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-600/15 to-transparent opacity-0 group-hover:opacity-100 transition duration-700"></div>

                                    {/* Shine Effect */}
                                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-purple-400/15 to-transparent"></div>

                                    {/* COMING SOON Badge */}
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-orange-500/40 blur-xl rounded-full animate-pulse"></div>
                                            <span className="relative bg-gradient-to-r from-orange-500 to-amber-600 text-white text-xs font-black px-5 py-2 rounded-full shadow-2xl" style={{boxShadow: '0 0 30px rgba(249, 115, 22, 0.6)'}}>
                                                🚀 COMING SOON
                                            </span>
                                        </div>
                                    </div>

                                    <div className="relative z-10">
                                        {/* Icon with Glow */}
                                        <div className="flex items-center justify-center mb-6 mt-2">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-purple-500/30 blur-2xl rounded-full group-hover:bg-purple-500/50 transition-all duration-500"></div>
                                                <div className="relative bg-gradient-to-br from-purple-400 via-pink-500 to-purple-600 p-5 rounded-2xl shadow-xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                                    <span className="text-5xl">👑</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-4xl font-black text-center mb-3">
                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-400 to-purple-300 group-hover:from-purple-200 group-hover:via-pink-300 group-hover:to-purple-200 transition-all duration-500">
                                                Private
                                            </span>
                                        </h3>
                                        <p className="text-center text-orange-400 text-xl mb-6 font-black">Coming Soon Late December 2025</p>

                                        {/* Features - Enhanced */}
                                        <ul className="space-y-4">
                                            <li className="flex items-start gap-4 group/item">
                                                <div className="relative flex-shrink-0">
                                                    <div className="absolute inset-0 bg-purple-400/20 blur-lg rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                                                    <span className="relative text-2xl text-purple-400 font-bold">✓</span>
                                                </div>
                                                <span className="text-base text-gray-300 group-hover/item:text-white transition-colors duration-300">
                                                    <span className="font-black text-purple-400">Private</span> competitions
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-4 group/item">
                                                <div className="relative flex-shrink-0">
                                                    <div className="absolute inset-0 bg-purple-400/20 blur-lg rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                                                    <span className="relative text-2xl text-purple-400 font-bold">✓</span>
                                                </div>
                                                <span className="text-base text-gray-300 group-hover/item:text-white transition-colors duration-300">
                                                    <span className="font-black text-green-400">Real money</span> prizes
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-4 group/item">
                                                <div className="relative flex-shrink-0">
                                                    <div className="absolute inset-0 bg-purple-400/20 blur-lg rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                                                    <span className="relative text-2xl text-purple-400 font-bold">✓</span>
                                                </div>
                                                <span className="text-base text-gray-300 group-hover/item:text-white transition-colors duration-300">
                                                    <span className="font-black text-cyan-400">Live</span> leaderboards
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-4 group/item">
                                                <div className="relative flex-shrink-0">
                                                    <div className="absolute inset-0 bg-purple-400/20 blur-lg rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                                                    <span className="relative text-2xl text-purple-400 font-bold">✓</span>
                                                </div>
                                                <span className="text-base text-gray-300 group-hover/item:text-white transition-colors duration-300">
                                                    <span className="font-black text-green-400">Winner</span> takes all
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-4 group/item">
                                                <div className="relative flex-shrink-0">
                                                    <div className="absolute inset-0 bg-purple-400/20 blur-lg rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                                                    <span className="relative text-2xl text-purple-400 font-bold">✓</span>
                                                </div>
                                                <span className="text-base text-gray-300 group-hover/item:text-white transition-colors duration-300">
                                                    <span className="font-black text-purple-400">Low</span> fixed fee
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Stripe Integration Notice - Ultra-Modern */}
                            <div className="mt-12 max-w-3xl mx-auto group">
                                <div className="relative bg-black/80 backdrop-blur-2xl border-2 border-cyan-500/30 hover:border-cyan-400/60 rounded-2xl p-6 transition-all duration-500 overflow-hidden" style={{boxShadow: '0 0 30px rgba(6, 182, 212, 0.15)'}}>
                                    {/* Animated shine effect */}
                                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent"></div>

                                    <div className="relative flex items-center gap-6">
                                        <div className="relative flex-shrink-0">
                                            <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full"></div>
                                            <div className="relative text-6xl transform group-hover:scale-110 transition-transform duration-300">💳</div>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black mb-2">
                                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-300">
                                                    Secure Payments with Stripe
                                                </span>
                                            </h3>
                                            <p className="text-gray-300 text-base leading-relaxed">
                                                All plan payments are processed securely through <span className="relative inline-block group"><span className="text-cyan-400 font-bold">Stripe</span><span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-cyan-400/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></span></span>. Trusted by millions of businesses worldwide with <span className="relative inline-block group"><span className="text-green-400 font-bold">bank-level security</span><span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-green-400/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></span></span>.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* What is FinClash Section */}
                            <div id="what-is-finclash-section" className="mt-20 max-w-6xl mx-auto">
                                <div className="text-center mb-12">
                                    <h2 className="text-5xl md:text-6xl font-black mb-4">
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-300">What is FinClash?</span>
                                    </h2>
                                    <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 mx-auto rounded-full" style={{boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)'}}></div>
                                    <p className="text-xl text-gray-400 mt-6 max-w-3xl mx-auto">
                                        The ultimate stock trading simulator powered by AI, offering competitive gameplay and real money prizes
                                    </p>
                                </div>

                                {/* 6 Feature Boxes */}
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Box 1: AI-Powered */}
                                    <div className="group relative bg-gradient-to-br from-purple-900/60 to-violet-950/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-purple-500/50 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-2">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-violet-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300"></div>
                                        <div className="relative z-10">
                                            <div className="bg-gradient-to-br from-purple-400 via-violet-500 to-purple-600 p-4 rounded-xl shadow-xl w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                                                <span className="text-4xl">🧠</span>
                                            </div>
                                            <h3 className="text-2xl font-black text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-violet-400">
                                                AI-Powered Analysis
                                            </h3>
                                            <p className="text-blue-100 text-center text-sm">
                                                UltraThink AI provides intelligent stock analysis and real-time recommendations to help you make informed decisions
                                            </p>
                                        </div>
                                    </div>

                                    {/* Box 2: Real-Time Data */}
                                    <div className="group relative bg-gradient-to-br from-blue-900/60 to-indigo-950/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-blue-500/50 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 hover:-translate-y-2">
                                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300"></div>
                                        <div className="relative z-10">
                                            <div className="bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 p-4 rounded-xl shadow-xl w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                                                <span className="text-4xl">📊</span>
                                            </div>
                                            <h3 className="text-2xl font-black text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
                                                Real-Time Market Data
                                            </h3>
                                            <p className="text-blue-100 text-center text-sm">
                                                Live stock prices, charts, and market updates keep you connected to the pulse of Wall Street
                                            </p>
                                        </div>
                                    </div>

                                    {/* Box 3: Competitive Trading */}
                                    <div className="group relative bg-gradient-to-br from-orange-900/60 to-red-950/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-orange-500/50 hover:border-orange-400 hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 hover:-translate-y-2">
                                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300"></div>
                                        <div className="relative z-10">
                                            <div className="bg-gradient-to-br from-orange-400 via-red-500 to-orange-600 p-4 rounded-xl shadow-xl w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                                                <span className="text-4xl">🏆</span>
                                            </div>
                                            <h3 className="text-2xl font-black text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-red-400">
                                                Competitive Trading
                                            </h3>
                                            <p className="text-blue-100 text-center text-sm">
                                                Compete with friends and family on live leaderboards. Winner takes all the prize pool!
                                            </p>
                                        </div>
                                    </div>

                                    {/* Box 4: $100K Virtual Capital */}
                                    <div className="group relative bg-gradient-to-br from-green-900/60 to-emerald-950/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-green-500/50 hover:border-green-400 hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-300 hover:-translate-y-2">
                                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300"></div>
                                        <div className="relative z-10">
                                            <div className="bg-gradient-to-br from-green-400 via-emerald-500 to-green-600 p-4 rounded-xl shadow-xl w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                                                <span className="text-4xl">💰</span>
                                            </div>
                                            <h3 className="text-2xl font-black text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-400">
                                                $100K Virtual Capital
                                            </h3>
                                            <p className="text-blue-100 text-center text-sm">
                                                Start trading immediately with $100,000 in virtual capital. No risk, all reward!
                                            </p>
                                        </div>
                                    </div>

                                    {/* Box 5: Risk-Free Learning */}
                                    <div className="group relative bg-gradient-to-br from-teal-900/60 to-cyan-950/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-teal-500/50 hover:border-teal-400 hover:shadow-2xl hover:shadow-teal-500/30 transition-all duration-300 hover:-translate-y-2">
                                        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-cyan-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300"></div>
                                        <div className="relative z-10">
                                            <div className="bg-gradient-to-br from-teal-400 via-cyan-500 to-teal-600 p-4 rounded-xl shadow-xl w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                                                <span className="text-4xl">🎓</span>
                                            </div>
                                            <h3 className="text-2xl font-black text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-400">
                                                Risk-Free Learning
                                            </h3>
                                            <p className="text-blue-100 text-center text-sm">
                                                Perfect for beginners and pros alike. Learn trading strategies without risking real money
                                            </p>
                                        </div>
                                    </div>

                                    {/* Box 6: Real Money Prizes */}
                                    <div className="group relative bg-gradient-to-br from-yellow-900/60 to-amber-950/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-yellow-500/50 hover:border-yellow-400 hover:shadow-2xl hover:shadow-yellow-500/30 transition-all duration-300 hover:-translate-y-2">
                                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-amber-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300"></div>
                                        <div className="relative z-10">
                                            <div className="bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 p-4 rounded-xl shadow-xl w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                                                <span className="text-4xl">💸</span>
                                            </div>
                                            <h3 className="text-2xl font-black text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400">
                                                Real Money Prizes
                                            </h3>
                                            <p className="text-blue-100 text-center text-sm">
                                                Public and Private competitions offer real cash payouts. The best trader wins it all!
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Creators Footer */}
                                <div className="mt-12 text-center">
                                    <div className="inline-block bg-black/80 backdrop-blur-xl rounded-2xl px-8 py-4 border-2 border-cyan-500/30" style={{boxShadow: '0 0 30px rgba(6, 182, 212, 0.2)'}}>
                                        <p className="text-lg text-gray-300">
                                            Created by <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">Reid Coleman</span> & <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">Cameron Dietzel</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* How to Use Section */}
                            <div id="how-to-use-section" className="mt-20 max-w-6xl mx-auto">
                                <div className="group relative bg-gradient-to-br from-cyan-900/60 to-blue-950/60 backdrop-blur-xl rounded-3xl p-8 md:p-12 border-2 border-cyan-500/50 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                                    {/* Animated shine effect */}
                                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"></div>
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-300"></div>

                                    <div className="relative text-center mb-12">
                                        <h2 className="text-5xl md:text-6xl font-black mb-4">
                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-green-400 to-cyan-300">How to Use FinClash</span>
                                        </h2>
                                        <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 via-green-500 to-cyan-400 mx-auto rounded-full" style={{boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)'}}></div>
                                    </div>

                                    <div className="relative grid md:grid-cols-3 gap-8">
                                        {/* Step 1 */}
                                        <div className="group/step relative bg-gradient-to-br from-cyan-900/60 to-blue-950/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-cyan-500/50 hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                                            <div className="absolute inset-0 -translate-x-full group-hover/step:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"></div>
                                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-2xl opacity-0 group-hover/step:opacity-100 transition duration-300"></div>
                                            <div className="relative text-center">
                                                <div className="relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full mb-4 transform group-hover/step:scale-110 transition-transform duration-300">
                                                    <div className="absolute inset-0 bg-cyan-500/30 blur-xl rounded-full"></div>
                                                    <span className="relative text-3xl font-black text-white">1</span>
                                                </div>
                                                <h3 className="text-2xl font-black mb-4">
                                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-400">Choose Your Plan</span>
                                                </h3>
                                                <p className="text-gray-300 leading-relaxed">
                                                    Select from <span className="relative inline-block group"><span className="text-cyan-400 font-bold">Personal</span><span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-cyan-400/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></span></span> (free), <span className="relative inline-block group"><span className="text-green-400 font-bold">Public</span><span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-green-400/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></span></span> (1% fee), or <span className="relative inline-block group"><span className="text-purple-400 font-bold">Private</span><span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-purple-400/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></span></span> ($0.05 fee) based on whether you want to trade solo or compete for real money.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Step 2 */}
                                        <div className="group/step relative bg-gradient-to-br from-green-900/60 to-emerald-950/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-green-500/50 hover:border-green-400 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                                            <div className="absolute inset-0 -translate-x-full group-hover/step:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-green-400/20 to-transparent"></div>
                                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-2xl opacity-0 group-hover/step:opacity-100 transition duration-300"></div>
                                            <div className="relative text-center">
                                                <div className="relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-4 transform group-hover/step:scale-110 transition-transform duration-300">
                                                    <div className="absolute inset-0 bg-green-500/30 blur-xl rounded-full"></div>
                                                    <span className="relative text-3xl font-black text-white">2</span>
                                                </div>
                                                <h3 className="text-2xl font-black mb-4">
                                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-green-400">Create Account</span>
                                                </h3>
                                                <p className="text-gray-300 leading-relaxed">
                                                    Sign up with your email and create a secure password. You'll instantly receive <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-400 font-bold">$100,000 in virtual capital</span> to start trading.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Step 3 */}
                                        <div className="group/step relative bg-gradient-to-br from-purple-900/60 to-violet-950/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-purple-500/50 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                                            <div className="absolute inset-0 -translate-x-full group-hover/step:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent"></div>
                                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-violet-600/10 rounded-2xl opacity-0 group-hover/step:opacity-100 transition duration-300"></div>
                                            <div className="relative text-center">
                                                <div className="relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mb-4 transform group-hover/step:scale-110 transition-transform duration-300">
                                                    <div className="absolute inset-0 bg-purple-500/30 blur-xl rounded-full"></div>
                                                    <span className="relative text-3xl font-black text-white">3</span>
                                                </div>
                                                <h3 className="text-2xl font-black mb-4">
                                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-purple-400">Start Trading</span>
                                                </h3>
                                                <p className="text-gray-300 leading-relaxed">
                                                    Use our <span className="relative inline-block group"><span className="text-purple-400 font-bold">AI-powered analysis</span><span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-purple-400/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></span></span> to research stocks, execute trades, and compete on the leaderboard. The winner takes all!
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative mt-12 bg-black/60 rounded-2xl p-6 border-2 border-cyan-500/30 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-green-500/5 to-transparent"></div>
                                        <h3 className="relative text-2xl font-black mb-4 text-center">
                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-green-400">Pro Tips 💡</span>
                                        </h3>
                                        <ul className="relative grid md:grid-cols-2 gap-4 text-gray-300">
                                            <li className="flex items-start gap-3 group/tip cursor-pointer p-2 rounded-lg hover:bg-green-500/10 transition-all duration-300">
                                                <span className="text-green-400 text-xl flex-shrink-0 transform group-hover/tip:scale-125 transition-transform duration-300">✓</span>
                                                <span>Use <span className="text-purple-400 font-bold">UltraThink AI</span> analysis to make informed decisions</span>
                                            </li>
                                            <li className="flex items-start gap-3 group/tip cursor-pointer p-2 rounded-lg hover:bg-green-500/10 transition-all duration-300">
                                                <span className="text-green-400 text-xl flex-shrink-0 transform group-hover/tip:scale-125 transition-transform duration-300">✓</span>
                                                <span>Monitor <span className="text-cyan-400 font-bold">real-time</span> market news and trends</span>
                                            </li>
                                            <li className="flex items-start gap-3 group/tip cursor-pointer p-2 rounded-lg hover:bg-green-500/10 transition-all duration-300">
                                                <span className="text-green-400 text-xl flex-shrink-0 transform group-hover/tip:scale-125 transition-transform duration-300">✓</span>
                                                <span><span className="text-cyan-400 font-bold">Diversify</span> your portfolio across multiple stocks</span>
                                            </li>
                                            <li className="flex items-start gap-3 group/tip cursor-pointer p-2 rounded-lg hover:bg-green-500/10 transition-all duration-300">
                                                <span className="text-green-400 text-xl flex-shrink-0 transform group-hover/tip:scale-125 transition-transform duration-300">✓</span>
                                                <span>Track your competition on the <span className="text-cyan-400 font-bold">live leaderboard</span></span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Features Section */}
                            <div id="features-section" className="mt-20 max-w-6xl mx-auto">
                                <div className="group relative bg-gradient-to-br from-purple-900/60 to-indigo-950/60 backdrop-blur-xl rounded-3xl p-8 md:p-12 border-2 border-purple-500/50 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                                    {/* Animated shine effect */}
                                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent"></div>
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-300"></div>

                                    <div className="relative text-center mb-12">
                                        <h2 className="text-5xl md:text-6xl font-black mb-4">
                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-green-400 to-cyan-300">Features</span>
                                        </h2>
                                        <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 via-green-500 to-cyan-400 mx-auto rounded-full" style={{boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)'}}></div>
                                        <p className="text-xl text-white mt-4">Everything you need to master the market</p>
                                    </div>

                                    <div className="relative grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {/* Feature 1 */}
                                        <div className="group/feature relative bg-gradient-to-br from-cyan-900/60 to-blue-950/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-cyan-500/50 hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                                            <div className="absolute inset-0 -translate-x-full group-hover/feature:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"></div>
                                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-2xl opacity-0 group-hover/feature:opacity-100 transition duration-300"></div>
                                            <div className="relative text-4xl mb-4 transform group-hover/feature:scale-110 transition-transform duration-300">🧠</div>
                                            <h3 className="relative text-xl font-black mb-2">
                                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-400">UltraThink AI</span>
                                            </h3>
                                            <p className="relative text-gray-300">Advanced <span className="text-cyan-400 font-bold">AI-powered</span> stock analysis and recommendations</p>
                                        </div>

                                        {/* Feature 2 */}
                                        <div className="group/feature relative bg-gradient-to-br from-green-900/60 to-emerald-950/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-green-500/50 hover:border-green-400 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                                            <div className="absolute inset-0 -translate-x-full group-hover/feature:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-green-400/20 to-transparent"></div>
                                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-2xl opacity-0 group-hover/feature:opacity-100 transition duration-300"></div>
                                            <div className="relative text-4xl mb-4 transform group-hover/feature:scale-110 transition-transform duration-300">📊</div>
                                            <h3 className="relative text-xl font-black mb-2">
                                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-green-400">Real-Time Data</span>
                                            </h3>
                                            <p className="relative text-gray-300">Live stock prices, charts, and <span className="text-green-400 font-bold">market updates</span></p>
                                        </div>

                                        {/* Feature 3 */}
                                        <div className="group/feature relative bg-gradient-to-br from-purple-900/60 to-violet-950/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-purple-500/50 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                                            <div className="absolute inset-0 -translate-x-full group-hover/feature:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent"></div>
                                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-violet-600/10 rounded-2xl opacity-0 group-hover/feature:opacity-100 transition duration-300"></div>
                                            <div className="relative text-4xl mb-4 transform group-hover/feature:scale-110 transition-transform duration-300">🏆</div>
                                            <h3 className="relative text-xl font-black mb-2">
                                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-purple-400">Leaderboards</span>
                                            </h3>
                                            <p className="relative text-gray-300">Compete and see <span className="text-purple-400 font-bold">rankings</span> in real-time</p>
                                        </div>

                                        {/* Feature 4 */}
                                        <div className="group/feature relative bg-gradient-to-br from-green-900/60 to-emerald-950/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-green-500/50 hover:border-green-400 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                                            <div className="absolute inset-0 -translate-x-full group-hover/feature:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-green-400/20 to-transparent"></div>
                                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-2xl opacity-0 group-hover/feature:opacity-100 transition duration-300"></div>
                                            <div className="relative text-4xl mb-4 transform group-hover/feature:scale-110 transition-transform duration-300">💰</div>
                                            <h3 className="relative text-xl font-black mb-2">
                                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-400">Real Money Prizes</span>
                                            </h3>
                                            <p className="relative text-gray-300"><span className="text-green-400 font-bold">Winner-takes-all</span> competitions with actual payouts</p>
                                        </div>

                                        {/* Feature 5 */}
                                        <div className="group/feature relative bg-gradient-to-br from-cyan-900/60 to-blue-950/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-cyan-500/50 hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                                            <div className="absolute inset-0 -translate-x-full group-hover/feature:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"></div>
                                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-2xl opacity-0 group-hover/feature:opacity-100 transition duration-300"></div>
                                            <div className="relative text-4xl mb-4 transform group-hover/feature:scale-110 transition-transform duration-300">📰</div>
                                            <h3 className="relative text-xl font-black mb-2">
                                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-400">Live Market News</span>
                                            </h3>
                                            <p className="relative text-gray-300">Stay updated with <span className="text-cyan-400 font-bold">breaking financial news</span></p>
                                        </div>

                                        {/* Feature 6 */}
                                        <div className="group/feature relative bg-gradient-to-br from-green-900/60 to-emerald-950/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-green-500/50 hover:border-green-400 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                                            <div className="absolute inset-0 -translate-x-full group-hover/feature:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-green-400/20 to-transparent"></div>
                                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-2xl opacity-0 group-hover/feature:opacity-100 transition duration-300"></div>
                                            <div className="relative text-4xl mb-4 transform group-hover/feature:scale-110 transition-transform duration-300">🔐</div>
                                            <h3 className="relative text-xl font-black mb-2">
                                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-green-400">Secure Payments</span>
                                            </h3>
                                            <p className="relative text-gray-300"><span className="text-green-400 font-bold">Stripe</span> integration for safe, encrypted transactions</p>
                                        </div>

                                        {/* Feature 7 */}
                                        <div className="group/feature relative bg-gradient-to-br from-cyan-900/60 to-blue-950/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-cyan-500/50 hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                                            <div className="absolute inset-0 -translate-x-full group-hover/feature:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"></div>
                                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-2xl opacity-0 group-hover/feature:opacity-100 transition duration-300"></div>
                                            <div className="relative text-4xl mb-4 transform group-hover/feature:scale-110 transition-transform duration-300">📱</div>
                                            <h3 className="relative text-xl font-black mb-2">
                                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-400">Mobile Responsive</span>
                                            </h3>
                                            <p className="relative text-gray-300">Trade anywhere on <span className="text-cyan-400 font-bold">any device</span></p>
                                        </div>

                                        {/* Feature 8 */}
                                        <div className="group/feature relative bg-gradient-to-br from-purple-900/60 to-violet-950/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-purple-500/50 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                                            <div className="absolute inset-0 -translate-x-full group-hover/feature:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent"></div>
                                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-violet-600/10 rounded-2xl opacity-0 group-hover/feature:opacity-100 transition duration-300"></div>
                                            <div className="relative text-4xl mb-4 transform group-hover/feature:scale-110 transition-transform duration-300">🎯</div>
                                            <h3 className="relative text-xl font-black mb-2">
                                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-purple-400">Watchlists</span>
                                            </h3>
                                            <p className="relative text-gray-300">Track your favorite stocks and get <span className="text-purple-400 font-bold">alerts</span></p>
                                        </div>

                                        {/* Feature 9 */}
                                        <div className="group/feature relative bg-gradient-to-br from-cyan-900/60 to-blue-950/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-cyan-500/50 hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                                            <div className="absolute inset-0 -translate-x-full group-hover/feature:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"></div>
                                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-2xl opacity-0 group-hover/feature:opacity-100 transition duration-300"></div>
                                            <div className="relative text-4xl mb-4 transform group-hover/feature:scale-110 transition-transform duration-300">📈</div>
                                            <h3 className="relative text-xl font-black mb-2">
                                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-400">Portfolio Analytics</span>
                                            </h3>
                                            <p className="relative text-gray-300">Detailed <span className="text-cyan-400 font-bold">performance metrics</span> and insights</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Market Movers section removed - use dedicated Market Movers tab instead to avoid API rate limiting */}

                            {/* UltraThink Premium Footer */}
                            <footer className="mt-20 border-t border-cyan-500/30 pt-12 bg-black/20">
                                <div className="max-w-7xl mx-auto px-4">
                                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                                        {/* About Section */}
                                        <div className="group/footer relative bg-black/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 transform hover:scale-105 overflow-hidden" style={{boxShadow: '0 0 20px rgba(6, 182, 212, 0.1)'}}>
                                            <div className="absolute inset-0 -translate-x-full group-hover/footer:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent"></div>
                                            <h3 className="relative text-xl font-black mb-4 flex items-center gap-2">
                                                <span className="text-2xl transform group-hover/footer:scale-110 transition-transform duration-300">👨‍💻</span>
                                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-400">About Us</span>
                                            </h3>
                                            <div className="relative space-y-2">
                                                <a
                                                    href="about.html"
                                                    className="text-gray-300 hover:text-cyan-300 transition-all duration-300 font-bold block group/link"
                                                >
                                                    <span className="group-hover/link:translate-x-1 inline-block transition-transform duration-300">Meet Reid →</span>
                                                </a>
                                                <a
                                                    href="about-cameron.html"
                                                    className="text-gray-300 hover:text-purple-300 transition-all duration-300 font-bold block group/link"
                                                >
                                                    <span className="group-hover/link:translate-x-1 inline-block transition-transform duration-300">Meet Cameron →</span>
                                                </a>
                                            </div>
                                            <p className="relative text-gray-400 text-sm leading-relaxed mt-3">The minds behind <span className="text-cyan-400 font-bold">FinClash</span></p>
                                        </div>

                                        {/* Contact Section */}
                                        <div className="group/footer relative bg-black/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-green-500/30 hover:border-green-400 transition-all duration-300 transform hover:scale-105 overflow-hidden" style={{boxShadow: '0 0 20px rgba(34, 197, 94, 0.1)'}}>
                                            <div className="absolute inset-0 -translate-x-full group-hover/footer:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-green-400/10 to-transparent"></div>
                                            <h3 className="relative text-xl font-black mb-4 flex items-center gap-2">
                                                <span className="text-2xl transform group-hover/footer:scale-110 transition-transform duration-300">📧</span>
                                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-green-400">Contact</span>
                                            </h3>
                                            <a
                                                href="mailto:finclash101@gmail.com"
                                                className="relative text-gray-300 hover:text-green-300 transition-all duration-300 font-bold block mb-3 text-sm break-all"
                                            >
                                                finclash101@gmail.com
                                            </a>
                                            <p className="relative text-gray-400 text-sm leading-relaxed">Questions? We'd love to <span className="text-green-400 font-bold">hear from you!</span></p>
                                        </div>

                                        {/* Security Section */}
                                        <div className="group/footer relative bg-black/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 transform hover:scale-105 overflow-hidden" style={{boxShadow: '0 0 20px rgba(6, 182, 212, 0.1)'}}>
                                            <div className="absolute inset-0 -translate-x-full group-hover/footer:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent"></div>
                                            <h3 className="relative text-xl font-black mb-4 flex items-center gap-2">
                                                <span className="text-2xl transform group-hover/footer:scale-110 transition-transform duration-300">🔒</span>
                                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-400">Security</span>
                                            </h3>
                                            <a
                                                href="mailto:finclash101@gmail.com?subject=Security%20Issue%20Report"
                                                className="relative text-gray-300 hover:text-cyan-300 transition-all duration-300 font-bold block mb-3"
                                            >
                                                Report Issues
                                            </a>
                                            <p className="relative text-gray-400 text-sm leading-relaxed">Help us keep FinClash <span className="text-cyan-400 font-bold">secure & safe</span></p>
                                        </div>

                                        {/* Feedback Section */}
                                        <div className="group/footer relative bg-black/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-purple-500/30 hover:border-purple-400 transition-all duration-300 transform hover:scale-105 overflow-hidden" style={{boxShadow: '0 0 20px rgba(168, 85, 247, 0.1)'}}>
                                            <div className="absolute inset-0 -translate-x-full group-hover/footer:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-purple-400/10 to-transparent"></div>
                                            <h3 className="relative text-xl font-black mb-4 flex items-center gap-2">
                                                <span className="text-2xl transform group-hover/footer:scale-110 transition-transform duration-300">💡</span>
                                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-purple-400">Feedback</span>
                                            </h3>
                                            <a
                                                href="mailto:finclash101@gmail.com?subject=FinClash%20Feedback"
                                                className="relative text-gray-300 hover:text-purple-300 transition-all duration-300 font-bold block mb-3"
                                            >
                                                Share Ideas
                                            </a>
                                            <p className="relative text-gray-400 text-sm leading-relaxed">Help us <span className="text-purple-400 font-bold">improve</span> your experience</p>
                                        </div>
                                    </div>

                                    {/* UltraThink AI Badge */}
                                    <div className="flex justify-center mb-8">
                                        <div className="group relative bg-black/80 backdrop-blur-xl rounded-full px-6 py-3 border-2 border-purple-500/30 hover:border-purple-400 flex items-center gap-3 transition-all duration-300 overflow-hidden" style={{boxShadow: '0 0 30px rgba(168, 85, 247, 0.2)'}}>
                                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-purple-400/10 to-transparent"></div>
                                            <span className="relative text-2xl transform group-hover:scale-110 transition-transform duration-300">🧠</span>
                                            <span className="relative text-gray-300 font-bold text-sm">Powered by</span>
                                            <span className="relative text-transparent bg-gradient-to-r from-cyan-300 via-purple-400 to-green-400 bg-clip-text font-black text-lg">UltraThink AI</span>
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Bottom Bar with Enhanced Typography */}
                                    <div className="text-center py-8 border-t border-cyan-500/20">
                                        <div className="flex flex-wrap justify-center items-center gap-2 mb-3">
                                            <span className="text-gray-400 text-sm">© 2025</span>
                                            <span className="text-transparent bg-gradient-to-r from-cyan-300 via-green-400 to-cyan-300 bg-clip-text font-black text-lg">FinClash</span>
                                        </div>
                                        <p className="text-gray-300 text-sm mb-4">
                                            Created by <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-400 hover:from-cyan-200 hover:to-cyan-300 transition-all duration-300 cursor-pointer">Reid Coleman</span> and <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-400 hover:from-cyan-200 hover:to-cyan-300 transition-all duration-300 cursor-pointer">Cameron Dietzel</span>
                                        </p>

                                        {/* Legal Links */}
                                        <div className="flex flex-wrap justify-center items-center gap-4 mb-4">
                                            <a href="privacy.html" className="text-cyan-300 hover:text-cyan-200 text-sm font-bold transition-colors duration-300 hover:underline">
                                                Privacy Policy
                                            </a>
                                            <span className="text-cyan-500/50">•</span>
                                            <a href="terms.html" className="text-cyan-300 hover:text-cyan-200 text-sm font-bold transition-colors duration-300 hover:underline">
                                                Terms of Service
                                            </a>
                                        </div>

                                        <p className="text-gray-400 text-xs max-w-2xl mx-auto leading-relaxed">
                                            Virtual trading simulator for <span className="text-cyan-400">educational purposes</span> only • Not financial advice • Trade <span className="text-green-400">responsibly</span>
                                        </p>
                                    </div>
                                </div>
                            </footer>
                        </div>
    );
};

export default Homepage;
