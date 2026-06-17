import { useState } from "react";
import { ChevronDown, ChevronRight, MessageSquareQuote } from "lucide-react";

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "Why does the mic not record anything?",
    a: (
      <>
        Browser permission. The first time you press the mic, your browser asks
        to access the microphone — say yes. If you previously denied it, open
        site settings, allow microphone, and reload. Safari on iOS has tighter
        rules — Chrome or Edge on desktop work best for the demo.
      </>
    ),
  },
  {
    q: "Why do I see a 503 on transcription?",
    a: (
      <>
        The backend is up but the LLM key is not configured. Set{" "}
        <code className="font-mono text-zinc-300">OPENAI_API_KEY</code> on the
        backend (free Groq key works). Without a key, extraction falls back to
        a regex and Q&amp;A returns the top retrieved chunk verbatim — the rest
        of the app stays functional.
      </>
    ),
  },
  {
    q: "Does it work without internet?",
    a: (
      <>
        Partially. Recordings made offline are stored in{" "}
        <code className="font-mono text-zinc-300">localStorage</code> with a
        placeholder marker (we can't transcribe locally without a Whisper model
        in-browser). When the backend comes back, the queue auto-drains via{" "}
        <code className="font-mono text-zinc-300">/sync</code>. The dashboard,
        work orders, and Q&amp;A also need the backend.
      </>
    ),
  },
  {
    q: "Is my voice data stored?",
    a: (
      <>
        The audio bytes are forwarded to Groq for transcription and not kept on
        disk. The resulting transcript IS persisted in the local SQLite as a{" "}
        <code className="font-mono text-zinc-300">VoiceLog</code> row so the
        supervisor view can show recent activity.
      </>
    ),
  },
  {
    q: "Can I rename or delete an equipment tag?",
    a: (
      <>
        Inspections and work orders carry a free-text{" "}
        <code className="font-mono text-zinc-300">equipment_id</code> (e.g.{" "}
        <code className="font-mono text-zinc-300">P101</code>) — no separate
        equipment table to rename. Work orders are deletable from their row.
        Inspections are immutable for the demo.
      </>
    ),
  },
  {
    q: "Why does the answer voice sound robotic?",
    a: (
      <>
        VoxOps uses the browser's built-in Web Speech API (no cloud TTS, no key,
        no cost). Voice quality varies by OS — macOS and modern Edge sound
        natural; older Linux distros sound flat. You can also hit Stop and just
        read the answer.
      </>
    ),
  },
  {
    q: "Where do queries pull their answers from?",
    a: (
      <>
        Three plain-text files in{" "}
        <code className="font-mono text-zinc-300">
          backend/app/knowledge_base/
        </code>
        :{" "}
        <code className="font-mono text-zinc-300">equipment_manual.txt</code>,{" "}
        <code className="font-mono text-zinc-300">maintenance_procedures.txt</code>
        , and{" "}
        <code className="font-mono text-zinc-300">specifications.txt</code>.
        They are chunked, embedded with MiniLM, and indexed in ChromaDB on
        first run.
      </>
    ),
  },
];

const PHRASES = [
  {
    label: "Log a complete inspection",
    text: '"Inspection complete for Pump P101. Severe vibration detected. Severity high. Replaced bearing. Need two spare bearings."',
  },
  {
    label: "Quick severity update",
    text: '"Critical: V203 bonnet leak detected. Valve isolated."',
  },
  {
    label: "Ask service history",
    text: '"When was Pump P101 serviced last?"',
  },
  {
    label: "Ask spec limits",
    text: '"What is the pressure limit of Valve V203?"',
  },
  {
    label: "Ask procedure",
    text: '"How do I replace filter F22?"',
  },
  {
    label: "Open a work order (typed)",
    text: 'Equipment "P101", Description "Inspect after vibration alarm."',
  },
];

const UI_SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: "Voice Recorder",
    body: (
      <>
        White mic button. Tap once to record, again to stop. While recording,
        a red pulsing ring + REC clock appears. The audio uploads to{" "}
        <code className="font-mono text-zinc-300">/transcribe</code>, the
        transcript fills in, and extraction kicks off automatically.
      </>
    ),
  },
  {
    title: "Transcript",
    body: (
      <>
        Verbatim Whisper output. Long transcripts scroll inside the card.
        Skeleton bars appear while we're still waiting.
      </>
    ),
  },
  {
    title: "Extracted Inspection",
    body: (
      <>
        Strict 5-field JSON: equipment, fault, severity, action, parts. Add an
        optional location and press <em>Save inspection</em>. It posts to{" "}
        <code className="font-mono text-zinc-300">/inspections</code> and the
        supervisor dashboard refreshes within ~15s.
      </>
    ),
  },
  {
    title: "Ask About Equipment",
    body: (
      <>
        Type a question or tap a chip. RAG returns a grounded answer plus
        source filenames. A play/stop button reads the answer aloud via the
        browser's Web Speech API.
      </>
    ),
  },
  {
    title: "Work Orders",
    body: (
      <>
        Create with an equipment tag. Inline dropdown changes status (Open / In
        Progress / Closed). Trash button deletes. Counts and pipeline charts
        update on the dashboard.
      </>
    ),
  },
  {
    title: "Sync Queue",
    body: (
      <>
        Shows online/offline state and the number of buffered transcripts. Use{" "}
        <em>Sync now</em> to force-drain. Auto-drains every 5s while online.
      </>
    ),
  },
  {
    title: "Supervisor Dashboard",
    body: (
      <>
        Three KPI cards (Total inspections, Open work orders, Critical alerts),
        a severity donut, a work-order status bar chart, recent transcripts,
        and a Critical Alerts panel. Refreshes every 15s; <em>Refresh</em>{" "}
        button forces a pull.
      </>
    ),
  },
];

export function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-6">
      <header>
        <div className="text-[10px] uppercase tracking-[0.2em] font-medium text-zinc-500 mb-2">
          Help
        </div>
        <h1 className="text-[32px] font-semibold tracking-tight text-zinc-50">
          What to say, where to click, what each thing does.
        </h1>
        <p className="text-[13px] text-zinc-400 mt-2 max-w-2xl leading-relaxed">
          Bookmark this page during your demo if it's your first time.
        </p>
      </header>

      <Section title="Example phrases">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PHRASES.map((p) => (
            <li key={p.label} className="surface rounded-md p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-zinc-500 font-mono mb-1">
                <MessageSquareQuote className="h-3 w-3" />
                {p.label}
              </div>
              <div className="text-[12px] text-zinc-200 font-mono leading-relaxed">
                {p.text}
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="What every UI section does">
        <div className="space-y-2">
          {UI_SECTIONS.map((u) => (
            <div key={u.title} className="surface rounded-md p-4">
              <div className="text-[13px] font-semibold text-zinc-100 mb-1">
                {u.title}
              </div>
              <div className="text-[12px] text-zinc-400 leading-relaxed">
                {u.body}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Frequently asked">
        <ul className="space-y-2">
          {FAQS.map((f, i) => (
            <FAQItem key={i} q={f.q} a={f.a} />
          ))}
        </ul>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-[18px] font-semibold tracking-tight text-zinc-100 mb-4">
        {title}
      </h2>
      {children}
    </section>
  );
}

function FAQItem({ q, a }: { q: string; a: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="surface rounded-md">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left cursor-pointer hover:bg-zinc-900/40 transition-colors rounded-md"
      >
        <span className="text-[13px] font-medium text-zinc-100">{q}</span>
        {open ? (
          <ChevronDown className="h-4 w-4 text-zinc-500 shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 text-zinc-500 shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-4 pb-4 text-[12px] text-zinc-400 leading-relaxed border-t border-zinc-900 pt-3 animate-fade-in">
          {a}
        </div>
      )}
    </li>
  );
}
