import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
})

// Subscription Price IDs (replace with your actual Stripe price IDs)
export const SUBSCRIPTION_PRICES = {
  PREMIUM_MONTHLY: process.env.STRIPE_PREMIUM_PRICE_ID || 'price_premium_monthly',
  PREMIUM_YEARLY: process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID || 'price_premium_yearly',
  BREEDER_MONTHLY: process.env.STRIPE_BREEDER_PRICE_ID || 'price_breeder_monthly',
  BREEDER_YEARLY: process.env.STRIPE_BREEDER_YEARLY_PRICE_ID || 'price_breeder_yearly',
}

// Helper function to get price based on tier and billing cycle
export function getStripePrice(tier: 'PREMIUM' | 'BREEDER', isYearly: boolean = false): string {
  if (tier === 'PREMIUM') {
    return isYearly ? SUBSCRIPTION_PRICES.PREMIUM_YEARLY : SUBSCRIPTION_PRICES.PREMIUM_MONTHLY
  }
  return isYearly ? SUBSCRIPTION_PRICES.BREEDER_YEARLY : SUBSCRIPTION_PRICES.BREEDER_MONTHLY
}

// Subscription tier mapping
export const SUBSCRIPTION_TIERS = {
  FREE: {
    name: 'Free',
    price: 0,
    features: [
      'Basic community access',
      'View public posts',
      'Follow other users',
      'Basic messaging',
      'Standard support'
    ]
  },
  PREMIUM: {
    name: 'Premium',
    monthlyPrice: 9.99,
    yearlyPrice: 95.90, // 20% discount
    features: [
      'Ad-free experience',
      'Unlimited messaging',
      'Premium content access',
      'Advanced search filters',
      'Priority support',
      'Exclusive community groups',
      'Monthly breed spotlights'
    ]
  },
  BREEDER: {
    name: 'Breeder Pro',
    monthlyPrice: 19.99,
    yearlyPrice: 191.90, // 20% discount
    features: [
      'All Premium features',
      'Professional breeder profile',
      'Litter management tools',
      'Puppy tracking system',
      'Featured listings',
      'Advanced analytics',
      'Breeding calendar',
      'Health record management',
      'Priority marketplace placement'
    ]
  }
}