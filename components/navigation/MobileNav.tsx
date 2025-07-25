'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Home, 
  Users, 
  Crown, 
  ShoppingBag, 
  User,
  MessageCircle,
  PlusCircle
} from 'lucide-react'

const navItems = [
  {
    href: '/',
    icon: Home,
    label: 'Home',
    color: 'primary'
  },
  {
    href: '/community',
    icon: Users,
    label: 'Community',
    color: 'primary'
  },
  {
    href: '/create',
    icon: PlusCircle,
    label: 'Create',
    color: 'gold',
    isSpecial: true
  },
  {
    href: '/marketplace',
    icon: ShoppingBag,
    label: 'Market',
    color: 'primary'
  },
  {
    href: '/profile',
    icon: User,
    label: 'Profile',
    color: 'primary'
  }
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-glass border-t border-primary-100 safe-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center p-2 min-w-[60px]"
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary-100 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              {/* Special create button */}
              {item.isSpecial ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative z-10 bg-gradient-to-r from-gold-400 to-gold-600 p-3 rounded-xl shadow-luxury"
                >
                  <Icon className="w-6 h-6 text-white" />
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative z-10 p-2"
                >
                  <Icon 
                    className={`w-6 h-6 transition-colors duration-200 ${
                      isActive 
                        ? 'text-primary-800' 
                        : 'text-primary-400'
                    }`} 
                  />
                </motion.div>
              )}

              {/* Label */}
              <span 
                className={`relative z-10 text-xs font-medium mt-1 transition-colors duration-200 ${
                  isActive 
                    ? 'text-primary-800' 
                    : 'text-primary-500'
                }`}
              >
                {item.label}
              </span>

              {/* Notification badge (example for messages) */}
              {item.href === '/community' && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}