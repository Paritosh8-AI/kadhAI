import os
import io
import socket
from typing import Optional
from dotenv import load_dotenv

load_dotenv(override=True)

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image

from kadhai_ai.schemas.ingredient import PantryScanResult
from kadhai_ai.schemas.recipe import CuisineRegion, DietaryType, Recipe
from kadhai_ai.vision.extractor import IndianKitchenVisionExtractor
from kadhai_ai.agents.state import ChefState
from kadhai_ai.agents.chef_graph import KadhaiChefAgent

app = FastAPI(
    title="kadhAI API",
    description="Backend API for kadhAI - The Indian Kitchen Vision & Recipe Agent",
    version="1.0.0"
)

# Enable CORS for local dev and mobile network devices
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RecipeRequest(BaseModel):
    scan_result: PantryScanResult
    dietary_preference: DietaryType = DietaryType.PURE_VEG
    cuisine_preference: CuisineRegion = CuisineRegion.PAN_INDIAN
    max_cooking_time_minutes: int = 30
    spice_level: str = "Medium Desi"


def get_local_ip():
    """Gets the primary local IPv4 address for phone network pairing."""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"


@app.get("/api/health")
def health():
    has_gemini = bool(os.getenv("GEMINI_API_KEY", "").strip())
    has_groq = bool(os.getenv("GROQ_API_KEY", "").strip())
    return {
        "status": "online",
        "has_gemini": has_gemini,
        "has_groq": has_groq,
        "vision_model": "gemini-3.5-flash",
        "reasoning_model": "groq-gpt-oss-120b" if has_groq else "gemini-3.5-flash"
    }


@app.get("/api/network-info")
def network_info():
    ip = get_local_ip()
    return {
        "local_ip": ip,
        "mobile_app_url": f"http://{ip}:5173"
    }


@app.post("/api/sample-scan")
def sample_scan():
    extractor = IndianKitchenVisionExtractor()
    return extractor._get_fallback_mock_scan()


@app.post("/api/scan")
async def scan_image(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        pil_image = Image.open(io.BytesIO(contents))
        extractor = IndianKitchenVisionExtractor()
        scan_result = extractor.scan_pantry_image(pil_image)
        return scan_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image scan failed: {str(e)}")


@app.post("/api/recipes")
def generate_recipes(req: RecipeRequest):
    try:
        agent = KadhaiChefAgent()
        state = ChefState(
            scan_result=req.scan_result,
            dietary_preference=req.dietary_preference,
            cuisine_preference=req.cuisine_preference,
            max_cooking_time_minutes=req.max_cooking_time_minutes,
            spice_level=req.spice_level
        )
        final_state = agent.run(state)
        return {
            "recipes": final_state.generated_recipes,
            "quick_commerce_summary": final_state.quick_commerce_summary
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recipe generation failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
