// Highlighted Deals Algorithm - Based on camelcamelcamel.com approach

export interface PriceHistory {
  price: number
  date: string
  source: 'amazon' | 'tracked'
}

export interface ProductData {
  id: string
  asin: string
  title: string
  currentPrice: number
  priceHistory: PriceHistory[]
  averagePrice: number
  lowestPrice: number
  highestPrice: number
  reviewCount: number
  rating: number
  category: string
  lastUpdated: string
}

export interface DealCriteria {
  minPriceDropPercent: number // e.g., 20% = 0.2
  maxDaysFromLowest: number // e.g., 5% = 0.05
  minReviewCount: number
  minPriceHistoryDays: number
  categoryWeights: Record<string, number>
  freshnessHours: number
}

export interface HighlightedDeal {
  product: ProductData
  dealScore: number
  priceDropPercent: number
  savingsAmount: number
  dealType: 'price_drop' | 'near_lowest' | 'category_hot'
  isExpired: boolean
  expiresAt: string
}

// Default deal criteria (can be adjusted)
const DEFAULT_CRITERIA: DealCriteria = {
  minPriceDropPercent: 0.2, // 20% drop from average
  maxDaysFromLowest: 0.1, // Within 10% of lowest price
  minReviewCount: 50,
  minPriceHistoryDays: 30,
  categoryWeights: {
    'Electronics': 1.2,
    'Appliances': 1.1,
    'Home & Kitchen': 1.0,
    'Health & Personal Care': 0.9,
    'Sports & Outdoors': 0.8,
    'Books': 0.7,
    'Toys & Games': 0.8,
    'Clothing': 0.9,
    'Automotive': 0.8,
    'Office Products': 0.7
  },
  freshnessHours: 24 // Deals expire after 24 hours
}

/**
 * Calculate average price from historical data
 */
export function calculateAveragePrice(priceHistory: PriceHistory[], days: number = 90): number {
  if (priceHistory.length === 0) return 0
  
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)
  
  const recentPrices = priceHistory
    .filter(entry => new Date(entry.date) >= cutoffDate)
    .map(entry => entry.price)
  
  if (recentPrices.length === 0) return priceHistory[0].price
  
  return recentPrices.reduce((sum, price) => sum + price, 0) / recentPrices.length
}

/**
 * Calculate lowest price from historical data
 */
export function calculateLowestPrice(priceHistory: PriceHistory[]): number {
  if (priceHistory.length === 0) return 0
  return Math.min(...priceHistory.map(entry => entry.price))
}

/**
 * Calculate highest price from historical data
 */
export function calculateHighestPrice(priceHistory: PriceHistory[]): number {
  if (priceHistory.length === 0) return 0
  return Math.max(...priceHistory.map(entry => entry.price))
}

/**
 * Check if a product qualifies as a highlighted deal
 */
export function isHighlightedDeal(
  product: ProductData, 
  criteria: DealCriteria = DEFAULT_CRITERIA
): HighlightedDeal | null {
  const { currentPrice, averagePrice, lowestPrice, priceHistory, reviewCount, category } = product
  
  // Basic validation
  if (priceHistory.length < 7) return null // Need at least a week of data
  if (reviewCount < criteria.minReviewCount) return null
  if (currentPrice <= 0 || averagePrice <= 0) return null
  
  // Calculate price drop percentage
  const priceDropPercent = (averagePrice - currentPrice) / averagePrice
  const savingsAmount = averagePrice - currentPrice
  
  // Check if deal is expired (price has risen)
  const isExpired = currentPrice > averagePrice * (1 - criteria.minPriceDropPercent * 0.5)
  
  // Calculate deal score (0-100)
  let dealScore = 0
  let dealType: 'price_drop' | 'near_lowest' | 'category_hot' = 'price_drop'
  
  // Condition 1: Significant price drop vs average
  if (priceDropPercent >= criteria.minPriceDropPercent) {
    dealScore += Math.min(priceDropPercent * 100, 50) // Max 50 points for price drop
    dealType = 'price_drop'
  }
  
  // Condition 2: Close to historical lowest price
  const lowestPriceThreshold = lowestPrice * (1 + criteria.maxDaysFromLowest)
  if (currentPrice <= lowestPriceThreshold) {
    const lowestProximity = (lowestPriceThreshold - currentPrice) / lowestPriceThreshold
    dealScore += Math.min(lowestProximity * 100, 30) // Max 30 points for near lowest
    if (dealType === 'price_drop') dealType = 'near_lowest'
  }
  
  // Condition 3: Category weighting
  const categoryWeight = criteria.categoryWeights[category] || 1.0
  dealScore *= categoryWeight
  
  // Condition 4: Popularity boost (more reviews = higher score)
  const popularityBoost = Math.min(Math.log10(reviewCount) * 5, 20) // Max 20 points
  dealScore += popularityBoost
  
  // Condition 5: Freshness (recent price drops get higher scores)
  const lastPriceChange = getLastPriceChange(priceHistory)
  const freshnessBoost = Math.max(0, 10 - (lastPriceChange / 24)) // Decay over 10 days
  dealScore += freshnessBoost
  
  // Minimum score threshold
  if (dealScore < 30) return null
  
  // Calculate expiration time
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + criteria.freshnessHours)
  
  return {
    product,
    dealScore: Math.round(dealScore),
    priceDropPercent: Math.round(priceDropPercent * 100) / 100,
    savingsAmount: Math.round(savingsAmount * 100) / 100,
    dealType,
    isExpired,
    expiresAt: expiresAt.toISOString()
  }
}

/**
 * Get the number of hours since the last significant price change
 */
function getLastPriceChange(priceHistory: PriceHistory[]): number {
  if (priceHistory.length < 2) return 0
  
  // Sort by date descending
  const sortedHistory = [...priceHistory].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  
  // Find the last significant price change (> 5%)
  for (let i = 1; i < sortedHistory.length; i++) {
    const current = sortedHistory[i - 1]
    const previous = sortedHistory[i]
    const changePercent = Math.abs(current.price - previous.price) / previous.price
    
    if (changePercent > 0.05) {
      const hoursDiff = (new Date().getTime() - new Date(current.date).getTime()) / (1000 * 60 * 60)
      return hoursDiff
    }
  }
  
  return 0
}

/**
 * Process a list of products and return highlighted deals
 */
export function processHighlightedDeals(
  products: ProductData[],
  criteria: DealCriteria = DEFAULT_CRITERIA
): HighlightedDeal[] {
  const deals: HighlightedDeal[] = []
  
  for (const product of products) {
    // Calculate missing price data
    const productWithCalculations: ProductData = {
      ...product,
      averagePrice: calculateAveragePrice(product.priceHistory),
      lowestPrice: calculateLowestPrice(product.priceHistory),
      highestPrice: calculateHighestPrice(product.priceHistory)
    }
    
    const deal = isHighlightedDeal(productWithCalculations, criteria)
    if (deal && !deal.isExpired) {
      deals.push(deal)
    }
  }
  
  // Sort by deal score (highest first)
  return deals.sort((a, b) => b.dealScore - a.dealScore)
}

/**
 * Filter deals by category
 */
export function filterDealsByCategory(deals: HighlightedDeal[], category: string): HighlightedDeal[] {
  return deals.filter(deal => deal.product.category === category)
}

/**
 * Get deal statistics
 */
export function getDealStatistics(deals: HighlightedDeal[]) {
  if (deals.length === 0) {
    return {
      totalDeals: 0,
      averageSavings: 0,
      averageDiscount: 0,
      topCategory: '',
      totalSavings: 0
    }
  }
  
  const totalSavings = deals.reduce((sum, deal) => sum + deal.savingsAmount, 0)
  const averageSavings = totalSavings / deals.length
  const averageDiscount = deals.reduce((sum, deal) => sum + deal.priceDropPercent, 0) / deals.length
  
  // Find top category
  const categoryCounts: Record<string, number> = {}
  deals.forEach(deal => {
    categoryCounts[deal.product.category] = (categoryCounts[deal.product.category] || 0) + 1
  })
  
  const topCategory = Object.entries(categoryCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || ''
  
  return {
    totalDeals: deals.length,
    averageSavings: Math.round(averageSavings * 100) / 100,
    averageDiscount: Math.round(averageDiscount * 100) / 100,
    topCategory,
    totalSavings: Math.round(totalSavings * 100) / 100
  }
}

/**
 * Generate deal badge text
 * Color coding: Green = High discount (30%+), Orange = Medium discount (20-29%)
 * Green shows "Good Deal", Orange shows "Near Lowest Price"
 */
export function getDealBadgeText(deal: HighlightedDeal): string {
  const { priceDropPercent, dealType } = deal
  
  // Green badges (30%+ discount) show "Good Deal"
  if (priceDropPercent >= 0.3) {
    return 'Good Deal'
  }
  
  // Orange badges (20-29% discount) show "Near Lowest Price"
  if (dealType === 'near_lowest') {
    return 'Near Lowest Price'
  }
  
  return 'Good Deal'
}

/**
 * Check if deal is expiring soon (within 6 hours)
 */
export function isDealExpiringSoon(deal: HighlightedDeal): boolean {
  const now = new Date()
  const expiresAt = new Date(deal.expiresAt)
  const hoursUntilExpiry = (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60)
  
  return hoursUntilExpiry <= 6 && hoursUntilExpiry > 0
}
