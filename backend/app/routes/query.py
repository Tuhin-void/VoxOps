import io
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from ..schemas import QueryRequest, QueryResponse, TTSRequest
from ..services.rag_service import answer_question
from ..services.tts_service import synthesize_speech

router = APIRouter()


@router.post("/query", response_model=QueryResponse)
def query(req: QueryRequest):
    if not req.question.strip():
        raise HTTPException(status_code=400, detail="Question must not be empty")
    try:
        answer, sources = answer_question(req.question)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {e}")
    return QueryResponse(answer=answer, sources=sources)


@router.post("/tts")
def tts(req: TTSRequest):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Text must not be empty")
    try:
        audio_bytes = synthesize_speech(req.text)
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS failed: {e}")
    return StreamingResponse(io.BytesIO(audio_bytes), media_type="audio/mpeg")
