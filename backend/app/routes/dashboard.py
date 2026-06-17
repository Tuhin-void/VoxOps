import json
from collections import Counter
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Inspection, VoiceLog, WorkOrder
from ..schemas import DashboardStats, InspectionOut, VoiceLogOut

router = APIRouter()


def _inspection_out(row: Inspection) -> InspectionOut:
    parts: List[str] = []
    if row.parts_required:
        try:
            parts = json.loads(row.parts_required) or []
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


@router.get("/dashboard/stats", response_model=DashboardStats)
def stats(db: Session = Depends(get_db)):
    total_inspections = db.query(Inspection).count()
    open_work_orders = (
        db.query(WorkOrder).filter(WorkOrder.status != "Closed").count()
    )
    critical_alerts = (
        db.query(Inspection)
        .filter(Inspection.severity.in_(["Critical", "High"]))
        .count()
    )

    severity_rows = db.query(Inspection.severity).all()
    severity_counts = Counter((s[0] or "Unknown") for s in severity_rows)
    # Ensure all buckets exist for the chart.
    for level in ("Low", "Medium", "High", "Critical"):
        severity_counts.setdefault(level, 0)

    wo_rows = db.query(WorkOrder.status).all()
    wo_counts = Counter((s[0] or "Unknown") for s in wo_rows)
    for level in ("Open", "In Progress", "Closed"):
        wo_counts.setdefault(level, 0)

    recent_transcripts = (
        db.query(VoiceLog).order_by(VoiceLog.timestamp.desc()).limit(10).all()
    )
    recent_inspections = (
        db.query(Inspection).order_by(Inspection.timestamp.desc()).limit(10).all()
    )

    return DashboardStats(
        total_inspections=total_inspections,
        open_work_orders=open_work_orders,
        critical_alerts=critical_alerts,
        severity_breakdown=dict(severity_counts),
        work_order_status=dict(wo_counts),
        recent_transcripts=[VoiceLogOut.model_validate(t) for t in recent_transcripts],
        recent_inspections=[_inspection_out(i) for i in recent_inspections],
    )
