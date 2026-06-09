"""
The FastAPI backend for CBY.

FastAPI is a Python web framework that lets you define HTTP endpoints as
plain functions. It handles parsing JSON bodies, validating types (via
the models.py Pydantic classes), and returning JSON responses.

To run locally:
    uvicorn main:app --reload --port 8000

--reload means it auto-restarts when you save a file. Great for dev.
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from config import ALLOWED_ORIGINS
from models import GenerateRequest, GenerateResponse, CartRequest, CartResponse
from services.image_gen import generate_outfit_image
from services.supabase import get_cached_image, save_outfit_image

app = FastAPI(title="CBY API", version="0.1.0")

# Serve the bundled widget JS file at /widget/cby.js
# This is what brands embed: <script src="https://your-railway-url/widget/cby.js">
# The path "../widget/dist" is relative to the backend/ folder.
_widget_dist = os.path.join(os.path.dirname(__file__), "..", "widget", "dist")
if os.path.isdir(_widget_dist):
    app.mount("/widget", StaticFiles(directory=_widget_dist), name="widget")

# CORS = Cross-Origin Resource Sharing.
# Browsers block JS on site-A from calling an API on site-B unless the API
# explicitly says "that's fine". This middleware adds the magic headers.
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


def build_outfit_key(items: list) -> str:
    """
    Turn the selected items into a stable string key used for caching.
    We sort by category so t1_p2 and p2_t1 produce the same key.
    e.g. items with ids t1, p2, s3 → "t1_p2_s3"
    """
    sorted_ids = sorted(item.id for item in items)
    return "_".join(sorted_ids)


@app.get("/health")
def health():
    """Quick endpoint to confirm the server is running."""
    return {"status": "ok"}


@app.post("/generate", response_model=GenerateResponse)
async def generate(request: GenerateRequest):
    """
    Main endpoint. Called by the widget when the shopper clicks 'Generate Look'.

    Flow:
      1. Build a cache key from the selected item IDs.
      2. Check Supabase — do we already have an image for this combo?
         Yes → return it immediately (fast, no AI cost).
         No  → call the AI API, upload result to Supabase, save the mapping.
      3. Return the image URL + whether it was cached.
    """
    if not request.items:
        raise HTTPException(status_code=400, detail="No items selected.")

    outfit_key = build_outfit_key(request.items)

    try:
        cached_url = get_cached_image(outfit_key)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Supabase cache lookup failed: {e}")

    if cached_url:
        return GenerateResponse(outfit_key=outfit_key, image_url=cached_url, cached=True)

    try:
        image_bytes = await generate_outfit_image(request.items)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Image generation failed: {e}")

    try:
        image_url = save_outfit_image(outfit_key, image_bytes)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Image storage failed: {e}")

    return GenerateResponse(outfit_key=outfit_key, image_url=image_url, cached=False)


@app.post("/cart", response_model=CartResponse)
async def add_to_cart(request: CartRequest):
    """
    Called when the shopper clicks 'Add to Cart'.

    Important: most e-commerce platforms (Shopify, WooCommerce, etc.) require
    cart mutations to happen client-side via their own JS API, not from a
    third-party server. So this endpoint's job for now is just to validate
    the request and return the item list — the widget's JS does the actual
    cart add using the store's native API.

    We can add server-side order tracking / analytics here later.
    """
    if not request.items:
        raise HTTPException(status_code=400, detail="No items to add.")

    return CartResponse(
        success=True,
        message=f"{len(request.items)} item(s) ready to add to cart.",
    )
