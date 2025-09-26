// Watchlist API service

const API_BASE_URL = 'http://localhost:8000'

export interface WatchlistItem {
  id: number
  asin: string
  target_price: number | null
  title: string
  image_url: string
  product_url: string
  last_price: number | null
}

export interface AddToWatchlistRequest {
  user_id: string
  asin: string
  target_price?: number
  title?: string
  image_url?: string
  product_url?: string
}

// Add product to watchlist
export async function addToWatchlist(request: AddToWatchlistRequest): Promise<{ id: number }> {
  const response = await fetch(`${API_BASE_URL}/watchlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })
  
  if (!response.ok) {
    throw new Error('Failed to add product to watchlist')
  }
  
  return response.json()
}

// Get user's watchlist
export async function getWatchlist(userId: string): Promise<WatchlistItem[]> {
  const response = await fetch(`${API_BASE_URL}/watchlist?user_id=${encodeURIComponent(userId)}`)
  
  if (!response.ok) {
    throw new Error('Failed to get watchlist')
  }
  
  return response.json()
}

// Remove product from watchlist
export async function removeFromWatchlist(userId: string, asin: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/watchlist`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: userId, asin }),
  })
  
  if (!response.ok) {
    throw new Error('Failed to remove product from watchlist')
  }
}

// Get or create user ID (for demo purposes)
export function getUserId(): string {
  let userId = localStorage.getItem('zobda_user_id')
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('zobda_user_id', userId)
  }
  return userId
}
