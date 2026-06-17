from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas import OrderResponse, OrderStatusUpdate
from app import crud

router = APIRouter(prefix="/admin/orders", tags=["Admin"])

@router.get("", response_model=List[OrderResponse])
def get_all_orders(db: Session = Depends(get_db)):
    return crud.get_all_orders_desc(db)

@router.patch("/{order_id}/status", response_model=OrderResponse)
def update_status(order_id: int, status_update: OrderStatusUpdate, db: Session = Depends(get_db)):
    order = crud.update_order_status(db, order_id, status_update.status)
    if not order:
        raise HTTPException(status_code=404, detail="訂單不存在")
    return order