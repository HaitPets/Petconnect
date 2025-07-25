import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'

const prisma = new PrismaClient()

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  if (!userId) return

  if (session.mode === 'subscription') {
    // Handle subscription checkout completion
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
    await updateUserSubscription(userId, subscription)
  } else {
    // Handle one-time payment completion
    console.log('One-time payment completed for user:', userId)
    // Add any post-payment logic here (e.g., update order status)
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId
  if (!userId) return

  await updateUserSubscription(userId, subscription)
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId
  if (!userId) return

  await updateUserSubscription(userId, subscription)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId
  if (!userId) return

  // Downgrade user to free tier
  await prisma.user.update({
    where: { id: userId },
    data: { subscriptionTier: 'FREE' }
  })

  // Update subscription record
  await prisma.subscription.updateMany({
    where: { 
      userId,
      stripeSubscriptionId: subscription.id 
    },
    data: { 
      status: 'canceled',
      cancelAtPeriodEnd: true
    }
  })
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string
  if (!subscriptionId) return

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  const userId = subscription.metadata?.userId
  if (!userId) return

  // Update subscription status and period
  await updateUserSubscription(userId, subscription)
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string
  if (!subscriptionId) return

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  const userId = subscription.metadata?.userId
  if (!userId) return

  // Handle failed payment - could send notification, update status, etc.
  console.log('Payment failed for user:', userId)
  
  // Update subscription status
  await prisma.subscription.updateMany({
    where: { 
      userId,
      stripeSubscriptionId: subscription.id 
    },
    data: { status: 'past_due' }
  })
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const userId = paymentIntent.metadata?.userId
  if (!userId) return

  console.log('Payment succeeded for user:', userId, 'Amount:', paymentIntent.amount)
  // Handle successful one-time payment (marketplace purchases, etc.)
}

async function updateUserSubscription(userId: string, subscription: Stripe.Subscription) {
  const priceId = subscription.items.data[0]?.price.id
  
  // Determine subscription tier based on price ID
  let tier: 'FREE' | 'PREMIUM' | 'BREEDER' = 'FREE'
  
  if (priceId?.includes('premium')) {
    tier = 'PREMIUM'
  } else if (priceId?.includes('breeder')) {
    tier = 'BREEDER'
  }

  // Update user subscription tier
  await prisma.user.update({
    where: { id: userId },
    data: { 
      subscriptionTier: tier,
      stripeCustomerId: subscription.customer as string
    }
  })

  // Create or update subscription record
  await prisma.subscription.upsert({
    where: {
      stripeSubscriptionId: subscription.id
    },
    update: {
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      tier
    },
    create: {
      userId,
      tier,
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    }
  })
}