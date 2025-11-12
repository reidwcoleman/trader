# Stock Trading Simulator

A browser-based stock trading simulator with personal accounts, global leaderboards, and real-time stock data.

## Features

- **Personal Accounts**: Create your own trading account with email and secure passcode
- **Global Leaderboard**: Compete with traders worldwide (powered by Supabase)
- **Password Reset**: Email-based passcode recovery system
- **Real-time Data**: Live stock prices powered by Finnhub API
- **Virtual Trading**: Start with $100,000 virtual cash
- **Risk-Free Practice**: Learn trading strategies without risking real money

## 🌐 Live Demo

**Visit the live app:** Coming soon after deployment!

## Getting Started

### Option 1: Deploy to Vercel (Recommended - FREE!)

Deploy your own automated free website in 3 minutes:

1. **Fork this repo** to your GitHub account

2. **Sign up for Vercel** at [vercel.com](https://vercel.com) (free forever)

3. **Import your GitHub repo** in Vercel
   - Click "New Project"
   - Select your forked `trader` repo
   - Vercel auto-detects the configuration

4. **Add Environment Variables** (for password reset emails):
   - In Vercel dashboard → Settings → Environment Variables
   - Add these variables:
     - `EMAIL_USER`: Your Gmail address
     - `EMAIL_PASSWORD`: Your Gmail [App Password](https://support.google.com/accounts/answer/185833)

5. **Deploy!**
   - Click "Deploy"
   - Your site will be live at `https://your-app.vercel.app`
   - Auto-deploys on every git push! 🚀

### Option 2: Run Locally

Simply open `index.html` in your web browser. The app runs entirely in the browser using SQL.js (SQLite compiled to WebAssembly).

### Option 3: Local Development with Email Server

To enable password reset functionality locally, you need to run the email server:

#### Step 1: Configure Email Settings

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your email credentials:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-specific-password
   PORT=3001
   ```

   **For Gmail users:**
   - Use an [App Password](https://support.google.com/accounts/answer/185833) instead of your regular password
   - Enable 2-Factor Authentication on your Google account
   - Generate an App Password in Security Settings

#### Step 2: Start the Email Server

```bash
npm install
npm start
```

The server will run on `http://localhost:3001`

#### Step 3: Test Password Reset

1. Create a personal account in the app
2. Go to the login page
3. Click "Forgot your passcode?"
4. Enter your email address
5. Check your email for the passcode

## Account System

### Personal Accounts

- **Create**: Choose a name and email → Get a 6-digit passcode
- **Login**: Use email + passcode to access your account from any device
- **Reset**: Forgot your passcode? Get it sent to your email

## Tech Stack

- **Frontend**: Pure HTML/CSS/JavaScript with React (via Babel standalone)
- **Database**: SQL.js (SQLite in the browser)
- **Hosting**: Vercel (serverless deployment)
- **API**: Vercel Serverless Functions
- **Cloud Sync**: Supabase for global leaderboard
- **Stock Data**: Finnhub API
- **Email**: Nodemailer + Gmail SMTP

## File Structure

```
trader/
├── index.html          # Main app file (includes all React code)
├── server.js           # Email server for local development
├── api/                # Vercel serverless functions
│   ├── send-password-reset.js  # Password reset API
│   └── health.js       # Health check endpoint
├── vercel.json         # Vercel deployment configuration
├── .env.example        # Example environment variables
├── .env                # Your email credentials (git-ignored)
├── package.json        # Node.js dependencies
├── README.md           # This file
└── supabase-setup.sql  # SQL for Supabase leaderboard setup
```

## Security Notes

- Passcodes are stored in plain text in browser localStorage (this is a demo app)
- For production use, implement proper authentication with hashed passwords
- Never commit your `.env` file - it contains sensitive email credentials
- Use app-specific passwords, never your main email password

## Development

### Running Without Email Server

The app works perfectly fine without the email server. Password reset will show an error, but all other features work normally:

- Create accounts
- Login with email + passcode
- Trade stocks
- Join competitions
- View leaderboard

### Testing Locally

1. Open `index.html` in your browser
2. Create a test account
3. Make some trades
4. Your data is saved in browser localStorage

## Support

For issues or questions, please open an issue on GitHub.

## License

MIT License
