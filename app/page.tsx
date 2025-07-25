'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, 
  Users, 
  Crown, 
  Star, 
  ArrowRight, 
  PawPrint,
  Shield,
  Sparkles
} from 'lucide-react'
import { MobileNav } from '@/components/navigation/MobileNav'
import { LuxuryCarousel } from '@/components/ui/LuxuryCarousel'
import { BreedShowcase } from '@/components/ui/BreedShowcase'
import { FeatureCard } from '@/components/ui/FeatureCard'
import { SubscriptionTiers } from '@/components/subscription/SubscriptionTiers'

const luxuryPuppyImages = [
  {
    src: '/images/french-bulldog-luxury-1.jpg',
    alt: 'Premium French Bulldog Puppy',
    breed: 'French Bulldog',
    title: 'Premium French Bulldog',
    description: 'Exceptional bloodline with champion genetics'
  },
  {
    src: '/images/cane-corso-luxury-1.jpg',
    alt: 'Premium Cane Corso Puppy',
    breed: 'Cane Corso',
    title: 'Majestic Cane Corso',
    description: 'Noble guardian with impeccable temperament'
  },
  {
    src: '/images/english-bulldog-luxury-1.jpg',
    alt: 'Premium English Bulldog Puppy',
    breed: 'English Bulldog',
    title: 'Royal English Bulldog',
    description: 'Classic beauty with perfect conformation'
  }
]

const features = [
  {
    icon: Users,
    title: 'Premium Community',
    description: 'Connect with verified pet owners, lovers, and professional breeders',
    color: 'primary'
  },
  {
    icon: Crown,
    title: 'Breeder Tools',
    description: 'Professional litter management and puppy tracking systems',
    color: 'gold'
  },
  {
    icon: Shield,
    title: 'Verified Listings',
    description: 'All breeders and listings are verified for authenticity',
    color: 'primary'
  },
  {
    icon: Sparkles,
    title: 'Premium Breeds',
    description: 'Specializing in French Bulldogs, Cane Corsos, and more',
    color: 'gold'
  }
]

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % luxuryPuppyImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-luxury">
      {/* Hero Section with Luxury Puppy Collage */}
      <section className="relative h-screen flex flex-col">
        {/* Header */}
        <motion.header 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="safe-top relative z-20 p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PawPrint className="w-8 h-8 text-primary-800" />
              <h1 className="text-2xl font-bold text-gradient-primary">MoPets</h1>
            </div>
            <Link href="/auth/login" className="btn-outline text-sm px-4 py-2">
              Sign In
            </Link>
          </div>
        </motion.header>

        {/* Luxury Carousel */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <div className="relative h-full">
                <Image
                  src={luxuryPuppyImages[currentSlide].src}
                  alt={luxuryPuppyImages[currentSlide].alt}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="w-5 h-5 text-gold-400 fill-current" />
                      <span className="text-gold-400 font-semibold">Premium Breed</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-2">
                      {luxuryPuppyImages[currentSlide].title}
                    </h2>
                    <p className="text-lg opacity-90">
                      {luxuryPuppyImages[currentSlide].description}
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slide Indicators */}
          <div className="absolute bottom-24 left-6 flex space-x-2">
            {luxuryPuppyImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-gold-400 scale-125' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="relative z-10 p-6 bg-white/95 backdrop-blur-glass"
        >
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-primary-800 mb-2">
              Join the Premium Pet Community
            </h3>
            <p className="text-primary-600">
              Connect with breeders, discover amazing pets, and find your perfect companion
            </p>
          </div>
          
          <div className="flex flex-col space-y-3">
            <Link href="/auth/register" className="btn-primary w-full text-center">
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2 inline" />
            </Link>
            <Link href="/breeds" className="btn-outline w-full text-center">
              Explore Breeds
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-primary-800 mb-4">
              Why Choose MoPets?
            </h2>
            <p className="text-lg text-primary-600 max-w-2xl mx-auto">
              The ultimate platform for pet enthusiasts, connecting you with premium breeds 
              and professional breeders worldwide.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Breed Showcase */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-primary-800 mb-4">
              Premium Breed Trio
            </h2>
            <p className="text-lg text-primary-600">
              Discover our featured breeds with exceptional bloodlines
            </p>
          </motion.div>

          <BreedShowcase />
        </div>
      </section>

      {/* Subscription Tiers */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary-50 to-accent-luxury">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-primary-800 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-lg text-primary-600">
              Access premium features and connect with the best in the pet community
            </p>
          </motion.div>

          <SubscriptionTiers />
        </div>
      </section>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  )
}