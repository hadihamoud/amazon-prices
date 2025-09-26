// Curated tracking service for admin-selected products

export interface CuratedProduct {
  id: string
  title: string
  asin: string
  productUrl: string
  imageUrl: string
  currentPrice: number
  category: string
  isTracked: boolean
  lastUpdated: string
  dataPoints: number
  priority: 'high' | 'medium' | 'low'
  notes?: string
}

export interface TrackingData {
  productId: string
  priceHistory: PricePoint[]
  lastUpdated: string
  updateFrequency: 'daily' | 'weekly' | 'monthly'
  isActive: boolean
}

export interface PricePoint {
  date: string
  price: number
  source: 'amazon' | 'estimated'
  confidence: number
}

// Admin-curated tracking management
export class CuratedTrackingService {
  private static readonly TRACKED_PRODUCTS_KEY = 'zobda_tracked_products'
  private static readonly TRACKING_DATA_KEY = 'zobda_tracking_data'

  // Get all curated products (admin view)
  static getCuratedProducts(): CuratedProduct[] {
    try {
      const stored = localStorage.getItem(this.TRACKED_PRODUCTS_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  // Get tracked products (user view)
  static getTrackedProducts(): CuratedProduct[] {
    return this.getCuratedProducts().filter(p => p.isTracked)
  }

  // Add product to tracking list
  static addToTracking(product: Omit<CuratedProduct, 'isTracked' | 'lastUpdated' | 'dataPoints'>): void {
    const curatedProducts = this.getCuratedProducts()
    
    const curatedProduct: CuratedProduct = {
      ...product,
      isTracked: true,
      lastUpdated: new Date().toISOString(),
      dataPoints: 0
    }

    // Check if product already exists
    const existingIndex = curatedProducts.findIndex(p => p.id === product.id)
    if (existingIndex >= 0) {
      curatedProducts[existingIndex] = curatedProduct
    } else {
      curatedProducts.push(curatedProduct)
    }

    localStorage.setItem(this.TRACKED_PRODUCTS_KEY, JSON.stringify(curatedProducts))
  }

  // Remove product from tracking
  static removeFromTracking(productId: string): void {
    const curatedProducts = this.getCuratedProducts()
    const updatedProducts = curatedProducts.map(p => 
      p.id === productId ? { ...p, isTracked: false } : p
    )
    localStorage.setItem(this.TRACKED_PRODUCTS_KEY, JSON.stringify(updatedProducts))
  }

  // Update tracking status
  static updateTrackingStatus(productId: string, isTracked: boolean): void {
    const curatedProducts = this.getCuratedProducts()
    const updatedProducts = curatedProducts.map(p => 
      p.id === productId ? { ...p, isTracked } : p
    )
    localStorage.setItem(this.TRACKED_PRODUCTS_KEY, JSON.stringify(updatedProducts))
  }

  // Get tracking data for a product
  static getTrackingData(productId: string): TrackingData | null {
    try {
      const stored = localStorage.getItem(this.TRACKING_DATA_KEY)
      const data = stored ? JSON.parse(stored) : {}
      return data[productId] || null
    } catch {
      return null
    }
  }

  // Update tracking data
  static updateTrackingData(productId: string, data: TrackingData): void {
    try {
      const stored = localStorage.getItem(this.TRACKING_DATA_KEY)
      const allData = stored ? JSON.parse(stored) : {}
      allData[productId] = data
      localStorage.setItem(this.TRACKING_DATA_KEY, JSON.stringify(allData))
    } catch (error) {
      console.error('Failed to update tracking data:', error)
    }
  }

  // Check if product is actively tracked
  static isProductTracked(productId: string): boolean {
    const curatedProducts = this.getCuratedProducts()
    const product = curatedProducts.find(p => p.id === productId)
    return product?.isTracked || false
  }

  // Get historical data for tracked products
  static getHistoricalData(productId: string): PricePoint[] {
    const trackingData = this.getTrackingData(productId)
    return trackingData?.priceHistory || []
  }

  // Simulate price data collection for tracked products
  static async collectPriceData(productId: string): Promise<PricePoint[]> {
    // This would be replaced with actual Amazon API calls
    const basePrice = Math.random() * 100 + 50
    const data: PricePoint[] = []
    
    // Generate 90 days of historical data for tracked products
    for (let i = 89; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      // Simulate realistic price fluctuations
      const variation = (Math.random() - 0.5) * 15
      const price = Math.max(10, basePrice + variation)
      
      data.push({
        date: date.toISOString(),
        price: parseFloat(price.toFixed(2)),
        source: 'amazon',
        confidence: 0.95
      })
    }
    
    // Update tracking data
    const trackingData: TrackingData = {
      productId,
      priceHistory: data,
      lastUpdated: new Date().toISOString(),
      updateFrequency: 'daily',
      isActive: true
    }
    
    this.updateTrackingData(productId, trackingData)
    
    // Update curated product data points
    const curatedProducts = this.getCuratedProducts()
    const updatedProducts = curatedProducts.map(p => 
      p.id === productId 
        ? { ...p, dataPoints: data.length, lastUpdated: new Date().toISOString() }
        : p
    )
    localStorage.setItem(this.TRACKED_PRODUCTS_KEY, JSON.stringify(updatedProducts))
    
    return data
  }

  // Get tracking statistics
  static getTrackingStats(): {
    totalProducts: number
    trackedProducts: number
    totalDataPoints: number
    lastUpdated: string
  } {
    const curatedProducts = this.getCuratedProducts()
    const trackedProducts = curatedProducts.filter(p => p.isTracked)
    const totalDataPoints = trackedProducts.reduce((sum, p) => sum + p.dataPoints, 0)
    const lastUpdated = trackedProducts.length > 0 
      ? Math.max(...trackedProducts.map(p => new Date(p.lastUpdated).getTime()))
      : 0

    return {
      totalProducts: curatedProducts.length,
      trackedProducts: trackedProducts.length,
      totalDataPoints,
      lastUpdated: lastUpdated ? new Date(lastUpdated).toISOString() : 'Never'
    }
  }

  // Initialize with default tracked products (household essentials)
  static initializeDefaultTrackedProducts(): void {
    const defaultProducts: Omit<CuratedProduct, 'isTracked' | 'lastUpdated' | 'dataPoints'>[] = [
      {
        id: '1',
        title: 'Apple iPhone 15 Pro Max 256GB - Natural Titanium',
        asin: 'B0CHX1W1XY',
        productUrl: 'https://amazon.com/dp/B0CHX1W1XY',
        imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
        currentPrice: 1199.99,
        category: 'Electronics',
        priority: 'high',
        notes: 'Popular smartphone, high price volatility'
      },
      {
        id: '2',
        title: 'MacBook Pro 14-inch M3 Pro Chip 512GB SSD',
        asin: 'B0CHX1W1XZ',
        productUrl: 'https://amazon.com/dp/B0CHX1W1XZ',
        imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop',
        currentPrice: 1999.99,
        category: 'Electronics',
        priority: 'high',
        notes: 'Premium laptop, frequent price changes'
      },
      {
        id: '3',
        title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
        asin: 'B0CHX1W1XA',
        productUrl: 'https://amazon.com/dp/B0CHX1W1XA',
        imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop',
        currentPrice: 399.99,
        category: 'Electronics',
        priority: 'medium',
        notes: 'Popular headphones, seasonal discounts'
      }
    ]

    // Only initialize if no products exist
    if (this.getCuratedProducts().length === 0) {
      defaultProducts.forEach(product => {
        this.addToTracking(product)
      })
    }
  }
}
