from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine
import models
from sweets import router as sweets_router
from auth import router as auth_router

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# =======================
# CORS CONFIG (IMPORTANT)
# =======================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://sweet-shop-management-system-alpha.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =======================
# ROUTERS
# =======================
app.include_router(auth_router)
app.include_router(sweets_router)

# =======================
# HEALTH CHECK
# =======================
@app.get("/")
def home():
    return {"message": "Sweet Shop API running"}
