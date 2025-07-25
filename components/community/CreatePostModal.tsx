'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Image as ImageIcon, Camera, Smile } from 'lucide-react'

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  onPostCreated: (post: any) => void
}

const breeds = [
  { id: 'FRENCH_BULLDOG', name: 'French Bulldog' },
  { id: 'CANE_CORSO', name: 'Cane Corso' },
  { id: 'ENGLISH_BULLDOG', name: 'English Bulldog' },
  { id: 'OTHER', name: 'Other' }
]

export function CreatePostModal({ isOpen, onClose, onPostCreated }: CreatePostModalProps) {
  const [content, setContent] = useState('')
  const [selectedBreed, setSelectedBreed] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim()) return

    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    const newPost = {
      id: Date.now().toString(),
      user: {
        id: 'current-user',
        username: 'current_user',
        profilePicture: '/images/users/current-user.jpg',
        role: 'PET_OWNER'
      },
      content,
      images,
      breed: selectedBreed || undefined,
      likes: 0,
      comments: 0,
      isLiked: false,
      createdAt: new Date().toISOString()
    }

    onPostCreated(newPost)
    
    // Reset form
    setContent('')
    setSelectedBreed('')
    setImages([])
    setIsLoading(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      // In a real app, you'd upload to Cloudinary here
      const newImages = Array.from(files).map(file => URL.createObjectURL(file))
      setImages(prev => [...prev, ...newImages].slice(0, 4)) // Max 4 images
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed inset-x-4 top-1/2 transform -translate-y-1/2 z-50 max-w-md mx-auto"
          >
            <div className="card p-6 max-h-[80vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-primary-800">Create Post</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 hover:bg-primary-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-primary-600" />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    What's on your mind?
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share something with the MoPets community..."
                    rows={4}
                    className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-primary-900 placeholder-primary-400 resize-none"
                    required
                  />
                </div>

                {/* Breed Selection */}
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Breed (Optional)
                  </label>
                  <select
                    value={selectedBreed}
                    onChange={(e) => setSelectedBreed(e.target.value)}
                    className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-primary-900"
                  >
                    <option value="">Select a breed</option>
                    {breeds.map((breed) => (
                      <option key={breed.id} value={breed.id}>
                        {breed.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Images (Optional)
                  </label>
                  
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {images.length < 4 && (
                    <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-primary-300 rounded-xl cursor-pointer hover:border-primary-400 transition-colors">
                      <div className="text-center">
                        <ImageIcon className="w-8 h-8 text-primary-400 mx-auto mb-2" />
                        <span className="text-sm text-primary-600">Add Photos</span>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onClose}
                    className="btn-outline flex-1"
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={!content.trim() || isLoading}
                    className="btn-primary flex-1"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Posting...
                      </div>
                    ) : (
                      'Post'
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}