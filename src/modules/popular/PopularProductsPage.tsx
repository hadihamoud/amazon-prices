import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Product, ProductCard } from '../products/ProductCard'
import { popularProducts } from '../../data/products'
import { addToWatchlist, getWatchlist, getUserId, removeFromWatchlist } from '../../services/watchlistApi'
import { getSponsoredProductsForSection } from '../../services/sponsoredProductService'

export const PopularProductsPage: React.FC = () => {
  const [userWatchlist, setUserWatchlist] = useState<Product[]>([])
  const [isAddingToWatchlist, setIsAddingToWatchlist] = useState<string | null>(null)
  
  // Get sponsored products for trending section
  const sponsoredTrending = getSponsoredProductsForSection('trending')

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
      } catch (err) {
        console.log('Failed to load watchlist')
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
      return [...prev, product]
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
    setUserWatchlist(prev => prev.filter(p => p.id !== productId))
    console.log('Product removed from watchlist!')
  }

  return (
    <div className="container-responsive py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Trending</h1>
        <p className="text-lg text-zobda-gray">
          See what products are being tracked by thousands of users right now
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-6 mb-8 border-b border-zobda-border">
        <button className="pb-3 border-b-2 border-zobda-orange text-zobda-orange font-medium">
          All Categories
        </button>
        <button className="pb-3 text-zobda-gray hover:text-zobda-blue font-medium">
          Electronics
        </button>
        <button className="pb-3 text-zobda-gray hover:text-zobda-blue font-medium">
          Home & Kitchen
        </button>
        <button className="pb-3 text-zobda-gray hover:text-zobda-blue font-medium">
          Sports & Outdoors
        </button>
        <button className="pb-3 text-zobda-gray hover:text-zobda-blue font-medium">
          Books
        </button>
      </div>

      {/* Products Grid */}
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
        {popularProducts.filter(product => product).map((product) => (
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

      {/* Load More */}
      <div className="text-center mt-12">
        <button className="btn-outline px-8 py-3">
          Load More Products
        </button>
      </div>
    </div>
  )
}
