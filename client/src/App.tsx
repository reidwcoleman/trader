import { useState, useEffect } from 'react'
import './App.css'

const API_URL = '/api';

type GameType = 'personal' | 'family';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

interface Holding {
  symbol: string;
  shares: number;
  avgPrice: number;
}

interface Player {
  id: string;
  name: string;
  cash: number;
  portfolio: Holding[];
  totalValue: number;
  portfolioValue?: number;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  totalValue: number;
  cash: number;
  portfolioValue: number;
}

function App() {
  const [screen, setScreen] = useState<'welcome' | 'game'>('welcome');
  const [gameType, setGameType] = useState<GameType | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [player, setPlayer] = useState<Player | null>(null);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [tradeAmount, setTradeAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'trade' | 'portfolio' | 'leaderboard'>('trade');

  // Fetch stocks periodically
  useEffect(() => {
    if (screen === 'game') {
      fetchStocks();
      const interval = setInterval(fetchStocks, 5000);
      return () => clearInterval(interval);
    }
  }, [screen]);

  // Fetch player data periodically
  useEffect(() => {
    if (playerId) {
      fetchPlayer();
      const interval = setInterval(fetchPlayer, 3000);
      return () => clearInterval(interval);
    }
  }, [playerId]);

  // Fetch leaderboard for family games
  useEffect(() => {
    if (gameType === 'family' && gameId) {
      fetchLeaderboard();
      const interval = setInterval(fetchLeaderboard, 5000);
      return () => clearInterval(interval);
    }
  }, [gameType, gameId]);

  const fetchStocks = async () => {
    try {
      const res = await fetch(`${API_URL}/stocks`);
      const data = await res.json();
      setStocks(data);
    } catch (err) {
      console.error('Failed to fetch stocks:', err);
    }
  };

  const fetchPlayer = async () => {
    try {
      const res = await fetch(`${API_URL}/players/${playerId}`);
      const data = await res.json();
      setPlayer(data);
    } catch (err) {
      console.error('Failed to fetch player:', err);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(`${API_URL}/games/${gameId}/leaderboard`);
      const data = await res.json();
      setLeaderboard(data);
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    }
  };

  const startGame = async (type: GameType) => {
    if (!playerName.trim()) {
      alert('Please enter your name');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName, gameType: type })
      });
      const data = await res.json();
      setGameId(data.gameId);
      setPlayerId(data.playerId);
      setPlayer(data.player);
      setGameType(type);
      setScreen('game');
    } catch (err) {
      console.error('Failed to start game:', err);
      alert('Failed to start game');
    }
  };

  const buyStock = async () => {
    if (!selectedStock || !tradeAmount) return;

    const shares = parseInt(tradeAmount);
    if (isNaN(shares) || shares <= 0) {
      alert('Please enter a valid number of shares');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/players/${playerId}/buy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: selectedStock.symbol, shares })
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || 'Failed to buy stock');
        return;
      }

      const data = await res.json();
      setPlayer(data.player);
      setTradeAmount('');
      alert(`Successfully bought ${shares} shares of ${selectedStock.symbol}`);
    } catch (err) {
      console.error('Failed to buy stock:', err);
      alert('Failed to buy stock');
    }
  };

  const sellStock = async () => {
    if (!selectedStock || !tradeAmount) return;

    const shares = parseInt(tradeAmount);
    if (isNaN(shares) || shares <= 0) {
      alert('Please enter a valid number of shares');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/players/${playerId}/sell`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: selectedStock.symbol, shares })
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || 'Failed to sell stock');
        return;
      }

      const data = await res.json();
      setPlayer(data.player);
      setTradeAmount('');
      alert(`Successfully sold ${shares} shares of ${selectedStock.symbol}`);
    } catch (err) {
      console.error('Failed to sell stock:', err);
      alert('Failed to sell stock');
    }
  };

  if (screen === 'welcome') {
    return (
      <div className="welcome-screen">
        <div className="welcome-card">
          <h1 className="title">Stock Trading Game</h1>
          <p className="subtitle">Start with $100,000 and build your portfolio</p>

          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="name-input"
          />

          <div className="game-modes">
            <button
              className="mode-btn personal-btn"
              onClick={() => startGame('personal')}
            >
              <h3>Personal Plan</h3>
              <p>Trade solo and compete against yourself</p>
            </button>

            <button
              className="mode-btn family-btn"
              onClick={() => startGame('family')}
            >
              <h3>Family Plan</h3>
              <p>Compete with family members on a shared leaderboard</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-screen">
      <header className="header">
        <h1>Stock Trader</h1>
        <div className="player-info">
          <span className="player-name">{player?.name}</span>
          <span className="player-cash">Cash: ${player?.cash.toLocaleString()}</span>
          <span className="player-total">Total: ${player?.totalValue.toLocaleString()}</span>
        </div>
      </header>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'trade' ? 'active' : ''}`}
          onClick={() => setActiveTab('trade')}
        >
          Trade
        </button>
        <button
          className={`tab ${activeTab === 'portfolio' ? 'active' : ''}`}
          onClick={() => setActiveTab('portfolio')}
        >
          Portfolio
        </button>
        {gameType === 'family' && (
          <button
            className={`tab ${activeTab === 'leaderboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('leaderboard')}
          >
            Leaderboard
          </button>
        )}
      </div>

      <div className="content">
        {activeTab === 'trade' && (
          <div className="trade-view">
            <div className="stocks-list">
              <h2>Available Stocks</h2>
              {stocks.map(stock => (
                <div
                  key={stock.symbol}
                  className={`stock-card ${selectedStock?.symbol === stock.symbol ? 'selected' : ''}`}
                  onClick={() => setSelectedStock(stock)}
                >
                  <div className="stock-header">
                    <span className="stock-symbol">{stock.symbol}</span>
                    <span className="stock-price">${stock.price.toFixed(2)}</span>
                  </div>
                  <div className="stock-name">{stock.name}</div>
                  <div className={`stock-change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                  </div>
                </div>
              ))}
            </div>

            <div className="trade-panel">
              {selectedStock ? (
                <>
                  <h2>Trade {selectedStock.symbol}</h2>
                  <div className="stock-details">
                    <p><strong>{selectedStock.name}</strong></p>
                    <p className="stock-price-large">${selectedStock.price.toFixed(2)}</p>
                  </div>

                  <input
                    type="number"
                    placeholder="Number of shares"
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(e.target.value)}
                    className="trade-input"
                  />

                  {tradeAmount && (
                    <p className="trade-total">
                      Total: ${(selectedStock.price * parseInt(tradeAmount || '0')).toFixed(2)}
                    </p>
                  )}

                  <div className="trade-buttons">
                    <button className="buy-btn" onClick={buyStock}>
                      Buy
                    </button>
                    <button className="sell-btn" onClick={sellStock}>
                      Sell
                    </button>
                  </div>
                </>
              ) : (
                <div className="no-selection">
                  <p>Select a stock to trade</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="portfolio-view">
            <h2>Your Portfolio</h2>
            <div className="portfolio-summary">
              <div className="summary-card">
                <span className="summary-label">Cash</span>
                <span className="summary-value">${player?.cash.toLocaleString()}</span>
              </div>
              <div className="summary-card">
                <span className="summary-label">Portfolio Value</span>
                <span className="summary-value">${player?.portfolioValue?.toLocaleString()}</span>
              </div>
              <div className="summary-card">
                <span className="summary-label">Total Value</span>
                <span className="summary-value gold">${player?.totalValue.toLocaleString()}</span>
              </div>
            </div>

            <div className="holdings">
              {player?.portfolio && player.portfolio.length > 0 ? (
                player.portfolio.map(holding => {
                  const stock = stocks.find(s => s.symbol === holding.symbol);
                  const currentValue = stock ? stock.price * holding.shares : 0;
                  const costBasis = holding.avgPrice * holding.shares;
                  const gain = currentValue - costBasis;
                  const gainPercent = (gain / costBasis) * 100;

                  return (
                    <div key={holding.symbol} className="holding-card">
                      <div className="holding-header">
                        <span className="holding-symbol">{holding.symbol}</span>
                        <span className="holding-shares">{holding.shares} shares</span>
                      </div>
                      <div className="holding-details">
                        <div>
                          <span className="detail-label">Avg Price:</span>
                          <span className="detail-value">${holding.avgPrice.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="detail-label">Current:</span>
                          <span className="detail-value">${stock?.price.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="detail-label">Value:</span>
                          <span className="detail-value">${currentValue.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="detail-label">Gain/Loss:</span>
                          <span className={`detail-value ${gain >= 0 ? 'positive' : 'negative'}`}>
                            ${gain.toFixed(2)} ({gainPercent.toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="empty-state">No holdings yet. Start trading to build your portfolio!</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && gameType === 'family' && (
          <div className="leaderboard-view">
            <h2>Family Leaderboard</h2>
            <div className="leaderboard">
              {leaderboard.map((entry, index) => (
                <div key={entry.id} className={`leaderboard-entry ${entry.id === playerId ? 'current-player' : ''}`}>
                  <span className="rank">#{index + 1}</span>
                  <span className="entry-name">{entry.name}</span>
                  <span className="entry-value">${entry.totalValue.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App
