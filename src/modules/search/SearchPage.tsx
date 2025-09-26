import React, { useState, useEffect } from 'react'
import { Product, ProductCard } from '../products/ProductCard'
import { enhancedProducts } from '../../data/enhancedProducts'
import { useSearchParams } from 'react-router-dom'

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('relevance')

  const categories = [
    'all',
    'Electronics',
    'Home & Kitchen',
    'Sports & Outdoors',
    'Books',
    'Health & Personal Care',
    'Toys & Games',
    'Clothing'
  ]

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Customer Rating' },
    { value: 'newest', label: 'Newest' }
  ]

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch(searchQuery)
    }
  }, [searchQuery, selectedCategory, sortBy])

  const performSearch = (query: string) => {
    setIsSearching(true)
    
    // Simulate API delay
    setTimeout(() => {
      let results = enhancedProducts.filter(product => {
        const matchesQuery = product.title.toLowerCase().includes(query.toLowerCase()) ||
                           product.brand?.toLowerCase().includes(query.toLowerCase()) ||
                           product.category?.toLowerCase().includes(query.toLowerCase())
        
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
        
        return matchesQuery && matchesCategory
      })

      // Sort results
      switch (sortBy) {
        case 'price-low':
          results.sort((a, b) => a.price - b.price)
          break
        case 'price-high':
          results.sort((a, b) => b.price - a.price)
          break
        case 'rating':
          results.sort((a, b) => (b.rating || 0) - (a.rating || 0))
          break
        case 'newest':
          results.sort((a, b) => b.id.localeCompare(a.id))
          break
        default:
          // Relevance - keep original order
          break
      }

      setSearchResults(results)
      setIsSearching(false)
    }, 500)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery })
      performSearch(searchQuery)
    }
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
  }

  return (
    <div className="container-responsive py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Products</h1>
        <p className="text-lg text-zobda-gray">
          Find the best deals on Amazon products
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products..."
            className="flex-1 px-4 py-3 border border-zobda-border rounded-lg focus:ring-2 focus:ring-zobda-orange focus:border-transparent"
          />
          <button
            type="submit"
            className="btn-zobda px-8 py-3"
          >
            Search
          </button>
        </div>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-zobda-orange text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? 'All Categories' : category}
            </button>
          ))}
        </div>

        {/* Sort Filter */}
        <div className="ml-auto">
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-4 py-2 border border-zobda-border rounded-lg focus:ring-2 focus:ring-zobda-orange focus:border-transparent"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Results */}
      {isSearching ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zobda-orange"></div>
          <span className="ml-4 text-lg text-gray-600">Searching...</span>
        </div>
      ) : searchQuery ? (
        <div>
          {/* Results Header */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
            </h2>
          </div>

          {/* Results Grid */}
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {searchResults.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToWatchlist={() => {}}
                  onRemoveFromWatchlist={() => {}}
                  isWatched={false}
                  isAddingToWatchlist={false}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or filters
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="btn-outline"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛍️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Start your search</h3>
          <p className="text-gray-600 mb-4">
            Enter a product name, brand, or category to find great deals
          </p>
        </div>
      )}
    </div>
  )
}
