import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Product, ProductCard } from '../products/ProductCard'
import { searchAmazonSa } from '../services/amazonSaApi'
import { priceDrops, popularProducts, defaultWatchlistProducts } from '../../data/products'
import { enhancedProducts } from '../../data/enhancedProducts'
import { processHighlightedDeals, getDealStatistics, getDealBadgeText, isDealExpiringSoon, HighlightedDeal } from '../../services/dealsAlgorithm'
import { allSampleProducts } from '../../services/sampleDealsData'
import { getCurrentSponsoredProduct } from '../../services/sponsoredProducts'
import { getCurrentSponsoredProduct as apiGetCurrentSponsoredProduct } from '../../services/sponsoredApi'
import { getSponsoredHighlighted } from '../../services/sponsoredState'
import { getSponsoredProductsForSection } from '../../services/sponsoredProductService'
import { addToWatchlist, getWatchlist, getUserId, removeFromWatchlist } from '../../services/watchlistApi'
import { getLocalWatchlist, addToLocalWatchlist, removeFromLocalWatchlist } from '../../services/watchlistState'
import { initializeUserWatchlist } from '../../services/defaultProducts'
import { 
  initializeNewUserWithAdminProducts, 
  getCurrentUserWatchlist, 
  isUserInitialized,
  initializeDemoAdminProducts,
  addProductToUserWatchlist,
  removeProductFromUserWatchlist,
  syncTrackedProductsToCurrentUser
} from '../../services/userWatchlistService'
import { getCurrentUserSession, isUserLoggedIn } from '../../services/otpService'

export const HomePage: React.FC = () => {
  const [searchInput, setSearchInput] = useState('')
  const [currentDealIndex, setCurrentDealIndex] = useState(0)
  const [highlightedDeals, setHighlightedDeals] = useState<HighlightedDeal[]>([])
  const [dealStats, setDealStats] = useState<any>(null)
  const [userWatchlist, setUserWatchlist] = useState<Product[]>([])
  const [sponsoredProduct, setSponsoredProduct] = useState<any>(null)
  const [isAddingToWatchlist, setIsAddingToWatchlist] = useState<string | null>(null)

  // Process highlighted deals on component mount
  useEffect(() => {
    const deals = processHighlightedDeals(allSampleProducts)
    setHighlightedDeals(deals)
    setDealStats(getDealStatistics(deals))
  }, [])

  // Load sponsored product from API
  useEffect(() => {
    const loadSponsoredProduct = async () => {
      try {
        const sponsored = await apiGetCurrentSponsoredProduct()
        setSponsoredProduct(sponsored)
      } catch (err) {
        // Fallback to mock data if API fails
        setSponsoredProduct(getCurrentSponsoredProduct())
      }
    }
    
    loadSponsoredProduct()
  }, [])

  // Load user watchlist
  useEffect(() => {
    const loadWatchlist = async () => {
      // Check if user is logged in with mobile authentication
      if (isUserLoggedIn()) {
        const userSession = getCurrentUserSession()
        const userId = userSession.userId
        
        try {
          // Try API first
          const watchlist = await getWatchlist(userId)
          const products = watchlist.map(item => ({
            id: item.id.toString(),
            title: item.title,
            price: item.last_price || 0,
            imageUrl: item.image_url,
            productUrl: item.product_url,
            asin: item.asin,
            currentPrice: item.last_price || undefined
          }))
          setUserWatchlist(products)
          localStorage.setItem('zobda_watchlist', JSON.stringify(products))
          console.log('Loaded watchlist from API:', products.length, 'items')
        } catch (err) {
          console.log('API failed, using mobile auth user watchlist service')
          initializeDemoAdminProducts()
          
          if (!isUserInitialized(userId)) {
            // New mobile user - initialize with admin tracked products
            const userWatchlist = initializeNewUserWithAdminProducts(userId)
            setUserWatchlist(userWatchlist.products)
          } else {
            // Existing mobile user
            const currentWatchlist = getCurrentUserWatchlist(userId)
            if (currentWatchlist.length === 0) {
              const syncedProducts = syncTrackedProductsToCurrentUser(userId)
              setUserWatchlist(syncedProducts)
            } else {
              setUserWatchlist(currentWatchlist)
            }
          }
        }
      } else {
        // User not logged in - show empty watchlist
        setUserWatchlist([])
        console.log('User not logged in, showing empty watchlist')
      }
    }
    
    loadWatchlist()
  }, [])

  const handleSearch = async () => {
    if (!searchInput.trim()) return
    try {
      await searchAmazonSa(searchInput)
    } catch (e) {
      console.warn('Search fallback (demo):', searchInput)
    }
  }

  const handleAddToWatchlist = async (product: Product) => {
    console.log('Adding product to watchlist:', product.title)
    if (isAddingToWatchlist) return // Prevent multiple clicks
    
    // Check if user is logged in
    if (!isUserLoggedIn()) {
      const errorMessage = document.createElement('div')
      errorMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
      errorMessage.textContent = 'Please sign in to add products to your watchlist'
      document.body.appendChild(errorMessage)
      setTimeout(() => errorMessage.remove(), 3000)
      return
    }
    
    setIsAddingToWatchlist(product.id)
    
    try {
      const userSession = getCurrentUserSession()
      const userId = userSession.userId
      console.log('User ID:', userId)
      
      await addToWatchlist({
        user_id: userId,
        asin: product.asin || product.id,
        target_price: product.price,
        title: product.title,
        image_url: product.imageUrl,
        product_url: product.productUrl
      })
      
      console.log('Product added to watchlist via API!')
      
      // Also add to local user watchlist service
      addProductToUserWatchlist(userId, product)
      
      // Show success message
      const successMessage = document.createElement('div')
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
      successMessage.textContent = `✅ ${product.title} added to watchlist!`
      document.body.appendChild(successMessage)
      setTimeout(() => successMessage.remove(), 3000)
      
    } catch (error) {
      console.log('API failed, adding to local state only:', error)
      
      // Show warning message
      const warningMessage = document.createElement('div')
      warningMessage.className = 'fixed top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
      warningMessage.textContent = `⚠️ Added to local watchlist (offline mode)`
      document.body.appendChild(warningMessage)
      setTimeout(() => warningMessage.remove(), 3000)
    }
    
    // Always add to local state (works even if API fails)
    setUserWatchlist(prev => {
      console.log('Current watchlist before adding:', prev.length)
      // Check if product already exists
      if (prev.some(p => p.id === product.id)) {
        console.log('Product already exists in watchlist')
        const duplicateMessage = document.createElement('div')
        duplicateMessage.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
        duplicateMessage.textContent = `ℹ️ Product already in watchlist`
        document.body.appendChild(duplicateMessage)
        setTimeout(() => duplicateMessage.remove(), 3000)
        return prev
      }
      const updated = [...prev, product]
      console.log('Updated watchlist:', updated.length)
      // Save to localStorage for cross-page sync
      localStorage.setItem('zobda_watchlist', JSON.stringify(updated))
      console.log('Saved to localStorage')
      return updated
    })
    
    setIsAddingToWatchlist(null)
  }

  const handleRemoveFromWatchlist = async (productId: string) => {
    // Check if user is logged in
    if (!isUserLoggedIn()) {
      return
    }
    
    try {
      const userSession = getCurrentUserSession()
      const userId = userSession.userId
      const product = userWatchlist.find(p => p.id === productId)
      if (product?.asin) {
        await removeFromWatchlist(userId, product.asin)
        console.log('Product removed from watchlist via API!')
      }
      
      // Also remove from local user watchlist service
      removeProductFromUserWatchlist(userId, productId)
    } catch (error) {
      console.log('API failed, removing from local state only:', error)
    }
    
    // Always remove from local state (works even if API fails)
    setUserWatchlist(prev => {
      const updated = prev.filter(p => p.id !== productId)
      // Save to localStorage for cross-page sync
      localStorage.setItem('zobda_watchlist', JSON.stringify(updated))
      return updated
    })
    console.log('Product removed from watchlist!')
  }

  const nextDeals = () => {
    setCurrentDealIndex((prev) => (prev + 1) % Math.max(1, highlightedDeals.length - 4))
  }

  const prevDeals = () => {
    setCurrentDealIndex((prev) => (prev - 1 + highlightedDeals.length - 4) % Math.max(1, highlightedDeals.length - 4))
  }

  // Get sponsored products for different sections
  const sponsoredHighlighted = getSponsoredProductsForSection('highlighted')
  const sponsoredTrending = getSponsoredProductsForSection('trending')
  const sponsoredBestDeals = getSponsoredProductsForSection('best-deals')
  const sponsoredWatchlist = getSponsoredProductsForSection('watchlist')

  // Convert sponsored products to deals for highlighted section
  const sponsoredAsDeals: HighlightedDeal[] = sponsoredHighlighted.map((p) => ({
    product: {
      id: p.id,
      title: p.title,
      asin: p.asin || '',
      currentPrice: p.price,
      averagePrice: p.currentPrice || p.price,
      lowestPrice: p.lowestPrice || p.price,
      highestPrice: p.highestPrice || p.price,
      priceHistory: [],
      reviewCount: 0,
      rating: 0,
      category: 'Sponsored',
      lastUpdated: new Date().toISOString()
    },
    dealScore: 100,
    priceDropPercent: p.currentPrice ? Math.max(0, (p.currentPrice - p.price) / p.currentPrice) : 0,
    savingsAmount: p.currentPrice ? Math.max(0, p.currentPrice - p.price) : 0,
    dealType: 'category_hot',
    isExpired: false,
    expiresAt: new Date(Date.now() + 7*24*60*60*1000).toISOString(),
    lastUpdatedDaysAgo: 0
  }))

  const visibleDeals = [...sponsoredAsDeals, ...highlightedDeals].slice(currentDealIndex, currentDealIndex + 5)

  // Convert HighlightedDeal to Product for display
  const convertDealToProduct = (deal: HighlightedDeal): Product => ({
    id: deal.product.id,
    imageUrl: (deal as any).product?.imageUrl || `https://images.unsplash.com/photo-${1500000000000 + parseInt(deal.product.id)}?w=200&h=200&fit=crop`,
    title: deal.product.title,
    price: deal.product.currentPrice,
    productUrl: `https://www.amazon.sa/dp/${deal.product.asin}`,
    asin: deal.product.asin,
    currentPrice: deal.product.averagePrice,
    lowestPrice: deal.product.lowestPrice,
    highestPrice: deal.product.highestPrice
  })

  return (
    <div className="bg-white">
      <div className="container-responsive py-8">
        {/* User's Watchlist */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Watchlist</h2>
            <span className="text-sm text-zobda-gray">items {userWatchlist.length}</span>
          </div>
          {userWatchlist.length === 0 ? (
            <div className="card p-8 text-center">
              <div className="text-zobda-gray">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-lg font-semibold mb-2">You don't have any price watches</h3>
                <p>Start tracking products to see them here</p>
              </div>
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {/* Sponsored Watchlist Products */}
              {sponsoredWatchlist.map((product) => (
                <div key={`sponsored-${product.id}`} className="flex-shrink-0 w-64">
                  <div className="card p-4 hover:shadow-zobdaHover transition-shadow cursor-pointer relative" onClick={() => { try { localStorage.setItem('zobda_last_product', JSON.stringify(product)) } catch {} ; window.location.href = `/product/${product.id}` }}>
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
                            onClick={(e) => { e.stopPropagation(); handleRemoveFromWatchlist(product.id) }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Regular Watchlist Products */}
              {userWatchlist.map((product, index) => (
                <div key={product.id} className="flex-shrink-0 w-64">
                  <div className={`card p-4 hover:shadow-zobdaHover transition-shadow cursor-pointer ${
                    index === 2 ? 'ring-2 ring-zobda-orange' : ''
                  }`} onClick={() => { try { localStorage.setItem('zobda_last_product', JSON.stringify(product)) } catch {} ; window.location.href = `/product/${product.id}` }}>
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
                            <span className="text-lg font-bold text-zobda-orange">${product.price.toFixed(2)}</span>
                          </div>
                          {product.currentPrice && product.currentPrice !== product.price && (
                            <div className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                              {Math.round(((product.currentPrice - product.price) / product.currentPrice) * 100)}% - ${(product.currentPrice - product.price).toFixed(2)}
                            </div>
                          )}
                        </div>
                        
                        {product.asin && (
                          <div className="text-xs text-zobda-gray mb-3">ASIN: {product.asin}</div>
                        )}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <a 
                          href={product.productUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="btn-amazon-yellow text-sm px-3 py-2 text-center"
                        >
                          View at Amazon
                        </a>
                        <button 
                          className="btn-outline text-sm px-3 py-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveFromWatchlist(product.id)
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

        {/* Highlighted Deals */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-zobda-blue flex items-center gap-2">
                Highlighted Deals
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </h2>
              {dealStats && (
                <p className="text-sm text-zobda-gray mt-1">
                  {dealStats.totalDeals} deals • Avg {dealStats.averageDiscount}% off • Save ${dealStats.totalSavings}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button 
                onClick={prevDeals}
                className="nav-arrow"
                disabled={highlightedDeals.length <= 5}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button 
                onClick={nextDeals}
                className="nav-arrow"
                disabled={highlightedDeals.length <= 5}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <p className="text-zobda-gray mb-6">
            These are outstanding deals we've found and feel are worth sharing. Check back often as these are frequently updated.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {/* Sponsored Product - Always First */}
            {/* {sponsoredProduct && (
              <div className="card p-4 hover:shadow-zobdaHover transition-shadow relative border-2 border-purple-200">
                <div className="absolute top-2 left-2 z-10">
                  <span className="px-2 py-1 rounded-full text-xs font-bold bg-purple-600 text-white">
                    SPONSORED
                  </span>
                </div>
                
                <div className="absolute top-2 right-2 z-10">
                  <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                    {sponsoredProduct.businessName}
                  </span>
                </div>
                
                <div className="flex flex-col gap-3">
                  <div className="flex justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop" 
                      alt="Sponsored Product" 
                      className="h-32 w-32 object-contain bg-white rounded border border-zobda-border" 
                    />
                  </div>
                  
                  <div className="text-center">
                    <Link 
                      to={`/product/${sponsoredProduct.productId}`}
                      className="product-title block mb-2 line-clamp-2 text-sm"
                    >
                      Sony WH-1000XM4 Wireless Premium Noise Canceling Headphones
                    </Link>
                    
                    <div className="flex flex-col items-center gap-1 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-zobda-gray line-through">$349.99</span>
                        <span className="price-text text-lg">$199.99</span>
                      </div>
                      <div className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                        -43% ($150.00)
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <a 
                      href="https://www.amazon.sa/dp/B08N5WRWNW" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="btn-amazon-yellow text-sm px-3 py-2 text-center"
                    >
                      View at Amazon
                    </a>
                    <button className="btn-outline text-sm px-3 py-2">
                      + Add Amazon Price Watch
                    </button>
                  </div>
                  
                  <div className="mt-2 text-center">
                    <span className="text-xs text-purple-600 font-medium">
                      Sponsored by {sponsoredProduct.businessName}
                    </span>
                  </div>
                </div>
              </div>
            )} */}

            {/* Regular Highlighted Deals */}
            {visibleDeals.map((deal, index) => {
              const product = convertDealToProduct(deal)
              return (
                <div key={deal.product.id} className="relative">
                  {/* Deal Badge */}
                  <div className="absolute top-2 left-2 z-10">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      index === 0 ? 'bg-purple-600 text-white' : (deal.priceDropPercent >= 0.3 
                        ? 'bg-green-500 text-white' 
                        : 'bg-orange-500 text-white')
                    }`}>
                      {index === 0 ? 'Sponsored' : getDealBadgeText(deal)}
                    </span>
                  </div>
                  
                  {/* Expiring Soon Badge */}
                  {isDealExpiringSoon(deal) && (
                    <div className="absolute top-2 right-2 z-10">
                      <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-500 text-white animate-pulse">
                        Expires Soon
                      </span>
                    </div>
                  )}
                  
                  <ProductCard 
                    product={product}
                    onAddToWatchlist={handleAddToWatchlist}
                    onRemoveFromWatchlist={handleRemoveFromWatchlist}
                    isWatched={userWatchlist.some(p => p.id === product.id)}
                    isAddingToWatchlist={isAddingToWatchlist === product.id}
                  />
                  
                  {/* Deal Score */}
                  <div className="mt-2 text-center">
                    <span className="text-xs text-zobda-gray">
                      Deal Score: {deal.dealScore}/100
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Trending */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-zobda-blue flex items-center gap-2">
              Trending
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-zobda-gray text-white rounded text-sm">All Products</button>
              <button className="px-4 py-2 border border-zobda-border rounded text-sm hover:bg-zobda-lightGray">Deals Only</button>
              <select className="px-4 py-2 border border-zobda-border rounded text-sm">
                <option>All Categories</option>
                <option>Electronics</option>
                <option>Home & Kitchen</option>
                <option>Sports & Outdoors</option>
              </select>
            </div>
          </div>
          <p className="text-zobda-gray mb-6">
            Check out these recently popular deals on Zobda. See what Zobda users have been buying lately!
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {/* Sponsored Trending Products */}
            {sponsoredTrending.map((product) => (
              <div key={`sponsored-${product.id}`} className="relative">
                <div className="absolute top-2 left-2 z-10">
                  <span className="px-2 py-1 rounded-full text-xs font-bold bg-purple-600 text-white">
                    Sponsored
                  </span>
                </div>
                <ProductCard 
                  product={product}
                  onAddToWatchlist={handleAddToWatchlist}
                  onRemoveFromWatchlist={handleRemoveFromWatchlist}
                  isWatched={userWatchlist.some(p => p.id === product.id)}
                  isAddingToWatchlist={isAddingToWatchlist === product.id}
                />
              </div>
            ))}
            
            {/* Regular Trending Products */}
            {popularProducts.slice(0, 10 - sponsoredTrending.length).map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
                onAddToWatchlist={handleAddToWatchlist}
                onRemoveFromWatchlist={handleRemoveFromWatchlist}
                isWatched={userWatchlist.some(p => p.id === product.id)}
                isAddingToWatchlist={isAddingToWatchlist === product.id}
              />
            ))}
          </div>
        </div>

        {/* Best Deals */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-zobda-blue flex items-center gap-2 mb-6">
            Best Deals
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {/* Sponsored Best Deals */}
            {sponsoredBestDeals.map((product) => (
              <div key={`sponsored-${product.id}`} className="relative">
                <div className="absolute top-2 left-2 z-10">
                  <span className="px-2 py-1 rounded-full text-xs font-bold bg-purple-600 text-white">
                    Sponsored
                  </span>
                </div>
                <ProductCard 
                  product={product}
                  onAddToWatchlist={handleAddToWatchlist}
                  onRemoveFromWatchlist={handleRemoveFromWatchlist}
                  isWatched={userWatchlist.some(p => p.id === product.id)}
                  isAddingToWatchlist={isAddingToWatchlist === product.id}
                />
              </div>
            ))}
            
            {/* Regular Best Deals */}
            {priceDrops.slice(0, 10 - sponsoredBestDeals.length).map((product, index) => (
              <div key={product.id} className="relative">
                <ProductCard 
                  product={product}
                  onAddToWatchlist={handleAddToWatchlist}
                  onRemoveFromWatchlist={handleRemoveFromWatchlist}
                  isWatched={userWatchlist.some(p => p.id === product.id)}
                  isAddingToWatchlist={isAddingToWatchlist === product.id}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}