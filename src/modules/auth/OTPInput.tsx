import React, { useState, useRef, useEffect } from 'react'

interface OTPInputProps {
  length?: number
  onComplete: (otp: string) => void
  onResend: () => void
  disabled?: boolean
  error?: string
  resendCooldown?: number
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  onComplete,
  onResend,
  disabled = false,
  error,
  resendCooldown = 0
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''))
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Handle input change
  const handleChange = (index: number, value: string) => {
    if (disabled) return

    // Only allow single digit
    if (value.length > 1) {
      value = value.slice(-1)
    }

    // Only allow numbers
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Move to next input if current is filled
    if (value && index < length - 1) {
      setActiveIndex(index + 1)
      inputRefs.current[index + 1]?.focus()
    }

    // Check if OTP is complete
    const completeOtp = newOtp.join('')
    if (completeOtp.length === length && !completeOtp.includes('')) {
      onComplete(completeOtp)
    }
  }

  // Handle key down
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return

    if (e.key === 'Backspace') {
      if (otp[index]) {
        // Clear current input
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
      } else if (index > 0) {
        // Move to previous input
        setActiveIndex(index - 1)
        inputRefs.current[index - 1]?.focus()
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      setActiveIndex(index - 1)
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      setActiveIndex(index + 1)
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return

    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    
    if (pastedData.length > 0) {
      const newOtp = [...otp]
      for (let i = 0; i < pastedData.length && i < length; i++) {
        newOtp[i] = pastedData[i]
      }
      setOtp(newOtp)
      
      // Focus on the next empty input or the last input
      const nextIndex = Math.min(pastedData.length, length - 1)
      setActiveIndex(nextIndex)
      inputRefs.current[nextIndex]?.focus()
      
      // Check if complete
      const completeOtp = newOtp.join('')
      if (completeOtp.length === length && !completeOtp.includes('')) {
        onComplete(completeOtp)
      }
    }
  }

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  // Clear OTP when disabled changes to true
  useEffect(() => {
    if (disabled) {
      setOtp(new Array(length).fill(''))
      setActiveIndex(0)
    }
  }, [disabled, length])

  return (
    <div className="space-y-4">
      {/* OTP Input Fields */}
      <div className="flex justify-center space-x-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => setActiveIndex(index)}
            disabled={disabled}
            className={`
              w-12 h-12 text-center text-xl font-bold border-2 rounded-lg
              transition-all duration-200 focus:outline-none
              ${activeIndex === index 
                ? 'border-zobda-orange ring-2 ring-zobda-orange ring-opacity-50' 
                : 'border-zobda-border'
              }
              ${error 
                ? 'border-red-500 bg-red-50' 
                : 'border-zobda-border bg-white'
              }
              ${disabled 
                ? 'bg-gray-100 cursor-not-allowed' 
                : 'hover:border-zobda-orange focus:border-zobda-orange'
              }
            `}
          />
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}

      {/* Resend Button */}
      <div className="text-center">
        <button
          onClick={onResend}
          disabled={disabled || resendCooldown > 0}
          className={`
            text-sm font-medium transition-colors duration-200
            ${disabled || resendCooldown > 0
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-zobda-orange hover:text-orange-600'
            }
          `}
        >
          {resendCooldown > 0 
            ? `Resend OTP in ${resendCooldown}s`
            : 'Resend OTP'
          }
        </button>
      </div>
    </div>
  )
}


