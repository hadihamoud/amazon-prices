// Price data collection service for on-demand tracking

export interface PriceDataRequest {
  productId: string
  asin: string
  productUrl: string
  userId?: string
}

export interface PriceDataResponse {
  success: boolean
  data?: PricePoint[]
  message: string
  cost?: number
}

export interface PricePoint {
  date: string
  price: number
  source: 'amazon' | 'estimated'
}

// Simulate API calls for price data collection
export class PriceDataService {
  private static readonly CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours
  private static readonly CACHE_KEY = 'zobda_price_data_cache'

  // Check if we have recent data for a product
  static hasRecentData(productId: string): boolean {
    try {
      const cache = JSON.parse(localStorage.getItem(this.CACHE_KEY) || '{}')
      const productData = cache[productId]
      
      if (!productData) return false
      
      const lastUpdate = new Date(productData.lastUpdate)
      const now = new Date()
      const timeDiff = now.getTime() - lastUpdate.getTime()
      
      return timeDiff < this.CACHE_DURATION
    } catch {
      return false
    }
  }

  // Get cached price data
  static getCachedData(productId: string): PricePoint[] | null {
    try {
      const cache = JSON.parse(localStorage.getItem(this.CACHE_KEY) || '{}')
      return cache[productId]?.data || null
    } catch {
      return null
    }
  }

  // Request price data collection
  static async requestPriceData(request: PriceDataRequest): Promise<PriceDataResponse> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Check if we already have recent data
      if (this.hasRecentData(request.productId)) {
        const cachedData = this.getCachedData(request.productId)
        return {
          success: true,
          data: cachedData || [],
          message: 'Using cached data (collected within last 24 hours)',
          cost: 0
        }
      }

      // Simulate price data collection
      const priceData = await this.collectPriceData(request)
      
      // Cache the data
      this.cacheData(request.productId, priceData)

      return {
        success: true,
        data: priceData,
        message: 'Price data collected successfully',
        cost: 0.01 // Simulate minimal cost
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to collect price data. Please try again.',
        cost: 0
      }
    }
  }

  // Simulate price data collection from Amazon
  private static async collectPriceData(request: PriceDataRequest): Promise<PricePoint[]> {
    // This would be replaced with actual Amazon API calls
    const basePrice = Math.random() * 100 + 50 // Random base price
    const data: PricePoint[] = []
    
    // Generate 30 days of historical data
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      // Simulate price fluctuations
      const variation = (Math.random() - 0.5) * 20
      const price = Math.max(10, basePrice + variation)
      
      data.push({
        date: date.toISOString(),
        price: parseFloat(price.toFixed(2)),
        source: 'amazon'
      })
    }
    
    return data
  }

  // Cache price data
  private static cacheData(productId: string, data: PricePoint[]): void {
    try {
      const cache = JSON.parse(localStorage.getItem(this.CACHE_KEY) || '{}')
      cache[productId] = {
        data,
        lastUpdate: new Date().toISOString()
      }
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cache))
    } catch (error) {
      console.error('Failed to cache price data:', error)
    }
  }

  // Get data collection cost estimate
  static getCostEstimate(productId: string): number {
    if (this.hasRecentData(productId)) {
      return 0 // Free if we have recent data
    }
    return 0.01 // Minimal cost for new data collection
  }

  // Check if user has reached data collection limit
  static checkUserLimit(userId?: string): { canCollect: boolean; remaining: number } {
    // Simulate user limits
    const dailyLimit = 10
    const usedToday = this.getTodayUsage(userId)
    
    return {
      canCollect: usedToday < dailyLimit,
      remaining: Math.max(0, dailyLimit - usedToday)
    }
  }

  // Get today's usage count
  private static getTodayUsage(userId?: string): number {
    try {
      const usageKey = `zobda_data_usage_${userId || 'anonymous'}_${new Date().toDateString()}`
      return parseInt(localStorage.getItem(usageKey) || '0')
    } catch {
      return 0
    }
  }

  // Increment usage count
  static incrementUsage(userId?: string): void {
    try {
      const usageKey = `zobda_data_usage_${userId || 'anonymous'}_${new Date().toDateString()}`
      const current = this.getTodayUsage(userId)
      localStorage.setItem(usageKey, (current + 1).toString())
    } catch (error) {
      console.error('Failed to increment usage:', error)
    }
  }
}
