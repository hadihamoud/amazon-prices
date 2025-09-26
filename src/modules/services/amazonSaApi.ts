export type AmazonSaProduct = {
  id: string
  asin: string
  title: string
  imageUrl: string
  price: number
  productUrl: string
}

// Note: Amazon.com.sa does not provide a public product API. In production,
// proxy requests via your backend to a compliant data provider or your own
// scraper. This client calls a configurable proxy endpoint.

const API_BASE = import.meta.env.VITE_ZOBDA_API_BASE ?? '/api'

export async function searchAmazonSa(query: string): Promise<AmazonSaProduct[]> {
  const res = await fetch(`${API_BASE}/amazon-sa/search?q=${encodeURIComponent(query)}`)
  if (!res.ok) throw new Error('Failed to search Amazon.sa')
  return res.json()
}

export async function getAmazonSaProduct(asinOrId: string): Promise<AmazonSaProduct> {
  const res = await fetch(`${API_BASE}/amazon-sa/product/${encodeURIComponent(asinOrId)}`)
  if (!res.ok) throw new Error('Failed to fetch product')
  return res.json()
}


