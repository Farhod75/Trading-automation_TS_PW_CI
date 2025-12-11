from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import orders
from app.database import Base, engine

app = FastAPI(title="Trading API")

# create tables
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(orders.router)

@app.get("/")
def read_root():
    return {"message": "Trading API is running"}