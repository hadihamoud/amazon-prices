import { Product } from '../modules/products/ProductCard'

const KEY = 'zobda_sponsored_highlighted'
const MAX_SPONSORED = 2

export function getSponsoredHighlighted(): Product[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Product[]) : []
  } catch {
    return []
  }
}

export function setSponsoredHighlighted(products: Product[]): void {
  const trimmed = products.slice(0, MAX_SPONSORED)
  localStorage.setItem(KEY, JSON.stringify(trimmed))
}

export function addSponsored(product: Product): Product[] {
  const current = getSponsoredHighlighted()
  if (!current.some(p => p.id === product.id)) {
    current.push(product)
  }
  setSponsoredHighlighted(current)
  return getSponsoredHighlighted()
}

export function removeSponsored(productId: string): Product[] {
  const current = getSponsoredHighlighted().filter(p => p.id !== productId)
  setSponsoredHighlighted(current)
  return getSponsoredHighlighted()
}

export const MAX_SPONSORED_SLOTS = MAX_SPONSORED


