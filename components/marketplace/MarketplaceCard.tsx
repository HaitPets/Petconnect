'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  Heart, 
  Star, 
  MapPin, 
  Crown,
  Shield,
  DollarSign,
  Eye
} from 'lucide-react'

interface MarketplaceCardProps {
  listing: {
    id: string
    type: string
    title: string
    description: string
    price: number
    images: string[]
    category: string
    breed?: string
    seller: {
      id: string
      username: string
      profilePicture: string
      role: string
      rating: number
      verified: boolean
    }
    location: string
    isFeatured: boolean
    isAvailable: boolean
    createdAt: string
  }
  onLike: (listingId: string) => void
  onPurchase: (listingId: string) => void
}

const breedColors = {
  FRENCH_BULLDOG: 'bg-accent-frenchie text-primary-900',
  CANE_CORSO: 'bg-accent-corso text-white',
  ENGLISH_BULLDOG: 'bg-accent-luxury text-primary-900',
  OTHER: 'bg-primary-200 text-primary-800'
}

export function MarketplaceCard({ listing, onLike, onPurchase }: MarketplaceCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleLike = () => {
    setIsLiked(!isLiked)
    onLike(listing.id)
  }

  const breedColorClass = listing.breed 
    ? breedColors[listing.breed as keyof typeof breedColors] || breedColors.OTHER
    : ''

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="card overflow-hidden"
    >
      {/* Featured Badge */}
      {listing.isFeatured && (
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-gradient-to-r from-gold-400 to-gold-600 px-3 py-1 rounded-full flex items-center space-x-1">
            <Crown className="w-3 h-3 text-white" />
            <span className="text-white text-xs font-semibold">Featured</span>
          </div>
        </div>
      )}

      {/* Image Carousel */}
      <div className="relative aspect-square">
        {listing.images.length > 0 ? (
          <>
            <Image
              src={listing.images[currentImageIndex]}
              alt={listing.title}
              fill
              className="object-cover"
            />
            
            {/* Image Navigation */}
            {listing.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {listing.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-primary-100 flex items-center justify-center">
            <Eye className="w-12 h-12 text-primary-400" />
          </div>
        )}

        {/* Like Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLike}
          className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-soft"
        >
          <Heart 
            className={`w-5 h-5 transition-colors ${
              isLiked ? 'text-red-500 fill-current' : 'text-primary-600'
            }`} 
          />
        </motion.button>
      </div>

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-bold text-primary-800 text-lg leading-tight">
                {listing.title}
              </h3>
              {listing.breed && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${breedColorClass}`}>
                  {listing.breed.replace('_', ' ')}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-primary-600">
              <MapPin className="w-4 h-4" />
              <span>{listing.location}</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-primary-800">
              ${listing.price.toLocaleString()}
            </div>
            {listing.type === 'PUPPY' && (
              <div className="text-sm text-primary-600">per puppy</div>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-primary-700 text-sm leading-relaxed mb-4 line-clamp-2">
          {listing.description}
        </p>

        {/* Seller Info */}
        <div className="flex items-center justify-between mb-4 p-3 bg-primary-50 rounded-xl">
          <div className="flex items-center space-x-3">
            <Image
              src={listing.seller.profilePicture}
              alt={listing.seller.username}
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
            
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-semibold text-primary-800 text-sm">
                  {listing.seller.username}
                </span>
                {listing.seller.verified && (
                  <Shield className="w-3 h-3 text-blue-500" />
                )}
                {listing.seller.role === 'BREEDER' && (
                  <Crown className="w-3 h-3 text-gold-500" />
                )}
              </div>
              
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-gold-400 fill-current" />
                <span className="text-xs text-primary-600">
                  {listing.seller.rating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="text-xs text-primary-500">
            {listing.seller.role.replace('_', ' ')}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-outline flex-1 text-sm py-2"
          >
            Message Seller
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPurchase(listing.id)}
            className="btn-primary flex-1 text-sm py-2"
          >
            {listing.type === 'PUPPY' ? 'Reserve Now' : 'Buy Now'}
          </motion.button>
        </div>

        {/* Availability Status */}
        <div className="mt-3 text-center">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            listing.isAvailable 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {listing.isAvailable ? '✓ Available' : '✗ Sold Out'}
          </span>
        </div>
      </div>
    </motion.div>
  )
}