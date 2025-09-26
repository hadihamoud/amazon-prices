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
