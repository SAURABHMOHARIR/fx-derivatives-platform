from pydantic import BaseModel
from typing import Optional, List, Literal
from datetime import datetime

class RFQCreate(BaseModel):
    instrument_type: str
    pair: str
    side: Literal["BUY", "SELL"]
    amount: float
    strike: Optional[float] = None
    tenor: Optional[str] = None
    option_type: Optional[Literal["CALL", "PUT"]] = None

class RFQResponse(RFQCreate):
    id: int
    created_at: datetime
    status: str

class QuoteResponse(BaseModel):
    id: int
    dealer_id: str
    price: float
    valid_until: datetime

class TradeResponse(BaseModel):
    id: int
    executed_at: datetime
