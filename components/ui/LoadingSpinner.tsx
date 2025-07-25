'use client'

import { motion } from 'framer-motion'
import { PawPrint } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'gold' | 'white'
}

export function LoadingSpinner({ size = 'md', color = 'primary' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const colorClasses = {
    primary: 'text-primary-800',
    gold: 'text-gold-500',
    white: 'text-white'
  }

  return (
    <div className="flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={`${sizeClasses[size]} ${colorClasses[color]}`}
      >
        <PawPrint className="w-full h-full" />
      </motion.div>
    </div>
  )
}