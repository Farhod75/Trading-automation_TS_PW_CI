from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.order import Order
from app.schemas.order import OrderCreate, OrderResponse
from typing import List
import time
from pydantic import BaseModel

router = APIRouter(prefix="/api/orders", tags=["orders"])
class OrderUpdate(BaseModel):
    status: str

@router.patch("/{order_id}", response_model=OrderResponse)
def update_order(order_id: str, update: OrderUpdate, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = update.status
    db.commit()
    db.refresh(order)
    return order
@router.post("", response_model=OrderResponse, status_code=201)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    order_id = f"ORD-{int(time.time() * 1000)}"
    db_order = Order(
        order_id=order_id,
        instrument=order.instrument,
        side=order.side,
        quantity=order.quantity,
        price=order.price,
        status="NEW"
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

@router.get("", response_model=List[OrderResponse])
def list_orders(db: Session = Depends(get_db)):
    return db.query(Order).all()

@router.post("/{order_id}/route", response_model=OrderResponse)
def route_order(order_id: str, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = "ROUTED"
    db.commit()
    db.refresh(order)
    return order

@router.post("/{order_id}/fill", response_model=OrderResponse)
def fill_order(order_id: str, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = "FILLED"
    db.commit()
    db.refresh(order)
    return order

@router.post("/{order_id}/cancel", response_model=OrderResponse)
def cancel_order(order_id: str, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = "CANCELLED"
    db.commit()
    db.refresh(order)
    return order