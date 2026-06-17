from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import WorkOrder
from ..schemas import WorkOrderCreate, WorkOrderOut, WorkOrderUpdate
from ..services.sync_service import sync_items
from ..schemas import SyncRequest, SyncResponse

router = APIRouter()


@router.post("/work-orders", response_model=WorkOrderOut)
def create_work_order(payload: WorkOrderCreate, db: Session = Depends(get_db)):
    row = WorkOrder(
        equipment_id=payload.equipment_id,
        description=payload.description,
        status=payload.status or "Open",
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@router.get("/work-orders", response_model=List[WorkOrderOut])
def list_work_orders(db: Session = Depends(get_db)):
    return (
        db.query(WorkOrder)
        .order_by(WorkOrder.created_at.desc())
        .all()
    )


@router.put("/work-orders/{wo_id}", response_model=WorkOrderOut)
def update_work_order(wo_id: int, payload: WorkOrderUpdate, db: Session = Depends(get_db)):
    row = db.query(WorkOrder).filter(WorkOrder.id == wo_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Work order not found")
    if payload.status is not None:
        row.status = payload.status
    if payload.description is not None:
        row.description = payload.description
    db.commit()
    db.refresh(row)
    return row


@router.delete("/work-orders/{wo_id}", status_code=204)
def delete_work_order(wo_id: int, db: Session = Depends(get_db)):
    row = db.query(WorkOrder).filter(WorkOrder.id == wo_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Work order not found")
    db.delete(row)
    db.commit()
    return None


# Offline sync lives here for convenience; it's a small endpoint and the
# frontend treats it as part of the same flow.
@router.post("/sync", response_model=SyncResponse)
def sync(payload: SyncRequest, db: Session = Depends(get_db)):
    synced = sync_items(db, payload.items)
    return SyncResponse(synced=synced)
