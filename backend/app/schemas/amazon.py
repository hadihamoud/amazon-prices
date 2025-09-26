from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PriceInfo(BaseModel):
    current_price: float
    original_price: float
    currency: str = "USD"
    availability: str = "InStock"

class AmazonProduct(BaseModel):
    asin: str
    title: str
    brand: str
    image_url: str
    price_info: PriceInfo
    affiliate_url: str
    last_updated: datetime
