from datetime import datetime
from fastapi import APIRouter, File, HTTPException, UploadFile, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import VoiceLog
from ..schemas import TranscriptionResponse
from ..services.whisper_service import transcribe_audio

router = APIRouter()


@router.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe(
    audio: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    if not audio.content_type or not audio.content_type.startswith("audio"):
        # MediaRecorder sometimes sends application/octet-stream — accept silently.
        pass

    try:
        data = await audio.read()
        if not data:
            raise HTTPException(status_code=400, detail="Empty audio upload")
        text = transcribe_audio(data, filename=audio.filename or "audio.webm")
    except HTTPException:
        raise
    except RuntimeError:
        # Missing API key — surface a clear, demo-safe message rather than 500.
        raise HTTPException(
            status_code=503,
            detail="Transcription unavailable — OPENAI_API_KEY is not configured.",
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Transcription failed: {e}")

    log = VoiceLog(transcript=text, timestamp=datetime.utcnow())
    db.add(log)
    db.commit()

    return TranscriptionResponse(transcript=text)
