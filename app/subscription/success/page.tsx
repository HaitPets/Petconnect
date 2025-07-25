'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, Crown, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function SubscriptionSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [isLoading, setIsLoading] = useState(true)
  const [subscriptionInfo, setSubscriptionInfo] = useState<any>(null)

  useEffect(() => {
    if (sessionId) {
      // Verify the session and get subscription details
      fetch(`/api/stripe/verify-session?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          setSubscriptionInfo(data)
          setIsLoading(false)
        })
        .catch(err => {
          console.error('Error verifying session:', err)
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [sessionId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-luxury flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-primary-600">Confirming your subscription...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-luxury flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="card p-8 text-center">
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="relative mb-6"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="w-8 h-8 text-gold-500" />
            </motion.div>
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-3xl font-bold text-primary-800 mb-2">
              Welcome to MoPets Premium! 🎉
            </h1>
            <p className="text-primary-600 mb-6">
              Your subscription has been activated successfully. You now have access to all premium features.
            </p>
          </motion.div>

          {/* Subscription Details */}
          {subscriptionInfo && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-primary-50 rounded-xl p-4 mb-6"
            >
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Crown className="w-5 h-5 text-gold-500" />
                <span className="font-semibold text-primary-800">
                  {subscriptionInfo.tier} Plan
                </span>
              </div>
              <p className="text-sm text-primary-600">
                Next billing: {new Date(subscriptionInfo.nextBilling).toLocaleDateString()}
              </p>
            </motion.div>
          )}

          {/* Premium Features Highlight */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-left mb-6"
          >
            <h3 className="font-semibold text-primary-800 mb-3">You now have access to:</h3>
            <ul className="space-y-2 text-sm text-primary-600">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Ad-free experience</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Unlimited messaging</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Premium content access</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Priority support</span>
              </li>
            </ul>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="space-y-3"
          >
            <Link href="/community" className="btn-primary w-full text-center block">
              Explore Community
              <ArrowRight className="w-5 h-5 ml-2 inline" />
            </Link>
            
            <Link href="/profile" className="btn-outline w-full text-center block">
              Manage Subscription
            </Link>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-6 pt-6 border-t border-primary-200"
          >
            <p className="text-xs text-primary-500">
              Questions? Contact our support team anytime.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}