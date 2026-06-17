import os
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


def synthesize_speech(text: str) -> bytes:
    """Generate MP3 audio bytes for the given text."""
    client = _get_client()
    model = os.getenv("TTS_MODEL", "tts-1")
    voice = os.getenv("TTS_VOICE", "alloy")

    resp = client.audio.speech.create(
        model=model,
        voice=voice,
        input=text[:4000],  # keep responses small
        response_format="mp3",
    )
    # Prefer .content (bytes); .read() is supported on older SDK builds.
    data = getattr(resp, "content", None)
    if isinstance(data, bytes) and data:
        return data
    return resp.read()
