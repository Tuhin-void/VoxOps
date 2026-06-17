from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from .database import Base


class Inspection(Base):
    __tablename__ = "inspections"

    id = Column(Integer, primary_key=True, index=True)
    equipment_id = Column(String, index=True)
    location = Column(String, nullable=True)
    inspection_result = Column(String, nullable=True)
    fault_description = Column(Text, nullable=True)
    severity = Column(String, nullable=True)  # Low / Medium / High / Critical
    action_taken = Column(Text, nullable=True)
    parts_required = Column(Text, nullable=True)  # JSON-encoded list
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)


class WorkOrder(Base):
    __tablename__ = "work_orders"

    id = Column(Integer, primary_key=True, index=True)
    equipment_id = Column(String, index=True)
    status = Column(String, default="Open")  # Open / In Progress / Closed
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class VoiceLog(Base):
    __tablename__ = "voice_logs"

    id = Column(Integer, primary_key=True, index=True)
    transcript = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)


class Equipment(Base):
    __tablename__ = "equipment"

    id = Column(Integer, primary_key=True, index=True)
    equipment_id = Column(String, unique=True, index=True)
    specification = Column(Text, nullable=True)
    maintenance_history = Column(Text, nullable=True)
