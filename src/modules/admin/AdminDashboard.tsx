import React, { useState, useEffect } from 'react'
import { Product } from '../products/ProductCard'
import { useNavigate } from 'react-router-dom'
import { getSponsoredHighlighted, addSponsored, removeSponsored, MAX_SPONSORED_SLOTS } from '../../services/sponsoredState'
import { 
  getDefaultProducts, 
  setDefaultProducts, 
  addToDefaultProducts, 
  removeFromDefaultProducts,
  isInDefaultProducts 
} from '../../services/defaultProducts'
import { enhancedProducts } from '../../data/enhancedProducts'
import { 
  getAdminTrackedProducts, 
  addAdminTrackedProduct, 
  removeAdminTrackedProduct,
  getAllUserWatchlists,
  AdminTrackedProduct,
  UserWatchlist,
  syncTrackedProductsToCurrentUser
} from '../../services/userWatchlistService'
import { getUserId } from '../../services/watchlistApi'

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate()
  const [defaultProducts, setDefaultProductsState] = useState<Product[]>([])
  const [availableProducts, setAvailableProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [trackedProducts, setTrackedProducts] = useState<AdminTrackedProduct[]>([])
  const [userWatchlists, setUserWatchlists] = useState<UserWatchlist[]>([])
  const [activeTab, setActiveTab] = useState<'default' | 'tracked' | 'users'>('default')
  const [sponsored, setSponsored] = useState<Product[]>([])

  useEffect(() => {
    loadDefaultProducts()
    loadAvailableProducts()
    setSponsored(getSponsoredHighlighted())
    loadTrackedProducts()
    loadUserWatchlists()
  }, [])

  const loadDefaultProducts = () => {
    const products = getDefaultProducts()
    setDefaultProductsState(products)
  }

  const loadAvailableProducts = () => {
    // Filter out products that are already in default list
    const defaultIds = getDefaultProducts().map(p => p.id)
    const available = enhancedProducts.filter(p => !defaultIds.includes(p.id))
    setAvailableProducts(available)
  }

  const loadTrackedProducts = () => {
    const products = getAdminTrackedProducts()
    setTrackedProducts(products)
  }

  const loadUserWatchlists = () => {
    const watchlists = getAllUserWatchlists()
    setUserWatchlists(watchlists)
  }

  const handleSyncDefaultsToWatchlist = () => {
    try {
      const defaults = getDefaultProducts()
      localStorage.setItem('zobda_watchlist', JSON.stringify(defaults))
      const m = document.createElement('div')
      m.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow z-50'
      m.textContent = 'Defaults synced to watchlist for this browser.'
      document.body.appendChild(m)
      setTimeout(() => m.remove(), 2000)
    } catch {}
  }

  const handleAddToTracked = (product: Product) => {
    const trackedProduct: AdminTrackedProduct = {
      id: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
      productUrl: product.productUrl,
      asin: product.asin || product.id,
      currentPrice: product.currentPrice,
      addedAt: new Date().toISOString(),
      addedBy: 'admin'
    }
    
    addAdminTrackedProduct(trackedProduct)
    loadTrackedProducts()
    
    const m = document.createElement('div')
    m.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow z-50'
    m.textContent = 'Product added to tracked list. New users will see this product.'
    document.body.appendChild(m)
    setTimeout(() => m.remove(), 3000)
  }

  const handleRemoveFromTracked = (productId: string) => {
    removeAdminTrackedProduct(productId)
    loadTrackedProducts()
    
    const m = document.createElement('div')
    m.className = 'fixed top-4 right-4 bg-orange-600 text-white px-4 py-2 rounded shadow z-50'
    m.textContent = 'Product removed from tracked list.'
    document.body.appendChild(m)
    setTimeout(() => m.remove(), 2000)
  }

  const handleSyncTrackedToCurrentUser = () => {
    try {
      const userId = getUserId()
      const syncedProducts = syncTrackedProductsToCurrentUser(userId)
      
      // Also update localStorage for immediate UI update
      localStorage.setItem('zobda_watchlist', JSON.stringify(syncedProducts))
      
      const m = document.createElement('div')
      m.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow z-50'
      m.textContent = `✅ Synced ${syncedProducts.length} tracked products to your watchlist!`
      document.body.appendChild(m)
      setTimeout(() => m.remove(), 3000)
      
      // Reload user watchlists to show the update
      loadUserWatchlists()
    } catch (error) {
      const m = document.createElement('div')
      m.className = 'fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow z-50'
      m.textContent = 'Failed to sync tracked products.'
      document.body.appendChild(m)
      setTimeout(() => m.remove(), 2000)
    }
  }

  const handleAddToDefault = (product: Product) => {
    setIsLoading(true)
    try {
      addToDefaultProducts(product)
      loadDefaultProducts()
      loadAvailableProducts()
      
      // Show success message
      const successMessage = document.createElement('div')
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
      successMessage.textContent = `✅ ${product.title} added to default products`
      document.body.appendChild(successMessage)
      setTimeout(() => successMessage.remove(), 3000)
    } catch (error) {
      console.error('Error adding to default products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveFromDefault = (productId: string) => {
    setIsLoading(true)
    try {
      removeFromDefaultProducts(productId)
      loadDefaultProducts()
      loadAvailableProducts()
      
      // Show success message
      const successMessage = document.createElement('div')
      successMessage.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
      successMessage.textContent = 'ℹ️ Product removed from default list'
      document.body.appendChild(successMessage)
      setTimeout(() => successMessage.remove(), 3000)
    } catch (error) {
      console.error('Error removing from default products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredAvailableProducts = availableProducts.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.asin?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container-responsive py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-zobda-gray">Manage defaults, tracked products, and user watchlists</p>
        <div className="mt-4 flex gap-2">
          <button onClick={() => navigate('/admin/tracking')} className="btn-zobda">Open Sponsored Deals Manager</button>
          <button onClick={handleSyncDefaultsToWatchlist} className="btn-outline">Sync Defaults to Your Watchlist</button>
          <button onClick={handleSyncTrackedToCurrentUser} className="btn-outline bg-green-600 text-white hover:bg-green-700">
            Sync Tracked Products to Your Watchlist
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('default')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'default'
                  ? 'border-zobda-orange text-zobda-orange'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Default Products
            </button>
            <button
              onClick={() => setActiveTab('tracked')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tracked'
                  ? 'border-zobda-orange text-zobda-orange'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tracked Products ({trackedProducts.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-zobda-orange text-zobda-orange'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              User Watchlists ({userWatchlists.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'default' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Default Products */}
          <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Current Default Products</h2>
              <span className="bg-zobda-orange text-white px-3 py-1 rounded-full text-sm font-medium">
                {defaultProducts.length} products
              </span>
            </div>
            
            {defaultProducts.length === 0 ? (
              <div className="text-center py-8 text-zobda-gray">
                <p>No default products set</p>
                <p className="text-sm">Add products below to set them as defaults for new users</p>
              </div>
            ) : (
              <div className="space-y-3">
                {defaultProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-4 p-3 border border-zobda-border rounded-lg">
                    <img 
                      src={product.imageUrl} 
                      alt={product.title}
                      className="w-12 h-12 object-contain bg-white rounded border border-zobda-border"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{product.title}</h3>
                      <p className="text-sm text-zobda-gray">${product.price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveFromDefault(product.id)}
                      disabled={isLoading}
                      className="btn-outline text-red-600 border-red-200 hover:bg-red-50 px-3 py-1 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Available Products to Add */}
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Available Products</h2>
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
                    <div key={product.id} className="flex items-center gap-4 p-3 border border-zobda-border rounded-lg">
                      <img 
                        src={product.imageUrl} 
                        alt={product.title}
                        className="w-12 h-12 object-contain bg-white rounded border border-zobda-border"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{product.title}</h3>
                        <p className="text-sm text-zobda-gray">${product.price.toFixed(2)}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddToDefault(product)}
                          disabled={isLoading || isInDefaultProducts(product.id)}
                          className="btn-zobda px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isInDefaultProducts(product.id) ? 'Added' : 'Add to Default'}
                        </button>
                        <button
                          onClick={() => handleAddToTracked(product)}
                          disabled={isLoading || trackedProducts.some(p => p.id === product.id)}
                          className="btn-outline px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {trackedProducts.some(p => p.id === product.id) ? 'Tracked' : 'Track for New Users'}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Tracked Products Tab */}
      {activeTab === 'tracked' && (
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Admin Tracked Products</h2>
              <div className="flex items-center gap-3">
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {trackedProducts.length} products
                </span>
                <button 
                  onClick={handleSyncTrackedToCurrentUser}
                  className="btn-outline bg-green-600 text-white hover:bg-green-700 px-3 py-1 text-sm"
                >
                  Sync to My Watchlist
                </button>
              </div>
            </div>
            <p className="text-zobda-gray mb-4">
              These products will be automatically added to new users' watchlists. Existing users are not affected.
            </p>
            
            {trackedProducts.length === 0 ? (
              <div className="text-center py-8 text-zobda-gray">
                <div className="text-3xl mb-3">📦</div>
                <p>No tracked products yet</p>
                <p className="text-sm">Add products from the "Default Products" tab</p>
              </div>
            ) : (
              <div className="space-y-3">
                {trackedProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-4 p-3 border border-zobda-border rounded-lg">
                    <img 
                      src={product.imageUrl} 
                      alt={product.title}
                      className="w-12 h-12 object-contain bg-white rounded border border-zobda-border"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{product.title}</h3>
                      <p className="text-sm text-zobda-gray">${product.price.toFixed(2)}</p>
                      <p className="text-xs text-zobda-gray">Added: {new Date(product.addedAt).toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveFromTracked(product.id)}
                      className="btn-outline px-3 py-1 text-sm text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* User Watchlists Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">User Watchlists</h2>
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {userWatchlists.length} users
              </span>
            </div>
            <p className="text-zobda-gray mb-4">
              View all users' watchlists. Users are marked as "initialized" once they sign up.
            </p>
            
            {userWatchlists.length === 0 ? (
              <div className="text-center py-8 text-zobda-gray">
                <div className="text-3xl mb-3">👥</div>
                <p>No user watchlists yet</p>
                <p className="text-sm">Users will appear here once they sign up</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userWatchlists.map((watchlist) => (
                  <div key={watchlist.userId} className="border border-zobda-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">User: {watchlist.userId}</h3>
                        <p className="text-sm text-zobda-gray">
                          Created: {new Date(watchlist.createdAt).toLocaleDateString()} | 
                          Last Updated: {new Date(watchlist.lastUpdated).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-zobda-gray">
                          Status: {watchlist.isInitialized ? 'Initialized (Independent)' : 'Not Initialized (Gets Admin Updates)'}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        watchlist.isInitialized 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {watchlist.isInitialized ? 'Independent' : 'Auto-Updated'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {watchlist.products.map((product) => (
                        <div key={product.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <img 
                            src={product.imageUrl} 
                            alt={product.title}
                            className="w-8 h-8 object-contain bg-white rounded border"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{product.title}</p>
                            <p className="text-xs text-zobda-gray">${product.price.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {watchlist.products.length === 0 && (
                      <p className="text-sm text-zobda-gray text-center py-2">No products in watchlist</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 card p-6 bg-blue-50 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">How it works:</h3>
        <ul className="text-blue-800 space-y-1 text-sm">
          <li>• <strong>Default Products:</strong> Products that appear in new users' watchlists</li>
          <li>• <strong>Tracked Products:</strong> Admin-managed products that auto-update for non-initialized users</li>
          <li>• <strong>User Watchlists:</strong> View all users' watchlists and their status</li>
          <li>• New users get admin tracked products automatically</li>
          <li>• Once a user signs up, their watchlist becomes independent</li>
          <li>• Use "Open Sponsored Deals Manager" to pin up to {MAX_SPONSORED_SLOTS} products at the top of Highlighted Deals</li>
        </ul>
      </div>
    </div>
  )
}
