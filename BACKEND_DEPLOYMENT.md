# Backend Deployment Guide

## Problem
The app currently only works on the device where you're running the backend server (localhost:3001). To make sign-in work across all devices, you need to deploy the backend server to a cloud platform.

## Solution
Deploy the `server.js` backend to a cloud platform and update the API URL in `index.html`.

## Quick Deploy Options

### Option 1: Render (Recommended - Free Tier Available)

1. **Create account**: Go to https://render.com and sign up

2. **Create new Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `finclash-backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `node server.js`
     - **Plan**: Free

3. **Add Environment Variables**:
   - Click "Environment" tab
   - Add your `.env` variables:
     - `STRIPE_SECRET_KEY`
     - `EMAIL_USER`
     - `EMAIL_PASS`
     - `PORT` (optional, Render sets this automatically)

4. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment (2-3 minutes)
   - Copy your app URL: `https://finclash-backend.onrender.com`

5. **Update Frontend**:
   - Open `index.html`
   - Find line 49: `const API_BASE_URL = ...`
   - Replace `https://your-backend-url.onrender.com` with your actual URL
   - Example:
     ```javascript
     const API_BASE_URL = window.location.hostname === 'localhost'
         ? 'http://localhost:3001'
         : 'https://finclash-backend.onrender.com';
     ```

6. **Commit and Push**:
   ```bash
   git add index.html
   git commit -m "Update backend URL for production"
   git push
   ```

### Option 2: Railway

1. Go to https://railway.app
2. Click "Start a New Project"
3. Connect GitHub repo
4. Select `server.js` as entry point
5. Add environment variables
6. Copy deployment URL
7. Update `index.html` line 49 with your URL

### Option 3: Heroku

1. Go to https://heroku.com
2. Create new app
3. Connect GitHub repo
4. Add Node.js buildpack
5. Add environment variables in Settings → Config Vars
6. Deploy from GitHub branch
7. Copy app URL (e.g., `https://your-app.herokuapp.com`)
8. Update `index.html` line 49

## File Storage Note

⚠️ **Important**: The current backend uses JSON files for storage (`accounts.json`, `family-users.json`). These will be reset on Render/Railway/Heroku free tiers when the server restarts.

### Recommended: Switch to Database
For persistent storage, consider migrating to:
- **MongoDB Atlas** (free tier available)
- **PostgreSQL** (via Render/Railway)
- **Supabase** (free tier available)

## Testing

After deployment:

1. **Test Account Creation**:
   - Go to your GitHub Pages site
   - Create a new account
   - Check if it saves

2. **Test Cross-Device Login**:
   - Open site on phone
   - Login with email + password
   - Should see your portfolio

3. **Check Console**:
   - Open browser DevTools → Console
   - Should see API calls to your deployed backend URL
   - No errors about "localhost" or CORS

## Troubleshooting

### CORS Errors
If you see CORS errors, add to `server.js`:
```javascript
app.use(cors({
    origin: [
        'https://yourusername.github.io',
        'http://localhost:5500',
        'http://127.0.0.1:5500'
    ],
    credentials: true
}));
```

### Server Not Starting
- Check Render logs: Dashboard → Logs
- Verify all environment variables are set
- Ensure `package.json` has correct start script

### 404 Errors
- Verify backend URL is correct (include https://)
- Check backend is running: visit `https://your-backend-url.onrender.com` in browser
- Should see "Cannot GET /" (this is normal)

## Current Configuration

The app is configured to automatically detect the environment:
- **Local development** (`localhost`): Uses `http://localhost:3001`
- **Production** (GitHub Pages): Uses your deployed backend URL

You just need to:
1. Deploy backend to Render/Railway/Heroku
2. Update line 49 in `index.html` with your backend URL
3. Commit and push

That's it! Sign-in will work across all devices.
