from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


# ---------- Transcription ----------

class TranscriptionResponse(BaseModel):
    transcript: str


# ---------- Extraction / Inspection ----------

class ExtractionRequest(BaseModel):
    transcript: str


class InspectionExtracted(BaseModel):
    equipment_id: Optional[str] = None
    fault_description: Optional[str] = None
    severity: Optional[str] = None
    action_taken: Optional[str] = None
    parts_required: List[str] = Field(default_factory=list)


class InspectionCreate(InspectionExtracted):
    location: Optional[str] = None
    inspection_result: Optional[str] = None


class InspectionOut(BaseModel):
    id: int
    equipment_id: Optional[str] = None
    location: Optional[str] = None
    inspection_result: Optional[str] = None
    fault_description: Optional[str] = None
    severity: Optional[str] = None
    action_taken: Optional[str] = None
    parts_required: List[str] = Field(default_factory=list)
    timestamp: datetime

    class Config:
        from_attributes = True


# ---------- Query / RAG ----------

class QueryRequest(BaseModel):
    question: str


class QueryResponse(BaseModel):
    answer: str
    sources: List[str] = Field(default_factory=list)


class TTSRequest(BaseModel):
    text: str


# ---------- Work Orders ----------

class WorkOrderCreate(BaseModel):
    equipment_id: str
    description: Optional[str] = None
    status: Optional[str] = "Open"


class WorkOrderUpdate(BaseModel):
    status: Optional[str] = None
    description: Optional[str] = None


class WorkOrderOut(BaseModel):
    id: int
    equipment_id: str
    status: str
    description: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- Voice log ----------

class VoiceLogOut(BaseModel):
    id: int
    transcript: str
    timestamp: datetime

    class Config:
        from_attributes = True


# ---------- Sync ----------

class SyncItem(BaseModel):
    transcript: str
    timestamp: Optional[datetime] = None


class SyncRequest(BaseModel):
    items: List[SyncItem]


class SyncResponse(BaseModel):
    synced: int


# ---------- Dashboard ----------

class DashboardStats(BaseModel):
    total_inspections: int
    open_work_orders: int
    critical_alerts: int
    severity_breakdown: dict
    work_order_status: dict
    recent_transcripts: List[VoiceLogOut]
    recent_inspections: List[InspectionOut]
