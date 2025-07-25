'use client'

import { motion } from 'framer-motion'
import { Package, Heart, Utensils, Gamepad2, ShoppingBag } from 'lucide-react'

interface CategoryFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

const categories = [
  { id: 'ALL', name: 'All', icon: ShoppingBag, color: 'primary' },
  { id: 'PUPPIES', name: 'Puppies', icon: Heart, color: 'gold' },
  { id: 'SUPPLIES', name: 'Supplies', icon: Package, color: 'primary' },
  { id: 'FOOD', name: 'Food', icon: Utensils, color: 'primary' },
  { id: 'TOYS', name: 'Toys', icon: Gamepad2, color: 'primary' },
  { id: 'ACCESSORIES', name: 'Accessories', icon: Package, color: 'primary' }
]

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex space-x-2 overflow-x-auto hide-scrollbar pb-2">
      {categories.map((category) => {
        const isSelected = selectedCategory === category.id
        const Icon = category.icon
        
        return (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategoryChange(category.id)}
            className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
              isSelected
                ? category.color === 'gold'
                  ? 'bg-gradient-to-r from-gold-400 to-gold-600 text-white shadow-luxury'
                  : 'bg-primary-800 text-white shadow-soft'
                : 'bg-white text-primary-600 border border-primary-200 hover:border-primary-400'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{category.name}</span>
          </motion.button>
        )
      })}
    </div>
  )
}