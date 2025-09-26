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
