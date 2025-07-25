'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  color?: 'primary' | 'gold' | 'accent'
}

export function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  color = 'primary' 
}: FeatureCardProps) {
  const colorClasses = {
    primary: 'bg-primary-800 text-white',
    gold: 'bg-gradient-to-r from-gold-400 to-gold-600 text-white',
    accent: 'bg-accent-frenchie text-primary-900'
  }

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="card p-6 cursor-pointer group"
    >
      <div className={`w-14 h-14 rounded-2xl ${colorClasses[color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-7 h-7" />
      </div>
      
      <h3 className="text-xl font-bold text-primary-800 mb-3 group-hover:text-primary-900 transition-colors">
        {title}
      </h3>
      
      <p className="text-primary-600 leading-relaxed group-hover:text-primary-700 transition-colors">
        {description}
      </p>
      
      {/* Subtle hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-gold-400/5 to-primary-800/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  )
}