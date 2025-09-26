import React, { useState, useEffect } from 'react'
import { 
  searchAmazonProducts, 
  addSponsoredProduct, 
  removeSponsoredProduct, 
  getSponsoredProducts,
  updateSponsoredProductSections,
  SponsoredProduct,
  SponsoredSection,
  getSponsoredProductStats
} from '../../services/sponsoredProductService'

export const SponsoredProductManager: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [sponsoredProducts, setSponsoredProducts] = useState<SponsoredProduct[]>([])
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    loadSponsoredProducts()
  }, [])

  const loadSponsoredProducts = () => {
    const products = getSponsoredProducts()
    setSponsoredProducts(products)
    setStats(getSponsoredProductStats())
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    try {
      const results = await searchAmazonProducts(searchQuery)
      setSearchResults(results)
    } catch (error) {
      console.error('Search failed:', error)
      // Show error message
      const errorMessage = document.createElement('div')
      errorMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
      errorMessage.textContent = '❌ Search failed. Please try again.'
      document.body.appendChild(errorMessage)
      setTimeout(() => errorMessage.remove(), 3000)
    } finally {
      setIsSearching(false)
    }
  }

  const handleAddSponsored = (product: any) => {
    try {
      addSponsoredProduct({
        id: product.id,
        asin: product.asin,
        title: product.title,
        imageUrl: product.imageUrl,
        price: product.price,
        productUrl: product.productUrl,
        currentPrice: product.currentPrice
      })
      
      loadSponsoredProducts()
      
      // Show success message
      const successMessage = document.createElement('div')
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
      successMessage.textContent = `✅ ${product.title} added as sponsored product`
      document.body.appendChild(successMessage)
      setTimeout(() => successMessage.remove(), 3000)
    } catch (error) {
      // Show error message
      const errorMessage = document.createElement('div')
      errorMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
      errorMessage.textContent = '❌ Product already exists in sponsored products'
      document.body.appendChild(errorMessage)
      setTimeout(() => errorMessage.remove(), 3000)
    }
  }

  const handleRemoveSponsored = (productId: string) => {
    removeSponsoredProduct(productId)
    loadSponsoredProducts()
    
    // Show success message
    const successMessage = document.createElement('div')
    successMessage.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
    successMessage.textContent = 'ℹ️ Sponsored product removed'
    document.body.appendChild(successMessage)
    setTimeout(() => successMessage.remove(), 3000)
  }

  const handleSectionToggle = (productId: string, section: SponsoredSection) => {
    const product = sponsoredProducts.find(p => p.id === productId)
    if (!product) return
    
    const currentSections = product.sections
    const newSections = currentSections.includes(section)
      ? currentSections.filter(s => s !== section)
      : [...currentSections, section]
    
    updateSponsoredProductSections(productId, newSections)
    loadSponsoredProducts()
  }

  const getSectionLabel = (section: SponsoredSection): string => {
    switch (section) {
      case 'highlighted': return 'Highlighted Deals'
      case 'trending': return 'Trending'
      case 'best-deals': return 'Best Deals'
      case 'watchlist': return 'My Watchlist'
      default: return section
    }
  }

  const getSectionColor = (section: SponsoredSection): string => {
    switch (section) {
      case 'highlighted': return 'bg-purple-100 text-purple-800'
      case 'trending': return 'bg-blue-100 text-blue-800'
      case 'best-deals': return 'bg-green-100 text-green-800'
      case 'watchlist': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-8">
      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Sponsored</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.bySection.highlighted}</div>
            <div className="text-sm text-gray-600">Highlighted Deals</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.bySection.trending}</div>
            <div className="text-sm text-gray-600">Trending</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.bySection['best-deals']}</div>
            <div className="text-sm text-gray-600">Best Deals</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.bySection.watchlist}</div>
            <div className="text-sm text-gray-600">My Watchlist</div>
          </div>
        </div>
      )}

      {/* Amazon Product Search */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Amazon Products</h2>
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search for products on Amazon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="btn-zobda px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Search Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((product) => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                  <img 
                    src={product.imageUrl} 
                    alt={product.title}
                    className="w-full h-32 object-contain mb-3"
                  />
                  <h4 className="font-medium text-sm mb-2 line-clamp-2">{product.title}</h4>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-green-600">${product.price}</span>
                    {product.currentPrice && (
                      <span className="text-sm text-gray-500 line-through">${product.currentPrice}</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleAddSponsored(product)}
                    className="w-full btn-zobda text-sm py-2"
                  >
                    Add as Sponsored
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Current Sponsored Products */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Sponsored Products</h2>
        
        {sponsoredProducts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No sponsored products yet. Search and add some products above.</p>
        ) : (
          <div className="space-y-4">
            {sponsoredProducts.map((product) => (
              <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <img 
                    src={product.imageUrl} 
                    alt={product.title}
                    className="w-20 h-20 object-contain rounded border"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-2">{product.title}</h3>
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-lg font-bold text-green-600">${product.price}</span>
                      {product.currentPrice && (
                        <span className="text-sm text-gray-500 line-through">${product.currentPrice}</span>
                      )}
                      <span className="text-xs text-gray-500">ASIN: {product.asin}</span>
                    </div>
                    
                    {/* Section Selection */}
                    <div className="mb-3">
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Display in sections:</label>
                      <div className="flex flex-wrap gap-2">
                        {(['highlighted', 'trending', 'best-deals', 'watchlist'] as SponsoredSection[]).map((section) => (
                          <label key={section} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={product.sections.includes(section)}
                              onChange={() => handleSectionToggle(product.id, section)}
                              className="rounded border-gray-300"
                            />
                            <span className={`px-2 py-1 rounded text-xs ${getSectionColor(section)}`}>
                              {getSectionLabel(section)}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <a
                        href={product.productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View on Amazon →
                      </a>
                      <button
                        onClick={() => handleRemoveSponsored(product.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
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
    </div>
  )
}


