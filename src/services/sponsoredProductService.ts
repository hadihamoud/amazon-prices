// Enhanced sponsored product management service
import { Product } from '../modules/products/ProductCard'

export interface SponsoredProduct extends Product {
  id: string
  asin: string
  title: string
  imageUrl: string
  price: number
  productUrl: string
  currentPrice?: number
  sections: SponsoredSection[]
  addedAt: string
  addedBy: string
}

export type SponsoredSection = 'highlighted' | 'trending' | 'best-deals' | 'watchlist'

const SPONSORED_KEY = 'zobda_sponsored_products'
const MAX_SPONSORED_PER_SECTION = 3

// Get all sponsored products
export function getSponsoredProducts(): SponsoredProduct[] {
  try {
    const raw = localStorage.getItem(SPONSORED_KEY)
    const products = raw ? JSON.parse(raw) : []
    
    // If no products exist, initialize with test data
    if (products.length === 0) {
      const testProducts: SponsoredProduct[] = [
        {
          id: 'sponsored-test-1',
          asin: 'B08N5WRWNW',
          title: 'iPhone 13 Pro Max 256GB - Space Gray',
          imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200&h=200&fit=crop',
          price: 1099.99,
          productUrl: 'https://www.amazon.com/dp/B08N5WRWNW',
          currentPrice: 1299.99,
          sections: ['highlighted', 'trending', 'best-deals'],
          addedAt: new Date().toISOString(),
          addedBy: 'admin'
        },
        {
          id: 'sponsored-test-2',
          asin: 'B08N5WRWNW',
          title: 'Sony WH-1000XM4 Wireless Noise Canceling Headphones',
          imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&h=200&fit=crop',
          price: 279.99,
          productUrl: 'https://www.amazon.com/dp/B08N5WRWNW',
          currentPrice: 349.99,
          sections: ['highlighted', 'watchlist'],
          addedAt: new Date().toISOString(),
          addedBy: 'admin'
        }
      ]
      saveSponsoredProducts(testProducts)
      return testProducts
    }
    
    return products
  } catch {
    return []
  }
}

// Save sponsored products
function saveSponsoredProducts(products: SponsoredProduct[]): void {
  localStorage.setItem(SPONSORED_KEY, JSON.stringify(products))
}

// Add sponsored product
export function addSponsoredProduct(product: Omit<SponsoredProduct, 'addedAt' | 'addedBy' | 'sections'>): SponsoredProduct {
  const existing = getSponsoredProducts()
  
  // Check if product already exists
  const existingProduct = existing.find(p => p.asin === product.asin)
  if (existingProduct) {
    throw new Error('Product already exists in sponsored products')
  }
  
  const sponsoredProduct: SponsoredProduct = {
    ...product,
    sections: ['highlighted'], // Default to highlighted deals
    addedAt: new Date().toISOString(),
    addedBy: 'admin'
  }
  
  existing.push(sponsoredProduct)
  saveSponsoredProducts(existing)
  return sponsoredProduct
}

// Remove sponsored product
export function removeSponsoredProduct(productId: string): void {
  const existing = getSponsoredProducts()
  const updated = existing.filter(p => p.id !== productId)
  saveSponsoredProducts(updated)
}

// Update sponsored product sections
export function updateSponsoredProductSections(productId: string, sections: SponsoredSection[]): void {
  const existing = getSponsoredProducts()
  const updated = existing.map(p => 
    p.id === productId ? { ...p, sections } : p
  )
  saveSponsoredProducts(updated)
}

// Get sponsored products for specific section
export function getSponsoredProductsForSection(section: SponsoredSection): SponsoredProduct[] {
  const all = getSponsoredProducts()
  return all.filter(p => p.sections.includes(section))
}

// Search Amazon products (mock implementation - replace with real Amazon API)
export async function searchAmazonProducts(query: string): Promise<Product[]> {
  // Mock search results - replace with real Amazon PA-API integration
  const mockResults: Product[] = [
    {
      id: `search-${Date.now()}-1`,
      asin: 'B08N5WRWNW',
      title: `iPhone 13 Pro - ${query}`,
      imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200&h=200&fit=crop',
      price: 999.99,
      productUrl: 'https://www.amazon.com/dp/B08N5WRWNW',
      currentPrice: 899.99
    },
    {
      id: `search-${Date.now()}-2`,
      asin: 'B08N5WRWNW',
      title: `Samsung Galaxy S21 - ${query}`,
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop',
      price: 799.99,
      productUrl: 'https://www.amazon.com/dp/B08N5WRWNW',
      currentPrice: 699.99
    },
    {
      id: `search-${Date.now()}-3`,
      asin: 'B08N5WRWNW',
      title: `MacBook Pro 16" - ${query}`,
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop',
      price: 2499.99,
      productUrl: 'https://www.amazon.com/dp/B08N5WRWNW',
      currentPrice: 2299.99
    },
    {
      id: `search-${Date.now()}-4`,
      asin: 'B08N5WRWNW',
      title: `Sony WH-1000XM4 Headphones - ${query}`,
      imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&h=200&fit=crop',
      price: 349.99,
      productUrl: 'https://www.amazon.com/dp/B08N5WRWNW',
      currentPrice: 299.99
    },
    {
      id: `search-${Date.now()}-5`,
      asin: 'B08N5WRWNW',
      title: `Nintendo Switch - ${query}`,
      imageUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=200&h=200&fit=crop',
      price: 299.99,
      productUrl: 'https://www.amazon.com/dp/B08N5WRWNW',
      currentPrice: 249.99
    }
  ]
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return mockResults
}

// Check if product is sponsored in any section
export function isProductSponsored(productId: string): boolean {
  const sponsored = getSponsoredProducts()
  return sponsored.some(p => p.id === productId)
}

// Get sponsored product by ID
export function getSponsoredProductById(productId: string): SponsoredProduct | null {
  const sponsored = getSponsoredProducts()
  return sponsored.find(p => p.id === productId) || null
}

// Get statistics
export function getSponsoredProductStats() {
  const all = getSponsoredProducts()
  return {
    total: all.length,
    bySection: {
      highlighted: all.filter(p => p.sections.includes('highlighted')).length,
      trending: all.filter(p => p.sections.includes('trending')).length,
      'best-deals': all.filter(p => p.sections.includes('best-deals')).length,
      watchlist: all.filter(p => p.sections.includes('watchlist')).length
    }
  }
}
