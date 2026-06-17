import { useEffect, useRef, useState } from "react";
import { Mic, Square, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useRecorder } from "@/hooks/useRecorder";

interface Props {
  busy: boolean;
  onAudio: (blob: Blob) => Promise<void> | void;
}

export function VoiceRecorder({ busy, onAudio }: Props) {
  const { recording, error, start, stop } = useRecorder();
  const [elapsed, setElapsed] = useState(0);
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    if (!recording) {
      setElapsed(0);
      startedAt.current = null;
      return;
    }
    startedAt.current = Date.now();
    const id = window.setInterval(() => {
      if (startedAt.current) {
        setElapsed(Math.floor((Date.now() - startedAt.current) / 1000));
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [recording]);

  const handleClick = async () => {
    if (recording) {
      const blob = await stop();
      if (blob) await onAudio(blob);
    } else {
      await start();
    }
  };

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  const state: "idle" | "recording" | "busy" = busy
    ? "busy"
    : recording
    ? "recording"
    : "idle";

  return (
    <Card>
      <CardContent className="pt-8 pb-8 flex flex-col items-center gap-6">
        <div className="w-full flex items-center justify-between">
          <div className="text-xs uppercase tracking-wide font-medium text-zinc-500">
            Field capture
          </div>
          <StateLabel state={state} elapsed={`${mm}:${ss}`} />
        </div>

        <div className="relative flex items-center justify-center my-3">
          {state === "recording" && (
            <>
              <span className="absolute h-28 w-28 rounded-full border border-red-500/40 animate-rec-ring" />
              <span
                className="absolute h-28 w-28 rounded-full border border-red-500/30 animate-rec-ring"
                style={{ animationDelay: "0.5s" }}
              />
            </>
          )}

          <button
            onClick={handleClick}
            disabled={busy}
            aria-label={recording ? "Stop recording" : "Start recording"}
            className={`relative flex h-24 w-24 items-center justify-center rounded-full transition-colors cursor-pointer ${
              state === "recording"
                ? "bg-red-500 hover:bg-red-400"
                : state === "busy"
                ? "bg-zinc-800 cursor-wait"
                : "bg-primary hover:bg-primary-hover"
            }`}
          >
            {state === "busy" ? (
              <Loader2 strokeWidth={1.75} className="h-9 w-9 text-zinc-300 animate-spin" />
            ) : state === "recording" ? (
              <Square
                className="h-6 w-6 text-white"
                fill="currentColor"
              />
            ) : (
              <Mic className="h-9 w-9 text-white" strokeWidth={1.75} />
            )}
          </button>
        </div>

        <p className="text-sm text-zinc-500 text-center max-w-xs leading-relaxed">
          {state === "recording"
            ? "Recording — tap to stop."
            : state === "busy"
            ? "Transcribing…"
            : "Tap the mic. Describe the inspection. We do the rest."}
        </p>

        {error && (
          <div className="flex items-start gap-2 text-[12px] text-red-300 border border-red-500/30 bg-red-500/5 px-3 py-2 rounded-md w-full">
            <AlertCircle strokeWidth={1.75} className="h-4 w-4 mt-px shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StateLabel({
  state,
  elapsed,
}: {
  state: "idle" | "recording" | "busy";
  elapsed: string;
}) {
  if (state === "recording") {
    return (
      <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-red-400">
        <span className="relative inline-flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-400" />
        </span>
        REC {elapsed}
      </div>
    );
  }
  if (state === "busy") {
    return (
      <div className="text-[11px] font-mono font-medium text-zinc-400">
        processing
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-zinc-500">
      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-subtle-pulse" />
      ready
    </div>
  );
}
