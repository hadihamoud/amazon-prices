import React, { useState, useEffect } from 'react'
import { Product, ProductCard } from '../products/ProductCard'
import { useNavigate } from 'react-router-dom'
import { PriceHistoryChart, PricePoint } from '../charts/PriceHistoryChart'
import { defaultWatchlistProducts } from '../../data/products'
import { addToWatchlist, getWatchlist, getUserId, removeFromWatchlist } from '../../services/watchlistApi'
import { getLocalWatchlist, addToLocalWatchlist, removeFromLocalWatchlist } from '../../services/watchlistState'
import { initializeUserWatchlist } from '../../services/defaultProducts'
import { getSponsoredProductsForSection } from '../../services/sponsoredProductService'

type WatchlistItem = Product & { history: PricePoint[] }

function generateDemoHistory(days: number, base: number): PricePoint[] {
  const history: PricePoint[] = []
  let current = base
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const delta = (Math.random() - 0.5) * 4
    current = Math.max(5, current + delta)
    history.push({ date, price: parseFloat(current.toFixed(2)) })
  }
  return history
}

const initialProducts: WatchlistItem[] = defaultWatchlistProducts.map(product => ({
  ...product,
  history: generateDemoHistory(120, product.price)
}))

export const WatchlistPage: React.FC = () => {
  const navigate = useNavigate()
  const [items, setItems] = React.useState<WatchlistItem[]>([])
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [searchInput, setSearchInput] = React.useState('')
  const [isAddingToWatchlist, setIsAddingToWatchlist] = React.useState<string | null>(null)
  
  // Get sponsored products for watchlist section
  const sponsoredWatchlist = getSponsoredProductsForSection('watchlist')

  // Load user watchlist
  const loadWatchlist = React.useCallback(async () => {
    console.log('Loading watchlist...')
    try {
      const userId = getUserId()
      console.log('User ID:', userId)
      const watchlist = await getWatchlist(userId)
      console.log('API watchlist:', watchlist)
      // Convert watchlist items to WatchlistItem format
      const watchlistItems = watchlist.map(item => ({
        id: item.id.toString(),
        title: item.title,
        price: item.last_price || 0,
        imageUrl: item.image_url,
        productUrl: item.product_url,
        asin: item.asin,
        currentPrice: item.last_price || undefined,
        history: generateDemoHistory(120, item.last_price || 0)
      }))
      setItems(watchlistItems)
      console.log('Set items from API:', watchlistItems.length)
      
      // Select first item by default
      if (watchlistItems.length > 0) {
        setSelectedId(watchlistItems[0].id)
      }
    } catch (err) {
      console.log('Failed to load watchlist from API, using localStorage with default products:', err)
      // Initialize with default products for new users
      const initializedWatchlist = initializeUserWatchlist()
      const watchlistItems = initializedWatchlist.map(product => ({
        ...product,
        history: generateDemoHistory(120, product.price)
      }))
      setItems(watchlistItems)
      console.log('Set items with default products:', watchlistItems.length)
      if (watchlistItems.length > 0) {
        setSelectedId(watchlistItems[0].id)
      }
    }
  }, [])

  React.useEffect(() => {
    loadWatchlist()
  }, [loadWatchlist])

  // Reload watchlist when page becomes visible (user navigates back from homepage)
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadWatchlist()
      }
    }

    const handleFocus = () => {
      loadWatchlist()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [loadWatchlist])

  const selected = items.find(p => p.id === selectedId) ?? items[0]

  async function handleAdd(product: Product) {
    const exists = items.some(p => p.id === product.id)
    if (exists || isAddingToWatchlist) return
    
    setIsAddingToWatchlist(product.id)
    
    try {
      const userId = getUserId()
      await addToWatchlist({
        user_id: userId,
        asin: product.asin || product.id,
        target_price: product.price,
        title: product.title,
        image_url: product.imageUrl,
        product_url: product.productUrl
      })
      
      console.log('Product added to watchlist via API!')
    } catch (error) {
      console.log('API failed, adding to local state only:', error)
    }
    
    // Always add to local state (works even if API fails)
    const newItem = { ...product, history: generateDemoHistory(120, product.price) }
    setItems(prev => {
      const updated = [...prev, newItem]
      // Save to localStorage for cross-page sync
      const products = updated.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        imageUrl: item.imageUrl,
        productUrl: item.productUrl,
        asin: item.asin,
        currentPrice: item.currentPrice
      }))
      localStorage.setItem('zobda_watchlist', JSON.stringify(products))
      return updated
    })
    setSelectedId(product.id)
    
    setIsAddingToWatchlist(null)
  }

  async function handleRemove(id: string) {
    try {
      const userId = getUserId()
      const product = items.find(p => p.id === id)
      if (product?.asin) {
        await removeFromWatchlist(userId, product.asin)
        console.log('Product removed from watchlist via API!')
      }
    } catch (error) {
      console.log('API failed, removing from local state only:', error)
    }
    
    // Always remove from local state (works even if API fails)
    setItems(prev => {
      const updated = prev.filter(p => p.id !== id)
      // Save to localStorage for cross-page sync
      const products = updated.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        imageUrl: item.imageUrl,
        productUrl: item.productUrl,
        asin: item.asin,
        currentPrice: item.currentPrice
      }))
      localStorage.setItem('zobda_watchlist', JSON.stringify(products))
      return updated
    })
    
    if (selectedId === id) {
      const remaining = items.filter(p => p.id !== id)
      setSelectedId(remaining[0]?.id ?? null)
    }
    
    console.log('Product removed from watchlist!')
  }

  function handleSearch() {
    if (!searchInput.trim()) return
    // Demo: Add a new product based on search
    const newProduct: Product = {
      id: `demo-${Date.now()}`,
      title: `Demo Product: ${searchInput}`,
      price: Math.random() * 100 + 20,
      imageUrl: 'https://via.placeholder.com/150x150?text=Demo+Product',
      productUrl: 'https://www.amazon.com/',
      asin: `DEMO${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    }
    handleAdd(newProduct)
    setSearchInput('')
  }

  return (
    <div className="container-responsive py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">My Watchlist</h1>
        <p className="text-lg text-zobda-gray">
          Manage your tracked products and price alerts
        </p>
      </div>

      {/* Search Section */}
      <div className="card p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Product to Watch</h2>
        <p className="text-zobda-gray mb-4">Enter an Amazon URL or ASIN to start tracking price history</p>
        <div className="flex gap-3">
          <input 
            className="flex-1 border border-zobda-border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zobda-orange focus:border-transparent" 
            placeholder="Paste Amazon URL or ASIN here..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            className="btn-zobda"
            onClick={handleSearch}
          >
            Track Product
          </button>
        </div>
        <p className="text-sm text-zobda-gray mt-2">Demo: Enter any text to add a sample product</p>
      </div>

      {/* Watchlist Section - Top */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Your Watchlist</h2>
          <span className="text-sm text-zobda-gray">{items.length} items</span>
        </div>
        
        {items.length === 0 ? (
          <div className="card p-6 text-center">
            <div className="text-zobda-gray">
              <div className="text-3xl mb-3">📝</div>
              <p>Your watchlist is empty</p>
              <p className="text-sm">Add products to track their prices</p>
            </div>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {/* Sponsored Watchlist Products */}
            {sponsoredWatchlist.map((product) => (
              <div key={`sponsored-${product.id}`} className="flex-shrink-0 w-64">
                <div className="card p-4 hover:shadow-zobdaHover transition-shadow cursor-pointer relative" onClick={() => {
                  try { localStorage.setItem('zobda_last_product', JSON.stringify(product)) } catch {}
                  navigate(`/product/${product.id}`)
                }}>
                  <div className="absolute top-2 left-2 z-10">
                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-purple-600 text-white">
                      Sponsored
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {/* Product Image */}
                    <div className="flex justify-center">
                      <img 
                        src={product.imageUrl} 
                        alt={product.title} 
                        className="h-20 w-20 object-contain bg-white rounded border border-zobda-border" 
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div className="text-center">
                      <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                        {product.title}
                      </h3>
                      
                      <div className="flex flex-col items-center gap-1 mb-3">
                        <div className="flex items-center gap-2">
                          {product.currentPrice && product.currentPrice !== product.price && (
                            <span className="text-sm text-zobda-gray line-through">${product.currentPrice.toFixed(2)}</span>
                          )}
                          <span className="text-lg font-bold text-zobda-blue">${product.price.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button 
                          className="btn-outline text-xs px-3 py-1 flex-1"
                          onClick={(e) => { e.stopPropagation(); window.open(product.productUrl, '_blank') }}
                        >
                          View at Amazon
                        </button>
                        <button 
                          className="btn-zobda text-xs px-3 py-1 flex-1"
                          onClick={(e) => { e.stopPropagation(); handleAdd(product) }}
                        >
                          Add to Watchlist
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Regular Watchlist Items */}
            {items.map((p, index) => (
              <div key={p.id} className="flex-shrink-0 w-64">
                <div className={`card p-4 hover:shadow-zobdaHover transition-shadow cursor-pointer ${
                  selected?.id === p.id ? 'ring-2 ring-zobda-orange' : ''
                }`} onClick={() => {
                  try { localStorage.setItem('zobda_last_product', JSON.stringify(p)) } catch {}
                  navigate(`/product/${p.id}`)
                }}>
                  <div className="flex flex-col gap-3">
                    {/* Product Image */}
                    <div className="flex justify-center">
                      <img 
                        src={p.imageUrl} 
                        alt={p.title} 
                        className="h-20 w-20 object-contain bg-white rounded border border-zobda-border" 
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div className="text-center">
                      <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                        {p.title}
                      </h3>
                      
                      <div className="flex flex-col items-center gap-1 mb-3">
                        <div className="flex items-center gap-2">
                          {p.currentPrice && p.currentPrice !== p.price && (
                            <span className="text-sm text-zobda-gray line-through">${p.currentPrice.toFixed(2)}</span>
                          )}
                          <span className="text-lg font-bold text-zobda-orange">${p.price.toFixed(2)}</span>
                        </div>
                        {p.currentPrice && p.currentPrice !== p.price && (
                          <div className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                            {Math.round(((p.currentPrice - p.price) / p.currentPrice) * 100)}% - ${(p.currentPrice - p.price).toFixed(2)}
                          </div>
                        )}
                      </div>
                      
                      {p.asin && (
                        <div className="text-xs text-zobda-gray mb-3">ASIN: {p.asin}</div>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <a 
                          href={p.productUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="btn-amazon-yellow text-sm px-3 py-2 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View at Amazon
                        </a>
                        <button 
                          className="btn-outline text-sm px-3 py-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            try { localStorage.setItem('zobda_last_product', JSON.stringify(p)) } catch {}
                            navigate(`/product/${p.id}`)
                          }}
                        >
                          View Details
                        </button>
                      </div>
                      <button 
                        className="btn-outline text-sm px-3 py-2"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemove(p.id)
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chart Section - Bottom */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Price History {selected && `- ${selected.title}`}
          </h2>
          {selected && (
            <div className="text-sm text-zobda-gray">
              <span className="font-medium">High: ${Math.max(...selected.history.map(h => h.price)).toFixed(2)}</span>
              <span className="mx-2">•</span>
              <span className="font-medium">Low: ${Math.min(...selected.history.map(h => h.price)).toFixed(2)}</span>
            </div>
          )}
        </div>
        
        {selected ? (
          <div className="card p-6">
            <PriceHistoryChart data={selected.history} />
          </div>
        ) : (
          <div className="card p-8 text-center">
            <div className="text-zobda-gray">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-semibold mb-2">No Product Selected</h3>
              <p>Select a product from your watchlist above to view its price history</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


