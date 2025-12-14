from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from sqlalchemy.orm import Session
from typing import List
import uuid
import asyncio
from datetime import datetime, timedelta

from .. import schemas, models, pricing
from ..database import get_db

router = APIRouter(
    prefix="/rfqs",
    tags=["rfqs"]
)

# Mock Dealer System
class DealerSystem:
    @staticmethod
    async def generate_quote(rfq: models.RFQ, delay: float = 1.0) -> models.Quote:
        await asyncio.sleep(delay)
        
        # Simple pricing logic simulation
        pe = pricing.PricingEngine()
        
        # Base price (Mock)
        spot_ref = 1.1000 # EURUSD Ref
        
        if rfq.instrument_type == models.InstrumentType.VANILLA_OPTION:
            # Calculate theoretical price
            px = pe.black_scholes(
                S=spot_ref,
                K=rfq.strike,
                T=30/365, # Mock time
                r=0.05,
                sigma=0.1,
                option_type=rfq.option_type.lower()
            )
            base_price = px["premium"]
        else:
            base_price = spot_ref
            
        # Add dealer spread
        dealer_spread = 0.0002
        price = base_price + dealer_spread
        
        return models.Quote(
            rfq_id=rfq.id,
            dealer_id=f"DEALER_{uuid.uuid4().hex[:4].upper()}",
            price=price,
            valid_until=datetime.utcnow() + timedelta(seconds=30)
        )

async def solicit_dealer_quotes(rfq_id: int, db: Session):
    """
    Background task to simulate fetching quotes from dealers.
    """
    # Create new session for background task since the request one closes
    # In real app, use a proper session factory or dependency injection for tasks
    # For this simplified version we might need a workaround or assume DB access is handled
    pass 
    # NOTE: Async DB in background tasks requires careful handling with SQLAlchemy. 
    # For now, we will do it synchronously in the main thread for simplicity 
    # or implement a proper async service layer.

@router.post("/", response_model=schemas.RFQResponse)
async def create_rfq(rfq_in: schemas.RFQCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    # Create RFQ Record
    new_rfq = models.RFQ(
        instrument_type=rfq_in.instrument_type,
        pair=rfq_in.pair,
        side=rfq_in.side,
        amount=rfq_in.amount,
        strike=rfq_in.strike,
        tenor=rfq_in.tenor,
        option_type=rfq_in.option_type,
        status=models.RFQState.CREATED
    )
    db.add(new_rfq)
    db.commit()
    db.refresh(new_rfq)
    
    # Trigger Dealer Quotes (Simulated)
    # background_tasks.add_task(solicit_dealer_quotes, new_rfq.id, db)
    
    return new_rfq

@router.get("/{rfq_id}", response_model=schemas.RFQResponse)
def get_rfq(rfq_id: int, db: Session = Depends(get_db)):
    rfq = db.query(models.RFQ).filter(models.RFQ.id == rfq_id).first()
    if not rfq:
        raise HTTPException(status_code=404, detail="RFQ not found")
    return rfq
