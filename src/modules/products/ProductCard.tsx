import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getArabicTitle } from '../../i18n/productTitles'

export type Product = {
  id: string
  imageUrl: string
  title: string
  price: number
  productUrl: string
  asin?: string
  currentPrice?: number
  lowestPrice?: number
  highestPrice?: number
}

type ProductCardProps = {
  product: Product
  onAddToWatchlist?: (product: Product) => void
  onRemoveFromWatchlist?: (productId: string) => void
  isWatched?: boolean
  isSelected?: boolean
  onClick?: () => void
  isAddingToWatchlist?: boolean
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToWatchlist, 
  onRemoveFromWatchlist, 
  isWatched, 
  isSelected,
  onClick,
  isAddingToWatchlist = false
}) => {
  const navigate = useNavigate()
  const savings = (product.currentPrice || 0) - product.price
  const savingsPercent = ((savings / (product.currentPrice || 1)) * 100).toFixed(0)
  const lang = (localStorage.getItem('zobda_lang') as 'en' | 'ar') || 'en'
  const localizedTitle = lang === 'ar' ? (getArabicTitle(product) || product.title) : product.title

  const handleProductClick = () => {
    // Persist the clicked product so ProductDetailPage can render even if the id isn't in demo data
    try {
      localStorage.setItem('zobda_last_product', JSON.stringify(product))
    } catch {}
    if (onClick) {
      onClick()
    } else {
      navigate(`/product/${product.id}`)
    }
  }
  
  return (
    <div 
      className={`card p-4 cursor-pointer transition-all hover:shadow-zobdaHover ${isSelected ? 'ring-2 ring-zobda-orange' : ''}`}
      onClick={handleProductClick}
    >
      <div className="flex flex-col gap-3">
        {/* Product Image */}
        <div className="flex justify-center">
          <img 
            src={product.imageUrl} 
            alt={product.title} 
            className="h-24 w-24 object-contain bg-white rounded border border-zobda-border" 
          />
        </div>
        
        {/* Product Info */}
        <div className="text-center">
          <div 
            className="product-title block mb-2 line-clamp-2 text-sm cursor-pointer hover:text-zobda-orange transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              handleProductClick()
            }}
          >
            {localizedTitle}
          </div>
          
          <div className="flex flex-col items-center gap-1 mb-3">
            <div className="flex items-center gap-2">
              {product.currentPrice && product.currentPrice !== product.price && (
                <span className="text-sm text-zobda-gray line-through">${product.currentPrice.toFixed(2)}</span>
              )}
              <span className="price-text text-lg">${product.price.toFixed(2)}</span>
            </div>
            {product.currentPrice && product.currentPrice !== product.price && (
              <div className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                -{savingsPercent}% (${savings.toFixed(2)})
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
            onClick={(e) => e.stopPropagation()}
          >
            View at Amazon
          </a>
          {isWatched ? (
            <button 
              className="btn-outline text-sm px-3 py-2" 
              onClick={(e) => {
                e.stopPropagation()
                onRemoveFromWatchlist?.(product.id)
              }}
            >
              Remove
            </button>
          ) : (
            <button 
              className="btn-outline text-sm px-3 py-2 disabled:opacity-50" 
              onClick={(e) => {
                e.stopPropagation()
                onAddToWatchlist?.(product)
              }}
              disabled={isAddingToWatchlist}
            >
              {isAddingToWatchlist ? 'Adding...' : '+ Add Amazon Price Watch'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}


