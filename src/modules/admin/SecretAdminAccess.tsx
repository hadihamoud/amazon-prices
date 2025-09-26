import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const SecretAdminAccess: React.FC = () => {
  const [keySequence, setKeySequence] = useState<string[]>([])
  const [clickSequence, setClickSequence] = useState<number[]>([])
  const [showAccess, setShowAccess] = useState(false)
  const navigate = useNavigate()

  // Secret key sequence: 'zobda' + 'admin' (case insensitive)
  const secretSequence = ['z', 'o', 'b', 'd', 'a', 'a', 'd', 'm', 'i', 'n']
  const [currentIndex, setCurrentIndex] = useState(0)
  
  // Secret click sequence: 5 clicks on the logo
  const secretClickCount = 5
  const [clickCount, setClickCount] = useState(0)
  const [lastClickTime, setLastClickTime] = useState(0)

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      
      // Check if the pressed key matches the expected key in the sequence
      if (key === secretSequence[currentIndex]) {
        const newSequence = [...keySequence, key]
        setKeySequence(newSequence)
        
        if (currentIndex === secretSequence.length - 1) {
          // Complete sequence detected
          setShowAccess(true)
          setKeySequence([])
          setCurrentIndex(0)
        } else {
          setCurrentIndex(currentIndex + 1)
        }
      } else {
        // Wrong key, reset sequence
        setKeySequence([])
        setCurrentIndex(0)
      }
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      // Check if clicked on the logo (Z icon)
      if (target && target.textContent === 'Z' && target.closest('.w-8.h-8.bg-zobda-orange')) {
        handleLogoClick()
      }
    }

    // Add event listeners
    document.addEventListener('keydown', handleKeyPress)
    document.addEventListener('click', handleClick)

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
      document.removeEventListener('click', handleClick)
    }
  }, [keySequence, currentIndex, clickCount, lastClickTime])

  // Reset click count after 3 seconds of inactivity
  useEffect(() => {
    if (clickCount > 0) {
      const timer = setTimeout(() => {
        setClickCount(0)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [clickCount])

  const handleLogoClick = () => {
    const now = Date.now()
    const timeDiff = now - lastClickTime
    
    // Reset if more than 3 seconds between clicks
    if (timeDiff > 3000) {
      setClickCount(1)
    } else {
      const newCount = clickCount + 1
      setClickCount(newCount)
      
      if (newCount >= secretClickCount) {
        setShowAccess(true)
        setClickCount(0)
      }
    }
    
    setLastClickTime(now)
  }

  const handleDirectAccess = () => {
    navigate('/admin')
  }

  if (!showAccess) {
    return null // Hidden component
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-zobda-orange mb-4">
            <span className="text-white font-bold text-xl">Z</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Secret Admin Access</h2>
          <p className="text-gray-600 mb-6">
            You've discovered the secret admin access! 🎉
          </p>
          
          <div className="space-y-3">
            <button
              onClick={handleDirectAccess}
              className="w-full bg-zobda-orange text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Access Admin Dashboard
            </button>
            
            <button
              onClick={() => setShowAccess(false)}
              className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
          
          <div className="text-xs text-gray-500 mt-4 space-y-1">
            <p><strong>Secret Access Methods:</strong></p>
            <p>• Type "zobdaadmin" anywhere on the site</p>
            <p>• Click the "Z" logo 5 times quickly</p>
            <p>• Visit: <code>/zobda-admin</code></p>
          </div>
        </div>
      </div>
    </div>
  )
}
