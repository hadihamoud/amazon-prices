import { Product } from '../modules/products/ProductCard'

// Default products that new users will automatically get in their watchlist
export const DEFAULT_PRODUCTS_KEY = 'zobda_default_products'

// Initial default products
const initialDefaultProducts: Product[] = [
  {
    id: '1',
    title: 'Apple iPhone 15 Pro Max 256GB - Natural Titanium',
    price: 1199.99,
    currentPrice: 1299.99,
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
    productUrl: 'https://amazon.com/dp/B0CHX1W1XY',
    asin: 'B0CHX1W1XY'
  },
  {
    id: '2',
    title: 'MacBook Pro 14-inch M3 Pro Chip 512GB SSD',
    price: 1999.99,
    currentPrice: 2199.99,
    imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop',
    productUrl: 'https://amazon.com/dp/B0CHX1W1XZ',
    asin: 'B0CHX1W1XZ'
  },
  {
    id: '3',
    title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    price: 399.99,
    currentPrice: 449.99,
    imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop',
    productUrl: 'https://amazon.com/dp/B0CHX1W1XA',
    asin: 'B0CHX1W1XA'
  }
]

// Get default products from localStorage
export const getDefaultProducts = (): Product[] => {
  try {
    const stored = localStorage.getItem(DEFAULT_PRODUCTS_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
    // Initialize with default products if none exist
    setDefaultProducts(initialDefaultProducts)
    return initialDefaultProducts
  } catch (error) {
    console.error('Error loading default products:', error)
    return initialDefaultProducts
  }
}

// Set default products in localStorage
export const setDefaultProducts = (products: Product[]): void => {
  try {
    localStorage.setItem(DEFAULT_PRODUCTS_KEY, JSON.stringify(products))
  } catch (error) {
    console.error('Error saving default products:', error)
  }
}

// Add product to default list
export const addToDefaultProducts = (product: Product): void => {
  const currentProducts = getDefaultProducts()
  if (!currentProducts.some(p => p.id === product.id)) {
    const updatedProducts = [...currentProducts, product]
    setDefaultProducts(updatedProducts)
  }
}

// Remove product from default list
export const removeFromDefaultProducts = (productId: string): void => {
  const currentProducts = getDefaultProducts()
  const updatedProducts = currentProducts.filter(p => p.id !== productId)
  setDefaultProducts(updatedProducts)
}

// Check if product is in default list
export const isInDefaultProducts = (productId: string): boolean => {
  const currentProducts = getDefaultProducts()
  return currentProducts.some(p => p.id === productId)
}

// Initialize new user watchlist with default products
export const initializeUserWatchlist = (): Product[] => {
  const defaultProducts = getDefaultProducts()
  const userWatchlist = JSON.parse(localStorage.getItem('zobda_watchlist') || '[]')
  
  // Add default products that aren't already in user's watchlist
  const newProducts = defaultProducts.filter(defaultProduct => 
    !userWatchlist.some((userProduct: Product) => userProduct.id === defaultProduct.id)
  )
  
  if (newProducts.length > 0) {
    const updatedWatchlist = [...userWatchlist, ...newProducts]
    localStorage.setItem('zobda_watchlist', JSON.stringify(updatedWatchlist))
    return updatedWatchlist
  }
  
  return userWatchlist
}
