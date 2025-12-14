from auth import admin_required, get_current_user
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Sweet, User

router = APIRouter()

# -------------------- Database Dependency --------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -------------------- ADD SWEET (PROTECTED) --------------------
@router.post("/sweets")
def add_sweet(
    name: str,
    category: str,
    price: float,
    quantity: str,      # display quantity (e.g. "500 g")
    stock: int,  
    image: str = None,       # numeric stock (e.g. 500)
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sweet = Sweet(
        name=name,
        category=category,
        price=price,
        quantity=quantity,
        stock=stock,
        image=image
    )
    db.add(sweet)
    db.commit()
    db.refresh(sweet)
    return sweet


# -------------------- GET ALL SWEETS (PROTECTED) --------------------
@router.get("/sweets")
def get_sweets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Sweet).all()


# -------------------- UPDATE SWEET (PROTECTED) --------------------
@router.put("/sweets/{sweet_id}")
def update_sweet(
    sweet_id: int,
    name: str,
    category: str,
    price: float,
    quantity: str,
    stock: int,
    image: str = None, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sweet = db.query(Sweet).filter(Sweet.id == sweet_id).first()

    if not sweet:
        raise HTTPException(status_code=404, detail="Sweet not found")

    sweet.name = name
    sweet.category = category
    sweet.price = price
    sweet.quantity = quantity
    sweet.stock = stock
    sweet.image = image 

    db.commit()
    db.refresh(sweet)
    return sweet


# -------------------- DELETE SWEET (ADMIN ONLY) --------------------
@router.delete("/sweets/{sweet_id}")
def delete_sweet(
    sweet_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(admin_required)
):
    sweet = db.query(Sweet).filter(Sweet.id == sweet_id).first()

    if not sweet:
        raise HTTPException(status_code=404, detail="Sweet not found")

    db.delete(sweet)
    db.commit()
    return {"message": "Sweet deleted by admin"}


# -------------------- PURCHASE SWEET (PROTECTED) --------------------
@router.post("/sweets/{sweet_id}/purchase")
def purchase_sweet(
    sweet_id: int,
    quantity: int,      # how much user buys
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sweet = db.query(Sweet).filter(Sweet.id == sweet_id).first()

    if not sweet:
        raise HTTPException(status_code=404, detail="Sweet not found")

    if sweet.stock < quantity:
        raise HTTPException(status_code=400, detail="Not enough stock available")

    sweet.stock -= quantity
    db.commit()
    db.refresh(sweet)

    return {
        "message": "Purchase successful",
        "remaining_quantity": sweet.quantity
    }


# -------------------- RESTOCK SWEET (ADMIN ONLY) --------------------
@router.post("/sweets/{sweet_id}/restock")
def restock_sweet(
    sweet_id: int,
    quantity: int,      # how much admin adds
    db: Session = Depends(get_db),
    admin: User = Depends(admin_required)
):
    sweet = db.query(Sweet).filter(Sweet.id == sweet_id).first()

    if not sweet:
        raise HTTPException(status_code=404, detail="Sweet not found")

    sweet.stock += quantity
    db.commit()
    db.refresh(sweet)

    return {
        "message": "Sweet restocked successfully",
        "new_quantity": sweet.quantity
    }
