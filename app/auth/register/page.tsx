'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff, PawPrint, ArrowLeft, User, Heart, Crown } from 'lucide-react'
import toast from 'react-hot-toast'

const roles = [
  {
    id: 'PET_OWNER',
    name: 'Pet Owner',
    description: 'I own pets and want to connect with the community',
    icon: User,
    color: 'primary'
  },
  {
    id: 'PET_LOVER',
    name: 'Pet Lover',
    description: 'I love pets and want to discover new breeds',
    icon: Heart,
    color: 'gold'
  },
  {
    id: 'BREEDER',
    name: 'Professional Breeder',
    description: 'I breed pets professionally and need business tools',
    icon: Crown,
    color: 'luxury'
  }
]

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    role: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleRoleSelect = (roleId: string) => {
    setFormData(prev => ({ ...prev, role: roleId }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Account created successfully!')
        router.push('/auth/login')
      } else {
        const error = await response.json()
        toast.error(error.message || 'Something went wrong')
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    if (step === 1) {
      if (!formData.email || !formData.password || !formData.username) {
        toast.error('Please fill in all fields')
        return
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match')
        return
      }
    }
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-luxury flex flex-col">
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="safe-top p-4"
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-primary-800">
            <ArrowLeft className="w-6 h-6" />
            <span>Back</span>
          </Link>
          <div className="flex items-center space-x-2">
            <PawPrint className="w-8 h-8 text-primary-800" />
            <h1 className="text-xl font-bold text-gradient-primary">MoPets</h1>
          </div>
        </div>
      </motion.header>

      {/* Progress Indicator */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-center space-x-4">
          {[1, 2].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                step >= stepNumber 
                  ? 'bg-primary-800 text-white' 
                  : 'bg-primary-200 text-primary-600'
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 2 && (
                <div className={`w-16 h-1 mx-2 transition-colors ${
                  step > stepNumber ? 'bg-primary-800' : 'bg-primary-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-2">
          <p className="text-sm text-primary-600">
            Step {step} of 2: {step === 1 ? 'Account Details' : 'Choose Your Role'}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          key={step}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <div className="card p-8">
            {step === 1 ? (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-primary-800 mb-2">
                    Create Account
                  </h2>
                  <p className="text-primary-600">
                    Join the MoPets community today
                  </p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="input-primary"
                      placeholder="Choose a username"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-primary"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="input-primary pr-12"
                        placeholder="Create a password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-500"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="input-primary pr-12"
                        placeholder="Confirm your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-500"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="btn-primary w-full"
                  >
                    Continue
                  </motion.button>
                </form>
              </>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-primary-800 mb-2">
                    Choose Your Role
                  </h2>
                  <p className="text-primary-600">
                    Help us personalize your MoPets experience
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  {roles.map((role) => {
                    const Icon = role.icon
                    const isSelected = formData.role === role.id
                    
                    return (
                      <motion.div
                        key={role.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleRoleSelect(role.id)}
                        className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 ${
                          isSelected
                            ? 'border-primary-800 bg-primary-50 shadow-luxury'
                            : 'border-primary-200 bg-white hover:border-primary-400'
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            role.color === 'primary' ? 'bg-primary-800 text-white' :
                            role.color === 'gold' ? 'bg-gradient-to-r from-gold-400 to-gold-600 text-white' :
                            'bg-gradient-to-r from-accent-luxury to-gold-500 text-white'
                          }`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className={`text-lg font-bold mb-1 ${
                              isSelected ? 'text-primary-800' : 'text-primary-700'
                            }`}>
                              {role.name}
                            </h3>
                            <p className="text-primary-600 text-sm">
                              {role.description}
                            </p>
                          </div>
                          {isSelected && (
                            <div className="w-6 h-6 bg-primary-800 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={prevStep}
                    className="btn-outline flex-1"
                  >
                    Back
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={!formData.role || isLoading}
                    className="btn-primary flex-1"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Creating...
                      </div>
                    ) : (
                      'Create Account'
                    )}
                  </motion.button>
                </div>
              </>
            )}

            <div className="mt-8 text-center">
              <p className="text-primary-600">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-primary-800 font-semibold hover:text-primary-900">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}