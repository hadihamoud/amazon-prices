import { ProductData, PriceHistory } from './dealsAlgorithm'

// Generate realistic price history for a product
function generatePriceHistory(
  basePrice: number,
  volatility: number = 0.15,
  days: number = 90
): PriceHistory[] {
  const history: PriceHistory[] = []
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  
  let currentPrice = basePrice
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    
    // Add some randomness to price changes
    const changePercent = (Math.random() - 0.5) * volatility
    const changeAmount = currentPrice * changePercent
    currentPrice = Math.max(currentPrice + changeAmount, basePrice * 0.3) // Don't go below 30% of base
    
    // Add some trend (slight upward trend over time)
    if (i > days * 0.7) {
      currentPrice *= 1.001 // Very slight upward trend
    }
    
    history.push({
      price: Math.round(currentPrice * 100) / 100,
      date: date.toISOString().split('T')[0],
      source: 'amazon'
    })
  }
  
  return history
}

// Generate sample products with realistic data
export const sampleProducts: ProductData[] = [
  {
    id: '1',
    asin: 'B08N5WRWNW',
    title: 'Echo Dot (4th Gen) | Smart speaker with Alexa | Charcoal',
    currentPrice: 29.99,
    priceHistory: generatePriceHistory(49.99, 0.2, 120),
    averagePrice: 0, // Will be calculated
    lowestPrice: 0, // Will be calculated
    highestPrice: 0, // Will be calculated
    reviewCount: 125000,
    rating: 4.5,
    category: 'Electronics',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '2',
    asin: 'B07FZ8S74R',
    title: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker',
    currentPrice: 79.99,
    priceHistory: generatePriceHistory(129.99, 0.25, 90),
    averagePrice: 0,
    lowestPrice: 0,
    highestPrice: 0,
    reviewCount: 89000,
    rating: 4.6,
    category: 'Appliances',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '3',
    asin: 'B08N5WRWNW',
    title: 'Apple AirPods Pro (2nd Generation)',
    currentPrice: 199.99,
    priceHistory: generatePriceHistory(249.99, 0.15, 60),
    averagePrice: 0,
    lowestPrice: 0,
    highestPrice: 0,
    reviewCount: 45000,
    rating: 4.7,
    category: 'Electronics',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '4',
    asin: 'B08N5WRWNW',
    title: 'Ninja Foodi Personal Blender for Shakes, Smoothies',
    currentPrice: 39.99,
    priceHistory: generatePriceHistory(79.99, 0.3, 75),
    averagePrice: 0,
    lowestPrice: 0,
    highestPrice: 0,
    reviewCount: 32000,
    rating: 4.3,
    category: 'Appliances',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '5',
    asin: 'B08N5WRWNW',
    title: 'Fire TV Stick 4K Max streaming device',
    currentPrice: 34.99,
    priceHistory: generatePriceHistory(54.99, 0.2, 100),
    averagePrice: 0,
    lowestPrice: 0,
    highestPrice: 0,
    reviewCount: 67000,
    rating: 4.4,
    category: 'Electronics',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '6',
    asin: 'B08N5WRWNW',
    title: 'Dyson V15 Detect Cordless Vacuum Cleaner',
    currentPrice: 449.99,
    priceHistory: generatePriceHistory(599.99, 0.2, 60),
    averagePrice: 0,
    lowestPrice: 0,
    highestPrice: 0,
    reviewCount: 12000,
    rating: 4.8,
    category: 'Appliances',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '7',
    asin: 'B08N5WRWNW',
    title: 'Samsung 55" Class QLED 4K UHD Smart TV',
    currentPrice: 599.99,
    priceHistory: generatePriceHistory(899.99, 0.25, 45),
    averagePrice: 0,
    lowestPrice: 0,
    highestPrice: 0,
    reviewCount: 23000,
    rating: 4.5,
    category: 'Electronics',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '8',
    asin: 'B08N5WRWNW',
    title: 'KitchenAid Stand Mixer, 5 Quart, Empire Red',
    currentPrice: 199.99,
    priceHistory: generatePriceHistory(329.99, 0.2, 90),
    averagePrice: 0,
    lowestPrice: 0,
    highestPrice: 0,
    reviewCount: 45000,
    rating: 4.7,
    category: 'Appliances',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '9',
    asin: 'B08N5WRWNW',
    title: 'Fitbit Versa 3 Health & Fitness Smartwatch',
    currentPrice: 129.99,
    priceHistory: generatePriceHistory(199.99, 0.25, 80),
    averagePrice: 0,
    lowestPrice: 0,
    highestPrice: 0,
    reviewCount: 28000,
    rating: 4.2,
    category: 'Electronics',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '10',
    asin: 'B08N5WRWNW',
    title: 'Breville Bambino Plus Espresso Machine',
    currentPrice: 399.99,
    priceHistory: generatePriceHistory(499.99, 0.15, 120),
    averagePrice: 0,
    lowestPrice: 0,
    highestPrice: 0,
    reviewCount: 8500,
    rating: 4.6,
    category: 'Appliances',
    lastUpdated: new Date().toISOString()
  }
]

// Generate some products with current deals (artificially lower current prices)
export const sampleDealsProducts: ProductData[] = [
  {
    id: 'deal-1',
    asin: 'B08N5WRWNW',
    title: 'Sony WH-1000XM4 Wireless Premium Noise Canceling Headphones',
    currentPrice: 199.99, // Currently on sale
    priceHistory: generatePriceHistory(349.99, 0.2, 90),
    averagePrice: 0,
    lowestPrice: 0,
    highestPrice: 0,
    reviewCount: 156000,
    rating: 4.6,
    category: 'Electronics',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'deal-2',
    asin: 'B08N5WRWNW',
    title: 'Vitamix A3500 Ascent Series Smart Blender',
    currentPrice: 299.99, // Currently on sale
    priceHistory: generatePriceHistory(499.99, 0.15, 120),
    averagePrice: 0,
    lowestPrice: 0,
    highestPrice: 0,
    reviewCount: 42000,
    rating: 4.8,
    category: 'Appliances',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'deal-3',
    asin: 'B08N5WRWNW',
    title: 'iPad Air (5th Generation) with M1 chip',
    currentPrice: 449.99, // Currently on sale
    priceHistory: generatePriceHistory(599.99, 0.1, 60),
    averagePrice: 0,
    lowestPrice: 0,
    highestPrice: 0,
    reviewCount: 89000,
    rating: 4.7,
    category: 'Electronics',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'deal-4',
    asin: 'B08N5WRWNW',
    title: 'Dyson V11 Cordless Vacuum Cleaner',
    currentPrice: 399.99, // Currently on sale
    priceHistory: generatePriceHistory(599.99, 0.2, 90),
    averagePrice: 0,
    lowestPrice: 0,
    highestPrice: 0,
    reviewCount: 34000,
    rating: 4.5,
    category: 'Appliances',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'deal-5',
    asin: 'B08N5WRWNW',
    title: 'MacBook Air M2 Chip 13-inch Laptop',
    currentPrice: 899.99, // Currently on sale
    priceHistory: generatePriceHistory(1199.99, 0.1, 45),
    averagePrice: 0,
    lowestPrice: 0,
    highestPrice: 0,
    reviewCount: 67000,
    rating: 4.8,
    category: 'Electronics',
    lastUpdated: new Date().toISOString()
  }
]

// Combine all sample products
export const allSampleProducts: ProductData[] = [
  ...sampleProducts,
  ...sampleDealsProducts
]
