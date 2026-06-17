from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from .database import Base, engine
from . import models  # noqa: F401  (registers tables)
from .routes import transcription, inspection, query, work_orders, dashboard

app = FastAPI(
    title="Voice-First AI Assistant for Field Workers",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables on startup.
Base.metadata.create_all(bind=engine)

app.include_router(transcription.router, tags=["transcription"])
app.include_router(inspection.router, tags=["inspection"])
app.include_router(query.router, tags=["query"])
app.include_router(work_orders.router, tags=["work_orders"])
app.include_router(dashboard.router, tags=["dashboard"])


@app.get("/health")
def health():
    return {"status": "ok"}
