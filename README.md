# Stock Trading Simulator

A browser-based stock trading simulator with personal accounts, family competitions, and real-time stock data.

## Features

- **Personal Accounts**: Create your own trading account with email and secure passcode
- **Family Competitions**: Create or join family trading pools with real money prizes
- **Global Leaderboard**: Compete with traders worldwide (powered by Supabase)
- **Password Reset**: Email-based passcode recovery system
- **Real-time Data**: Live stock prices powered by Finnhub API
- **Virtual Trading**: Start with $100,000 virtual cash

## Getting Started

### 1. Open the App

Simply open `index.html` in your web browser. The app runs entirely in the browser using SQL.js (SQLite compiled to WebAssembly).

### 2. Set Up Password Reset (Optional)

To enable password reset functionality, you need to run the email server:

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

### Family Competitions

- **Public Pools**: Join open competitions with entry fees
- **Private Pools**: Create private competitions for family/friends
- **Prize System**: Winner takes all! Integrated with Stripe for payments

## Tech Stack

- **Frontend**: Pure HTML/CSS/JavaScript with React (via Babel standalone)
- **Database**: SQL.js (SQLite in the browser)
- **Cloud Sync**: Supabase for global leaderboard
- **Stock Data**: Finnhub API
- **Payments**: Stripe
- **Email**: Nodemailer + Gmail SMTP

## File Structure

```
trader/
├── index.html          # Main app file (includes all React code)
├── server.js           # Email server for password reset
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
