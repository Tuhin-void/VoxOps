import os
import tempfile
from openai import OpenAI

_client: OpenAI | None = None


def _get_client() -> OpenAI:
    global _client
    if _client is None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise RuntimeError("OPENAI_API_KEY not set")
        _client = OpenAI(api_key=api_key)
    return _client


def transcribe_audio(audio_bytes: bytes, filename: str = "audio.webm") -> str:
    """Transcribe an audio blob using OpenAI Whisper."""
    client = _get_client()
    model = os.getenv("WHISPER_MODEL", "whisper-1")

    # Whisper SDK wants a file-like object with a name.
    suffix = os.path.splitext(filename)[1] or ".webm"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(audio_bytes)
        tmp_path = tmp.name

    try:
        with open(tmp_path, "rb") as f:
            result = client.audio.transcriptions.create(
                model=model,
                file=f,
            )
        return result.text.strip()
    finally:
        try:
            os.unlink(tmp_path)
        except OSError:
            pass
