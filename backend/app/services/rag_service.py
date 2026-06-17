"""Retrieval-Augmented Generation over the local knowledge base.

Knowledge base files live in `backend/app/knowledge_base/` as plain text.
On first use we chunk them, embed with sentence-transformers, and persist
into a Chroma collection in `backend/app/vector_store/`.
"""
import os
from pathlib import Path
from typing import Any, List, Optional, Tuple

import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
from openai import OpenAI

_BASE_DIR = Path(__file__).resolve().parent.parent
KB_DIR = _BASE_DIR / "knowledge_base"
VECTOR_DIR = _BASE_DIR / "vector_store"
COLLECTION_NAME = "equipment_kb"

# PersistentClient is a factory function in chromadb 0.5.x, not a class,
# so we annotate the cached client as Any.
_chroma_client: Any = None
_collection: Any = None
_embedder: Optional[SentenceTransformer] = None
_openai: Optional[OpenAI] = None


def _get_embedder() -> SentenceTransformer:
    global _embedder
    if _embedder is None:
        model_name = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
        _embedder = SentenceTransformer(model_name)
    return _embedder


def _get_collection():
    global _chroma_client, _collection
    if _collection is not None:
        return _collection

    VECTOR_DIR.mkdir(parents=True, exist_ok=True)
    _chroma_client = chromadb.PersistentClient(
        path=str(VECTOR_DIR),
        settings=Settings(anonymized_telemetry=False),
    )
    _collection = _chroma_client.get_or_create_collection(name=COLLECTION_NAME)
    return _collection


def _chunk_text(text: str, chunk_size: int = 500, overlap: int = 80) -> List[str]:
    text = text.replace("\r\n", "\n").strip()
    if not text:
        return []
    words = text.split()
    chunks: List[str] = []
    step = max(1, chunk_size - overlap)
    for i in range(0, len(words), step):
        chunk = " ".join(words[i : i + chunk_size])
        if chunk:
            chunks.append(chunk)
        if i + chunk_size >= len(words):
            break
    return chunks


def index_knowledge_base(force: bool = False) -> int:
    """Index all .txt files in KB_DIR. Returns number of chunks indexed."""
    collection = _get_collection()
    if force:
        # Recreate the collection to clear it.
        global _chroma_client, _collection
        _chroma_client.delete_collection(COLLECTION_NAME)
        _collection = _chroma_client.get_or_create_collection(name=COLLECTION_NAME)
        collection = _collection

    if collection.count() > 0 and not force:
        return collection.count()

    embedder = _get_embedder()
    KB_DIR.mkdir(parents=True, exist_ok=True)
    docs: List[str] = []
    ids: List[str] = []
    metas: List[dict] = []

    for path in sorted(KB_DIR.glob("*.txt")):
        text = path.read_text(encoding="utf-8")
        for idx, chunk in enumerate(_chunk_text(text)):
            docs.append(chunk)
            ids.append(f"{path.stem}-{idx}")
            metas.append({"source": path.name, "chunk": idx})

    if not docs:
        return 0

    embeddings = embedder.encode(docs, convert_to_numpy=True).tolist()
    collection.add(documents=docs, embeddings=embeddings, ids=ids, metadatas=metas)
    return len(docs)


def retrieve(question: str, k: int = 3) -> List[Tuple[str, str]]:
    collection = _get_collection()
    if collection.count() == 0:
        index_knowledge_base()
    if collection.count() == 0:
        return []
    embedder = _get_embedder()
    q_emb = embedder.encode([question], convert_to_numpy=True).tolist()
    res = collection.query(query_embeddings=q_emb, n_results=k)
    docs = (res.get("documents") or [[]])[0]
    metas = (res.get("metadatas") or [[]])[0]
    out: List[Tuple[str, str]] = []
    for doc, meta in zip(docs, metas):
        source = (meta or {}).get("source", "kb")
        out.append((doc, source))
    return out


def _get_openai() -> OpenAI:
    global _openai
    if _openai is None:
        _openai = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    return _openai


def answer_question(question: str) -> Tuple[str, List[str]]:
    chunks = retrieve(question, k=3)
    sources = sorted({src for _, src in chunks})
    context = "\n\n---\n\n".join(c for c, _ in chunks) or "(no knowledge base context)"

    if not os.getenv("OPENAI_API_KEY"):
        # Fallback: return retrieved chunks as the answer.
        snippet = chunks[0][0] if chunks else "No relevant information found."
        return snippet, sources

    client = _get_openai()
    model = os.getenv("CHAT_MODEL", "gpt-4o-mini")
    prompt = (
        "You are an assistant helping a field technician. "
        "Answer using ONLY the context below. If the answer is not present, say so plainly.\n\n"
        f"Context:\n{context}\n\nQuestion: {question}\nAnswer:"
    )
    resp = client.chat.completions.create(
        model=model,
        temperature=0.2,
        messages=[
            {"role": "system", "content": "Give concise, direct answers (1-3 sentences)."},
            {"role": "user", "content": prompt},
        ],
    )
    answer = (resp.choices[0].message.content or "").strip()
    return answer, sources
