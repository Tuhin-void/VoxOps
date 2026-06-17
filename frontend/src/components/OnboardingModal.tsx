import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { X, Mic, HelpCircle, ArrowRight } from "lucide-react";

const STORAGE_KEY = "voxops.onboarded.v1";

export function OnboardingModal() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      location.pathname === "/" ||
      location.pathname.startsWith("/getting-started")
    )
      return;
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        const t = window.setTimeout(() => setOpen(true), 400);
        return () => window.clearTimeout(t);
      }
    } catch {
      /* localStorage unavailable */
    }
  }, [location.pathname]);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <button
        type="button"
        aria-label="Dismiss"
        onClick={dismiss}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
      />
      <div className="relative max-w-md w-full bg-surface border border-hairline rounded-3xl p-7 animate-fade-in">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-4 right-4 p-1 rounded-md text-zinc-500 hover:text-zinc-200 hover:bg-canvas transition-colors cursor-pointer"
        >
          <X strokeWidth={1.75} className="h-4 w-4" />
        </button>

        <div className="text-xs uppercase tracking-wide font-medium text-primary mb-3">
          Welcome
        </div>

        <h2 className="text-2xl font-semibold tracking-tight text-zinc-50">
          Try VoxOps in 30 seconds.
        </h2>
        <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
          Two voice prompts is all it takes to see what this thing does.
        </p>

        <div className="mt-6 space-y-2.5">
          <Step
            n={1}
            icon={<Mic strokeWidth={1.75} className="h-4 w-4 text-red-400" />}
            title="Record an inspection"
            body={
              <span className="italic">
                "Inspection complete for Pump P101. Severe vibration detected.
                Severity high. Replaced bearing."
              </span>
            }
          />
          <Step
            n={2}
            icon={
              <HelpCircle strokeWidth={1.75} className="h-4 w-4 text-primary" />
            }
            title="Ask the assistant"
            body={
              <span className="italic">"When was Pump P101 serviced last?"</span>
            }
          />
        </div>

        <div className="mt-7 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              dismiss();
              navigate("/getting-started");
            }}
            className="text-xs text-zinc-500 hover:text-zinc-200 cursor-pointer transition-colors"
          >
            Full guide →
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover transition-colors cursor-pointer"
          >
            Got it
            <ArrowRight strokeWidth={1.75} className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Step({
  n,
  icon,
  title,
  body,
}: {
  n: number;
  icon: React.ReactNode;
  title: string;
  body: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-hairline bg-canvas p-3.5">
      <span className="font-mono text-[11px] text-zinc-600 mt-0.5">0{n}</span>
      <div className="flex-1">
        <div className="flex items-center gap-1.5 text-sm font-medium text-zinc-100">
          {icon}
          {title}
        </div>
        <div className="text-sm text-zinc-400 mt-1 leading-relaxed">{body}</div>
      </div>
    </div>
  );
}
