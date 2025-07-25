import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { stripe } from '@/lib/stripe'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      priceId, 
      amount, 
      description, 
      metadata = {}, 
      mode = 'subscription',
      successUrl,
      cancelUrl 
    } = body

    // Get or create Stripe customer
    let customer
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.stripeCustomerId) {
      // Retrieve existing customer
      customer = await stripe.customers.retrieve(user.stripeCustomerId)
    } else {
      // Create new customer
      customer = await stripe.customers.create({
        email: user.email,
        name: user.username,
        metadata: {
          userId: user.id,
          role: user.role,
        }
      })

      // Update user with Stripe customer ID
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customer.id }
      })
    }

    let sessionConfig: any = {
      customer: customer.id,
      mode,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: user.id,
        ...metadata
      }
    }

    if (mode === 'subscription') {
      // Subscription checkout
      if (!priceId) {
        return NextResponse.json({ error: 'Price ID required for subscription' }, { status: 400 })
      }

      sessionConfig = {
        ...sessionConfig,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          }
        ],
        subscription_data: {
          metadata: {
            userId: user.id,
            role: user.role,
          }
        }
      }
    } else {
      // One-time payment checkout
      if (!amount || !description) {
        return NextResponse.json({ error: 'Amount and description required for payment' }, { status: 400 })
      }

      sessionConfig = {
        ...sessionConfig,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: description,
                metadata
              },
              unit_amount: Math.round(amount * 100), // Convert to cents
            },
            quantity: 1,
          }
        ],
        payment_intent_data: {
          metadata: {
            userId: user.id,
            ...metadata
          }
        }
      }
    }

    const checkoutSession = await stripe.checkout.sessions.create(sessionConfig)

    return NextResponse.json({ 
      sessionId: checkoutSession.id,
      url: checkoutSession.url 
    })

  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}