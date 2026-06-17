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
      <CardContent className="pt-7 pb-7 flex flex-col items-center gap-5">
        <div className="w-full flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-[0.18em] font-medium text-zinc-500">
            Field capture
          </div>
          <StateLabel state={state} elapsed={`${mm}:${ss}`} />
        </div>

        {/* Mic button */}
        <div className="relative flex items-center justify-center my-3">
          {state === "recording" && (
            <>
              <span className="absolute h-28 w-28 rounded-full border border-rose-500/40 animate-rec-ring" />
              <span
                className="absolute h-28 w-28 rounded-full border border-rose-500/30 animate-rec-ring"
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
                ? "bg-rose-500 hover:bg-rose-400"
                : state === "busy"
                ? "bg-zinc-800 cursor-wait"
                : "bg-zinc-100 hover:bg-white"
            }`}
          >
            {state === "busy" ? (
              <Loader2 className="h-9 w-9 text-zinc-400 animate-spin" />
            ) : state === "recording" ? (
              <Square
                className="h-7 w-7 text-white"
                fill="currentColor"
              />
            ) : (
              <Mic className="h-9 w-9 text-black" strokeWidth={2.5} />
            )}
          </button>
        </div>

        {/* Instruction */}
        <p className="text-[12px] text-zinc-500 text-center max-w-xs leading-relaxed">
          {state === "recording"
            ? "Recording — tap to stop."
            : state === "busy"
            ? "Transcribing…"
            : "Tap the mic. Describe the inspection. We do the rest."}
        </p>

        {error && (
          <div className="flex items-start gap-2 text-[12px] text-rose-300 border border-rose-500/30 bg-rose-500/5 px-3 py-2 rounded-md w-full">
            <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0 text-rose-400" />
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
      <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-rose-400">
        <span className="relative inline-flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75 animate-ping" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-400" />
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
      <span className="h-1.5 w-1.5 rounded-full bg-accent-400 animate-subtle-pulse" />
      ready
    </div>
  );
}
