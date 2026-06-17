from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models import Product, Order, OrderItem
from app.schemas import OrderCreate

def get_active_products(db: Session):
    return db.query(Product).filter(Product.is_available == True).all()

def seed_initial_products(db: Session):
    if db.query(Product).count() == 0:
        initial_products = [
            Product(name="美式咖啡", price=80.0, category="咖啡"),
            Product(name="經典拿鐵", price=100.0, category="咖啡"),
            Product(name="黑糖鮮奶茶", price=90.0, category="茶飲"),
            Product(name="四季春青茶", price=60.0, category="茶飲"),
            Product(name="法式可麗露", price=75.0, category="點心")
        ]
        db.add_all(initial_products)
        db.commit()

def create_order(db: Session, order_in: OrderCreate):
    try:
        total_price = 0.0
        order_items_data = []
        
        for item in order_in.items:
            product = db.query(Product).filter(Product.id == item.product_id).first()
            if not product:
                raise ValueError(f"商品編號 {item.product_id} 不存在")
            
            total_price += product.price * item.quantity
            order_items_data.append({
                "product_id": item.product_id,
                "quantity": item.quantity,
                "custom_notes": item.custom_notes
            })
            
        new_order = Order(total_price=total_price, status="pending")
        db.add(new_order)
        db.flush()
        
        for item_data in order_items_data:
            order_item = OrderItem(
                order_id=new_order.id,
                product_id=item_data["product_id"],
                quantity=item_data["quantity"],
                custom_notes=item_data["custom_notes"]
            )
            db.add(order_item)
            
        db.commit()
        db.refresh(new_order)
        return new_order
        
    except Exception as e:
        db.rollback()
        raise e

def get_order_by_id(db: Session, order_id: int):
    return db.query(Order).filter(Order.id == order_id).first()

def get_all_orders_desc(db: Session):
    return db.query(Order).order_by(desc(Order.created_at)).all()

def update_order_status(db: Session, order_id: int, status: str):
    order = db.query(Order).filter(Order.id == order_id).first()
    if order:
        order.status = status
        db.commit()
        db.refresh(order)
    return order