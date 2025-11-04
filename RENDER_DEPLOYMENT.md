# Deploy FinClash Backend to Render

This guide will help you deploy the FinClash backend server to Render's free tier, enabling cross-device sign-in for your trading simulator.

## Prerequisites

- GitHub account (you already have this)
- Render account (free at https://render.com)
- Your backend code is already in the repository

## Step 1: Prepare Your Repository

Your backend server (`server.js`) is already ready! Make sure these files are committed:

```bash
git add server.js package.json package-lock.json
git commit -m "Prepare backend for Render deployment"
git push
```

## Step 2: Create Render Account

1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with your GitHub account (easiest option)
4. Authorize Render to access your GitHub repositories

## Step 3: Create a New Web Service

1. From the Render dashboard, click **"New +"** button
2. Select **"Web Service"**
3. Connect your GitHub repository:
   - Find and select `reidwcoleman/trader`
   - Click "Connect"

## Step 4: Configure the Web Service

Fill in the following settings:

**Basic Settings:**
- **Name:** `finclash-backend` (or any name you prefer)
- **Region:** Choose closest to you (e.g., Oregon USA)
- **Branch:** `main`
- **Root Directory:** Leave blank (or enter `.` if required)
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `node server.js`

**Instance Type:**
- Select **"Free"** ($0/month)
  - Note: Free tier may spin down after 15 minutes of inactivity
  - First request after spindown takes ~30 seconds to wake up

## Step 5: Add Environment Variables

Scroll down to **"Environment Variables"** section and add these:

Click **"Add Environment Variable"** for each:

| Key | Value |
|-----|-------|
| `PORT` | `3001` |
| `NODE_ENV` | `production` |
| `EMAIL_USER` | `your-email@gmail.com` |
| `EMAIL_PASSWORD` | `your-app-password` |
| `STRIPE_SECRET_KEY` | `sk_test_...` (your Stripe secret key) |
| `STRIPE_PRICE_ID` | `price_1SOOX5R10Q6bz3BHHG41VhbP` |

**For Gmail App Password:**
1. Go to https://myaccount.google.com/apppasswords
2. Create an app password for "FinClash Backend"
3. Use that 16-character password for `EMAIL_PASSWORD`

## Step 6: Deploy

1. Click **"Create Web Service"** at the bottom
2. Render will now:
   - Clone your repository
   - Run `npm install`
   - Start your server with `node server.js`
3. Wait 2-5 minutes for deployment to complete

## Step 7: Get Your Backend URL

Once deployment succeeds:

1. You'll see a green "Live" badge
2. Your backend URL will be displayed at the top:
   ```
   https://finclash-backend.onrender.com
   ```
3. Copy this URL (you'll need it in the next step)

## Step 8: Test Your Backend

Test the health endpoint:

```bash
curl https://finclash-backend.onrender.com/api/health
```

Should return:
```json
{"status":"OK","message":"Server is running"}
```

## Step 9: Update Frontend with Production URL

Edit `index.html` line 49:

```javascript
const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3001'
    : 'https://finclash-backend.onrender.com'; // ← Replace with YOUR Render URL
```

Commit and push:

```bash
git add index.html
git commit -m "Update production API URL for Render backend"
git push
```

## Step 10: Verify Cross-Device Login

1. **Device 1:** Go to your deployed FinClash site
2. Create an account with email/password
3. **Device 2:** Go to the same FinClash site
4. Login with the same email/password
5. ✅ You should see your account and portfolio!

## Important Notes

### Free Tier Limitations

- **Spin Down:** Free services spin down after 15 minutes of inactivity
- **Cold Start:** First request takes 30-60 seconds to wake up
- **No Persistent Disk:** Data is stored in JSON files, which persist across deploys but may be lost on service restarts

### Recommended: Upgrade to Persistent Storage

For production use, consider:

1. **Add PostgreSQL Database** (free tier available on Render)
2. **Or use MongoDB Atlas** (free tier, persistent)

This prevents data loss when the service spins down.

### Monitoring Your Backend

- View logs in Render dashboard under "Logs" tab
- Check deployment status in "Events" tab
- Monitor uptime and response times in "Metrics" tab

## Troubleshooting

### Deployment Failed

**Check Build Logs:**
1. Go to Render dashboard → Your service
2. Click "Logs" tab
3. Look for error messages during `npm install` or startup

**Common Issues:**
- Missing `package.json` → Make sure it's committed to git
- Wrong Node version → Add `"engines": {"node": "18.x"}` to package.json
- Port issues → Render sets PORT automatically, make sure server.js uses `process.env.PORT`

### Can't Connect from Frontend

**CORS Issues:**
- Your server.js already has CORS enabled (`app.use(cors())`)
- Make sure the Render service is "Live" (green badge)

**Wrong URL:**
- Double-check the URL in index.html matches your Render URL exactly
- Include `https://` and no trailing slash

### Data Not Persisting

**JSON Files Reset:**
- Free tier doesn't guarantee file persistence
- Upgrade to paid tier ($7/month) for persistent disk
- Or migrate to PostgreSQL/MongoDB for proper database

## Environment Variables Reference

Your server.js needs these environment variables:

```bash
PORT=3001                                    # Auto-set by Render
EMAIL_USER=your-email@gmail.com              # For password reset emails
EMAIL_PASSWORD=your-16-char-app-password     # Gmail app password
STRIPE_SECRET_KEY=sk_test_...                # For payment processing
STRIPE_PRICE_ID=price_1SOOX5R10Q6bz3BHHG41VhbP  # $5 family access
```

## Next Steps

Once deployed:

1. ✅ Cross-device login works!
2. Consider adding a database for better data persistence
3. Monitor usage and upgrade if needed
4. Set up custom domain (optional)

## Support

If you encounter issues:

1. Check Render logs first
2. Test the `/api/health` endpoint
3. Verify environment variables are set correctly
4. Check that your GitHub repo is up to date

---

**Your backend is now live and accessible from any device! 🚀**
