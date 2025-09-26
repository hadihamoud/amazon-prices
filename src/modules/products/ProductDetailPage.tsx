import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { SmartPriceHistoryChart, PricePoint } from '../charts/SmartPriceHistoryChart'
import { Product } from './ProductCard'
import { PriceDataService, PriceDataRequest } from '../../services/priceDataService'

// Demo product data - using the same IDs as enhancedProducts
const demoProducts: Record<string, any> = {
  '1': {
    id: '1',
    title: 'Apple iPhone 15 Pro Max 256GB - Natural Titanium',
    price: 1199.99,
    currentPrice: 1299.99,
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
    productUrl: 'https://amazon.com/dp/B0CHX1W1XY',
    asin: 'B0CHX1W1XY',
    description: 'The most advanced iPhone with titanium design and A17 Pro chip for ultimate performance.',
    features: [
      'A17 Pro chip for ultimate performance',
      '48MP camera system with advanced computational photography',
      'Titanium design for durability and lightness',
      'USB-C connectivity',
      '5G connectivity for fast data speeds'
    ],
    specifications: {
      'Storage': '256GB',
      'Display': '6.7" Super Retina XDR',
      'Chip': 'A17 Pro',
      'Camera': '48MP Main, 12MP Ultra Wide, 12MP Telephoto',
      'Battery': 'Up to 29 hours video playback'
    }
  },
  '2': {
    id: '2',
    title: 'MacBook Pro 14-inch M3 Pro Chip 512GB SSD',
    price: 1999.99,
    currentPrice: 2199.99,
    imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop',
    productUrl: 'https://amazon.com/dp/B0CHX1W1XZ',
    asin: 'B0CHX1W1XZ',
    description: 'Powerful MacBook Pro with M3 Pro chip and stunning Liquid Retina XDR display.',
    features: [
      'M3 Pro chip for exceptional performance',
      '14-inch Liquid Retina XDR display',
      '512GB SSD storage',
      '18-hour battery life',
      'Advanced camera and audio system'
    ],
    specifications: {
      'Chip': 'M3 Pro',
      'Memory': '18GB unified memory',
      'Storage': '512GB SSD',
      'Display': '14.2" Liquid Retina XDR',
      'Battery': 'Up to 18 hours'
    }
  },
  '3': {
    id: '3',
    title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    price: 399.99,
    currentPrice: 449.99,
    imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop',
    productUrl: 'https://amazon.com/dp/B0CHX1W1XA',
    asin: 'B0CHX1W1XA',
    description: 'Premium noise-canceling headphones with exceptional sound quality and comfort.',
    features: [
      'Industry-leading noise canceling',
      '30-hour battery life',
      'Quick charge capability',
      'Comfortable fit for long listening',
      'Hi-Res Audio support'
    ],
    specifications: {
      'Battery': '30 hours playback',
      'Charging': '3-minute quick charge for 3 hours',
      'Connectivity': 'Bluetooth 5.2, NFC',
      'Weight': '250g',
      'Warranty': '1 year limited warranty'
    }
  },
  '4': {
    id: '4',
    title: 'Nike Air Max 270 Men\'s Running Shoes',
    price: 129.99,
    currentPrice: 149.99,
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
    productUrl: 'https://amazon.com/dp/B0CHX1W1XB',
    asin: 'B0CHX1W1XB',
    description: 'Comfortable running shoes with Air Max cushioning technology for all-day comfort.',
    features: [
      'Air Max cushioning technology',
      'Breathable upper material',
      'Durable rubber outsole',
      'Comfortable fit for all-day wear',
      'Lightweight design'
    ],
    specifications: {
      'Upper': 'Mesh and synthetic',
      'Midsole': 'Air Max unit',
      'Outsole': 'Rubber',
      'Weight': '12.3 oz',
      'Sizes': '7-15 US Men\'s'
    }
  },
  '5': {
    id: '5',
    title: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker',
    price: 89.99,
    currentPrice: 99.99,
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
    productUrl: 'https://amazon.com/dp/B0CHX1W1XC',
    asin: 'B0CHX1W1XC',
    description: 'Versatile electric pressure cooker for quick and easy meals with multiple cooking functions.',
    features: [
      '7-in-1 functionality (pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and warmer)',
      'Pressure cooking for fast meals',
      'Slow cooking for tender results',
      'Easy cleanup with stainless steel cooking pot',
      'Safety features and easy-to-use controls'
    ],
    specifications: {
      'Capacity': '6 quarts',
      'Power': '1000 watts',
      'Material': 'Stainless steel',
      'Dimensions': '12.4" x 11.4" x 12.2"',
      'Warranty': '1 year limited warranty'
    }
  }
}

function generateDemoHistory(days: number, currentPrice: number, originalPrice?: number): PricePoint[] {
  const history: PricePoint[] = []
  
  // Start from original price if available, otherwise use current price
  const startPrice = originalPrice || currentPrice
  let current = startPrice
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    // Create realistic price fluctuations around the current price
    // Prices should generally trend toward the current price over time
    const daysFromStart = days - i
    const progress = daysFromStart / days
    
    // Base price that trends from original to current
    const targetPrice = originalPrice ? 
      originalPrice - (originalPrice - currentPrice) * progress : 
      currentPrice
    
    // Add realistic variation (±10% of target price)
    const variation = (Math.random() - 0.5) * (targetPrice * 0.1)
    current = Math.max(targetPrice * 0.7, targetPrice + variation) // Don't go below 70% of target
    
    // Ensure the last data point (today) is exactly the current price
    if (i === 0) {
      current = currentPrice
    }
    
    history.push({ date, price: parseFloat(current.toFixed(2)) })
  }
  
  return history
}

function generatePredictedPrices(history: PricePoint[], days: number = 30): PricePoint[] {
  const predicted: PricePoint[] = []
  const recentPrices = history.slice(-7) // Use last 7 days for trend
  const avgChange = recentPrices.reduce((sum, p, i) => {
    if (i === 0) return sum
    return sum + (p.price - recentPrices[i - 1].price)
  }, 0) / (recentPrices.length - 1)
  
  let currentPrice = history[history.length - 1].price
  
  for (let i = 1; i <= days; i++) {
    const date = new Date()
    date.setDate(date.getDate() + i)
    
    // Add trend with some randomness
    const trend = avgChange * 0.3 // Reduce trend strength for predictions
    const randomFactor = (Math.random() - 0.5) * 2
    currentPrice = Math.max(5, currentPrice + trend + randomFactor)
    
    predicted.push({ date, price: parseFloat(currentPrice.toFixed(2)) })
  }
  
  return predicted
}

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [showPredictions, setShowPredictions] = useState(false)
  const [alertPrice, setAlertPrice] = useState('')
  const [isWatched, setIsWatched] = useState(false)
  const [isAddingToWatchlist, setIsAddingToWatchlist] = useState(false)
  const [hasHistoricalData, setHasHistoricalData] = useState(false)
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([])
  const [isDataLoading, setIsDataLoading] = useState(false)
  
  // Try demo products first; fall back to the last product clicked (e.g., from Highlighted Deals)
  const product = id && demoProducts[id] ? demoProducts[id] : (() => {
    try {
      const stored = localStorage.getItem('zobda_last_product')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })()

  useEffect(() => {
    // Check if product is in watchlist
    const watchlist = JSON.parse(localStorage.getItem('zobda_watchlist') || '[]')
    setIsWatched(watchlist.some((p: Product) => p.id === product?.id))
    
    // Check for historical data
    if (product?.id) {
      const hasData = PriceDataService.hasRecentData(product.id)
      setHasHistoricalData(hasData)
      
      if (hasData) {
        const cachedData = PriceDataService.getCachedData(product.id)
        if (cachedData) {
          setPriceHistory(cachedData)
        }
      }
    }
  }, [product?.id])

  if (!product) {
    return (
      <div className="container-responsive py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-zobda-gray mb-6">The product you're looking for doesn't exist.</p>
          <Link to="/" className="btn-zobda">Back to Home</Link>
        </div>
      </div>
    )
  }

  // Generate demo data only if no historical data
  const demoHistory = generateDemoHistory(90, product.price, product.currentPrice)
  const effectiveHistoryData = hasHistoricalData ? priceHistory : demoHistory
  // Normalize the last datapoint to ALWAYS equal the current product price
  const normalizedHistory: PricePoint[] = (() => {
    if (!effectiveHistoryData || effectiveHistoryData.length === 0) return []
    const cloned = [...effectiveHistoryData]
    const last = cloned[cloned.length - 1]
    cloned[cloned.length - 1] = {
      date: new Date(),
      price: product.price
    }
    return cloned
  })()
  const predictedPrices = generatePredictedPrices(normalizedHistory, 30)
  const combinedData = showPredictions ? [...normalizedHistory, ...predictedPrices] : normalizedHistory
  
  // Price statistics: when we don't have historical data, keep stats simple and consistent
  let minPrice = product.price
  let maxPrice = product.currentPrice ? Math.max(product.price, product.currentPrice) : product.price
  let avgPrice = product.price

  if (hasHistoricalData && normalizedHistory.length > 0) {
    const allPrices = [
      product.price,
      ...(product.currentPrice ? [product.currentPrice] : []),
      ...normalizedHistory.map(p => p.price)
    ]
    minPrice = Math.min(...allPrices)
    maxPrice = Math.max(...allPrices)
    avgPrice = normalizedHistory.reduce((sum, p) => sum + p.price, 0) / normalizedHistory.length
  }

  const handleAddToWatchlist = async () => {
    if (isAddingToWatchlist) return
    
    setIsAddingToWatchlist(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Add to local storage
      const watchlist = JSON.parse(localStorage.getItem('zobda_watchlist') || '[]')
      const productToAdd: Product = {
        id: product.id,
        title: product.title,
        price: product.price,
        currentPrice: product.currentPrice,
        imageUrl: product.imageUrl,
        productUrl: product.productUrl,
        asin: product.asin
      }
      
      if (!watchlist.some((p: Product) => p.id === product.id)) {
        watchlist.push(productToAdd)
        localStorage.setItem('zobda_watchlist', JSON.stringify(watchlist))
        setIsWatched(true)
        
        // Show success message
        const successMessage = document.createElement('div')
        successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
        successMessage.textContent = `✅ ${product.title} added to watchlist!`
        document.body.appendChild(successMessage)
        setTimeout(() => successMessage.remove(), 3000)
      }
    } catch (error) {
      console.error('Failed to add to watchlist:', error)
    } finally {
      setIsAddingToWatchlist(false)
    }
  }

  const handleRemoveFromWatchlist = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Remove from local storage
      const watchlist = JSON.parse(localStorage.getItem('zobda_watchlist') || '[]')
      const updatedWatchlist = watchlist.filter((p: Product) => p.id !== product.id)
      localStorage.setItem('zobda_watchlist', JSON.stringify(updatedWatchlist))
      setIsWatched(false)
      
      // Show success message
      const successMessage = document.createElement('div')
      successMessage.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
      successMessage.textContent = `ℹ️ ${product.title} removed from watchlist`
      document.body.appendChild(successMessage)
      setTimeout(() => successMessage.remove(), 3000)
    } catch (error) {
      console.error('Failed to remove from watchlist:', error)
    }
  }

  const handleCreateAlert = () => {
    if (!alertPrice || isNaN(Number(alertPrice))) return
    
    // Show success message
    const successMessage = document.createElement('div')
    successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
    successMessage.textContent = `🔔 Price alert set at $${alertPrice}`
    document.body.appendChild(successMessage)
    setTimeout(() => successMessage.remove(), 3000)
    
    setAlertPrice('')
  }

  const handleRequestData = async () => {
    if (!product) return
    
    setIsDataLoading(true)
    
    try {
      const request: PriceDataRequest = {
        productId: product.id,
        asin: product.asin || '',
        productUrl: product.productUrl
      }
      
      const response = await PriceDataService.requestPriceData(request)
      
      if (response.success && response.data) {
        setPriceHistory(response.data)
        setHasHistoricalData(true)
        
        // Show success message
        const successMessage = document.createElement('div')
        successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
        successMessage.textContent = `📊 Price data collected! ${response.data.length} data points`
        document.body.appendChild(successMessage)
        setTimeout(() => successMessage.remove(), 3000)
      } else {
        // Show error message
        const errorMessage = document.createElement('div')
        errorMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
        errorMessage.textContent = `❌ ${response.message}`
        document.body.appendChild(errorMessage)
        setTimeout(() => errorMessage.remove(), 3000)
      }
    } catch (error) {
      console.error('Failed to request data:', error)
    } finally {
      setIsDataLoading(false)
    }
  }

  return (
    <div className="container-responsive py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-zobda-gray mb-6">
        <Link to="/" className="hover:text-zobda-blue">Home</Link>
        <span>›</span>
        <span>Product Details</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Header */}
          <div className="card p-6">
            <div className="flex gap-6">
              {/* Clickable Product Info Section */}
              <a 
                href={product.productUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex gap-6 flex-1 hover:opacity-95 transition-opacity cursor-pointer"
              >
                <img 
                  src={product.imageUrl} 
                  alt={product.title} 
                  className="h-48 w-48 object-contain bg-white rounded border border-zobda-border flex-shrink-0" 
                />
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4 hover:text-zobda-orange transition-colors">{product.title}</h1>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="price-text text-3xl">${product.price.toFixed(2)}</div>
                    {product.currentPrice && product.currentPrice !== product.price && (
                      <div className="text-lg text-zobda-gray line-through">${product.currentPrice.toFixed(2)}</div>
                    )}
                    {product.currentPrice && product.currentPrice !== product.price && (
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                        Save ${((product.currentPrice || 0) - product.price).toFixed(2)}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 mb-4">
                    <div className="btn-amazon-yellow pointer-events-none">
                      View at Amazon
                    </div>
                    {isWatched ? (
                      <button 
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleRemoveFromWatchlist()
                        }}
                        className="btn-outline bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                      >
                        ✓ In Watchlist
                      </button>
                    ) : (
                      <button 
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleAddToWatchlist()
                        }}
                        disabled={isAddingToWatchlist}
                        className="btn-outline"
                      >
                        {isAddingToWatchlist ? 'Adding...' : '+ Add Amazon Price Watch'}
                      </button>
                    )}
                  </div>
                  <div className="text-sm text-zobda-gray">
                    ASIN: {product.asin}
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Smart Price History Chart */}
          <SmartPriceHistoryChart 
            data={normalizedHistory}
            currentPrice={product.price}
            originalPrice={product.currentPrice}
            productId={product.id}
            hasHistoricalData={hasHistoricalData}
            onRequestData={handleRequestData}
            isDataLoading={isDataLoading}
          />

          {/* Product Description */}
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Description</h3>
            <p className="text-zobda-gray leading-relaxed">{product.description || ''}</p>
          </div>

          {/* Features */}
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h3>
            <ul className="space-y-2">
              {(product.features || []).map((feature: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-camel-orange mt-1">•</span>
                  <span className="text-zobda-gray">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Specifications */}
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specifications || {}).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-zobda-border">
                  <span className="font-medium text-gray-900">{key}</span>
                  <span className="text-zobda-gray">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Stats */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-zobda-gray">Current Price</span>
                <span className="font-semibold">${product.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zobda-gray">Lowest Price</span>
                <span className="font-semibold text-green-600">${minPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zobda-gray">Highest Price</span>
                <span className="font-semibold text-red-600">${maxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zobda-gray">Average Price</span>
                <span className="font-semibold">${avgPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Price Alert */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Set Price Alert</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="Alert price" 
                  value={alertPrice}
                  onChange={(e) => setAlertPrice(e.target.value)}
                  className="flex-1 border border-zobda-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zobda-orange"
                />
                <button 
                  onClick={handleCreateAlert}
                  disabled={!alertPrice || isNaN(Number(alertPrice))}
                  className="btn-zobda px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Set Alert
                </button>
              </div>
              <div className="text-xs text-zobda-gray space-y-1">
                <p>Get notified when the price drops below your target</p>
                <p>Current price: <span className="font-semibold">${product.price.toFixed(2)}</span></p>
                <p>Average price: <span className="font-semibold">${avgPrice.toFixed(2)}</span></p>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Products</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <img src="https://via.placeholder.com/60x60" alt="Related" className="w-15 h-15 object-cover rounded" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 line-clamp-2">Echo Dot (3rd Gen)</div>
                  <div className="text-zobda-orange font-semibold">$39.99</div>
                </div>
              </div>
              <div className="flex gap-3">
                <img src="https://via.placeholder.com/60x60" alt="Related" className="w-15 h-15 object-cover rounded" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 line-clamp-2">Echo Show 5</div>
                  <div className="text-zobda-orange font-semibold">$79.99</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
