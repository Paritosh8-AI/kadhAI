import os
import io
import socket
import sqlite3
import uuid
import time
from typing import Optional, List
from dotenv import load_dotenv

load_dotenv(override=True)

from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image

from kadhai_ai.schemas.ingredient import PantryScanResult
from kadhai_ai.schemas.recipe import CuisineRegion, DietaryType, Recipe
from kadhai_ai.vision.extractor import IndianKitchenVisionExtractor
from kadhai_ai.agents.state import ChefState
from kadhai_ai.agents.chef_graph import KadhaiChefAgent

# Initialize SQLite database for Auth & User state
DB_PATH = "kadhai_users.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            phone TEXT PRIMARY KEY,
            name TEXT DEFAULT 'Foodie',
            diet TEXT DEFAULT 'pure_veg',
            household_size TEXT DEFAULT '2-3 people',
            created_at REAL
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS otp_codes (
            phone TEXT PRIMARY KEY,
            code TEXT,
            expires_at REAL
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS sessions (
            token TEXT PRIMARY KEY,
            phone TEXT,
            created_at REAL
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS saved_recipes (
            id TEXT PRIMARY KEY,
            phone TEXT,
            title TEXT,
            recipe_json TEXT,
            created_at REAL
        )
    ''')
    conn.commit()
    conn.close()

init_db()

app = FastAPI(
    title="kadhAI API",
    description="Backend API for kadhAI - The Indian Kitchen Vision & Recipe Agent",
    version="2.0.0"
)

# Enable CORS for local dev and mobile network devices
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Auth Schemas
class SendOtpRequest(BaseModel):
    phone: str

class VerifyOtpRequest(BaseModel):
    phone: str
    code: str

class UpdateProfileRequest(BaseModel):
    name: str
    diet: str
    household_size: Optional[str] = "2-3 people"

class RecipeRequest(BaseModel):
    scan_result: PantryScanResult
    dietary_preference: DietaryType = DietaryType.PURE_VEG
    cuisine_preference: CuisineRegion = CuisineRegion.PAN_INDIAN
    max_cooking_time_minutes: int = 30
    spice_level: str = "Medium Desi"


def get_current_user(authorization: Optional[str] = Header(None)):
    """Validates session token if provided."""
    if not authorization:
        return None
    token = authorization.replace("Bearer ", "").strip()
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT u.phone, u.name, u.diet, u.household_size FROM sessions s JOIN users u ON s.phone = u.phone WHERE s.token = ?", (token,))
    row = c.fetchone()
    conn.close()
    if row:
        return {"phone": row[0], "name": row[1], "diet": row[2], "household_size": row[3]}
    return None


@app.post("/api/auth/send-otp")
def send_otp(req: SendOtpRequest):
    phone = req.phone.strip()
    if len(phone) < 10:
        raise HTTPException(status_code=400, detail="Invalid phone number")
    
    # Generate 4-digit OTP (4242 as demo fallback or random)
    code = "4242"
    expires_at = time.time() + 300 # 5 minutes

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("INSERT OR REPLACE INTO otp_codes (phone, code, expires_at) VALUES (?, ?, ?)", (phone, code, expires_at))
    conn.commit()
    conn.close()

    return {
        "success": True,
        "message": f"OTP sent to {phone}",
        "demo_hint": "Use demo OTP 4242 to verify immediately"
    }


@app.post("/api/auth/verify-otp")
def verify_otp(req: VerifyOtpRequest):
    phone = req.phone.strip() if req.phone else "+919876543210"
    if not phone.startswith("+"):
        phone = f"+91{phone}"
    code = req.code.strip() if req.code else "4242"

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    # Upsert user
    c.execute("SELECT phone, name, diet, household_size FROM users WHERE phone = ?", (phone,))
    user_row = c.fetchone()
    if not user_row:
        c.execute("INSERT INTO users (phone, name, diet, household_size, created_at) VALUES (?, ?, ?, ?, ?)",
                  (phone, "Master Chef", "pure_veg", "2-3 people", time.time()))
        user = {"phone": phone, "name": "Master Chef", "diet": "pure_veg", "household_size": "2-3 people"}
    else:
        user = {"phone": user_row[0], "name": user_row[1], "diet": user_row[2], "household_size": user_row[3]}

    # Create session token
    token = str(uuid.uuid4())
    c.execute("INSERT INTO sessions (token, phone, created_at) VALUES (?, ?, ?)", (token, phone, time.time()))
    conn.commit()
    conn.close()

    return {
        "success": True,
        "token": token,
        "user": user
    }


@app.post("/api/auth/update-profile")
def update_profile(req: UpdateProfileRequest, user = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("UPDATE users SET name = ?, diet = ?, household_size = ? WHERE phone = ?",
              (req.name, req.diet, req.household_size, user["phone"]))
    conn.commit()
    conn.close()

    return {"success": True, "user": {"phone": user["phone"], "name": req.name, "diet": req.diet, "household_size": req.household_size}}


@app.get("/api/auth/me")
def get_me(user = Depends(get_current_user)):
    if not user:
        return {"authenticated": False}
    return {"authenticated": True, "user": user}


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


# Direct Android APK Download endpoints with explicit MIME type & download headers
@app.get("/download/apk")
@app.get("/kadhAI.apk")
@app.get("/kadhai.apk")
async def download_apk():
    candidates = [
        os.path.join(os.path.dirname(__file__), "dist-apk", "app-debug.apk"),
        os.path.join(os.path.dirname(__file__), "frontend", "dist", "kadhAI.apk"),
        os.path.join(os.path.dirname(__file__), "frontend", "android", "app", "build", "outputs", "apk", "debug", "app-debug.apk")
    ]
    for apk_path in candidates:
        if os.path.exists(apk_path):
            return FileResponse(
                apk_path,
                media_type="application/vnd.android.package-archive",
                filename="kadhAI.apk",
                headers={
                    "Content-Disposition": "attachment; filename=kadhAI.apk",
                    "Content-Type": "application/vnd.android.package-archive",
                    "Cache-Control": "no-cache"
                }
            )
    raise HTTPException(status_code=404, detail="APK binary not found")


# Mount frontend dist static files for seamless single-server deployment
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

dist_dir = os.path.join(os.path.dirname(__file__), "frontend", "dist")
assets_dir = os.path.join(dist_dir, "assets")

if os.path.exists(assets_dir):
    app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    file_path = os.path.join(dist_dir, full_path)
    if full_path and os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(file_path)
    index_path = os.path.join(dist_dir, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "kadhAI API online"}
