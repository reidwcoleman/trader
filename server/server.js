const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Mock stock data with realistic price movements
const stocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 178.50, change: 2.5, changePercent: 1.42 },
  { symbol: 'MSFT', name: 'Microsoft Corporation', price: 378.91, change: -1.2, changePercent: -0.32 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 141.80, change: 3.8, changePercent: 2.75 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.25, change: 5.2, changePercent: 3.01 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 242.84, change: -8.5, changePercent: -3.38 },
  { symbol: 'META', name: 'Meta Platforms Inc.', price: 501.25, change: 12.3, changePercent: 2.51 },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 875.28, change: 18.7, changePercent: 2.18 },
  { symbol: 'NFLX', name: 'Netflix Inc.', price: 485.33, change: -3.2, changePercent: -0.65 },
  { symbol: 'DIS', name: 'The Walt Disney Company', price: 95.75, change: 1.8, changePercent: 1.91 },
  { symbol: 'PYPL', name: 'PayPal Holdings Inc.', price: 62.40, change: -0.8, changePercent: -1.27 }
];

// In-memory storage for game data
const games = new Map(); // gameId -> game data
const players = new Map(); // playerId -> player data
const familyRooms = new Map(); // roomId -> room data

// Simulate stock price changes
setInterval(() => {
  stocks.forEach(stock => {
    const changePercent = (Math.random() - 0.5) * 2; // -1% to +1%
    const change = stock.price * (changePercent / 100);
    stock.price = Math.max(1, stock.price + change);
    stock.change = change;
    stock.changePercent = changePercent;
  });
}, 5000); // Update every 5 seconds

// Get all stocks
app.get('/api/stocks', (req, res) => {
  res.json(stocks);
});

// Get specific stock
app.get('/api/stocks/:symbol', (req, res) => {
  const stock = stocks.find(s => s.symbol === req.params.symbol);
  if (stock) {
    res.json(stock);
  } else {
    res.status(404).json({ error: 'Stock not found' });
  }
});

// Create new game (personal or family)
app.post('/api/games', (req, res) => {
  const { playerName, gameType } = req.body; // gameType: 'personal' or 'family'
  const gameId = uuidv4();
  const playerId = uuidv4();

  const player = {
    id: playerId,
    name: playerName,
    cash: 100000,
    portfolio: [],
    totalValue: 100000,
    gameId: gameId
  };

  const game = {
    id: gameId,
    type: gameType,
    createdAt: new Date().toISOString(),
    players: [player]
  };

  games.set(gameId, game);
  players.set(playerId, player);

  res.json({ gameId, playerId, player });
});

// Join family game
app.post('/api/games/:gameId/join', (req, res) => {
  const { gameId } = req.params;
  const { playerName } = req.body;

  const game = games.get(gameId);

  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }

  if (game.type !== 'family') {
    return res.status(400).json({ error: 'Can only join family games' });
  }

  const playerId = uuidv4();
  const player = {
    id: playerId,
    name: playerName,
    cash: 100000,
    portfolio: [],
    totalValue: 100000,
    gameId: gameId
  };

  game.players.push(player);
  players.set(playerId, player);

  res.json({ playerId, player });
});

// Get game data
app.get('/api/games/:gameId', (req, res) => {
  const game = games.get(req.params.gameId);
  if (game) {
    res.json(game);
  } else {
    res.status(404).json({ error: 'Game not found' });
  }
});

// Get player data
app.get('/api/players/:playerId', (req, res) => {
  const player = players.get(req.params.playerId);
  if (player) {
    // Calculate current portfolio value
    let portfolioValue = 0;
    player.portfolio.forEach(holding => {
      const stock = stocks.find(s => s.symbol === holding.symbol);
      if (stock) {
        portfolioValue += stock.price * holding.shares;
      }
    });

    const updatedPlayer = {
      ...player,
      portfolioValue,
      totalValue: player.cash + portfolioValue
    };

    res.json(updatedPlayer);
  } else {
    res.status(404).json({ error: 'Player not found' });
  }
});

// Buy stock
app.post('/api/players/:playerId/buy', (req, res) => {
  const { symbol, shares } = req.body;
  const player = players.get(req.params.playerId);

  if (!player) {
    return res.status(404).json({ error: 'Player not found' });
  }

  const stock = stocks.find(s => s.symbol === symbol);
  if (!stock) {
    return res.status(404).json({ error: 'Stock not found' });
  }

  const totalCost = stock.price * shares;

  if (player.cash < totalCost) {
    return res.status(400).json({ error: 'Insufficient funds' });
  }

  // Update player's portfolio
  player.cash -= totalCost;

  const existingHolding = player.portfolio.find(h => h.symbol === symbol);
  if (existingHolding) {
    const totalShares = existingHolding.shares + shares;
    const totalCostBasis = (existingHolding.avgPrice * existingHolding.shares) + (stock.price * shares);
    existingHolding.shares = totalShares;
    existingHolding.avgPrice = totalCostBasis / totalShares;
  } else {
    player.portfolio.push({
      symbol,
      shares,
      avgPrice: stock.price
    });
  }

  res.json({ player, transaction: { type: 'buy', symbol, shares, price: stock.price } });
});

// Sell stock
app.post('/api/players/:playerId/sell', (req, res) => {
  const { symbol, shares } = req.body;
  const player = players.get(req.params.playerId);

  if (!player) {
    return res.status(404).json({ error: 'Player not found' });
  }

  const stock = stocks.find(s => s.symbol === symbol);
  if (!stock) {
    return res.status(404).json({ error: 'Stock not found' });
  }

  const holding = player.portfolio.find(h => h.symbol === symbol);
  if (!holding || holding.shares < shares) {
    return res.status(400).json({ error: 'Insufficient shares' });
  }

  const totalValue = stock.price * shares;
  player.cash += totalValue;

  if (holding.shares === shares) {
    player.portfolio = player.portfolio.filter(h => h.symbol !== symbol);
  } else {
    holding.shares -= shares;
  }

  res.json({ player, transaction: { type: 'sell', symbol, shares, price: stock.price } });
});

// Get leaderboard for a game
app.get('/api/games/:gameId/leaderboard', (req, res) => {
  const game = games.get(req.params.gameId);

  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }

  const leaderboard = game.players.map(player => {
    let portfolioValue = 0;
    player.portfolio.forEach(holding => {
      const stock = stocks.find(s => s.symbol === holding.symbol);
      if (stock) {
        portfolioValue += stock.price * holding.shares;
      }
    });

    return {
      id: player.id,
      name: player.name,
      totalValue: player.cash + portfolioValue,
      cash: player.cash,
      portfolioValue
    };
  }).sort((a, b) => b.totalValue - a.totalValue);

  res.json(leaderboard);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
