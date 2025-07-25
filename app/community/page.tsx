'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, 
  MessageCircle, 
  Share, 
  Filter,
  Search,
  Plus,
  PawPrint,
  Star,
  Users,
  TrendingUp
} from 'lucide-react'
import { MobileNav } from '@/components/navigation/MobileNav'
import { PostCard } from '@/components/community/PostCard'
import { CreatePostModal } from '@/components/community/CreatePostModal'
import { BreedFilter } from '@/components/community/BreedFilter'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

const mockPosts = [
  {
    id: '1',
    user: {
      id: '1',
      username: 'frenchie_lover',
      profilePicture: '/images/users/user1.jpg',
      role: 'PET_OWNER'
    },
    content: 'Just brought home my new French Bulldog puppy! Meet Luna 🐶✨ She\'s already stolen my heart with those adorable bat ears.',
    images: ['/images/posts/frenchie1.jpg', '/images/posts/frenchie2.jpg'],
    breed: 'FRENCH_BULLDOG',
    likes: 24,
    comments: 8,
    isLiked: false,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    user: {
      id: '2',
      username: 'corso_breeder_pro',
      profilePicture: '/images/users/user2.jpg',
      role: 'BREEDER'
    },
    content: 'Our latest Cane Corso litter is growing beautifully! These 8-week-old pups are showing excellent temperament and conformation. Available for loving homes. 🏆',
    images: ['/images/posts/corso1.jpg'],
    breed: 'CANE_CORSO',
    likes: 45,
    comments: 12,
    isLiked: true,
    createdAt: '2024-01-14T15:45:00Z',
    isPromoted: true
  },
  {
    id: '3',
    user: {
      id: '3',
      username: 'pet_enthusiast',
      profilePicture: '/images/users/user3.jpg',
      role: 'PET_LOVER'
    },
    content: 'Does anyone have experience with English Bulldogs in hot weather? Looking for tips to keep them comfortable during summer! 🌞',
    images: [],
    breed: 'ENGLISH_BULLDOG',
    likes: 18,
    comments: 15,
    isLiked: false,
    createdAt: '2024-01-14T09:20:00Z'
  }
]

const communityStats = [
  { label: 'Active Members', value: '12.5K', icon: Users, color: 'primary' },
  { label: 'Posts Today', value: '247', icon: TrendingUp, color: 'gold' },
  { label: 'Premium Breeds', value: '3', icon: Star, color: 'luxury' }
]

export default function CommunityPage() {
  const { data: session } = useSession()
  const [posts, setPosts] = useState(mockPosts)
  const [selectedBreed, setSelectedBreed] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const filteredPosts = posts.filter(post => {
    const matchesBreed = selectedBreed === 'ALL' || post.breed === selectedBreed
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.user.username.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesBreed && matchesSearch
  })

  const handleLike = async (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ))
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRefreshing(false)
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
              <PawPrint className="w-8 h-8 text-primary-800" />
              <h1 className="text-2xl font-bold text-gradient-primary">Community</h1>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-gold-400 to-gold-600 p-3 rounded-xl shadow-luxury"
            >
              <Plus className="w-6 h-6 text-white" />
            </motion.button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-400" />
            <input
              type="text"
              placeholder="Search posts and users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-primary-50 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {communityStats.map((stat, index) => {
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

          {/* Breed Filter */}
          <BreedFilter 
            selectedBreed={selectedBreed}
            onBreedChange={setSelectedBreed}
          />
        </div>
      </motion.header>

      {/* Posts Feed */}
      <div className="px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : filteredPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <PawPrint className="w-16 h-16 text-primary-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-primary-800 mb-2">No posts found</h3>
            <p className="text-primary-600 mb-6">
              {searchQuery || selectedBreed !== 'ALL' 
                ? 'Try adjusting your filters or search terms'
                : 'Be the first to share something with the community!'
              }
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Create First Post
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <PostCard 
                    post={post}
                    onLike={handleLike}
                    onComment={(postId) => console.log('Comment on', postId)}
                    onShare={(postId) => console.log('Share', postId)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Load More */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-outline"
                onClick={() => console.log('Load more posts')}
              >
                Load More Posts
              </motion.button>
            </div>
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      <CreatePostModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPostCreated={(newPost) => {
          setPosts(prev => [newPost, ...prev])
          setShowCreateModal(false)
        }}
      />

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  )
}