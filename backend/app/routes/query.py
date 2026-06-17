from fastapi import APIRouter, HTTPException

from ..schemas import QueryRequest, QueryResponse
from ..services.rag_service import answer_question

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
