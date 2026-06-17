import json
import os
import re
from typing import Optional
from openai import OpenAI
from ..schemas import InspectionExtracted

_client: Optional[OpenAI] = None

SYSTEM_PROMPT = """You extract structured inspection data from a field technician's spoken report.

Return ONLY valid JSON matching this schema:
{
  "equipment_id": string or null,
  "fault_description": string or null,
  "severity": "Low" | "Medium" | "High" | "Critical" | null,
  "action_taken": string or null,
  "parts_required": [string]
}

Rules:
- equipment_id is a short tag like "P101", "V203", "F22".
- severity must be one of Low, Medium, High, Critical.
- parts_required is always a list (possibly empty).
- If a field is not mentioned, use null (or [] for parts).
"""


def _get_client() -> OpenAI:
    global _client
    if _client is None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise RuntimeError("OPENAI_API_KEY not set")
        base_url = os.getenv("OPENAI_BASE_URL") or None
        _client = OpenAI(api_key=api_key, base_url=base_url)
    return _client


def _heuristic_extract(transcript: str) -> InspectionExtracted:
    """Best-effort offline extraction so the demo still works without a key."""
    eq = re.search(r"\b([A-Z]{1,3}\d{2,4})\b", transcript)
    severity = None
    for s in ("Critical", "High", "Medium", "Low"):
        if re.search(rf"\b{s}\b", transcript, re.IGNORECASE):
            severity = s
            break
    return InspectionExtracted(
        equipment_id=eq.group(1) if eq else None,
        fault_description=None,
        severity=severity,
        action_taken=None,
        parts_required=[],
    )


def extract_inspection(transcript: str) -> InspectionExtracted:
    """Run a chat model in JSON mode to extract inspection fields."""
    if not transcript or not transcript.strip():
        return InspectionExtracted()

    if not os.getenv("OPENAI_API_KEY"):
        return _heuristic_extract(transcript)

    client = _get_client()
    model = os.getenv("CHAT_MODEL", "llama-3.3-70b-versatile")

    try:
        resp = client.chat.completions.create(
            model=model,
            response_format={"type": "json_object"},
            temperature=0,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Transcript:\n{transcript}"},
            ],
        )
        raw = resp.choices[0].message.content or "{}"
        data = json.loads(raw)
    except Exception:
        return _heuristic_extract(transcript)

    parts = data.get("parts_required") or []
    if isinstance(parts, str):
        parts = [parts]
    parts = [str(p).strip() for p in parts if str(p).strip()]

    return InspectionExtracted(
        equipment_id=data.get("equipment_id"),
        fault_description=data.get("fault_description"),
        severity=data.get("severity"),
        action_taken=data.get("action_taken"),
        parts_required=parts,
    )
