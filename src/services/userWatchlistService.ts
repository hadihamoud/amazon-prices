import { Product } from '../modules/products/ProductCard'

export interface UserWatchlist {
  userId: string
  products: Product[]
  createdAt: string
  lastUpdated: string
  isInitialized: boolean // Track if user's watchlist was initialized with admin products
}

export interface AdminTrackedProduct {
  id: string
  title: string
  price: number
  imageUrl: string
  productUrl: string
  asin: string
  currentPrice?: number
  addedAt: string
  addedBy: string
}

const USER_WATCHLISTS_KEY = 'zobda_user_watchlists'
const ADMIN_TRACKED_KEY = 'zobda_admin_tracked_products'
const USER_INITIALIZATION_KEY = 'zobda_user_initialization'

// Get all user watchlists (admin view)
export function getAllUserWatchlists(): UserWatchlist[] {
  try {
    const raw = localStorage.getItem(USER_WATCHLISTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

// Get specific user's watchlist
export function getUserWatchlist(userId: string): UserWatchlist | null {
  const allWatchlists = getAllUserWatchlists()
  return allWatchlists.find(w => w.userId === userId) || null
}

// Save user watchlist
export function saveUserWatchlist(watchlist: UserWatchlist): void {
  const allWatchlists = getAllUserWatchlists()
  const existingIndex = allWatchlists.findIndex(w => w.userId === watchlist.userId)
  
  if (existingIndex >= 0) {
    allWatchlists[existingIndex] = watchlist
  } else {
    allWatchlists.push(watchlist)
  }
  
  localStorage.setItem(USER_WATCHLISTS_KEY, JSON.stringify(allWatchlists))
}

// Get admin tracked products
export function getAdminTrackedProducts(): AdminTrackedProduct[] {
  try {
    const raw = localStorage.getItem(ADMIN_TRACKED_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

// Save admin tracked products
export function saveAdminTrackedProducts(products: AdminTrackedProduct[]): void {
  localStorage.setItem(ADMIN_TRACKED_KEY, JSON.stringify(products))
}

// Add product to admin tracked list
export function addAdminTrackedProduct(product: AdminTrackedProduct): void {
  const tracked = getAdminTrackedProducts()
  const exists = tracked.some(p => p.id === product.id)
  
  if (!exists) {
    tracked.push(product)
    saveAdminTrackedProducts(tracked)
    
    // Update all non-initialized users with this new product
    updateNonInitializedUsers(product)
  }
}

// Remove product from admin tracked list
export function removeAdminTrackedProduct(productId: string): void {
  const tracked = getAdminTrackedProducts()
  const filtered = tracked.filter(p => p.id !== productId)
  saveAdminTrackedProducts(filtered)
}

// Initialize new user with admin tracked products
export function initializeNewUserWithAdminProducts(userId: string): UserWatchlist {
  const adminProducts = getAdminTrackedProducts()
  const userProducts: Product[] = adminProducts.map(adminProduct => ({
    id: adminProduct.id,
    title: adminProduct.title,
    price: adminProduct.price,
    imageUrl: adminProduct.imageUrl,
    productUrl: adminProduct.productUrl,
    asin: adminProduct.asin,
    currentPrice: adminProduct.currentPrice
  }))
  
  const userWatchlist: UserWatchlist = {
    userId,
    products: userProducts,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    isInitialized: true
  }
  
  saveUserWatchlist(userWatchlist)
  markUserAsInitialized(userId)
  
  // Also update localStorage for immediate UI sync
  localStorage.setItem('zobda_watchlist', JSON.stringify(userProducts))
  
  return userWatchlist
}

// Update non-initialized users with new admin product
function updateNonInitializedUsers(newProduct: AdminTrackedProduct): void {
  const allWatchlists = getAllUserWatchlists()
  const nonInitializedUsers = allWatchlists.filter(w => !w.isInitialized)
  
  nonInitializedUsers.forEach(watchlist => {
    const product: Product = {
      id: newProduct.id,
      title: newProduct.title,
      price: newProduct.price,
      imageUrl: newProduct.imageUrl,
      productUrl: newProduct.productUrl,
      asin: newProduct.asin,
      currentPrice: newProduct.currentPrice
    }
    
    // Add product if not already present
    if (!watchlist.products.some(p => p.id === product.id)) {
      watchlist.products.push(product)
      watchlist.lastUpdated = new Date().toISOString()
      saveUserWatchlist(watchlist)
    }
  })
}

// Mark user as initialized (so they won't get future admin updates)
export function markUserAsInitialized(userId: string): void {
  try {
    const initialized = JSON.parse(localStorage.getItem(USER_INITIALIZATION_KEY) || '[]')
    if (!initialized.includes(userId)) {
      initialized.push(userId)
      localStorage.setItem(USER_INITIALIZATION_KEY, JSON.stringify(initialized))
    }
  } catch {
    // Handle error silently
  }
}

// Check if user is initialized
export function isUserInitialized(userId: string): boolean {
  try {
    const initialized = JSON.parse(localStorage.getItem(USER_INITIALIZATION_KEY) || '[]')
    return initialized.includes(userId)
  } catch {
    return false
  }
}

// Add product to specific user's watchlist (for existing users)
export function addProductToUserWatchlist(userId: string, product: Product): void {
  let watchlist = getUserWatchlist(userId)
  
  if (!watchlist) {
    // Create new watchlist for user
    watchlist = {
      userId,
      products: [],
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      isInitialized: true // Mark as initialized so they don't get admin updates
    }
  }
  
  // Add product if not already present
  if (!watchlist.products.some(p => p.id === product.id)) {
    watchlist.products.push(product)
    watchlist.lastUpdated = new Date().toISOString()
    saveUserWatchlist(watchlist)
  }
}

// Remove product from specific user's watchlist
export function removeProductFromUserWatchlist(userId: string, productId: string): void {
  const watchlist = getUserWatchlist(userId)
  
  if (watchlist) {
    watchlist.products = watchlist.products.filter(p => p.id !== productId)
    watchlist.lastUpdated = new Date().toISOString()
    saveUserWatchlist(watchlist)
  }
}

// Get user's current watchlist (for display)
export function getCurrentUserWatchlist(userId: string): Product[] {
  const watchlist = getUserWatchlist(userId)
  return watchlist ? watchlist.products : []
}

// Sync admin tracked products to current user's watchlist
export function syncTrackedProductsToCurrentUser(userId: string): Product[] {
  const adminProducts = getAdminTrackedProducts()
  const userProducts: Product[] = adminProducts.map(adminProduct => ({
    id: adminProduct.id,
    title: adminProduct.title,
    price: adminProduct.price,
    imageUrl: adminProduct.imageUrl,
    productUrl: adminProduct.productUrl,
    asin: adminProduct.asin,
    currentPrice: adminProduct.currentPrice
  }))
  
  // Update the user's watchlist with tracked products
  const userWatchlist: UserWatchlist = {
    userId,
    products: userProducts,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    isInitialized: true // Mark as initialized so they don't get future auto-updates
  }
  
  saveUserWatchlist(userWatchlist)
  markUserAsInitialized(userId)
  
  return userProducts
}

// Initialize with some demo admin tracked products
export function initializeDemoAdminProducts(): void {
  const existing = getAdminTrackedProducts()
  if (existing.length === 0) {
    const demoProducts: AdminTrackedProduct[] = [
      {
        id: 'admin-tracked-1',
        title: 'Apple AirPods Pro (2nd Generation)',
        price: 199.99,
        imageUrl: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=200&h=200&fit=crop',
        productUrl: 'https://www.amazon.com/dp/B0BDJDR6J8',
        asin: 'B0BDJDR6J8',
        currentPrice: 249.99,
        addedAt: new Date().toISOString(),
        addedBy: 'admin'
      },
      {
        id: 'admin-tracked-2',
        title: 'Samsung Galaxy S23 Ultra 256GB',
        price: 999.99,
        imageUrl: 'https://images.unsplash.com/photo-1610945265064-3e4e5d5b5b5b?w=200&h=200&fit=crop',
        productUrl: 'https://www.amazon.com/dp/B0BQJ8QZ8Z',
        asin: 'B0BQJ8QZ8Z',
        currentPrice: 1199.99,
        addedAt: new Date().toISOString(),
        addedBy: 'admin'
      },
      {
        id: 'admin-tracked-3',
        title: 'MacBook Pro 14-inch M2 Chip',
        price: 1999.99,
        imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=200&h=200&fit=crop',
        productUrl: 'https://www.amazon.com/dp/B0BQJ8QZ8Z',
        asin: 'B0BQJ8QZ8Z',
        currentPrice: 2199.99,
        addedAt: new Date().toISOString(),
        addedBy: 'admin'
      }
    ]
    
    saveAdminTrackedProducts(demoProducts)
  }
}
