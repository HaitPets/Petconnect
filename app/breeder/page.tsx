'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Crown,
  Plus,
  BarChart3,
  Calendar,
  Heart,
  Star,
  TrendingUp,
  DollarSign,
  Users,
  Package,
  AlertCircle
} from 'lucide-react'
import { MobileNav } from '@/components/navigation/MobileNav'
import { LitterCard } from '@/components/breeder/LitterCard'
import { StatsCard } from '@/components/breeder/StatsCard'
import { QuickActions } from '@/components/breeder/QuickActions'
import { RecentActivity } from '@/components/breeder/RecentActivity'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

const mockLitters = [
  {
    id: '1',
    breed: 'FRENCH_BULLDOG',
    puppyCount: 4,
    birthDate: '2024-01-01',
    expectedReady: '2024-03-01',
    images: ['/images/litters/frenchie-litter1.jpg'],
    isActive: true,
    puppies: [
      { id: '1', name: 'Luna', gender: 'Female', color: 'Fawn', weight: 2.1, isAvailable: true },
      { id: '2', name: 'Max', gender: 'Male', color: 'Brindle', weight: 2.3, isAvailable: true },
      { id: '3', name: 'Bella', gender: 'Female', color: 'Cream', weight: 2.0, isAvailable: false },
      { id: '4', name: 'Duke', gender: 'Male', color: 'Fawn', weight: 2.4, isAvailable: true }
    ]
  },
  {
    id: '2',
    breed: 'CANE_CORSO',
    puppyCount: 6,
    birthDate: '2023-12-15',
    expectedReady: '2024-02-15',
    images: ['/images/litters/corso-litter1.jpg'],
    isActive: true,
    puppies: [
      { id: '5', name: 'Titan', gender: 'Male', color: 'Black', weight: 3.2, isAvailable: true },
      { id: '6', name: 'Athena', gender: 'Female', color: 'Blue', weight: 2.9, isAvailable: true },
      { id: '7', name: 'Zeus', gender: 'Male', color: 'Formentino', weight: 3.4, isAvailable: false },
      { id: '8', name: 'Hera', gender: 'Female', color: 'Black', weight: 3.0, isAvailable: true },
      { id: '9', name: 'Apollo', gender: 'Male', color: 'Blue', weight: 3.3, isAvailable: true },
      { id: '10', name: 'Artemis', gender: 'Female', color: 'Formentino', weight: 2.8, isAvailable: true }
    ]
  }
]

const dashboardStats = [
  { 
    title: 'Active Litters', 
    value: '2', 
    change: '+1 this month',
    trend: 'up',
    icon: Heart,
    color: 'primary'
  },
  { 
    title: 'Available Puppies', 
    value: '8', 
    change: '3 reserved',
    trend: 'neutral',
    icon: Star,
    color: 'gold'
  },
  { 
    title: 'Monthly Revenue', 
    value: '$12,400', 
    change: '+23% vs last month',
    trend: 'up',
    icon: DollarSign,
    color: 'luxury'
  },
  { 
    title: 'Inquiries', 
    value: '47', 
    change: '+12 this week',
    trend: 'up',
    icon: Users,
    color: 'primary'
  }
]

export default function BreederDashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const [litters, setLitters] = useState(mockLitters)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  // Redirect if not a breeder
  useEffect(() => {
    if (session?.user && session.user.role !== 'BREEDER') {
      router.push('/community')
    }
  }, [session, router])

  if (!session || session.user.role !== 'BREEDER') {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-16 h-16 text-primary-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-primary-800 mb-2">Breeder Access Required</h2>
          <p className="text-primary-600 mb-6">
            This area is exclusively for professional breeders.
          </p>
          <button
            onClick={() => router.push('/community')}
            className="btn-primary"
          >
            Return to Community
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-50 pb-20">
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="safe-top bg-gradient-to-r from-gold-400 to-gold-600 text-white"
      >
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Crown className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Breeder Dashboard</h1>
                <p className="text-gold-100">Professional breeding tools</p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/20 p-3 rounded-xl backdrop-blur-sm"
            >
              <Plus className="w-6 h-6 text-white" />
            </motion.button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gold-100 text-sm">Total Puppies</p>
                  <p className="text-2xl font-bold">10</p>
                </div>
                <Heart className="w-8 h-8 text-white/60" />
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gold-100 text-sm">This Month</p>
                  <p className="text-2xl font-bold">$12.4K</p>
                </div>
                <TrendingUp className="w-8 h-8 text-white/60" />
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Tab Navigation */}
      <div className="px-4 py-4 bg-white border-b border-primary-100">
        <div className="flex space-x-1 bg-primary-50 rounded-xl p-1">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'litters', label: 'Litters' },
            { id: 'analytics', label: 'Analytics' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-primary-800 shadow-soft'
                  : 'text-primary-600 hover:text-primary-800'
              }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dashboardStats.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <StatsCard {...stat} />
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions */}
              <QuickActions />

              {/* Recent Activity */}
              <RecentActivity />
            </motion.div>
          )}

          {activeTab === 'litters' && (
            <motion.div
              key="litters"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-primary-800">Active Litters</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>New Litter</span>
                </motion.button>
              </div>

              {litters.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-primary-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-primary-800 mb-2">No Active Litters</h3>
                  <p className="text-primary-600 mb-6">
                    Start by adding your first litter to track puppies and manage breeding records.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary"
                  >
                    Add First Litter
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-4">
                  {litters.map((litter, index) => (
                    <motion.div
                      key={litter.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <LitterCard litter={litter} />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-primary-800">Analytics & Insights</h2>
              
              <div className="card p-6 text-center">
                <BarChart3 className="w-16 h-16 text-primary-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-primary-800 mb-2">Advanced Analytics</h3>
                <p className="text-primary-600 mb-6">
                  Get detailed insights into your breeding business performance, puppy health trends, and customer analytics.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary"
                >
                  Coming Soon
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  )
}