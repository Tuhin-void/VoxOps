import { Link } from "react-router-dom";
import {
  Mic,
  ClipboardCheck,
  Save,
  Sparkles,
  Wrench,
  WifiOff,
  ArrowRight,
  CircleCheck,
} from "lucide-react";

export function GettingStartedPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-6">
      <header>
        <div className="text-[10px] uppercase tracking-[0.2em] font-medium text-zinc-500 mb-2">
          Getting started
        </div>
        <h1 className="text-[32px] font-semibold tracking-tight text-zinc-50">
          Two minutes from open-tab to grounded answer.
        </h1>
        <p className="text-[13px] text-zinc-400 mt-2 max-w-2xl leading-relaxed">
          Below is the happy path. Run it once and you'll understand every
          surface in the app.
        </p>
      </header>

      <Section title="Who uses VoxOps">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Persona
            title="Field technician"
            body="On a plant floor. Hands occupied. Needs to log inspections, ask the manual a question, and create a work order — all by voice."
          />
          <Persona
            title="Maintenance supervisor"
            body="At a desk. Wants a real-time view of inspections, severity distribution, open work orders, and critical alerts across the team."
          />
        </div>
      </Section>

      <Section title="Step-by-step workflow">
        <ol className="space-y-3">
          <Step
            n={1}
            icon={<Mic className="h-4 w-4 text-rose-400" />}
            title="Record an inspection"
            body={
              <>
                Open <Code>/worker</Code>. Press the white mic button. Speak
                naturally for a few seconds, then press it again to stop.
              </>
            }
            example='"Inspection complete for Pump P101. Severe vibration detected. Severity high. Replaced bearing. Need two spare bearings."'
          />
          <Step
            n={2}
            icon={<ClipboardCheck className="h-4 w-4 text-zinc-300" />}
            title="Review the extracted fields"
            body={
              <>
                <Code>equipment_id</Code>, <Code>fault_description</Code>,{" "}
                <Code>severity</Code>, <Code>action_taken</Code>, and{" "}
                <Code>parts_required</Code> will appear within a second.
              </>
            }
          />
          <Step
            n={3}
            icon={<Save className="h-4 w-4 text-zinc-300" />}
            title="Save the record"
            body={
              <>
                Add an optional location, then press{" "}
                <Code>Save inspection</Code>. It persists to the backend and
                shows up on the supervisor dashboard.
              </>
            }
          />
          <Step
            n={4}
            icon={<Sparkles className="h-4 w-4 text-accent-400" />}
            title="Ask the manual a question"
            body={
              <>
                Type any equipment question or tap a sample chip. The answer
                streams back with source citations, and your browser reads it
                aloud.
              </>
            }
            example='"When was Pump P101 serviced last?"'
          />
          <Step
            n={5}
            icon={<Wrench className="h-4 w-4 text-amber-300" />}
            title="Manage a work order"
            body={
              <>
                Enter an equipment tag (e.g. <Code>P101</Code>) and a short
                description. Create. Use the inline dropdown to flip status, or
                the trash icon to delete.
              </>
            }
          />
          <Step
            n={6}
            icon={<WifiOff className="h-4 w-4 text-zinc-300" />}
            title="Go offline (optional)"
            body={
              <>
                Kill your network or stop the backend. Recordings buffer to
                localStorage. The sync pill flips red. Reconnect — the queue
                auto-drains.
              </>
            }
          />
        </ol>
      </Section>

      <Section title="Try these phrases">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <PhraseCard
            label="Inspection"
            phrase='"Inspection complete for Valve V203. Severity medium. Cleaned pilot orifice and hydrotested."'
          />
          <PhraseCard
            label="Inspection"
            phrase='"Critical: V203 bonnet leak detected. Valve isolated. Need new gasket."'
          />
          <PhraseCard
            label="Query"
            phrase='"What is the operating pressure of Valve V203?"'
          />
          <PhraseCard
            label="Query"
            phrase='"How do I replace filter F22?"'
          />
        </div>
      </Section>

      <Section title="Screenshots">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ShotCard
            src="/docs-worker.png"
            label="Worker console"
            body="Mic, transcript, extracted fields, Q&A, work orders, sync queue."
          />
          <ShotCard
            src="/docs-dashboard.png"
            label="Supervisor dashboard"
            body="KPI cards, severity donut, status bars, recent transcripts, critical alerts."
          />
        </div>
        <p className="text-[11px] text-zinc-600 mt-3 font-mono">
          Local screenshots live in <Code>docs/screenshots/</Code>.
        </p>
      </Section>

      <div className="surface rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div className="flex items-start gap-3">
          <CircleCheck className="h-5 w-5 text-accent-400 mt-0.5" />
          <div>
            <div className="text-[14px] font-semibold text-zinc-100">
              That's the whole tour.
            </div>
            <div className="text-[12px] text-zinc-500 mt-0.5">
              For specific phrasing, see the Help page. For sample equipment,
              see Sample Data.
            </div>
          </div>
        </div>
        <Link
          to="/worker"
          className="shrink-0 inline-flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-md text-[13px] font-medium hover:bg-primary-hover cursor-pointer"
        >
          Open worker console
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
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

function Persona({ title, body }: { title: string; body: string }) {
  return (
    <div className="surface rounded-3xl p-4">
      <div className="text-[13px] font-semibold text-zinc-100">{title}</div>
      <div className="text-[12px] text-zinc-400 mt-1 leading-relaxed">
        {body}
      </div>
    </div>
  );
}

function Step({
  n,
  icon,
  title,
  body,
  example,
}: {
  n: number;
  icon: React.ReactNode;
  title: string;
  body: React.ReactNode;
  example?: string;
}) {
  return (
    <li className="surface rounded-3xl p-4">
      <div className="flex items-start gap-3">
        <span className="font-mono text-[11px] text-zinc-600 pt-0.5">
          0{n}
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="text-[13px] font-semibold text-zinc-100">
              {title}
            </h3>
          </div>
          <div className="text-[12px] text-zinc-400 mt-1 leading-relaxed">
            {body}
          </div>
          {example && (
            <div className="mt-2 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-[12px] text-zinc-300 font-mono">
              {example}
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

function PhraseCard({ label, phrase }: { label: string; phrase: string }) {
  return (
    <div className="surface rounded-md p-3">
      <div className="text-[10px] uppercase tracking-wide text-zinc-500 font-mono mb-1">
        {label}
      </div>
      <div className="text-[12px] text-zinc-200 font-mono leading-relaxed">
        {phrase}
      </div>
    </div>
  );
}

function ShotCard({
  src,
  label,
  body,
}: {
  src: string;
  label: string;
  body: string;
}) {
  return (
    <div className="surface rounded-3xl overflow-hidden">
      <div className="aspect-[16/10] bg-zinc-950 border-b border-zinc-900 flex items-center justify-center">
        <img
          src={src}
          alt={label}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      </div>
      <div className="p-3">
        <div className="text-[12px] font-semibold text-zinc-100">{label}</div>
        <div className="text-[11px] text-zinc-500 mt-0.5">{body}</div>
      </div>
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-[11px] px-1 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
      {children}
    </code>
  );
}
