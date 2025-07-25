'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search,
  Filter,
  Heart,
  Star,
  MapPin,
  ShoppingBag,
  Crown,
  Sparkles,
  DollarSign,
  Package
} from 'lucide-react'
import { MobileNav } from '@/components/navigation/MobileNav'
import { MarketplaceCard } from '@/components/marketplace/MarketplaceCard'
import { CategoryFilter } from '@/components/marketplace/CategoryFilter'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

const mockListings = [
  {
    id: '1',
    type: 'PUPPY',
    title: 'French Bulldog Puppies - Champion Bloodline',
    description: 'Beautiful French Bulldog puppies from champion bloodlines. Health tested parents, excellent temperament.',
    price: 3500,
    images: ['/images/marketplace/frenchie-puppy1.jpg', '/images/marketplace/frenchie-puppy2.jpg'],
    category: 'PUPPIES',
    breed: 'FRENCH_BULLDOG',
    seller: {
      id: '1',
      username: 'elite_frenchies',
      profilePicture: '/images/users/breeder1.jpg',
      role: 'BREEDER',
      rating: 4.9,
      verified: true
    },
    location: 'Los Angeles, CA',
    isFeatured: true,
    isAvailable: true,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    type: 'SUPPLY',
    title: 'Premium Dog Harness - Luxury Leather',
    description: 'Hand-crafted leather harness perfect for French Bulldogs and similar breeds. Adjustable and comfortable.',
    price: 89,
    images: ['/images/marketplace/harness1.jpg'],
    category: 'ACCESSORIES',
    seller: {
      id: '2',
      username: 'luxury_pet_gear',
      profilePicture: '/images/users/seller1.jpg',
      role: 'PET_OWNER',
      rating: 4.7,
      verified: false
    },
    location: 'New York, NY',
    isFeatured: false,
    isAvailable: true,
    createdAt: '2024-01-14T15:45:00Z'
  },
  {
    id: '3',
    type: 'PUPPY',
    title: 'Cane Corso Puppies - Guardian Bloodline',
    description: 'Exceptional Cane Corso puppies from working bloodlines. Perfect for protection and companionship.',
    price: 2200,
    images: ['/images/marketplace/corso-puppy1.jpg', '/images/marketplace/corso-puppy2.jpg'],
    category: 'PUPPIES',
    breed: 'CANE_CORSO',
    seller: {
      id: '3',
      username: 'guardian_corsos',
      profilePicture: '/images/users/breeder2.jpg',
      role: 'BREEDER',
      rating: 4.8,
      verified: true
    },
    location: 'Miami, FL',
    isFeatured: true,
    isAvailable: true,
    createdAt: '2024-01-13T09:20:00Z'
  },
  {
    id: '4',
    type: 'SUPPLY',
    title: 'Premium Dog Food - French Bulldog Formula',
    description: 'Specially formulated nutrition for French Bulldogs. High-quality ingredients for optimal health.',
    price: 65,
    images: ['/images/marketplace/dog-food1.jpg'],
    category: 'FOOD',
    seller: {
      id: '4',
      username: 'healthy_paws_nutrition',
      profilePicture: '/images/users/seller2.jpg',
      role: 'PET_LOVER',
      rating: 4.6,
      verified: true
    },
    location: 'Chicago, IL',
    isFeatured: false,
    isAvailable: true,
    createdAt: '2024-01-12T14:30:00Z'
  }
]

const marketplaceStats = [
  { label: 'Active Listings', value: '1,247', icon: Package, color: 'primary' },
  { label: 'Verified Sellers', value: '89', icon: Crown, color: 'gold' },
  { label: 'Happy Buyers', value: '3,456', icon: Star, color: 'luxury' }
]

export default function MarketplacePage() {
  const { data: session } = useSession()
  const [listings, setListings] = useState(mockListings)
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const filteredListings = listings.filter(listing => {
    const matchesCategory = selectedCategory === 'ALL' || listing.category === selectedCategory
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      default:
        return 0
    }
  })

  const handleLike = async (listingId: string) => {
    // Handle like functionality
    console.log('Like listing:', listingId)
  }

  const handlePurchase = async (listingId: string) => {
    try {
      const listing = listings.find(l => l.id === listingId)
      if (!listing) return

      const { createPaymentCheckout, redirectToCheckout } = await import('@/lib/stripe-client')
      
      const sessionId = await createPaymentCheckout(
        listing.price,
        listing.title,
        {
          listingId: listing.id,
          sellerId: listing.seller.id,
          type: listing.type,
          category: listing.category
        }
      )
      
      await redirectToCheckout(sessionId)
    } catch (error) {
      console.error('Purchase error:', error)
      // Handle error (show toast, etc.)
    }
  }

  return (
    <div className="min-h-screen bg-primary-50 pb-20">
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="safe-top bg-white/95 backdrop-blur-glass sticky top-0 z-40 border-b border-primary-100"
      >
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-8 h-8 text-primary-800" />
              <h1 className="text-2xl font-bold text-gradient-primary">Marketplace</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="p-3 bg-primary-100 rounded-xl"
              >
                <Filter className="w-5 h-5 text-primary-800" />
              </motion.button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-400" />
            <input
              type="text"
              placeholder="Search pets, supplies, and more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-primary-50 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Marketplace Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {marketplaceStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className={`w-10 h-10 mx-auto mb-2 rounded-xl flex items-center justify-center ${
                    stat.color === 'primary' ? 'bg-primary-800 text-white' :
                    stat.color === 'gold' ? 'bg-gradient-to-r from-gold-400 to-gold-600 text-white' :
                    'bg-gradient-to-r from-accent-luxury to-gold-500 text-white'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-lg font-bold text-primary-800">{stat.value}</p>
                  <p className="text-xs text-primary-600">{stat.label}</p>
                </motion.div>
              )
            })}
          </div>

          {/* Category Filter */}
          <CategoryFilter 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {/* Sort & Filter Bar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 border-t border-primary-200 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-primary-700 mb-1">
                        Sort by
                      </label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-2 border border-primary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="newest">Newest First</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Listings Grid */}
      <div className="px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : sortedListings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <ShoppingBag className="w-16 h-16 text-primary-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-primary-800 mb-2">No listings found</h3>
            <p className="text-primary-600 mb-6">
              {searchQuery || selectedCategory !== 'ALL' 
                ? 'Try adjusting your filters or search terms'
                : 'Be the first to list something in the marketplace!'
              }
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {sortedListings.map((listing, index) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <MarketplaceCard 
                    listing={listing}
                    onLike={handleLike}
                    onPurchase={handlePurchase}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Load More */}
        {sortedListings.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-outline"
              onClick={() => console.log('Load more listings')}
            >
              Load More Listings
            </motion.button>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  )
}