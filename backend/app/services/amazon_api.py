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
