from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User
import hashlib
from jose import jwt
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter

router = APIRouter()

SECRET_KEY = "secret123"
ALGORITHM = "HS256"

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Simple password hashing (BEGINNER SAFE)
def hash_password(password: str):
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str):
    return hash_password(password) == hashed

def create_token(user: User):
    payload = {
        "sub": user.username,
        "is_admin": user.is_admin,
        "exp": datetime.now(timezone.utc) + timedelta(hours=1)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)



    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


@router.post("/register")
def register(username: str, password: str, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = User(
        username=username,
        hashed_password=hash_password(password)
    )
    db.add(new_user)
    db.commit()
    return {"message": "User registered successfully"}


@router.post("/login")
def login(username: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()

    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token(user)

    return {"access_token": token}
from fastapi import Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user
def admin_required(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )
    return current_user
@router.post("/make-admin")
def make_admin(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_admin = True
    db.commit()
    return {"message": f"{username} is now admin"}
from fastapi import Depends

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "username": current_user.username,
        "is_admin": current_user.is_admin
    }
from fastapi import Depends
from models import User

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "username": current_user.username,
        "is_admin": current_user.is_admin
    }

