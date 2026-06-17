# Voice-First AI Assistant for Field Workers

A voice-driven assistant that helps field technicians perform inspections,
query equipment manuals, and manage work orders — entirely by voice.

Built as a clean academic project: simple stack, working AI pipelines, and
a polished UI for both workers and supervisors.

## Features

- **Voice capture** — record audio in the browser, transcribe with Whisper.
- **Structured extraction** — GPT-4o-mini extracts inspection fields from speech.
- **RAG question answering** — ask questions about equipment manuals.
- **Voice responses** — answers are spoken back via OpenAI TTS.
- **Work order management** — create, update, and close work orders.
- **Offline queue** — transcripts are buffered in localStorage when offline.
- **Supervisor dashboard** — KPIs, charts, and recent activity.

## Stack

- **Frontend:** React + Vite + TypeScript + TailwindCSS + shadcn/ui + Recharts + React Query
- **Backend:** FastAPI + SQLAlchemy + SQLite + Pydantic
- **AI:** OpenAI Whisper + GPT-4o-mini + OpenAI TTS + sentence-transformers + ChromaDB

## Quick start

### 1. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                # then add your OPENAI_API_KEY
python -m app.seed                  # populate sample data + knowledge base
uvicorn app.main:app --reload --port 8000
```

API will be available at `http://localhost:8000` (docs at `/docs`).

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App will be available at `http://localhost:5173`.

## Pages

- `/` — **Worker page**: voice recorder, transcript, extracted inspection,
  Q&A panel, work orders, offline sync queue.
- `/dashboard` — **Supervisor dashboard**: KPI cards, severity pie chart,
  work-order status bar chart, recent activity, alerts.

## Project layout

```
project/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── database.py
│   │   ├── seed.py
│   │   ├── routes/        # transcription, inspection, query, work_orders, dashboard
│   │   ├── services/      # whisper, extraction, rag, tts, sync
│   │   ├── vector_store/  # ChromaDB persistence
│   │   └── knowledge_base/  # sample equipment docs
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── api/
    │   └── hooks/
    └── package.json
```

## Architecture

```
        ┌───────────────────────────────┐
        │   Browser (React + Vite)      │
        │   ─ Worker page               │
        │   ─ Supervisor dashboard      │
        └──────────────┬────────────────┘
                       │  fetch (/api/*)
                       │  proxied to :8000
                       ▼
        ┌───────────────────────────────┐
        │   FastAPI backend             │
        │   ─ routes:                   │
        │     transcription, inspection │
        │     query, work_orders,       │
        │     dashboard                 │
        │   ─ services:                 │
        │     whisper, extraction,      │
        │     rag, tts, sync            │
        └──────┬───────────────┬────────┘
               │               │
       ┌───────▼──────┐  ┌─────▼──────────┐
       │   SQLite     │  │  ChromaDB +    │
       │   (ORM)      │  │  MiniLM embeds │
       └──────────────┘  └─────┬──────────┘
                               │
                          knowledge_base/
                          (3 .txt manuals)

         External APIs (called by services):
          ─ OpenAI Whisper  (audio → text)
          ─ GPT-4o-mini     (extraction, RAG answer)
          ─ OpenAI TTS      (text → audio)
```

## API endpoints

| Method | Path                       | Purpose                                    |
|--------|----------------------------|--------------------------------------------|
| GET    | `/health`                  | Liveness probe used by the offline poller. |
| POST   | `/transcribe`              | Multipart audio upload → Whisper text.     |
| POST   | `/extract`                 | Transcript → structured inspection JSON.   |
| POST   | `/inspections`             | Persist an extracted inspection.           |
| GET    | `/inspections`             | List recent inspections.                   |
| POST   | `/query`                   | RAG question answering over the manuals.   |
| POST   | `/tts`                     | Text → MP3 stream.                         |
| GET    | `/work-orders`             | List work orders.                          |
| POST   | `/work-orders`             | Create a work order.                       |
| PUT    | `/work-orders/{id}`        | Update status / description.               |
| DELETE | `/work-orders/{id}`        | Delete a work order.                       |
| POST   | `/sync`                    | Drain the offline transcript queue.        |
| GET    | `/dashboard/stats`         | KPIs + chart data for the supervisor view. |

Full OpenAPI spec is auto-served at `http://localhost:8000/docs`.

## Demo flow

1. Open `http://localhost:5173/`. The Worker page loads.
2. Press the microphone and speak:
   *"Inspection complete. Pump P101 vibration issue. Severity high. Bearing replaced. One spare bearing required."*
3. Release the mic. The transcript appears, then the structured inspection
   fields are extracted automatically.
4. Press **Save inspection**. A toast confirms the save.
5. Type a question in the Ask panel, e.g.
   *"When was Pump P101 serviced last?"* The RAG answer renders and an
   MP3 plays it back. (Browser auto-play is best-effort; otherwise use the
   inline player.)
6. Create a work order for `P101` from the Work Orders card. Change its
   status with the dropdown. Delete it with the trash icon.
7. Navigate to **Dashboard**. KPI cards, severity pie, status bar chart,
   recent transcripts, and critical alerts all reflect the new data.

## Known limitations

- No authentication, role management, or audit log — single-user demo.
- Transcription, extraction, RAG, and TTS require `OPENAI_API_KEY`.
  Without it: transcription returns a 503 with a clear message,
  extraction falls back to a regex heuristic, RAG returns the
  top-1 retrieved chunk verbatim, TTS fails silently (text answer
  still shown).
- The offline queue stores a placeholder for failed recordings — the
  actual audio cannot be transcribed offline (no local Whisper).
- The knowledge base is plain text. PDF ingestion is out of scope.
- ChromaDB indexes run in-process; no external vector service.

## Future improvements

- Push notifications to supervisors when a Critical inspection is saved.
- Per-equipment filtering and time-range selectors on the dashboard.
- Speech-driven work-order commands ("create work order for P101").
- Hot-reload of the knowledge base when files change.
- Export inspections / work orders to CSV.

## Notes

- No auth, no Docker, no microservices — single backend, single frontend.
- The OpenAI key is required only for transcription, extraction, RAG, and TTS.
  The rest of the app (work orders, dashboard, seed data) works without it.
- Knowledge base ships as `.txt` files so chunking is trivial and no PDF
  parsing libraries are required.
