import { loadStripe, Stripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return stripePromise
}

// Helper function to format price for display
export const formatPrice = (amount: number, currency: string = 'usd'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
  }).format(amount)
}

// Helper function to redirect to Stripe Checkout
export const redirectToCheckout = async (sessionId: string) => {
  const stripe = await getStripe()
  if (!stripe) throw new Error('Stripe failed to load')

  const { error } = await stripe.redirectToCheckout({ sessionId })
  if (error) throw error
}

// Helper function to create subscription checkout
export const createSubscriptionCheckout = async (
  priceId: string,
  userId: string,
  successUrl?: string,
  cancelUrl?: string
) => {
  const response = await fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      priceId,
      userId,
      mode: 'subscription',
      successUrl: successUrl || `${window.location.origin}/subscription/success`,
      cancelUrl: cancelUrl || `${window.location.origin}/subscription/cancel`,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to create checkout session')
  }

  const { sessionId } = await response.json()
  return sessionId
}

// Helper function to create one-time payment checkout (for marketplace)
export const createPaymentCheckout = async (
  amount: number,
  description: string,
  metadata?: Record<string, string>,
  successUrl?: string,
  cancelUrl?: string
) => {
  const response = await fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount,
      description,
      metadata,
      mode: 'payment',
      successUrl: successUrl || `${window.location.origin}/marketplace/success`,
      cancelUrl: cancelUrl || `${window.location.origin}/marketplace/cancel`,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to create checkout session')
  }

  const { sessionId } = await response.json()
  return sessionId
}