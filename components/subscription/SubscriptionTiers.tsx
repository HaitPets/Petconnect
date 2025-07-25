'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Check, 
  Crown, 
  Star, 
  Sparkles, 
  Users,
  MessageCircle,
  Shield,
  Zap
} from 'lucide-react'

const tiers = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Perfect for pet lovers getting started',
    features: [
      'Basic community access',
      'View public posts',
      'Follow other users',
      'Basic messaging',
      'Standard support'
    ],
    icon: Users,
    color: 'primary',
    gradient: 'from-primary-500 to-primary-700',
    popular: false
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    period: 'month',
    description: 'Enhanced experience for serious pet enthusiasts',
    features: [
      'Ad-free experience',
      'Unlimited messaging',
      'Premium content access',
      'Advanced search filters',
      'Priority support',
      'Exclusive community groups',
      'Monthly breed spotlights'
    ],
    icon: Star,
    color: 'gold',
    gradient: 'from-gold-400 to-gold-600',
    popular: true
  },
  {
    id: 'breeder',
    name: 'Breeder Pro',
    price: 19.99,
    period: 'month',
    description: 'Professional tools for serious breeders',
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
    ],
    icon: Crown,
    color: 'luxury',
    gradient: 'from-accent-luxury to-gold-500',
    popular: false
  }
]

export function SubscriptionTiers() {
  const [selectedTier, setSelectedTier] = useState('premium')
  const [isAnnual, setIsAnnual] = useState(false)

  const handleSubscribe = async (tierId: string) => {
    if (tierId === 'free') {
      // Handle free signup
      window.location.href = '/auth/register'
      return
    }

    try {
      const { createSubscriptionCheckout, redirectToCheckout } = await import('@/lib/stripe-client')
      const { getStripePrice } = await import('@/lib/stripe')
      
      const priceId = getStripePrice(tierId.toUpperCase() as 'PREMIUM' | 'BREEDER', isAnnual)
      const sessionId = await createSubscriptionCheckout(priceId, 'current-user-id')
      
      await redirectToCheckout(sessionId)
    } catch (error) {
      console.error('Subscription error:', error)
      // Handle error (show toast, etc.)
    }
  }

  return (
    <div className="space-y-8">
      {/* Annual/Monthly Toggle */}
      <div className="flex items-center justify-center">
        <div className="bg-white rounded-2xl p-2 shadow-soft">
          <div className="flex items-center space-x-4">
            <span className={`px-4 py-2 font-medium transition-colors ${
              !isAnnual ? 'text-primary-800' : 'text-primary-500'
            }`}>
              Monthly
            </span>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                isAnnual ? 'bg-gold-500' : 'bg-primary-200'
              }`}
            >
              <motion.div
                animate={{ x: isAnnual ? 24 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm"
              />
            </motion.button>
            
            <div className="flex items-center space-x-2">
              <span className={`px-4 py-2 font-medium transition-colors ${
                isAnnual ? 'text-primary-800' : 'text-primary-500'
              }`}>
                Annual
              </span>
              <span className="bg-gold-100 text-gold-800 text-xs font-bold px-2 py-1 rounded-full">
                Save 20%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier, index) => {
          const Icon = tier.icon
          const price = tier.price === 0 ? 0 : isAnnual ? tier.price * 12 * 0.8 : tier.price
          const period = tier.price === 0 ? tier.period : isAnnual ? 'year' : tier.period

          return (
            <motion.div
              key={tier.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`relative p-8 rounded-3xl border-2 transition-all duration-300 ${
                tier.popular
                  ? 'border-gold-400 bg-white shadow-luxury-lg'
                  : selectedTier === tier.id
                  ? 'border-primary-400 bg-white shadow-luxury'
                  : 'border-primary-200 bg-white shadow-soft hover:border-primary-300'
              }`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-gold-400 to-gold-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-luxury">
                    <Sparkles className="w-4 h-4 inline mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="text-center mb-8">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${tier.gradient} flex items-center justify-center shadow-luxury`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-primary-800 mb-2">
                  {tier.name}
                </h3>
                
                <p className="text-primary-600 mb-6">
                  {tier.description}
                </p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-primary-800">
                      ${price}
                    </span>
                    {tier.price > 0 && (
                      <span className="text-primary-500 ml-2">
                        /{period}
                      </span>
                    )}
                  </div>
                  
                  {isAnnual && tier.price > 0 && (
                    <div className="text-sm text-gold-600 font-medium mt-1">
                      ${(tier.price * 12).toFixed(2)} billed annually
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {tier.features.map((feature, featureIndex) => (
                  <motion.div
                    key={feature}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: (index * 0.1) + (featureIndex * 0.05) }}
                    className="flex items-center space-x-3"
                  >
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${tier.gradient} flex items-center justify-center flex-shrink-0`}>
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-primary-700 text-sm">
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSubscribe(tier.id)}
                className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
                  tier.popular
                    ? 'bg-gradient-to-r from-gold-400 to-gold-600 text-white shadow-luxury hover:shadow-luxury-lg'
                    : tier.price === 0
                    ? 'bg-primary-100 text-primary-800 hover:bg-primary-200'
                    : 'bg-primary-800 text-white hover:bg-primary-900 shadow-soft'
                }`}
              >
                {tier.price === 0 ? 'Get Started Free' : `Choose ${tier.name}`}
              </motion.button>

              {/* Additional Info */}
              {tier.price > 0 && (
                <div className="text-center mt-4">
                  <p className="text-xs text-primary-500">
                    Cancel anytime • 14-day free trial
                  </p>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Trust Indicators */}
      <div className="text-center pt-8 border-t border-primary-200">
        <div className="flex items-center justify-center space-x-8 text-primary-600">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span className="text-sm">Secure Payments</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span className="text-sm">Instant Access</span>
          </div>
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">24/7 Support</span>
          </div>
        </div>
      </div>
    </div>
  )
}