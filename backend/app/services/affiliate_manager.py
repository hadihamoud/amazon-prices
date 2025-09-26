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
