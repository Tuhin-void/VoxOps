import json
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Inspection
from ..schemas import (
    ExtractionRequest,
    InspectionCreate,
    InspectionExtracted,
    InspectionOut,
)
from ..services.extraction_service import extract_inspection

router = APIRouter()


def _to_out(row: Inspection) -> InspectionOut:
    parts: List[str] = []
    if row.parts_required:
        try:
            parts = json.loads(row.parts_required)
            if not isinstance(parts, list):
                parts = []
        except json.JSONDecodeError:
            parts = []
    return InspectionOut(
        id=row.id,
        equipment_id=row.equipment_id,
        location=row.location,
        inspection_result=row.inspection_result,
        fault_description=row.fault_description,
        severity=row.severity,
        action_taken=row.action_taken,
        parts_required=parts,
        timestamp=row.timestamp,
    )


@router.post("/extract", response_model=InspectionExtracted)
def extract(req: ExtractionRequest):
    if not req.transcript or not req.transcript.strip():
        raise HTTPException(status_code=400, detail="Transcript is empty")
    try:
        return extract_inspection(req.transcript)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failed: {e}")


@router.post("/inspections", response_model=InspectionOut)
def create_inspection(payload: InspectionCreate, db: Session = Depends(get_db)):
    row = Inspection(
        equipment_id=payload.equipment_id,
        location=payload.location,
        inspection_result=payload.inspection_result,
        fault_description=payload.fault_description,
        severity=payload.severity,
        action_taken=payload.action_taken,
        parts_required=json.dumps(payload.parts_required or []),
        timestamp=datetime.utcnow(),
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return _to_out(row)


@router.get("/inspections", response_model=List[InspectionOut])
def list_inspections(limit: int = 50, db: Session = Depends(get_db)):
    rows = (
        db.query(Inspection)
        .order_by(Inspection.timestamp.desc())
        .limit(limit)
        .all()
    )
    return [_to_out(r) for r in rows]
