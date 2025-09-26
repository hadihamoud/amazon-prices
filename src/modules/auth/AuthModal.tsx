import React, { useState, useEffect } from 'react'
import { MobileSignup } from './MobileSignup'
import { MobileLogin } from './MobileLogin'
import { getCurrentUserSession, isUserLoggedIn, logoutUser } from '../../services/otpService'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (user: any) => void
  initialMode?: 'signup' | 'login'
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  initialMode = 'signup' 
}) => {
  const [mode, setMode] = useState<'signup' | 'login'>(initialMode)
  const [user, setUser] = useState<any>(null)

  // Check if user is already logged in
  useEffect(() => {
    if (isUserLoggedIn()) {
      const session = getCurrentUserSession()
      setUser(session)
    }
  }, [])

  // Handle successful authentication
  const handleAuthSuccess = (authenticatedUser: any) => {
    setUser(authenticatedUser)
    onSuccess(authenticatedUser)
    onClose()
  }

  // Handle logout
  const handleLogout = () => {
    logoutUser()
    setUser(null)
    onClose()
  }

  // Handle mode switch
  const handleModeSwitch = () => {
    setMode(mode === 'signup' ? 'login' : 'signup')
  }

  // Don't render if not open
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Auth Content */}
        <div className="px-4 pb-4">
          {mode === 'signup' ? (
            <MobileSignup
              onSuccess={handleAuthSuccess}
              onCancel={onClose}
            />
          ) : (
            <MobileLogin
              onSuccess={handleAuthSuccess}
              onCancel={onClose}
              onSwitchToSignup={handleModeSwitch}
            />
          )}

          {/* Mode Switch */}
          <div className="mt-6 text-center">
            <p className="text-sm text-zobda-gray">
              {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
              {' '}
              <button
                onClick={handleModeSwitch}
                className="text-zobda-orange hover:text-orange-600 font-medium"
              >
                {mode === 'signup' ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Hook for managing auth state
export const useAuth = () => {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      if (isUserLoggedIn()) {
        const session = getCurrentUserSession()
        setUser(session)
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = (userData: any) => {
    setUser(userData)
  }

  const logout = () => {
    logoutUser()
    setUser(null)
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout
  }
}


