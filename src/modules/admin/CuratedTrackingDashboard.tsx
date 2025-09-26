import React, { useState, useEffect } from 'react'
import { CuratedTrackingService, CuratedProduct, TrackingData } from '../../services/curatedTrackingService'
import { enhancedProducts } from '../../data/enhancedProducts'
import { ProductCard } from '../products/ProductCard'
import { getSponsoredHighlighted, addSponsored, removeSponsored, MAX_SPONSORED_SLOTS } from '../../services/sponsoredState'
import { SponsoredProductManager } from './SponsoredProductManager'

export const CuratedTrackingDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tracking' | 'sponsored'>('tracking')
  const [curatedProducts, setCuratedProducts] = useState<CuratedProduct[]>([])
  const [availableProducts, setAvailableProducts] = useState<any[]>([])
  const [trackingStats, setTrackingStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<CuratedProduct | null>(null)
  const [sponsored, setSponsored] = useState<any[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const curated = CuratedTrackingService.getCuratedProducts()
    setCuratedProducts(curated)
    
    // Filter out products already in curated list
    const curatedIds = curated.map(p => p.id)
    const available = enhancedProducts.filter(p => !curatedIds.includes(p.id))
    setAvailableProducts(available)
    
    const stats = CuratedTrackingService.getTrackingStats()
    setTrackingStats(stats)
    setSponsored(getSponsoredHighlighted())
  }

  const handleAddToTracking = async (product: any) => {
    setIsLoading(true)
    try {
      CuratedTrackingService.addToTracking({
        id: product.id,
        title: product.title,
        asin: product.asin || '',
        productUrl: product.productUrl,
        imageUrl: product.imageUrl,
        currentPrice: product.price,
        category: product.category || 'General',
        priority: 'medium',
        notes: 'Added by admin'
      })
      
      // Collect initial price data
      await CuratedTrackingService.collectPriceData(product.id)
      
      loadData()
      
      // Show success message
      const successMessage = document.createElement('div')
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
      successMessage.textContent = `✅ ${product.title} added to tracking`
      document.body.appendChild(successMessage)
      setTimeout(() => successMessage.remove(), 3000)
    } catch (error) {
      console.error('Failed to add to tracking:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveFromTracking = (productId: string) => {
    CuratedTrackingService.removeFromTracking(productId)
    loadData()
    
    // Show success message
    const successMessage = document.createElement('div')
    successMessage.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
    successMessage.textContent = 'ℹ️ Product removed from tracking'
    document.body.appendChild(successMessage)
    setTimeout(() => successMessage.remove(), 3000)
  }

  const handleToggleTracking = (productId: string, isTracked: boolean) => {
    CuratedTrackingService.updateTrackingStatus(productId, isTracked)
    loadData()
  }

  const handleCollectData = async (productId: string) => {
    setIsLoading(true)
    try {
      await CuratedTrackingService.collectPriceData(productId)
      loadData()
      
      // Show success message
      const successMessage = document.createElement('div')
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
      successMessage.textContent = '📊 Price data collected successfully'
      document.body.appendChild(successMessage)
      setTimeout(() => successMessage.remove(), 3000)
    } catch (error) {
      console.error('Failed to collect data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // For sponsored products, show all products (not filtered by curated tracking)
  const allProducts = enhancedProducts
  const filteredAvailableProducts = allProducts.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.asin?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container-responsive py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-zobda-gray">Manage product tracking and sponsored content</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('tracking')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tracking'
                  ? 'border-zobda-orange text-zobda-orange'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Curated Tracking
            </button>
            <button
              onClick={() => setActiveTab('sponsored')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sponsored'
                  ? 'border-zobda-orange text-zobda-orange'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Sponsored Products
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'sponsored' ? (
        <SponsoredProductManager />
      ) : (
        <div>

      {/* Statistics */}
      {trackingStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-zobda-orange mb-1">{trackingStats.totalProducts}</div>
            <div className="text-sm text-zobda-gray font-medium">Total Products</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">{trackingStats.trackedProducts}</div>
            <div className="text-sm text-zobda-gray font-medium">Actively Tracked</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">{trackingStats.totalDataPoints}</div>
            <div className="text-sm text-zobda-gray font-medium">Data Points</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {new Date(trackingStats.lastUpdated).toLocaleDateString()}
            </div>
            <div className="text-sm text-zobda-gray font-medium">Last Updated</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tracked Products */}
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Tracked Products</h2>
                <p className="text-sm text-zobda-gray mt-1">Products with active price tracking</p>
              </div>
              <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                {curatedProducts.filter(p => p.isTracked).length} active
              </span>
            </div>
            
            {curatedProducts.filter(p => p.isTracked).length === 0 ? (
              <div className="text-center py-8 text-zobda-gray">
                <p>No products being tracked</p>
                <p className="text-sm">Add products below to start tracking</p>
              </div>
            ) : (
              <div className="space-y-3">
                {curatedProducts.filter(p => p.isTracked).map((product) => (
                  <div key={product.id} className="flex items-start gap-4 p-4 border border-zobda-border rounded-lg bg-white hover:shadow-sm transition-shadow">
                    <img 
                      src={product.imageUrl} 
                      alt={product.title}
                      className="w-16 h-16 object-contain bg-gray-50 rounded border border-zobda-border flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm leading-tight mb-2">{product.title}</h3>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3 text-sm text-zobda-gray">
                          <span className="font-semibold text-gray-900">${product.currentPrice.toFixed(2)}</span>
                          <span>•</span>
                          <span>{product.dataPoints} data points</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.priority === 'high' ? 'bg-red-100 text-red-700' :
                          product.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {product.priority}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCollectData(product.id)}
                          disabled={isLoading}
                          className="btn-outline text-xs px-3 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? 'Collecting...' : 'Collect Data'}
                        </button>
                        <button
                          onClick={() => handleToggleTracking(product.id, false)}
                          className="btn-outline text-red-600 border-red-200 hover:bg-red-50 text-xs px-3 py-1.5"
                        >
                          Stop Tracking
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Available Products */}
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Available Products</h2>
                <p className="text-sm text-zobda-gray mt-1">Add products to start tracking their prices</p>
              </div>
              <button
                onClick={() => setShowAddModal(!showAddModal)}
                className="btn-zobda px-4 py-2 text-sm"
              >
                {showAddModal ? 'Hide' : 'Add Products'}
              </button>
            </div>

            {showAddModal && (
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-zobda-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zobda-orange"
                />
              </div>
            )}

            {showAddModal && (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredAvailableProducts.length === 0 ? (
                  <div className="text-center py-4 text-zobda-gray">
                    <p>No available products found</p>
                    {searchTerm && <p className="text-sm">Try a different search term</p>}
                  </div>
                ) : (
                  filteredAvailableProducts.map((product) => (
                    <div key={product.id} className="flex items-start gap-4 p-4 border border-zobda-border rounded-lg bg-white hover:shadow-sm transition-shadow">
                      <img 
                        src={product.imageUrl} 
                        alt={product.title}
                        className="w-16 h-16 object-contain bg-gray-50 rounded border border-zobda-border flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 text-sm leading-tight mb-2">{product.title}</h3>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-zobda-gray font-semibold">${product.price.toFixed(2)}</p>
                          <button
                            onClick={() => handleAddToTracking(product)}
                            disabled={isLoading}
                            className="btn-zobda px-3 py-1.5 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isLoading ? 'Adding...' : 'Add to Tracking'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 card p-6 bg-blue-50 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">How Curated Tracking Works:</h3>
        <ul className="text-blue-800 space-y-1 text-sm">
          <li>• <strong>Tracked Products:</strong> These products have historical data visible to all users</li>
          <li>• <strong>Data Collection:</strong> Click "Collect Data" to gather price history</li>
          <li>• <strong>User Experience:</strong> Users see rich historical data for tracked products</li>
          <li>• <strong>Cost Control:</strong> Only collect data for products you choose to track</li>
          <li>• <strong>Priority Levels:</strong> High priority products get more frequent updates</li>
        </ul>
      </div>

      {/* Sponsored Highlighted Deals */}
      <div className="mt-8 card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Sponsored Highlighted Deals</h2>
          <span className="text-sm text-zobda-gray">{sponsored.length}/{MAX_SPONSORED_SLOTS} slots</span>
        </div>
        {sponsored.length === 0 ? (
          <p className="text-zobda-gray">No sponsored products yet. Add up to {MAX_SPONSORED_SLOTS} items.</p>
        ) : (
          <div className="flex gap-4 flex-wrap">
            {sponsored.map((p) => (
              <div key={p.id} className="relative">
                <ProductCard product={p} />
                <button
                  onClick={() => {
                    const updatedSponsored = removeSponsored(p.id)
                    setSponsored(updatedSponsored)
                    
                    // Show success message
                    const successMessage = document.createElement('div')
                    successMessage.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
                    successMessage.textContent = `ℹ️ ${p.title} removed from sponsored products`
                    document.body.appendChild(successMessage)
                    setTimeout(() => successMessage.remove(), 3000)
                  }}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 text-xs"
                  title="Remove from sponsorship"
                >×</button>
              </div>
            ))}
          </div>
        )}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Add Sponsored Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredAvailableProducts.map((product) => (
              <div key={product.id} className="relative">
                <ProductCard product={product} />
                <button
                  onClick={() => {
                    // Check if already sponsored
                    if (sponsored.some(p => p.id === product.id)) {
                      const warningMessage = document.createElement('div')
                      warningMessage.className = 'fixed top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
                      warningMessage.textContent = `⚠️ ${product.title} is already sponsored`
                      document.body.appendChild(warningMessage)
                      setTimeout(() => warningMessage.remove(), 3000)
                      return
                    }
                    
                    // Check if limit reached
                    if (sponsored.length >= MAX_SPONSORED_SLOTS) {
                      const warningMessage = document.createElement('div')
                      warningMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
                      warningMessage.textContent = `❌ Maximum ${MAX_SPONSORED_SLOTS} sponsored products allowed`
                      document.body.appendChild(warningMessage)
                      setTimeout(() => warningMessage.remove(), 3000)
                      return
                    }
                    
                    const updatedSponsored = addSponsored(product)
                    setSponsored(updatedSponsored)
                    
                    // Show success message
                    const successMessage = document.createElement('div')
                    successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
                    successMessage.textContent = `✅ ${product.title} added as sponsored product`
                    document.body.appendChild(successMessage)
                    setTimeout(() => successMessage.remove(), 3000)
                  }}
                  disabled={sponsored.length >= MAX_SPONSORED_SLOTS || sponsored.some(p => p.id === product.id)}
                  className={`absolute top-2 right-2 text-white rounded-full p-1 text-xs ${
                    sponsored.some(p => p.id === product.id) 
                      ? 'bg-gray-500 cursor-not-allowed' 
                      : sponsored.length >= MAX_SPONSORED_SLOTS 
                        ? 'bg-red-500 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700'
                  }`}
                  title={
                    sponsored.some(p => p.id === product.id) 
                      ? "Already sponsored" 
                      : sponsored.length >= MAX_SPONSORED_SLOTS 
                        ? "Maximum sponsored products reached" 
                        : "Sponsor this product"
                  }
                >{sponsored.some(p => p.id === product.id) ? '✓' : '+'}</button>
              </div>
            ))}
          </div>
        </div>
      </div>
        </div>
      )}
    </div>
  )
}
