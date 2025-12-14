from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from backend.database import engine, Base
from backend.routers import rfq

Base.metadata.create_all(bind=engine)

app = FastAPI(title="FX Derivatives Platform", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rfq.router)

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "FX Pricing & RFQ Engine"}

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
