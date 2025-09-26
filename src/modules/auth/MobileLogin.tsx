import React, { useState } from 'react'
import { OTPInput } from './OTPInput'
import { 
  sendOTP, 
  verifyOTP, 
  resendOTP, 
  formatMobileNumber, 
  validateMobileNumber,
  getResendCooldownTime
} from '../../services/otpService'

interface MobileLoginProps {
  onSuccess: (user: any) => void
  onCancel?: () => void
  onSwitchToSignup?: () => void
}

export const MobileLogin: React.FC<MobileLoginProps> = ({ 
  onSuccess, 
  onCancel, 
  onSwitchToSignup 
}) => {
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile')
  const [mobileNumber, setMobileNumber] = useState('')
  const [countryCode, setCountryCode] = useState('+1')
  const [otp, setOtp] = useState('')
  const [sessionId, setSessionId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)

  // Handle mobile number submission
  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateMobileNumber(mobileNumber)) {
      setError('Please enter a valid mobile number')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await sendOTP({
        mobileNumber,
        countryCode
      })

      if (response.success) {
        setSessionId(response.sessionId || '')
        setStep('otp')
      } else {
        setError(response.message)
      }
    } catch (error) {
      setError('Failed to send OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle OTP completion
  const handleOTPComplete = async (enteredOtp: string) => {
    setOtp(enteredOtp)
    setIsLoading(true)
    setError('')

    try {
      const response = await verifyOTP({
        mobileNumber: formatMobileNumber(mobileNumber, countryCode),
        otp: enteredOtp,
        sessionId
      })

      if (response.success && response.user) {
        onSuccess(response.user)
      } else {
        setError(response.message)
        setOtp('')
      }
    } catch (error) {
      setError('Failed to verify OTP. Please try again.')
      setOtp('')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle resend OTP
  const handleResendOTP = async () => {
    if (resendCooldown > 0) return

    setIsLoading(true)
    setError('')

    try {
      const response = await resendOTP(mobileNumber)

      if (response.success) {
        setSessionId(response.sessionId || '')
        setResendCooldown(30) // 30 seconds cooldown
        setOtp('')
      } else {
        setError(response.message)
      }
    } catch (error) {
      setError('Failed to resend OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle back to mobile step
  const handleBackToMobile = () => {
    setStep('mobile')
    setOtp('')
    setError('')
    setResendCooldown(0)
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {step === 'mobile' ? 'Sign In' : 'Verify Mobile Number'}
          </h2>
          <p className="text-zobda-gray">
            {step === 'mobile' 
              ? 'Enter your mobile number to sign in'
              : `We sent a 6-digit code to ${formatMobileNumber(mobileNumber, countryCode)}`
            }
          </p>
        </div>

        {/* Mobile Number Step */}
        {step === 'mobile' && (
          <form onSubmit={handleMobileSubmit} className="space-y-6">
            {/* Country Code and Mobile Number */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <div className="flex">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="px-3 py-3 border border-r-0 border-zobda-border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-zobda-orange focus:border-transparent bg-gray-50"
                  >
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+971">🇦🇪 +971</option>
                    <option value="+966">🇸🇦 +966</option>
                    <option value="+20">🇪🇬 +20</option>
                  </select>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="Enter mobile number"
                    className="flex-1 px-3 py-3 border border-zobda-border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-zobda-orange focus:border-transparent"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !mobileNumber.trim()}
              className="w-full btn-zobda disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </button>

            {/* Switch to Signup */}
            {onSwitchToSignup && (
              <div className="text-center">
                <p className="text-sm text-zobda-gray">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={onSwitchToSignup}
                    className="text-zobda-orange hover:text-orange-600 font-medium"
                    disabled={isLoading}
                  >
                    Sign up
                  </button>
                </p>
              </div>
            )}

            {/* Cancel Button */}
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="w-full btn-outline mt-2"
                disabled={isLoading}
              >
                Cancel
              </button>
            )}
          </form>
        )}

        {/* OTP Verification Step */}
        {step === 'otp' && (
          <div className="space-y-6">
            {/* OTP Input */}
            <OTPInput
              onComplete={handleOTPComplete}
              onResend={handleResendOTP}
              disabled={isLoading}
              error={error}
              resendCooldown={resendCooldown}
            />

            {/* Back Button */}
            <button
              onClick={handleBackToMobile}
              className="w-full btn-outline"
              disabled={isLoading}
            >
              Change Mobile Number
            </button>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center text-sm text-zobda-gray">
                Verifying OTP...
              </div>
            )}
          </div>
        )}

        {/* Demo OTP Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Demo Mode</h3>
          <p className="text-xs text-blue-800">
            For testing, check the browser console or localStorage for the OTP code.
            <br />
            <strong>Demo OTP:</strong> Check console or localStorage key 'zobda_demo_otp'
          </p>
        </div>
      </div>
    </div>
  )
}


