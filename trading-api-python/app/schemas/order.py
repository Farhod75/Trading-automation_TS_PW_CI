from pydantic import BaseModel


class OrderBase(BaseModel):
    instrument: str
    side: str
    quantity: int
    price: float


class OrderCreate(OrderBase):
    pass


class OrderResponse(OrderBase):
    order_id: str
    status: str

    class Config:
        orm_mode = True