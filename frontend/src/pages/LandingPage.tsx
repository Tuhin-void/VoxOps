import { Link } from "react-router-dom";
import {
  Mic,
  Sparkles,
  Wrench,
  WifiOff,
  LayoutDashboard,
  ArrowRight,
  Github,
  Brain,
  ShieldCheck,
} from "lucide-react";

const GITHUB_URL = "https://github.com/Tuhin-void/VoxOps";

export function LandingPage() {
  return (
    <div className="space-y-28 py-8">
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
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wide font-medium text-primary mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-subtle-pulse" />
          Voice-first · field intelligence
        </div>
        <h1 className="text-5xl sm:text-7xl font-semibold tracking-[-0.02em] text-zinc-50 leading-[1.05]">
          VoxOps
        </h1>
        <p className="text-xl sm:text-2xl font-medium text-zinc-300 mt-4 leading-snug max-w-2xl">
          Voice-First AI Assistant for Field Workers.
        </p>
        <p className="text-base text-zinc-500 mt-5 leading-relaxed max-w-xl">
          Hands-free inspections, equipment queries, and work-order management
          powered by AI. Speak naturally — VoxOps transcribes, extracts
          structured records, answers questions from your manuals, and keeps
          working when the signal drops.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            to="/worker"
            className="inline-flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-md text-[13px] font-medium hover:bg-primary-hover transition-colors cursor-pointer"
          >
            <Mic strokeWidth={1.75} className="h-3.5 w-3.5" />
            Launch Demo
            <ArrowRight strokeWidth={1.75} className="h-3.5 w-3.5" />
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 border border-hairline text-zinc-200 px-4 py-2 rounded-md text-[13px] font-medium hover:bg-surface hover:border-zinc-700 transition-colors cursor-pointer"
          >
            <LayoutDashboard strokeWidth={1.75} className="h-3.5 w-3.5" />
            View Dashboard
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 text-[13px] text-zinc-500 hover:text-zinc-200 px-2 py-2 transition-colors cursor-pointer"
          >
            <Github strokeWidth={1.75} className="h-3.5 w-3.5" />
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
        {items.map((it) => (
          <div key={it.title} className="surface rounded-3xl p-6">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-canvas border border-hairline mb-4">
              <it.icon strokeWidth={1.75} className="h-4 w-4 text-zinc-300" />
            </div>
            <h3 className="text-base font-semibold text-zinc-50">
              {it.title}
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed mt-2">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
        {steps.map((s) => (
          <div key={s.n} className="surface rounded-3xl p-6">
            <div className="font-mono text-[10px] text-primary mb-3">
              {s.n}
            </div>
            <h3 className="text-base font-semibold text-zinc-50">
              {s.title}
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed mt-2">
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Architecture() {
  return (
    <section>
      <SectionEyebrow>Architecture</SectionEyebrow>
      <SectionTitle>One backend, one frontend, one LLM provider.</SectionTitle>
      <p className="text-sm text-zinc-400 mt-4 max-w-xl leading-relaxed">
        How a voice prompt travels from a glove-on field tech to a grounded
        answer — five layers, four hops.
      </p>

      <div className="mt-12 mx-auto max-w-[1200px] flex flex-col items-center">
        <ArchNode
          title="Browser"
          subtitle="React + Vite"
          detail="MediaRecorder · Web Speech API"
        />
        <Connector />

        <ArchNode
          title="FastAPI"
          subtitle="Python backend"
          detail="/transcribe · /extract · /query · /work-orders"
        />

        <BranchOut />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
          <ArchNode title="SQLite" subtitle="Records" />
          <ArchNode title="ChromaDB" subtitle="MiniLM embeddings" />
        </div>

        <BranchIn />

        <ArchNode
          title="Knowledge Base"
          subtitle="3 plain-text manuals"
          detail="equipment · maintenance · specs"
        />

        <Connector />

        <ArchNode
          title="Groq"
          subtitle="OpenAI-compatible API"
          detail="whisper-large-v3 · llama-3.3-70b-versatile"
          highlight
        />
      </div>
    </section>
  );
}

function ArchNode({
  title,
  subtitle,
  detail,
  highlight,
}: {
  title: string;
  subtitle?: string;
  detail?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border bg-zinc-900 px-7 py-5 min-w-[240px] text-center transition-colors ${
        highlight ? "border-primary/50" : "border-zinc-800"
      }`}
    >
      <div className="font-mono text-sm font-medium text-zinc-100">{title}</div>
      {subtitle && (
        <div className="font-mono text-xs text-zinc-500 mt-1">{subtitle}</div>
      )}
      {detail && (
        <div className="font-mono text-[11px] text-zinc-600 mt-2 leading-relaxed">
          {detail}
        </div>
      )}
    </div>
  );
}

function Connector() {
  return <div className="my-3 h-10 w-px bg-primary/60" aria-hidden />;
}

// Visual fork: one line in, two lines out. Collapses to a plain connector on mobile.
function BranchOut() {
  return (
    <>
      <div
        className="relative w-full max-w-2xl h-12 my-3 hidden sm:block"
        aria-hidden
      >
        <span className="absolute left-1/2 top-0 h-6 w-px bg-primary/60 -translate-x-1/2" />
        <span className="absolute left-1/4 right-1/4 top-6 h-px bg-primary/60" />
        <span className="absolute left-1/4 top-6 h-6 w-px bg-primary/60 -translate-x-1/2" />
        <span className="absolute right-1/4 top-6 h-6 w-px bg-primary/60 translate-x-1/2" />
      </div>
      <div className="my-3 h-10 w-px bg-primary/60 sm:hidden" aria-hidden />
    </>
  );
}

// Visual merge: two lines in, one line out. Collapses on mobile.
function BranchIn() {
  return (
    <>
      <div
        className="relative w-full max-w-2xl h-12 my-3 hidden sm:block"
        aria-hidden
      >
        <span className="absolute left-1/4 top-0 h-6 w-px bg-primary/60 -translate-x-1/2" />
        <span className="absolute right-1/4 top-0 h-6 w-px bg-primary/60 translate-x-1/2" />
        <span className="absolute left-1/4 right-1/4 top-6 h-px bg-primary/60" />
        <span className="absolute left-1/2 top-6 h-6 w-px bg-primary/60 -translate-x-1/2" />
      </div>
      <div className="my-3 h-10 w-px bg-primary/60 sm:hidden" aria-hidden />
    </>
  );
}

function Footer() {
  return (
    <section className="surface rounded-3xl p-7">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-zinc-50 text-black">
              <Mic className="h-3 w-3" strokeWidth={2.25} />
            </span>
            <span className="text-base font-semibold text-zinc-50">
              VoxOps
            </span>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Voice-first field intelligence. Built as an end-of-semester project
            for AI Systems.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-zinc-500 font-medium mb-3">
            Tech stack
          </div>
          <ul className="text-[12px] text-zinc-300 space-y-1.5 font-mono">
            <li>React + Vite + TypeScript</li>
            <li>Tailwind + Recharts</li>
            <li>FastAPI + SQLite + ChromaDB</li>
            <li>Groq · Llama 3.3 · Whisper</li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-zinc-500 font-medium mb-3">
            Links
          </div>
          <ul className="text-sm space-y-1.5">
            <li>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-zinc-50 cursor-pointer transition-colors"
              >
                <Github strokeWidth={1.75} className="h-3 w-3" /> GitHub
              </a>
            </li>
            <li>
              <Link
                to="/getting-started"
                className="text-zinc-300 hover:text-zinc-50 cursor-pointer transition-colors"
              >
                Getting started
              </Link>
            </li>
            <li>
              <Link
                to="/help"
                className="text-zinc-300 hover:text-zinc-50 cursor-pointer transition-colors"
              >
                Help & FAQ
              </Link>
            </li>
            <li>
              <Link
                to="/sample-data"
                className="text-zinc-300 hover:text-zinc-50 cursor-pointer transition-colors"
              >
                Sample data
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-7 pt-5 border-t border-hairline flex items-center justify-between text-[11px] font-mono text-zinc-600">
        <span>MIT License</span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck strokeWidth={1.75} className="h-3 w-3" />
          no auth · no PII · single tenant
        </span>
      </div>
    </section>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs uppercase tracking-wide font-medium text-zinc-500 mb-3">
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-50 max-w-2xl leading-tight">
      {children}
    </h2>
  );
}
