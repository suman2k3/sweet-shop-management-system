from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI
from database import engine
import models
from sweets import router as sweets_router
from auth import router as auth_router

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
                   "http://192.168.1.5:5173",
                   "https://sweetsshopproject.netlify.app"],
        # frontend URL
   

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(sweets_router)


@app.get("/")
def home():
    return {"message": "Sweet Shop API running"}
from fastapi import Depends
from models import User
