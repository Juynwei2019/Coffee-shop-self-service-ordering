from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, SessionLocal
from app import crud
from app.routers import products, orders, admin
from app.config import CORS_ALLOW_ORIGINS

Base.metadata.create_all(bind=engine)

# 初始化資料
db = SessionLocal()
try:
    crud.seed_initial_products(db)
finally:
    db.close()

app = FastAPI(title="MUJI Style Coffee Ordering API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ALLOW_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router, prefix="/api")
app.include_router(orders.router, prefix="/api")
app.include_router(admin.router, prefix="/api")