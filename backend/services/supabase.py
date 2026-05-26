"""
All communication with Supabase lives here.

Supabase gives us two things:
  1. A Postgres database — we use it to store the outfit_key → image_url mapping.
  2. Storage — we use it like an S3 bucket to store the generated image files.

The supabase-py client wraps both with a clean Python API.
"""
from typing import Optional
from supabase import create_client, Client
from config import SUPABASE_URL, SUPABASE_SERVICE_KEY, STORAGE_BUCKET

# We create one client at module load time and reuse it.
# "Service key" gives full access (bypasses row-level security) — keep it secret,
# only use it server-side, never expose it to the browser.
_client: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def get_cached_image(outfit_key: str) -> Optional[str]:
    """
    Look up an already-generated outfit image by its combination key.
    Returns the public image URL if found, or None if this combo is new.
    """
    # .limit(1) + checking result.data is more reliable than .maybe_single()
    # which throws an APIError on empty results in some supabase-py versions.
    result = (
        _client.table("outfit_cache")
        .select("image_url")
        .eq("outfit_key", outfit_key)
        .limit(1)
        .execute()
    )
    if result.data:
        return result.data[0]["image_url"]
    return None


def save_outfit_image(outfit_key: str, image_bytes: bytes) -> str:
    """
    Upload image_bytes to Supabase Storage, then save the public URL
    to the outfit_cache table so future requests can skip generation.
    Returns the public URL of the stored image.
    """
    file_path = f"{outfit_key}.png"

    _client.storage.from_(STORAGE_BUCKET).upload(
        path=file_path,
        file=image_bytes,
        file_options={"content-type": "image/png"},
    )

    public_url = _client.storage.from_(STORAGE_BUCKET).get_public_url(file_path)

    _client.table("outfit_cache").insert({
        "outfit_key": outfit_key,
        "image_url": public_url,
    }).execute()

    return public_url
