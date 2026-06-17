"""Populate the database with sample data and index the knowledge base.

Run with:  python -m app.seed
"""
import json
from datetime import datetime, timedelta

from .database import Base, SessionLocal, engine
from .models import Equipment, Inspection, VoiceLog, WorkOrder
from .services.rag_service import index_knowledge_base

SAMPLE_EQUIPMENT = [
    {
        "equipment_id": "P101",
        "specification": (
            "Centrifugal pump, 250 m3/h @ 45 m, 75 kW motor, "
            "SKF 6310 bearings, vibration limit 4.5 mm/s RMS."
        ),
        "maintenance_history": (
            "2026-04-12: bearings replaced, oil changed, vibration 1.9 mm/s.\n"
            "2025-12-04: routine inspection, no findings."
        ),
    },
    {
        "equipment_id": "V203",
        "specification": (
            "Pilot-operated pressure relief valve. Set 8.0 bar, "
            "reseat 7.2 bar. CS body, 316 SS trim."
        ),
        "maintenance_history": (
            "2026-02-03: seat insert replaced, hydrotest passed.\n"
            "2025-08-19: pilot orifice cleaned."
        ),
    },
    {
        "equipment_id": "F22",
        "specification": (
            "Air filter 600x600x100, MERV 13. Replace at 250 Pa DP."
        ),
        "maintenance_history": (
            "2026-05-20: media cartridge replaced.\n"
            "2025-11-15: media cartridge replaced."
        ),
    },
]


SAMPLE_INSPECTIONS = [
    {
        "equipment_id": "P101",
        "location": "Pump House A",
        "inspection_result": "Vibration above limit",
        "fault_description": "Vibration measured at 5.1 mm/s RMS, above 4.5 limit.",
        "severity": "Medium",
        "action_taken": "Replaced drive-end bearing, refilled oil.",
        "parts_required": ["SKF 6310 bearing", "ISO VG 68 oil"],
        "days_ago": 1,
    },
    {
        "equipment_id": "V203",
        "location": "Steam Header L3",
        "inspection_result": "Chatter at set point",
        "fault_description": "Valve chatters during relief; pilot debris suspected.",
        "severity": "High",
        "action_taken": "Cleaned pilot orifice, scheduled hydrotest.",
        "parts_required": ["Pilot cleaning kit V203-PCK"],
        "days_ago": 2,
    },
    {
        "equipment_id": "F22",
        "location": "AHU-2 Roof",
        "inspection_result": "DP approaching threshold",
        "fault_description": "Differential pressure at 220 Pa, replacement due.",
        "severity": "Low",
        "action_taken": "Scheduled cartridge swap for next visit.",
        "parts_required": ["F22-MC-13"],
        "days_ago": 3,
    },
    {
        "equipment_id": "P101",
        "location": "Pump House A",
        "inspection_result": "Routine OK",
        "fault_description": None,
        "severity": "Low",
        "action_taken": "Visual inspection, no findings.",
        "parts_required": [],
        "days_ago": 7,
    },
    {
        "equipment_id": "V203",
        "location": "Steam Header L3",
        "inspection_result": "Leakage at bonnet",
        "fault_description": "Minor steam leak detected at bonnet gasket.",
        "severity": "Critical",
        "action_taken": "Isolated valve, pending gasket replacement.",
        "parts_required": ["V203-BG-001"],
        "days_ago": 0,
    },
]


SAMPLE_WORK_ORDERS = [
    {"equipment_id": "P101", "status": "Closed",       "description": "Bearing replacement after vibration alarm."},
    {"equipment_id": "V203", "status": "In Progress",  "description": "Pilot orifice cleaning and hydrotest."},
    {"equipment_id": "F22",  "status": "Open",         "description": "Replace filter cartridge."},
    {"equipment_id": "V203", "status": "Open",         "description": "Replace bonnet gasket — leakage reported."},
]


SAMPLE_TRANSCRIPTS = [
    "Inspection complete. Pump P101 shows vibration issue. Severity medium. Replaced bearing and require one spare bearing.",
    "Valve V203 chattering during relief. Severity high. Cleaned pilot orifice, hydrotest pending.",
    "Filter F22 differential pressure rising. Scheduling cartridge swap.",
    "Routine check of pump P101. All readings within limits.",
    "Critical: V203 bonnet leak detected. Valve isolated.",
]


def seed():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        if db.query(Equipment).count() == 0:
            for eq in SAMPLE_EQUIPMENT:
                db.add(Equipment(**eq))
            print(f"  + {len(SAMPLE_EQUIPMENT)} equipment records")

        if db.query(Inspection).count() == 0:
            for ins in SAMPLE_INSPECTIONS:
                days_ago = ins.pop("days_ago")
                db.add(Inspection(
                    equipment_id=ins["equipment_id"],
                    location=ins["location"],
                    inspection_result=ins["inspection_result"],
                    fault_description=ins["fault_description"],
                    severity=ins["severity"],
                    action_taken=ins["action_taken"],
                    parts_required=json.dumps(ins["parts_required"]),
                    timestamp=datetime.utcnow() - timedelta(days=days_ago, hours=2),
                ))
            print(f"  + {len(SAMPLE_INSPECTIONS)} inspections")

        if db.query(WorkOrder).count() == 0:
            for wo in SAMPLE_WORK_ORDERS:
                db.add(WorkOrder(**wo))
            print(f"  + {len(SAMPLE_WORK_ORDERS)} work orders")

        if db.query(VoiceLog).count() == 0:
            for i, t in enumerate(SAMPLE_TRANSCRIPTS):
                db.add(VoiceLog(
                    transcript=t,
                    timestamp=datetime.utcnow() - timedelta(hours=i * 5),
                ))
            print(f"  + {len(SAMPLE_TRANSCRIPTS)} voice logs")

        db.commit()
    finally:
        db.close()

    print("Indexing knowledge base...")
    try:
        n = index_knowledge_base(force=True)
        print(f"  + {n} chunks indexed in ChromaDB")
    except Exception as e:
        print(f"  ! knowledge base indexing skipped: {e}")

    print("Done.")


if __name__ == "__main__":
    seed()
