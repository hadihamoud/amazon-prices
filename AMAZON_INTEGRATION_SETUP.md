# 🛒 Amazon Integration Setup Guide

## 📋 Prerequisites

### **Required Amazon Accounts**
1. **Amazon Associates Account**
   - Apply at: https://associates.amazon.com
   - Get your Associate Tag (e.g., `yourname-20`)
   - Commission rate: 1-4% depending on category

2. **Amazon Product Advertising API (PA-API 5.0)**
   - Apply at: https://webservices.amazon.com/paapi5/documentation/
   - Get Access Key, Secret Key, and Partner Tag
   - Rate limit: 8,640 requests/day (free tier)

## 🔧 Step-by-Step Integration

### **Step 1: Set Up Amazon Associates**

#### **1.1 Create Associates Account**
```
1. Go to https://associates.amazon.com
2. Click "Join Now for Free"
3. Fill out application form
4. Wait for approval (1-3 days)
5. Get your Associate Tag
```

#### **1.2 Configure Associate Settings**
```
Associate Tag: yourname-20
Commission Rate: 1-4% (varies by category)
Cookie Duration: 24 hours
Tracking: Enabled
```

### **Step 2: Set Up Product Advertising API**

#### **2.1 Apply for PA-API Access**
```
1. Go to https://webservices.amazon.com/paapi5/documentation/
2. Click "Get Started"
3. Fill out application form
4. Wait for approval (1-7 days)
5. Get your API credentials
```

#### **2.2 API Credentials**
```
Access Key: AKIA...
Secret Key: ...
Partner Tag: your-partner-tag
Region: us-east-1 (or your region)
Marketplace: www.amazon.com
```

### **Step 3: Backend Integration**

#### **3.1 Install Required Packages**
```bash
cd backend
pip install boto3 python-dateutil requests beautifulsoup4
```

#### **3.2 Create Amazon API Service**
```python
# backend/app/services/amazon_api.py
import boto3
import json
from datetime import datetime
from typing import Dict, List, Optional
import os

class AmazonAPI:
    def __init__(self):
        self.access_key = os.getenv("AMAZON_ACCESS_KEY")
        self.secret_key = os.getenv("AMAZON_SECRET_KEY")
        self.partner_tag = os.getenv("AMAZON_PARTNER_TAG")
        self.region = os.getenv("AMAZON_REGION", "us-east-1")
        self.associate_tag = os.getenv("AMAZON_ASSOCIATE_TAG")
        
        # Initialize PA-API client
        self.client = boto3.client(
            'paapi5',
            region_name=self.region,
            aws_access_key_id=self.access_key,
            aws_secret_access_key=self.secret_key
        )
    
    def get_product_info(self, asin: str) -> Optional[Dict]:
        """Get product information from Amazon PA-API"""
        try:
            response = self.client.get_items(
                PartnerTag=self.partner_tag,
                PartnerType='Associates',
                Marketplace='www.amazon.com',
                ItemIds=[asin],
                Resources=[
                    'ItemInfo.Title',
                    'ItemInfo.ByLineInfo',
                    'ItemInfo.Classifications',
                    'ItemInfo.ExternalIds',
                    'ItemInfo.Features',
                    'ItemInfo.ManufactureInfo',
                    'ItemInfo.ProductInfo',
                    'ItemInfo.TechnicalInfo',
                    'Images.Primary.Large',
                    'Images.Variants',
                    'Offers.Listings.Price',
                    'Offers.Listings.Availability',
                    'Offers.Listings.Condition',
                    'Offers.Listings.DeliveryInfo',
                    'Offers.Listings.MerchantInfo',
                    'Offers.Summaries.HighestPrice',
                    'Offers.Summaries.LowestPrice',
                    'Offers.Summaries.OfferCount'
                ]
            )
            
            if 'ItemsResult' in response and 'Items' in response['ItemsResult']:
                return self._parse_product_data(response['ItemsResult']['Items'][0], asin)
            return None
            
        except Exception as e:
            print(f"Error fetching product info: {e}")
            return None
    
    def _parse_product_data(self, item: Dict, asin: str) -> Dict:
        """Parse Amazon API response into our format"""
        try:
            # Extract basic info
            title = item.get('ItemInfo', {}).get('Title', {}).get('DisplayValue', '')
            brand = item.get('ItemInfo', {}).get('ByLineInfo', {}).get('Brand', {}).get('DisplayValue', '')
            
            # Extract images
            primary_image = item.get('Images', {}).get('Primary', {}).get('Large', {}).get('URL', '')
            
            # Extract price info
            price_info = self._extract_price_info(item)
            
            # Create affiliate URL
            affiliate_url = self.create_affiliate_url(asin)
            
            return {
                'asin': asin,
                'title': title,
                'brand': brand,
                'image_url': primary_image,
                'affiliate_url': affiliate_url,
                'price_info': price_info,
                'last_updated': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            print(f"Error parsing product data: {e}")
            return None
    
    def _extract_price_info(self, item: Dict) -> Dict:
        """Extract price information from Amazon API response"""
        try:
            offers = item.get('Offers', {})
            listings = offers.get('Listings', [])
            
            if not listings:
                return {
                    'current_price': 0,
                    'original_price': 0,
                    'availability': 'OutOfStock',
                    'currency': 'USD'
                }
            
            listing = listings[0]
            price = listing.get('Price', {})
            
            current_price = float(price.get('Amount', 0))
            original_price = current_price
            
            # Check for savings
            summaries = offers.get('Summaries', [])
            if summaries:
                highest_price = summaries[0].get('HighestPrice', {}).get('Amount', 0)
                if highest_price and highest_price > current_price:
                    original_price = float(highest_price)
            
            availability = listing.get('Availability', {}).get('Message', 'InStock')
            
            return {
                'current_price': current_price,
                'original_price': original_price,
                'availability': availability,
                'currency': 'USD'
            }
            
        except Exception as e:
            print(f"Error extracting price info: {e}")
            return {
                'current_price': 0,
                'original_price': 0,
                'availability': 'Error',
                'currency': 'USD'
            }
    
    def create_affiliate_url(self, asin: str, custom_params: Dict = None) -> str:
        """Create Amazon Associates affiliate URL"""
        base_url = f"https://www.amazon.com/dp/{asin}"
        
        params = {
            'tag': self.associate_tag,
            'linkCode': 'ur2',
            'linkId': 'your-link-id',
            'ref_': 'as_li_ss_tl'
        }
        
        if custom_params:
            params.update(custom_params)
        
        query_string = '&'.join([f"{k}={v}" for k, v in params.items()])
        return f"{base_url}?{query_string}"
    
    def create_affiliate_urls_batch(self, products: List[Dict], source: str = 'zobda') -> List[Dict]:
        """Create affiliate URLs for multiple products"""
        return [
            {
                **product,
                'affiliate_url': self.create_affiliate_url(
                    product['asin'], 
                    {'ascsubtag': f'zobda-{source}-{product["asin"]}'}
                )
            }
            for product in products
        ]

# Global instance
amazon_api = AmazonAPI()
```

#### **3.3 Create Price Tracking Service**
```python
# backend/app/services/price_tracker.py
import asyncio
from datetime import datetime, timedelta
from typing import List, Dict
from app.services.amazon_api import amazon_api
from app.database import get_db
from sqlalchemy.orm import Session

class PriceTracker:
    def __init__(self):
        self.db = next(get_db())
    
    async def track_product_prices(self, asins: List[str]) -> Dict[str, bool]:
        """Track prices for multiple products"""
        results = {}
        
        for asin in asins:
            try:
                # Get current product info from Amazon
                product_info = await amazon_api.get_product_info(asin)
                
                if product_info:
                    # Save price data
                    await self._save_price_data(asin, product_info)
                    results[asin] = True
                else:
                    results[asin] = False
                    
            except Exception as e:
                print(f"Error tracking product {asin}: {e}")
                results[asin] = False
        
        return results
    
    async def _save_price_data(self, asin: str, product_info: Dict):
        """Save price data to database"""
        try:
            # Check if product exists
            product = self.db.query(Product).filter(Product.asin == asin).first()
            
            if not product:
                # Create new product
                product = Product(
                    asin=asin,
                    title=product_info['title'],
                    brand=product_info['brand'],
                    image_url=product_info['image_url'],
                    affiliate_url=product_info['affiliate_url'],
                    created_at=datetime.utcnow()
                )
                self.db.add(product)
                self.db.commit()
            
            # Save price data
            price_data = PriceData(
                product_id=product.id,
                asin=asin,
                current_price=product_info['price_info']['current_price'],
                original_price=product_info['price_info']['original_price'],
                currency=product_info['price_info']['currency'],
                availability=product_info['price_info']['availability'],
                tracked_at=datetime.utcnow()
            )
            
            self.db.add(price_data)
            self.db.commit()
            
        except Exception as e:
            print(f"Error saving price data for {asin}: {e}")
            self.db.rollback()
    
    async def get_price_history(self, asin: str, days: int = 30) -> List[Dict]:
        """Get price history for a product"""
        try:
            product = self.db.query(Product).filter(Product.asin == asin).first()
            if not product:
                return []
            
            start_date = datetime.utcnow() - timedelta(days=days)
            price_data = self.db.query(PriceData).filter(
                PriceData.product_id == product.id,
                PriceData.tracked_at >= start_date
            ).order_by(PriceData.tracked_at).all()
            
            return [
                {
                    'date': data.tracked_at.isoformat(),
                    'price': float(data.current_price),
                    'original_price': float(data.original_price),
                    'availability': data.availability
                }
                for data in price_data
            ]
            
        except Exception as e:
            print(f"Error getting price history for {asin}: {e}")
            return []

# Global instance
price_tracker = PriceTracker()
```

### **Step 4: Frontend Integration**

#### **4.1 Update ProductCard Component**
```typescript
// amazon-prices/src/modules/products/ProductCard.tsx
import React from 'react';
import { Product } from '../../types/Product';

interface ProductCardProps {
  product: Product;
  onAddToWatchlist?: (product: Product) => void;
  onRemoveFromWatchlist?: (product: Product) => void;
  isInWatchlist?: boolean;
  isAddingToWatchlist?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToWatchlist,
  onRemoveFromWatchlist,
  isInWatchlist = false,
  isAddingToWatchlist = false
}) => {
  const handleViewAtAmazon = () => {
    // Use the affiliate URL from the product
    const affiliateUrl = product.affiliate_url || `https://www.amazon.com/dp/${product.asin}?tag=your-associate-tag-20`;
    window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="card p-4 hover:shadow-zobdaHover transition-shadow">
      <div className="flex flex-col gap-3">
        {/* Product Image */}
        <div className="flex justify-center">
          <img 
            src={product.imageUrl} 
            alt={product.title}
            className="w-full h-48 object-cover rounded-lg"
            loading="lazy"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2">
            {product.title}
          </h3>
          
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-zobda-orange">
              ${product.price.toFixed(2)}
            </span>
            {product.currentPrice && product.currentPrice > product.price && (
              <span className="text-lg text-gray-500 line-through">
                ${product.currentPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Price Drop Badge */}
          {product.currentPrice && product.currentPrice > product.price && (
            <div className="flex items-center gap-1">
              <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-500 text-white">
                Save ${(product.currentPrice - product.price).toFixed(2)}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleViewAtAmazon}
              className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              View at Amazon
            </button>
            
            {isInWatchlist ? (
              <button
                onClick={() => onRemoveFromWatchlist?.(product)}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                disabled={isAddingToWatchlist}
              >
                Remove
              </button>
            ) : (
              <button
                onClick={() => onAddToWatchlist?.(product)}
                className="bg-zobda-orange hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                disabled={isAddingToWatchlist}
              >
                {isAddingToWatchlist ? 'Adding...' : 'Watch'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
```

#### **4.2 Update API Service**
```typescript
// amazon-prices/src/services/api.ts
export interface AmazonProduct {
  asin: string;
  title: string;
  brand: string;
  image_url: string;
  affiliate_url: string;
  price_info: {
    current_price: number;
    original_price: number;
    currency: string;
    availability: string;
  };
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  }

  async getProduct(asin: string): Promise<AmazonProduct> {
    const response = await fetch(`${this.baseUrl}/api/products/${asin}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }
    return response.json();
  }

  async getPriceHistory(asin: string, days: number = 30): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/products/${asin}/history?days=${days}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch price history: ${response.statusText}`);
    }
    return response.json();
  }

  async trackProducts(asins: string[]): Promise<Record<string, boolean>> {
    const response = await fetch(`${this.baseUrl}/api/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(asins),
    });
    if (!response.ok) {
      throw new Error(`Failed to track products: ${response.statusText}`);
    }
    const data = await response.json();
    return data.results;
  }
}

export const apiService = new ApiService();
```

### **Step 5: Environment Configuration**

#### **5.1 Backend Environment Variables**
```env
# .env.production
AMAZON_ACCESS_KEY=AKIA...
AMAZON_SECRET_KEY=...
AMAZON_PARTNER_TAG=your-partner-tag
AMAZON_ASSOCIATE_TAG=your-associate-tag-20
AMAZON_REGION=us-east-1
DATABASE_URL=postgresql://user:pass@host:port/db
```

#### **5.2 Frontend Environment Variables**
```env
# .env.production
VITE_API_BASE_URL=https://your-backend.railway.app
VITE_AMAZON_ASSOCIATE_TAG=your-associate-tag-20
```

### **Step 6: Testing**

#### **6.1 Test Amazon API Integration**
```python
# backend/test_amazon_api.py
import asyncio
from app.services.amazon_api import amazon_api

async def test_amazon_api():
    # Test with a popular product
    asin = "B08N5W"  # iPhone 13 Pro Max
    product = await amazon_api.get_product_info(asin)
    
    if product:
        print(f"Product: {product['title']}")
        print(f"Price: ${product['price_info']['current_price']}")
        print(f"Affiliate URL: {product['affiliate_url']}")
    else:
        print("Failed to fetch product")

if __name__ == "__main__":
    asyncio.run(test_amazon_api())
```

#### **6.2 Test Affiliate Links**
```bash
# Test affiliate URL generation
curl "https://your-backend.railway.app/api/products/B08N5W"
```

### **Step 7: Monitoring & Analytics**

#### **7.1 Track Affiliate Performance**
```python
# backend/app/analytics.py
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.database import get_db

class AffiliateAnalytics:
    def __init__(self):
        self.db = next(get_db())
    
    def track_click(self, asin: str, source: str = 'zobda'):
        """Track affiliate link clicks"""
        click_data = {
            'asin': asin,
            'source': source,
            'timestamp': datetime.utcnow(),
            'ip_address': request.client.host
        }
        # Save to database or analytics service
        pass
    
    def get_click_stats(self, days: int = 30):
        """Get click statistics"""
        start_date = datetime.utcnow() - timedelta(days=days)
        # Query click data from database
        pass
```

#### **7.2 Set Up Conversion Tracking**
```javascript
// Frontend conversion tracking
function trackAffiliateClick(asin, source) {
  // Track click event
  gtag('event', 'affiliate_click', {
    'asin': asin,
    'source': source,
    'event_category': 'affiliate',
    'event_label': 'amazon_link'
  });
  
  // Track in your analytics
  fetch('/api/analytics/click', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ asin, source })
  });
}
```

## 🚀 Deployment Checklist

### **Pre-Deployment**
- [ ] Amazon Associates account approved
- [ ] PA-API access granted
- [ ] API credentials configured
- [ ] Affiliate URLs tested
- [ ] Price tracking working
- [ ] Database schema created

### **Post-Deployment**
- [ ] Monitor API rate limits
- [ ] Track affiliate clicks
- [ ] Monitor conversion rates
- [ ] Check for errors in logs
- [ ] Verify price data accuracy

## 💰 Revenue Optimization

### **Best Practices**
1. **A/B Test Affiliate Links**: Test different URL formats
2. **Optimize Button Placement**: Place "View at Amazon" prominently
3. **Add Urgency**: Show limited-time offers
4. **Social Proof**: Display savings amounts
5. **Mobile Optimization**: Ensure mobile affiliate links work

### **Tracking Metrics**
- Click-through rate on affiliate links
- Conversion rate to Amazon purchases
- Revenue per click
- Top-performing products
- Best traffic sources

---

**This integration will enable Zobda to generate revenue from day 1 through Amazon Associates commissions while providing accurate, real-time price data to users!** 🚀


