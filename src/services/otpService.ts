// OTP Service for mobile number verification
export interface OTPRequest {
  mobileNumber: string
  countryCode?: string
}

export interface OTPVerification {
  mobileNumber: string
  otp: string
  sessionId: string
}

export interface OTPResponse {
  success: boolean
  message: string
  sessionId?: string
  expiresAt?: string
}

export interface OTPVerificationResponse {
  success: boolean
  message: string
  token?: string
  user?: {
    id: string
    mobileNumber: string
    isVerified: boolean
  }
}

// OTP Configuration
const OTP_CONFIG = {
  LENGTH: 6,
  EXPIRY_MINUTES: 5,
  MAX_ATTEMPTS: 3,
  RESEND_COOLDOWN_SECONDS: 30
}

// Storage keys
const OTP_STORAGE_KEY = 'zobda_otp_sessions'
const USER_SESSION_KEY = 'zobda_user_session'

// Generate random OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Get current timestamp
function getCurrentTime(): number {
  return Date.now()
}

// Format mobile number
export function formatMobileNumber(mobileNumber: string, countryCode: string = '+1'): string {
  // Remove all non-digit characters
  const cleaned = mobileNumber.replace(/\D/g, '')
  
  // Add country code if not present
  if (!cleaned.startsWith(countryCode.replace('+', ''))) {
    return `${countryCode}${cleaned}`
  }
  
  return `+${cleaned}`
}

// Validate mobile number format
export function validateMobileNumber(mobileNumber: string): boolean {
  // Remove all non-digit characters
  const cleaned = mobileNumber.replace(/\D/g, '')
  
  // Check if it's a valid length (7-15 digits)
  return cleaned.length >= 7 && cleaned.length <= 15
}

// Send OTP (simulated - in production, integrate with SMS service)
export async function sendOTP(request: OTPRequest): Promise<OTPResponse> {
  try {
    const { mobileNumber, countryCode = '+1' } = request
    const formattedNumber = formatMobileNumber(mobileNumber, countryCode)
    
    // Validate mobile number
    if (!validateMobileNumber(mobileNumber)) {
      return {
        success: false,
        message: 'Invalid mobile number format'
      }
    }
    
    // Check if there's an active OTP session
    const existingSession = getOTPSession(formattedNumber)
    if (existingSession && !isOTPExpired(existingSession.expiresAt)) {
      const remainingTime = Math.ceil((existingSession.expiresAt - getCurrentTime()) / 1000)
      return {
        success: false,
        message: `Please wait ${remainingTime} seconds before requesting a new OTP`
      }
    }
    
    // Generate new OTP
    const otp = generateOTP()
    const sessionId = `otp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const expiresAt = getCurrentTime() + (OTP_CONFIG.EXPIRY_MINUTES * 60 * 1000)
    
    // Store OTP session
    const otpSession = {
      mobileNumber: formattedNumber,
      otp,
      sessionId,
      expiresAt,
      attempts: 0,
      createdAt: getCurrentTime()
    }
    
    saveOTPSession(otpSession)
    
    // In production, send SMS here
    console.log(`SMS OTP for ${formattedNumber}: ${otp}`)
    
    // For demo purposes, also store in localStorage for easy access
    localStorage.setItem('zobda_demo_otp', otp)
    localStorage.setItem('zobda_demo_mobile', formattedNumber)
    
    return {
      success: true,
      message: `OTP sent to ${formattedNumber}`,
      sessionId,
      expiresAt: new Date(expiresAt).toISOString()
    }
    
  } catch (error) {
    console.error('Error sending OTP:', error)
    return {
      success: false,
      message: 'Failed to send OTP. Please try again.'
    }
  }
}

// Verify OTP
export async function verifyOTP(verification: OTPVerification): Promise<OTPVerificationResponse> {
  try {
    const { mobileNumber, otp, sessionId } = verification
    const formattedNumber = formatMobileNumber(mobileNumber)
    
    // Get OTP session
    const otpSession = getOTPSession(formattedNumber)
    
    if (!otpSession) {
      return {
        success: false,
        message: 'OTP session not found. Please request a new OTP.'
      }
    }
    
    // Check if session matches
    if (otpSession.sessionId !== sessionId) {
      return {
        success: false,
        message: 'Invalid session. Please request a new OTP.'
      }
    }
    
    // Check if OTP is expired
    if (isOTPExpired(otpSession.expiresAt)) {
      return {
        success: false,
        message: 'OTP has expired. Please request a new OTP.'
      }
    }
    
    // Check attempts limit
    if (otpSession.attempts >= OTP_CONFIG.MAX_ATTEMPTS) {
      return {
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.'
      }
    }
    
    // Verify OTP
    if (otpSession.otp !== otp) {
      // Increment attempts
      otpSession.attempts++
      saveOTPSession(otpSession)
      
      return {
        success: false,
        message: `Invalid OTP. ${OTP_CONFIG.MAX_ATTEMPTS - otpSession.attempts} attempts remaining.`
      }
    }
    
    // OTP is valid - create user session
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const userSession = {
      userId,
      mobileNumber: formattedNumber,
      isVerified: true,
      createdAt: getCurrentTime(),
      lastLogin: getCurrentTime()
    }
    
    // Save user session
    saveUserSession(userSession)
    
    // Clear OTP session
    clearOTPSession(formattedNumber)
    
    return {
      success: true,
      message: 'Mobile number verified successfully!',
      token: `token_${userId}_${Date.now()}`,
      user: {
        id: userId,
        mobileNumber: formattedNumber,
        isVerified: true
      }
    }
    
  } catch (error) {
    console.error('Error verifying OTP:', error)
    return {
      success: false,
      message: 'Failed to verify OTP. Please try again.'
    }
  }
}

// Resend OTP
export async function resendOTP(mobileNumber: string): Promise<OTPResponse> {
  const formattedNumber = formatMobileNumber(mobileNumber)
  
  // Check cooldown period
  const existingSession = getOTPSession(formattedNumber)
  if (existingSession) {
    const timeSinceLastRequest = getCurrentTime() - existingSession.createdAt
    const cooldownRemaining = (OTP_CONFIG.RESEND_COOLDOWN_SECONDS * 1000) - timeSinceLastRequest
    
    if (cooldownRemaining > 0) {
      return {
        success: false,
        message: `Please wait ${Math.ceil(cooldownRemaining / 1000)} seconds before requesting a new OTP`
      }
    }
  }
  
  // Send new OTP
  return sendOTP({ mobileNumber: formattedNumber })
}

// Check if OTP is expired
function isOTPExpired(expiresAt: number): boolean {
  return getCurrentTime() > expiresAt
}

// Get OTP session
function getOTPSession(mobileNumber: string): any {
  try {
    const sessions = JSON.parse(localStorage.getItem(OTP_STORAGE_KEY) || '{}')
    return sessions[mobileNumber] || null
  } catch {
    return null
  }
}

// Save OTP session
function saveOTPSession(session: any): void {
  try {
    const sessions = JSON.parse(localStorage.getItem(OTP_STORAGE_KEY) || '{}')
    sessions[session.mobileNumber] = session
    localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(sessions))
  } catch (error) {
    console.error('Error saving OTP session:', error)
  }
}

// Clear OTP session
function clearOTPSession(mobileNumber: string): void {
  try {
    const sessions = JSON.parse(localStorage.getItem(OTP_STORAGE_KEY) || '{}')
    delete sessions[mobileNumber]
    localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(sessions))
  } catch (error) {
    console.error('Error clearing OTP session:', error)
  }
}

// Save user session
function saveUserSession(session: any): void {
  try {
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(session))
  } catch (error) {
    console.error('Error saving user session:', error)
  }
}

// Get current user session
export function getCurrentUserSession(): any {
  try {
    return JSON.parse(localStorage.getItem(USER_SESSION_KEY) || 'null')
  } catch {
    return null
  }
}

// Check if user is logged in
export function isUserLoggedIn(): boolean {
  const session = getCurrentUserSession()
  return session && session.isVerified && session.mobileNumber
}

// Logout user
export function logoutUser(): void {
  localStorage.removeItem(USER_SESSION_KEY)
  // Clear all OTP sessions
  localStorage.removeItem(OTP_STORAGE_KEY)
}

// Get remaining time for OTP expiry
export function getOTPRemainingTime(mobileNumber: string): number {
  const session = getOTPSession(formatMobileNumber(mobileNumber))
  if (!session) return 0
  
  const remaining = session.expiresAt - getCurrentTime()
  return Math.max(0, Math.ceil(remaining / 1000))
}

// Get remaining time for resend cooldown
export function getResendCooldownTime(mobileNumber: string): number {
  const session = getOTPSession(formatMobileNumber(mobileNumber))
  if (!session) return 0
  
  const timeSinceLastRequest = getCurrentTime() - session.createdAt
  const cooldownRemaining = (OTP_CONFIG.RESEND_COOLDOWN_SECONDS * 1000) - timeSinceLastRequest
  return Math.max(0, Math.ceil(cooldownRemaining / 1000))
}


