from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import datetime
import enum

Base = declarative_base()

class RFQState(str, enum.Enum):
    CREATED = "CREATED"
    QUOTING = "QUOTING"
    QUOTED = "QUOTED"
    EXECUTED = "EXECUTED"
    EXPIRED = "EXPIRED"
    CANCELLED = "CANCELLED"

class InstrumentType(str, enum.Enum):
    SPOT = "SPOT"
    FORWARD = "FORWARD"
    VANILLA_OPTION = "VANILLA_OPTION"
    BARRIER_OPTION = "BARRIER_OPTION"

class Side(str, enum.Enum):
    BUY = "BUY"
    SELL = "SELL"

class RFQ(Base):
    __tablename__ = "rfqs"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    instrument_type = Column(String, index=True) # InstrumentType
    pair = Column(String, index=True) # e.g. EURUSD
    side = Column(String) # Side
    amount = Column(Float)
    
    # Option specific fields
    strike = Column(Float, nullable=True)
    tenor = Column(String, nullable=True) # e.g. "1M", "1W"
    expiry_date = Column(DateTime, nullable=True)
    option_type = Column(String, nullable=True) # CALL/PUT
    
    status = Column(String, default=RFQState.CREATED) # RFQState
    
    quotes = relationship("Quote", back_populates="rfq")
    trade = relationship("Trade", back_populates="rfq", uselist=False)

class Quote(Base):
    __tablename__ = "quotes"

    id = Column(Integer, primary_key=True, index=True)
    rfq_id = Column(Integer, ForeignKey("rfqs.id"))
    dealer_id = Column(String)
    price = Column(Float)
    valid_until = Column(DateTime)
    
    rfq = relationship("RFQ", back_populates="quotes")

class Trade(Base):
    __tablename__ = "trades"

    id = Column(Integer, primary_key=True, index=True)
    rfq_id = Column(Integer, ForeignKey("rfqs.id"))
    quote_id = Column(Integer, ForeignKey("quotes.id"))
    executed_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    rfq = relationship("RFQ", back_populates="trade")
