'use client'

import { motion } from 'framer-motion'

interface BreedFilterProps {
  selectedBreed: string
  onBreedChange: (breed: string) => void
}

const breeds = [
  { id: 'ALL', name: 'All Breeds', color: 'primary' },
  { id: 'FRENCH_BULLDOG', name: 'French Bulldog', color: 'frenchie' },
  { id: 'CANE_CORSO', name: 'Cane Corso', color: 'corso' },
  { id: 'ENGLISH_BULLDOG', name: 'English Bulldog', color: 'luxury' },
  { id: 'OTHER', name: 'Other', color: 'primary' }
]

export function BreedFilter({ selectedBreed, onBreedChange }: BreedFilterProps) {
  return (
    <div className="flex space-x-2 overflow-x-auto hide-scrollbar pb-2">
      {breeds.map((breed) => {
        const isSelected = selectedBreed === breed.id
        
        return (
          <motion.button
            key={breed.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onBreedChange(breed.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
              isSelected
                ? breed.color === 'frenchie'
                  ? 'bg-accent-frenchie text-primary-900 shadow-soft'
                  : breed.color === 'corso'
                  ? 'bg-accent-corso text-white shadow-soft'
                  : breed.color === 'luxury'
                  ? 'bg-accent-luxury text-primary-900 shadow-soft'
                  : 'bg-primary-800 text-white shadow-soft'
                : 'bg-white text-primary-600 border border-primary-200 hover:border-primary-400'
            }`}
          >
            {breed.name}
          </motion.button>
        )
      })}
    </div>
  )
}