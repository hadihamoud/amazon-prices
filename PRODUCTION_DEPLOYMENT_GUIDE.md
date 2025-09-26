# 🚀 Zobda Production Deployment Guide - Complete Step-by-Step

## 📋 Prerequisites Checklist

### **Required Accounts & Credentials**
- [ ] **Amazon Associates Account** (with tracking ID)
- [ ] **Amazon Product Advertising API** (PA-API 5.0) credentials
- [ ] **Domain name** (e.g., zobda.com)
- [ ] **GitHub account** (for code repository)
- [ ] **Vercel account** (for frontend hosting)
- [ ] **Railway account** (for backend hosting)

### **API Credentials Needed**
```
Amazon Associates:
- Tracking ID: your-tracking-id-20
- Associate Tag: your-associate-tag

Amazon PA-API 5.0:
- Access Key: AKIA...
- Secret Key: ...
- Region: us-east-1 (or your region)
- Partner Tag: your-partner-tag
```

## 🏗️ Phase 1: Backend Setup & Amazon Integration

### **Step 1: Set Up Backend Environment**

#### **1.1 Create Production Backend Structure**
```bash
cd backend
mkdir -p app/services app/models app/schemas app/utils
touch app/services/amazon_api.py
touch app/services/price_tracker.py
touch app/services/affiliate_manager.py
touch app/models/price_data.py
touch app/schemas/amazon.py
touch app/utils/helpers.py
```

#### **1.2 Install Required Dependencies**
```bash
# Create requirements.txt
cat > requirements.txt << EOF
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
alembic==1.12.1
psycopg2-binary==2.9.9
httpx==0.25.2
python-dotenv==1.0.0
pydantic==2.5.0
python-multipart==0.0.6
celery==5.3.4
redis==5.0.1
boto3==1.34.0
python-dateutil==2.8.2
croniter==1.4.1
requests==2.31.0
beautifulsoup4==4.12.2
lxml==4.9.3
EOF

pip install -r requirements.txt
```

### **Step 2: Amazon API Integration**

#### **2.1 Create Amazon API Service**
```python
# backend/app/services/amazon_api.py
import httpx
import hmac
import hashlib
import base64
import json
from datetime import datetime
from typing import Dict, List, Optional
import os
from app.schemas.amazon import AmazonProduct, PriceInfo

class AmazonAPI:
    def __init__(self):
        self.access_key = os.getenv("AMAZON_ACCESS_KEY")
        self.secret_key = os.getenv("AMAZON_SECRET_KEY")
        self.partner_tag = os.getenv("AMAZON_PARTNER_TAG")
        self.region = os.getenv("AMAZON_REGION", "us-east-1")
        self.host = f"webservices.amazon.{self.region}.amazon.com"
        self.associate_tag = os.getenv("AMAZON_ASSOCIATE_TAG")
        
    def _generate_signature(self, method: str, uri: str, query_string: str, payload: str) -> str:
        """Generate AWS signature for PA-API requests"""
        algorithm = "AWS4-HMAC-SHA256"
        service = "ProductAdvertisingAPI"
        
        # Create canonical request
        canonical_uri = uri
        canonical_querystring = query_string
        canonical_headers = f"host:{self.host}\nx-amz-date:{datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')}\n"
        signed_headers = "host;x-amz-date"
        payload_hash = hashlib.sha256(payload.encode()).hexdigest()
        
        canonical_request = f"{method}\n{canonical_uri}\n{canonical_querystring}\n{canonical_headers}\n{signed_headers}\n{payload_hash}"
        
        # Create string to sign
        credential_scope = f"{datetime.utcnow().strftime('%Y%m%d')}/{self.region}/{service}/aws4_request"
        string_to_sign = f"{algorithm}\n{datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')}\n{credential_scope}\n{hashlib.sha256(canonical_request.encode()).hexdigest()}"
        
        # Calculate signature
        signing_key = self._get_signature_key(self.secret_key, datetime.utcnow().strftime('%Y%m%d'), self.region, service)
        signature = hmac.new(signing_key, string_to_sign.encode(), hashlib.sha256).hexdigest()
        
        return f"{algorithm} Credential={self.access_key}/{credential_scope}, SignedHeaders={signed_headers}, Signature={signature}"
    
    def _get_signature_key(self, key: str, date_stamp: str, region_name: str, service_name: str) -> bytes:
        """Generate signing key for AWS signature"""
        k_date = hmac.new(f"AWS4{key}".encode(), date_stamp.encode(), hashlib.sha256).digest()
        k_region = hmac.new(k_date, region_name.encode(), hashlib.sha256).digest()
        k_service = hmac.new(k_region, service_name.encode(), hashlib.sha256).digest()
        k_signing = hmac.new(k_service, "aws4_request".encode(), hashlib.sha256).digest()
        return k_signing
    
    async def get_product_info(self, asin: str) -> Optional[AmazonProduct]:
        """Get product information from Amazon PA-API"""
        try:
            url = f"https://{self.host}/paapi5/getitems"
            
            payload = {
                "PartnerTag": self.partner_tag,
                "PartnerType": "Associates",
                "Marketplace": "www.amazon.com",
                "ItemIds": [asin],
                "Resources": [
                    "ItemInfo.Title",
                    "ItemInfo.ByLineInfo",
                    "ItemInfo.Classifications",
                    "ItemInfo.ExternalIds",
                    "ItemInfo.Features",
                    "ItemInfo.ManufactureInfo",
                    "ItemInfo.ProductInfo",
                    "ItemInfo.TechnicalInfo",
                    "Images.Primary.Large",
                    "Images.Variants",
                    "Offers.Listings.Price",
                    "Offers.Listings.Availability",
                    "Offers.Listings.Condition",
                    "Offers.Listings.DeliveryInfo",
                    "Offers.Listings.MerchantInfo",
                    "Offers.Summaries.HighestPrice",
                    "Offers.Summaries.LowestPrice",
                    "Offers.Summaries.OfferCount"
                ]
            }
            
            headers = {
                "Content-Type": "application/json; charset=UTF-8",
                "X-Amz-Date": datetime.utcnow().strftime('%Y%m%dT%H%M%SZ'),
                "Authorization": self._generate_signature("POST", "/paapi5/getitems", "", json.dumps(payload))
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=payload, headers=headers)
                
                if response.status_code == 200:
                    data = response.json()
                    return self._parse_product_data(data, asin)
                else:
                    print(f"Amazon API Error: {response.status_code} - {response.text}")
                    return None
                    
        except Exception as e:
            print(f"Error fetching product info: {e}")
            return None
    
    def _parse_product_data(self, data: dict, asin: str) -> Optional[AmazonProduct]:
        """Parse Amazon API response into our product format"""
        try:
            if "ItemsResult" not in data or "Items" not in data["ItemsResult"]:
                return None
                
            item = data["ItemsResult"]["Items"][0]
            
            # Extract basic info
            title = item.get("ItemInfo", {}).get("Title", {}).get("DisplayValue", "")
            brand = item.get("ItemInfo", {}).get("ByLineInfo", {}).get("Brand", {}).get("DisplayValue", "")
            
            # Extract images
            primary_image = item.get("Images", {}).get("Primary", {}).get("Large", {}).get("URL", "")
            
            # Extract price info
            price_info = self._extract_price_info(item)
            
            # Create affiliate URL
            affiliate_url = f"https://www.amazon.com/dp/{asin}?tag={self.associate_tag}&linkCode=ur2&linkId=your-link-id"
            
            return AmazonProduct(
                asin=asin,
                title=title,
                brand=brand,
                image_url=primary_image,
                price_info=price_info,
                affiliate_url=affiliate_url,
                last_updated=datetime.utcnow()
            )
            
        except Exception as e:
            print(f"Error parsing product data: {e}")
            return None
    
    def _extract_price_info(self, item: dict) -> PriceInfo:
        """Extract price information from Amazon API response"""
        try:
            offers = item.get("Offers", {})
            listings = offers.get("Listings", [])
            
            if not listings:
                return PriceInfo(current_price=0, original_price=0, availability="OutOfStock")
            
            listing = listings[0]
            price = listing.get("Price", {})
            
            current_price = float(price.get("Amount", 0))
            original_price = current_price  # Amazon doesn't always provide original price
            
            # Check for savings
            summaries = offers.get("Summaries", [])
            if summaries:
                highest_price = summaries[0].get("HighestPrice", {}).get("Amount", 0)
                if highest_price and highest_price > current_price:
                    original_price = float(highest_price)
            
            availability = listing.get("Availability", {}).get("Message", "InStock")
            
            return PriceInfo(
                current_price=current_price,
                original_price=original_price,
                availability=availability,
                currency="USD"
            )
            
        except Exception as e:
            print(f"Error extracting price info: {e}")
            return PriceInfo(current_price=0, original_price=0, availability="Error")
    
    def create_affiliate_url(self, asin: str, custom_params: dict = None) -> str:
        """Create Amazon Associates affiliate URL"""
        base_url = f"https://www.amazon.com/dp/{asin}"
        
        params = {
            "tag": self.associate_tag,
            "linkCode": "ur2",
            "linkId": "your-link-id",
            "ref_": "as_li_ss_tl"
        }
        
        if custom_params:
            params.update(custom_params)
        
        query_string = "&".join([f"{k}={v}" for k, v in params.items()])
        return f"{base_url}?{query_string}"

# Global instance
amazon_api = AmazonAPI()
```

#### **2.2 Create Price Tracking Service**
```python
# backend/app/services/price_tracker.py
import asyncio
from datetime import datetime, timedelta
from typing import List, Dict
from app.services.amazon_api import amazon_api
from app.models.price_data import PriceData, Product
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
    
    async def _save_price_data(self, asin: str, product_info):
        """Save price data to database"""
        try:
            # Check if product exists
            product = self.db.query(Product).filter(Product.asin == asin).first()
            
            if not product:
                # Create new product
                product = Product(
                    asin=asin,
                    title=product_info.title,
                    brand=product_info.brand,
                    image_url=product_info.image_url,
                    affiliate_url=product_info.affiliate_url,
                    created_at=datetime.utcnow()
                )
                self.db.add(product)
                self.db.commit()
            
            # Save price data
            price_data = PriceData(
                product_id=product.id,
                asin=asin,
                current_price=product_info.price_info.current_price,
                original_price=product_info.price_info.original_price,
                currency=product_info.price_info.currency,
                availability=product_info.price_info.availability,
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
                    "date": data.tracked_at.isoformat(),
                    "price": float(data.current_price),
                    "original_price": float(data.original_price),
                    "availability": data.availability
                }
                for data in price_data
            ]
            
        except Exception as e:
            print(f"Error getting price history for {asin}: {e}")
            return []
    
    async def get_trending_products(self, limit: int = 10) -> List[Dict]:
        """Get trending products based on price drops"""
        try:
            # Get products with recent price drops
            trending = self.db.query(Product, PriceData).join(PriceData).filter(
                PriceData.tracked_at >= datetime.utcnow() - timedelta(days=7)
            ).order_by(PriceData.tracked_at.desc()).limit(limit).all()
            
            return [
                {
                    "asin": product.asin,
                    "title": product.title,
                    "brand": product.brand,
                    "image_url": product.image_url,
                    "affiliate_url": product.affiliate_url,
                    "current_price": float(price_data.current_price),
                    "original_price": float(price_data.original_price),
                    "price_drop": float(price_data.original_price - price_data.current_price),
                    "price_drop_percent": float((price_data.original_price - price_data.current_price) / price_data.original_price * 100) if price_data.original_price > 0 else 0
                }
                for product, price_data in trending
            ]
            
        except Exception as e:
            print(f"Error getting trending products: {e}")
            return []

# Global instance
price_tracker = PriceTracker()
```

#### **2.3 Create Affiliate Manager**
```python
# backend/app/services/affiliate_manager.py
from typing import Dict, List
from app.services.amazon_api import amazon_api

class AffiliateManager:
    def __init__(self):
        self.associate_tag = amazon_api.associate_tag
    
    def create_affiliate_url(self, asin: str, source: str = "zobda", campaign: str = "default") -> str:
        """Create affiliate URL with tracking parameters"""
        base_url = f"https://www.amazon.com/dp/{asin}"
        
        params = {
            "tag": self.associate_tag,
            "linkCode": "ur2",
            "linkId": f"zobda-{source}-{campaign}",
            "ref_": "as_li_ss_tl",
            "ascsubtag": f"zobda-{source}-{campaign}-{asin}",
            "creative": "9325",
            "creativeASIN": asin
        }
        
        query_string = "&".join([f"{k}={v}" for k, v in params.items()])
        return f"{base_url}?{query_string}"
    
    def create_affiliate_urls_batch(self, products: List[Dict], source: str = "zobda") -> List[Dict]:
        """Create affiliate URLs for multiple products"""
        return [
            {
                **product,
                "affiliate_url": self.create_affiliate_url(
                    product["asin"], 
                    source, 
                    product.get("campaign", "default")
                )
            }
            for product in products
        ]
    
    def get_affiliate_stats(self) -> Dict:
        """Get affiliate program statistics"""
        return {
            "associate_tag": self.associate_tag,
            "commission_rate": "1-4%",  # Amazon's standard rate
            "cookie_duration": "24 hours",
            "tracking_enabled": True
        }

# Global instance
affiliate_manager = AffiliateManager()
```

### **Step 3: Database Models**

#### **3.1 Create Price Data Models**
```python
# backend/app/models/price_data.py
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    asin = Column(String(20), unique=True, index=True)
    title = Column(String(500))
    brand = Column(String(100))
    image_url = Column(String(1000))
    affiliate_url = Column(String(1000))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    price_data = relationship("PriceData", back_populates="product")

class PriceData(Base):
    __tablename__ = "price_data"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    asin = Column(String(20), index=True)
    current_price = Column(Float)
    original_price = Column(Float)
    currency = Column(String(3), default="USD")
    availability = Column(String(50))
    tracked_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    product = relationship("Product", back_populates="price_data")

class UserWatchlist(Base):
    __tablename__ = "user_watchlists"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(100), index=True)
    asin = Column(String(20), index=True)
    alert_price = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    product = relationship("Product", foreign_keys=[asin], primaryjoin="UserWatchlist.asin == Product.asin")
```

#### **3.2 Create Database Connection**
```python
# backend/app/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./zobda.db")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### **Step 4: API Endpoints**

#### **4.1 Update Main API**
```python
# backend/app/main.py
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.price_tracker import price_tracker
from app.services.affiliate_manager import affiliate_manager
from app.schemas.amazon import AmazonProduct
from typing import List, Dict
import os

app = FastAPI(title="Zobda API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Zobda API is running"}

@app.get("/api/products/{asin}")
async def get_product(asin: str, db: Session = Depends(get_db)):
    """Get product information with affiliate URL"""
    try:
        # Get product from database
        product = db.query(Product).filter(Product.asin == asin).first()
        
        if not product:
            # Fetch from Amazon API
            product_info = await amazon_api.get_product_info(asin)
            if not product_info:
                raise HTTPException(status_code=404, detail="Product not found")
            
            # Create affiliate URL
            affiliate_url = affiliate_manager.create_affiliate_url(asin, "api", "product-detail")
            
            return {
                "asin": asin,
                "title": product_info.title,
                "brand": product_info.brand,
                "image_url": product_info.image_url,
                "affiliate_url": affiliate_url,
                "price_info": product_info.price_info.dict()
            }
        
        # Get latest price data
        latest_price = db.query(PriceData).filter(
            PriceData.product_id == product.id
        ).order_by(PriceData.tracked_at.desc()).first()
        
        return {
            "asin": product.asin,
            "title": product.title,
            "brand": product.brand,
            "image_url": product.image_url,
            "affiliate_url": product.affiliate_url,
            "price_info": {
                "current_price": float(latest_price.current_price) if latest_price else 0,
                "original_price": float(latest_price.original_price) if latest_price else 0,
                "currency": latest_price.currency if latest_price else "USD",
                "availability": latest_price.availability if latest_price else "Unknown"
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/products/{asin}/history")
async def get_price_history(asin: str, days: int = 30):
    """Get price history for a product"""
    try:
        history = await price_tracker.get_price_history(asin, days)
        return {"asin": asin, "history": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/trending")
async def get_trending_products(limit: int = 10):
    """Get trending products with affiliate URLs"""
    try:
        trending = await price_tracker.get_trending_products(limit)
        # Add affiliate URLs
        trending_with_affiliate = affiliate_manager.create_affiliate_urls_batch(tracking, "trending")
        return {"products": trending_with_affiliate}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/track")
async def track_products(asins: List[str]):
    """Track prices for multiple products"""
    try:
        results = await price_tracker.track_product_prices(asins)
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/affiliate/stats")
async def get_affiliate_stats():
    """Get affiliate program statistics"""
    return affiliate_manager.get_affiliate_stats()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## 🌐 Phase 2: Frontend Integration

### **Step 5: Update Frontend for Amazon Integration**

#### **5.1 Create Amazon API Service (Frontend)**
```typescript
// amazon-prices/src/services/amazonApi.ts
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

export interface PriceHistory {
  asin: string;
  history: Array<{
    date: string;
    price: number;
    original_price: number;
    availability: string;
  }>;
}

class AmazonApiService {
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

  async getPriceHistory(asin: string, days: number = 30): Promise<PriceHistory> {
    const response = await fetch(`${this.baseUrl}/api/products/${asin}/history?days=${days}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch price history: ${response.statusText}`);
    }
    return response.json();
  }

  async getTrendingProducts(limit: number = 10): Promise<AmazonProduct[]> {
    const response = await fetch(`${this.baseUrl}/api/trending?limit=${limit}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch trending products: ${response.statusText}`);
    }
    const data = await response.json();
    return data.products;
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

  createAffiliateUrl(asin: string, source: string = 'zobda'): string {
    // This will be handled by the backend, but we can create a fallback
    const associateTag = 'your-associate-tag-20';
    return `https://www.amazon.com/dp/${asin}?tag=${associateTag}&linkCode=ur2&linkId=zobda-${source}`;
  }
}

export const amazonApiService = new AmazonApiService();
```

#### **5.2 Update ProductCard Component**
```typescript
// amazon-prices/src/modules/products/ProductCard.tsx
import React from 'react';
import { Product } from '../../types/Product';
import { amazonApiService } from '../../services/amazonApi';

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
    const affiliateUrl = product.affiliate_url || amazonApiService.createAffiliateUrl(product.asin);
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

## 🚀 Phase 3: Deployment

### **Step 6: Deploy to Production**

#### **6.1 Deploy Backend to Railway**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
cd backend
railway init

# Set environment variables
railway variables set AMAZON_ACCESS_KEY=your_access_key
railway variables set AMAZON_SECRET_KEY=your_secret_key
railway variables set AMAZON_PARTNER_TAG=your_partner_tag
railway variables set AMAZON_ASSOCIATE_TAG=your_associate_tag
railway variables set AMAZON_REGION=us-east-1
railway variables set DATABASE_URL=postgresql://user:pass@host:port/db

# Deploy
railway up
```

#### **6.2 Deploy Frontend to Vercel**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
cd amazon-prices
vercel --prod

# Set environment variables
vercel env add VITE_API_BASE_URL https://your-backend.railway.app
vercel env add VITE_AMAZON_ASSOCIATE_TAG your_associate_tag
```

### **Step 7: Set Up Automated Price Tracking**

#### **7.1 Create Celery Worker for Price Tracking**
```python
# backend/app/worker.py
from celery import Celery
from app.services.price_tracker import price_tracker
from app.database import get_db
from sqlalchemy.orm import Session
import os

# Redis configuration
redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")

celery_app = Celery("zobda_worker", broker=redis_url, backend=redis_url)

@celery_app.task
def track_all_products():
    """Track prices for all products in the database"""
    db = next(get_db())
    try:
        # Get all products
        products = db.query(Product).all()
        asins = [product.asin for product in products]
        
        # Track prices
        results = await price_tracker.track_product_prices(asins)
        
        return {
            "status": "success",
            "tracked": len([r for r in results.values() if r]),
            "failed": len([r for r in results.values() if not r])
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        db.close()

@celery_app.task
def track_specific_products(asins: list):
    """Track prices for specific products"""
    try:
        results = await price_tracker.track_product_prices(asins)
        return {"status": "success", "results": results}
    except Exception as e:
        return {"status": "error", "message": str(e)}
```

#### **7.2 Set Up Cron Jobs**
```python
# backend/app/scheduler.py
from celery.schedules import crontab
from app.worker import celery_app

# Configure periodic tasks
celery_app.conf.beat_schedule = {
    'track-prices-hourly': {
        'task': 'app.worker.track_all_products',
        'schedule': crontab(minute=0),  # Every hour
    },
    'track-trending-daily': {
        'task': 'app.worker.track_specific_products',
        'schedule': crontab(hour=6, minute=0),  # Daily at 6 AM
        'args': (['B08N5W', 'B07XJ8C8F7', 'B08N5W'],)  # Popular ASINs
    },
}
```

## 📊 Phase 4: Monitoring & Analytics

### **Step 8: Set Up Monitoring**

#### **8.1 Add Error Tracking**
```python
# backend/app/monitoring.py
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
import os

def init_sentry():
    sentry_dsn = os.getenv("SENTRY_DSN")
    if sentry_dsn:
        sentry_sdk.init(
            dsn=sentry_dsn,
            integrations=[
                FastApiIntegration(auto_enabling_instrumentations=True),
                SqlalchemyIntegration(),
            ],
            traces_sample_rate=0.1,
            environment=os.getenv("ENVIRONMENT", "production")
        )
```

#### **8.2 Add Performance Monitoring**
```python
# backend/app/performance.py
import time
from functools import wraps
from fastapi import Request
import logging

def monitor_performance(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        start_time = time.time()
        try:
            result = await func(*args, **kwargs)
            execution_time = time.time() - start_time
            logging.info(f"{func.__name__} executed in {execution_time:.2f}s")
            return result
        except Exception as e:
            execution_time = time.time() - start_time
            logging.error(f"{func.__name__} failed after {execution_time:.2f}s: {e}")
            raise
    return wrapper
```

## 🎯 Phase 5: Launch Strategy

### **Step 9: Pre-Launch Checklist**

#### **9.1 Technical Checklist**
- [ ] **Amazon API Integration**: Working and tested
- [ ] **Affiliate Links**: All "View at Amazon" buttons use affiliate URLs
- [ ] **Price Tracking**: Automated price collection working
- [ ] **Database**: Production database with proper indexes
- [ ] **Monitoring**: Error tracking and performance monitoring
- [ ] **Security**: HTTPS, rate limiting, input validation
- [ ] **Performance**: Page load times <2 seconds

#### **9.2 Business Checklist**
- [ ] **Amazon Associates**: Account approved and tracking
- [ ] **Legal**: Privacy policy, terms of service
- [ ] **Analytics**: Google Analytics, conversion tracking
- [ ] **Marketing**: Social media accounts, content ready
- [ ] **Support**: Help documentation, contact info

### **Step 10: Launch Execution**

#### **10.1 Soft Launch (Week 1)**
1. **Deploy to production**
2. **Test all functionality**
3. **Invite 10-20 beta users**
4. **Monitor performance and errors**
5. **Collect feedback and fix issues**

#### **10.2 Public Launch (Week 2)**
1. **Product Hunt submission**
2. **Social media announcement**
3. **Reddit community posts**
4. **Email newsletter launch**
5. **Press release (if applicable)**

## 💰 Revenue Optimization

### **Step 11: Maximize Affiliate Revenue**

#### **11.1 A/B Testing**
- Test different affiliate URL formats
- Test button colors and text
- Test placement of affiliate links

#### **11.2 Conversion Optimization**
- Add urgency indicators ("Limited time offer")
- Show savings amounts prominently
- Add social proof ("X people saved money")

#### **11.3 Content Marketing**
- Create product comparison articles
- Write deal roundup posts
- Share price drop alerts on social media

## 📈 Success Metrics

### **Key Performance Indicators**
- **Revenue**: Monthly affiliate commissions
- **Conversion**: Click-through rate on affiliate links
- **Engagement**: Time spent on site, pages per session
- **Growth**: New users, returning users
- **Technical**: Uptime, response times, error rates

### **Monthly Targets**
- **Month 1**: $50-100 revenue
- **Month 3**: $200-500 revenue
- **Month 6**: $500-1,000 revenue
- **Month 12**: $1,000-2,000 revenue

---

**Total Estimated Cost**: $0-50/month
**Expected Revenue**: $1,000-2,000/month by month 12
**ROI**: 2,000-4,000%

This comprehensive guide will take your Zobda application from development to production with full Amazon integration and affiliate revenue generation! 🚀


