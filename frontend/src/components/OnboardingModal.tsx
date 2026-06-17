import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { X, Sparkles, Mic, HelpCircle, ArrowRight } from "lucide-react";

const STORAGE_KEY = "voxops.onboarded.v1";

export function OnboardingModal() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Show once, only after the user lands somewhere non-marketing.
    if (location.pathname === "/" || location.pathname.startsWith("/getting-started"))
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
      <div className="relative max-w-md w-full surface rounded-2xl p-6 animate-fade-in-up">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-3 right-3 p-1 rounded-md text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] font-medium text-accent-300 mb-3">
          <Sparkles className="h-3 w-3" />
          Welcome
        </div>

        <h2 className="text-xl font-semibold tracking-tight text-zinc-50">
          Try VoxOps in 30 seconds.
        </h2>
        <p className="text-[13px] text-zinc-400 mt-1.5 leading-relaxed">
          Two voice prompts is all it takes to see what this thing does.
        </p>

        <div className="mt-5 space-y-2.5">
          <Step
            n={1}
            icon={<Mic className="h-3.5 w-3.5 text-rose-400" />}
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
            icon={<HelpCircle className="h-3.5 w-3.5 text-accent-400" />}
            title="Ask the assistant"
            body={
              <span className="italic">"When was Pump P101 serviced last?"</span>
            }
          />
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              dismiss();
              navigate("/getting-started");
            }}
            className="text-[12px] text-zinc-500 hover:text-zinc-200 cursor-pointer"
          >
            Full guide →
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium bg-zinc-100 text-black px-3.5 py-1.5 rounded-md hover:bg-white cursor-pointer"
          >
            Got it
            <ArrowRight className="h-3.5 w-3.5" />
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
    <div className="flex items-start gap-3 rounded-md border border-zinc-800 bg-zinc-950 p-3">
      <span className="font-mono text-[11px] text-zinc-600 mt-0.5">
        0{n}
      </span>
      <div className="flex-1">
        <div className="flex items-center gap-1.5 text-[12px] font-medium text-zinc-200">
          {icon}
          {title}
        </div>
        <div className="text-[12px] text-zinc-400 mt-1 leading-relaxed">
          {body}
        </div>
      </div>
    </div>
  );
}
