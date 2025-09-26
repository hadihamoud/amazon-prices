import React, { useState } from 'react'
import { Link } from 'react-router-dom'

type AuthMethod = 'email' | 'phone'

export const ForgotPasswordPage: React.FC = () => {
  const [authMethod, setAuthMethod] = useState<AuthMethod>('email')
  const [formData, setFormData] = useState({
    email: '',
    phone: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (authMethod === 'email') {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid'
      }
    } else {
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required'
      } else if (!/^[0-9]{9}$/.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Phone number must be 9 digits'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      console.log('Password reset request:', formData)
      setIsLoading(false)
      setIsSubmitted(true)
    }, 1000)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-zobda-lightGray flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-zobda-orange rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl">Z</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-zobda-orange">Zobda</h1>
                <p className="text-sm text-zobda-gray">Amazon price tracker</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Check your {authMethod}</h2>
              <p className="text-zobda-gray mb-6">
                We've sent password reset instructions to{' '}
                <span className="font-medium text-gray-900">
                  {authMethod === 'email' ? formData.email : `+966 ${formData.phone}`}
                </span>
              </p>
              
              <div className="space-y-4">
                <Link
                  to="/signin"
                  className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-zobda-orange hover:bg-zobda-darkOrange focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zobda-orange"
                >
                  Back to Sign In
                </Link>
                
                <button
                  onClick={() => {
                    setIsSubmitted(false)
                    setFormData({ email: '', phone: '' })
                  }}
                  className="w-full flex justify-center py-3 px-4 border border-zobda-border text-sm font-medium rounded-lg text-zobda-orange bg-white hover:bg-zobda-lightGray focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zobda-orange"
                >
                  Try a different {authMethod === 'email' ? 'email' : 'phone number'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zobda-lightGray flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-zobda-orange rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">Z</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-zobda-orange">Zobda</h1>
              <p className="text-sm text-zobda-gray">Amazon price tracker</p>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Forgot your password?</h2>
          <p className="mt-2 text-sm text-zobda-gray">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        {/* Auth Method Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setAuthMethod('email')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              authMethod === 'email'
                ? 'bg-white text-zobda-orange shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => setAuthMethod('phone')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              authMethod === 'phone'
                ? 'bg-white text-zobda-orange shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Phone
          </button>
        </div>

        {/* Forgot Password Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            {authMethod === 'email' ? (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zobda-orange focus:border-transparent ${
                    errors.email ? 'border-red-300' : 'border-zobda-border'
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            ) : (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone number
                </label>
                <div className="mt-1 flex rounded-lg shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-zobda-border bg-gray-50 text-gray-500 text-sm">
                    +966
                  </span>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`flex-1 block w-full px-3 py-3 border rounded-r-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zobda-orange focus:border-transparent ${
                      errors.phone ? 'border-red-300' : 'border-zobda-border'
                    }`}
                    placeholder="50 123 4567"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-zobda-orange hover:bg-zobda-darkOrange focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zobda-orange disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </div>
              ) : (
                'Send reset instructions'
              )}
            </button>
          </div>

          <div className="text-center">
            <Link to="/signin" className="text-sm text-zobda-orange hover:text-zobda-darkOrange">
              Back to Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
