'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Heart, ArrowRight } from 'lucide-react'

const breeds = [
  {
    id: 'french-bulldog',
    name: 'French Bulldog',
    description: 'Charming, adaptable companions with distinctive bat ears and playful personalities.',
    image: '/images/french-bulldog-showcase.jpg',
    characteristics: ['Playful', 'Adaptable', 'Charming'],
    priceRange: '$2,000 - $8,000',
    accent: 'accent-frenchie',
    gradient: 'from-accent-frenchie to-primary-200'
  },
  {
    id: 'cane-corso',
    name: 'Cane Corso',
    description: 'Majestic Italian guardians known for their loyalty, intelligence, and noble presence.',
    image: '/images/cane-corso-showcase.jpg',
    characteristics: ['Loyal', 'Intelligent', 'Protective'],
    priceRange: '$1,500 - $4,000',
    accent: 'accent-corso',
    gradient: 'from-accent-corso to-primary-300'
  },
  {
    id: 'english-bulldog',
    name: 'English Bulldog',
    description: 'Gentle, courageous companions with distinctive wrinkled faces and calm demeanor.',
    image: '/images/english-bulldog-showcase.jpg',
    characteristics: ['Gentle', 'Courageous', 'Calm'],
    priceRange: '$2,500 - $6,000',
    accent: 'accent-luxury',
    gradient: 'from-accent-luxury to-gold-200'
  }
]

export function BreedShowcase() {
  const [selectedBreed, setSelectedBreed] = useState(breeds[0])
  const [hoveredBreed, setHoveredBreed] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      {/* Breed Selection */}
      <div className="space-y-4">
        {breeds.map((breed) => (
          <motion.div
            key={breed.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setHoveredBreed(breed.id)}
            onHoverEnd={() => setHoveredBreed(null)}
            onClick={() => setSelectedBreed(breed)}
            className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 ${
              selectedBreed.id === breed.id
                ? 'border-primary-800 bg-white shadow-luxury'
                : 'border-primary-200 bg-white/50 hover:border-primary-400 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className={`text-xl font-bold mb-2 transition-colors ${
                  selectedBreed.id === breed.id ? 'text-primary-800' : 'text-primary-700'
                }`}>
                  {breed.name}
                </h3>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {breed.characteristics.map((trait) => (
                    <span
                      key={trait}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedBreed.id === breed.id
                          ? 'bg-primary-800 text-white'
                          : 'bg-primary-100 text-primary-700'
                      }`}
                    >
                      {trait}
                    </span>
                  ))}
                </div>
                
                <p className="text-primary-600 text-sm mb-3">
                  {breed.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gold-600">
                    {breed.priceRange}
                  </span>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-gold-400 fill-current"
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {selectedBreed.id === breed.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-4"
                >
                  <ArrowRight className="w-6 h-6 text-primary-800" />
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Selected Breed Display */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedBreed.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {/* Main Image */}
            <div className="relative h-96 rounded-3xl overflow-hidden shadow-luxury-lg">
              <Image
                src={selectedBreed.image}
                alt={selectedBreed.name}
                fill
                className="object-cover"
              />
              
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${selectedBreed.gradient} opacity-20`} />
              
              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="w-5 h-5 text-gold-400 fill-current" />
                  <span className="text-gold-400 font-semibold">Premium Breed</span>
                </div>
                
                <h3 className="text-2xl font-bold mb-2">
                  {selectedBreed.name}
                </h3>
                
                <p className="text-lg opacity-90 mb-4">
                  {selectedBreed.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-gold-400">
                    {selectedBreed.priceRange}
                  </span>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl hover:bg-white/30 transition-colors"
                  >
                    <Heart className="w-5 h-5" />
                    <span>Save</span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 btn-primary"
              >
                View Breeders
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 btn-outline"
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}