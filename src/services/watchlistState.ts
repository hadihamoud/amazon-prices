// Shared watchlist state management

import { Product } from '../modules/products/ProductCard'

const WATCHLIST_STORAGE_KEY = 'zobda_watchlist'

// Get watchlist from localStorage
export function getLocalWatchlist(): Product[] {
  try {
    const stored = localStorage.getItem(WATCHLIST_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

// Save watchlist to localStorage
export function saveLocalWatchlist(products: Product[]): void {
  try {
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(products))
  } catch (error) {
    console.error('Failed to save watchlist to localStorage:', error)
  }
}

// Add product to local watchlist
export function addToLocalWatchlist(product: Product): Product[] {
  const current = getLocalWatchlist()
  if (current.some(p => p.id === product.id)) {
    return current // Already exists
  }
  const updated = [...current, product]
  saveLocalWatchlist(updated)
  return updated
}

// Remove product from local watchlist
export function removeFromLocalWatchlist(productId: string): Product[] {
  const current = getLocalWatchlist()
  const updated = current.filter(p => p.id !== productId)
  saveLocalWatchlist(updated)
  return updated
}

// Clear local watchlist
export function clearLocalWatchlist(): void {
  localStorage.removeItem(WATCHLIST_STORAGE_KEY)
}
