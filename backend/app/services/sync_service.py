"""Offline sync helper.

The frontend buffers transcripts in localStorage while offline. When the
backend is reachable again it POSTs the queue to /sync. This service just
persists each item as a VoiceLog and returns how many were stored.
"""
from datetime import datetime
from typing import Iterable
from sqlalchemy.orm import Session
from ..models import VoiceLog
from ..schemas import SyncItem


def sync_items(db: Session, items: Iterable[SyncItem]) -> int:
    count = 0
    for item in items:
        if not item.transcript or not item.transcript.strip():
            continue
        log = VoiceLog(
            transcript=item.transcript.strip(),
            timestamp=item.timestamp or datetime.utcnow(),
        )
        db.add(log)
        count += 1
    if count:
        db.commit()
    return count
