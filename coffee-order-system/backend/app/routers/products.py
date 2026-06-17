from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas import ProductResponse
from app import crud

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("", response_model=List[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    return crud.get_active_products(db)