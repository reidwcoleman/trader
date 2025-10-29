# Stock Trading Game

A full-stack stock trading simulation game where you start with $100,000 and compete to build the most valuable portfolio. Features both Personal and Family game modes with real-time stock price updates.

## Features

- **Two Game Modes:**
  - **Personal Plan**: Trade solo and track your own performance
  - **Family Plan**: Compete with family members on a shared leaderboard

- **Real-time Stock Trading:**
  - 10 popular stocks with simulated price movements
  - Live price updates every 5 seconds
  - Buy and sell stocks instantly

- **Portfolio Management:**
  - Start with $100,000 cash
  - Track your holdings and performance
  - View gain/loss for each position
  - Real-time portfolio valuation

- **Beautiful UI:**
  - Dark navy color scheme with gold accents
  - Responsive design for all devices
  - Smooth animations and transitions

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite for fast development
- CSS3 with custom properties

**Backend:**
- Node.js with Express
- In-memory data storage
- RESTful API

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd trader
```

2. Install server dependencies
```bash
cd server
npm install
```

3. Install client dependencies
```bash
cd ../client
npm install
```

### Running the Application

You'll need two terminal windows:

**Terminal 1 - Start the backend server:**
```bash
cd server
npm start
```
The server will run on http://localhost:3001

**Terminal 2 - Start the frontend:**
```bash
cd client
npm run dev
```
The client will run on http://localhost:5173

### How to Play

1. **Enter your name** on the welcome screen
2. **Choose a game mode:**
   - Personal Plan: Solo trading experience
   - Family Plan: Share the game ID with family members to compete together
3. **Start trading:**
   - Click on a stock to select it
   - Enter the number of shares you want to buy or sell
   - Click Buy or Sell to execute the trade
4. **Track your performance:**
   - View your portfolio in the Portfolio tab
   - Check the leaderboard in Family mode
   - Monitor stock prices in real-time

## Game Rules

- You start with **$100,000 cash**
- Buy stocks when prices are low, sell when high
- You can only sell stocks you own
- You cannot buy more than you can afford
- Stock prices update every 5 seconds
- In Family mode, compete for the highest total portfolio value

## Available Stocks

- AAPL - Apple Inc.
- MSFT - Microsoft Corporation
- GOOGL - Alphabet Inc.
- AMZN - Amazon.com Inc.
- TSLA - Tesla Inc.
- META - Meta Platforms Inc.
- NVDA - NVIDIA Corporation
- NFLX - Netflix Inc.
- DIS - The Walt Disney Company
- PYPL - PayPal Holdings Inc.

## Project Structure

```
trader/
├── client/                 # React frontend
│   ├── src/
│   │   ├── App.tsx        # Main application component
│   │   ├── App.css        # Styling
│   │   └── index.css      # Global styles
│   └── package.json
├── server/                 # Express backend
│   ├── server.js          # API server
│   └── package.json
└── README.md
```

## API Endpoints

### Stocks
- `GET /api/stocks` - Get all stocks
- `GET /api/stocks/:symbol` - Get specific stock

### Games
- `POST /api/games` - Create new game
- `GET /api/games/:gameId` - Get game data
- `POST /api/games/:gameId/join` - Join family game
- `GET /api/games/:gameId/leaderboard` - Get leaderboard

### Players
- `GET /api/players/:playerId` - Get player data
- `POST /api/players/:playerId/buy` - Buy stock
- `POST /api/players/:playerId/sell` - Sell stock

## Future Enhancements

- Historical price charts
- Stock market news events
- Trading history and analytics
- Achievements and badges
- Real stock data integration
- WebSocket for real-time updates
- Persistent storage with database
- User authentication
- Mobile app

## License

MIT

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
