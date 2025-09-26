import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Product, ProductCard } from '../products/ProductCard'
import { priceDrops } from '../../data/products'
import { addToWatchlist, getWatchlist, getUserId, removeFromWatchlist } from '../../services/watchlistApi'
import { getLocalWatchlist } from '../../services/watchlistState'
import { getSponsoredProductsForSection } from '../../services/sponsoredProductService'

export const PriceDropsPage: React.FC = () => {
  const [userWatchlist, setUserWatchlist] = useState<Product[]>([])
  const [isAddingToWatchlist, setIsAddingToWatchlist] = useState<string | null>(null)
  
  // Get sponsored products for best deals section
  const sponsoredBestDeals = getSponsoredProductsForSection('best-deals')

  // Load user watchlist
  useEffect(() => {
    const loadWatchlist = async () => {
      try {
        const userId = getUserId()
        const watchlist = await getWatchlist(userId)
        // Convert watchlist items to Product format
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
        console.log('Loaded watchlist from API:', products.length, 'items')
      } catch (err) {
        console.log('Failed to load watchlist from API, using local storage')
        const localWatchlist = getLocalWatchlist()
        setUserWatchlist(localWatchlist)
      }
    }
    
    loadWatchlist()
  }, [])

  const handleAddToWatchlist = async (product: Product) => {
    if (isAddingToWatchlist) return
    
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
    setUserWatchlist(prev => {
      // Check if product already exists
      if (prev.some(p => p.id === product.id)) {
        return prev
      }
      const updated = [...prev, product]
      // Save to localStorage for cross-page sync
      localStorage.setItem('zobda_watchlist', JSON.stringify(updated))
      return updated
    })
    
    setIsAddingToWatchlist(null)
  }

  const handleRemoveFromWatchlist = async (productId: string) => {
    try {
      const userId = getUserId()
      const product = userWatchlist.find(p => p.id === productId)
      if (product?.asin) {
        await removeFromWatchlist(userId, product.asin)
        console.log('Product removed from watchlist via API!')
      }
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

  return (
    <div className="container-responsive py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Best Deals</h1>
        <p className="text-lg text-zobda-gray">
          Biggest price drops happening right now - don't miss these deals!
        </p>
      </div>

      {/* Filter Options */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button className="btn-zobda text-sm">All Drops</button>
        <button className="btn-outline text-sm">Last 24 Hours</button>
        <button className="btn-outline text-sm">Last Week</button>
        <button className="btn-outline text-sm">Last Month</button>
        <select className="border border-zobda-border rounded px-3 py-2 text-sm">
          <option>All Categories</option>
          <option>Electronics</option>
          <option>Home & Kitchen</option>
          <option>Sports & Outdoors</option>
        </select>
      </div>

      {/* Best Deals Grid */}
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
        {priceDrops.filter(product => product).map((product, index) => (
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

      {/* Load More */}
      <div className="text-center mt-12">
        <button className="btn-outline px-8 py-3">
          Load More Best Deals
        </button>
      </div>

      {/* Alert Signup */}
      <div className="bg-zobda-lightGray rounded-lg p-8 text-center mt-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Never Miss a Price Drop</h3>
        <p className="text-zobda-gray mb-6">Get instant notifications when prices drop on products you care about</p>
        <div className="flex gap-4 justify-center max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="flex-1 border border-zobda-border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zobda-orange"
          />
          <button className="btn-zobda px-6 py-2">Sign Up</button>
        </div>
      </div>
    </div>
  )
}
