# Stripe Integration Guide for MoPets

## 🚀 Quick Setup

Since you already have Stripe, here's how to integrate it with your MoPets app:

### 1. Get Your Stripe Keys

From your Stripe Dashboard:

1. Go to **Developers** → **API keys**
2. Copy your **Publishable key** (starts with `pk_`)
3. Copy your **Secret key** (starts with `sk_`)

### 2. Create Subscription Products

In your Stripe Dashboard:

1. Go to **Products** → **Add product**
2. Create these products:

#### Premium Subscription
- **Name**: MoPets Premium
- **Pricing**: 
  - Monthly: $9.99/month
  - Yearly: $95.90/year (20% discount)
- **Billing**: Recurring

#### Breeder Pro Subscription  
- **Name**: MoPets Breeder Pro
- **Pricing**:
  - Monthly: $19.99/month  
  - Yearly: $191.90/year (20% discount)
- **Billing**: Recurring

### 3. Get Price IDs

After creating products, copy the **Price IDs** (start with `price_`):
- Premium Monthly: `price_xxx`
- Premium Yearly: `price_xxx`
- Breeder Monthly: `price_xxx`
- Breeder Yearly: `price_xxx`

### 4. Set Up Webhooks

1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. **Endpoint URL**: `https://yourdomain.com/api/stripe/webhooks`
4. **Events to send**:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `payment_intent.succeeded`

5. Copy the **Webhook secret** (starts with `whsec_`)

### 5. Configure Environment Variables

Update your `.env` file:

```env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_key_here"
STRIPE_SECRET_KEY="sk_test_your_key_here"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"

# Stripe Price IDs
STRIPE_PREMIUM_PRICE_ID="price_your_premium_monthly_id"
STRIPE_PREMIUM_YEARLY_PRICE_ID="price_your_premium_yearly_id"
STRIPE_BREEDER_PRICE_ID="price_your_breeder_monthly_id"
STRIPE_BREEDER_YEARLY_PRICE_ID="price_your_breeder_yearly_id"
```

## 🎯 Features Implemented

### ✅ Subscription Management
- **Three tiers**: Free, Premium ($9.99), Breeder Pro ($19.99)
- **Annual discounts**: 20% off yearly plans
- **Automatic upgrades/downgrades**
- **Proration handling**
- **Trial periods** (configurable)

### ✅ Marketplace Payments
- **One-time payments** for pet supplies
- **Puppy reservations** with deposits
- **Seller payouts** (can be added)
- **Refund handling**

### ✅ Customer Portal
- **Self-service billing**
- **Cancel/resume subscriptions**
- **Update payment methods**
- **Download invoices**

### ✅ Webhook Processing
- **Real-time updates** for subscription changes
- **Automatic tier updates** in database
- **Failed payment handling**
- **Cancellation processing**

## 🔧 How It Works

### Subscription Flow

1. **User selects plan** → Premium or Breeder Pro
2. **Stripe Checkout** → Secure payment form
3. **Webhook processes** → Updates user tier in database
4. **Success page** → Confirms subscription
5. **Features unlocked** → Based on subscription tier

### Marketplace Flow

1. **User clicks "Buy Now"** → On marketplace item
2. **Stripe Checkout** → One-time payment
3. **Webhook processes** → Confirms payment
4. **Order fulfilled** → Seller notified

### Customer Portal

```typescript
// Access customer portal
const handleManageSubscription = async () => {
  const response = await fetch('/api/stripe/customer-portal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      returnUrl: window.location.href 
    })
  })
  
  const { url } = await response.json()
  window.location.href = url
}
```

## 🎨 UI Components

### Subscription Tiers Component
- **Beautiful pricing cards**
- **Feature comparisons**
- **Monthly/yearly toggle**
- **Popular plan highlighting**

### Marketplace Integration
- **Buy now buttons**
- **Secure checkout**
- **Purchase confirmations**
- **Order tracking**

## 🔐 Security Features

### ✅ Webhook Verification
- **Signature validation** prevents fake webhooks
- **Idempotency** prevents duplicate processing
- **Error handling** with retries

### ✅ Customer Protection
- **SCA compliance** (Strong Customer Authentication)
- **Fraud prevention** built-in
- **Dispute handling** through Stripe

### ✅ Data Security
- **No card data** stored on your servers
- **PCI compliance** handled by Stripe
- **Encrypted communications**

## 📊 Analytics & Reporting

### Revenue Tracking
```typescript
// Get subscription revenue
const getMonthlyRevenue = async () => {
  const subscriptions = await prisma.subscription.findMany({
    where: {
      status: 'active',
      currentPeriodStart: {
        gte: startOfMonth(new Date())
      }
    },
    include: { user: true }
  })
  
  // Calculate MRR (Monthly Recurring Revenue)
  const mrr = subscriptions.reduce((total, sub) => {
    const amount = sub.tier === 'PREMIUM' ? 9.99 : 19.99
    return total + amount
  }, 0)
  
  return mrr
}
```

### Key Metrics
- **MRR** (Monthly Recurring Revenue)
- **Churn rate**
- **Customer lifetime value**
- **Conversion rates**

## 🚀 Testing

### Test Mode
Use Stripe's test mode for development:

1. **Test cards**:
   - Success: `4242 4242 4242 4242`
   - Declined: `4000 0000 0000 0002`
   - 3D Secure: `4000 0025 0000 3155`

2. **Test webhooks** locally:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhooks
   ```

3. **Test subscriptions**:
   - Create test subscriptions
   - Test cancellations
   - Test failed payments

## 🌟 Advanced Features

### Proration Handling
```typescript
// Upgrade subscription with proration
const upgradeSubscription = async (subscriptionId: string, newPriceId: string) => {
  await stripe.subscriptions.update(subscriptionId, {
    items: [{
      id: subscription.items.data[0].id,
      price: newPriceId,
    }],
    proration_behavior: 'create_prorations',
  })
}
```

### Usage-Based Billing
For future features like marketplace transaction fees:

```typescript
// Report usage for metered billing
const reportUsage = async (subscriptionItemId: string, quantity: number) => {
  await stripe.subscriptionItems.createUsageRecord(subscriptionItemId, {
    quantity,
    timestamp: Math.floor(Date.now() / 1000),
  })
}
```

### Multi-Party Payments
For marketplace seller payouts:

```typescript
// Create connected account for seller
const createSellerAccount = async (sellerInfo: any) => {
  const account = await stripe.accounts.create({
    type: 'express',
    country: 'US',
    email: sellerInfo.email,
  })
  
  return account
}
```

## 🎯 MoPets-Specific Implementation

### Breeder Features
- **Premium listings** for Breeder Pro subscribers
- **Featured placement** in search results
- **Advanced analytics** for breeding business
- **Priority support**

### Community Features
- **Ad-free experience** for Premium users
- **Unlimited messaging** 
- **Exclusive content** access
- **Premium breed information**

### Marketplace Integration
- **Secure pet purchases**
- **Puppy reservations** with deposits
- **Health guarantee** tracking
- **Breeder verification** payments

## 🆘 Troubleshooting

### Common Issues

1. **Webhook not receiving events**
   - Check endpoint URL
   - Verify webhook secret
   - Check firewall settings

2. **Payment fails**
   - Test with different cards
   - Check for 3D Secure requirements
   - Verify customer info

3. **Subscription not updating**
   - Check webhook processing
   - Verify database updates
   - Check for errors in logs

### Debug Mode
```typescript
// Enable debug mode in development
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
  telemetry: false, // Disable in production
})
```

## 🚀 Go Live Checklist

### Before Production
- [ ] Switch to live Stripe keys
- [ ] Update webhook endpoint to production URL
- [ ] Test all payment flows
- [ ] Verify tax calculations (if applicable)
- [ ] Set up monitoring and alerts
- [ ] Configure customer portal settings
- [ ] Test subscription management
- [ ] Verify refund processes

### Production Settings
```env
# Production Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

Your MoPets app now has complete Stripe integration! 🎉

## 📞 Support

- **Stripe Documentation**: [stripe.com/docs](https://stripe.com/docs)
- **Stripe Support**: Available 24/7 in dashboard
- **Integration Issues**: Check webhook logs and error messages