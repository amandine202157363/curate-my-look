from pydantic import BaseModel
from typing import List, Optional

class OutfitItem(BaseModel):
    """One clothing item selected by the shopper."""
    id: str          # e.g. "t1", "p2" — the brand's product ID
    name: str        # "White Linen Tee"
    category: str    # "tops" | "bottoms" | "shoes" | "accessories"
    image_url: str   # product photo URL, used as input to image generation
    price: float
    cart_id: str     # whatever ID the brand's cart system needs (SKU, variant ID, etc.)

class GenerateRequest(BaseModel):
    """
    What the widget sends when the shopper clicks 'Generate Look'.
    items is a list of the selected OutfitItems.
    """
    items: List[OutfitItem]

class GenerateResponse(BaseModel):
    """What we send back to the widget."""
    outfit_key: str       # e.g. "t1_p2_s3" — the cache key
    image_url: str        # the AI-generated (or cached) outfit image
    cached: bool          # True = we already had this combo, False = freshly generated

class CartRequest(BaseModel):
    """Sent when the shopper clicks 'Add to Cart'."""
    items: List[OutfitItem]

class CartResponse(BaseModel):
    success: bool
    message: Optional[str] = None
