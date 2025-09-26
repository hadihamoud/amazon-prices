import { Product } from '../modules/products/ProductCard'

// Minimal demo dictionary for Arabic product titles.
// Extend this as needed or load from backend in real app.
const arabicById: Record<string, string> = {
  '1': 'Apple iPhone 15 Pro Max 256GB',
  '2': 'ماكبوك برو 14 بوصة شريحة M3 Pro سعة 512GB',
  '3': 'سوني WH-1000XM5 سماعات لاسلكية بإلغاء الضوضاء',
  '4': 'ساعة Fitbit Versa 3 للصحة واللياقة',
  '5': 'إنستانت بوت ديو طنجرة ضغط كهربائية 7 في 1'
}

const arabicByAsin: Record<string, string> = {
  B0CHX1W1XY: 'Apple iPhone 15 Pro Max 256GB',
  B0CHX1W1XZ: 'ماكبوك برو 14 بوصة شريحة M3 Pro سعة 512GB',
  B0CHX1W1XA: 'سوني WH-1000XM5 سماعات لاسلكية بإلغاء الضوضاء',
  B0CHX1W1XB: 'حذاء نايك Air Max 270 للرجال',
  B0CHX1W1XC: 'إنستانت بوت ديو طنجرة ضغط كهربائية 7 في 1'
}

export function getArabicTitle(product: Pick<Product, 'id' | 'asin' | 'title'>): string | undefined {
  if (product.id && arabicById[product.id]) return arabicById[product.id]
  if (product.asin && arabicByAsin[product.asin]) return arabicByAsin[product.asin]
  return undefined
}


