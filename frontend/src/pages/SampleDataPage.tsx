import { Link } from "react-router-dom";
import {
  Gauge,
  Settings,
  Filter,
  ClipboardList,
  Wrench,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface Equipment {
  tag: string;
  name: string;
  icon: typeof Gauge;
  description: string;
  specs: { label: string; value: string }[];
  history: { date: string; event: string }[];
  workOrders: { id: string; status: string; description: string }[];
  questions: string[];
}

const EQUIPMENT: Equipment[] = [
  {
    tag: "P101",
    name: "Centrifugal Pump",
    icon: Gauge,
    description:
      "Primary feed pump in the secondary loop. Runs 24/7 at design point. Source of vibration-related field reports — bearings every 4000 hours.",
    specs: [
      { label: "Rated flow", value: "120 m³/h" },
      { label: "Discharge head", value: "85 m" },
      { label: "Motor", value: "55 kW @ 2950 rpm" },
      { label: "Bearing service", value: "every 4000 hrs" },
    ],
    history: [
      { date: "2026-04-12", event: "Bearings replaced, oil change, seal inspected" },
      { date: "2025-12-08", event: "Vibration alarm — coupling realigned" },
      { date: "2025-08-30", event: "Routine: oil sample analyzed, all readings within limits" },
    ],
    workOrders: [
      { id: "#001", status: "Open", description: "Replace bonnet gasket — leakage reported" },
      { id: "#004", status: "Closed", description: "Bearing replacement after vibration alarm" },
    ],
    questions: [
      "When was Pump P101 serviced last?",
      "What is the bearing replacement interval for P101?",
      "What flow does P101 deliver at design point?",
    ],
  },
  {
    tag: "V203",
    name: "Control Valve",
    icon: Settings,
    description:
      "Pilot-operated control valve on the steam header. Designed for tight shutoff. Recent reports mention chatter and a bonnet leak.",
    specs: [
      { label: "Body rating", value: "ANSI 600" },
      { label: "Operating pressure", value: "42 bar" },
      { label: "Max temp", value: "385 °C" },
      { label: "Trim", value: "Stellite-faced" },
    ],
    history: [
      { date: "2026-05-02", event: "Pilot orifice cleaned, hydrotested" },
      { date: "2026-02-19", event: "Bonnet leak — gasket replaced" },
      { date: "2025-11-11", event: "Trim inspection — within tolerance" },
    ],
    workOrders: [
      { id: "#002", status: "In Progress", description: "Pilot orifice cleaning and hydrotest" },
    ],
    questions: [
      "What is the operating pressure of Valve V203?",
      "What's V203's body pressure rating?",
      "How do I hydrotest V203 after a pilot service?",
    ],
  },
  {
    tag: "F22",
    name: "Inline Filter",
    icon: Filter,
    description:
      "Coarse particulate filter upstream of V203. Differential pressure is the main wear indicator. Cartridge swap is a 10-minute job.",
    specs: [
      { label: "Cartridge", value: "10 µm pleated" },
      { label: "Clean ΔP", value: "0.2 bar" },
      { label: "Change-out ΔP", value: "1.0 bar" },
      { label: "Service interval", value: "quarterly" },
    ],
    history: [
      { date: "2026-04-30", event: "Differential pressure rising — cartridge swap scheduled" },
      { date: "2026-01-15", event: "Quarterly cartridge replacement" },
      { date: "2025-10-12", event: "Quarterly cartridge replacement" },
    ],
    workOrders: [
      { id: "#003", status: "Open", description: "Replace filter cartridge" },
    ],
    questions: [
      "How do I replace filter F22?",
      "What is F22's change-out differential pressure?",
      "How often is F22 scheduled for service?",
    ],
  },
];

export function SampleDataPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-10 py-6">
      <header>
        <div className="text-[10px] uppercase tracking-[0.2em] font-medium text-zinc-500 mb-2">
          Sample data
        </div>
        <h1 className="text-[32px] font-semibold tracking-tight text-zinc-50">
          The three pieces of equipment in this demo.
        </h1>
        <p className="text-[13px] text-zinc-400 mt-2 max-w-2xl leading-relaxed">
          Use these tags when you speak or type — the knowledge base, sample
          inspections, and work orders all reference them. They're seeded into
          SQLite by <code className="font-mono text-zinc-300">python -m app.seed</code>.
        </p>
      </header>

      <div className="space-y-6">
        {EQUIPMENT.map((eq) => (
          <EquipmentCard key={eq.tag} eq={eq} />
        ))}
      </div>

      <div className="surface rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div>
          <div className="text-[14px] font-semibold text-zinc-100">
            Pick a tag and go.
          </div>
          <div className="text-[12px] text-zinc-500 mt-0.5">
            Try voicing one of the example phrases. The system will react in
            real time.
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

function EquipmentCard({ eq }: { eq: Equipment }) {
  return (
    <article className="surface rounded-3xl p-5">
      <header className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-zinc-900 border border-zinc-800">
            <eq.icon className="h-4 w-4 text-zinc-300" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-semibold text-zinc-100">
                {eq.name}
              </h2>
              <span className="font-mono text-[12px] text-primary bg-primary/10 border border-primary/40 px-1.5 py-0.5 rounded">
                {eq.tag}
              </span>
            </div>
            <p className="text-[12px] text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              {eq.description}
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Block title="Specs" icon={<Settings className="h-3 w-3" />}>
          <dl className="space-y-1.5">
            {eq.specs.map((s) => (
              <div
                key={s.label}
                className="flex items-baseline justify-between gap-3 text-[12px]"
              >
                <dt className="text-zinc-500">{s.label}</dt>
                <dd className="font-mono text-zinc-200">{s.value}</dd>
              </div>
            ))}
          </dl>
        </Block>

        <Block title="History" icon={<ClipboardList className="h-3 w-3" />}>
          <ol className="space-y-2">
            {eq.history.map((h) => (
              <li key={h.date} className="text-[12px]">
                <div className="font-mono text-[11px] text-zinc-500">
                  {h.date}
                </div>
                <div className="text-zinc-300 leading-snug">{h.event}</div>
              </li>
            ))}
          </ol>
        </Block>

        <Block title="Open / past work orders" icon={<Wrench className="h-3 w-3" />}>
          <ul className="space-y-1.5">
            {eq.workOrders.map((w) => (
              <li
                key={w.id}
                className="flex items-start justify-between gap-2 text-[12px]"
              >
                <span className="text-zinc-300 leading-snug">
                  <span className="font-mono text-zinc-500 mr-1">{w.id}</span>
                  {w.description}
                </span>
                <StatusPill status={w.status} />
              </li>
            ))}
          </ul>
        </Block>
      </div>

      <div className="mt-5 pt-4 border-t border-zinc-900">
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-zinc-500 font-mono mb-2">
          <Sparkles className="h-3 w-3 text-primary" />
          Try asking
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {eq.questions.map((q) => (
            <li
              key={q}
              className="text-[12px] text-zinc-300 font-mono bg-zinc-950 border border-zinc-800 rounded-md px-2.5 py-1.5"
            >
              "{q}"
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function Block({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-zinc-900 bg-black/30 p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-zinc-500 font-medium mb-2">
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const tone =
    status.toLowerCase() === "closed"
      ? "border-zinc-800 text-zinc-500"
      : status.toLowerCase() === "in progress"
      ? "border-amber-500/30 text-amber-400"
      : "border-primary/40 text-primary";
  return (
    <span
      className={`shrink-0 font-mono text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded border ${tone}`}
    >
      {status}
    </span>
  );
}
