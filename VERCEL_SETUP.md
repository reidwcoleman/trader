# Vercel Environment Variables Setup

## 📧 Email Configuration (Required for Password Reset)

Go to your Vercel project → **Settings** → **Environment Variables**

Add these 2 variables:

### 1. EMAIL_USER
- **Key:** `EMAIL_USER`
- **Value:** `finclash101@gmail.com`
- **Environment:** Production, Preview, Development (select all)

### 2. EMAIL_PASSWORD
- **Key:** `EMAIL_PASSWORD`
- **Value:** Your Gmail App Password (see instructions below)
- **Environment:** Production, Preview, Development (select all)

---

## 🔑 How to Get Gmail App Password

1. **Enable 2-Factor Authentication** on your Google account:
   - Go to https://myaccount.google.com/security
   - Under "How you sign in to Google" → Enable "2-Step Verification"

2. **Generate App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select app: "Mail"
   - Select device: "Other (Custom name)" → Type "FinClash Vercel"
   - Click "Generate"
   - Copy the 16-character password (format: `xxxx xxxx xxxx xxxx`)

3. **Use the App Password in Vercel**:
   - Paste it into the `EMAIL_PASSWORD` environment variable
   - **Remove all spaces** - should be 16 characters with no spaces

---

## 💳 Stripe Configuration (Optional - Only if using Family Competitions)

### 3. STRIPE_SECRET_KEY
- **Key:** `STRIPE_SECRET_KEY`
- **Value:** Your Stripe secret key (starts with `sk_live_` or `sk_test_`)
- **Environment:** Production, Preview, Development

### 4. STRIPE_PRICE_ID
- **Key:** `STRIPE_PRICE_ID`
- **Value:** Your Stripe price ID (starts with `price_`)
- **Environment:** Production, Preview, Development

---

## ✅ After Adding Environment Variables

1. Go to **Deployments** tab in Vercel
2. Click the **3 dots** on your latest deployment
3. Click **Redeploy**
4. Select **Use existing Build Cache** → Click **Redeploy**

Your password reset emails will now work! 🎉

---

## 🧪 Test Password Reset

1. Visit your deployed site
2. Create a personal account
3. Go to login page
4. Click "Forgot your passcode?"
5. Enter your email
6. Check your inbox for the passcode email!

---

## ❌ Troubleshooting

**Email not sending?**
- Check that `EMAIL_USER` is exactly: `finclash101@gmail.com`
- Check that `EMAIL_PASSWORD` has no spaces
- Verify 2FA is enabled on the Gmail account
- Make sure you generated an App Password (not your regular Gmail password)
- Check Vercel logs: Deployments → Click deployment → Function Logs

**"No environment variable" error?**
- Make sure you redeployed after adding the variables
- Check that variables are set for all environments (Production, Preview, Development)
