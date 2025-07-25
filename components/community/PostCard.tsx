'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  Heart, 
  MessageCircle, 
  Share, 
  MoreHorizontal,
  Crown,
  Verified,
  Clock
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface PostCardProps {
  post: {
    id: string
    user: {
      id: string
      username: string
      profilePicture: string
      role: string
    }
    content: string
    images: string[]
    breed?: string
    likes: number
    comments: number
    isLiked: boolean
    createdAt: string
    isPromoted?: boolean
  }
  onLike: (postId: string) => void
  onComment: (postId: string) => void
  onShare: (postId: string) => void
}

const breedColors = {
  FRENCH_BULLDOG: 'bg-accent-frenchie text-primary-900',
  CANE_CORSO: 'bg-accent-corso text-white',
  ENGLISH_BULLDOG: 'bg-accent-luxury text-primary-900',
  OTHER: 'bg-primary-200 text-primary-800'
}

const roleIcons = {
  BREEDER: Crown,
  PET_OWNER: Verified,
  PET_LOVER: Heart
}

export function PostCard({ post, onLike, onComment, onShare }: PostCardProps) {
  const [imageIndex, setImageIndex] = useState(0)
  const [showAllImages, setShowAllImages] = useState(false)
  
  const RoleIcon = roleIcons[post.user.role as keyof typeof roleIcons] || Verified
  const breedColorClass = breedColors[post.breed as keyof typeof breedColors] || breedColors.OTHER

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="card overflow-hidden"
    >
      {/* Promoted Badge */}
      {post.isPromoted && (
        <div className="bg-gradient-to-r from-gold-400 to-gold-600 px-4 py-2">
          <div className="flex items-center space-x-2">
            <Crown className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-semibold">Promoted Post</span>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* User Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Image
                src={post.user.profilePicture}
                alt={post.user.username}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
              {post.user.role === 'BREEDER' && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gold-500 rounded-full flex items-center justify-center">
                  <Crown className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-primary-800">
                  {post.user.username}
                </h3>
                <RoleIcon className="w-4 h-4 text-primary-600" />
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-primary-500 text-sm">
                  <Clock className="w-3 h-3" />
                  <span>{timeAgo}</span>
                </div>
                
                {post.breed && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${breedColorClass}`}>
                    {post.breed.replace('_', ' ')}
                  </span>
                )}
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-primary-100 rounded-full transition-colors"
          >
            <MoreHorizontal className="w-5 h-5 text-primary-600" />
          </motion.button>
        </div>

        {/* Content */}
        <div className="mb-4">
          <p className="text-primary-700 leading-relaxed">
            {post.content}
          </p>
        </div>

        {/* Images */}
        {post.images.length > 0 && (
          <div className="mb-4 -mx-6">
            {post.images.length === 1 ? (
              <div className="relative aspect-square">
                <Image
                  src={post.images[0]}
                  alt="Post image"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-1">
                {post.images.slice(0, 4).map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square cursor-pointer"
                    onClick={() => setShowAllImages(true)}
                  >
                    <Image
                      src={image}
                      alt={`Post image ${index + 1}`}
                      fill
                      className="object-cover hover:opacity-90 transition-opacity"
                    />
                    {index === 3 && post.images.length > 4 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          +{post.images.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-primary-100">
          <div className="flex items-center space-x-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onLike(post.id)}
              className={`flex items-center space-x-2 transition-colors ${
                post.isLiked 
                  ? 'text-red-500' 
                  : 'text-primary-600 hover:text-red-500'
              }`}
            >
              <Heart 
                className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} 
              />
              <span className="font-medium">{post.likes}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onComment(post.id)}
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-800 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">{post.comments}</span>
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onShare(post.id)}
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-800 transition-colors"
          >
            <Share className="w-5 h-5" />
            <span className="font-medium">Share</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}