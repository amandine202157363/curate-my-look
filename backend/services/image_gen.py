"""
AI image generation lives here.

The function generate_outfit_image() takes the selected items and returns
raw PNG bytes. Everything else (caching, storage) is handled in main.py.

We support three providers — swap via IMAGE_GEN_PROVIDER in .env:
  - huggingface  (free tier, Stable Diffusion, ~20-40s, no credit card)
  - replicate    (Stable Diffusion models, ~$0.003/image, async)
  - openai       (DALL-E 3, ~$0.04/image)

Only the selected provider's code actually runs; the others stay idle.
"""
import httpx
import base64
from config import IMAGE_GEN_API_KEY, IMAGE_GEN_PROVIDER


def _build_prompt(items: list) -> str:
    """
    Turn the list of selected items into a text prompt for the image model.
    The more descriptive the item names, the better the output.
    """
    descriptions = [f"{item.name} ({item.category})" for item in items]
    item_list = ", ".join(descriptions)
    return (
        f"A full-body fashion photo of a person wearing {item_list}. "
        "Studio lighting, clean white background, professional fashion photography."
    )


async def generate_outfit_image(items: list) -> bytes:
    """
    Calls the AI API and returns the generated image as raw bytes (PNG).
    Raises an exception if the API call fails — main.py handles that.
    """
    prompt = _build_prompt(items)

    if IMAGE_GEN_PROVIDER == "openai":
        return await _generate_openai(prompt)
    elif IMAGE_GEN_PROVIDER == "replicate":
        return await _generate_replicate(prompt)
    elif IMAGE_GEN_PROVIDER == "huggingface":
        return await _generate_huggingface(prompt)
    else:
        return await _generate_pollinations(prompt)


async def _generate_openai(prompt: str) -> bytes:
    """Uses DALL-E 3. Returns a PNG as bytes."""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.openai.com/v1/images/generations",
            headers={"Authorization": f"Bearer {IMAGE_GEN_API_KEY}"},
            json={
                "model": "dall-e-3",
                "prompt": prompt,
                "n": 1,
                "size": "1024x1024",
                "response_format": "b64_json",  # get bytes directly, no temp URL
            },
            timeout=60,
        )
        response.raise_for_status()
        b64 = response.json()["data"][0]["b64_json"]
        return base64.b64decode(b64)


async def _generate_replicate(prompt: str) -> bytes:
    """
    Uses Replicate's Stable Diffusion API.
    Replicate is async: we POST to start a job, then poll until it's done.
    """
    async with httpx.AsyncClient() as client:
        # Step 1: start the prediction
        start = await client.post(
            "https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions",
            headers={
                "Authorization": f"Bearer {IMAGE_GEN_API_KEY}",
                "Content-Type": "application/json",
            },
            json={"input": {"prompt": prompt}},
            timeout=30,
        )
        start.raise_for_status()
        prediction = start.json()
        poll_url = prediction["urls"]["get"]

        # Step 2: poll until status is "succeeded" or "failed"
        import asyncio
        for _ in range(30):  # max ~60 seconds
            await asyncio.sleep(2)
            poll = await client.get(
                poll_url,
                headers={"Authorization": f"Bearer {IMAGE_GEN_API_KEY}"},
                timeout=10,
            )
            poll.raise_for_status()
            data = poll.json()
            if data["status"] == "succeeded":
                image_url = data["output"][0]
                # Fetch the actual image bytes from the returned URL
                img_response = await client.get(image_url, timeout=30)
                img_response.raise_for_status()
                return img_response.content
            elif data["status"] == "failed":
                raise RuntimeError(f"Replicate prediction failed: {data.get('error')}")

        raise TimeoutError("Replicate prediction did not complete in time")


async def _generate_huggingface(prompt: str) -> bytes:
    """
    Uses Hugging Face's free Inference API with Stable Diffusion.

    The free tier has one quirk: if the model hasn't been used recently it
    goes to "sleep" to save resources. The first request wakes it up but
    gets a 503 with an estimated_time field. We just wait and retry — the
    model is usually ready within 20-40 seconds.
    """
    import asyncio

    # stabilityai/stable-diffusion-xl-base-1.0 is free and produces
    # good quality 1024x1024 images. We can swap this for any other
    # text-to-image model on Hugging Face without changing anything else.
    MODEL = "stabilityai/stable-diffusion-xl-base-1.0"
    URL = f"https://api-inference.huggingface.co/models/{MODEL}"
    HEADERS = {"Authorization": f"Bearer {IMAGE_GEN_API_KEY}"}

    async with httpx.AsyncClient() as client:
        for attempt in range(10):  # retry up to 10 times (covers cold-start wait)
            response = await client.post(
                URL,
                headers=HEADERS,
                json={"inputs": prompt},
                timeout=60,
            )

            if response.status_code == 200:
                # Success — the response body IS the raw image bytes
                return response.content

            if response.status_code == 503:
                # Model is loading (cold start). The response tells us how long to wait.
                try:
                    wait = response.json().get("estimated_time", 20)
                except Exception:
                    wait = 20
                print(f"[CBY] HuggingFace model loading, waiting {wait}s (attempt {attempt + 1}/10)...")
                await asyncio.sleep(min(wait, 30))  # wait, but cap at 30s per retry
                continue

            # Any other error — raise immediately
            response.raise_for_status()

        raise TimeoutError("Hugging Face model did not become ready in time. Try again in a minute.")


async def _generate_pollinations(prompt: str) -> bytes:
    """
    Uses Pollinations.ai — completely free, no API key, no account needed.
    A single GET request returns the image bytes directly.
    The prompt just needs to be URL-encoded (urllib handles that).
    """
    from urllib.parse import quote

    url = (
        f"https://image.pollinations.ai/prompt/{quote(prompt)}"
        "?width=768&height=768&model=flux&nologo=true"
    )

    async with httpx.AsyncClient() as client:
        response = await client.get(url, timeout=60, follow_redirects=True)
        response.raise_for_status()
        return response.content
