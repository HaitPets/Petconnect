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

    const { returnUrl } = await request.json()

    // Get user with Stripe customer ID
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user?.stripeCustomerId) {
      return NextResponse.json({ error: 'No Stripe customer found' }, { status: 404 })
    }

    // Create customer portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: returnUrl || `${process.env.NEXTAUTH_URL}/profile`,
    })

    return NextResponse.json({ 
      url: portalSession.url 
    })

  } catch (error) {
    console.error('Customer portal error:', error)
    return NextResponse.json(
      { error: 'Failed to create customer portal session' },
      { status: 500 }
    )
  }
}