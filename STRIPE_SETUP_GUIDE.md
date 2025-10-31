# 🚀 TradeWars Stripe Integration Guide

## Overview
This guide will walk you through setting up Stripe payments for your TradeWars Family competition plans.

---

## 📋 Prerequisites

Before you begin, you'll need:
- A **Stripe account** (free to create at [stripe.com](https://stripe.com))
- Your **TradeWars app** (already set up ✅)
- 10-15 minutes to complete setup

---

## 🎯 What We're Setting Up

Your TradeWars app has 3 pricing tiers:
1. **Personal Plan** - FREE (no payment needed)
2. **Family Public Plan** - 1% trading fee per trade
3. **Family Private Plan** - $0.05 flat fee per trade

We'll create Stripe Payment Links for the Family plans so users can pay their entry fees.

---

## 📝 Step-by-Step Setup

### Step 1: Create a Stripe Account

1. Go to [stripe.com](https://stripe.com)
2. Click **"Start now"** or **"Sign up"**
3. Enter your email and create a password
4. Complete the registration process
5. You'll land in your **Stripe Dashboard**

**✅ Checkpoint:** You should see the Stripe Dashboard with a sidebar menu.

---

### Step 2: Activate Your Stripe Account

Before you can accept real payments, activate your account:

1. Click **"Activate account"** in the top banner (if you see it)
2. Fill out your business information:
   - Business name: `TradeWars` or your name
   - Business type: `Individual` or `Company`
   - Industry: `Software/SaaS`
   - Website: Your TradeWars URL or leave blank for now
3. Add your bank account details (where you'll receive payouts)
4. Verify your identity (may require ID upload)

**Note:** You can test payments without activation, but you'll need to activate to receive real money.

---

### Step 3: Create Payment Links

Now we'll create 2 payment links - one for each Family plan.

#### Payment Link #1: Family Public Plan (1% Fee)

1. In your Stripe Dashboard, click **"Payment Links"** in the left sidebar
2. Click **"+ New"** or **"Create payment link"**
3. Configure the payment:
   - **Name:** `TradeWars - Family Public Competition`
   - **Price:** Choose **"Customers choose what they pay"** (since entry fees vary)
     - OR set a fixed amount like `$10.00` if you want a standard entry fee
   - **Currency:** USD
   - **Payment methods:** Leave all enabled (card, Apple Pay, Google Pay, etc.)

4. **Customize the payment page:**
   - Click **"Customize payment page"**
   - **Logo:** Upload TradeWars logo if you have one
   - **Colors:** Choose colors that match your app
   - **Button text:** `Join Competition`
   - **Description:**
     ```
     Entry fee for TradeWars Family Public Competition

     - 1% trading fee per trade
     - Compete with family & friends
     - Winner takes the prize pool
     ```

5. **Additional settings:**
   - ✅ Enable **"Collect customer's billing address"** (to verify identity)
   - ✅ Enable **"Collect customer's name"**
   - ❌ Disable shipping (not needed)

6. Click **"Create link"**

7. **IMPORTANT:** Copy the payment link URL - it looks like:
   ```
   https://buy.stripe.com/test_xxxxxxxxxxxxxxxx
   ```
   **Save this URL** - we'll use it in your app!

---

#### Payment Link #2: Family Private Plan ($0.05 Fee)

Repeat the process above with these changes:

1. Click **"+ New"** again
2. Configure:
   - **Name:** `TradeWars - Family Private Competition`
   - **Price:** Again, choose **"Customers choose what they pay"** OR set fixed amount
   - **Description:**
     ```
     Entry fee for TradeWars Family Private Competition

     - Only $0.05 flat fee per trade
     - Premium low-cost trading
     - Winner takes the prize pool
     ```

3. Create and **save this URL** too!

**✅ Checkpoint:** You should now have 2 Stripe Payment Links saved.

---

### Step 4: Add Payment Links to Your App

Now we'll add these links to your TradeWars code.

1. Open `/home/reidwcoleman/trader/index.html`

2. Find the `TradingSimulator` component (around line 171)

3. Add these constants at the top of the component (after `const [quantityError, setQuantityError] = useState('');`):

```javascript
// Stripe Payment Links
const STRIPE_FAMILY_PUBLIC_LINK = 'YOUR_FAMILY_PUBLIC_LINK_HERE';
const STRIPE_FAMILY_PRIVATE_LINK = 'YOUR_FAMILY_PRIVATE_LINK_HERE';
```

4. Replace `'YOUR_FAMILY_PUBLIC_LINK_HERE'` with your actual Stripe link
5. Replace `'YOUR_FAMILY_PRIVATE_LINK_HERE'` with your actual Stripe link

Example:
```javascript
const STRIPE_FAMILY_PUBLIC_LINK = 'https://buy.stripe.com/test_abc123xyz789';
const STRIPE_FAMILY_PRIVATE_LINK = 'https://buy.stripe.com/test_def456uvw012';
```

---

### Step 5: Update the Create Competition Flow

When users click "Create" or "Join" on Family plans, redirect them to pay:

Find the button click handlers (around line 1380-1450) and update them:

#### For Family Public Plan:

```javascript
<button
    onClick={() => {
        // Redirect to Stripe payment
        window.location.href = STRIPE_FAMILY_PUBLIC_LINK;
    }}
    className="bg-gradient-to-r from-green-400 to-emerald-500 text-white py-3 rounded-xl font-bold text-sm hover:from-green-300 hover:to-emerald-400 transition-all duration-300"
>
    Create
</button>
```

#### For Family Private Plan:

```javascript
<button
    onClick={() => {
        // Redirect to Stripe payment
        window.location.href = STRIPE_FAMILY_PRIVATE_LINK;
    }}
    className="bg-gradient-to-r from-purple-400 to-pink-500 text-white py-3 rounded-xl font-bold text-sm hover:from-purple-300 hover:to-pink-400 transition-all duration-300"
>
    Create
</button>
```

---

### Step 6: Handle Payment Success

After users complete payment, Stripe will redirect them back. You can:

1. **Option A: Simple Approach (Recommended for MVP)**
   - After payment, users manually join the competition using the setup form
   - You verify payment manually via Stripe Dashboard

2. **Option B: Automated (Requires Backend)**
   - Set up Stripe webhooks to automatically create competitions
   - Use success URL parameters to verify payment
   - This is more complex but provides better UX

For now, let's go with **Option A** (simple).

---

### Step 7: Test Your Integration

#### Test Mode (Fake Payments)

Stripe gives you test mode by default. Use these test cards:

1. Click a Family plan **"Create"** button
2. You'll be redirected to Stripe checkout
3. Enter test card: `4242 4242 4242 4242`
4. Expiry: Any future date (e.g., `12/34`)
5. CVC: Any 3 digits (e.g., `123`)
6. ZIP: Any 5 digits (e.g., `12345`)
7. Click **"Pay"**

**✅ Success!** You should see the Stripe success page.

#### Live Mode (Real Payments)

Once you've activated your Stripe account:

1. In Stripe Dashboard, toggle from **"Test mode"** to **"Live mode"** (top right)
2. Create new payment links in Live mode (same process as above)
3. Update your app with the **live** payment link URLs
4. Deploy your app
5. Now users will be charged real money! 💰

---

## 🔍 Monitoring Payments

### View Payments in Dashboard

1. Go to Stripe Dashboard → **"Payments"**
2. You'll see all successful payments
3. Click any payment to see:
   - Customer name
   - Amount paid
   - Email address
   - Date/time

### Track Competition Entries

Since we're using the simple approach:

1. When someone completes payment, they'll email/text you
2. Check Stripe Dashboard to verify payment
3. Give them access to create/join competition

### Payouts

Stripe automatically deposits money to your bank account:
- **Default schedule:** Every 2 business days
- You can change this in Dashboard → **"Balance"** → **"Payout schedule"**

---

## 💡 Pro Tips

### 1. Use Metadata to Track Users

When creating payment links, add custom fields:
- Go to payment link settings
- Enable **"Collect additional information"**
- Ask for: Username, Competition Code, etc.

### 2. Send Receipts Automatically

Stripe sends email receipts automatically. Make sure they're enabled:
- Dashboard → **"Settings"** → **"Emails"**
- Toggle on **"Successful payments"**

### 3. Enable Multiple Currencies

If you have international users:
- Dashboard → **"Settings"** → **"Payment methods"**
- Enable **"Adaptive pricing"**

### 4. Set Up Refund Policy

Go to Dashboard → **"Settings"** → **"Policies"**
Add your refund policy so users know what to expect.

---

## 🚨 Important Security Notes

### DO NOT Share These:

❌ **Secret API Keys** - Never put these in frontend code
❌ **Stripe Dashboard Password** - Keep it secure

### SAFE to Share:

✅ **Payment Link URLs** - These are public and safe
✅ **Publishable API Keys** - If you use Stripe.js later

---

## 📞 Need Help?

### Stripe Support
- Dashboard → **"Help"** (top right)
- [Stripe Support Center](https://support.stripe.com)
- [Stripe Docs](https://docs.stripe.com)

### Test Cards
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Authentication required: `4000 0025 0000 3155`

---

## ✅ Checklist

Before going live, make sure:

- [ ] Stripe account is **activated**
- [ ] Bank account is **connected**
- [ ] Payment links are created in **Live mode**
- [ ] Payment links are **added to your code**
- [ ] You've **tested** in Test mode
- [ ] You've **deployed** your updated app
- [ ] Users can successfully **complete payment**
- [ ] You can **see payments** in Dashboard

---

## 🎉 You're Done!

Your TradeWars app now has Stripe payments integrated! Users can:

1. Choose Family Public or Family Private plan
2. Click "Create" to pay their entry fee
3. Complete payment securely via Stripe
4. Join the competition and start trading

---

## 🔄 Next Steps (Optional Enhancements)

### Future Improvements:

1. **Automatic Competition Creation**
   - Use Stripe webhooks
   - Auto-create competition after payment
   - Send competition code via email

2. **Subscription Plans**
   - Monthly/yearly Family plans
   - Recurring payments for ongoing competitions

3. **Stripe Elements**
   - Embed checkout directly in your app
   - Better user experience (no redirect)

4. **Payment History**
   - Show users their payment history
   - Download receipts from your app

---

**Questions?** Check the Stripe docs or reach out for help!

Happy trading! 🚀📈
