from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

class ProductResponse(BaseModel):
    id: int
    name: str
    price: float
    category: str
    is_available: bool
    model_config = ConfigDict(from_attributes=True)

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int
    custom_notes: Optional[str] = None

class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    custom_notes: Optional[str]
    product: ProductResponse
    model_config = ConfigDict(from_attributes=True)

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]

class OrderResponse(BaseModel):
    id: int
    total_price: float
    status: str
    created_at: datetime
    items: List[OrderItemResponse]
    model_config = ConfigDict(from_attributes=True)

class OrderStatusUpdate(BaseModel):
    status: str