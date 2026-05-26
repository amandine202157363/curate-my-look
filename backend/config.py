import os
from dotenv import load_dotenv

load_dotenv()  # reads .env file into os.environ

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_KEY = os.environ["SUPABASE_SERVICE_KEY"]
IMAGE_GEN_API_KEY = os.environ.get("IMAGE_GEN_API_KEY", "")
IMAGE_GEN_PROVIDER = os.environ.get("IMAGE_GEN_PROVIDER", "replicate")
STORAGE_BUCKET = os.environ.get("STORAGE_BUCKET", "outfit-images")
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "*").split(",")
