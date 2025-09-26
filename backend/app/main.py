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
    allow_origins=["https://yourdomain.com", "http://localhost:3000", "http://localhost:8000"],
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
        from app.models.price_data import Product, PriceData
        product = db.query(Product).filter(Product.asin == asin).first()
        
        if not product:
            # Fetch from Amazon API
            from app.services.amazon_api import amazon_api
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
        trending_with_affiliate = affiliate_manager.create_affiliate_urls_batch(trending, "trending")
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
