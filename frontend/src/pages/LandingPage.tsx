import { Link } from "react-router-dom";
import {
  Mic,
  Sparkles,
  Wrench,
  WifiOff,
  LayoutDashboard,
  ArrowRight,
  Github,
  FileText,
  Brain,
  Volume2,
  Database,
  ShieldCheck,
} from "lucide-react";

const GITHUB_URL = "https://github.com/Tuhin-void/VoxOps";

export function LandingPage() {
  return (
    <div className="space-y-24 py-6">
      <Hero />
      <Features />
      <HowItWorks />
      <Architecture />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-medium text-accent-300 mb-5">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-400 animate-subtle-pulse" />
          Voice-first · field intelligence
        </div>
        <h1 className="text-[44px] sm:text-[60px] font-semibold tracking-[-0.02em] text-zinc-50 leading-[1.05]">
          VoxOps
        </h1>
        <p className="text-[20px] sm:text-[22px] font-medium text-zinc-300 mt-3 leading-snug max-w-2xl">
          Voice-First AI Assistant for Field Workers.
        </p>
        <p className="text-[15px] text-zinc-500 mt-4 leading-relaxed max-w-xl">
          Hands-free inspections, equipment queries, and work-order management
          powered by AI. Speak naturally — VoxOps transcribes, extracts
          structured records, answers questions from your manuals, and keeps
          working when the signal drops.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link
            to="/worker"
            className="inline-flex items-center gap-1.5 bg-zinc-100 text-black px-4 py-2 rounded-md text-[13px] font-medium hover:bg-white transition-colors cursor-pointer"
          >
            <Mic className="h-3.5 w-3.5" />
            Launch Demo
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 border border-zinc-800 text-zinc-200 px-4 py-2 rounded-md text-[13px] font-medium hover:bg-zinc-900 hover:border-zinc-700 transition-colors cursor-pointer"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            View Dashboard
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 text-[13px] text-zinc-500 hover:text-zinc-200 px-2 py-2 transition-colors cursor-pointer"
          >
            <Github className="h-3.5 w-3.5" />
            Source
          </a>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    {
      icon: Mic,
      title: "Hands-free capture",
      body:
        "Press the mic and describe what you see. Whisper-large-v3 transcribes the audio — no typing on a phone with greasy gloves.",
    },
    {
      icon: Sparkles,
      title: "Structured extraction",
      body:
        "Llama-3.3 in JSON mode pulls equipment ID, fault, severity, action taken, and parts required out of natural speech.",
    },
    {
      icon: Brain,
      title: "Answers from your manuals",
      body:
        "Ask plain-English questions about equipment. Retrieval over ChromaDB returns grounded answers with source citations.",
    },
    {
      icon: Wrench,
      title: "Work-order management",
      body:
        "Create, update, and close orders by equipment tag. State is persisted server-side and reflected in the supervisor view.",
    },
    {
      icon: WifiOff,
      title: "Offline-first sync",
      body:
        "Lose connection? Recordings buffer to localStorage and auto-drain to the server when you reconnect.",
    },
    {
      icon: LayoutDashboard,
      title: "Supervisor cockpit",
      body:
        "KPI cards, severity breakdown, work-order pipeline, recent transcripts, and critical alerts — all live.",
    },
  ];

  return (
    <section>
      <SectionEyebrow>Features</SectionEyebrow>
      <SectionTitle>Everything a field tech needs. Nothing else.</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {items.map((it) => (
          <div key={it.title} className="surface rounded-xl p-5">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-zinc-900 border border-zinc-800 mb-3">
              <it.icon className="h-4 w-4 text-zinc-300" />
            </div>
            <h3 className="text-[14px] font-semibold text-zinc-100">
              {it.title}
            </h3>
            <p className="text-[12px] text-zinc-500 leading-relaxed mt-1">
              {it.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Record",
      body:
        "Tap the mic. Speak naturally — duration, equipment tag, observed fault, action taken. Release when done.",
    },
    {
      n: "02",
      title: "Transcribe",
      body:
        "The audio blob is sent to /transcribe → Groq Whisper-large-v3 returns the verbatim text.",
    },
    {
      n: "03",
      title: "Extract",
      body:
        "The transcript hits /extract → Llama-3.3 in JSON mode emits a strict record. Save it with one click.",
    },
    {
      n: "04",
      title: "Ask",
      body:
        "Type or speak any question. RAG over ChromaDB retrieves the top chunks; Llama writes a grounded answer; browser speaks it back.",
    },
  ];

  return (
    <section>
      <SectionEyebrow>How it works</SectionEyebrow>
      <SectionTitle>Four steps from voice to record.</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {steps.map((s) => (
          <div key={s.n} className="surface rounded-xl p-5">
            <div className="font-mono text-[10px] text-accent-400 mb-2">
              {s.n}
            </div>
            <h3 className="text-[14px] font-semibold text-zinc-100">
              {s.title}
            </h3>
            <p className="text-[12px] text-zinc-500 leading-relaxed mt-1">
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Architecture() {
  const stack = [
    { icon: Mic, label: "MediaRecorder", group: "Browser" },
    { icon: Volume2, label: "Web Speech API", group: "Browser" },
    { icon: FileText, label: "FastAPI", group: "Backend" },
    { icon: Database, label: "SQLite", group: "Backend" },
    { icon: Brain, label: "ChromaDB + MiniLM", group: "RAG" },
    { icon: Sparkles, label: "Groq Whisper + Llama 3.3", group: "AI" },
  ];

  return (
    <section>
      <SectionEyebrow>Architecture</SectionEyebrow>
      <SectionTitle>One backend, one frontend, one LLM provider.</SectionTitle>

      <div className="surface rounded-xl p-6 mt-8 overflow-x-auto">
        <pre className="font-mono text-[11px] text-zinc-400 leading-relaxed whitespace-pre min-w-[640px]">
{`        ┌─────────────────────────────┐
        │  Browser (React + Vite)     │
        │  ─ Landing / Worker / Dash  │
        │  ─ MediaRecorder + SpeechSynth │
        └─────────────┬───────────────┘
                      │  fetch /api/*
                      ▼
        ┌─────────────────────────────┐
        │  FastAPI (Python)           │
        │  ─ /transcribe  /extract    │
        │  ─ /query  /inspections     │
        │  ─ /work-orders  /sync      │
        │  ─ /dashboard/stats         │
        └──────┬──────────────┬───────┘
               │              │
        ┌──────▼──────┐ ┌─────▼──────────┐
        │  SQLite     │ │  ChromaDB +    │
        │  (records)  │ │  MiniLM embeds │
        └─────────────┘ └─────┬──────────┘
                              │
                       knowledge_base/  (3 .txt files)

         External: Groq OpenAI-compatible API
          ─ whisper-large-v3        (audio → text)
          ─ llama-3.3-70b-versatile (extract + RAG answer)`}
        </pre>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-5">
        {stack.map((s) => (
          <div
            key={s.label}
            className="surface rounded-md px-3 py-2.5 flex items-center gap-2"
          >
            <s.icon className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wide text-zinc-600">
                {s.group}
              </div>
              <div className="text-[12px] text-zinc-200 font-medium truncate">
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <section className="surface rounded-xl p-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-zinc-100 text-black">
              <Mic className="h-3 w-3" strokeWidth={2.5} />
            </span>
            <span className="text-[14px] font-semibold text-zinc-100">
              VoxOps
            </span>
          </div>
          <p className="text-[12px] text-zinc-500 leading-relaxed">
            Voice-first field intelligence. Built as an end-of-semester project
            for AI Systems.
          </p>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 font-medium mb-2">
            Tech stack
          </div>
          <ul className="text-[12px] text-zinc-300 space-y-1 font-mono">
            <li>React + Vite + TypeScript</li>
            <li>Tailwind + Recharts</li>
            <li>FastAPI + SQLite + ChromaDB</li>
            <li>Groq · Llama 3.3 · Whisper</li>
          </ul>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 font-medium mb-2">
            Links
          </div>
          <ul className="text-[12px] space-y-1">
            <li>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-zinc-50 cursor-pointer"
              >
                <Github className="h-3 w-3" /> GitHub
              </a>
            </li>
            <li>
              <Link
                to="/getting-started"
                className="text-zinc-300 hover:text-zinc-50 cursor-pointer"
              >
                Getting started
              </Link>
            </li>
            <li>
              <Link
                to="/help"
                className="text-zinc-300 hover:text-zinc-50 cursor-pointer"
              >
                Help & FAQ
              </Link>
            </li>
            <li>
              <Link
                to="/sample-data"
                className="text-zinc-300 hover:text-zinc-50 cursor-pointer"
              >
                Sample data
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-zinc-900 flex items-center justify-between text-[11px] font-mono text-zinc-600">
        <span>MIT License</span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="h-3 w-3" />
          no auth · no PII · single tenant
        </span>
      </div>
    </section>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] uppercase tracking-[0.2em] font-medium text-zinc-500 mb-2">
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[26px] sm:text-[30px] font-semibold tracking-tight text-zinc-50 max-w-2xl leading-tight">
      {children}
    </h2>
  );
}
