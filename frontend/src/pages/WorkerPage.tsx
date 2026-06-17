import { useState } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { api } from "@/api/endpoints";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { TranscriptCard } from "@/components/TranscriptCard";
import { InspectionCard } from "@/components/InspectionCard";
import { QueryPanel } from "@/components/QueryPanel";
import { WorkOrderCard } from "@/components/WorkOrderCard";
import { SyncQueueCard } from "@/components/SyncQueueCard";
import { useOfflineQueue } from "@/hooks/useOfflineQueue";
import { useToast } from "@/components/ui/toast";
import type { InspectionExtracted } from "@/api/types";

export function WorkerPage() {
  const [transcript, setTranscript] = useState("");
  const [transcribing, setTranscribing] = useState(false);
  const [extracted, setExtracted] = useState<InspectionExtracted | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { pending, online, syncing, enqueue, flush } = useOfflineQueue();
  const { notify } = useToast();

  const handleAudio = async (blob: Blob) => {
    setError(null);
    if (!blob || blob.size < 1024) {
      setError(
        "Recording was too short — try holding the mic for a couple of seconds."
      );
      return;
    }
    setTranscribing(true);
    setTranscript("");
    setExtracted(null);
    try {
      const { transcript: t } = await api.transcribe(blob);
      setTranscript(t);

      setExtracting(true);
      try {
        const x = await api.extract(t);
        setExtracted(x);
      } catch {
        /* best-effort */
      } finally {
        setExtracting(false);
      }
    } catch (e: any) {
      const msg = e?.message || "Transcription failed.";
      if (!online) {
        const stamp = new Date().toISOString();
        enqueue(
          `[offline recording captured ${stamp} — transcription deferred]`
        );
        notify("Saved offline — will sync when online.", "info");
      } else {
        setError(msg);
        notify(msg, "error");
      }
    } finally {
      setTranscribing(false);
    }
  };

  const handleSave = async (
    payload: InspectionExtracted & { location?: string }
  ) => {
    try {
      await api.saveInspection(payload);
      notify("Inspection saved.", "success");
    } catch (e: any) {
      notify(e?.message || "Could not save inspection.", "error");
      throw e;
    }
  };

  return (
    <div className="space-y-10">
      <PageHeader online={online} pending={pending.length} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <VoiceRecorder busy={transcribing} onAudio={handleAudio} />
          <TranscriptCard transcript={transcript} loading={transcribing} />
          <InspectionCard
            data={extracted}
            loading={extracting}
            onSave={handleSave}
          />
          {error && (
            <div className="text-[12px] border border-red-500/30 bg-red-500/5 text-red-300 px-3 py-2.5 rounded-md animate-fade-in">
              {error}
            </div>
          )}
        </div>
        <div className="space-y-6">
          <QueryPanel />
          <WorkOrderCard />
          <SyncQueueCard
            pending={pending}
            online={online}
            syncing={syncing}
            onFlush={flush}
          />
        </div>
      </div>
    </div>
  );
}

function PageHeader({
  online,
  pending,
}: {
  online: boolean;
  pending: number;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <div className="text-xs uppercase tracking-wide font-medium text-zinc-500 mb-3">
          Worker
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-50">
          Speak it. We handle the paperwork.
        </h1>
        <p className="text-sm text-zinc-400 mt-3 max-w-xl leading-relaxed">
          Record an inspection by voice. We transcribe, extract structured
          fields, and answer equipment questions from your manuals.
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <StatusChip
          icon={
            online ? (
              <Wifi className="h-3 w-3" strokeWidth={1.75} />
            ) : (
              <WifiOff className="h-3 w-3" strokeWidth={1.75} />
            )
          }
          label={online ? "online" : "offline"}
          tone={online ? "ok" : "warn"}
        />
        {pending > 0 && (
          <StatusChip
            icon={<span className="h-1.5 w-1.5 rounded-full bg-primary" />}
            label={`${pending} queued`}
            tone="accent"
          />
        )}
      </div>
    </div>
  );
}

function StatusChip({
  icon,
  label,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  tone: "ok" | "warn" | "accent";
}) {
  const styles =
    tone === "ok"
      ? "border-emerald-500/40 text-emerald-400"
      : tone === "warn"
      ? "border-red-500/40 text-red-400"
      : "border-primary/40 text-primary";
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wide px-2 py-1 rounded border ${styles}`}
    >
      {icon}
      {label}
    </span>
  );
}
