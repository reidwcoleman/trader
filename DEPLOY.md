# 🚀 Deploy FinClash to Production

This guide will help you deploy FinClash so it works on all devices worldwide.

## Architecture

- **Frontend**: GitHub Pages (serves index.html and static files)
- **Backend**: Render.com (Node.js server with Express API)
- **Database**: JSON files (accounts, chat messages)

## Quick Deploy Steps

### 1. Deploy Backend to Render

**Option A: Automatic Deploy (Recommended)**

1. Go to https://render.com and sign in with GitHub
2. Click **"New +"** → **"Blueprint"**
3. Select your repository: `reidwcoleman/trader`
4. Render will read `render.yaml` and auto-configure
5. Add environment variables in Render dashboard:
   - `EMAIL_USER`: your-email@gmail.com
   - `EMAIL_PASSWORD`: your-gmail-app-password
   - `STRIPE_SECRET_KEY`: your-stripe-key
6. Click **"Apply"** - your backend will deploy automatically!

**Option B: Manual Deploy**

Follow the detailed guide in `RENDER_DEPLOYMENT.md`

### 2. Get Your Backend URL

Once deployed, copy your Render URL:
```
https://finclash-backend.onrender.com
```

If you chose a different name, it will be:
```
https://YOUR-SERVICE-NAME.onrender.com
```

### 3. Update Frontend Configuration

The code already auto-detects the environment! ✅

- **Localhost**: Uses `http://localhost:3001`
- **Production**: Uses `https://finclash-backend.onrender.com`

If your Render URL is different, edit `index.html` line 48:

```javascript
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3001'
    : 'https://YOUR-BACKEND-URL.onrender.com'; // ← Update this
```

### 4. Enable GitHub Pages

1. Go to GitHub repository settings
2. Navigate to **Pages** (left sidebar)
3. Under **Source**, select: **Deploy from a branch**
4. Select branch: **main** and folder: **/ (root)**
5. Click **Save**
6. Wait 1-2 minutes for deployment

Your app will be live at:
```
https://reidwcoleman.github.io/trader/
```

### 5. Test Cross-Device Access

1. **On your computer**:
   - Go to `https://reidwcoleman.github.io/trader/`
   - Create an account with email/password

2. **On your phone**:
   - Go to the same URL
   - Sign in with the same credentials
   - ✅ Your portfolio should sync!

3. **On any device worldwide**:
   - Just visit the GitHub Pages URL
   - All data is stored on the Render backend

## Environment Variables

Set these in Render dashboard (NOT in .env file for production):

```bash
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PRICE_ID=price_1SOOX5R10Q6bz3BHHG41VhbP
PORT=3001  # Auto-set by Render
NODE_ENV=production
```

## Important Notes

### Free Tier Limitations

- ⏰ **Cold Starts**: Free Render services sleep after 15 mins of inactivity
- 🕐 **Wake Time**: First request takes 30-60 seconds after sleep
- 💾 **Data Persistence**: JSON files may reset on service restart

### Recommended Upgrades

For production use:

1. **Render Starter Plan** ($7/month)
   - Persistent disk
   - No cold starts
   - Better performance

2. **Add PostgreSQL Database** (free tier available)
   - Better data persistence
   - Proper ACID compliance
   - Scalable

## Troubleshooting

### Backend Not Responding

Check Render logs:
1. Go to Render dashboard
2. Click on your service
3. View **Logs** tab

Common issues:
- Service is sleeping (wait 30 secs)
- Environment variables not set
- CORS error (check server.js CORS config)

### Frontend Can't Connect

1. Check browser console for errors
2. Verify backend URL in index.html matches Render URL
3. Test backend health: `curl https://your-backend.onrender.com/api/health`

### Data Not Persisting

On free tier, data resets when service restarts. Solutions:
- Upgrade to paid tier ($7/month) for persistent disk
- Migrate to PostgreSQL database
- Use MongoDB Atlas (free tier available)

## File Structure

```
trader/
├── index.html              # Frontend (served by GitHub Pages)
├── server.js               # Backend API (runs on Render)
├── render.yaml             # Render deployment config
├── package.json            # Node.js dependencies
├── data/                   # Data directory (ignored by git)
│   └── .gitkeep
├── accounts.json           # User accounts (auto-created)
├── chat-messages.json      # Chat history (auto-created)
└── family-users.json       # Family plan users (auto-created)
```

## Security Notes

- ✅ Never commit `.env` file to git (already in .gitignore)
- ✅ Use environment variables in Render for secrets
- ✅ API keys are never exposed to frontend
- ✅ Passwords are hashed with bcrypt
- ✅ CORS configured for GitHub Pages only

## Next Steps

Once deployed:

1. ✅ Test on multiple devices
2. Share the GitHub Pages URL with users
3. Monitor usage in Render dashboard
4. Consider upgrading for better performance
5. Set up custom domain (optional)

## Support

Need help? Check:
- Render logs (for backend issues)
- Browser console (for frontend issues)
- `RENDER_DEPLOYMENT.md` (detailed backend guide)
- GitHub Issues

---

**Your app is now accessible worldwide! 🌍**

Live at: `https://reidwcoleman.github.io/trader/`
